"use client";
import Sidebar from "@/components/shared/sidebar";
import { useState } from "react";
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-200 dark:bg-gray-900 dark:text-gray-200">
      {/* SIDEBAR - hidden on mobile, shown on md screens and up */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative w-full">
        {/* NAVBAR - always visible */}
        <div className="w-full">
          <Navbar
            setCustomerRisk={setCustomerRisk}
            customerRisk={customerRisk}
            showRiskDropdown={false}
          />
        </div>

        {/* Page Header */}
        <div className="px-6 pt-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Major Market Indices
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time tracking of major market indices from around the world
            {selectedWatchlistIndices && (
              <span className="block mt-1">
                <span className="text-blue-600 dark:text-blue-400">
                  Filtered by watchlist ({selectedWatchlistIndices.length} indices)
                </span>
                <button
                  onClick={() => handleWatchlistSelect(null, null)}
                  className="ml-2 px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Clear Filter
                </button>
              </span>
            )}
          </p>
        </div>

        {/* Watchlist and Notes at Top - Side by Side */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MarketWatchlists 
              onWatchlistSelect={handleWatchlistSelect}
              selectedWatchlistId={selectedWatchlistId}
            />
            <MarketNotes />
          </div>
        </div>

        {/* Charts Grid Layout */}
        <div className="p-2 space-y-4">
          {/* Main Charts Section */}
          <div className="space-y-4">
            {/* Indonesian Indices */}
            {(shouldShowChart("Composite") || shouldShowChart("LQ45")) && (
              <>
                <div className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
                    Indonesian Market
                  </h2>
                </div>

                {shouldShowChart("Composite") && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <CompositeChart />
                  </div>
                )}

                {shouldShowChart("LQ45") && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <LQ45Chart />
                  </div>
                )}
              </>
            )}

            {/* US Indices */}
            {(shouldShowChart("SPX") || shouldShowChart("NDX") || shouldShowChart("DJI")) && (
              <>
                <div className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
                    US Market
                  </h2>
                </div>

                {shouldShowChart("SPX") && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <SPXChart />
                  </div>
                )}

                {(shouldShowChart("NDX") || shouldShowChart("DJI")) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {shouldShowChart("NDX") && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <NDXChart />
                      </div>
                    )}

                    {shouldShowChart("DJI") && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <DJIChart />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Show message if no charts match the filter */}
            {selectedWatchlistIndices && 
             !shouldShowChart("Composite") && 
             !shouldShowChart("LQ45") && 
             !shouldShowChart("SPX") && 
             !shouldShowChart("NDX") && 
             !shouldShowChart("DJI") && (
              <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  No charts match the selected watchlist indices.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Selected indices: {selectedWatchlistIndices.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
