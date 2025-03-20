import fetchCustomerList from "../../services/customer-list/customer-list-api";
import { CustomerList } from "@/types/page/customer-list";
import { useQuery } from "@tanstack/react-query";

export function useCustomerList() {
  const { data, error, isLoading } = useQuery<CustomerList[], Error>({
    queryKey: ["customerList"],
    queryFn: async () => {
      const customerList = await fetchCustomerList();
      return customerList;
    },
  });

  if (isLoading) {
    console.log("Loading customer list...");
    return [];
  }

  if (error) {
    console.error("Error loading customer list:", error);
    return [];
  }

  console.log("Fetched customer list:", data);
  return data || [];
}
