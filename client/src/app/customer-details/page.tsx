"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { GrOptimize } from "react-icons/gr";

// Hooks
import { useCustomerDetails } from "@/hooks/customer-details/use-customer-details";
import useGetReturnPercentage from "@/hooks/customer-details/use-return-percentage";

// Components
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import CustomerDropdown from "@/components/customer-details/customer-id-bar";
import PortfolioPie from "@/components/customer-details/customer-portfolio";
import OptimizedPortfolio from "@/components/customer-details/customer-optimized-portfolio";
import ActivityManager from "@/components/customer-details/activity-manager";
import OwnedProductTable from "@/components/customer-details/owned-products";
import RecommendationProduct from "@/components/customer-details/recommendation-products";

interface ReturnPercentage {
  current_return: number;
  expected_return: number;
}

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
  <div className="bg-gray-700 rounded-2xl flex items-center justify-between p-2">
    <h2 className="pl-2 font-bold">{label}</h2>
    <h2 className="pr-2">
      {value !== undefined && value !== null ? value : "N/A"}
    </h2>
  </div>
);

export default function CustomerDetailsPage() {
  const searchParams = useSearchParams();
  const [customerID, setCustomerID] = useState("1");
  const [currentPortfolio, setCurrentPortfolio] = useState<
    "current" | "optimized"
  >("current");
  const [, setCustomerRisk] = useState<string>("All");

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

  const { returnPercentage } = useGetReturnPercentage(customerID);

  const togglePortfolio = () => {
    setCurrentPortfolio((prev) =>
      prev === "current" ? "optimized" : "current"
    );
  };

  // Safely compute return percentages with proper type checking
  const currentReturn =
    returnPercentage &&
    Array.isArray(returnPercentage) &&
    returnPercentage.length > 0
      ? Number((returnPercentage[0] as ReturnPercentage).current_return || 0)
      : 0;

  const expectedReturn =
    returnPercentage &&
    Array.isArray(returnPercentage) &&
    returnPercentage.length > 0
      ? Number((returnPercentage[0] as ReturnPercentage).expected_return || 0)
      : 0;

  const returnDiff = expectedReturn - currentReturn;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar setCustomerRisk={setCustomerRisk} />

        <main className="grid grid-cols-12 gap-2 flex-1 overflow-y-auto mr-2 mt-2 overscroll-contain">
          {/* Left Column - Customer Details */}
          <div className="flex flex-col gap-2 col-span-3">
            <div className="rounded-2xl flex items-center justify-between p-2 bg-[#1D283A]">
              <div className="font-bold">ID Nasabah: {customerID}</div>
              <CustomerDropdown
                customerID={customerID}
                setCustomerID={setCustomerID}
              />
            </div>
            <div className="flex flex-col rounded-2xl gap-4 p-4 bg-[#1D283A]">
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

            <div className="ml-2 font-bold">Rekomendasi</div>
            <div className="rounded-2xl flex-grow mb-2 bg-[#1D283A]">
              <RecommendationProduct customerID={customerID} />
            </div>
          </div>

          {/* Right Column - FUM, AUM, FBI and Portfolio */}
          <div className="flex flex-col gap-2 col-span-9">
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  title: "FUM",
                  value:
                    data && data.Total_FUM
                      ? `Rp ${Number(data.Total_FUM).toLocaleString("id-ID")}`
                      : "N/A",
                },
                {
                  title: "AUM",
                  value:
                    data && data.Total_AUM
                      ? `Rp ${Number(data.Total_AUM).toLocaleString("id-ID")}`
                      : "N/A",
                },
                {
                  title: "FBI",
                  value:
                    data && data.Total_FBI
                      ? `Rp ${Number(data.Total_FBI).toLocaleString("id-ID")}`
                      : "N/A",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl flex flex-col justify-center items-center text-2xl p-4 bg-[#1D283A]"
                >
                  <h1 className="font-bold">{item.title}</h1>
                  <h1>{item.value}</h1>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 h-[420px]">
              {/* Portfolio Section */}
              <div className="rounded-2xl bg-[#1D283A] flex flex-col justify-between">
                <div className="flex-1">
                  {currentPortfolio === "optimized" ? (
                    <OptimizedPortfolio customerID={customerID} />
                  ) : (
                    <PortfolioPie customerID={customerID} />
                  )}
                </div>
                <div className="flex justify-between items-center px-4 py-4">
                  <div className="flex flex-col">
                    <p className="text-sm text-white">
                      {currentPortfolio === "current"
                        ? "Current Return"
                        : "Expected Return"}
                    </p>
                    {currentPortfolio === "current" ? (
                      <p className="bg-[#01ACD2] text-black rounded-md text-center w-12 py-1">
                        {(currentReturn * 100).toFixed(0)}%
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <p className="bg-[#01ACD2] text-black rounded-md text-center w-12 py-1">
                          {(expectedReturn * 100).toFixed(0)}%
                        </p>
                        <p
                          className={`flex items-center justify-center rounded-md text-center w-12 py-1 ${
                            returnDiff > 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {returnDiff > 0 ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                          )}
                          {Math.abs(returnDiff * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                  </div>
                  <GrOptimize
                    className="text-[#01ACD2] text-5xl border-2 border-[#01ACD2] rounded-md p-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                    onClick={togglePortfolio}
                  />
                </div>
              </div>

              {/* Activity Manager Section */}
              <div className="rounded-2xl bg-[#1D283A]">
                <ActivityManager customerID={customerID} />
              </div>
            </div>

            <div className="ml-2">
              <p className="font-bold">Kepemilikan Produk</p>
              <p className="text-sm text-gray-400">Kuartal Terakhir</p>
            </div>
            <div className="rounded-2xl flex-grow mb-2 bg-[#1D283A]">
              <OwnedProductTable customerID={customerID} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
