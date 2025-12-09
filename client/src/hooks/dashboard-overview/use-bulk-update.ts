import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bulkUpdateCustomers,
  BulkUpdateData,
  BulkUpdateResponse,
} from "@/services/dashboard-overview/bulk-update-api";

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
  });
};


