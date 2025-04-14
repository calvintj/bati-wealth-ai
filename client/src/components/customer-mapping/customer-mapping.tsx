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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSwipeable } from "react-swipeable";
import { useTheme } from "next-themes";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels
);

// HOOKS
import { useCustomerList } from "../../hooks/customer-mapping/use-customer-list";
import { useState, useEffect } from "react";
import { CustomerList } from "@/types/page/customer-list";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

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
  const { theme } = useTheme();

  // Add state to track selected bar
  const [selectedBar, setSelectedBar] = useState<SelectedBar | null>(null);

  // Add state for mobile detection and carousel
  const [isMobile, setIsMobile] = useState(false);
  const [currentAumIndex, setCurrentAumIndex] = useState(0);

  // Define categories for AUM (x-axis) and Propensity (y-axis)
  const aumCategories = ["Zero", "Low", "Medium", "High"];
  const propensityCategories = ["Low", "Medium", "High", "Qualified"];

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Generate mobile carousel data for a specific AUM category
  const generateMobileCarouselData = (aumIndex: number) => {
    const data = generateHeatmapData();
    return {
      labels: [aumCategories[aumIndex]],
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        data: [dataset.data[aumIndex]],
        backgroundColor: [dataset.backgroundColor[aumIndex]],
      })),
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
          color: theme === "dark" ? "#FFFFFF" : "#000000",
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
          color: theme === "dark" ? "#FFFFFF" : "#000000",
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
          color: theme === "dark" ? "#FFFFFF" : "#000000",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: theme === "dark" ? "#FFFFFF" : "#000000",
        },
        /* ... */
      },
    },
  };

  // Modify the options for mobile view
  const getMobileOptions = () => {
    return {
      ...options,
      maintainAspectRatio: false,
      scales: {
        ...options.scales,
        x: {
          ...options.scales.x,
          grid: {
            display: false,
          },
        },
        y: {
          ...options.scales.y,
          grid: {
            display: false,
          },
        },
      },
    };
  };

  // Generate the data for the chart
  const data = generateHeatmapData();
  const mobileData = generateMobileCarouselData(currentAumIndex);
  const mobileOptions = getMobileOptions();

  // Handle carousel navigation
  const handlePrevAum = () => {
    setCurrentAumIndex((prev) =>
      prev > 0 ? prev - 1 : aumCategories.length - 1
    );
  };

  const handleNextAum = () => {
    setCurrentAumIndex((prev) =>
      prev < aumCategories.length - 1 ? prev + 1 : 0
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextAum(),
    onSwipedRight: () => handlePrevAum(),
    preventScrollOnSwipe: true,
    trackMouse: false,
    swipeDuration: 500,
    delta: 10, // minimum swipe distance
  });

  return (
    <div className="w-full h-full">
      {isMobile ? (
        <div className="flex flex-col items-center w-full">
          <div
            className="relative w-full h-[60vh] min-h-[300px] touch-pan-y"
            {...handlers}
          >
            <Bar
              data={mobileData}
              options={
                {
                  ...mobileOptions,
                  maintainAspectRatio: false,
                  responsive: true,
                  onClick: (event: ChartEvent, elements: ActiveElement[]) => {
                    if (elements.length > 0) {
                      const { index: aumIndex, datasetIndex: propIndex } =
                        elements[0];
                      const aumCategory = aumCategories[aumIndex];
                      const propensityCategory =
                        propensityCategories[propIndex];
                      setSelectedBar({ aumIndex, propIndex });
                      setPropensity(propensityCategory);
                      setAum(aumCategory);
                    }
                  },
                } as unknown as ChartOptions<"bar">
              }
              className="cursor-pointer"
            />
            <div className="absolute inset-x-0 top-2/3 flex justify-between -translate-y-1/2 pointer-events-none">
              <button
                onClick={handlePrevAum}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 flex items-center justify-center shadow-lg pointer-events-auto md:hidden"
                aria-label="Previous AUM category"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextAum}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 flex items-center justify-center shadow-lg pointer-events-auto md:hidden"
                aria-label="Next AUM category"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {aumCategories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAumIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentAumIndex === index ? "bg-white w-4" : "bg-white/50"
                }`}
                aria-label={`Go to ${aumCategories[index]} AUM category`}
              />
            ))}
          </div>
          <div className="mt-2 text-black dark:text-white text-center font-medium">
            {aumCategories[currentAumIndex]} AUM
          </div>
        </div>
      ) : (
        <div className="w-full h-[60vh]">
          <Bar
            data={data}
            options={
              {
                ...options,
                maintainAspectRatio: false,
                responsive: true,
              } as unknown as ChartOptions<"bar">
            }
            className="cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default StackedBarChart;
