// CHART.JS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartEvent,
  ActiveElement,
  ChartOptions,
  // Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// IMPORT THE PLUGIN
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  // Tooltip,
  ChartDataLabels
);

// HOOKS
import { useCustomerList } from "../../hooks/customer-mapping/use-customer-list";
import { useState } from "react";
import { CustomerList } from "@/types/page/customer-list";

interface StackedBarChartProps {
  setPropensity: (propensity: string) => void;
  setAum: (aum: string) => void;
}

interface SelectedBar {
  aumIndex: number;
  propIndex: number;
}

// Add proper typing for chart data
interface ChartDataPoint {
  x: string;
  y: number;
  actualCount: number;
}

// Add interfaces for Chart.js types
interface ChartContext {
  chart: {
    data: {
      labels: string[];
    };
  };
  dataset: {
    data: ChartDataPoint[];
    label: string;
  };
  dataIndex: number;
}

const StackedBarChart = ({ setPropensity, setAum }: StackedBarChartProps) => {
  // Fetch customer data using a custom hook
  const customerList = useCustomerList() as CustomerList[];

  // Add state to track selected bar
  const [selectedBar, setSelectedBar] = useState<SelectedBar | null>(null);

  // Define categories for AUM (x-axis) and Propensity (y-axis)
  const aumCategories = ["Zero", "Low", "Medium", "High"];
  const propensityCategories = ["Low", "Medium", "High", "Qualified"];

  // -- MAPPING FUNCTIONS ------------------------------------------------------
  const mapAumToCategory = (aumLabel: string) => {
    if (!aumLabel) return "Low";
    if (aumLabel.includes("Zero")) return "Zero";
    if (aumLabel.includes("Low")) return "Low";
    if (aumLabel.includes("Medium")) return "Medium";
    if (aumLabel.includes("High")) return "High";
    return "Low";
  };

  const mapPropensityToCategory = (propensity: string) => {
    if (!propensity) return "Low";
    if (propensity.includes("Low")) return "Low";
    if (propensity.includes("Medium")) return "Medium";
    if (propensity.includes("High")) return "High";
    if (propensity.includes("Qualified")) return "Qualified";
    return "Low";
  };
  // ---------------------------------------------------------------------------

  // Build a 4x4 matrix of raw counts: countMatrix[aum][propensity]
  const generateHeatmapData = () => {
    const countMatrix: Record<string, Record<string, number>> = {};
    // Build matrix with raw counts
    aumCategories.forEach((aum) => {
      countMatrix[aum] = {};
      propensityCategories.forEach((prop) => {
        countMatrix[aum][prop] = 0;
      });
    });

    customerList.forEach((customer) => {
      const aumCat = mapAumToCategory(customer["AUM Label"] || "");
      const propCat = mapPropensityToCategory(customer.Propensity || "");
      countMatrix[aumCat][propCat] += 1;
    });

    // Convert raw counts to 1/0
    return {
      labels: aumCategories,
      datasets: propensityCategories.map((propensity, propIndex) => {
        return {
          label: `${propensity} Propensity`,
          data: aumCategories.map((aum) => {
            const rawCount = countMatrix[aum][propensity];
            const value = rawCount > 0 ? 1 : 0; // 1 if nonempty
            return {
              x: aum,
              y: value,
              actualCount: rawCount,
            };
          }),
          backgroundColor: aumCategories.map((_, aumIndex) => {
            // If we have a selected bar, make all other bars gray
            if (selectedBar) {
              const isSelected =
                selectedBar.aumIndex === aumIndex &&
                selectedBar.propIndex === propIndex;

              return isSelected
                ? aumIndex + propIndex === aumCategories.length - 1
                  ? "#FBB716"
                  : aumIndex + propIndex < aumCategories.length - 1
                  ? "#F52720"
                  : "#01ACD2"
                : "#808080"; // gray-400 for non-selected bars
            } else {
              // Original coloring when no bar is selected
              if (aumIndex + propIndex === aumCategories.length - 1)
                return "#FBB716";
              else if (aumIndex + propIndex < aumCategories.length - 1)
                return "#F52720";
              else return "#01ACD2";
            }
          }),
        };
      }),
    };
  };

  // Chart configuration
  const options = {
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const { index: aumIndex, datasetIndex: propIndex } = elements[0];
        const aumCategory = aumCategories[aumIndex];
        const propensityCategory = propensityCategories[propIndex];
        const actualCount = data.datasets[propIndex].data[aumIndex].actualCount;

        console.log("Clicked on:", {
          aumCategory,
          propensityCategory,
          count: actualCount,
        });

        // Set the selected bar
        setSelectedBar({ aumIndex, propIndex });

        setPropensity(propensityCategory);
        setAum(aumCategory);
      } else {
        // When clicking outside of a bar, set both filters to "All"
        console.log("Clicked outside bars - resetting filters to All");
        setSelectedBar(null);
        setPropensity("All");
        setAum("All");
      }
    },
    plugins: {
      title: {
        display: true,
        text: "Pemetaan Nasabah",
        font: {
          size: 24,
        },
        color: "white",
      },
      datalabels: {
        // Only show the label if the bar > 0
        display: (context: ChartContext) => {
          const { y } = context.dataset.data[context.dataIndex];
          return y > 0; // show label only if there's a nonzero segment
        },
        // Position the label inside the bar
        anchor: "center",
        align: "center",
        color: "white",
        font: {
          weight: "bold",
          size: 11,
        },
        // Format what the label displays
        formatter: (value: unknown, context: ChartContext) => {
          // Get the actual count
          const actualCount =
            context.dataset.data[context.dataIndex].actualCount || 0;
          // Get AUM category (from x-axis)
          const aumCategory = context.chart.data.labels[context.dataIndex];
          // Get propensity category (from dataset label)
          const propensityCategory = context.dataset.label.split(" ")[0]; // Extract first word

          return `Total: ${actualCount}\nAUM: ${aumCategory}\nPropensity: ${propensityCategory}`;
        },
      },
      // tooltip: {
      //   callbacks: {
      //     label: function (context) {
      //       const { dataset, raw } = context;
      //       const actualCount = raw.actualCount || 0;
      //       return `${dataset.label} in ${context.label} AUM: ${actualCount} customers`;
      //     },
      //   },
      // },
    },
    scales: {
      y: {
        min: 0,
        max: 4,
        stepSize: 1,
        stacked: true,
        title: {
          display: true,
          text: "Propensity",
          color: "#FFFFFF",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          callback: function (value: number) {
            // Show text labels at 1,2,3,4 if desired
            switch (value) {
              case 1:
                return "Low";
              case 2:
                return "Medium";
              case 3:
                return "High";
              case 4:
                return "Qualified";
              default:
                return "";
            }
          },
          color: "#FFFFFF",
        },
        grid: {
          /* ... */
        },
      },
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Assets Under Management (AUM)",
          color: "#FFFFFF",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: "#FFFFFF",
        },
        /* ... */
      },
    },
  };

  // Generate the data for the chart
  const data = generateHeatmapData();

  return (
    <div className="w-full h-full p-4">
      <Bar
        data={data}
        options={options as unknown as ChartOptions<"bar">}
        className="cursor-pointer"
      />
    </div>
  );
};

export default StackedBarChart;
