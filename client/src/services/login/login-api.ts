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
      // Use axios to make the POST request
      const response = await api.post("/auth/login", 
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Return the data from the response
      return response.data as LoginResponse;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Login failed";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  },
};
