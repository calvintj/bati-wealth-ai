"use client";
import { useState } from "react";

// Components
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import StackedBarChart from "@/components/customer-mapping/customer-mapping";
import CustomerListTable from "@/components/customer-mapping/customer-list";
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";

export default function CustomerListPage() {
  const [propensity, setPropensity] = useState<string>("All");
  const [aum, setAum] = useState<string>("All");
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  const { canView, loading: permissionsLoading } = usePagePermissions();

  // Check view permission
  if (permissionsLoading) {
    return (
      <div className="flex min-h-screen dark:bg-gray-900 text-gray-200">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            setCustomerRisk={setCustomerRisk}
            customerRisk={customerRisk}
            showRiskDropdown={false}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">Loading permissions...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex min-h-screen dark:bg-gray-900 text-gray-200">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            setCustomerRisk={setCustomerRisk}
            customerRisk={customerRisk}
            showRiskDropdown={false}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Akses Ditolak
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Anda tidak memiliki izin untuk melihat halaman ini. Silakan hubungi administrator Anda jika Anda memerlukan akses.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen dark:bg-gray-900 text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={false}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-[1920px] mx-auto space-y-4">
            {/* Page Header */}
            <div className="px-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Pemetaan Nasabah
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Visualisasi dan manajemen data nasabah berdasarkan propensity dan AUM
              </p>
            </div>

            {/* Stacked Bar Chart Section */}
            <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
              <StackedBarChart setPropensity={setPropensity} setAum={setAum} />
            </section>

            {/* Customer List Table Section */}
            <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg overflow-hidden">
              <CustomerListTable propensity={propensity} aum={aum} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
