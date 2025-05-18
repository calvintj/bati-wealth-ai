"use client";
import Sidebar from "@/components/shared/sidebar";
import { useState } from "react";
import Navbar from "@/components/shared/navbar";
import { CompositeChart } from "@/components/market-indices/composite";
import { LQ45Chart } from "@/components/market-indices/lq45";
import { SPXChart } from "@/components/market-indices/spx";
import { NDXChart } from "@/components/market-indices/ndx";
import { DJIChart } from "@/components/market-indices/dji";

export default function MarketIndicesPage() {
  const [customerRisk, setCustomerRisk] = useState<string>("All");
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
          </p>
        </div>

        {/* Charts Grid Layout */}
        <div className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Indonesian Indices */}
          <div className="w-full p-3 col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
              Indonesian Market
            </h2>
          </div>

          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <CompositeChart />
          </div>

          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <LQ45Chart />
          </div>

          {/* US Indices */}
          <div className="w-full p-3 col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
              US Market
            </h2>
          </div>

          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <SPXChart />
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <NDXChart />
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <DJIChart />
          </div>
        </div>
      </div>
    </div>
  );
}
