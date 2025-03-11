import { PieChart as RePieChart, Pie, Cell, Label, Tooltip } from "recharts";
import PropTypes from "prop-types";

export default function GaugeChart({ customerData, customerRisk }) {
  const currentValue = (() => {
    const customerValue =
      customerRisk === "All"
        ? customerData.find((item) => item.name === "All")
        : customerData.find((item) => item.name === customerRisk);
    return customerValue ? customerValue.value : 0;
  })();
  const targetValue = 500;

  const data = [
    {
      name: "Completed",
      value: currentValue > targetValue ? targetValue : currentValue,
      color: "#F52720",
    },
    {
      name: "Remaining",
      value: currentValue >= targetValue ? 0 : targetValue - currentValue,
      color: "#FFFFFF",
    },
  ];

  const chartWidth = Math.min(300, window.innerWidth * 0.8);
  const chartHeight = chartWidth * 0.5;

  const cx = chartWidth / 2;
  const cy = chartHeight * 0.7;

  const innerRadius = chartWidth * 0.25;
  const outerRadius = chartWidth * 0.32;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Title above the chart */}
      <div
        className="text-white font-semibold mt-4"
        style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}
      >
        Jumlah Nasabah
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
            value={currentValue}
            position="center"
            dy={-10}
            style={{
              fill: "#FFFFFF",
              fontSize: `${chartWidth * 0.08}px`,
              fontWeight: "bold",
              textAnchor: "middle",
            }}
          />
          {/* Target label */}
          <Label
            value={`Target: ${targetValue}`}
            position="center"
            dy={20}
            style={{
              fill: "#CCCCCC",
              fontSize: `${chartWidth * 0.047}px`,
              textAnchor: "middle",
            }}
          />
        </Pie>
        <Tooltip
          formatter={(value, name) => {
            if (name === "Completed") {
              return `${currentValue.toLocaleString()}`;
            }
            return `${(targetValue - currentValue).toLocaleString()}`;
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
  customerRisk: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.shape({
        all: PropTypes.number,
      }),
    }),
  ]),
  customerData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
};
