"use client";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";

// Hooks
import { useCustomerDetails } from "@/hooks/customer-details/use-customer-details";
import { useCustomerList } from "@/hooks/customer-mapping/use-customer-list";
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";
import { checkPermissionBeforeAction } from "@/utils/permission-checker";

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

// Helper function to format currency
const formatCurrency = (value: string | undefined): string => {
  if (!value) return "N/A";
  return `$ ${Number(value).toLocaleString("id-ID")}`;
};

// Memoized DetailRow component
const DetailRow = memo(
  ({
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
  )
);

DetailRow.displayName = "DetailRow";

export default function CustomerDetailsPage() {
  const searchParams = useSearchParams();
  const [customerID, setCustomerID] = useState("1");
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { canView, canUpdate, loading: permissionsLoading } = usePagePermissions();
  const customerList = useCustomerList();

  // Update customerID based on URL search parameter
  useEffect(() => {
    const id = searchParams?.get("customerID");
    if (id) {
      setCustomerID(id);
    }
  }, [searchParams]);

  // Fetch customer details - must be declared before using 'data'
  const { data, loading } = useCustomerDetails(customerID) as unknown as {
    data: CustomerDetails;
    loading: boolean;
  };

  // Memoized event handlers
  const handleEditClick = useCallback(() => {
    // Check permission before allowing to edit
    if (!checkPermissionBeforeAction(canUpdate, "update", "customer information")) {
      return;
    }
    setIsEditModalOpen(true);
  }, [canUpdate]);

  const handleModalClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  // Memoized metrics data - now 'data' is available
  const metricsData = useMemo(
    () => [
      {
        title: "FUM",
        value: formatCurrency(data?.Total_FUM),
      },
      {
        title: "AUM",
        value: formatCurrency(data?.Total_AUM),
      },
      {
        title: "FBI",
        value: formatCurrency(data?.Total_FBI),
      },
    ],
    [data?.Total_FUM, data?.Total_AUM, data?.Total_FBI]
  );

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

  // Check view permission
  if (permissionsLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-200">
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
      <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-200">
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
                Access Denied
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You do not have permission to view this page. Please contact your administrator if you need access.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={false}
        />

        <main className="flex flex-col lg:flex-row flex-1 overflow-y-auto p-4 md:p-6 gap-4 bg-gray-50 dark:bg-gray-900">
          {/* Left Sidebar - Customer Info & Quick Actions */}
          <div className="flex flex-col gap-4 w-full lg:w-80 flex-shrink-0">
            {/* Customer ID Header */}
            <div className="rounded-xl flex items-center justify-between p-3 bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="font-bold text-black dark:text-white text-sm truncate">
                  ID: {customerID}
                </div>
                {customerForEdit && (
                  <button
                    onClick={handleEditClick}
                    className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-shrink-0"
                    title="Edit customer"
                    aria-label="Edit customer information"
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
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
              {metricsData.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl flex flex-col justify-center items-center p-3 bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-all hover:shadow-xl"
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
            <div className="flex flex-col rounded-xl gap-3 p-4 bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 text-black dark:text-white shadow-lg transition-shadow hover:shadow-xl">
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
            <div className="rounded-xl bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl overflow-hidden flex-1 flex flex-col min-h-0">
              <ActivityManager customerID={customerID} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            {/* Portfolio Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
                <PortfolioPie customerID={customerID} />
              </div>
              <div className="rounded-xl bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
                <OptimizedPortfolio customerID={customerID} />
              </div>
            </div>

            {/* Quarterly Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
                <QuarterlyAUM customerID={customerID} />
              </div>
              <div className="rounded-xl bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
                <QuarterlyFUM customerID={customerID} />
              </div>
            </div>

            {/* Product Information Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recommendations */}
              <div className="rounded-xl bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
                <RecommendationProduct customerID={customerID} />
              </div>

              {/* Owned Products */}
              <div className="rounded-xl bg-white dark:bg-[#1D283A] border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
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
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
