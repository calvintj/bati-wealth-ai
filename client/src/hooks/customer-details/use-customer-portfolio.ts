import { useQuery } from "@tanstack/react-query";
import fetchCustomerPortfolio from "../../services/customer-details/customer-portfolio-api";
import { CustomerPortfolio } from "@/types/page/customer-details";

type PieData = {
  name: string;
  value: number;
};

interface PortfolioResult {
  customerPortfolio: CustomerPortfolio[];
  transformedData: PieData[];
}

const useCustomerPortfolio = (customerID: string) => {
  const {
    data,
    error,
    isLoading: loading,
  } = useQuery<PortfolioResult, Error>({
    queryKey: ["customerPortfolio", customerID],
    queryFn: async () => {
      const portfolioData = await fetchCustomerPortfolio(customerID);
      
      const portfolio = portfolioData?.[0] || null;

      const transformedData = portfolio
        ? [
            { name: "CASA", value: Number(portfolio.casa) || 0 },
            { name: "Saving Bond", value: Number(portfolio.sb) || 0 },
            { name: "Deposito", value: Number(portfolio.deposito) || 0 },
            { name: "Reksadana", value: Number(portfolio.rd) || 0 },
            { name: "BAC", value: Number(portfolio.bac) || 0 },
          ].filter((item) => item.value > 0)
        : [];

      return {
        customerPortfolio: portfolioData,
        transformedData,
      };
    },
    enabled: !!customerID,
  });

  return {
    customerPortfolio: data?.customerPortfolio ?? [],
    transformedData: data?.transformedData ?? [],
    loading,
    error,
  };
};

export default useCustomerPortfolio;
