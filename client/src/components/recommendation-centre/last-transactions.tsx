"use client";

import React, { useMemo } from "react";
import { Download, ExternalLink } from "lucide-react";
import { useLastTransaction } from "../../hooks/recommendation-centre/use-last-transactions";
import { exportToCSV } from "@/utils/csv-export";
import Link from "next/link";

export default function LastTransactionComponent() {
  const { data, isLoading, error } = useLastTransaction();
  const transactions = data?.last_transaction || [];

  const currentDate = useMemo(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return today.toLocaleDateString("id-ID", options);
  }, []);

  const handleExport = () => {
    const exportData = transactions.map((t) => ({
      "Customer ID": t.bp_number_wm_core,
      "Transaction ID": t.transaction_id,
      "Amount": t.jumlah_amount,
      "Action": "Beli",
    }));
    exportToCSV(exportData, "last_transactions");
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Loading transaction data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        Error loading transaction data: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-bold text-2xl text-black dark:text-white">
            Transaksi Terakhir
          </h1>
          <p className="text-gray-400 text-sm">{currentDate}</p>
        </div>
        {transactions.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            title="Export to CSV"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        )}
      </div>
      {transactions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-300">
          <p>No transactions available.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="divide-gray-900 text-center w-full border-separate border-spacing-y-3.5 text-black dark:text-white text-sm">
            <thead className="sticky top-0 bg-white dark:bg-[#1D283A] z-10">
              <tr>
                <th className="py-2">ID Nasabah</th>
                <th className="py-2">Kode</th>
                <th className="py-2">Jumlah</th>
                <th className="py-2">Aksi</th>
                <th className="py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.transaction_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="py-2">{transaction.bp_number_wm_core}</td>
                  <td className="py-2">{transaction.transaction_id}</td>
                  <td className="py-2">
                    ${transaction.jumlah_amount?.toLocaleString() || 0}
                  </td>
                  <td className="py-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                      Beli
                    </span>
                  </td>
                  <td className="py-2">
                    <Link
                      href={`/customer-details?customerID=${transaction.bp_number_wm_core}`}
                      className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-xs"
                    >
                      Lihat
                      <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
