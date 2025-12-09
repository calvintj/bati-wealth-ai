import { useState } from "react";
import { Pencil } from "lucide-react";
import { useCertainCustomerList } from "../../hooks/dashboard-overview/use-certain-customer-list";
import { useCustomerList } from "../../hooks/customer-mapping/use-customer-list";
import CustomerEditModal from "./customer-edit-modal";
import BulkUpdateModal from "./bulk-update-modal";
import ExportButton from "./export-button";
import { CertainCustomerList } from "@/types/page/overview";
import { useBulkUpdateCustomers } from "@/hooks/dashboard-overview/use-bulk-update";
import { useToast } from "@/hooks/use-toast";

const CustomerListTable = ({ customerRisk }: { customerRisk: string }) => {
  const [editingCustomer, setEditingCustomer] =
    useState<CertainCustomerList | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(
    new Set()
  );
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Always call both hooks so the hooks order is consistent.
  const fullCustomerList = useCustomerList();
  const certainCustomerList = useCertainCustomerList(customerRisk);

  // Select the customer list based on the customerRisk prop.
  const customerList =
    customerRisk === "All" ? fullCustomerList : certainCustomerList;
  // Add loading and error handling
  if (!customerList) {
    return <div className="p-4">Loading customer data...</div>;
  }

  if ("isLoading" in customerList && customerList.isLoading) {
    return <div className="p-4">Loading customer data...</div>;
  }

  if ("error" in customerList && customerList.error) {
    return (
      <div className="p-4">
        Error loading customer data: {customerList.error.message}
      </div>
    );
  }

  const customers =
    "customerList" in customerList ? customerList.customerList : customerList;

  if (customers.length === 0) {
    return <div className="p-4">No customer data available.</div>;
  }

  const handleEdit = (customer: CertainCustomerList) => {
    setEditingCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSelectCustomer = (customerID: string) => {
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
    if (selectedCustomers.size === customers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(customers.map((c) => c["Customer ID"])));
    }
  };

  const handleBulkUpdateSuccess = () => {
    setSelectedCustomers(new Set());
    setIsBulkModalOpen(false);
  };

  // Update the header labels to match the keys in the data rows.
  const header = [
    "",
    "Customer ID",
    "Risk Profile",
    "AUM Label",
    "Propensity",
    "Priority / Private",
    "Customer Type",
    "Pekerjaan",
    "Status Nikah",
    "Usia",
    "Annual Income",
    "Total FUM",
    "Total AUM",
    "Total FBI",
    "Actions",
  ];

  return (
    <>
      {/* Toolbar with Export and Bulk Operations */}
      <div className="m-4 flex items-center gap-4 flex-wrap">
        <p className="text-2xl font-bold text-center text-black dark:text-white">
          Daftar Nasabah
        </p>
        <ExportButton customers={customers} />
        {selectedCustomers.size > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
                        selectedCustomers.size === customers.length &&
                        customers.length > 0
                      }
                      onChange={handleSelectAll}
                      className="cursor-pointer"
                    />
                  ) : (
                    col
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-900 whitespace-nowrap px-4 py-2 text-center text-black bg-white dark:bg-[#1D283A] dark:text-white">
            {customers.map((row, index) => {
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
                      onChange={() => handleSelectCustomer(customerID)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="sticky left-0 z-10 px-4 py-2 bg-white dark:bg-[#1D283A]">
                    {customerID}
                  </td>
                  <td>{row["Risk Profile"]}</td>
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
                  <td>{row["Total FUM"]}</td>
                  <td>{row["Total AUM"]}</td>
                  <td>{row["Total FBI"]}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(row)}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      title="Edit Customer"
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

      {editingCustomer && (
        <CustomerEditModal
          customer={editingCustomer}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
        />
      )}

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
