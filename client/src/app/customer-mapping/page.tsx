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
  const [ , setCustomerRisk] = useState<string>("All");
  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar setCustomerRisk={setCustomerRisk} />

        {/* MAIN CONTENT AREA */}
        <main className="grid grid-rows gap-2 flex-1 overflow-y-scroll mr-2 my-2 overscroll-contain">
          {/* Stacked Bar Chart */}
          <div className="grid rounded-2xl bg-[#1D283A]">
            <StackedBarChart setPropensity={setPropensity} setAum={setAum} />
          </div>
          <div>
            <p className="text-2xl font-bold text-center">Customer List</p>
          </div>
          {/* Customer List Table */}
          <div className="grid rounded-2xl overflow-x-auto h-[300px]">
            <CustomerListTable propensity={propensity} aum={aum} />
          </div>
        </main>
      </div>
    </div>
  );
}
