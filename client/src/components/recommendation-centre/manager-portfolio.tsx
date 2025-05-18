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
      <div className="flex justify-center items-center h-full text-gray-600 dark:text-gray-300">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-2"></div>
          <p>Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-600 dark:text-red-400">
        <div className="text-center">
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
          <p>Error: {error.message}</p>
        </div>
      </div>
    );
  }

  if (portfolioData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-600 dark:text-gray-300">
        <div className="text-center">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>No portfolio data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ringkasan Portofolio
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Distribusi Aset
          </p>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={250}>
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
                  className="transition-all duration-200 ease-in-out"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {data.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {`Rp ${data.value.toLocaleString("id-ID")}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              layout={isMobile ? "horizontal" : "vertical"}
              verticalAlign={isMobile ? "bottom" : "middle"}
              align={isMobile ? "center" : "right"}
              iconType="circle"
              wrapperStyle={{
                color: "var(--foreground)",
                fontSize: isMobile ? "0.75rem" : "0.9rem",
                padding: "1rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
