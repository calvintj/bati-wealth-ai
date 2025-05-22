"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// Components
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import News from "@/components/market-news/news";

const tradingEconomicsApiKey = "49819214053e444:ltdrsnaggcft8yc";

export default function MarketNewsPage() {
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  const [gdpGrowth, setGdpGrowth] = useState<number | null>(null);
  const [gdpGrowthLoading, setGdpGrowthLoading] = useState(true);
  const [gdpGrowthError, setGdpGrowthError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGdpGrowth = async () => {
      try {
        console.log("Fetching GDP growth data...");
        const corsProxy = "https://cors-anywhere.herokuapp.com/";
        const apiUrl = `https://api.tradingeconomics.com/historical/country/Indonesia/indicator/GDP%20Growth%20Rate?c=${tradingEconomicsApiKey}`;

        const response = await axios.get(corsProxy + apiUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Origin: window.location.origin,
          },
        });
        console.log("API Response:", response);
        if (response.data && response.data.length > 0) {
          setGdpGrowth(response.data[0].value);
        } else {
          console.log("No data received from API");
          setGdpGrowthError("No GDP growth data available");
        }
      } catch (error: any) {
        console.error("Detailed error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
        setGdpGrowthError(`Failed to fetch GDP growth data: ${error.message}`);
      } finally {
        setGdpGrowthLoading(false);
      }
    };

    fetchGdpGrowth();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen h-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={false}
        />

        <main className="flex flex-1 flex-col lg:flex-row p-2 overflow-hidden">
          {/* Left Column */}
          <div className="flex flex-col gap-2 w-auto lg:w-[300px] lg:mr-2">
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-12 text-center rounded-2xl p-2 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none font-semibold">
                Macroeconomic Indicators
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {/* GDP Growth Card */}
                <div className="flex-1 rounded-2xl flex flex-col gap-1 p-3 bg-[#232B38] text-white shadow-lg min-h-0">
                  <div className="text-base">GDP Growth</div>
                  <div className="flex items-end gap-2">
                    {gdpGrowthLoading ? (
                      <div className="animate-pulse h-8 w-24 bg-gray-700 rounded"></div>
                    ) : gdpGrowthError ? (
                      <span className="text-red-500 text-sm">
                        {gdpGrowthError}
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">
                          {gdpGrowth?.toFixed(2)}%
                        </span>
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
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                          Latest
                        </span>
                      </>
                    )}
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
          <div className="flex flex-col gap-2 flex-1 mt-2 lg:mt-0">
            <div className="h-12 rounded-2xl flex items-center justify-between p-2 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none">
              News Summary
            </div>
            <div className="overflow-hidden flex-1 rounded-2xl flex items-center justify-between p-2 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none">
              <News />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
