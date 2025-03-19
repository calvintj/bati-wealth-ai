import { PieChart as RePieChart, Pie, Cell, Label, Tooltip } from "recharts";
import { DataEntry } from "@/types/overview";

interface GaugeChartProps {
  fbiData: DataEntry[];
  customerRisk: string;
}

export default function GaugeChart({ fbiData, customerRisk }: GaugeChartProps) {
  const currentValue = (() => {
    const fbiValue =
      customerRisk === "All"
        ? fbiData.find((item) => item.name === "All")
        : fbiData.find((item) => item.name === customerRisk);
    return fbiValue ? fbiValue.value : 0;
  })();
  const targetValue = 800000;

  // Two slices: "Completed" vs. "Remaining"
  const data = [
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
  ];

  // Dimensions for the chart
  const chartWidth = 300;
  const chartHeight = 150;

  // Center x/y
  const cx = 150; // half of chartWidth
  const cy = 105; // lower this if you see it's cut off

  const innerRadius = 75;
  const outerRadius = 95;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Title above the chart */}
      <div
        className="text-white font-semibold mt-4"
        style={{ fontSize: "1.5rem" }}
      >
        Total FBI
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
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          {/* Main value */}
          <Label
            value={`Rp ${Math.round(currentValue / 1000)}K`}
            position="center"
            dy={-10}
            style={{
              fill: "#FFFFFF",
              fontSize: "24px",
              fontWeight: "bold",
              textAnchor: "middle",
            }}
          />
          {/* Target label */}
          <Label
            value={`Target: Rp ${Math.floor(targetValue / 1000)}K`}
            position="center"
            dy={20}
            style={{
              fill: "#CCCCCC",
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
            border: "none",
            borderRadius: "4px",
            color: "black",
          }}
        />
      </RePieChart>
    </div>
  );
}
