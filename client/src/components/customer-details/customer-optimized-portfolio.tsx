import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// HOOKS
import useOptimizedPortfolio from "../../hooks/customer-details/use-customer-optimized-portfolio";
import useGetReturnPercentage from "@/hooks/customer-details/use-return-percentage";
import { ReturnPercentage } from "@/types/page/customer-details";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
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

export default function PortfolioPie({
  colors = defaultColors,
  customerID,
}: {
  colors?: string[];
  customerID: string;
}) {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 768
  );
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const innerRadius = isMobile ? 40 : 60;
  const outerRadius = isMobile ? 70 : 100;
  const chartAspect = isMobile ? 1 : 1.8;

  const { transformedData, loading, error } = useOptimizedPortfolio(customerID);

  const { data: returnPercentage } = useGetReturnPercentage(customerID);

  const currentReturn =
    returnPercentage &&
    Array.isArray(returnPercentage) &&
    returnPercentage.length > 0
      ? Number((returnPercentage[0] as ReturnPercentage).current_return || 0)
      : 0;

  const expectedReturn =
    returnPercentage &&
    Array.isArray(returnPercentage) &&
    returnPercentage.length > 0
      ? Number((returnPercentage[0] as ReturnPercentage).expected_return || 0)
      : 0;

  const returnDiff = expectedReturn - currentReturn;

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-[330px]">
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex justify-center items-center h-[330px]">
        <p>Error loading portfolio data: {error.message}</p>
      </div>
    );
  }

  if (transformedData.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center h-[330px]">
        <p>No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-[330px]">
      <p className="text-center text-xl md:text-2xl font-bold">
        Portofolio Optimal
      </p>
      <p className="text-center text-xl text-gray-400">Berdasarkan Tipe Aset</p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" aspect={chartAspect}>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={transformedData}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              labelLine={false}
              label={renderCustomizedLabel}
              dataKey="value"
              paddingAngle={2}
            >
              {transformedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
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
      <div className="mt-auto pt-2 flex justify-start items-center">
        <div className="flex flex-col">
          <p className="text-sm text-white">Current Return</p>
          <div className="flex items-center gap-2">
            <p className="bg-[#01ACD2] text-black rounded-md text-center w-12 py-1">
              {(expectedReturn * 100).toFixed(0)}%
            </p>
            <p
              className={`${returnDiff > 0 ? "text-green-500" : "text-red-500"} flex items-center justify-center rounded-md text-center w-12 py-1`}
            >
              {returnDiff > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {(returnDiff * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
