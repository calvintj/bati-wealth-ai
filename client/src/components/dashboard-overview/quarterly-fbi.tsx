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
    const filteredFBI = quarterlyFBI
      .filter((entry) => entry.name.startsWith(filterKey))
      .map((entry) => ({
        ...entry,
        name: entry.name.replace(`${filterKey} `, ""),
      }));

    // Filter FUM data
    const filteredFUM = quarterlyFUM
      .filter((entry) => entry.name.startsWith(filterKey))
      .map((entry) => ({
        ...entry,
        name: entry.name.replace(`${filterKey} `, ""),
      }));

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
      <div className="p-6 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            FBI per Kuartal
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#01ACD2] rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                FBI
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                FBI/FUM Ratio
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={mergedData}
            margin={{ top: 20, right: 50, left: 50, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              tickLine={false}
              tick={(props) => (
                <XAxisInformation {...props} data={mergedData} />
              )}
              stroke="currentColor"
              interval={0}
              className="text-gray-600 dark:text-gray-300"
            />
            {/* Left Y-Axis for FBI values */}
            <YAxis
              yAxisId="left"
              tickFormatter={(tick) => (tick / 1000).toLocaleString()}
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              tickLine={false}
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-300"
            >
              <Label
                value="(in thousands)"
                angle={-90}
                position="insideLeft"
                className="text-gray-600 dark:text-gray-300"
                style={{ fill: "currentColor", textAnchor: "middle" }}
              />
            </YAxis>
            {/* Right Y-Axis for the ratio */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(tick) => `${tick.toFixed(2)}%`}
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              tickLine={false}
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-300"
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.1)" }}
              content={({ payload, label }) => {
                if (payload && payload.length > 0) {
                  const fbiValue = payload[0].value as number;
                  const ratioValue = payload[1]?.value as number;

                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                      <div className="text-sm font-medium mb-1">{label}</div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500 dark:text-gray-400">
                            FBI:
                          </span>
                          <span className="font-semibold">
                            {fbiValue.toLocaleString("id-ID", {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        {ratioValue !== undefined && (
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500 dark:text-gray-400">
                              FBI/FUM Ratio:
                            </span>
                            <span className="font-semibold">
                              {ratioValue.toFixed(2)}%
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
              stroke="red"
              strokeWidth={2}
              dot={{ r: 4, fill: "red", stroke: "white", strokeWidth: 2 }}
              activeDot={{
                r: 6,
                fill: "red",
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
