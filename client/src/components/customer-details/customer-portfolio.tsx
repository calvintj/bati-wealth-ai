import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import useCustomerPortfolio from "../../hooks/customer-details/use-customer-portfolio";
import useGetReturnPercentage from "@/hooks/customer-details/use-return-percentage";
import { ReturnPercentage } from "@/types/page/customer-details";

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
      fill="currentColor"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm md:text-base font-bold text-gray-900 dark:text-white"
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

  const { transformedData, loading, error } = useCustomerPortfolio(customerID);
  const { data: returnPercentage } = useGetReturnPercentage(customerID);

  const currentReturn =
    returnPercentage &&
    Array.isArray(returnPercentage) &&
    returnPercentage.length > 0
      ? Number((returnPercentage[0] as ReturnPercentage).current_return || 0)
      : 0;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex justify-center items-center h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-2"></div>
          <p className="text-gray-600 dark:text-gray-300">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex justify-center items-center h-[400px]">
        <div className="text-center text-red-600 dark:text-red-400">
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
          <p>Error memuat data portofolio</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (transformedData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex justify-center items-center h-[400px]">
        <p className="text-gray-600 dark:text-gray-300">
          Tidak ada data portofolio
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Portofolio Nasabah
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Berdasarkan Tipe Aset
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Current Return
          </p>
          <p className="bg-[#01ACD2] text-white rounded-md text-center px-3 py-1 font-semibold">
            {(currentReturn * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
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
                padding: "0 1rem",
              }}
              formatter={(value) => (
                <span className="text-gray-600 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
