import { PureComponent } from "react";
import {
  ComposedChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  Line,
} from "recharts";
import XAxisInformation from "./bar-chart-x-axis";

export interface DataEntry {
  name: string;
  value: number;
}

interface FBIBarProps {
  quarterlyFBI: DataEntry[];
  quarterlyFUM: DataEntry[];
  customerRisk: string;
  setCustomerRisk: (risk: string) => void;
}

export default class FBIBar extends PureComponent<FBIBarProps> {
  render() {
    const { quarterlyFBI, quarterlyFUM, customerRisk } = this.props;
    const filterKey = customerRisk === "All" ? "All" : customerRisk;

    // Filter FBI data
    const filteredFBI = quarterlyFBI.filter((entry) =>
      entry.name.startsWith(filterKey)
    );

    // Filter FUM data
    const filteredFUM = quarterlyFUM.filter((entry) =>
      entry.name.startsWith(filterKey)
    );

    // Merge the two datasets: compute ratio for each FBI entry by matching FUM entry
    const mergedData = filteredFBI.map((fbiEntry) => {
      const correspondingFUM = filteredFUM.find(
        (fumEntry) => fumEntry.name === fbiEntry.name
      );
      const ratio =
        correspondingFUM && fbiEntry.value
          ? (fbiEntry.value / correspondingFUM.value) * 100
          : 0;
      return { ...fbiEntry, ratio };
    });

    return (
      <div className="p-4">
        <p className="text-white text-2xl font-bold mb-4 text-center">
          FBI per Kuartal
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={mergedData}
            margin={{ top: 30, right: 50, left: 50, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              axisLine
              tickLine
              tick={(props) => (
                <XAxisInformation {...props} data={mergedData} />
              )}
              stroke="#FFFFFF"
              interval={0}
            />
            {/* Left Y-Axis for FBI values */}
            <YAxis
              yAxisId="left"
              tickFormatter={(tick) => (tick / 1000).toLocaleString()}
              axisLine
              stroke="#FFFFFF"
            >
              <Label
                value="(in thousands)"
                angle={-90}
                position="insideLeft"
                style={{ fill: "#FFFFFF", textAnchor: "middle" }}
              />
            </YAxis>
            {/* Right Y-Axis for the ratio */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(tick) => tick.toFixed(2)}
              axisLine
              stroke="#FFFFFF"
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
              contentStyle={{
                border: "none",
                borderRadius: "1rem",
              }}
              labelStyle={{ color: "black" }}
              itemStyle={{ color: "black" }}
              formatter={(val, name) => {
                if (name === "ratio") {
                  return [
                    typeof val === "number" ? val.toFixed(4) : val,
                    "FBI / FUM dalam %",
                  ];
                }
                return [
                  typeof val === "number" ? val.toLocaleString() : val,
                  name === "value" ? "FBI" : name,
                ];
              }}
              labelFormatter={() => ""}
            />
            {/* FBI Bar using left axis */}
            <Bar
              dataKey="value"
              yAxisId="left"
              barSize={50}
              radius={[8, 8, 0, 0]}
            >
              {mergedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={"#01ACD2"} />
              ))}
            </Bar>
            {/* Ratio Line using right axis */}
            <Line
              type="monotone"
              dataKey="ratio"
              yAxisId="right"
              stroke="#FF0000"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
