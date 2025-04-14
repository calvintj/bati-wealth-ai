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
    <div className="p-4 flex flex-col items-center justify-center">
      <h2 className="text-black dark:text-white text-2xl font-bold mb-4 text-center">
        Produk Teratas
      </h2>
      <ResponsiveContainer width="90%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          barCategoryGap="20%"
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            className="text-black dark:text-white"
            tick={{ fill: "currentColor" }}
            width={120}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.1)" }}
            contentStyle={{
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              backgroundColor: "white",
              color: "var(--foreground)",
            }}
            labelStyle={{ color: "black" }}
            itemStyle={{ color: "black" }}
          />
          <Bar dataKey="value" fill="#06AED4" radius={[8, 8, 8, 8]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
