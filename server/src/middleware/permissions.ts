import { Request, Response, NextFunction } from "express";
import { getUserPermissionByPath } from "../models/permissions";

interface AuthRequest extends Request {
  user?: any;
}

type PermissionType = "view" | "add" | "update" | "delete" | "download";

/**
 * Middleware to check if user has a specific permission on a page
 * @param pagePath - The page path (e.g., "/dashboard-overview")
 * @param permissionType - The permission type to check
 */
export function checkPermission(
  pagePath: string,
  permissionType: PermissionType
) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Admin users have all permissions
      if (user.role === "admin") {
        next();
        return;
      }

      // Get user's permission for this page
      const permission = await getUserPermissionByPath(user.id, pagePath);

      if (!permission) {
        const actionText = {
          view: "view",
          add: "create",
          update: "update",
          delete: "delete",
          download: "download",
        }[permissionType] || permissionType;

        res.status(403).json({
          error: `Akses ditolak. Anda tidak memiliki izin untuk ${actionText} di halaman ini. Silakan hubungi administrator Anda jika Anda memerlukan akses.`,
        });
        return;
      }

      // Map permission type to database field
      const permissionField = `can_${permissionType}` as
        | "can_view"
        | "can_add"
        | "can_update"
        | "can_delete"
        | "can_download";

      // Check if user has the required permission
      if (!permission[permissionField]) {
        const actionText = {
          view: "view",
          add: "create",
          update: "update",
          delete: "delete",
          download: "download",
        }[permissionType] || permissionType;

        res.status(403).json({
          error: `Akses ditolak. Anda tidak memiliki izin untuk ${actionText} di halaman ini. Silakan hubungi administrator Anda jika Anda memerlukan akses.`,
        });
        return;
      }

      // User has permission, proceed
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

/**
 * Middleware to check if user can view a page
 */
export function canView(pagePath: string) {
  return checkPermission(pagePath, "view");
}

/**
 * Middleware to check if user can add/create on a page
 */
export function canAdd(pagePath: string) {
  return checkPermission(pagePath, "add");
}

/**
 * Middleware to check if user can update on a page
 */
export function canUpdate(pagePath: string) {
  return checkPermission(pagePath, "update");
}

/**
 * Middleware to check if user can delete on a page
 */
export function canDelete(pagePath: string) {
  return checkPermission(pagePath, "delete");
}

/**
 * Middleware to check if user can update on either customer-details or dashboard-overview
 * This is used for the shared update-customer-info endpoint
 */
export function canUpdateCustomerInfo() {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Admin users have all permissions
      if (user.role === "admin") {
        next();
        return;
      }

      // Check permissions for both pages
      const [customerDetailsPermission, dashboardPermission] = await Promise.all([
        getUserPermissionByPath(user.id, "/customer-details"),
        getUserPermissionByPath(user.id, "/dashboard-overview"),
      ]);

      // User needs update permission on at least one of the pages
      const hasCustomerDetailsUpdate = customerDetailsPermission?.can_update || false;
      const hasDashboardUpdate = dashboardPermission?.can_update || false;

      if (!hasCustomerDetailsUpdate && !hasDashboardUpdate) {
        res.status(403).json({
          error: "Akses ditolak. Anda tidak memiliki izin untuk memperbarui di halaman ini. Silakan hubungi administrator Anda jika Anda memerlukan akses.",
        });
        return;
      }

      // User has permission on at least one page, proceed
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

/**
 * Middleware to check if user can download from a page
 */
export function canDownload(pagePath: string) {
  return checkPermission(pagePath, "download");
}

