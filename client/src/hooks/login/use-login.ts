// Hooks
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { logger } from "@/utils/logger";
import { useSessionStore } from "@/stores/use-session-store";

// Services
import { loginService } from "../../services/login/login-api";

/**
 * Custom hook for handling login functionality
 * @returns {Object} Login-related functions and state
 */

export const useLogin = () => {
  // State
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Navigation and session
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);

  // Functions
  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    // Set loading to true
    setLoading(true);
    // Set error to null
    setError(null);

    try {
      logger.info("Login attempt", { email });
      const data = await loginService.login(email, password);

      if (!data.token) {
        logger.error("No token received in login response");
        throw new Error("Token tidak diterima dari server. Silakan coba lagi.");
      }

      // Store token in localStorage and cookies
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/`;

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update session store
      setSession({
        accessToken: data.token,
        id: data.user.id,
        user: data.user,
      });

      logger.info("Login successful", {
        email,
        role: data.user.role,
        rm_number: data.user.rm_number,
      });

      // Set loading to false
      setLoading(false);

      // Redirect based on user role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard-overview");
      }

      // Return true
      return true;
    } catch (error) {
      setLoading(false);
      let errorMessage = "Login gagal. Silakan coba lagi.";

      if (error instanceof AxiosError) {
        // Extract error message from response
        const responseError = error.response?.data?.error;
        const responseMessage = error.response?.data?.message;

        if (responseError) {
          errorMessage = responseError;
        } else if (responseMessage) {
          errorMessage = responseMessage;
        } else if (error.response?.status === 400) {
          errorMessage =
            "Email atau password tidak valid. Silakan periksa kredensial Anda.";
        } else if (error.response?.status === 401) {
          errorMessage = "Tidak diizinkan. Silakan periksa kredensial Anda.";
        } else if (error.response?.status === 403) {
          errorMessage = "Akses ditolak. Silakan hubungi administrator Anda.";
        } else if (error.response?.status === 404) {
          errorMessage =
            "Layanan login tidak ditemukan. Silakan coba lagi nanti.";
        } else if (error.response?.status === 500) {
          errorMessage = "Kesalahan server. Silakan coba lagi nanti.";
        } else if (error.response?.status) {
          errorMessage = `Login gagal dengan status ${error.response.status}. Silakan coba lagi.`;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (
          error.code === "ECONNABORTED" ||
          error.code === "ETIMEDOUT"
        ) {
          errorMessage =
            "Koneksi timeout. Silakan periksa koneksi internet Anda dan coba lagi.";
        } else if (error.code === "ERR_NETWORK") {
          errorMessage =
            "Kesalahan jaringan. Silakan periksa koneksi internet Anda.";
        }
      } else if (error instanceof Error) {
        // For non-Axios errors, use the error message
        errorMessage = error.message;
      }

      setError(errorMessage);
      logger.error("Login failed", { error, errorMessage });
      return false;
    }
  };

  return { handleLogin, error, loading };
};
