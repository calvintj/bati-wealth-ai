import axios from "axios";
import api from "@/services/api";
import { IncreasedNumbersResponse } from "@/types/page/task-manager";

const fetchManagedNumbers = async (): Promise<IncreasedNumbersResponse> => {
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
  const { rm_number } = tokenPayload;

  try {
    const response = await api.get("/task-manager/increased-number", {
      params: { rm_number },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as IncreasedNumbersResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchManagedNumbers;
