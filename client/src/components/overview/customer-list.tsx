import { useCertainCustomerList } from "../../hooks/overview/use-certain-customer-list";
import { useCustomerList } from "../../hooks/customer-list/use-customer-list";

interface CustomerListTableProps {
  customerRisk: string;
}

const CustomerListTable: React.FC<CustomerListTableProps> = ({
  customerRisk,
}) => {
  // Always call both hooks so the hooks order is consistent.
  const fullCustomerList = useCustomerList();
  const certainCustomerList = useCertainCustomerList(customerRisk);

  // Select the customer list based on the customerRisk prop.
  const customerList =
    customerRisk === "All" ? fullCustomerList : certainCustomerList;

  // Update the header labels to match the keys in the data rows.
  const header = [
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
  ];

  return (
    <div className="w-full overflow-scroll rounded-2xl max-h-[500px]">
      <table className="min-w-full divide-y-2 divide-gray-900 text-sm dark:bg-[#1D283A]">
        <thead>
          <tr className="sticky top-0 z-30 bg-white dark:bg-[#1D283A]">
            {header.map((col, index) => (
              <th
                key={index}
                className={`whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white ${
                  index === 0
                    ? "sticky left-0 z-40 min-w-[150px] bg-white dark:bg-[#1D283A]"
                    : ""
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-900">
          {customerList.map((row, index) => (
            <tr key={index}>
              <td className="sticky left-0 z-10 whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1D283A] min-w-[150px]">
                {row["Customer ID"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Risk Profile"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["AUM Label"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Propensity"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Priority / Private"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Customer Type"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Pekerjaan"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Status Nikah"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Usia"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Annual Income"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Total FUM"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Total AUM"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                {row["Total FBI"]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerListTable;
