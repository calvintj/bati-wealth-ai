import api from "@/services/api";
import axios from "axios";
import { ReturnPercentage } from "@/types/page/customer-details";

const fetchReturnPercentage = async (
  customerID: string
): Promise<ReturnPercentage[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  let tokenPayload;
  try {
    tokenPayload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    throw new Error("Invalid token format");
  }
  const rm_number = tokenPayload.rm_number;

  try {
    const response = await api.get("/customer-details/return-percentage", {
      params: { rm_number, customerID },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as ReturnPercentage[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchReturnPercentage;