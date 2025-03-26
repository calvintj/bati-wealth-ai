import { QuarterlyAUM } from "@/types/page/customer-details";
import api from "@/services/api";
import axios from "axios";

const fetchQuarterlyAUM = async (
  customerID: string
): Promise<QuarterlyAUM[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await api.get("/customer-details/quarterly-aum", {
      params: { customerID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as QuarterlyAUM[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchQuarterlyAUM;
