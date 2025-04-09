// Hooks
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

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

  // Navigation
  const router = useRouter();

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
      console.log("Attempting login with email:", email);
      const data = await loginService.login(email, password);
      console.log("Login response:", data);

      if (!data.token) {
        throw new Error("No token received in login response");
      }

      localStorage.setItem("token", data.token);
      // Set loading to false
      setLoading(false);
      // Navigate to the overview page
      router.push("/dashboard-overview");
      // Return true
      return true;
    } catch (error: unknown) {
      console.error("Detailed login error:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        response: (error as AxiosError)?.response?.data,
      });
      // Set the error message
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      // Set loading to false
      setLoading(false);
      // Return false
      return false;
    }
  };

  // Return the functions and state
  return {
    handleLogin,
    error,
    loading,
  };
};
