import api from "@/services/api";
import axios from "axios";
import { ManagedNumbersResponse } from "@/types/task-manager";

const fetchManagedNumbers = async (): Promise<ManagedNumbersResponse> => {
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
    const response = await api.get("/task-manager/managed-number", {
      params: { rm_number },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as ManagedNumbersResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchManagedNumbers;
