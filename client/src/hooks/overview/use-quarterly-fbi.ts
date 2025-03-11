import { useState, useEffect } from "react";
import fetchQuarterlyFBI from "../../services/overview/quarterly-fbi-api";

export function useQuarterlyFBI() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchQuarterlyFBI();
        const formattedData = [];

        // Process each year and quarter
        result.forEach((yearData) => {
          ["q1", "q2", "q3", "q4"].forEach((quarter) => {
            const quarterValue = yearData.quarters;
            const entries = [
              {
                name: `All ${yearData.year} ${quarter.toUpperCase()}`,
                value: quarterValue.all[quarter] || 0,
              },
              {
                name: `Conservative ${yearData.year} ${quarter.toUpperCase()}`,
                value: quarterValue.conservative[quarter] || 0,
              },
              {
                name: `Balanced ${yearData.year} ${quarter.toUpperCase()}`,
                value: quarterValue.balanced[quarter] || 0,
              },
              {
                name: `Moderate ${yearData.year} ${quarter.toUpperCase()}`,
                value: quarterValue.moderate[quarter] || 0,
              },
              {
                name: `Growth ${yearData.year} ${quarter.toUpperCase()}`,
                value: quarterValue.growth[quarter] || 0,
              },
              {
                name: `Aggressive ${yearData.year} ${quarter.toUpperCase()}`,
                value: quarterValue.aggressive[quarter] || 0,
              },
            ].filter((entry) => entry.value !== 0);

            formattedData.push(...entries);
          });
        });

        console.log("Formatted data:", formattedData);
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    loadData();
  }, []);

  return [chartData, setChartData];
}
