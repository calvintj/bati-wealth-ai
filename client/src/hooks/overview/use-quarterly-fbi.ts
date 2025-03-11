import { useState, useEffect } from "react";
import fetchQuarterlyFBI from "@/services/overview/quarterly-fbi-api";
import { DataEntry } from "@/components/overview/quarterly-fbi";

export function useQuarterlyFBI(customerRisk: string): DataEntry[] {
  const [chartData, setChartData] = useState<DataEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Call the API. If needed, pass customerRisk here.
        const result = await fetchQuarterlyFBI();
        const formattedData: DataEntry[] = [];

        // Process each year and quarter
        result.forEach(
          (yearData: {
            year: string;
            quarters: {
              all: Record<string, number>;
              conservative: Record<string, number>;
              balanced: Record<string, number>;
              moderate: Record<string, number>;
              growth: Record<string, number>;
              aggressive: Record<string, number>;
            };
          }) => {
            ["q1", "q2", "q3", "q4"].forEach((quarter) => {
              const quarterValue = yearData.quarters;
              const entries: DataEntry[] = [
                {
                  name: `All ${yearData.year} ${quarter.toUpperCase()}`,
                  value: quarterValue.all[quarter] || 0,
                },
                {
                  name: `Conservative ${
                    yearData.year
                  } ${quarter.toUpperCase()}`,
                  value: quarterValue.conservative[quarter] || 0,
                },
                {
                  name: `Balanced ${yearData.year} ${quarter.toUpperCase()}`,
                  value: quarterValue.balanced[quarter] || 0,
                },
                {
                  name: `Moderate ${yearData.year} ${quarter.toUpperCase()}`,
                  value: quarterValue.moderate[quarter] || 0,
                },
                {
                  name: `Growth ${yearData.year} ${quarter.toUpperCase()}`,
                  value: quarterValue.growth[quarter] || 0,
                },
                {
                  name: `Aggressive ${yearData.year} ${quarter.toUpperCase()}`,
                  value: quarterValue.aggressive[quarter] || 0,
                },
              ].filter((entry) => entry.value !== 0);

              formattedData.push(...entries);
            });
          }
        );

        console.log("Formatted data:", formattedData);
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching quarterly FBI data:", error);
      }
    };

    loadData();
  }, [customerRisk]);

  return chartData;
}
