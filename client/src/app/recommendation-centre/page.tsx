"use client";

import { useState, Dispatch, SetStateAction, FC, useCallback, useMemo } from "react";
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

export default function RecommendationCentrePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  const { data: managedNumbers, isLoading: isLoadingNumbers } = useManagedNumbers();
  const { data: increasedNumbers, isLoading: isLoadingIncreased } = useIncreasedNumbers();

  // Memoize calculations
  const metrics = useMemo(() => {
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

    return { aumIncrease, fbiIncrease, customerIncrease };
  }, [increasedNumbers]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // Component switcher state
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);
  const components = [
    { component: PotentialTransactionsWrapper, title: "Transaksi Potensial" },
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

  // Metric card component
  const MetricCard = ({
    title,
    value,
    change,
    isLoading,
  }: {
    title: string;
    value: string | number;
    change: number;
    isLoading: boolean;
  }) => {
    const changeColor =
      change > 0
        ? "text-green-500"
        : change < 0
        ? "text-red-500"
        : "text-orange-500";

    return (
      <div className="flex-1 rounded-2xl p-4 text-black dark:text-white bg-white dark:bg-[#1D283A] text-2xl text-center md:text-left border border-gray-300 dark:border-none shadow-lg dark:shadow-none transition-all hover:shadow-xl dark:hover:shadow-lg">
        <p className="font-bold text-lg mb-2">{title}</p>
        {isLoading ? (
          <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        ) : (
          <>
            <div className="flex flex-row items-center justify-center md:justify-start gap-2">
              <p className="text-xl md:text-2xl">{value}</p>
              <p className={`text-sm flex flex-row items-center ${changeColor}`}>
                {change > 0 ? (
                  <ArrowUpIcon className="w-4 h-4" />
                ) : change < 0 ? (
                  <ArrowDownIcon className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4" />
                )}
                {change.toFixed(2)}%
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-1">vs kuartal sebelumnya</p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-900 text-gray-200">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
          showRiskDropdown={false}
        />

        {/* DASHBOARD CONTENT */}
        <main className="flex flex-col md:flex-row gap-2 flex-1 p-2 overflow-y-auto">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-2 mb-2">
            {/* Metrics Cards */}
            <div className="flex flex-col md:flex-row gap-2">
              <MetricCard
                title="Total AUM"
                value={
                  managedNumbers?.all_aum
                    ? `$ ${Number(managedNumbers.all_aum).toLocaleString("id-ID")}`
                    : "N/A"
                }
                change={metrics.aumIncrease}
                isLoading={isLoadingNumbers || isLoadingIncreased}
              />
              <MetricCard
                title="Total FBI"
                value={
                  managedNumbers?.all_fbi
                    ? `$ ${Number(managedNumbers.all_fbi).toLocaleString("id-ID")}`
                    : "N/A"
                }
                change={metrics.fbiIncrease}
                isLoading={isLoadingNumbers || isLoadingIncreased}
              />
              <MetricCard
                title="Total Customers"
                value={managedNumbers?.all_customers || "N/A"}
                change={metrics.customerIncrease}
                isLoading={isLoadingNumbers || isLoadingIncreased}
              />
            </div>

            {/* Portfolio and Transactions */}
            <div className="flex flex-col md:flex-row gap-2 flex-1 min-h-0">
              <div className="flex-1 rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
                <ManagerPortfolio />
              </div>
              <div className="flex-1 rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
                <LastTransactions />
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="flex flex-row gap-2 items-center justify-between px-2">
              <h2 className="text-lg font-bold text-black dark:text-white">
                {activeTitle}
              </h2>
              <div className="flex items-center gap-2">
                {/* Component Tabs */}
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  {components.map((comp, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveComponentIndex(idx);
                        setCurrentPage(0);
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        activeComponentIndex === idx
                          ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow"
                          : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {comp.title}
                    </button>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevPage}
                    disabled={activeComponentIndex === 0 && currentPage === 0}
                    className={`
                      flex items-center justify-center
                      w-8 h-8 rounded-full
                      bg-gray-700 hover:bg-gray-600
                      transition-colors duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    title="Previous"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-white" />
                  </button>

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
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    title="Next"
                  >
                    <ChevronRightIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Component */}
            <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
              <ActiveComponent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setPageCount={setPageCount}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 gap-2 mb-2 w-full md:w-80">
            <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
              <TaskManager selectedDate={selectedDate} />
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none shadow-lg dark:shadow-none overflow-hidden">
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
