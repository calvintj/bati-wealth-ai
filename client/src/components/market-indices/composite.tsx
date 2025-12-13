// components/CompositeChart.tsx
import React from "react";
import useSWR from "swr";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ReferenceLine,
} from "recharts";
import { IndexCard } from "../ui/index-card";

export interface CompositePoint {
  report_date: string;
  close_price: number;
  change_percent: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const CompositeChart: React.FC = () => {
  const { data, error } = useSWR<CompositePoint[]>(
    "/api/market-indices/composite",
    fetcher
  );

  if (error) {
    console.error("Composite Chart Error:", error);
    return (
      <div className="flex items-center justify-center h-64 text-red-600 text-center bg-red-50 dark:bg-red-900/20 rounded-md m-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>Error memuat data IHSG.</p>
          <p className="text-sm mt-2">Detail error: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0)
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md m-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-2"></div>
          <p>Memuat data grafik...</p>
        </div>
      </div>
    );

  const latestDataPoint = data[data.length - 1];
  if (!latestDataPoint || latestDataPoint.change_percent === undefined) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md m-4">
        <p>Tidak ada data tersedia</p>
      </div>
    );
  }

  const color =
    latestDataPoint.change_percent < 0
      ? "#ef4444"
      : latestDataPoint.change_percent > 0
      ? "#22c55e"
      : "#9ca3af";
  const previousClose = data.length > 1 ? data[data.length - 2].close_price : 0;
  const changeValue = latestDataPoint.close_price - previousClose;

  // Calculate min and max values for better visualization
  const prices = data.map((item) => item.close_price);
  const minValue = Math.min(...prices) * 0.995; // add 0.5% padding
  const maxValue = Math.max(...prices) * 1.005;

  const formattedDate = new Date(
    latestDataPoint.report_date
  ).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <IndexCard
      title="IDX Composite"
      symbol="IHSG"
      currentValue={latestDataPoint.close_price}
      changeValue={changeValue}
      changePercent={latestDataPoint.change_percent}
      date={formattedDate}
    >
      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient
                id={`compositeGradient-${color.substring(1)}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="rgba(156, 163, 175, 0.2)"
            />
            <XAxis
              dataKey="report_date"
              tickFormatter={(dateStr) => {
                const date = new Date(dateStr);
                return `${date.toLocaleString("id-ID", {
                  month: "short",
                  day: "numeric",
                })}`;
              }}
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              interval="preserveStartEnd"
              minTickGap={50}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              domain={[minValue, maxValue]}
              tickFormatter={(val) =>
                val.toLocaleString("id-ID", { maximumFractionDigits: 0 })
              }
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              width={60}
            />
            <Tooltip
              content={({ payload, label }) => {
                if (payload && payload.length > 0 && payload[0].value != null) {
                  const date = new Date(label);
                  const formattedDate = date.toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const value = payload[0].value as number;
                  const dataPoint = data.find((d) => d.report_date === label);

                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                      <div className="text-sm font-medium mb-1">
                        {formattedDate}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500 dark:text-gray-400">
                            Tutup:
                          </span>
                          <span className="font-semibold">
                            {value.toLocaleString("id-ID", {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        {dataPoint && dataPoint.change_percent !== undefined && (
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500 dark:text-gray-400">
                              Perubahan:
                            </span>
                            <span
                              className={`font-semibold ${
                                dataPoint.change_percent < 0
                                  ? "text-red-500"
                                  : dataPoint.change_percent > 0
                                  ? "text-green-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {dataPoint.change_percent > 0 ? "+" : ""}
                              {dataPoint.change_percent.toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={previousClose}
              strokeDasharray="3 3"
              stroke="#6B7280"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="close_price"
              fill={`url(#compositeGradient-${color.substring(1)})`}
              strokeWidth={0}
            />
            <Line
              type="monotone"
              dataKey="close_price"
              stroke={color}
              dot={false}
              strokeWidth={2}
              activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </IndexCard>
  );
};
