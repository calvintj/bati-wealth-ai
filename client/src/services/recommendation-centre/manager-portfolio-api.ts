import api from "@/services/api";
import { PortfolioResponse } from "@/types/page/task-manager";
import axios from "axios";

const fetchPortfolio = async (): Promise<PortfolioResponse> => {
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
    const response = await api.get("/task-manager/portfolio", {
      params: { rm_number },
    });
    return response.data as PortfolioResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};
export default fetchPortfolio;
