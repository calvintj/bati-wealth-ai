"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";

// Hooks
import { useCustomerDetails } from "@/hooks/customer-details/use-customer-details";
import { useCustomerList } from "@/hooks/customer-mapping/use-customer-list";

// Components
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import CustomerDropdown from "@/components/customer-details/customer-id-bar";
import PortfolioPie from "@/components/customer-details/customer-portfolio";
import OptimizedPortfolio from "@/components/customer-details/customer-optimized-portfolio";
import OwnedProductTable from "@/components/customer-details/owned-products";
import RecommendationProduct from "@/components/customer-details/recommendation-products";
import QuarterlyAUM from "@/components/customer-details/quarterly-aum";
import QuarterlyFUM from "@/components/customer-details/quarterly-fum";
import ActivityManager from "@/components/customer-details/activity-manager";
import CustomerEditModal from "@/components/dashboard-overview/customer-edit-modal";
import { CertainCustomerList } from "@/types/page/overview";
interface CustomerDetails {
  Priority_Private: string;
  Risk_Profile: string;
  Status_Nikah: string;
  Total_AUM: string;
  Total_FBI: string;
  Total_FUM: string;
  Usia: string;
  Vintage: string;
}
// A small reusable component to display customer detail rows.
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) => (
  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-between p-3 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
    <h2 className="pl-2 font-semibold text-sm text-gray-700 dark:text-gray-300">
      {label}
    </h2>
    <h2 className="pr-2 font-medium text-sm text-black dark:text-white">
      {value !== undefined && value !== null ? value : "N/A"}
    </h2>
  </div>
);

export default function CustomerDetailsPage() {
  const searchParams = useSearchParams();
  const [customerID, setCustomerID] = useState("1");
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const customerList = useCustomerList();

  // Update customerID based on URL search parameter
  useEffect(() => {
    const id = searchParams?.get("customerID");
    if (id) {
      setCustomerID(id);
    }
  }, [searchParams]);

  const { data, loading } = useCustomerDetails(customerID) as unknown as {
    data: CustomerDetails;
    loading: boolean;
  };

  // Find customer data for editing
  const customerForEdit = useMemo(() => {
    if (!customerID || !Array.isArray(customerList)) return null;
    
    const customer = customerList.find(
      (c: any) => String(c["Customer ID"]) === String(customerID)
    );
    
    if (!customer) return null;
    
    return {
      "Customer ID": customer["Customer ID"],
      "Risk Profile": customer["Risk Profile"] || "",
      "AUM Label": customer["AUM Label"] || "",
      "Propensity": customer["Propensity"] || "",
      "Priority / Private": customer["Priority / Private"] || "",
      "Customer Type": customer["Customer Type"] || "",
      "Pekerjaan": customer["Pekerjaan"] || "",
      "Status Nikah": customer["Status Nikah"] || "",
      "Usia": customer["Usia"] || 0,
      "Annual Income": customer["Annual Income"] || 0,
      "Total FUM": customer["Total FUM"] || 0,
      "Total AUM": customer["Total AUM"] || 0,
      "Total FBI": customer["Total FBI"] || 0,
    } as CertainCustomerList;
  }, [customerID, customerList]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={false}
        />

        <main className="flex flex-col lg:flex-row flex-1 overflow-y-auto p-2 gap-2">
          {/* Left Sidebar - Customer Info & Quick Actions */}
          <div className="flex flex-col gap-2 w-full lg:w-80 flex-shrink-0">
            {/* Customer ID Header */}
            <div className="rounded-2xl flex items-center justify-between p-3 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="font-bold text-black dark:text-white text-sm truncate">
                  ID: {customerID}
                </div>
                {customerForEdit && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-shrink-0"
                    title="Edit customer"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </div>
              <div className="flex-shrink-0">
                <CustomerDropdown
                  customerID={customerID}
                  setCustomerID={setCustomerID}
                />
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
              {[
                {
                  title: "FUM",
                  value:
                    data && data.Total_FUM
                      ? `$ ${Number(data.Total_FUM).toLocaleString("id-ID")}`
                      : "N/A",
                },
                {
                  title: "AUM",
                  value:
                    data && data.Total_AUM
                      ? `$ ${Number(data.Total_AUM).toLocaleString("id-ID")}`
                      : "N/A",
                },
                {
                  title: "FBI",
                  value:
                    data && data.Total_FBI
                      ? `$ ${Number(data.Total_FBI).toLocaleString("id-ID")}`
                      : "N/A",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl flex flex-col justify-center items-center p-3 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none transition-all hover:shadow-xl dark:hover:shadow-lg"
                >
                  <p className="font-bold text-black dark:text-white text-xs mb-1">
                    {item.title}
                  </p>
                  <h2 className="text-black dark:text-white text-sm font-semibold text-center">
                    {loading ? (
                      <div className="animate-pulse h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ) : (
                      <span className="truncate block w-full">{item.value}</span>
                    )}
                  </h2>
                </div>
              ))}
            </div>

            {/* Customer Details */}
            <div className="flex flex-col rounded-2xl gap-3 p-4 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none text-black dark:text-white shadow-lg dark:shadow-none">
              <h3 className="font-bold text-sm mb-1 text-gray-700 dark:text-gray-300">
                Informasi Nasabah
              </h3>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-pulse flex flex-col items-center text-gray-600 dark:text-gray-300">
                    <div className="h-6 w-6 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-2"></div>
                    <p className="text-xs">Loading...</p>
                  </div>
                </div>
              ) : data ? (
                <div className="space-y-2">
                  <DetailRow label="Status" value={data.Priority_Private} />
                  <DetailRow label="Usia" value={data.Usia} />
                  <DetailRow
                    label="Status Pernikahan"
                    value={data.Status_Nikah}
                  />
                  <DetailRow label="Profil Resiko" value={data.Risk_Profile} />
                  <DetailRow label="Vintage" value={data.Vintage} />
                </div>
              ) : (
                <div className="text-center py-4 text-gray-600 dark:text-gray-300 text-xs">
                  No data available
                </div>
              )}
            </div>

            {/* Activity Manager */}
            <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden flex-1 flex flex-col min-h-0">
              <ActivityManager customerID={customerID} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {/* Portfolio Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
                <PortfolioPie customerID={customerID} />
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
                <OptimizedPortfolio customerID={customerID} />
              </div>
            </div>

            {/* Quarterly Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
                <QuarterlyAUM customerID={customerID} />
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
                <QuarterlyFUM customerID={customerID} />
              </div>
            </div>

            {/* Product Information Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Recommendations */}
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
                <RecommendationProduct customerID={customerID} />
              </div>

              {/* Owned Products */}
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
                <OwnedProductTable customerID={customerID} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {customerForEdit && (
        <CustomerEditModal
          customer={customerForEdit}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
