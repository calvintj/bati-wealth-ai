"use client";
import { useState } from "react";

// Shared Components
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";

// Overview Components
import TotalCustomer from "@/components/dashboard-overview/total-customers";
import TotalAUM from "@/components/dashboard-overview/total-aum";
import TotalFBI from "@/components/dashboard-overview/total-fbi";
import QuarterlyFUM from "@/components/dashboard-overview/quarterly-fum";
import QuarterlyFBI from "@/components/dashboard-overview/quarterly-fbi";
import CustomerRiskProfile from "@/components/dashboard-overview/customer-risk-profile";
import TopProducts from "@/components/dashboard-overview/top-products";
import CustomerList from "@/components/dashboard-overview/customer-list";

// Hooks
import { useTotalCustomer } from "@/hooks/dashboard-overview/use-total-customer";
import { useTotalAUM } from "@/hooks/dashboard-overview/use-total-aum";
import { useTotalFBI } from "@/hooks/dashboard-overview/use-total-fbi";
import { useQuarterlyFBI } from "@/hooks/dashboard-overview/use-quarterly-fbi";
import { useQuarterlyFUM } from "@/hooks/dashboard-overview/use-quarterly-fum";
import { useTopProducts } from "@/hooks/dashboard-overview/use-top-products";

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
    <div className="flex min-h-screen dark:bg-gray-900 text-gray-200">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* NAVBAR */}
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={true}
        />

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-[1920px] mx-auto space-y-4">
            {/* Key Metrics Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl"
                aria-label="Total Customers"
              >
                <TotalCustomer
                  customerRisk={customerRisk}
                  customerData={customerData}
                />
              </div>

              <div
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl"
                aria-label="Total AUM"
              >
                <TotalAUM customerRisk={customerRisk} aumData={aumData} />
              </div>

              <div
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl"
                aria-label="Total FBI"
              >
                <TotalFBI customerRisk={customerRisk} fbiData={fbiData} />
              </div>
            </section>

            {/* Charts Section - Row 1 */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div
                className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl"
                aria-label="Quarterly FUM"
              >
                <QuarterlyFUM
                  customerRisk={customerRisk}
                  quarterlyFUM={quarterlyFUM}
                  setCustomerRisk={setCustomerRisk}
                />
              </div>

              <div
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl"
                aria-label="Customer Risk Profile"
              >
                <CustomerRiskProfile
                  setCustomerRisk={setCustomerRisk}
                  customerData={customerData}
                  customerRisk={customerRisk}
                />
              </div>
            </section>

            {/* Charts Section - Row 2 */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div
                className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl"
                aria-label="Quarterly FBI"
              >
                <QuarterlyFBI
                  customerRisk={customerRisk}
                  quarterlyFBI={quarterlyFBI}
                  quarterlyFUM={quarterlyFUM}
                  setCustomerRisk={setCustomerRisk}
                />
              </div>

              <div
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl"
                aria-label="Top Products"
              >
                <TopProducts
                  customerRisk={customerRisk}
                  topProducts={topProducts}
                />
              </div>
            </section>

            {/* Customer List Section */}
            <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg overflow-hidden">
              <CustomerList customerRisk={customerRisk} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OverviewPage;
