"use client";
import { useState, useMemo } from "react";
import { X, Filter } from "lucide-react";
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import { CompositeChart } from "@/components/market-indices/composite";
import { LQ45Chart } from "@/components/market-indices/lq45";
import { SPXChart } from "@/components/market-indices/spx";
import { NDXChart } from "@/components/market-indices/ndx";
import { DJIChart } from "@/components/market-indices/dji";
import MarketWatchlists from "@/components/market-indices/market-watchlists";
import MarketNotes from "@/components/market-indices/market-notes";

export default function MarketIndicesPage() {
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  const [selectedWatchlistIndices, setSelectedWatchlistIndices] = useState<string[] | null>(null);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<number | null>(null);

  // Map index codes to chart components
  const shouldShowChart = (indexCode: string): boolean => {
    if (!selectedWatchlistIndices) return true; // Show all if no watchlist selected
    return selectedWatchlistIndices.includes(indexCode);
  };

  const handleWatchlistSelect = (indices: string[] | null, watchlistId: number | null) => {
    setSelectedWatchlistIndices(indices);
    setSelectedWatchlistId(watchlistId);
  };

  // Calculate visible charts
  const visibleCharts = useMemo(() => {
    const charts = {
      indonesian: [] as string[],
      us: [] as string[],
    };

    if (shouldShowChart("Composite")) charts.indonesian.push("Composite");
    if (shouldShowChart("LQ45")) charts.indonesian.push("LQ45");
    if (shouldShowChart("SPX")) charts.us.push("SPX");
    if (shouldShowChart("NDX")) charts.us.push("NDX");
    if (shouldShowChart("DJI")) charts.us.push("DJI");

    return charts;
  }, [selectedWatchlistIndices]);

  const hasVisibleCharts = visibleCharts.indonesian.length > 0 || visibleCharts.us.length > 0;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-200">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* NAVBAR */}
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={false}
        />

        {/* Page Header */}
        <div className="px-4 md:px-6 pt-4 pb-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Major Market Indices
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Real-time tracking of major market indices from around the world
              </p>
            </div>

            {/* Filter Badge */}
            {selectedWatchlistIndices && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Filter size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {selectedWatchlistIndices.length} {selectedWatchlistIndices.length === 1 ? 'index' : 'indices'} selected
                  </span>
                  <button
                    onClick={() => handleWatchlistSelect(null, null)}
                    className="ml-1 p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
                    title="Clear filter"
                  >
                    <X size={14} className="text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Watchlist and Notes Section */}
        <div className="px-4 md:px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MarketWatchlists 
              onWatchlistSelect={handleWatchlistSelect}
              selectedWatchlistId={selectedWatchlistId}
            />
            <MarketNotes />
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Indonesian Market Section */}
            {visibleCharts.indonesian.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white px-4">
                    Indonesian Market
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {shouldShowChart("Composite") && (
                    <div className="bg-white dark:bg-[#1D283A] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-xl">
                      <CompositeChart />
                    </div>
                  )}

                  {shouldShowChart("LQ45") && (
                    <div className="bg-white dark:bg-[#1D283A] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-xl">
                      <LQ45Chart />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* US Market Section */}
            {visibleCharts.us.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white px-4">
                    US Market
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {shouldShowChart("SPX") && (
                    <div className="bg-white dark:bg-[#1D283A] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-xl lg:col-span-2">
                      <SPXChart />
                    </div>
                  )}

                  {shouldShowChart("NDX") && (
                    <div className="bg-white dark:bg-[#1D283A] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-xl">
                      <NDXChart />
                    </div>
                  )}

                  {shouldShowChart("DJI") && (
                    <div className="bg-white dark:bg-[#1D283A] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-xl">
                      <DJIChart />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!hasVisibleCharts && selectedWatchlistIndices && (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-[#1D283A] rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="text-center max-w-md">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800">
                    <Filter size={24} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    No charts match the selected watchlist
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    The selected watchlist contains indices that don't match any available charts.
                  </p>
                  <div className="inline-flex flex-wrap gap-2 justify-center mb-4">
                    {selectedWatchlistIndices.map((index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {index}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleWatchlistSelect(null, null)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            )}

            {/* Show all charts message when no filter */}
            {!selectedWatchlistIndices && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing all available market indices. Select a watchlist to filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
