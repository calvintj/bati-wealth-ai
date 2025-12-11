"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Users,
  Settings,
  BarChart3,
  FileText,
  DollarSign,
  Shield,
  Plus,
  Edit,
  Key,
  X,
  Trash2,
  ScrollText,
  Lock,
  Save,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import Image from "next/image";
import { UserNav } from "@/components/ui/user-nav";
import { useTheme } from "next-themes";
import { ColorModeToggle } from "@/components/chatbot/color-mode-toggle";
import { usePermissions } from "@/hooks/permissions/use-permissions";
import type { UserWithPermissions, Page } from "@/services/permissions/permissions-api";
import { permissionsService } from "@/services/permissions/permissions-api";

interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
    };
  };
}

interface User {
  rm_account_id: number;
  email: string;
  rm_number: string;
  role: string;
  created_at: string;
}

const AdminPage = () => {
  const { theme } = useTheme();
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
    rm_number: "",
  });
  const [passwordData, setPasswordData] = useState({
    email: "",
    newPassword: "",
  });

  // Permission management state
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showPermissionsForm, setShowPermissionsForm] = useState(false);
  // Separate state for default permissions (applies to all RM users)
  const [defaultPermissionChanges, setDefaultPermissionChanges] = useState<
    Record<
      number,
      {
        can_view: boolean;
        can_add: boolean;
        can_update: boolean;
        can_delete: boolean;
      }
    >
  >({});
  // Separate state for individual user permissions
  const [permissionChanges, setPermissionChanges] = useState<
    Record<
      number,
      {
        can_view: boolean;
        can_add: boolean;
        can_update: boolean;
        can_delete: boolean;
      }
    >
  >({});

  // Use permissions hook
  const {
    pages,
    usersWithPermissions,
    loading: permissionsLoading,
    fetchPages,
    fetchUsersWithPermissions,
    bulkUpdateUserPermissions,
  } = usePermissions();

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  useEffect(() => {
    fetchUsers();
    fetchPages();
    fetchUsersWithPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize default permissions when pages are loaded
  useEffect(() => {
    if (pages.length > 0 && Object.keys(defaultPermissionChanges).length === 0) {
      const defaults: Record<
        number,
        {
          can_view: boolean;
          can_add: boolean;
          can_update: boolean;
          can_delete: boolean;
        }
      > = {};
      pages.forEach((page) => {
        // Only View is checked by default for all pages
        defaults[page.page_id] = { can_view: true, can_add: false, can_update: false, can_delete: false };
      });
      setDefaultPermissionChanges(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/users");
      setUsers(response.data);
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.response?.data?.error || "Failed to fetch users");
    }
  };

  const handleDeleteUser = async (rmNumber: string) => {
    if (!rmNumber) {
      toast.error("Invalid RM Number");
      return;
    }

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/auth/users/${rmNumber}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.response?.data?.error || "Failed to delete user");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "rm_number") {
      // Preserve leading zeros and generate email
      const email = value ? `${value}@batiinvestasi.ai` : "";
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        email: email,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        rm_number: formData.rm_number,
      });
      toast.success("User created successfully");
      setShowUserForm(false);
      setFormData({ email: "", password: "", role: "user", rm_number: "" });
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.response?.data?.error || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rm_number) {
      toast.error("RM Number is required");
      return;
    }
    setIsLoading(true);
    try {
      await api.put(`/auth/update-user/${formData.rm_number}`, {
        email: formData.email,
        role: formData.role,
      });
      toast.success("User updated successfully");
      setShowUserForm(false);
      setFormData({ email: "", password: "", role: "user", rm_number: "" });
      fetchUsers();
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.response?.data?.error || "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put("/auth/update-password", {
        email: passwordData.email,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully");
      setShowPasswordForm(false);
      setPasswordData({ email: "", newPassword: "" });
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(
        apiError.response?.data?.error || "Failed to update password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Permission management handlers
  const handleSelectUserForPermissions = (rm_account_id: number) => {
    setSelectedUser(rm_account_id);
    
    // Initialize permission changes with current permissions
    const user = usersWithPermissions.find(
      (u) => u.rm_account_id === rm_account_id
    );
    
    const changes: Record<
      number,
      {
        can_view: boolean;
        can_add: boolean;
        can_update: boolean;
        can_delete: boolean;
      }
    > = {};
    
    if (user && user.permissions) {
      user.permissions.forEach((perm) => {
        changes[perm.page_id] = {
          can_view: perm.can_view || false,
          can_add: perm.can_add || false,
          can_update: perm.can_update || false,
          can_delete: perm.can_delete || false,
        };
      });
    }
    
    // Add pages that don't have permissions yet (default to all false)
    pages.forEach((page) => {
      if (!changes[page.page_id]) {
        changes[page.page_id] = {
          can_view: false,
          can_add: false,
          can_update: false,
          can_delete: false,
        };
      }
    });
    
    setPermissionChanges(changes);
    setShowPermissionsForm(true);
  };

  // Handler for default permissions
  const handleDefaultPermissionChange = (
    pageId: number,
    permissionType: "can_view" | "can_add" | "can_update" | "can_delete",
    value: boolean
  ) => {
    setDefaultPermissionChanges((prev) => ({
      ...prev,
      [pageId]: {
        ...(prev[pageId] || {
          can_view: false,
          can_add: false,
          can_update: false,
          can_delete: false,
        }),
        [permissionType]: value,
      },
    }));
  };

  // Handler for individual user permissions
  const handlePermissionChange = (
    pageId: number,
    permissionType: "can_view" | "can_add" | "can_update" | "can_delete",
    value: boolean
  ) => {
    setPermissionChanges((prev) => ({
      ...prev,
      [pageId]: {
        ...(prev[pageId] || {
          can_view: false,
          can_add: false,
          can_update: false,
          can_delete: false,
        }),
        [permissionType]: value,
      },
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;

    try {
      setIsLoading(true);
      const permissionsArray = Object.entries(permissionChanges).map(
        ([pageId, perms]) => ({
          page_id: parseInt(pageId, 10),
          ...perms,
        })
      );

      await bulkUpdateUserPermissions(selectedUser, permissionsArray);
      toast.success("Permissions saved successfully");
      await fetchUsersWithPermissions();
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Failed to save permissions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen dark:bg-gray-900">
        <div className="p-4 mx-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-2xl">
          <Image
            src={theme === "dark" ? "/bati-dark.svg" : "/bati-light.svg"}
            alt="Bati Logo"
            width={100}
            height={30}
          />
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4 pb-2">
            <ColorModeToggle />
            <div className="flex items-center space-x-4">
              <a
                href="/logs"
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer text-sm sm:text-base"
              >
                <ScrollText className="h-4 w-4 mr-1" /> View Logs
              </a>
              <UserNav />
            </div>
          </div>
        </div>
        <main className="container mx-auto p-4 sm:px-4">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* User Management Card */}
            <div className="p-4 sm:p-6 bg-white dark:bg-[#1D283A] rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-blue-600" />
                  <h2 className="text-xl font-semibold text-black dark:text-white">
                    User Management
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setFormMode("create");
                      setFormData({
                        email: "",
                        password: "",
                        role: "user",
                        rm_number: "",
                      });
                      setShowUserForm(true);
                      setShowPasswordForm(false);
                    }}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer text-sm sm:text-base"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Create User
                  </button>
                  <button
                    onClick={() => {
                      setFormMode("update");
                      setFormData({ ...formData, password: "", rm_number: "" });
                      setShowUserForm(true);
                      setShowPasswordForm(false);
                    }}
                    className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 cursor-pointer text-sm sm:text-base"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Update User
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(true);
                      setShowUserForm(false);
                    }}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 cursor-pointer text-sm sm:text-base"
                  >
                    <Key className="h-4 w-4 mr-1" /> Change Password
                  </button>
                </div>
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          RM Number
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#1D283A] divide-y divide-gray-200 dark:divide-gray-700">
                      {currentUsers.map((user) => (
                        <tr key={user.rm_account_id}>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {user.email}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {user.rm_number}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {user.role}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  console.log("Update clicked for user:", user);
                                  setFormMode("update");
                                  setFormData({
                                    email: user.email,
                                    password: "",
                                    role: user.role,
                                    rm_number: user.rm_number,
                                  });
                                  setShowUserForm(true);
                                  setShowPasswordForm(false);
                                }}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Deleting user:", user.rm_number);
                                  handleDeleteUser(user.rm_number);
                                }}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {startIndex + 1} to {Math.min(endIndex, users.length)}{" "}
                  of {users.length} users
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 cursor-pointer text-sm"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border dark:border-gray-600 rounded-md text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white dark:bg-blue-500 cursor-pointer"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-gray-300 cursor-pointer"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 cursor-pointer text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Forms */}
            {showUserForm && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {formMode === "create" ? "Create New User" : "Update User"}
                  </h3>
                  <button
                    onClick={() => setShowUserForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form
                  onSubmit={
                    formMode === "create" ? handleCreateUser : handleUpdateUser
                  }
                >
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        RM Number
                      </label>
                      <input
                        type="text"
                        name="rm_number"
                        value={formData.rm_number}
                        onChange={handleInputChange}
                        placeholder="RM001"
                        pattern="RM\d{3}"
                        title="RM number must be in format RMXXX where XXX is a 3-digit number"
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-100"
                        required
                        readOnly
                      />
                    </div>
                    {formMode === "create" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
                    >
                      {isLoading
                        ? "Processing..."
                        : formMode === "create"
                        ? "Create User"
                        : "Update User"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Default Page Permissions Card */}
            <div className="p-4 sm:p-6 bg-white dark:bg-[#1D283A] rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center space-x-4">
                  <Settings className="h-8 w-8 text-blue-600" />
                  <h2 className="text-xl font-semibold text-black dark:text-white">
                    Default Page Permissions (All RM Users)
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Set default permissions that apply to all RM users
                </p>
              </div>

              <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                          Page
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                          View
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                          Add
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                          Update
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#1D283A] divide-y divide-gray-200 dark:divide-gray-700">
                      {pages.map((page) => {
                        // Default permissions: only View is checked
                        const defaults = { can_view: true, can_add: false, can_update: false, can_delete: false };
                        const pageDefaults = defaultPermissionChanges[page.page_id] || defaults;

                        return (
                          <tr key={page.page_id}>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              {page.page_label}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={pageDefaults.can_view}
                                onChange={(e) =>
                                  handleDefaultPermissionChange(
                                    page.page_id,
                                    "can_view",
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={pageDefaults.can_add}
                                disabled={page.page_label === "Chatbot"}
                                onChange={(e) =>
                                  handleDefaultPermissionChange(
                                    page.page_id,
                                    "can_add",
                                    e.target.checked
                                  )
                                }
                                className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                                  page.page_label === "Chatbot"
                                    ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                                    : ""
                                }`}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={pageDefaults.can_update}
                                disabled={page.page_label === "Chatbot"}
                                onChange={(e) =>
                                  handleDefaultPermissionChange(
                                    page.page_id,
                                    "can_update",
                                    e.target.checked
                                  )
                                }
                                className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                                  page.page_label === "Chatbot"
                                    ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                                    : ""
                                }`}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={pageDefaults.can_delete}
                                disabled={
                                  page.page_label === "Chatbot" ||
                                  page.page_label === "Customer Mapping" ||
                                  page.page_label === "Dashboard Overview"
                                }
                                onChange={(e) =>
                                  handleDefaultPermissionChange(
                                    page.page_id,
                                    "can_delete",
                                    e.target.checked
                                  )
                                }
                                className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                                  page.page_label === "Chatbot" ||
                                  page.page_label === "Customer Mapping" ||
                                  page.page_label === "Dashboard Overview"
                                    ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                                    : ""
                                }`}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const permissionsArray = pages.map((page) => {
                          const defaults = defaultPermissionChanges[page.page_id] || {
                            can_view: false,
                            can_add: false,
                            can_update: false,
                            can_delete: false,
                          };
                          // Apply default permissions if not set (only View is checked by default)
                          if (!defaultPermissionChanges[page.page_id]) {
                            defaults.can_view = true;
                            defaults.can_add = false;
                            defaults.can_update = false;
                            defaults.can_delete = false;
                          }
                          return {
                            page_id: page.page_id,
                            ...defaults,
                          };
                        });
                        await permissionsService.applyDefaultPermissionsToAllRM(permissionsArray);
                        toast.success("Default permissions applied to all RM users successfully");
                        fetchUsersWithPermissions();
                      } catch (error: unknown) {
                        const apiError = error as ApiErrorResponse;
                        toast.error(apiError.response?.data?.error || "Failed to apply default permissions");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading || permissionsLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading || permissionsLoading
                      ? "Applying..."
                      : "Apply to All RM Users"}
                  </button>
                </div>
              </div>
            </div>

            {/* Permission Management Card */}
            <div className="p-4 sm:p-6 bg-white dark:bg-[#1D283A] rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center space-x-4">
                  <Lock className="h-8 w-8 text-orange-600" />
                  <h2 className="text-xl font-semibold text-black dark:text-white">
                    Individual User Permission Management
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Manage permissions for specific users
                </p>
              </div>

              {/* User Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select User to Manage Permissions
                </label>
                <select
                  value={selectedUser || ""}
                  onChange={(e) => {
                    const userId = e.target.value
                      ? parseInt(e.target.value, 10)
                      : null;
                    if (userId) {
                      handleSelectUserForPermissions(userId);
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">-- Select a user --</option>
                  {usersWithPermissions.map((user) => (
                    <option key={user.rm_account_id} value={user.rm_account_id}>
                      {user.email} ({user.rm_number})
                    </option>
                  ))}
                </select>
              </div>

              {/* Permissions Form */}
              {showPermissionsForm && selectedUser && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Edit Permissions for{" "}
                      {
                        usersWithPermissions.find(
                          (u) => u.rm_account_id === selectedUser
                        )?.email
                      }
                    </h3>
                    <button
                      onClick={() => {
                        setShowPermissionsForm(false);
                        setSelectedUser(null);
                        setPermissionChanges({}); // Clear individual user permissions
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                      type="button"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                            Page
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                            View
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                            Add
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                            Update
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-[#1D283A] divide-y divide-gray-200 dark:divide-gray-700">
                        {pages.map((page) => (
                          <tr key={page.page_id}>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              {page.page_label}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={
                                  permissionChanges[page.page_id]?.can_view ||
                                  false
                                }
                                onChange={(e) =>
                                  handlePermissionChange(
                                    page.page_id,
                                    "can_view",
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={
                                  permissionChanges[page.page_id]?.can_add ||
                                  false
                                }
                                disabled={page.page_label === "Chatbot"}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    page.page_id,
                                    "can_add",
                                    e.target.checked
                                  )
                                }
                                className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                                  page.page_label === "Chatbot"
                                    ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                                    : ""
                                }`}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={
                                  permissionChanges[page.page_id]?.can_update ||
                                  false
                                }
                                disabled={page.page_label === "Chatbot"}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    page.page_id,
                                    "can_update",
                                    e.target.checked
                                  )
                                }
                                className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                                  page.page_label === "Chatbot"
                                    ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                                    : ""
                                }`}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={
                                  permissionChanges[page.page_id]?.can_delete ||
                                  false
                                }
                                disabled={
                                  page.page_label === "Chatbot" ||
                                  page.page_label === "Customer Mapping" ||
                                  page.page_label === "Dashboard Overview"
                                }
                                onChange={(e) =>
                                  handlePermissionChange(
                                    page.page_id,
                                    "can_delete",
                                    e.target.checked
                                  )
                                }
                                className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                                  page.page_label === "Chatbot" ||
                                  page.page_label === "Customer Mapping" ||
                                  page.page_label === "Dashboard Overview"
                                    ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                                    : ""
                                }`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSavePermissions}
                      disabled={isLoading || permissionsLoading}
                      className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600 cursor-pointer"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading || permissionsLoading
                        ? "Saving..."
                        : "Save Permissions"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Form */}
            {showPasswordForm && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Change Password
                  </h3>
                  <button
                    onClick={() => setShowPasswordForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleUpdatePassword}>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={passwordData.email}
                        onChange={handlePasswordInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600 cursor-pointer"
                    >
                      {isLoading ? "Processing..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* System Settings and Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-white dark:bg-[#1D283A] rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <Settings className="h-8 w-8 text-purple-600" />
                  <h2 className="text-xl font-semibold text-black dark:text-white">
                    System Settings
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Configure system-wide settings, security parameters, and
                  application preferences.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    Security Level: High
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    Last Backup: 2 hours ago
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-white dark:bg-[#1D283A] rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <h2 className="text-xl font-semibold text-black dark:text-white">
                    Analytics
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Monitor system performance, user engagement, and business
                  metrics in real-time.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    Revenue Growth: +15%
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    User Growth: +8%
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Admin Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-white dark:bg-[#1D283A] rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      New user registration
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      2 mins ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      System update completed
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      1 hour ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Backup completed
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      2 hours ago
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-white dark:bg-[#1D283A] rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  System Health
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      CPU Usage
                    </span>
                    <span className="text-sm text-green-500">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Memory Usage
                    </span>
                    <span className="text-sm text-yellow-500">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Storage
                    </span>
                    <span className="text-sm text-blue-500">32%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
