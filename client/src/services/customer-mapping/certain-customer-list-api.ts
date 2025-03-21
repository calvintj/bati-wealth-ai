import { CertainCustomerList } from "@/types/page/customer-list";
import api from "@/services/api";
import axios from "axios";

const fetchCertainCustomerList = async (
  propensity: string,
  aum: string
): Promise<CertainCustomerList[]> => {
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
    const response = await api.get("/customer-list/certain-customer-list", {
      params: { rm_number, propensity, aum },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as CertainCustomerList[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export default fetchCertainCustomerList;
