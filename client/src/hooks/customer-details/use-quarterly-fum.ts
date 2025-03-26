import { useQuery } from "@tanstack/react-query";
import { DataEntry } from "@/components/customer-details/quarterly-fum";
import fetchQuarterlyFUM from "@/services/customer-details/quarterly-fum-api";

export function useQuarterlyFUM(
  customerID: string,
  selectedAsset: string
): DataEntry[] {
  const { data, error, isLoading } = useQuery<DataEntry[]>({
    queryKey: ["quarterlyFUM", customerID, selectedAsset],
    queryFn: async () => {
      const result = await fetchQuarterlyFUM(customerID);

      return result.map((entry) => ({
        name: `Q${entry.quarter} ${entry.year}`, // Format like "Q1 2023"
        value:
          selectedAsset.toLowerCase() === "overall"
            ? entry.total_fum
            : selectedAsset.toLowerCase() === "deposito"
            ? entry.deposito
            : entry.casa,
      }));
    },
  });

  if (isLoading) {
    console.log("Loading quarterly FUM data...");
    return [];
  }

  if (error) {
    console.error("Error fetching quarterly FUM data:", error);
    return [];
  }

  return data || [];
}
