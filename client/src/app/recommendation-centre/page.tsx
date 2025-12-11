"use client";

import {
  useState,
  Dispatch,
  SetStateAction,
  FC,
  useCallback,
  useMemo,
  memo,
} from "react";
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
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";

// ASSETS
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// Pagination props interface
interface PaginationProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageCount: Dispatch<SetStateAction<number>>;
}

// Helper function for calculating percentage change
const calculatePercentageChange = (
  current: number | undefined,
  previous: number | undefined
): number => {
  if (!previous || previous === 0) return 0;
  return (((current ?? 0) - previous) / previous) * 100;
};

// Helper function for change color
const getChangeColor = (change: number): string => {
  if (change > 0) return "text-green-500";
  if (change < 0) return "text-red-500";
  return "text-orange-500";
};

// Metric card component - extracted and memoized
interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  isLoading: boolean;
}

const MetricCard = memo(
  ({ title, value, change, isLoading }: MetricCardProps) => {
    const changeColor = getChangeColor(change);

    return (
      <div className="rounded-xl p-4 text-black dark:text-white bg-white dark:bg-[#1D283A] text-2xl text-center md:text-left border border-gray-200 dark:border-gray-700 shadow-lg transition-all hover:shadow-xl">
        <p className="font-bold text-lg mb-2">{title}</p>
        {isLoading ? (
          <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        ) : (
          <>
            <div className="flex flex-row items-center justify-center md:justify-start gap-2">
              <p className="text-xl md:text-2xl">{value}</p>
              <p
                className={`text-sm flex flex-row items-center ${changeColor}`}
              >
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
  }
);

MetricCard.displayName = "MetricCard";

// Wrapper components that accept pagination props
const PotentialTransactionsWrapper: FC<PaginationProps> = memo(() => {
  return <PotentialTransactions />;
});
PotentialTransactionsWrapper.displayName = "PotentialTransactionsWrapper";

const OfferProductsRiskWrapper: FC<PaginationProps> = memo(() => {
  return <OfferProductsRisk />;
});
OfferProductsRiskWrapper.displayName = "OfferProductsRiskWrapper";

const ReprofileRiskTargetWrapper: FC<PaginationProps> = memo(() => {
  return <ReprofileRiskTarget />;
});
ReprofileRiskTargetWrapper.displayName = "ReprofileRiskTargetWrapper";

export default function RecommendationCentrePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  const { canView, loading: permissionsLoading } = usePagePermissions();
  const { data: managedNumbers, isLoading: isLoadingNumbers } =
    useManagedNumbers();
  const { data: increasedNumbers, isLoading: isLoadingIncreased } =
    useIncreasedNumbers();

  // Memoize calculations
  const metrics = useMemo(() => {
    const aumIncrease = calculatePercentageChange(
      increasedNumbers?.currentQuarter?.all_aum,
      increasedNumbers?.lastQuarter?.all_aum
    );
    const fbiIncrease = calculatePercentageChange(
      increasedNumbers?.currentQuarter?.all_fbi,
      increasedNumbers?.lastQuarter?.all_fbi
    );
    const customerIncrease = calculatePercentageChange(
      increasedNumbers?.currentQuarter?.all_customers,
      increasedNumbers?.lastQuarter?.all_customers
    );

    return { aumIncrease, fbiIncrease, customerIncrease };
  }, [increasedNumbers]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // Component switcher state
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);

  // Memoize components array to prevent recreation on every render
  const components = useMemo(
    () => [
      { component: PotentialTransactionsWrapper, title: "Transaksi Potensial" },
      { component: OfferProductsRiskWrapper, title: "Prospek Penjualan" },
      { component: ReprofileRiskTargetWrapper, title: "Target Profil Ulang" },
    ],
    []
  );

  // Pagination handlers - optimized with useCallback
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

  // Tab click handler - memoized
  const handleTabClick = useCallback((index: number) => {
    setActiveComponentIndex(index);
    setCurrentPage(0);
  }, []);

  // Get current component - memoized
  const { component: ActiveComponent, title: activeTitle } = useMemo(
    () => components[activeComponentIndex],
    [components, activeComponentIndex]
  );

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
          <main className="flex flex-col md:flex-row gap-4 flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">
              Loading permissions...
            </p>
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
          <main className="flex flex-col md:flex-row gap-4 flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You do not have permission to view this page. Please contact
                your administrator if you need access.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
          showRiskDropdown={false}
        />

        {/* DASHBOARD CONTENT */}
        <main className="flex flex-col md:flex-row gap-4 flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Metrics Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Total AUM"
                value={
                  managedNumbers?.all_aum
                    ? `$ ${Number(managedNumbers.all_aum).toLocaleString(
                        "id-ID"
                      )}`
                    : "N/A"
                }
                change={metrics.aumIncrease}
                isLoading={isLoadingNumbers || isLoadingIncreased}
              />
              <MetricCard
                title="Total FBI"
                value={
                  managedNumbers?.all_fbi
                    ? `$ ${Number(managedNumbers.all_fbi).toLocaleString(
                        "id-ID"
                      )}`
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
            </section>

            {/* Portfolio and Transactions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
                <ManagerPortfolio />
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
                <LastTransactions />
              </div>
            </section>

            {/* Recommendations Section */}
            <section className="space-y-4">
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
                        onClick={() => handleTabClick(idx)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          activeComponentIndex === idx
                            ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow"
                            : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                        }`}
                        aria-pressed={activeComponentIndex === idx}
                        aria-label={`Switch to ${comp.title}`}
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
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
                <ActiveComponent
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setPageCount={setPageCount}
                />
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 gap-4 w-full md:w-80 flex-shrink-0">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
              <TaskManager selectedDate={selectedDate} />
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D283A] shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
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
