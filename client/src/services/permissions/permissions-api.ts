import api from "../api";
import axios from "axios";

export interface Page {
  page_id: number;
  page_path: string;
  page_name: string;
  page_label: string;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  permission_id?: number;
  rm_account_id: number;
  page_id: number;
  can_view: boolean;
  can_add: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_download: boolean; // Always true (all users can download), kept for backward compatibility
  created_at?: string;
  updated_at?: string;
}

export interface UserPermissionWithPage extends UserPermission {
  page_path: string;
  page_name: string;
  page_label: string;
}

export interface UserWithPermissions {
  rm_account_id: number;
  email: string;
  rm_number: string;
  role: string;
  permissions: UserPermissionWithPage[];
}

export const permissionsService = {
  /**
   * Get all pages
   */
  getPages: async (): Promise<Page[]> => {
    try {
      const response = await api.get("/permissions/pages");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Get pages API error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const errorMessage =
          error.response?.data?.error || "Failed to fetch pages";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  },

  /**
   * Get all users with their permissions
   */
  getUsersWithPermissions: async (): Promise<UserWithPermissions[]> => {
    try {
      const response = await api.get("/permissions/users");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Get users with permissions API error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const errorMessage =
          error.response?.data?.error ||
          "Failed to fetch users with permissions";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  },

  /**
   * Get permissions for a specific user
   */
  getUserPermissions: async (
    rm_account_id: number
  ): Promise<UserPermissionWithPage[]> => {
    try {
      const response = await api.get(`/permissions/users/${rm_account_id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Get user permissions API error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const errorMessage =
          error.response?.data?.error ||
          "Failed to fetch user permissions";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  },

  /**
   * Update user permissions for a specific page
   */
  updateUserPermission: async (
    rm_account_id: number,
    page_id: number,
    permissions: {
      can_view: boolean;
      can_add: boolean;
      can_update: boolean;
      can_delete: boolean;
      can_download: boolean;
    }
  ): Promise<UserPermission> => {
    try {
      const response = await api.put(
        `/permissions/users/${rm_account_id}/pages/${page_id}`,
        permissions
      );
      return response.data.permission;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Update user permission API error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const errorMessage =
          error.response?.data?.error || "Failed to update permission";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  },

  /**
   * Bulk update user permissions (all pages at once)
   */
  bulkUpdateUserPermissions: async (
    rm_account_id: number,
    permissions: Array<{
      page_id: number;
      can_view: boolean;
      can_add: boolean;
      can_update: boolean;
      can_delete: boolean;
      can_download: boolean;
    }>
  ): Promise<UserPermission[]> => {
    try {
      const response = await api.put(
        `/permissions/users/${rm_account_id}/bulk`,
        { permissions }
      );
      return response.data.permissions;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Bulk update permissions API error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const errorMessage =
          error.response?.data?.error ||
          "Failed to bulk update permissions";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  },

  /**
   * Delete user permission for a specific page
   */
  deleteUserPermission: async (
    rm_account_id: number,
    page_id: number
  ): Promise<void> => {
    try {
      await api.delete(
        `/permissions/users/${rm_account_id}/pages/${page_id}`
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Delete user permission API error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const errorMessage =
          error.response?.data?.error || "Failed to delete permission";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  },

  /**
   * Apply default permissions to all RM users
   */
  applyDefaultPermissionsToAllRM: async (
    permissions: Array<{
      page_id: number;
      can_view: boolean;
      can_add: boolean;
      can_update: boolean;
      can_delete: boolean;
    }>
  ): Promise<{ message: string; totalUpdated: number }> => {
    try {
      const response = await api.post("/permissions/defaults/apply-to-all-rm", {
        permissions,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Apply default permissions API error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const errorMessage =
          error.response?.data?.error ||
          "Failed to apply default permissions";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  },
};

