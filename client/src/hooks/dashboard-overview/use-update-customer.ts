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
    return error.response?.data?.error || error.message || "Terjadi kesalahan";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan yang tidak diketahui";
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, CustomerUpdateData>({
    mutationFn: updateCustomerInfo,
    onSuccess: async () => {
      // Invalidate and refetch customer list queries to refresh data
      await queryClient.invalidateQueries({
        queryKey: ["customerList"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["customerList"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["total-customer"] });
      queryClient.invalidateQueries({ queryKey: ["total-aum"] });
      queryClient.invalidateQueries({ queryKey: ["total-fbi"] });
    },
    onError: (error) => {
      // Check if it's a permission error (already shown by interceptor)
      // Always skip showing error for 403 status (permission denied)
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        return; // API interceptor already handles 403 errors
      }

      const errorMessage = getErrorMessage(error);
      const errorLower = errorMessage.toLowerCase();
      const isPermissionError =
        errorLower.includes("permission") ||
        errorLower.includes("access denied") ||
        errorLower.includes("akses ditolak") ||
        errorLower.includes("tidak memiliki izin") ||
        errorLower.includes("memperbarui di halaman ini");

      // Only show toast if it's not a permission error (already shown by interceptor)
      if (!isPermissionError) {
        toast.error("Gagal memperbarui pelanggan", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};
