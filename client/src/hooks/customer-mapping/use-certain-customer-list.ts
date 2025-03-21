import fetchCertainCustomerList from "../../services/customer-mapping/certain-customer-list-api";
import { CertainCustomerList } from "@/types/page/customer-list";
import { useQuery } from "@tanstack/react-query";

export function useCertainCustomerList(propensity: string, aum: string) {
  const { data, error, isLoading } = useQuery<CertainCustomerList[], Error>({
    queryKey: ["certainCustomerList", propensity, aum],
    queryFn: async () => {
      const customerList = await fetchCertainCustomerList(propensity, aum);
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
