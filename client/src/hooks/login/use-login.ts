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
        throw new Error("No token received in login response");
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
      if (error instanceof AxiosError) {
        setError(
          error.response?.data?.error || "An error occurred during login"
        );
      } else {
        setError("An unexpected error occurred");
      }
      logger.error("Login failed", { error });
      return false;
    }
  };

  return { handleLogin, error, loading };
};
