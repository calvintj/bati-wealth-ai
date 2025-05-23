import axios from "axios";
import { logger } from "@/utils/logger";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds
});

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

    logger.error("API response error", {
      status: error.response?.status,
      url: originalRequest?.url,
      method: originalRequest?.method,
      error: error.message,
    });

    return Promise.reject(error);
  }
);

export default api;
