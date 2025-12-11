import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import api from "@/services/api";

export interface PagePermissions {
  can_view: boolean;
  can_add: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_download: boolean;
  page_path: string;
}

/**
 * Hook to get current user's permissions for the current page
 */
export const usePagePermissions = () => {
  const pathname = usePathname();
  const [permissions, setPermissions] = useState<PagePermissions>({
    can_view: false,
    can_add: false,
    can_update: false,
    can_delete: false,
    can_download: false,
    page_path: pathname || "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!pathname) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if user is admin (from localStorage)
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.role === "admin") {
              // Admin has all permissions
              setPermissions({
                can_view: true,
                can_add: true,
                can_update: true,
                can_delete: true,
                can_download: true,
                page_path: pathname,
              });
              setLoading(false);
              return;
            }
          } catch (e) {
            // Continue to fetch permissions
          }
        }

        // Fetch permissions from API
        // Remove leading slash if present and encode the pathname
        const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
        const encodedPath = encodeURIComponent(cleanPath);
        const response = await api.get(`/permissions/check/${encodedPath}`);
        console.log("Fetching permissions for path:", pathname, "clean:", cleanPath, "encoded:", encodedPath);
        console.log("Permission response:", response.data);
        setPermissions(response.data);
      } catch (err: unknown) {
        console.error("Error fetching permissions:", err);
        setError("Failed to fetch permissions");
        // Default to no permissions on error
        setPermissions({
          can_view: false,
          can_add: false,
          can_update: false,
          can_delete: false,
          can_download: false,
          page_path: pathname || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [pathname]);

  return {
    permissions,
    loading,
    error,
    canView: permissions.can_view,
    canAdd: permissions.can_add,
    canUpdate: permissions.can_update,
    canDelete: permissions.can_delete,
    canDownload: permissions.can_download,
  };
};

