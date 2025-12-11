import { Request, Response } from "express";
import {
  getAllPages,
  getUserPermissions,
  getUserPermissionByPath,
  upsertUserPermission,
  deleteUserPermission,
  getAllUsersWithPermissions,
  getPageByPath,
  applyDefaultPermissionsToAllRMUsers,
} from "../models/permissions";
import { findAccountByEmail } from "../models/rm-account";

// Get all pages
export const getPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const pages = await getAllPages();
    res.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
};

// Get all users with their permissions (for admin)
export const getUsersWithPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAllUsersWithPermissions();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users with permissions:", error);
    res.status(500).json({ error: "Failed to fetch users with permissions" });
  }
};

// Get permissions for a specific user
export const getUserPermissionsByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rm_account_id } = req.params;
    const accountId = parseInt(rm_account_id, 10);

    if (isNaN(accountId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const permissions = await getUserPermissions(accountId);
    res.json(permissions);
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    res.status(500).json({ error: "Failed to fetch user permissions" });
  }
};

// Get permission for current user on a specific page
export const getCurrentUserPagePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page_path } = req.params;
    // Decode the path in case it was URL encoded
    const decodedPath = decodeURIComponent(page_path);
    const user = (req as any).user;

    console.log("Checking permission for user:", user?.id, "path:", decodedPath);

    if (!user || !user.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Admin users have all permissions
    if (user.role === "admin") {
      res.json({
        can_view: true,
        can_add: true,
        can_update: true,
        can_delete: true,
        can_download: true, // Always true for download (all users can download)
        page_path: decodedPath,
      });
      return;
    }

    const permission = await getUserPermissionByPath(user.id, decodedPath);
    console.log("Permission found:", permission);
    if (!permission) {
      res.json({
        can_view: false,
        can_add: false,
        can_update: false,
        can_delete: false,
        can_download: true, // Always true for download (all users can download)
        page_path: decodedPath,
      });
      return;
    }

    // Always set can_download to true (all users can download)
    res.json({
      ...permission,
      can_download: true,
    });
  } catch (error) {
    console.error("Error fetching page permission:", error);
    res.status(500).json({ error: "Failed to fetch page permission" });
  }
};

// Update user permissions
export const updateUserPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rm_account_id, page_id } = req.params;
    const { can_view, can_add, can_update, can_delete } = req.body;

    const accountId = parseInt(rm_account_id, 10);
    const pageId = parseInt(page_id, 10);

    if (isNaN(accountId) || isNaN(pageId)) {
      res.status(400).json({ error: "Invalid user ID or page ID" });
      return;
    }

    // Validate permissions object
    if (
      typeof can_view !== "boolean" ||
      typeof can_add !== "boolean" ||
      typeof can_update !== "boolean" ||
      typeof can_delete !== "boolean"
    ) {
      res.status(400).json({ error: "All permission fields must be boolean" });
      return;
    }

    // can_download is always true (all users can download), so we don't accept it in the request
    const permission = await upsertUserPermission(accountId, pageId, {
      can_view,
      can_add,
      can_update,
      can_delete,
    });

    res.json({
      message: "Permissions updated successfully",
      permission,
    });
  } catch (error) {
    console.error("Error updating permissions:", error);
    res.status(500).json({ error: "Failed to update permissions" });
  }
};

// Bulk update user permissions (update all pages at once)
export const bulkUpdateUserPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rm_account_id } = req.params;
    const { permissions } = req.body; // Array of { page_id, can_view, can_add, can_update, can_delete }

    const accountId = parseInt(rm_account_id, 10);

    if (isNaN(accountId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    if (!Array.isArray(permissions)) {
      res.status(400).json({ error: "Permissions must be an array" });
      return;
    }

    // Update all permissions
    const results = await Promise.all(
      permissions.map((perm: any) =>
        upsertUserPermission(accountId, perm.page_id, {
          can_view: perm.can_view || false,
          can_add: perm.can_add || false,
          can_update: perm.can_update || false,
          can_delete: perm.can_delete || false,
        })
      )
    );

    res.json({
      message: "Permissions updated successfully",
      permissions: results,
    });
  } catch (error) {
    console.error("Error bulk updating permissions:", error);
    res.status(500).json({ error: "Failed to update permissions" });
  }
};

// Delete user permission for a specific page
export const deleteUserPagePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rm_account_id, page_id } = req.params;

    const accountId = parseInt(rm_account_id, 10);
    const pageId = parseInt(page_id, 10);

    if (isNaN(accountId) || isNaN(pageId)) {
      res.status(400).json({ error: "Invalid user ID or page ID" });
      return;
    }

    const deleted = await deleteUserPermission(accountId, pageId);
    if (!deleted) {
      res.status(404).json({ error: "Permission not found" });
      return;
    }

    res.json({ message: "Permission deleted successfully" });
  } catch (error) {
    console.error("Error deleting permission:", error);
    res.status(500).json({ error: "Failed to delete permission" });
  }
};

// Apply default permissions to all RM users
export const applyDefaultPermissionsToAllRM = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { permissions } = req.body; // Array of { page_id, can_view, can_add, can_update, can_delete }

    if (!Array.isArray(permissions)) {
      res.status(400).json({ error: "Permissions must be an array" });
      return;
    }

    const totalUpdated = await applyDefaultPermissionsToAllRMUsers(permissions);

    res.json({
      message: "Default permissions applied to all RM users successfully",
      totalUpdated,
    });
  } catch (error) {
    console.error("Error applying default permissions:", error);
    res.status(500).json({ error: "Failed to apply default permissions" });
  }
};

