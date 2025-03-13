"use client";
import { useState } from "react";

// Shared Components
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";

// Overview Components
import TotalCustomer from "@/components/overview/total-customers";
import TotalAUM from "@/components/overview/total-aum";
import TotalFBI from "@/components/overview/total-fbi";
import QuarterlyFUM from "@/components/overview/quarterly-fum";
import QuarterlyFBI from "@/components/overview/quarterly-fbi";
import CustomerRiskProfile from "@/components/overview/customer-risk-profile";
import TopProducts from "@/components/overview/top-products";
import CustomerList from "@/components/overview/customer-list";

// Hooks
import { useTotalCustomer } from "@/hooks/overview/use-total-customer";
import { useTotalAUM } from "@/hooks/overview/use-total-aum";
import { useTotalFBI } from "@/hooks/overview/use-total-fbi";
import { useQuarterlyFBI } from "@/hooks/overview/use-quarterly-fbi";
import { useQuarterlyFUM } from "@/hooks/overview/use-quarterly-fum";
import { useTopProducts } from "@/hooks/overview/use-top-products";

const OverviewPage = () => {
  // STATE
  const [customerRisk, setCustomerRisk] = useState<string>("All");

  // HOOKS
  const customerData = useTotalCustomer(customerRisk);
  const aumData = useTotalAUM(customerRisk);
  const fbiData = useTotalFBI(customerRisk);
  const quarterlyFUM = useQuarterlyFUM(customerRisk);
  const quarterlyFBI = useQuarterlyFBI(customerRisk);
  const topProducts = useTopProducts(customerRisk);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <Navbar setCustomerRisk={setCustomerRisk} />

        {/* DASHBOARD CONTENT */}
        <main className="flex flex-col gap-2 flex-1 overflow-y-scroll mr-2 my-2 overscroll-contain">
          {/* Total Customer, AUM, and FBI */}
          <div className="flex flex-col md:flex-row gap-2">
            <section
              className="flex-1 rounded-2xl bg-[#1D283A]"
              aria-label="Total Customers"
            >
              <TotalCustomer
                customerRisk={customerRisk}
                customerData={customerData}
              />
            </section>

            <section
              className="flex-1 rounded-2xl bg-[#1D283A]"
              aria-label="Total AUM"
            >
              <TotalAUM customerRisk={customerRisk} aumData={aumData} />
            </section>

            <section
              className="flex-1 rounded-2xl bg-[#1D283A]"
              aria-label="Total FBI"
            >
              <TotalFBI customerRisk={customerRisk} fbiData={fbiData} />
            </section>
          </div>

          {/* Quarterly FUM and Customer Overview */}
          <div className="flex flex-col md:flex-row gap-2">
            <section
              className="flex-[2] rounded-2xl bg-[#1D283A]"
              aria-label="Quarterly FUM"
            >
              <QuarterlyFUM
                customerRisk={customerRisk}
                quarterlyFUM={quarterlyFUM}
                setCustomerRisk={setCustomerRisk}
              />
            </section>

            <section
              className="flex-1 rounded-2xl bg-[#1D283A]"
              aria-label="Customer Overview"
            >
              <CustomerRiskProfile
                setCustomerRisk={setCustomerRisk}
                customerData={customerData}
                customerRisk={customerRisk}
              />
            </section>
          </div>

          {/* Quarterly FBI and Top Products */}
          <div className="flex flex-col md:flex-row gap-2">
            <section
              className="flex-[2] rounded-2xl bg-[#1D283A]"
              aria-label="Quarterly FBI"
            >
              <QuarterlyFBI
                customerRisk={customerRisk}
                quarterlyFBI={quarterlyFBI}
                quarterlyFUM={quarterlyFUM}
                setCustomerRisk={setCustomerRisk}
              />
            </section>

            <section
              className="flex-1 rounded-2xl bg-[#1D283A]"
              aria-label="Top Products"
            >
              <TopProducts
                customerRisk={customerRisk}
                topProducts={topProducts}
              />
            </section>
          </div>

          <div>
            <p className="text-2xl font-bold text-center">Customer List</p>
          </div>
          <div>
            <section className="w-[1410px]">
              <CustomerList customerRisk={customerRisk} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OverviewPage;
