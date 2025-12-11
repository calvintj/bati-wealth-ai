import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCustomerInfo,
  CustomerUpdateData,
} from "@/services/dashboard-overview/customer-update-api";
import { toast } from "sonner";
import axios from "axios";

// Helper to extract error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || "An error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, CustomerUpdateData>({
    mutationFn: updateCustomerInfo,
    onSuccess: async () => {
      // Invalidate and refetch customer list queries to refresh data
      await queryClient.invalidateQueries({ 
        queryKey: ["customerList"],
        exact: false 
      });
      await queryClient.refetchQueries({ 
        queryKey: ["customerList"],
        exact: false 
      });
      queryClient.invalidateQueries({ queryKey: ["total-customer"] });
      queryClient.invalidateQueries({ queryKey: ["total-aum"] });
      queryClient.invalidateQueries({ queryKey: ["total-fbi"] });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (!errorMessage.toLowerCase().includes("permission") && !errorMessage.toLowerCase().includes("access denied")) {
        toast.error("Failed to update customer", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};


