"use client";
import Sidebar from "@/components/shared/sidebar";
import { useState } from "react";
import Navbar from "@/components/shared/navbar";
import { CompositeChart } from "@/components/market-indices/composite";
import { LQ45Chart } from "@/components/market-indices/lq45";
import { SPXChart } from "@/components/market-indices/spx";
import { NDXChart } from "@/components/market-indices/ndx";
import { DJIChart } from "@/components/market-indices/dji";

export default function ChatbotPage() {
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-200 dark:bg-gray-900 dark:text-gray-200">
      {/* SIDEBAR - hidden on mobile, shown on md screens and up */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative w-full">
        {/* NAVBAR - always visible */}
        <div className="w-full sticky top-0 z-50">
          <Navbar
            setCustomerRisk={setCustomerRisk}
            customerRisk={customerRisk}
            showRiskDropdown={false}
          />
        </div>

        <div>
          <CompositeChart />
        </div>
        <div>
          <LQ45Chart />
        </div>
        <div>
          <SPXChart />
        </div>
        <div>
          <NDXChart />
        </div>
        <div>
          <DJIChart />v
        </div>
      </div>
    </div>
  );
}
