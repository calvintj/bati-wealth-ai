import { useState, useEffect } from "react";
import fetchTotalFBI from "../../services/overview/total-fbi-api";
import { DataEntry } from "@/types/overview";

export function useTotalFBI(customerRisk: string): DataEntry[] {
  const [chartData, setChartData] = useState<DataEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchTotalFBI();
        const formattedData: DataEntry[] = [
          {
            name: "All",
            value: result.all || 0,
          },
          {
            name: "Conservative",
            value: result.conservative || 0,
          },
          { name: "Balanced", value: result.balanced || 0 },
          { name: "Moderate", value: result.moderate || 0 },
          { name: "Growth", value: result.growth || 0 },
          { name: "Aggressive", value: result.aggressive || 0 },
        ];
        console.log("Formatted data:", formattedData);
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    loadData();
  }, [customerRisk]);

  return chartData;
}
