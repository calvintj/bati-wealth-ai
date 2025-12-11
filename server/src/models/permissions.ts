import db from "../config/db";

// ============================================
// PAGE OPERATIONS
// ============================================

export interface Page {
  page_id: number;
  page_path: string;
  page_name: string;
  page_label: string;
  created_at: Date;
  updated_at: Date;
}

// Get all pages
export const getAllPages = async (): Promise<Page[]> => {
  const result = await db.query(
    "SELECT * FROM pages ORDER BY page_label ASC",
    []
  );
  return result.rows;
};

// Get page by path
export const getPageByPath = async (page_path: string): Promise<Page | null> => {
  const result = await db.query(
    "SELECT * FROM pages WHERE page_path = $1",
    [page_path]
  );
  return result.rows[0] || null;
};

// ============================================
// USER PERMISSIONS OPERATIONS
// ============================================

export interface UserPermission {
  permission_id: number;
  rm_account_id: number;
  page_id: number;
  can_view: boolean;
  can_add: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_download: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserPermissionWithPage extends UserPermission {
  page_path: string;
  page_name: string;
  page_label: string;
}

// Get all permissions for a specific user
export const getUserPermissions = async (
  rm_account_id: number
): Promise<UserPermissionWithPage[]> => {
  const result = await db.query(
    `SELECT 
      up.*,
      p.page_path,
      p.page_name,
      p.page_label
    FROM user_permissions up
    INNER JOIN pages p ON up.page_id = p.page_id
    WHERE up.rm_account_id = $1
    ORDER BY p.page_label ASC`,
    [rm_account_id]
  );
  return result.rows;
};

// Get permission for a specific user on a specific page
export const getUserPagePermission = async (
  rm_account_id: number,
  page_id: number
): Promise<UserPermission | null> => {
  const result = await db.query(
    "SELECT * FROM user_permissions WHERE rm_account_id = $1 AND page_id = $2",
    [rm_account_id, page_id]
  );
  return result.rows[0] || null;
};

// Get permission for a specific user by page path
export const getUserPermissionByPath = async (
  rm_account_id: number,
  page_path: string
): Promise<UserPermissionWithPage | null> => {
  // Normalize the path: ensure it starts with /
  const normalizedPath = page_path.startsWith('/') ? page_path : `/${page_path}`;
  const result = await db.query(
    `SELECT 
      up.*,
      p.page_path,
      p.page_name,
      p.page_label
    FROM user_permissions up
    INNER JOIN pages p ON up.page_id = p.page_id
    WHERE up.rm_account_id = $1 AND p.page_path = $2`,
    [rm_account_id, normalizedPath]
  );
  return result.rows[0] || null;
};

// Create or update user permission
export const upsertUserPermission = async (
  rm_account_id: number,
  page_id: number,
  permissions: {
    can_view: boolean;
    can_add: boolean;
    can_update: boolean;
    can_delete: boolean;
  }
): Promise<UserPermission> => {
  // Always set can_download to true (all users can download)
  const result = await db.query(
    `INSERT INTO user_permissions 
      (rm_account_id, page_id, can_view, can_add, can_update, can_delete, can_download)
    VALUES ($1, $2, $3, $4, $5, $6, true)
    ON CONFLICT (rm_account_id, page_id)
    DO UPDATE SET
      can_view = EXCLUDED.can_view,
      can_add = EXCLUDED.can_add,
      can_update = EXCLUDED.can_update,
      can_delete = EXCLUDED.can_delete,
      can_download = true,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *`,
    [
      rm_account_id,
      page_id,
      permissions.can_view,
      permissions.can_add,
      permissions.can_update,
      permissions.can_delete,
    ]
  );
  return result.rows[0];
};

// Delete user permission
export const deleteUserPermission = async (
  rm_account_id: number,
  page_id: number
): Promise<boolean> => {
  const result = await db.query(
    "DELETE FROM user_permissions WHERE rm_account_id = $1 AND page_id = $2 RETURNING permission_id",
    [rm_account_id, page_id]
  );
  return (result.rowCount ?? 0) > 0;
};

// Delete all permissions for a user
export const deleteAllUserPermissions = async (
  rm_account_id: number
): Promise<boolean> => {
  const result = await db.query(
    "DELETE FROM user_permissions WHERE rm_account_id = $1 RETURNING permission_id",
    [rm_account_id]
  );
  return (result.rowCount ?? 0) > 0;
};

// Get all users with their permissions (for admin view)
export const getAllUsersWithPermissions = async (): Promise<any[]> => {
  const result = await db.query(
    `SELECT 
      ra.rm_account_id,
      ra.email,
      ra.rm_number,
      ra.role,
      json_agg(
        json_build_object(
          'page_id', p.page_id,
          'page_path', p.page_path,
          'page_name', p.page_name,
          'page_label', p.page_label,
          'can_view', COALESCE(up.can_view, false),
          'can_add', COALESCE(up.can_add, false),
          'can_update', COALESCE(up.can_update, false),
          'can_delete', COALESCE(up.can_delete, false),
          'can_download', COALESCE(up.can_download, false)
        ) ORDER BY p.page_label
      ) as permissions
    FROM rm_account ra
    CROSS JOIN pages p
    LEFT JOIN user_permissions up ON ra.rm_account_id = up.rm_account_id AND p.page_id = up.page_id
    WHERE ra.role = 'user'
    GROUP BY ra.rm_account_id, ra.email, ra.rm_number, ra.role
    ORDER BY ra.email ASC`,
    []
  );
  return result.rows;
};

// Get all RM users (role = 'user')
export const getAllRMUsers = async (): Promise<Array<{ rm_account_id: number }>> => {
  const result = await db.query(
    "SELECT rm_account_id FROM rm_account WHERE role = 'user'",
    []
  );
  return result.rows;
};

// Apply default permissions to all RM users
export const applyDefaultPermissionsToAllRMUsers = async (
  defaultPermissions: Array<{
    page_id: number;
    can_view: boolean;
    can_add: boolean;
    can_update: boolean;
    can_delete: boolean;
  }>
): Promise<number> => {
  // Get all RM users
  const rmUsers = await getAllRMUsers();
  
  // Apply permissions to each RM user
  let totalUpdated = 0;
  for (const user of rmUsers) {
    for (const perm of defaultPermissions) {
      await upsertUserPermission(user.rm_account_id, perm.page_id, {
        can_view: perm.can_view,
        can_add: perm.can_add,
        can_update: perm.can_update,
        can_delete: perm.can_delete,
      });
      totalUpdated++;
    }
  }
  
  return totalUpdated;
};

