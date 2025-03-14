import axios from "axios";
import api from "@/services/api";
import { LastTransactionResponse } from "@/types/task-manager";

const fetchLastTransaction = async (): Promise<LastTransactionResponse> => {
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
    const response = await api.get("/task-manager/last-transaction", {
      params: { rm_number },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // Ensure your backend wraps the rows in an object with a last_transaction property,
    // for example: { last_transaction: result.rows }
    return response.data as LastTransactionResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchLastTransaction;
