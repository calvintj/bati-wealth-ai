"use client";

import { useState, Dispatch, SetStateAction, FC, useCallback } from "react";
import useManagedNumbers from "@/hooks/recommendation-centre/use-managed-numbers";
import useIncreasedNumbers from "@/hooks/recommendation-centre/use-increased-numbers";

// COMPONENTS
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import Calendar from "@/components/recommendation-centre/calender";
import TaskManager from "@/components/recommendation-centre/task-manager";
import ManagerPortfolio from "@/components/recommendation-centre/manager-portfolio";
import LastTransactions from "@/components/recommendation-centre/last-transactions";
import PotentialTransactions from "@/components/recommendation-centre/potential-transactions";
import OfferProductsRisk from "@/components/recommendation-centre/offer-products-risk";
import ReprofileRiskTarget from "@/components/recommendation-centre/reprofile-risk-target";

// ASSETS
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// Pagination props interface
interface PaginationProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageCount: Dispatch<SetStateAction<number>>;
}

// Wrapper components that accept pagination props
const PotentialTransactionsWrapper: FC<PaginationProps> = () => {
  return <PotentialTransactions />;
};

const OfferProductsRiskWrapper: FC<PaginationProps> = () => {
  return <OfferProductsRisk />;
};

const ReprofileRiskTargetWrapper: FC<PaginationProps> = () => {
  return <ReprofileRiskTarget />;
};

