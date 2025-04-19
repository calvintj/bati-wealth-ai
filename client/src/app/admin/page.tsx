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
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import Image from "next/image";
import { UserNav } from "@/components/ui/user-nav";
import { useTheme } from "next-themes";
import { ColorModeToggle } from "@/components/chatbot/color-mode-toggle";

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

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  useEffect(() => {
    fetchUsers();
  }, []);

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
      // Remove any leading zeros after "RM" and generate email
      const normalizedRmNumber = value.replace(/^RM0+/, "RM");
      const email = value ? `${normalizedRmNumber}@batiinvestasi.ai` : "";
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

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen dark:bg-gray-900">
        <div className="m-2 sm:m-4 flex flex-col sm:flex-row justify-between items-center mb-6 p-4 border-b-2 border-gray-300 dark:border-none dark:bg-[#1D283A] rounded-2xl gap-4">
          <Image
            src={theme === "dark" ? "/bati-dark.svg" : "/bati-light.svg"}
            alt="Bati Logo"
            width={100}
            height={30}
          />
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ColorModeToggle />
            <div className="flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <main className="container mx-auto px-2 sm:px-4">
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
