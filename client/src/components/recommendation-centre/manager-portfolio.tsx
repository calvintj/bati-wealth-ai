"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import usePortfolio from "../../hooks/recommendation-centre/use-manager-portfolio";

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm md:text-base font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const defaultColors = ["#F52720", "#01ACD2", "#2ABC36", "#FBB716", "#F0FF1B"];

// Custom hook for window size
function useWindowSize() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768
  );
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowWidth;
}

export default function PortfolioPie({ colors = defaultColors }) {
  const windowWidth = useWindowSize();
  const isMobile = windowWidth < 768;
  const innerRadius = isMobile ? 40 : 60;
  const outerRadius = isMobile ? 70 : 100;
  const chartAspect = 1.8;

  // Always call hooks unconditionally
  const { data, isLoading, error } = usePortfolio();

  // Wrap data extraction in a useMemo hook to stabilize dependencies
  const portfolioData = useMemo(() => {
    return data?.transformedData || [];
  }, [data]);

  // Memoize filteredData (even if trivial) to satisfy the linter
  const filteredData = useMemo(() => {
    return portfolioData;
  }, [portfolioData]);

  // Conditional rendering happens AFTER all hooks have been called
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-full">
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex justify-center items-center h-full">
        <p>Error loading portfolio data: {error.message}</p>
      </div>
    );
  }

  if (portfolioData.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center h-full">
        <p>No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="text-xl md:text-2xl font-bold text-center md:text-left text-black dark:text-white">Ringkasan Portofolio</p>
      <ResponsiveContainer width="100%" aspect={chartAspect}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={filteredData}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
            paddingAngle={2}
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={entry.name || `cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value.toLocaleString()}`}
            contentStyle={{
              background: "white",
              border: "none",
              borderRadius: "4px",
              color: "black",
            }}
          />
          <Legend
            layout={isMobile ? "horizontal" : "vertical"}
            verticalAlign={isMobile ? "bottom" : "middle"}
            align={isMobile ? "center" : "right"}
            iconType="circle"
            wrapperStyle={{
              color: "#fff",
              fontSize: isMobile ? "0.75rem" : "0.9rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
