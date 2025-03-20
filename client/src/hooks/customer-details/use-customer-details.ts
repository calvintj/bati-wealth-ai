import { useQuery } from "@tanstack/react-query";
import fetchCustomerDetails from "../../services/customer-details/customer-details-api";
import { CustomerDetails } from "@/types/page/customer-details";

export function useCustomerDetails(customerID: string) {
  const { data, isLoading, error } = useQuery<CustomerDetails | null, Error>({
    queryKey: ["customerDetails", customerID],
    queryFn: async () => {
      const result = await fetchCustomerDetails(customerID);
      return result;
    },
  });

  return {
    data: data || null,
    loading: isLoading,
    error,
  };
}
