import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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
          router.push("/dashboard-overview");
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
