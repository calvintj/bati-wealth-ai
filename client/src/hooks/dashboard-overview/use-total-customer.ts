import fetchTotalCustomer from "@/services/dashboard-overview/total-customer-api";
import { DataEntry, TotalCustomer } from "@/types/page/overview";
import { useQuery } from "@tanstack/react-query";

export function useTotalCustomer(customerRisk: string): DataEntry[] {
  const { data: chartData = [] } = useQuery({
    queryKey: ["totalCustomer", customerRisk],
    queryFn: async () => {
      try {
        const result: TotalCustomer = await fetchTotalCustomer();
        const formattedData: DataEntry[] = [
          { name: "All", value: result.all || 0 },
          { name: "Conservative", value: result.conservative || 0 },
          { name: "Balanced", value: result.balanced || 0 },
          { name: "Moderate", value: result.moderate || 0 },
          { name: "Growth", value: result.growth || 0 },
          { name: "Aggressive", value: result.aggressive || 0 },
        ];
        return formattedData;
      } catch (error) {
        console.error("Error fetching customer data:", error);
        return [];
      }
    },
  });

  return chartData;
}
