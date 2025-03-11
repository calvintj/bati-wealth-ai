import PropTypes from "prop-types";

export default function XAxisInformation(props) {
  const { x, y, payload, index } = props;
  // Split the payload value assuming format: "Risk Year Quarter"
  const parts = payload.value.split(" ");
  const year = parts[1]; // e.g. "2023"
  const quarter = parts[2]; // e.g. "Q1"

  // Show year if it's Q1 or if it's the first item in the chart
  let showYear = quarter === "Q1" || index === 0;
  let displayYear = year;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={18}
        fill="#fff"
        textAnchor="middle"
        style={{ fontSize: "1rem" }}
      >
        {quarter}
      </text>
      {showYear && (
        <text
          x={0}
          y={40}
          fill="#fff"
          textAnchor="middle"
          style={{ fontSize: "1rem" }}
        >
          {displayYear}
        </text>
      )}
    </g>
  );
}

XAxisInformation.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  payload: PropTypes.object.isRequired,
};
