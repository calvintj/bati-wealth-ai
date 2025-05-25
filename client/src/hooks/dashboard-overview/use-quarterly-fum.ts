import { useQuery } from "@tanstack/react-query";
import { DataEntry } from "@/components/dashboard-overview/quarterly-fum";
import fetchQuarterlyFUM from "@/services/dashboard-overview/quarterly-fum-api";

export function useQuarterlyFUM(customerRisk: string): DataEntry[] {
  const { data, error, isLoading } = useQuery<DataEntry[]>({
    queryKey: ["quarterlyFUM", customerRisk],
    queryFn: async () => {
      const result = await fetchQuarterlyFUM();
      const formattedData: DataEntry[] = [];

      // Process each year and quarter
      result.forEach(
        (yearData: {
          year: number;
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
            const entries = [
              {
                name: `All ${yearData.year} ${quarter.toUpperCase()}`,
                value: quarterValue.all[quarter] || 0,
              },
              {
                name: `Conservative ${yearData.year} ${quarter.toUpperCase()}`,
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

      return formattedData;
    },
  });

  if (error) {
    console.error("Error fetching quarterly FBI data:", error);
    return [];
  }

  return data || [];
}
