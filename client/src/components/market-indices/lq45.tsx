// components/CompositeChart.tsx
import React from 'react';
import useSWR from 'swr';
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart
} from 'recharts';

export interface LQ45Point {
  report_date: string;
  close_price: number;
  change_percent: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const LQ45Chart: React.FC = () => {
    const { data, error } = useSWR<LQ45Point[]>(
    "/api/market-indices/lq45",
    fetcher
  );

  if (error) return <div className="text-red-600">Error loading IHSG data.</div>;
  if (!data) return <div>Loading chart…</div>;

  const color =
    data[data.length - 1].change_percent < 0
      ? "#ef4444"
      : data[data.length - 1].change_percent > 0
      ? "#22c55e"
      : "#9ca3af";

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center gap-4">
        <p className="text-2xl font-bold text-black dark:text-white">LQ45</p>
        <p
          className={`text-lg font-bold ${
            data[data.length - 1].change_percent < 0
              ? "text-red-500"
              : data[data.length - 1].change_percent > 0
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
          {data[data.length - 1].change_percent.toFixed(2)}%
        </p>
        <p>{data[data.length - 1].report_date}</p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id={`colorGradient-${color.substring(1)}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="report_date"
            tickFormatter={(dateStr) => {
              const date = new Date(dateStr);
              return `${date.toLocaleString("id-ID", {
                month: "short",
              })} ${date.getFullYear()}`;
            }}
            interval="preserveStartEnd"
            minTickGap={60}
            stroke="white"
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(val) =>
              val.toLocaleString("id-ID", { maximumFractionDigits: 0 })
            }
            stroke="white"
          />
          <Tooltip
            content={({ payload, label }) => {
              if (payload && payload.length > 0 && payload[0].value != null) {
                const date = new Date(label);
                const formattedDate = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const value = payload[0].value as number;
                return (
                  <div className="bg-white p-2 rounded-md shadow text-black">
                    {`${formattedDate} - ${value.toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                    })}`}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="close_price"
            fill={`url(#colorGradient-${color.substring(1)})`}
            strokeWidth={0}
          />
          <Line
            type="monotone"
            dataKey="close_price"
            stroke={color}
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
