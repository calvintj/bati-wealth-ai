import api from "@/services/api";
import axios from "axios";
import { OwnedProduct } from "@/types/page/customer-details";

const fetchOwnedProduct = async (
  customerID: string
): Promise<OwnedProduct[]> => {
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
    const response = await api.get("/customer-details/owned-product", {
      params: { rm_number, customerID },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as OwnedProduct[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchOwnedProduct;
