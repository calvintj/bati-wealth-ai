"use client";

import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import useReprofileRiskTarget from "@/hooks/recommendation-centre/use-reprofile-risk-target";
import { exportToCSV } from "@/utils/csv-export";
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";

export default function ReprofileRiskTarget() {
  // Hook
  const { data, isLoading, error } = useReprofileRiskTarget();
  const reProfileRiskTarget = data?.reprofile_risk_target || [];
  const { canView } = usePagePermissions();

  const getRiskTargetLabel = (value: string) => {
    const labels: Record<string, string> = {
      "1": "1 - Conservative",
      "2": "2 - Balanced",
      "3": "3 - Balanced",
      "4": "4 - Balanced",
      "5": "5 - Aggressive",
    };
    return labels[value] || value;
  };

  const handleExport = () => {
    const exportData = reProfileRiskTarget.map((product) => ({
      "Customer ID": product.bp_number_wm_core,
      "Risk Profile": product.risk_profile,
      "Target Profile": getRiskTargetLabel(product.offer_reprofile_risk_target),
    }));
    exportToCSV(exportData, "reprofile_risk_target");
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-[310px]">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Loading reprofile risk target data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        Error loading reprofile risk target data: {error.message}
      </div>
    );
  }

  return (
    <div className="h-[310px] flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-black dark:text-white">
          Target Profil Ulang
        </h2>
        {reProfileRiskTarget.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            title="Export to CSV"
          >
            <Download size={14} />
            <span>Unduh</span>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto rounded-2xl">
        <table className="divide-y-2 divide-gray-900 text-sm text-center w-full text-black dark:text-white">
          <thead className="sticky top-0 bg-white dark:bg-[#1D283A] z-10">
            <tr>
              <th className="py-2">ID Nasabah</th>
              <th className="py-2">Profil Resiko</th>
              <th className="py-2">Target Profil</th>
              <th className="py-2">Info</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-900">
            {reProfileRiskTarget?.map((product, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="py-2">{product.bp_number_wm_core}</td>
                <td className="py-2">{product.risk_profile}</td>
                <td className="py-2">
                  <span className="text-black dark:text-white font-medium">
                    {getRiskTargetLabel(product.offer_reprofile_risk_target)}
                  </span>
                </td>
                <td className="py-2">
                  {canView ? (
                    <Link
                      href={`/customer-details?customerID=${product.bp_number_wm_core}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#01ACD2] hover:bg-[#0199b8] text-white rounded-md transition-colors text-xs"
                    >
                      Profil
                      <ExternalLink size={12} />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-400 text-white rounded-md cursor-not-allowed text-xs opacity-50"
                    >
                      Profil
                      <ExternalLink size={12} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
