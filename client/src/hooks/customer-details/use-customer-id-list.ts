// hooks/customerDetails-hook/customerDetails.js
import { useQuery } from "@tanstack/react-query";
import fetchCustomerIDList from "../../services/customer-details/customer-id-list-api";
import { CustomerDetails } from "@/types/page/customer-details";

export function useCustomerIDList() {
  const { data, error, isLoading } = useQuery<CustomerDetails[], Error>({
    queryKey: ["customerIDList"],
    queryFn: async () => {
      const customerDetails = await fetchCustomerIDList();
      return customerDetails || [];
    },
  });

  return { data: data || [], error, isLoading };
}
