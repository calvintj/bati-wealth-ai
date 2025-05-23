import { useState, useEffect } from "react";
import { PieChart as RePieChart, Pie, Cell, Label, Tooltip } from "recharts";
import { DataEntry } from "@/types/page/overview";

interface GaugeChartProps {
  fbiData: DataEntry[];
  customerRisk: string;
}

export default function GaugeChart({ fbiData, customerRisk }: GaugeChartProps) {
  const [chartData, setChartData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Process data in useEffect to allow for animation
  useEffect(() => {
    setIsLoading(true);

    // Add a small delay to ensure animation plays
    const timer = setTimeout(() => {
      const currentValue = (() => {
        const fbiValue =
          customerRisk === "All"
            ? fbiData.find((item) => item.name === "All")
            : fbiData.find((item) => item.name === customerRisk);
        return fbiValue ? fbiValue.value : 0;
      })();
      const targetValue = 800000;

      setChartData([
        {
          name: "Completed",
          value: currentValue > targetValue ? targetValue : currentValue,
          color: "#01ACD2",
        },
        {
          name: "Remaining",
          value: currentValue >= targetValue ? 0 : targetValue - currentValue,
          color: "#FFFFFF",
        },
      ]);
      setIsLoading(false);
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }, [fbiData, customerRisk]);

  // Dimensions for the chart
  const chartWidth = 300;
  const chartHeight = 150;

  // Center x/y
  const cx = 150; // half of chartWidth
  const cy = 105; // lower this if you see it's cut off

  const innerRadius = 75;
  const outerRadius = 95;

  // Get current value for display
  const currentValue = chartData[0]?.value || 0;
  const targetValue = 800000;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div
          className="text-black dark:text-white font-semibold mt-4"
          style={{ fontSize: "1.5rem" }}
        >
          Total FBI
        </div>
        <RePieChart width={chartWidth} height={chartHeight}>
          <Pie
            dataKey="value"
            data={[{ name: "Empty", value: 0, color: "#FFFFFF" }]}
            startAngle={180}
            endAngle={0}
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            stroke="var(--border)"
            strokeWidth={1}
          >
            <Cell fill="#FFFFFF" />
          </Pie>
        </RePieChart>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Title above the chart */}
      <div
        className="text-black dark:text-white font-semibold mt-4"
        style={{ fontSize: "1.5rem" }}
      >
        Total FBI
      </div>

      <RePieChart width={chartWidth} height={chartHeight}>
        <Pie
          dataKey="value"
          data={chartData}
          startAngle={180}
          endAngle={0}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          stroke="var(--border)"
          strokeWidth={1}
          isAnimationActive={true}
          animationDuration={1500}
          animationBegin={0}
          animationEasing="ease-out"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          {/* Main value */}
          <Label
            value={`Rp ${Math.round(currentValue / 1000)}K`}
            position="center"
            className="text-black dark:text-white"
            dy={-10}
            style={{
              fill: "currentColor",
              fontSize: "24px",
              fontWeight: "bold",
              textAnchor: "middle",
            }}
          />
          {/* Target label */}
          <Label
            value={`Target: Rp ${Math.floor(targetValue / 1000)}K`}
            position="center"
            className="text-black dark:text-white"
            dy={20}
            style={{
              fill: "currentColor",
              fontSize: "14px",
              textAnchor: "middle",
            }}
          />
        </Pie>
        <Tooltip
          formatter={(value, name) => {
            if (name === "Completed") {
              return `Rp ${currentValue.toLocaleString()}`;
            }
            return `Rp ${(targetValue - currentValue).toLocaleString()}`;
          }}
          contentStyle={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            color: "var(--foreground)",
          }}
        />
      </RePieChart>
    </div>
  );
}
