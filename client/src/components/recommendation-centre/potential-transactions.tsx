"use client";

import { useState } from "react";
import { Download, ExternalLink, Pencil } from "lucide-react";
import usePotentialTransaction from "../../hooks/recommendation-centre/use-potential-transaction";
import { exportToCSV } from "@/utils/csv-export";
import Link from "next/link";
import CustomerEditModal from "@/components/dashboard-overview/customer-edit-modal";
import { useCustomerList } from "@/hooks/customer-mapping/use-customer-list";
import { CertainCustomerList } from "@/types/page/overview";

export default function OwnedProductTable() {
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Hook
  const { data, isLoading, error } = usePotentialTransaction();
  const potentialTransactions = data?.potential_transaction || [];
  const customerList = useCustomerList();

  // Find customer data for editing
  const editingCustomer = editingCustomerId
    ? (Array.isArray(customerList) ? customerList : []).find(
        (c: any) => String(c["Customer ID"]) === String(editingCustomerId)
      )
    : null;

  const handleExport = () => {
    const exportData = potentialTransactions.map((t) => ({
      "Customer ID": t.id_nasabah,
      "Product Name": t.nama_produk,
      "Profit/Loss (%)": t.profit,
      "Status": t.profit > 0 ? "Ambil Profit" : "Janji Temu",
    }));
    exportToCSV(exportData, "potential_transactions");
  };

  const handleEditCustomer = (customerId: string) => {
    setEditingCustomerId(customerId);
    setIsEditModalOpen(true);
  };

  // Convert customer to CertainCustomerList format
  const customerForEdit = editingCustomer
    ? {
        "Customer ID": editingCustomer["Customer ID"],
        "Risk Profile": editingCustomer["Risk Profile"] || "",
        "AUM Label": editingCustomer["AUM Label"] || "",
        "Propensity": editingCustomer["Propensity"] || "",
        "Priority / Private": editingCustomer["Priority / Private"] || "",
        "Customer Type": editingCustomer["Customer Type"] || "",
        "Pekerjaan": editingCustomer["Pekerjaan"] || "",
        "Status Nikah": editingCustomer["Status Nikah"] || "",
        "Usia": editingCustomer["Usia"] || 0,
        "Annual Income": editingCustomer["Annual Income"] || 0,
        "Total FUM": editingCustomer["Total FUM"] || 0,
        "Total AUM": editingCustomer["Total AUM"] || 0,
        "Total FBI": editingCustomer["Total FBI"] || 0,
      } as CertainCustomerList
    : null;

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-[310px]">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Loading potential transaction data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        Error loading potential transaction data: {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="h-[310px] flex flex-col mb-3">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-black dark:text-white">
            Transaksi Potensial
          </h2>
          {potentialTransactions.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              title="Export to CSV"
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          )}
        </div>
        <div className="flex-1 overflow-auto rounded-2xl">
          <table className="divide-y-2 divide-gray-900 text-sm text-center w-full text-black dark:text-white">
            <thead className="sticky top-0 bg-white dark:bg-[#1D283A] z-10">
              <tr>
                <th className="py-2">ID Nasabah</th>
                <th className="py-2">Nama Produk</th>
                <th className="py-2">Untung/Rugi (%)</th>
                <th className="py-2">Aksi</th>
                <th className="py-2">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-900">
              {potentialTransactions?.map((product, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-2">{product.id_nasabah}</td>
                  <td className="py-2">{product.nama_produk}</td>
                  <td className="py-2">
                    <span
                      className={
                        product.profit > 0
                          ? "text-green-500 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {product.profit > 0
                        ? `+${product.profit}%`
                        : `${product.profit}%`}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center items-center">
                      {product.profit > 0 ? (
                        <span className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md">
                          Ambil Profit
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-black bg-yellow-500 rounded-md">
                          Janji Temu
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEditCustomer(product.id_nasabah)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Edit customer"
                      >
                        <Pencil size={14} />
                      </button>
                      <Link
                        href={`/customer-details?customerID=${product.id_nasabah}`}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="View customer details"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {customerForEdit && (
        <CustomerEditModal
          customer={customerForEdit}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCustomerId(null);
          }}
        />
      )}
    </>
  );
}
