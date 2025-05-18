import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TopProduct } from "@/types/page/overview";

interface TopProductsProps {
  topProducts: TopProduct[];
  customerRisk: string;
}

export default function TopProducts({
  topProducts,
  customerRisk,
}: TopProductsProps) {
  // Simply use customerRisk since it's a string.
  const riskCategory = customerRisk;

  const data = topProducts
    .filter((item) => {
      // For "All", filter items with the "All" category.
      if (riskCategory === "All") {
        return item.category === "All";
      }
      return item.category === riskCategory;
    })
    .map((item) => ({
      name: item.product,
      value: item.amount,
    }));

  return (
    <div className="p-6 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Produk Teratas
        </h2>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#06AED4] rounded-sm mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Nilai Produk
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          barCategoryGap="20%"
          margin={{ top: 5, right: 50, bottom: 5, left: 20 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
            tickLine={false}
            className="text-gray-600 dark:text-gray-300"
            tick={{
              fill: "currentColor",
              fontSize: 12,
              fontWeight: 500,
            }}
            width={150}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.1)" }}
            content={({ payload, label }) => {
              if (payload && payload.length > 0) {
                const value = payload[0].value as number;

                return (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                    <div className="text-sm font-medium mb-1">{label}</div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500 dark:text-gray-400">
                          Nilai:
                        </span>
                        <span className="font-semibold">
                          {value.toLocaleString("id-ID", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="value"
            fill="#06AED4"
            radius={[0, 8, 8, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
