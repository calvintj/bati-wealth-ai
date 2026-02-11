import { useState } from "react";
import { Pencil } from "lucide-react";
import { useCustomerList } from "../../hooks/customer-mapping/use-customer-list";
import { useCertainCustomerList } from "../../hooks/customer-mapping/use-certain-customer-list";
import { CertainCustomerList, CustomerList } from "@/types/page/customer-list";
import CustomerEditModal from "@/components/dashboard-overview/customer-edit-modal";
import BulkUpdateModal from "@/components/dashboard-overview/bulk-update-modal";
import ExportButton from "@/components/dashboard-overview/export-button";
import { useBulkUpdateCustomers } from "@/hooks/dashboard-overview/use-bulk-update";
import { useToast } from "@/hooks/use-toast";
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";

interface CustomerListTableProps {
  propensity: string;
  aum: string;
}

// Helper function to format risk profile
const formatRiskProfile = (riskProfile: string | undefined): string => {
  if (!riskProfile) return "";

  const riskMap: Record<string, string> = {
    "1": "1 - Conservative",
    Conservative: "1 - Conservative",
    "2": "2 - Balanced",
    Balanced: "2 - Balanced",
    "3": "3 - Moderate",
    Moderate: "3 - Moderate",
    "4": "4 - Growth",
    Growth: "4 - Growth",
    "5": "5 - Aggressive",
    Aggressive: "5 - Aggressive",
  };

  // Check if it's already formatted
  if (riskProfile.includes(" - ")) {
    return riskProfile;
  }

  // Try to match by number or name
  const normalized = riskProfile.trim();
  return riskMap[normalized] || riskProfile;
};

const CustomerListTable = ({ propensity, aum }: CustomerListTableProps) => {
  const [editingCustomer, setEditingCustomer] =
    useState<CertainCustomerList | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(
    new Set()
  );
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Hooks
  const customerList = useCustomerList() as CustomerList[];
  const certainCustomerList = useCertainCustomerList(
    propensity,
    aum
  ) as CertainCustomerList[];

  // Get permissions for customer-mapping page
  const { canUpdate } = usePagePermissions();

  // Determine which list to use based on propensity and aum
  const displayList =
    propensity === "All" && aum === "All" ? customerList : certainCustomerList;

  // Convert CustomerList to CertainCustomerList format for compatibility
  const customersForEdit = displayList.map((customer) => {
    if ("Total FUM" in customer) {
      return customer as CertainCustomerList;
    }
    // Convert CustomerList to CertainCustomerList format
    return {
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
    } as CertainCustomerList;
  });

  const handleEdit = (customer: CertainCustomerList) => {
    setEditingCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleToggleSelect = (customerID: string) => {
    setSelectedCustomers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(customerID)) {
        newSet.delete(customerID);
      } else {
        newSet.add(customerID);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedCustomers.size === customersForEdit.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(
        new Set(customersForEdit.map((c) => c["Customer ID"]))
      );
    }
  };

  const handleBulkUpdateSuccess = () => {
    setSelectedCustomers(new Set());
    setIsBulkModalOpen(false);
  };

  const header = [
    "",
    "Customer ID",
    "Profil Resiko",
    "AUM Label",
    "Propensity",
    "Status",
    "Tipe Customer",
    "Pekerjaan",
    "Status Nikah",
    "Usia",
    "Pendapatan Tahunan",
    "Total FUM",
    "Total AUM",
    "Total FBI",
    "",
  ];

  return (
    <>
      {/* Toolbar with Export and Bulk Operations */}
      <div className="m-4 flex items-center gap-4 flex-wrap">
        <p className="text-2xl font-bold text-center text-black dark:text-white">
          Daftar Nasabah
        </p>
        <ExportButton customers={customersForEdit} />
        {selectedCustomers.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedCustomers.size} customer
              {selectedCustomers.size !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setSelectedCustomers(new Set())}
              className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
            >
              Bulk Update
            </button>
          </div>
        )}
      </div>

      <div className="w-full overflow-scroll rounded-2xl max-h-[500px] border-1 border-gray-300 dark:border-none">
        <table className="min-w-full divide-y-2 divide-gray-900 text-xs">
          <thead>
            <tr className="sticky top-0 z-30 bg-white dark:bg-[#1D283A]">
              {header.map((col, index) => (
                <th
                  key={index}
                  className={`whitespace-nowrap px-4 py-2 font-medium text-black dark:text-white ${
                    index === 1
                      ? "sticky left-0 z-40 bg-white dark:bg-[#1D283A]"
                      : ""
                  }`}
                >
                  {index === 0 ? (
                    <input
                      type="checkbox"
                      checked={
                        selectedCustomers.size === customersForEdit.length &&
                        customersForEdit.length > 0
                      }
                      onChange={handleSelectAll}
                      className="cursor-pointer"
                    />
                  ) : index === header.length - 1 ? (
                    "Actions"
                  ) : (
                    col
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-900 whitespace-nowrap px-4 py-2 text-center text-black bg-white dark:bg-[#1D283A] dark:text-white">
            {customersForEdit.map((row, index) => {
              const customerID = row["Customer ID"];
              const isSelected = selectedCustomers.has(customerID);
              return (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(customerID)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="sticky left-0 z-10 px-4 py-2 bg-white dark:bg-[#1D283A]">
                    {customerID}
                  </td>
                  <td>{formatRiskProfile(row["Risk Profile"])}</td>
                  <td>
                    {row["AUM Label"]
                      ? row["AUM Label"].charAt(0).toUpperCase() +
                        row["AUM Label"].slice(1).toLowerCase()
                      : row["AUM Label"]}
                  </td>
                  <td>
                    {row["Propensity"]
                      ? row["Propensity"].charAt(0).toUpperCase() +
                        row["Propensity"].slice(1).toLowerCase()
                      : row["Propensity"]}
                  </td>
                  <td>{row["Priority / Private"]}</td>
                  <td>{row["Customer Type"]}</td>
                  <td>{row["Pekerjaan"]}</td>
                  <td>{row["Status Nikah"]}</td>
                  <td>{row["Usia"]}</td>
                  <td>{row["Annual Income"]}</td>
                  <td>{row["Total FUM"]?.toLocaleString() || 0}</td>
                  <td>{row["Total AUM"]?.toLocaleString() || 0}</td>
                  <td>{row["Total FBI"]?.toLocaleString() || 0}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="cursor-pointer p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Ubah nasabah"
                      aria-label="Ubah nasabah"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <CustomerEditModal
          customer={editingCustomer}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Bulk Update Modal */}
      <BulkUpdateModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedCount={selectedCustomers.size}
        selectedCustomerIDs={Array.from(selectedCustomers)}
        onSuccess={handleBulkUpdateSuccess}
      />
    </>
  );
};

export default CustomerListTable;
