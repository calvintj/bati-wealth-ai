import { TotalAUM } from "@/types/page/overview";
import api from "@/services/api";
import axios from "axios";

const fetchTotalAUM = async (): Promise<TotalAUM> => {
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
    const response = await api.get("/overview/total-aum", {
      params: { rm_number },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as TotalAUM;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchTotalAUM;
