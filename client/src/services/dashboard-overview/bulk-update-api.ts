import api from "@/services/api";
import axios from "axios";

export interface BulkUpdateData {
  customerIDs: string[];
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

export interface BulkUpdateResponse {
  updated: number;
  failed: number;
  errors: string[];
}

export const bulkUpdateCustomers = async (
  data: BulkUpdateData
): Promise<BulkUpdateResponse> => {
  try {
    const response = await api.put("/customer-details/bulk-update-customers", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Failed to update customers";
      console.error("Bulk update error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};


