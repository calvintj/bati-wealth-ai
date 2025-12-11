import { toast } from "sonner";

/**
 * Check if user has permission before performing an action
 * Shows error message if permission is not met
 * @param hasPermission - Whether user has the required permission
 * @param actionName - Name of the action (e.g., "create", "update", "delete")
 * @param resourceName - Name of the resource (e.g., "activity", "customer", "task")
 * @returns true if permission is granted, false otherwise
 */
export const checkPermissionBeforeAction = (
  hasPermission: boolean,
  actionName: string,
  resourceName: string = "item"
): boolean => {
  if (!hasPermission) {
    const actionText =
      {
        create: "create",
        add: "create",
        update: "update",
        edit: "update",
        delete: "delete",
        remove: "delete",
        download: "download",
        export: "download",
        view: "view",
      }[actionName.toLowerCase()] || actionName;

    // Use the standard error message format (matches API interceptor)
    toast.error("Error", {
      description: `Access denied. You do not have permission to ${actionText} on this page. Please contact your administrator if you need access.`,
      duration: 5000,
    });
    return false;
  }
  return true;
};

/**
 * Check multiple permissions before performing an action
 * Shows error message if any permission is not met
 * @param permissions - Object with permission flags
 * @param actionName - Name of the action
 * @param resourceName - Name of the resource
 * @returns true if all required permissions are granted, false otherwise
 */
export const checkMultiplePermissions = (
  permissions: {
    canAdd?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    canDownload?: boolean;
  },
  actionName: "add" | "update" | "delete" | "download",
  resourceName: string = "item"
): boolean => {
  const permissionMap = {
    add: permissions.canAdd,
    update: permissions.canUpdate,
    delete: permissions.canDelete,
    download: permissions.canDownload,
  };

  const hasPermission = permissionMap[actionName] ?? false;
  return checkPermissionBeforeAction(hasPermission, actionName, resourceName);
};
