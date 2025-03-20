import { CustomerList } from "@/types/page/customer-list";
import api from "@/services/api";
import axios from "axios";

const fetchCustomerList = async (): Promise<CustomerList[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  let tokenPayload;
  try {
    tokenPayload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    throw new Error("Invalid token format");
  }
  const rm_number = tokenPayload.rm_number;

  try {
    const response = await api.get("/customer-list/customer-list", {
      params: { rm_number },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as CustomerList[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchCustomerList;
