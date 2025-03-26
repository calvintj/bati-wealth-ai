import { QuarterlyFUM } from "@/types/page/customer-details";
import api from "@/services/api";
import axios from "axios";

const fetchQuarterlyFUM = async (
  customerID: string
): Promise<QuarterlyFUM[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await api.get("/customer-details/quarterly-fum", {
      params: { customerID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as QuarterlyFUM[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchQuarterlyFUM;
