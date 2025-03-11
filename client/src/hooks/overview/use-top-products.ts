import { useState, useEffect } from "react";
import fetchTopProducts from "../../services/overview/top-products-api";

export function useTopProducts(customerRisk) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTopProducts(customerRisk);
        let filteredData = [];

        // Filter data based on customerRisk
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

        setChartData(filteredData);
      } catch (error) {
        console.error("Error loading top products:", error);
      }
    };

    loadData();
  }, [customerRisk]);

  return [chartData, setChartData];
}
