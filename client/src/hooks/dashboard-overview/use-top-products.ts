import fetchTopProducts from "../../services/dashboard-overview/top-products-api";
import type { TopProduct } from "@/types/page/overview";
import { useQuery } from "@tanstack/react-query";

export function useTopProducts(customerRisk: string): TopProduct[] {
  const { data, error, isLoading } = useQuery<TopProduct[]>({
    queryKey: ["topProducts", customerRisk],
    queryFn: async () => {
      const data = await fetchTopProducts();

      // Filter data based on customerRisk
      let filteredData: TopProduct[] = [];

      if (customerRisk === "All") {
        filteredData = data.all;
      } else if (customerRisk === "Conservative") {
        filteredData = data.conservative;
      } else if (customerRisk === "Balanced") {
        filteredData = data.balanced;
      } else if (customerRisk === "Moderate") {
        filteredData = data.moderate;
      } else if (customerRisk === "Growth") {
        filteredData = data.growth;
      } else if (customerRisk === "Aggressive") {
        filteredData = data.aggressive;
      }
      return filteredData;
    },
  });

  if (error) {
    console.error("Error loading top products:", error);
    return [];
  }

  return data || [];
}
