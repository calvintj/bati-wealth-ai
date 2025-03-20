import { useQuery } from "@tanstack/react-query";
import fetchOptimizedPortfolio from "../../services/customer-details/optimized-portfolio-api";
import { OptimizedPortfolio } from "@/types/page/customer-details";

type PieData = {
  name: string;
  value: number;
};

interface OptimizedPortfolioResult {
  optimizedPortfolio: OptimizedPortfolio[];
  transformedData: PieData[];
}

const useOptimizedPortfolio = (customerID: string) => {
  const {
    data,
    error,
    isLoading: loading,
  } = useQuery<OptimizedPortfolioResult, Error>({
    queryKey: ["optimizedPortfolio", customerID],
    queryFn: async () => {
      const portfolioData = await fetchOptimizedPortfolio(customerID);
      console.log("Raw portfolio data:", portfolioData); // Debug log

      if (!portfolioData || portfolioData.length === 0) {
        console.log("No portfolio data found"); // Debug log
        return {
          optimizedPortfolio: [],
          transformedData: [],
        };
      }

      const result = {
        optimizedPortfolio: portfolioData,
        transformedData: portfolioData
          .map((item) => ({
            name: item.asset_type,
            value: Number(item.recommended_allocation),
          }))
          .filter((item) => item.value > 0),
      };
      return result;
    },
    enabled: !!customerID,
  });

  return {
    optimizedPortfolio: data?.optimizedPortfolio ?? [],
    transformedData: data?.transformedData ?? [],
    loading,
    error,
  };
};

export default useOptimizedPortfolio;
