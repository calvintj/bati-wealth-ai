export default function XAxisInformation(props: {
  x: number;
  y: number;
  payload: { value: string };
  data: { name: string; value: number; year: string }[];
  index: number;
}) {
  const { x, y, payload, index } = props;
  // Split the payload value assuming format: "Risk Year Quarter"
  const parts = payload.value.split(" ");
  const quarter = parts[0]; // e.g. "Q1"
  const year = parts[1]; // e.g. "2023"

  // Show year if it's Q1 or if it's the first item in the chart
  const showYear = quarter === "Q1" || index === 0;
  const displayYear = year;

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
