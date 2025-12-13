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
    return error.response?.data?.error || error.message || "Terjadi kesalahan";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan yang tidak diketahui";
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
      const errorLower = errorMessage.toLowerCase();
      // Check if it's a permission error (already shown by interceptor)
      const isPermissionError =
        errorLower.includes("permission") ||
        errorLower.includes("access denied") ||
        errorLower.includes("akses ditolak") ||
        errorLower.includes("tidak memiliki izin") ||
        (axios.isAxiosError(error) && error.response?.status === 403);
      
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (!isPermissionError) {
        toast.error("Gagal memperbarui pelanggan secara massal", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};


