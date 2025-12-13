import { useState } from "react";
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
import { MenuItem, MenuButton, MenuItems, Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useQuarterlyAUM } from "@/hooks/customer-details/use-quarterly-aum";

export interface DataEntry {
  name: string;
  value: number;
}

interface QuarterlyAUMProps {
  customerID: string;
}

const assetType = [
  { label: "Aset", value: "Overall" },
  { label: "SB", value: "SB" },
  { label: "RD", value: "RD" },
  { label: "BAC", value: "BAC" },
];

const QuarterlyAUM = ({ customerID }: QuarterlyAUMProps) => {
  const [selectedAsset, setSelectedAsset] = useState("Overall");
  const quarterlyAUM = useQuarterlyAUM(customerID, selectedAsset);

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AUM per Kuartal
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Berdasarkan Tipe Aset
          </p>
        </div>
        <Menu as="div" className="relative inline-block z-10">
          <div>
            <MenuButton className="cursor-pointer flex items-center rounded-lg px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 dark:ring-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              {assetType.find((asset) => asset.value === selectedAsset)
                ?.label || "Asset"}
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
          >
            <div className="py-1">
              {assetType.map((asset) => (
                <MenuItem key={asset.value}>
                  <button
                    type="button"
                    onClick={() => setSelectedAsset(asset.value)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {asset.label}
                  </button>
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Menu>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={quarterlyAUM}
            margin={{ top: 30, right: 30, left: 50, bottom: 30 }}
          >
            <XAxis
              dataKey="name"
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              tickLine={false}
              tick={(props) => (
                <XAxisInformation {...props} data={quarterlyAUM} />
              )}
              className="text-gray-600 dark:text-gray-300"
              stroke="currentColor"
              interval={0}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(tick) => (tick / 1000).toLocaleString()}
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              tickLine={false}
              className="text-gray-600 dark:text-gray-300"
              stroke="currentColor"
            >
              <Label
                value="(in thousands)"
                angle={-90}
                position="insideLeft"
                className="text-gray-600 dark:text-gray-300"
                style={{ fill: "currentColor", textAnchor: "middle" }}
              />
            </YAxis>
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(tick) => tick.toFixed(2)}
              axisLine={{ stroke: "rgba(156, 163, 175, 0.2)" }}
              tickLine={false}
              className="text-gray-600 dark:text-gray-300"
              stroke="currentColor"
            />
            <Tooltip
              cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const aumValue = payload.find(
                    (p) => p.dataKey === "value"
                  )?.value;

                  return (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        {label}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          AUM:{" "}
                          <span className="font-medium">
                            Rp {Number(aumValue).toLocaleString("id-ID")}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              yAxisId="left"
              barSize={50}
              radius={[8, 8, 0, 0]}
            >
              {quarterlyAUM.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#2ABC36"
                  className="transition-all duration-200 ease-in-out"
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="ratio"
              yAxisId="right"
              stroke="#FF0000"
              strokeWidth={2}
              dot={{ r: 4, fill: "#FF0000", strokeWidth: 2 }}
              activeDot={{
                r: 6,
                fill: "#FF0000",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuarterlyAUM;
