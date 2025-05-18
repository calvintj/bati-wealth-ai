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

    const data = quarterlyFUM
      .filter((entry) => entry.name.startsWith(filterKey))
      .map((entry) => ({
        ...entry,
        name: entry.name.replace(`${filterKey} `, ""),
      }));

    return (
      <div className="p-6 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            FUM per Kuartal
          </h2>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#2ABC36] rounded-sm mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              FUM
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 50, left: 50, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              tickLine={false}
              tick={(props) => <XAxisInformation {...props} data={data} />}
              stroke="currentColor"
              interval={0}
              className="text-gray-600 dark:text-gray-300"
            />

            <YAxis
              tickFormatter={(tick) => (tick / 1000000).toLocaleString()}
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              tickLine={false}
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-300"
            >
              <Label
                value="(in millions)"
                angle={-90}
                position="insideLeft"
                className="text-gray-600 dark:text-gray-300"
                style={{ fill: "currentColor", textAnchor: "middle" }}
              />
            </YAxis>

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.1)" }}
              content={({ payload, label }) => {
                if (payload && payload.length > 0) {
                  const fumValue = payload[0].value as number;
                  const aumValue = payload[1]?.value as number;

                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                      <div className="text-sm font-medium mb-1">{label}</div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500 dark:text-gray-400">
                            FUM:
                          </span>
                          <span className="font-semibold">
                            {fumValue.toLocaleString("id-ID", {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        {aumValue !== undefined && (
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500 dark:text-gray-400">
                              AUM:
                            </span>
                            <span className="font-semibold">
                              {aumValue.toLocaleString("id-ID", {
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar dataKey="value" barSize={50} radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#2ABC36"
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
