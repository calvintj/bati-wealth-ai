import api from "@/services/api";
import axios from "axios";
import { CustomerDetails } from "@/types/page/customer-details";

const fetchCustomerDetails = async (customerID: string) => {
  try {
    // Don't proceed if customerID is empty
    if (!customerID) {
      return null;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    let tokenPayload;
    try {
      tokenPayload = JSON.parse(atob(token.split(".")[1]));
    } catch {
      throw new Error("Invalid token format");
    }
    const rm_number = tokenPayload.rm_number;

    try {
      const response = await api.get("/customer-details/customer-details", {
        params: { rm_number, customerID },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as CustomerDetails;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  } catch (error) {
    console.error("Error in fetchCustomerDetails:", error);
    throw error;
  }
};

export default fetchCustomerDetails;
