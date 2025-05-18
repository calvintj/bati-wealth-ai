"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Hooks
import { useCustomerDetails } from "@/hooks/customer-details/use-customer-details";

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
  <div className="bg-gray-300 dark:bg-gray-700 rounded-2xl flex items-center justify-between p-2">
    <h2 className="pl-2 font-bold">{label}</h2>
    <h2 className="pr-2">
      {value !== undefined && value !== null ? value : "N/A"}
    </h2>
  </div>
);

export default function CustomerDetailsPage() {
  const searchParams = useSearchParams();
  const [customerID, setCustomerID] = useState("1");
  const [customerRisk, setCustomerRisk] = useState<string>("All");

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={false}
        />

        <main className="flex flex-col lg:flex-row flex-1 overflow-y-auto p-2">
          {/* Left Column */}
          <div className="flex flex-col gap-2 w-full lg:w-1/4 mb-2 lg:mb-0 lg:mr-2">
            <div className="rounded-2xl flex items-center justify-between p-2 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none">
              <div className="font-bold text-black dark:text-white">
                ID Nasabah: {customerID}
              </div>
              <CustomerDropdown
                customerID={customerID}
                setCustomerID={setCustomerID}
              />
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
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
                  className="rounded-2xl flex flex-col justify-center items-center text-xl sm:text-2xl p-4 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none flex-1 shadow-lg dark:shadow-none"
                >
                  <p className="font-bold text-black dark:text-white">
                    {item.title}
                  </p>
                  <h1 className="text-black dark:text-white">{item.value}</h1>
                </div>
              ))}
            </div>

            <div className="flex flex-col rounded-2xl gap-4 p-4 bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none text-black dark:text-white shadow-lg dark:shadow-none">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : data ? (
                <>
                  <DetailRow label="Status" value={data.Priority_Private} />
                  <DetailRow label="Usia" value={data.Usia} />
                  <DetailRow
                    label="Status Pernikahan"
                    value={data.Status_Nikah}
                  />
                  <DetailRow label="Profil Resiko" value={data.Risk_Profile} />
                  <DetailRow label="Vintage" value={data.Vintage} />
                </>
              ) : (
                <div className="text-center">No customer data available</div>
              )}
            </div>

            <div>
              <RecommendationProduct customerID={customerID} />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex flex-col md:flex-row gap-2">
              {/* Portfolio Section */}
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none flex-1 shadow-lg dark:shadow-none">
                <PortfolioPie customerID={customerID} />
              </div>

              {/* Activity Manager Section */}
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none flex-1 shadow-lg dark:shadow-none">
                <OptimizedPortfolio customerID={customerID} />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none flex-1 shadow-lg dark:shadow-none">
                <QuarterlyAUM customerID={customerID} />
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none flex-1 shadow-lg dark:shadow-none">
                <QuarterlyFUM customerID={customerID} />
              </div>
            </div>
            <div className="ml-2">
              <p className="font-bold text-black dark:text-white">
                Kepemilikan Produk
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Kuartal Terakhir
              </p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none">
              <OwnedProductTable customerID={customerID} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