export default function TaskManagerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  // Removed unused state variable customerRisk
  const { data: managedNumbers } = useManagedNumbers();
  const { data: increasedNumbers } = useIncreasedNumbers();

  const aumIncrease =
    increasedNumbers?.lastQuarter?.all_aum !== 0
      ? (((increasedNumbers?.currentQuarter?.all_aum ?? 0) -
          (increasedNumbers?.lastQuarter?.all_aum ?? 0)) /
          (increasedNumbers?.lastQuarter?.all_aum ?? 1)) *
        100
      : 0;
  const fbiIncrease =
    increasedNumbers?.lastQuarter?.all_fbi !== 0
      ? (((increasedNumbers?.currentQuarter?.all_fbi ?? 0) -
          (increasedNumbers?.lastQuarter?.all_fbi ?? 0)) /
          (increasedNumbers?.lastQuarter?.all_fbi ?? 1)) *
        100
      : 0;
  const customerIncrease =
    increasedNumbers?.lastQuarter?.all_customers !== 0
      ? (((increasedNumbers?.currentQuarter?.all_customers ?? 0) -
          (increasedNumbers?.lastQuarter?.all_customers ?? 0)) /
          (increasedNumbers?.lastQuarter?.all_customers ?? 1)) *
        100
      : 0;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // Component switcher state
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);
  const components = [
    { component: PotentialTransactionsWrapper, title: "Transaksi Potensial", },
    { component: OfferProductsRiskWrapper, title: "Prospek Penjualan" },
    { component: ReprofileRiskTargetWrapper, title: "Target Profil Ulang" },
  ];

  // Pagination handlers
  const handlePrevPage = useCallback(() => {
    if (activeComponentIndex > 0) {
      setActiveComponentIndex((prev) => prev - 1);
      setCurrentPage(0);
    } else {
      setCurrentPage((prev) => Math.max(0, prev - 1));
    }
  }, [activeComponentIndex]);

  const handleNextPage = useCallback(() => {
    if (activeComponentIndex < components.length - 1) {
      setActiveComponentIndex((prev) => prev + 1);
      setCurrentPage(0);
    } else if (currentPage < pageCount - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [activeComponentIndex, currentPage, pageCount, components.length]);

  // Get current component
  const ActiveComponent = components[activeComponentIndex].component;
  const activeTitle = components[activeComponentIndex].title;

  return (
    <div className="flex h-screen dark:bg-gray-900 text-gray-200">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <Navbar setCustomerRisk={setCustomerRisk} customerRisk={customerRisk} />

        {/* DASHBOARD CONTENT */}
        <main className="flex flex-col md:flex-row gap-2 flex-1 m-2 overflow-scroll overscroll-contain">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-2 mb-2">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 rounded-2xl p-4 text-black dark:text-white bg-white dark:bg-[#1D283A] text-2xl text-center md:text-left border border-gray-300 dark:border-none">
                <p className="font-bold">Total AUM</p>
                <div className="flex flex-row items-center justify-center md:justify-start">
                  <p>
                    {managedNumbers?.all_aum
                      ? `Rp ${Number(managedNumbers.all_aum).toLocaleString(
                          "id-ID"
                        )}`
                      : "N/A"}
                  </p>
                  <p
                    className={`text-sm ${
                      aumIncrease > 0
                        ? "text-green-500"
                        : aumIncrease < 0
                        ? "text-red-500"
                        : "text-orange-500"
                    } flex flex-row items-center`}
                  >
                    {aumIncrease > 0 ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    {aumIncrease.toFixed(2)}%
                  </p>
                </div>
                <p className="text-sm text-gray-400">vs kuartal sebelumnya</p>
              </div>
              <div className="flex-1 rounded-2xl p-4 text-black dark:text-white bg-white dark:bg-[#1D283A] text-2xl text-center md:text-left border border-gray-300 dark:border-none">
                <p className="font-bold">Total FBI</p>
                <div className="flex flex-row items-center justify-center md:justify-start">
                  <p>
                    {managedNumbers?.all_fbi
                      ? `Rp ${Number(managedNumbers.all_fbi).toLocaleString(
                          "id-ID"
                        )}`
                      : "N/A"}
                  </p>
                  <p
                    className={`text-sm ${
                      fbiIncrease > 0
                        ? "text-green-500"
                        : fbiIncrease < 0
                        ? "text-red-500"
                        : "text-orange-500"
                    } flex flex-row items-center`}
                  >
                    {fbiIncrease > 0 ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : fbiIncrease < 0 ? (
                      <ArrowDownIcon className="w-4 h-4" />
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                    {fbiIncrease.toFixed(2)}%
                  </p>
                </div>
                <p className="text-sm text-gray-400">vs kuartal sebelumnya</p>
              </div>
              <div className="flex-1 rounded-2xl p-4 text-black dark:text-white bg-white dark:bg-[#1D283A] text-2xl text-center md:text-left border border-gray-300 dark:border-none">
                <p className="font-bold">Total Customers</p>
                <div className="flex flex-row items-center justify-center md:justify-start">
                  <p>{managedNumbers?.all_customers || "N/A"}</p>
                  <p
                    className={`text-sm ${
                      customerIncrease > 0
                        ? "text-green-500"
                        : customerIncrease < 0
                        ? "text-red-500"
                        : "text-orange-500"
                    } flex flex-row items-center`}
                  >
                    {customerIncrease > 0 ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : customerIncrease < 0 ? (
                      <ArrowDownIcon className="w-4 h-4" />
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                    {customerIncrease.toFixed(2)}%
                  </p>
                </div>
                <p className="text-sm text-gray-400">vs kuartal sebelumnya</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 flex-1">
              <div className="flex-1 rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none">
                <ManagerPortfolio />
              </div>
              <div className="flex-1 rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none">
                <LastTransactions />
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p className="text-lg font-bold text-black dark:text-white">{activeTitle}</p>
              <div className="flex justify-end items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={activeComponentIndex === 0 && currentPage === 0}
                  className={`
                    flex items-center justify-center
                    w-8 h-8 rounded-full
                    bg-gray-700 hover:bg-gray-600
                    transition-colors duration-200
                    ${
                      activeComponentIndex === 0 && currentPage === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  <ChevronLeftIcon className="h-5 w-5 text-white cursor-pointer" />
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={
                    activeComponentIndex === components.length - 1 &&
                    currentPage >= pageCount - 1
                  }
                  className={`
                    flex items-center justify-center
                    w-8 h-8 rounded-full
                    bg-gray-700 hover:bg-gray-600
                    transition-colors duration-200
                    ${
                      activeComponentIndex === components.length - 1 &&
                      currentPage >= pageCount - 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  <ChevronRightIcon className="h-5 w-5 text-white cursor-pointer" />
                </button>
              </div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none">
              <ActiveComponent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setPageCount={setPageCount}
              />
            </div>
          </div>

          {/* Right Column */}

          <div className="grid grid-cols-1 gap-2 mb-2">
            <div className="rounded-2xl bg-white dark:bg-[#1D283A]">
              <TaskManager selectedDate={selectedDate} />
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#1D283A]">
              <Calendar
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
