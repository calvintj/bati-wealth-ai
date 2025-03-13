import { useState, useEffect } from "react";
import fetchOptimizedPortfolio from "../../services/customer-details/optimized-portfolio-api";

interface OptimizedPortfolio {
  asset_type: string;
  recommended_allocation: string;
}

const useOptimizedPortfolio = (customerID: string) => {
  const [optimizedPortfolio, setOptimizedPortfolio] = useState<OptimizedPortfolio[]>([]);
  const [transformedData, setTransformedData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getOptimizedPortfolio = async () => {
      try {
        setLoading(true);
        const data = await fetchOptimizedPortfolio(customerID);
        console.log("Raw data from API:", data);

        setOptimizedPortfolio(data);

        // Transform portfolio data for the pie chart
        if (data && data.length > 0) {
          console.log("Data exists and has length > 0");
          const transformed = data
            .map((item: OptimizedPortfolio) => {
              console.log("Processing item:", item);
              console.log("asset_type:", item.asset_type);
              console.log(
                "recommended_allocation:",
                item.recommended_allocation
              );
              return {
                name: item.asset_type,
                value: parseFloat(item.recommended_allocation) || 0,
              };
            })
            .filter((item: { value: number }) => item.value > 0);

          console.log("Final transformed data:", transformed);
          setTransformedData(transformed);
        } else {
          console.log("Data is empty or invalid:", data);
          setTransformedData([]);
        }

        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    if (customerID) {
      getOptimizedPortfolio();
    }
  }, [customerID]);

  console.log("transformedData:", transformedData);
  console.log("optimizedPortfolio:", optimizedPortfolio);
  return { optimizedPortfolio, transformedData, loading, error };
};

export default useOptimizedPortfolio;
