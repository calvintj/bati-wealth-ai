import fetchTotalFBI from "@/services/dashboard-overview/total-fbi-api";
import { DataEntry, TotalFBI } from "@/types/page/overview";
import { useQuery } from "@tanstack/react-query";

export function useTotalFBI(customerRisk: string): DataEntry[] {
  const { data: chartData = [] } = useQuery({
    queryKey: ["totalFBI", customerRisk],
    queryFn: async () => {
      try {
        const result: TotalFBI = await fetchTotalFBI();
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
