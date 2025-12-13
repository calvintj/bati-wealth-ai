import axios from "axios";
import { logger } from "@/utils/logger";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds
});

// Track recent error messages to prevent duplicates
const recentErrors = new Map<string, number>();
const ERROR_DEDUP_WINDOW = 5000; // 5 seconds - increased to prevent duplicates

// Expose recentErrors to window for ProtectedRoute to use
if (typeof window !== "undefined") {
  (window as any).__recentErrorsMap = recentErrors;
}

// Track if admin access error was shown (to prevent duplicates from ProtectedRoute)
const getAdminErrorShown = (): boolean => {
  if (typeof window === "undefined") return false;
  const shown = (window as any).__adminErrorShown;
  const timestamp = (window as any).__adminErrorTimestamp;
  if (!shown || !timestamp) return false;
  // Check if it was shown within last 10 seconds
  return (Date.now() - timestamp) < 10000;
};

// Helper to check if error message was recently shown
const shouldShowError = (errorMessage: string): boolean => {
  const now = Date.now();
  const lastShown = recentErrors.get(errorMessage);
  
  // Check if this is an admin access error
  const isAdminAccessError = errorMessage.includes("Role admin diperlukan") || 
                             errorMessage.includes("admin role required") ||
                             errorMessage.includes("Akses ditolak. Role admin");
  
  if (isAdminAccessError) {
    // NEVER show admin access errors - ProtectedRoute ALWAYS handles them
    // Return false immediately, regardless of route or flag
    return false;
  }
  
  if (!lastShown || now - lastShown > ERROR_DEDUP_WINDOW) {
    recentErrors.set(errorMessage, now);
    // Clean up old entries (older than 10 seconds)
    for (const [msg, timestamp] of recentErrors.entries()) {
      if (now - timestamp > 10000) {
        recentErrors.delete(msg);
      }
    }
    return true;
  }
  return false;
};

// Function to check token expiration and show warning
const checkTokenExpiration = () => {
  // Only run on client side
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;

    // If less than 5 minutes until expiration, show warning
    if (timeUntilExpiration < 5 * 60 * 1000) {
      const minutesLeft = Math.ceil(timeUntilExpiration / (60 * 1000));
      logger.warn("Session expiring soon", { minutesLeft });

      // Show warning and automatically redirect to login when time is up
      alert(
        `Your session will expire in ${minutesLeft} minutes. Please save your work and log in again.`
      );

      // If less than 1 minute, redirect to login
      if (timeUntilExpiration < 60 * 1000) {
        logger.info("Session expired, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  } catch (error) {
    logger.error("Error checking token expiration", { error });
  }
};

// Only set up the interval on client side
if (typeof window !== "undefined") {
  // Check token expiration every minute
  setInterval(checkTokenExpiration, 60 * 1000);
}

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Only add token on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    logger.error("API request error", { error });
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      logger.warn("Unauthorized API request", {
        url: originalRequest.url,
        method: originalRequest.method,
      });

      // Clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    // Handle 403 Forbidden (Permission Denied)
    if (error.response?.status === 403) {
      // Get error message FIRST to check its content
      const errorMessage =
        error.response?.data?.error ||
        "Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini. Silakan hubungi administrator Anda jika Anda memerlukan akses.";

      // ABSOLUTE PRIORITY: Check for admin access error - ALWAYS skip, NO EXCEPTIONS
      // ProtectedRoute is the ONLY source that should show "Akses ditolak. Role admin diperlukan."
      // Check for exact match first, then partial matches - this must be FIRST and UNCONDITIONAL
      const exactMatch = errorMessage === "Akses ditolak. Role admin diperlukan." ||
                        errorMessage.trim() === "Akses ditolak. Role admin diperlukan.";
      const partialMatch = errorMessage.includes("Role admin diperlukan") || 
                           errorMessage.includes("admin role required") ||
                           errorMessage.includes("Akses ditolak. Role admin");
      
      if (exactMatch || partialMatch) {
        // NEVER show admin access errors - ProtectedRoute ALWAYS handles them
        // Return immediately without showing toast, logging, or any processing
        // This is the ONLY place that should handle admin access errors
        return Promise.reject(error);
      }

      // CRITICAL: Check if we're on admin route - ALWAYS skip ALL 403 errors on admin route
      // ProtectedRoute handles all errors for admin route access
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isAdminRoute = currentPath === "/admin" || currentPath.startsWith("/admin");
        
        if (isAdminRoute) {
          // NEVER show ANY 403 errors on admin route - ProtectedRoute handles it
          return Promise.reject(error);
        }
      }

      // CRITICAL: Check flag - if ProtectedRoute already showed admin error, skip immediately
      if (typeof window !== "undefined" && getAdminErrorShown()) {
        // ProtectedRoute already handled it - don't show duplicate
        return Promise.reject(error);
      }

      // Show user-friendly error message only if not recently shown (prevent duplicates)
      if (typeof window !== "undefined" && shouldShowError(errorMessage)) {
        toast.error("Kesalahan", {
          description: errorMessage,
          duration: 5000,
        });
      }

      logger.warn("Permission denied", {
        url: originalRequest.url,
        method: originalRequest.method,
        error: errorMessage,
      });
    }

    // Safely serialize error data - only log if we have meaningful information
    // Skip logging for 403 errors (already handled above with toast)
    if (error.response?.status === 403) {
      // Permission errors are already logged above, skip duplicate logging
      return Promise.reject(error);
    }

    // Skip logging for 401 errors (already handled above)
    if (error.response?.status === 401) {
      return Promise.reject(error);
    }

    // Only log other errors with meaningful data
    try {
      const errorData: Record<string, any> = {};
      let hasData = false;

      if (error.response) {
        errorData.status = error.response.status;
        errorData.statusText = error.response.statusText;
        hasData = true;

        if (error.response.data) {
          try {
            errorData.data =
              typeof error.response.data === "string"
                ? error.response.data
                : JSON.stringify(error.response.data);
          } catch (e) {
            errorData.data = String(error.response.data);
          }
        }
      }

      if (originalRequest?.url) {
        errorData.url = originalRequest.url;
        hasData = true;
      }

      if (originalRequest?.method) {
        errorData.method = originalRequest.method;
        hasData = true;
      }

      if (error.message) {
        errorData.error = error.message;
        hasData = true;
      }

      // Only log if we have meaningful data
      if (hasData && Object.keys(errorData).length > 0) {
        logger.error("API response error", errorData);
      }
      // If no meaningful data, don't log empty object
    } catch (logError) {
      // Only log fallback if we have at least an error message
      if (error.message) {
        logger.error("API response error", {
          message: error.message,
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
