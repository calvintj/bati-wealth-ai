import { useQuery } from "@tanstack/react-query";
import { DataEntry } from "@/components/customer-details/quarterly-aum";
import fetchQuarterlyAUM from "@/services/customer-details/quarterly-aum-api";

export function useQuarterlyAUM(
  customerID: string,
  selectedAsset: string
): DataEntry[] {
  const { data, error, isLoading } = useQuery<DataEntry[]>({
    queryKey: ["quarterlyAUM", customerID, selectedAsset],
    queryFn: async () => {
      const result = await fetchQuarterlyAUM(customerID);

      return result.map((entry) => ({
        name: `Q${entry.quarter} ${entry.year}`, // Format like "Q1 2023"
        value:
          selectedAsset.toLowerCase() === "overall"
            ? entry.total_aum
            : selectedAsset.toLowerCase() === "sb"
            ? entry.sb
            : selectedAsset.toLowerCase() === "rd"
            ? entry.rd
            : entry.bac,
      }));
    },
  });

  if (isLoading) {
    console.log("Loading quarterly AUM data...");
    return [];
  }

  if (error) {
    console.error("Error fetching quarterly AUM data:", error);
    return [];
  }

  return data || [];
}