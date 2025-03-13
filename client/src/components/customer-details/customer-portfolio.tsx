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
  const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 768);
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const innerRadius = isMobile ? 40 : 60;
  const outerRadius = isMobile ? 70 : 100;
  const chartAspect = isMobile ? 1 : 1.8;

  const { transformedData, loading, error } = useCustomerPortfolio(customerID);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-[330px] text-2xl">
        <p>N/A</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex justify-center items-center h-[330px]">
        <p>Error memuat data portofolio: {error.message}</p>
      </div>
    );
  }

  if (transformedData.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center h-[330px]">
        <p>Tidak ada data portofolio</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-[330px] w-full">
      <p className="text-center text-xl md:text-2xl font-bold">
        Portofolio Nasabah
      </p>
      <p className="text-center text-xl text-gray-400">Berdasarkan Tipe Aset</p>
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
  );
}