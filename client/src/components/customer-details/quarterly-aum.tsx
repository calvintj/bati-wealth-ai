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
  { label: "Asset", value: "Overall" },
  { label: "SB", value: "SB" },
  { label: "RD", value: "RD" },
  { label: "BAC", value: "BAC" },
];

const QuarterlyAUM = ({ customerID }: QuarterlyAUMProps) => {
  const [selectedAsset, setSelectedAsset] = useState("Overall");
  const quarterlyAUM = useQuarterlyAUM(customerID, selectedAsset);

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <Menu as="div" className="relative inline-block z-10">
          <div>
            <MenuButton className="cursor-pointer flex w-full rounded-lg p-2 text-sm font-semibold ring-2 ring-white text-white bg-[#1D283A]">
              {assetType.find((asset) => asset.value === selectedAsset)
                ?.label || "Asset"}
              <ChevronDownIcon className="w-5 h-5 text-white ml-2" />
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute mt-2 w-30 rounded-md text-white border-2 border-white bg-[#1D283A] transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div>
              {assetType.map((asset) => (
                <MenuItem key={asset.value}>
                  <button
                    type="button"
                    onClick={() => setSelectedAsset(asset.value)}
                    className="cursor-pointer w-full px-4 py-2 text-left text-sm data-focus:bg-gray-100 data-focus:text-gray-900"
                  >
                    {asset.label}
                  </button>
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Menu>
        <p className="text-white text-2xl font-bold mb-4 text-center">
          AUM per Kuartal
        </p>
      </div>

      <ResponsiveContainer height={300}>
        <ComposedChart
          data={quarterlyAUM}
          margin={{ top: 30, right: 0, left: 50, bottom: 30 }}
        >
          <XAxis
            dataKey="name"
            axisLine
            tickLine
            tick={(props) => (
              <XAxisInformation {...props} data={quarterlyAUM} />
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
            {quarterlyAUM.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={"#2ABC36"} />
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
};

export default QuarterlyAUM;
