// COMPONENTS
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// OVERVIEW COMPONENTS
import TotalCustomer from "../components/overview-components/TotalCustomerGauge";
import AUMTotal from "../components/overview-components/AUMTotalGauge";
import FBITotal from "../components/overview-components/FBITotalGauge";
import FUMBar from "../components/overview-components/FUMBar";
import FBIBar from "../components/overview-components/FBIBar";
import CustomerOverview from "../components/overview-components/CustomerOverviewPie";
import TopProducts from "../components/overview-components/TopProducts";
import CustomerListTable from "../components/overview-components/CustomerListTable";

// HOOKS
import { useState } from "react";
import { useTotalCustomer } from "../hooks/overview-hooks/totalCustomer";
import { useTotalAUM } from "../hooks/overview-hooks/totalAUM";
import { useTotalFBI } from "../hooks/overview-hooks/totalFBI";
import { useQuarterlyFBI } from "../hooks/overview-hooks/quarterlyFBI";
import { useQuarterlyFUM } from "../hooks/overview-hooks/quarterlyFUM";
import { useTopProducts } from "../hooks/overview-hooks/topProducts";

export default function OverviewPage() {
  // STATE
  const [customerRisk, setCustomerRisk] = useState("All");

  // HOOKS
  const [customerData] = useTotalCustomer(customerRisk);
  const [aumData] = useTotalAUM(customerRisk);
  const [fbiData] = useTotalFBI(customerRisk);
  const [quarterlyFUM] = useQuarterlyFUM(customerRisk);
  const [quarterlyFBI] = useQuarterlyFBI(customerRisk);
  const [topProducts] = useTopProducts(customerRisk);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <Navbar customerRisk={customerRisk} setCustomerRisk={setCustomerRisk} />

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
              <AUMTotal customerRisk={customerRisk} aumData={aumData} />
            </section>

            <section
              className="flex-1 rounded-2xl bg-[#1D283A]"
              aria-label="Total FBI"
            >
              <FBITotal customerRisk={customerRisk} fbiData={fbiData} />
            </section>
          </div>

          {/* Quarterly FUM and Customer Overview */}
          <div className="flex flex-col md:flex-row gap-2">
            <section
              className="flex-[2] rounded-2xl bg-[#1D283A]"
              aria-label="Quarterly FUM"
            >
              <FUMBar customerRisk={customerRisk} quarterlyFUM={quarterlyFUM} />
            </section>

            <section
              className="flex-1 rounded-2xl bg-[#1D283A]"
              aria-label="Customer Overview"
            >
              <CustomerOverview
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
              <FBIBar
                customerRisk={customerRisk}
                quarterlyFBI={quarterlyFBI}
                quarterlyFUM={quarterlyFUM}
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
              <CustomerListTable customerRisk={customerRisk} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
