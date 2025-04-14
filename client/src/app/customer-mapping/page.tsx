"use client";
// Components
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import StackedBarChart from "@/components/customer-mapping/customer-mapping";
import CustomerListTable from "@/components/customer-mapping/customer-list";

// HOOKS
import { useState } from "react";

export default function CustomerListPage() {
  const [propensity, setPropensity] = useState<string>("All");
  const [aum, setAum] = useState<string>("All");
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  return (
    <div className="flex min-h-screen dark:bg-gray-900 text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar setCustomerRisk={setCustomerRisk} customerRisk={customerRisk} />

        {/* MAIN CONTENT AREA */}
        <main className="flex flex-col gap-2 flex-1 overflow-y-auto p-2">
          {/* Stacked Bar Chart */}
          <div>
            <p className="text-2xl font-bold text-center text-black dark:text-white">
              Pemetaan Nasabah
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#1D283A] p-4 border-1 border-gray-200 dark:border-none">
            <StackedBarChart setPropensity={setPropensity} setAum={setAum} />
          </div>
          {/* Customer List Table */}
          <div>
            <p className="text-2xl font-bold text-center text-black dark:text-white">
              Daftar Nasabah
            </p>
          </div>
          <div>
            <div className="rounded-2xl overflow-x-auto bg-white dark:bg-[#1D283A]">
              <CustomerListTable propensity={propensity} aum={aum} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
