"use client";
import { useState } from "react";

// Components
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";

export default function MarketNewsPage() {
  const [customerRisk, setCustomerRisk] = useState<string>("All");

  return (
    <div className="flex flex-col md:flex-row min-h-screen h-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={false}
        />

        <main className="flex flex-1 p-2 overflow-hidden">
          {/* Left Column */}
          <div className="flex flex-col gap-2 w-[300px] mr-2">
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-12 text-center rounded-2xl p-2 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none font-semibold">
                Macroeconomic Indicators
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {/* GDP Growth Card */}
                <div className="flex-1 rounded-2xl flex flex-col gap-1 p-3 bg-[#232B38] text-white shadow-lg min-h-0">
                  <div className="text-base">GDP Growth</div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">4.86</span>
                    <span className="flex items-center text-sm text-red-500 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      3,5%
                    </span>
                  </div>
                </div>
                {/* BI Rate Card */}
                <div className="flex-1 rounded-2xl flex flex-col gap-1 p-3 bg-[#232B38] text-white shadow-lg min-h-0">
                  <div className="text-base">BI Rate</div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">6.00</span>
                    <span className="flex items-center text-sm text-gray-300 font-semibold">
                      0,0%
                    </span>
                  </div>
                </div>
                {/* Inflation Rate Card */}
                <div className="flex-1 rounded-2xl flex flex-col gap-1 p-3 bg-[#232B38] text-white shadow-lg min-h-0">
                  <div className="text-base">Inflation Rate</div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">1.55</span>
                    <span className="flex items-center text-sm text-green-500 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      0,5%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1 mt-2">
              <div className="text-center rounded-2xl p-2 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none font-semibold">
                Today's Product Pick
              </div>
              <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
                <div className="rounded-2xl flex items-center justify-center p-6 bg-[#232B38] text-white shadow-lg flex-1 min-h-0">
                  BBCA
                </div>
                <div className="rounded-2xl flex items-center justify-center p-6 bg-[#232B38] text-white shadow-lg flex-1 min-h-0">
                  BBNI
                </div>
                <div className="rounded-2xl flex items-center justify-center p-6 bg-[#232B38] text-white shadow-lg flex-1 min-h-0">
                  BMRN
                </div>
                <div className="rounded-2xl flex items-center justify-center p-6 bg-[#232B38] text-white shadow-lg flex-1 min-h-0">
                  BTPN
                </div>
                <div className="rounded-2xl flex items-center justify-center p-6 bg-[#232B38] text-white shadow-lg flex-1 min-h-0">
                  DCII
                </div>
                <div className="rounded-2xl flex items-center justify-center p-6 bg-[#232B38] text-white shadow-lg flex-1 min-h-0">
                  ADRO
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-12 rounded-2xl flex items-center justify-between p-2 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none">
              News Summary
            </div>
            <div className="overflow-hidden flex-1 rounded-2xl flex items-center justify-between p-2 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none">
              News
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
