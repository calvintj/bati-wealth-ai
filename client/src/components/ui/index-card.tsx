import React, { ReactNode } from "react";

interface IndexCardProps {
  title: string;
  symbol?: string;
  currentValue: number;
  changeValue: number;
  changePercent: number;
  date: string;
  children: ReactNode;
}

export const IndexCard: React.FC<IndexCardProps> = ({
  title,
  symbol,
  currentValue,
  changeValue,
  changePercent,
  date,
  children,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {title}
          </h3>
          {symbol && (
            <div className="flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {symbol}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              {currentValue.toLocaleString("id-ID", {
                maximumFractionDigits: 2,
              })}
            </span>
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  changePercent < 0
                    ? "text-red-500"
                    : changePercent > 0
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {changeValue > 0 ? "+" : ""}
                {changeValue.toLocaleString("id-ID", {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className={`text-sm font-medium ${
                  changePercent < 0
                    ? "text-red-500"
                    : changePercent > 0
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                ({changePercent > 0 ? "+" : ""}
                {changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {date}
          </div>
        </div>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
};
