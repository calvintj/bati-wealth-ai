import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

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

interface DataEntry {
  name: string;
  value: number;
}

interface RiskProfilePieProps {
  colors?: string[];
  customerData: DataEntry[];
  setCustomerRisk: (risk: string) => void;
  customerRisk: string;
}

export default function RiskProfilePie({
  colors = defaultColors,
  customerData,
  setCustomerRisk,
  customerRisk,
}: RiskProfilePieProps) {
  const [windowWidth, setWindowWidth] = React.useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isMobile = windowWidth < 768;
  const innerRadius = isMobile ? 40 : 60;
  const outerRadius = isMobile ? 70 : 100;

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
    () => {
      const riskIndex = customerData
        .filter((entry) => entry.name !== "All")
        .findIndex((entry) => entry.name === customerRisk);
      return riskIndex >= 0 ? riskIndex : null;
    }
  );

  React.useEffect(() => {
    const riskIndex = customerData
      .filter((entry) => entry.name !== "All")
      .findIndex((entry) => entry.name === customerRisk);
    setSelectedIndex(riskIndex >= 0 ? riskIndex : null);
  }, [customerRisk, customerData]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profil Risiko Nasabah
        </h2>

        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart
              onClick={() => {
                setSelectedIndex(null);
                setCustomerRisk("All");
              }}
            >
              <Pie
                data={customerData.filter((entry) => entry.name !== "All")}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                labelLine={false}
                label={renderCustomizedLabel}
                dataKey="value"
                paddingAngle={2}
                cursor="pointer"
              >
                {customerData
                  .filter((entry) => entry.name !== "All")
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        selectedIndex === null || selectedIndex === index
                          ? colors[index % colors.length]
                          : "#808080"
                      }
                      stroke="none"
                      opacity={
                        selectedIndex === null || selectedIndex === index
                          ? 1
                          : 0.3
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomerRisk(entry.name);
                        setSelectedIndex(
                          index === selectedIndex ? null : index
                        );
                      }}
                      className="transition-all duration-200 ease-in-out"
                    />
                  ))}
              </Pie>
              <Tooltip
                content={({ payload, label }) => {
                  if (payload && payload.length > 0) {
                    const value = payload[0].value as number;

                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                        <div className="text-sm font-medium mb-1">{label}</div>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500 dark:text-gray-400">
                              Jumlah:
                            </span>
                            <span className="font-semibold">
                              {value.toLocaleString("id-ID")} nasabah
                            </span>
                          </div>
                        </div>
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
    </div>
  );
}
