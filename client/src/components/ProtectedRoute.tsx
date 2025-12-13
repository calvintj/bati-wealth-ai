import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Global flag to prevent duplicate admin errors (persists across component lifecycles)
let adminErrorShownGlobal = false;

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const errorShownRef = useRef(false); // Prevent duplicate errors in React Strict Mode

  useEffect(() => {
    // Prevent duplicate error messages (React Strict Mode runs effects twice)
    // Check both ref and global flag
    if (errorShownRef.current || adminErrorShownGlobal) {
      return;
    }

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(userStr);

      // Handle admin-specific logic
      if (requireAdmin) {
        // If admin access is required but user is not admin
        if (user.role !== "admin") {
          const errorMessage = "Akses ditolak. Role admin diperlukan.";
          
          // Mark that we've shown admin error FIRST (synchronously, before any API calls)
          // This prevents API interceptor from showing duplicate errors
          // Set global flag immediately to prevent any race conditions
          adminErrorShownGlobal = true;
          
          if (typeof window !== "undefined") {
            (window as any).__adminErrorShown = true;
            (window as any).__adminErrorTimestamp = Date.now();
            // Also set a flag to prevent any API calls on admin route
            (window as any).__adminRouteBlocked = true;
            // Also track in recentErrors map (used by API interceptor)
            if ((window as any).__recentErrorsMap) {
              (window as any).__recentErrorsMap.set(errorMessage, Date.now());
            }
          }
          
          // Mark that we've shown the error to prevent duplicates (React Strict Mode)
          errorShownRef.current = true;
          
          // Show error message
          toast.error("Kesalahan", {
            description: errorMessage,
            duration: 5000,
          });
          
          // Small delay before redirect to ensure toast is visible
          setTimeout(() => {
            router.push("/dashboard-overview");
          }, 100);
          return;
        }
      } else {
        // If user is admin and trying to access non-admin pages (like dashboard-overview)
        if (user.role === "admin" && pathname === "/dashboard-overview") {
          router.push("/admin");
          return;
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/");
    }
  }, [router, requireAdmin, pathname]);

  // Check if user is authenticated before rendering
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return null; // or loading spinner
  }

  // For admin routes, check if user is admin
  if (requireAdmin) {
    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        return null; // or loading spinner
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  return <>{children}</>;
};
