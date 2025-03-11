import PropTypes from "prop-types";
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

const defaultColors = [
  "#F52720",
  "#01ACD2",
  "#2ABC36",
  "#FBB716",
  "#F0FF1B",
];

export default function RiskProfilePie({
  colors = defaultColors,
  customerData,
  setCustomerRisk,
  customerRisk,
}) {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const innerRadius = isMobile ? 40 : 60;
  const outerRadius = isMobile ? 70 : 100;
  const chartAspect = isMobile ? 1 : 1.6;

  const [selectedIndex, setSelectedIndex] = React.useState(() => {
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
      <h3 className="text-center text-xl md:text-2xl font-bold mb-4">
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
                    selectedIndex === null || selectedIndex === index
                      ? 1
                      : 0.3
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

RiskProfilePie.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  setCustomerRisk: PropTypes.func,
  customerData: PropTypes.arrayOf(PropTypes.object),
  customerRisk: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    }),
  ]),
};
