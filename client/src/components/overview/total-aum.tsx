// PieChart.js
import { PieChart as RePieChart, Pie, Cell, Label, Tooltip } from "recharts";
import PropTypes from "prop-types";

export default function GaugeChart({ aumData, customerRisk }) {
  const currentValue = (() => {
    const aumValue =
      customerRisk === "All"
        ? aumData.find((item) => item.name === "All")
        : aumData.find((item) => item.name === customerRisk);
    return aumValue ? aumValue.value : 0;
  })();
  const targetValue = 500000000;

  // Two slices: "Completed" vs. "Remaining"
  const data = [
    {
      name: "Completed",
      value: currentValue > targetValue ? targetValue : currentValue,
      color: "#2ABC36",
    },
    {
      name: "Remaining",
      value: currentValue >= targetValue ? 0 : targetValue - currentValue,
      color: "#FFFFFF",
    },
  ];

  // Dimensions for the chart
  const chartWidth = 300;
  const chartHeight = 150;

  // Center x/y
  const cx = 150; // half of chartWidth
  const cy = 105; // lower this if you see it's cut off

  const innerRadius = 75;
  const outerRadius = 95;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Title above the chart */}
      <div
        className="text-white font-semibold mt-4"
        style={{ fontSize: "1.5rem" }}
      >
        Total AUM
      </div>

      <RePieChart width={chartWidth} height={chartHeight}>
        <Pie
          dataKey="value"
          data={data}
          startAngle={180}
          endAngle={0}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          {/* Main value */}
          <Label
            value={`Rp ${Math.floor(currentValue / 1000000)}M`}
            position="center"
            dy={-10}
            style={{
              fill: "#FFFFFF",
              fontSize: "24px",
              fontWeight: "bold",
              textAnchor: "middle",
            }}
          />
          {/* Target label */}
          <Label
            value={`Target: Rp ${Math.round(targetValue / 1000000)}M`}
            position="center"
            dy={20}
            style={{
              fill: "#CCCCCC",
              fontSize: "14px",
              textAnchor: "middle",
            }}
          />
        </Pie>
        <Tooltip
          formatter={(value, name) => {
            if (name === "Completed") {
              return `Rp ${currentValue.toLocaleString()}`;
            }
            return `Rp ${(targetValue - currentValue).toLocaleString()}`;
          }}
          contentStyle={{
            background: "white", 
            border: "none",
            borderRadius: "4px",
            color: "black",
          }}
        />
      </RePieChart>
    </div>
  );
}

GaugeChart.propTypes = {
  aumData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ).isRequired,
  customerRisk: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ]).isRequired,
};
