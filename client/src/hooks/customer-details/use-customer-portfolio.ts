import { useState, useEffect } from "react";
import fetchCustomerPortfolio from "../../services/customer-details/customer-portfolio-api";

const useCustomerPortfolio = (customerID) => {
  const [customerPortfolio, setCustomerPortfolio] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCustomerPortfolio = async () => {
      try {
        setLoading(true);
        const data = await fetchCustomerPortfolio(customerID);
        setCustomerPortfolio(data);

        // Transform portfolio data for the pie chart
        if (data && data.length > 0) {
          const portfolio = data[0]; // Get the first item from the array

          const transformed = [
            { name: "CASA", value: parseFloat(portfolio?.casa) || 0 },
            { name: "Saving Bond", value: parseFloat(portfolio?.sb) || 0 },
            { name: "Deposito", value: parseFloat(portfolio?.deposito) || 0 },
            { name: "Reksadana", value: parseFloat(portfolio?.rd) || 0 },
          ].filter((item) => item.value > 0); // Only include items with values > 0

          setTransformedData(transformed);
        } else {
          setTransformedData([]);
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (customerID) {
      getCustomerPortfolio();
    }
  }, [customerID]);

  console.log("transformedData:", transformedData);
  console.log("customerPortfolio:", customerPortfolio);
  return { customerPortfolio, transformedData, loading, error };
};

export default useCustomerPortfolio;
