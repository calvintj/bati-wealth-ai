import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  permissionsService,
  Page,
  UserWithPermissions,
  UserPermissionWithPage,
} from "@/services/permissions/permissions-api";

export const usePermissions = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [usersWithPermissions, setUsersWithPermissions] = useState<
    UserWithPermissions[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all pages
  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await permissionsService.getPages();
      setPages(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch pages";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users with permissions
  const fetchUsersWithPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await permissionsService.getUsersWithPermissions();
      setUsersWithPermissions(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch users with permissions";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update user permission for a specific page
  const updateUserPermission = async (
    rm_account_id: number,
    page_id: number,
    permissions: {
      can_view: boolean;
      can_add: boolean;
      can_update: boolean;
      can_delete: boolean;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);
      await permissionsService.updateUserPermission(rm_account_id, page_id, {
        ...permissions,
        can_download: true, // Always true for backward compatibility
      });
      toast.success("Permission updated successfully");
      // Refresh users with permissions
      await fetchUsersWithPermissions();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update permission";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Bulk update user permissions
  const bulkUpdateUserPermissions = async (
    rm_account_id: number,
    permissions: Array<{
      page_id: number;
      can_view: boolean;
      can_add: boolean;
      can_update: boolean;
      can_delete: boolean;
    }>
  ) => {
    try {
      setLoading(true);
      setError(null);
      await permissionsService.bulkUpdateUserPermissions(
        rm_account_id,
        permissions.map((perm) => ({
          ...perm,
          can_download: true, // Always true for backward compatibility
        }))
      );
      toast.success("Permissions updated successfully");
      // Refresh users with permissions
      await fetchUsersWithPermissions();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to bulk update permissions";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete user permission
  const deleteUserPermission = async (
    rm_account_id: number,
    page_id: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      await permissionsService.deleteUserPermission(rm_account_id, page_id);
      toast.success("Permission deleted successfully");
      // Refresh users with permissions
      await fetchUsersWithPermissions();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete permission";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    pages,
    usersWithPermissions,
    loading,
    error,
    fetchPages,
    fetchUsersWithPermissions,
    updateUserPermission,
    bulkUpdateUserPermissions,
    deleteUserPermission,
  };
};
