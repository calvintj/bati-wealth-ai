// Hooks
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      // Login the user
      const data = await loginService.login(email, password);
      // Set the token in local storage
      localStorage.setItem("token", data.token);
      // Set loading to false
      setLoading(false);
      // Navigate to the overview page
      router.push("/overview");
      // Return true
      return true;
    } catch (error: unknown) {
      // Log the error
      console.error("Error during login:", error);
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
