"use client";

import { Download } from "lucide-react";
import { exportToCSV, CustomerData } from "@/utils/csv-export";
import { CertainCustomerList } from "@/types/page/overview";
import { CustomerList } from "@/types/page/customer-list";

interface ExportButtonProps {
  customers: (CertainCustomerList | CustomerList)[];
}

export default function ExportButton({ customers }: ExportButtonProps) {
  const handleExport = () => {
    // Convert to CustomerData format
    const data: CustomerData[] = customers.map((customer) => ({
      "Customer ID": customer["Customer ID"],
      "Risk Profile": customer["Risk Profile"],
      "AUM Label": customer["AUM Label"],
      Propensity: customer["Propensity"],
      "Priority / Private": customer["Priority / Private"],
      "Customer Type": customer["Customer Type"],
      Pekerjaan: customer["Pekerjaan"],
      "Status Nikah": customer["Status Nikah"],
      Usia: customer["Usia"],
      "Annual Income": customer["Annual Income"],
      "Total FUM": customer["Total FUM"] || 0,
      "Total AUM": customer["Total AUM"] || 0,
      "Total FBI": customer["Total FBI"] || 0,
    }));

    exportToCSV(data, "customer_list");
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer "
      title="Export to CSV"
    >
      <Download size={18} />
      <span>Unduh CSV</span>
    </button>
  );
}
