import { useQuery } from "@tanstack/react-query";
import { CertainCustomerList } from "@/types/overview";
import fetchCertainCustomerList from "../../services/overview/customer-list-api";

// Helper function to map the customerRisk to the format expected by the backend
function mapCustomerRiskToAPI(customerRisk: string): string {
  switch (customerRisk) {
    case "Conservative":
      return "1 - Conservative";
    case "Balanced":
      return "2 - Balanced";
    case "Moderate":
      return "3 - Moderate";
    case "Growth":
      return "4 - Growth";
    case "Aggressive":
      return "5 - Aggressive";
    default:
      return customerRisk;
  }
}

export function useCertainCustomerList(customerRisk: string) {
  // Map the customerRisk to the format expected by the backend
  const formattedRisk = mapCustomerRiskToAPI(customerRisk);

  // useQuery to fetch customer list based on risk profile and rm_number
  const { data, isLoading, error } = useQuery<CertainCustomerList[], Error>({
    queryKey: ["customerList", formattedRisk],
    queryFn: () => fetchCertainCustomerList(formattedRisk),
    enabled: customerRisk !== "All", // Only fetch data if the customerRisk is valid
  });

  if (isLoading) return { customerList: [], isLoading, error };
  if (error) return { customerList: [], error, isLoading };

  return { customerList: data ?? [], isLoading, error };
}
