// Define the response type for login
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
    // Fetch the login endpoint
    const response = await fetch("http://localhost:5000/api/auth/login", {
      // POST request
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Parse the response as JSON
    const data = await response.json();

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Return the data
    return data as LoginResponse;
  },
};
