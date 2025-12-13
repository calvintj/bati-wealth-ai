// Define the response type for login
import api from "../api";
import axios from "axios";

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    rm_number?: string;
    role: string;
    [key: string]: string | number | boolean | undefined; // For any additional user properties
  };
}

export const loginService = {
  /**
   * Authenticates a user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<LoginResponse>} Response data containing token and user info
   */

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log("Making login request to server");
      const response = await api.post(
        "/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);

      if (!response.data.success || !response.data.token) {
        throw new Error("Format respons server tidak valid");
      }

      return response.data as LoginResponse;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Login API error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        
        // Extract detailed error message
        const responseError = error.response?.data?.error;
        const responseMessage = error.response?.data?.message;
        
        if (responseError) {
          throw new Error(responseError);
        } else if (responseMessage) {
          throw new Error(responseMessage);
        } else if (error.response?.status === 400) {
          throw new Error("Email atau password tidak valid. Silakan periksa kredensial Anda.");
        } else if (error.response?.status === 401) {
          throw new Error("Tidak diizinkan. Silakan periksa kredensial Anda.");
        } else if (error.response?.status === 403) {
          throw new Error("Akses ditolak. Silakan hubungi administrator Anda.");
        } else if (error.response?.status === 404) {
          throw new Error("Layanan login tidak ditemukan. Silakan coba lagi nanti.");
        } else if (error.response?.status === 500) {
          throw new Error("Kesalahan server. Silakan coba lagi nanti.");
        } else if (error.response?.status) {
          throw new Error(`Login gagal dengan status ${error.response.status}. Silakan coba lagi.`);
        } else if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
          throw new Error("Koneksi timeout. Silakan periksa koneksi internet Anda dan coba lagi.");
        } else if (error.code === "ERR_NETWORK") {
          throw new Error("Kesalahan jaringan. Silakan periksa koneksi internet Anda.");
        } else if (error.message) {
          throw new Error(error.message);
        } else {
          throw new Error("Login gagal. Silakan coba lagi.");
        }
      }
      
      // For non-Axios errors, preserve the original error message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Login gagal. Silakan coba lagi.");
    }
  },
};
