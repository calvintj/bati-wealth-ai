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
      className="text-sm md:text-base font-bold text-black dark:text-white"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const defaultColors = [
  "#F52720",
  "#01ACD2",
  "#2ABC36",
  "#FBB716",
  "#F0FF1B",
];

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
  // Use a fallback value for SSR safety
  const [windowWidth, setWindowWidth] = React.useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(0);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isMobile = windowWidth < 768;
  const innerRadius = isMobile ? 40 : 60;
  const outerRadius = isMobile ? 70 : 100;
  const chartAspect = 1.6;

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(() => {
    const riskIndex = customerData
      .filter((entry) => entry.name !== "All")
      .findIndex((entry) => entry.name === customerRisk);
    return riskIndex >= 0 ? riskIndex : null;
  });

  React.useEffect(() => {
    const riskIndex = customerData
      .filter((entry) => entry.name !== "All")
      .findIndex((entry) => entry.name === customerRisk);
    setSelectedIndex(riskIndex >= 0 ? riskIndex : null);
  }, [customerRisk, customerData]);

  return (
    <div className="p-4">
      <h3 className="text-center text-xl md:text-2xl font-bold mb-4 text-black dark:text-white">
        Profil Risiko Nasabah
      </h3>
      <ResponsiveContainer width="100%" aspect={chartAspect}>
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
                    selectedIndex === null || selectedIndex === index ? 1 : 0.3
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomerRisk(entry.name);
                    setSelectedIndex(index === selectedIndex ? null : index);
                  }}
                />
              ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value} customers`}
            contentStyle={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              color: "var(--foreground)",
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
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
