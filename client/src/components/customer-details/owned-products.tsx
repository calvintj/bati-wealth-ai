"use client";

import { Download } from "lucide-react";
import useOwnedProduct from "../../hooks/customer-details/use-owned-products";
import { exportToCSV } from "@/utils/csv-export";

const OwnedProductTable = ({ customerID }: { customerID: string }) => {
  // Hook
  const {
    data: ownedProduct,
    isLoading: loading,
    error,
  } = useOwnedProduct(customerID);

  const handleExport = () => {
    if (!ownedProduct || ownedProduct.length === 0) return;
    
    const exportData = ownedProduct.map((product) => ({
      "Nama Produk": product.nama_produk,
      "Keterangan": product.keterangan,
      "Investasi": product.jumlah_amount,
      "Harga Beli": product.price_bought,
      "Unit": product.jumlah_transaksi,
      "Untung/Rugi": product.profit,
      "Untung/Rugi (%)": `${(product.return_value * 100).toFixed(2)}%`,
    }));
    exportToCSV(exportData, `owned_products_${customerID}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-pulse flex flex-col items-center text-gray-600 dark:text-gray-300">
          <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-2"></div>
          <p>Memuat Kepemilikan Produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-red-600 dark:text-red-400">
        <div className="text-center">
          <p>Error Memuat kepemilikan produk: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white">
            Kepemilikan Produk
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kuartal Terakhir
          </p>
        </div>
        {ownedProduct && ownedProduct.length > 0 && (
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
      <div className="flex-1 overflow-auto">
        {!ownedProduct || ownedProduct.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8 text-gray-600 dark:text-gray-300">
            <p>Tidak ada data produk yang dimiliki</p>
          </div>
        ) : (
          <table className="min-w-full divide-y-2 divide-gray-900 text-sm bg-white dark:bg-[#1D283A] text-center">
            <thead>
              <tr className="sticky top-0 z-30">
                <th className="sticky left-0 z-40 whitespace-nowrap px-4 py-2 font-medium text-black dark:text-white bg-white dark:bg-[#1D283A]">
                  Nama Produk
                </th>
                <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-black dark:text-white bg-white dark:bg-[#1D283A]">
                  Keterangan
                </th>
                <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-black dark:text-white bg-white dark:bg-[#1D283A]">
                  Investasi
                </th>
                <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-black dark:text-white bg-white dark:bg-[#1D283A]">
                  Harga Beli
                </th>
                <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-black dark:text-white bg-white dark:bg-[#1D283A]">
                  Unit
                </th>
                <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-black dark:text-white bg-white dark:bg-[#1D283A]">
                  Untung/Rugi
                </th>
                <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-black dark:text-white bg-white dark:bg-[#1D283A]">
                  Untung/Rugi (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-900">
              {ownedProduct.map((product, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="sticky left-0 z-10 whitespace-nowrap px-4 py-2 text-black dark:text-white bg-white dark:bg-[#1D283A]">
                    {product.nama_produk}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-black dark:text-white">
                    {product.keterangan}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-black dark:text-white">
                    ${product.jumlah_amount?.toLocaleString() || 0}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-black dark:text-white">
                    ${product.price_bought?.toLocaleString() || 0}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-black dark:text-white">
                    {product.jumlah_transaksi?.toLocaleString() || 0}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <span
                      className={`font-semibold ${
                        product.profit > 0
                          ? "text-green-500"
                          : product.profit < 0
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {product.profit > 0
                        ? `+$${product.profit.toLocaleString()}`
                        : product.profit < 0
                        ? `-$${Math.abs(product.profit).toLocaleString()}`
                        : "$0"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <span
                      className={`font-semibold ${
                        product.return_value > 0
                          ? "text-green-500"
                          : product.return_value < 0
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {product.return_value > 0
                        ? `+${(product.return_value * 100).toFixed(2)}%`
                        : product.return_value < 0
                        ? `${(product.return_value * 100).toFixed(2)}%`
                        : "0%"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OwnedProductTable;
