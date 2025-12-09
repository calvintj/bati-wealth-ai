"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// Components
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import News from "@/components/market-news/news";
import ProductPicks from "@/components/market-news/product-picks";
import NewsNotes from "@/components/market-news/news-notes";

// Hooks
import { useEconomicIndicators } from "@/hooks/market-news/use-economic-indicators";

export default function MarketNewsPage() {
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  const { data: indicators, isLoading, error } = useEconomicIndicators();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={false}
        />

        <main className="flex flex-1 flex-col lg:flex-row p-4 md:p-6 gap-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {/* Left Sidebar */}
          <div className="flex flex-col gap-4 w-full lg:w-80 flex-shrink-0">
            {/* Macroeconomic Indicators Section */}
            <section className="space-y-4">
              <div className="text-center rounded-xl p-3 bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg font-semibold text-gray-800 dark:text-white">
                Macroeconomic Indicators
              </div>
              <div className="flex flex-col gap-3">
                {/* GDP Growth Card */}
                <div className="rounded-xl flex flex-col gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white shadow-lg transition-shadow hover:shadow-xl">
                  <div className="text-sm font-medium opacity-90">
                    GDP Growth
                  </div>
                  <div className="flex items-end gap-2">
                    {isLoading ? (
                      <div className="animate-pulse h-8 w-24 bg-blue-400/50 dark:bg-blue-500/50 rounded"></div>
                    ) : error || !indicators?.gdpGrowth ? (
                      <span className="text-red-100 dark:text-red-200 text-sm font-medium">
                        {error?.message || "Data unavailable"}
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">
                          {indicators.gdpGrowth.value.toFixed(2)}%
                        </span>
                        {indicators.gdpGrowth.change !== undefined && (
                          <span
                            className={`flex items-center gap-1 text-sm font-semibold mb-1 ${
                              indicators.gdpGrowth.change > 0
                                ? "text-green-100 dark:text-green-200"
                                : indicators.gdpGrowth.change < 0
                                ? "text-red-100 dark:text-red-200"
                                : "text-white/80 dark:text-gray-200"
                            }`}
                          >
                            {indicators.gdpGrowth.change > 0 ? (
                              <TrendingUp size={14} />
                            ) : indicators.gdpGrowth.change < 0 ? (
                              <TrendingDown size={14} />
                            ) : (
                              <Minus size={14} />
                            )}
                            {indicators.gdpGrowth.change > 0 ? "+" : ""}
                            {indicators.gdpGrowth.change.toFixed(2)}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* BI Rate Card */}
                <div className="rounded-xl flex flex-col gap-2 p-4 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 text-white shadow-lg transition-shadow hover:shadow-xl">
                  <div className="text-sm font-medium opacity-90">BI Rate</div>
                  <div className="flex items-end gap-2">
                    {isLoading ? (
                      <div className="animate-pulse h-8 w-24 bg-purple-400/50 dark:bg-purple-500/50 rounded"></div>
                    ) : error || !indicators?.biRate ? (
                      <span className="text-red-100 dark:text-red-200 text-sm font-medium">
                        {error?.message || "Data unavailable"}
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">
                          {indicators.biRate.value.toFixed(2)}%
                        </span>
                        {indicators.biRate.change !== undefined && (
                          <span
                            className={`flex items-center gap-1 text-sm font-semibold mb-1 ${
                              indicators.biRate.change > 0
                                ? "text-red-100 dark:text-red-200"
                                : indicators.biRate.change < 0
                                ? "text-green-100 dark:text-green-200"
                                : "text-white/80 dark:text-gray-200"
                            }`}
                          >
                            {indicators.biRate.change > 0 ? (
                              <TrendingUp size={14} />
                            ) : indicators.biRate.change < 0 ? (
                              <TrendingDown size={14} />
                            ) : (
                              <Minus size={14} />
                            )}
                            {indicators.biRate.change > 0 ? "+" : ""}
                            {indicators.biRate.change.toFixed(2)}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Inflation Rate Card */}
                <div className="rounded-xl flex flex-col gap-2 p-4 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 text-white shadow-lg transition-shadow hover:shadow-xl">
                  <div className="text-sm font-medium opacity-90">
                    Inflation Rate
                  </div>
                  <div className="flex items-end gap-2">
                    {isLoading ? (
                      <div className="animate-pulse h-8 w-24 bg-green-400/50 dark:bg-green-500/50 rounded"></div>
                    ) : error || !indicators?.inflationRate ? (
                      <span className="text-red-100 dark:text-red-200 text-sm font-medium">
                        {error?.message || "Data unavailable"}
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">
                          {indicators.inflationRate.value.toFixed(2)}%
                        </span>
                        {indicators.inflationRate.change !== undefined && (
                          <span
                            className={`flex items-center gap-1 text-sm font-semibold mb-1 ${
                              indicators.inflationRate.change > 0
                                ? "text-red-100 dark:text-red-200"
                                : indicators.inflationRate.change < 0
                                ? "text-green-100 dark:text-green-200"
                                : "text-white/80 dark:text-gray-200"
                            }`}
                          >
                            {indicators.inflationRate.change > 0 ? (
                              <TrendingUp size={14} />
                            ) : indicators.inflationRate.change < 0 ? (
                              <TrendingDown size={14} />
                            ) : (
                              <Minus size={14} />
                            )}
                            {indicators.inflationRate.change > 0 ? "+" : ""}
                            {indicators.inflationRate.change.toFixed(2)}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Today's Product Pick Section */}
            <section className="space-y-4 flex-1 flex flex-col min-h-0">
              <div className="flex-1 rounded-xl p-4 bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl min-h-0">
                <ProductPicks />
              </div>
            </section>
          </div>

          {/* Right Column - News and Notes */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            {/* News Summary */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div className="rounded-xl flex items-center justify-between p-4 bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  News Summary
                </h2>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl min-h-0">
                <News />
              </div>
            </div>

            {/* News Notes */}
            <div className="rounded-xl p-4 bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl h-64 flex-shrink-0">
              <NewsNotes />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
