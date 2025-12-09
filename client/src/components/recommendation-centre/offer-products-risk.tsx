"use client";

import { Download, ExternalLink } from "lucide-react";
import useOfferProductRisk from "../../hooks/recommendation-centre/use-offer-product-risk";
import Link from "next/link";
import { exportToCSV } from "@/utils/csv-export";

export default function OfferProductRisk() {
  const { data, isLoading, error } = useOfferProductRisk();
  const offerProductRisk = data?.offer_product_risk || [];

  const handleExport = () => {
    const exportData = offerProductRisk.map((product) => {
      const riskProducts = [];
      if (product.offer_product_risk_1 === "TRUE") riskProducts.push("1");
      if (product.offer_product_risk_2 === "TRUE") riskProducts.push("2");
      if (product.offer_product_risk_3 === "TRUE") riskProducts.push("3");
      if (product.offer_product_risk_4 === "TRUE") riskProducts.push("4");
      if (product.offer_product_risk_5 === "TRUE") riskProducts.push("5");

      return {
        "Customer ID": product.bp_number_wm_core,
        "Risk Profile": product.risk_profile,
        "Offered Risk Products": riskProducts.join(", "),
      };
    });
    exportToCSV(exportData, "offer_product_risk");
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-[310px]">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Loading offer product risk data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        Error loading offer product risk data: {error.message}
      </div>
    );
  }

  return (
    <div className="h-[310px] flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-black dark:text-white">
          Prospek Penjualan
        </h2>
        {offerProductRisk.length > 0 && (
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
              <th className="py-2">Profil Resiko</th>
              <th className="py-2">Produk Resiko Ditawarkan</th>
              <th className="py-2">Info</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-900">
            {offerProductRisk?.map((product, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="py-2">{product.bp_number_wm_core}</td>
                <td className="py-2">{product.risk_profile}</td>
                <td className="py-2">
                  <div className="flex flex-wrap justify-center gap-1">
                    {product.offer_product_risk_1 === "TRUE" && (
                      <span className="bg-[#2ABC36] text-white px-2 py-1 rounded text-xs">
                        1
                      </span>
                    )}
                    {product.offer_product_risk_2 === "TRUE" && (
                      <span className="bg-[#73BC2A] text-white px-2 py-1 rounded text-xs">
                        2
                      </span>
                    )}
                    {product.offer_product_risk_3 === "TRUE" && (
                      <span className="bg-[#FBB716] text-white px-2 py-1 rounded text-xs">
                        3
                      </span>
                    )}
                    {product.offer_product_risk_4 === "TRUE" && (
                      <span className="bg-[#FB6616] text-white px-2 py-1 rounded text-xs">
                        4
                      </span>
                    )}
                    {product.offer_product_risk_5 === "TRUE" && (
                      <span className="bg-[#B92932] text-white px-2 py-1 rounded text-xs">
                        5
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2">
                  <Link
                    href={`/customer-details?customerID=${product.bp_number_wm_core}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#01ACD2] hover:bg-[#0199b8] text-white rounded-md transition-colors text-xs"
                  >
                    Profil
                    <ExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
