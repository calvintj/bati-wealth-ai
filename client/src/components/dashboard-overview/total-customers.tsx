import { useState, useEffect } from "react";
import { PieChart as RePieChart, Pie, Cell, Label, Tooltip } from "recharts";
import { DataEntry } from "@/types/page/overview";

interface GaugeChartProps {
  customerData: DataEntry[];
  customerRisk: string;
}

export default function GaugeChart({
  customerData,
  customerRisk,
}: GaugeChartProps) {
  // Use state to store chart width to avoid SSR issues with window
  const [chartWidth, setChartWidth] = useState(300);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setChartWidth(Math.min(300, window.innerWidth * 0.8));
    }
  }, []);

  const chartHeight = chartWidth * 0.5;
  const cx = chartWidth / 2;
  const cy = chartHeight * 0.7;
  const innerRadius = chartWidth * 0.25;
  const outerRadius = chartWidth * 0.32;

  // Determine the current value based on customerRisk
  const currentValue = (() => {
    const customerValue =
      customerRisk === "All"
        ? customerData.find((item) => item.name === "All")
        : customerData.find((item) => item.name === customerRisk);
    return customerValue ? customerValue.value : 0;
  })();

  const targetValue = 500;

  const data = [
    {
      name: "Completed",
      value: currentValue > targetValue ? targetValue : currentValue,
      color: "#F52720",
    },
    {
      name: "Remaining",
      value: currentValue >= targetValue ? 0 : targetValue - currentValue,
      color: "#FFFFFF",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Title above the chart */}
      <div
        className="text-black dark:text-white font-semibold mt-4"
        style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}
      >
        Jumlah Nasabah
      </div>

      <RePieChart width={chartWidth} height={chartHeight}>
        <Pie
          dataKey="value"
          data={data}
          startAngle={180}
          endAngle={0}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          stroke="var(--border)"
          strokeWidth={1}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          {/* Main value */}
          <Label
            value={currentValue}
            position="center"
            className="text-black dark:text-white"
            dy={-10}
            style={{
              fill: "currentColor",
              fontSize: `${chartWidth * 0.08}px`,
              fontWeight: "bold",
              textAnchor: "middle",
            }}
          />
          {/* Target label */}
          <Label
            value={`Target: ${targetValue}`}
            position="center"
            className="text-black dark:text-white"
            dy={20}
            style={{
              fill: "currentColor",
              fontSize: `${chartWidth * 0.047}px`,
              textAnchor: "middle",
            }}
          />
        </Pie>
        <Tooltip
          formatter={(value, name) => {
            if (name === "Completed") {
              return `${currentValue.toLocaleString()}`;
            }
            return `${(targetValue - currentValue).toLocaleString()}`;
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
