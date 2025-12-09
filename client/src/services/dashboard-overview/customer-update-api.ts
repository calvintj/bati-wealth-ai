import api from "@/services/api";
import axios from "axios";

export interface CustomerUpdateData {
  customerID: string;
  risk_profile?: string;
  aum_label?: string;
  propensity?: string;
  priority_private?: string;
  customer_type?: string;
  pekerjaan?: string;
  status_nikah?: string;
  usia?: string;
  annual_income?: string;
  assigned_rm?: string;
}

export const updateCustomerInfo = async (
  updateData: CustomerUpdateData
): Promise<any> => {
  try {
    const response = await api.put("/customer-details/update-customer-info", updateData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};


