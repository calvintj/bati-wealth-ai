import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bulkUpdateCustomers,
  BulkUpdateData,
  BulkUpdateResponse,
} from "@/services/dashboard-overview/bulk-update-api";
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

export const useBulkUpdateCustomers = () => {
  const queryClient = useQueryClient();
  return useMutation<BulkUpdateResponse, Error, BulkUpdateData>({
    mutationFn: bulkUpdateCustomers,
    onSuccess: async () => {
      // Invalidate and refetch all customer-related queries
      // Use exact: false to invalidate all queries that start with ["customerList"]
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
        toast.error("Failed to bulk update customers", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};


