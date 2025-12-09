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

  useEffect(() => {
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
  }, [fbiData, customerRisk]);

  const chartWidth = 300;
  const chartHeight = 150;
  const cx = 150;
  const cy = 105;
  const innerRadius = 75;
  const outerRadius = 95;

  const currentValue = chartData[0]?.value || 0;
  const targetValue = 800000;

  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div
          className="text-black dark:text-white font-semibold mt-4"
          style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}
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
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className="text-black dark:text-white font-semibold mt-4"
        style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}
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
          content={({ payload }) => {
            if (payload && payload.length > 0) {
              const value = payload[0].value as number;
              const name = payload[0].name as string;

              return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                  <div className="text-sm font-medium mb-1">
                    {name === "Completed" ? "Tercapai" : "Tersisa"}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 dark:text-gray-400">
                        Jumlah:
                      </span>
                      <span className="font-semibold">
                        {name === "Completed"
                          ? `Rp ${currentValue.toLocaleString("id-ID")}`
                          : `Rp ${(targetValue - currentValue).toLocaleString("id-ID")}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
      </RePieChart>
    </div>
  );
}
