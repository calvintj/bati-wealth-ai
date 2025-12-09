import { useQuery } from "@tanstack/react-query";
import fetchEconomicIndicators from "@/services/market-news/economic-indicators-api";
import { EconomicIndicator } from "@/services/market-news/economic-indicators-api";

export interface EconomicIndicatorsData {
  gdpGrowth: EconomicIndicator | null;
  biRate: EconomicIndicator | null;
  inflationRate: EconomicIndicator | null;
}

export function useEconomicIndicators() {
  return useQuery<EconomicIndicatorsData, Error>({
    queryKey: ["economicIndicators"],
    queryFn: fetchEconomicIndicators,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
    retry: 2,
  });
}

export default useEconomicIndicators;

