import { useState, useEffect } from "react";
import fetchTotalCustomer from "../../services/overview/total-customer-api";

export function useTotalCustomer(customerRisk) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchTotalCustomer(customerRisk);
        const formattedData = [
          {
            name: "All",
            value: result.all || 0,
          },
          {
            name: "Conservative",
            value: result.conservative || 0,
          },
          { name: "Balanced", value: result.balanced || 0 },
          { name: "Moderate", value: result.moderate || 0 },
          { name: "Growth", value: result.growth || 0 },
          { name: "Aggressive", value: result.aggressive || 0 },
        ];
        console.log("Formatted data:", formattedData);
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    loadData();
  }, [customerRisk]);

  return [chartData, setChartData];
}
