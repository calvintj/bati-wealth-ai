import { useQuery } from "@tanstack/react-query";
import fetchPortfolio from "@/services/task-manager/manager-portfolio-api";
import { PortfolioResponse, PortfolioRow } from "@/types/task-manager";

interface TransformedData {
  name: string;
  value: number;
}

export interface UsePortfolioResult {
  portfolio: PortfolioRow[];
  transformedData: TransformedData[];
}

const usePortfolio = () => {
  return useQuery<PortfolioResponse, Error, UsePortfolioResult>({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    select: (data: PortfolioResponse) => {
      // Assuming fetchPortfolio returns an object like { portfolio: PortfolioRow[] }
      const portfolioArr = data.portfolio;
      let transformedData: TransformedData[] = [];

      if (portfolioArr && portfolioArr.length > 0) {
        // Get the first item from the portfolio array
        const firstPortfolio = portfolioArr[0];

        // Create the transformed data array for the pie chart
        transformedData = [
          { name: "CASA", value: parseFloat(String(firstPortfolio.casa)) || 0 },
          {
            name: "Saving Bond",
            value: parseFloat(String(firstPortfolio.sb)) || 0,
          },
          {
            name: "Deposito",
            value: parseFloat(String(firstPortfolio.deposito)) || 0,
          },
          {
            name: "Reksadana",
            value: parseFloat(String(firstPortfolio.rd)) || 0,
          },
        ].filter((item) => item.value > 0); // Only include items with a positive value
      }

      // Return both the original portfolio array and the transformed data
      return {
        portfolio: portfolioArr,
        transformedData,
      };
    },
  });
};

export default usePortfolio;
