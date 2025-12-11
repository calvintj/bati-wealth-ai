import { Router } from "express";
import {
  getPages,
  getUsersWithPermissions,
  getUserPermissionsByUserId,
  getCurrentUserPagePermission,
  updateUserPermissions,
  bulkUpdateUserPermissions,
  deleteUserPagePermission,
  applyDefaultPermissionsToAllRM,
} from "../controllers/permissions";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/auth";

const router = Router();

// Get all pages (admin only)
router.get("/pages", authMiddleware, adminMiddleware, getPages);

// Get all users with their permissions (admin only)
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getUsersWithPermissions
);

// Get permissions for a specific user (admin only)
router.get(
  "/users/:rm_account_id",
  authMiddleware,
  adminMiddleware,
  getUserPermissionsByUserId
);

// Get current user's permission for a specific page (authenticated users)
router.get(
  "/check/:page_path",
  authMiddleware,
  getCurrentUserPagePermission
);

// Update user permissions for a specific page (admin only)
router.put(
  "/users/:rm_account_id/pages/:page_id",
  authMiddleware,
  adminMiddleware,
  updateUserPermissions
);

// Bulk update user permissions (admin only)
router.put(
  "/users/:rm_account_id/bulk",
  authMiddleware,
  adminMiddleware,
  bulkUpdateUserPermissions
);

// Delete user permission for a specific page (admin only)
router.delete(
  "/users/:rm_account_id/pages/:page_id",
  authMiddleware,
  adminMiddleware,
  deleteUserPagePermission
);

// Apply default permissions to all RM users (admin only)
router.post(
  "/defaults/apply-to-all-rm",
  authMiddleware,
  adminMiddleware,
  applyDefaultPermissionsToAllRM
);

export default router;

