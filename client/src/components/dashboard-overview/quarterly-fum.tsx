import { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import XAxisInformation from "./bar-chart-x-axis";

export interface DataEntry {
  name: string;
  value: number;
}

export interface QuarterlyFUMProps {
  quarterlyFUM: DataEntry[];
  customerRisk: string;
  setCustomerRisk: (risk: string) => void;
}

export default class FUMChart extends PureComponent<QuarterlyFUMProps> {

  render() {
    const { quarterlyFUM, customerRisk } = this.props;

    const filterKey = customerRisk === "All" ? "All" : customerRisk;

    const data = quarterlyFUM.filter((entry) =>
      entry.name.startsWith(filterKey)
    );

    return (
      <div className="p-4">
        <p className="text-black dark:text-white text-xl md:text-2xl font-bold mb-4 text-center">
          FUM per Kuartal
        </p>

        <ResponsiveContainer height={300}>
          <BarChart
            data={data}
            margin={{ top: 30, right: 50, left: 50, bottom: 30 }}
          >
            <XAxis
              dataKey="name"
              axisLine={true}
              tickLine={true}
              tick={(props) => <XAxisInformation {...props} data={data} />}
              stroke="currentColor"
              interval={0}
              className="text-black dark:text-white"
            />

            <YAxis
              tickFormatter={(tick) => (tick / 1000000).toLocaleString()}
              tick={true}
              axisLine={true}
              className="text-black dark:text-white"
              stroke="currentColor"
            >
              <Label
                value="(in millions)"
                angle={-90}
                position="insideLeft"
                className="text-black dark:text-white"
                style={{ fill: "currentColor", textAnchor: "middle" }}
              />
            </YAxis>

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.1)" }}
              contentStyle={{
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                background: "white",
                color: "var(--foreground)",
              }}
              labelStyle={{ color: "var(--foreground)" }}
              formatter={(val) => [val.toLocaleString(), "FUM"]}
              labelFormatter={() => ""}
            />

            <Bar dataKey="value" barSize={50} radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#2ABC36" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
