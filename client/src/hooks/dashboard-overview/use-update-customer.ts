import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCustomerInfo,
  CustomerUpdateData,
} from "@/services/dashboard-overview/customer-update-api";

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
  });
};


