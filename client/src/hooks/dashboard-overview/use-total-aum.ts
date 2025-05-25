import fetchTotalAUM from "@/services/dashboard-overview/total-aum-api";
import { DataEntry, TotalAUM } from "@/types/page/overview";
import { useQuery } from "@tanstack/react-query";

export function useTotalAUM(customerRisk: string): DataEntry[] {
  const { data: chartData = [] } = useQuery({
    queryKey: ["totalAUM", customerRisk],
    queryFn: async () => {
      try {
        const result: TotalAUM = await fetchTotalAUM();
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
