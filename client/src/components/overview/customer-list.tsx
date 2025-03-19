import { useCertainCustomerList } from "../../hooks/overview/use-certain-customer-list";
import { useCustomerList } from "../../hooks/customer-list/use-customer-list";

const CustomerListTable = ({
  customerRisk,
}: {
  customerRisk: string;
}) => {
  // Always call both hooks so the hooks order is consistent.
  const fullCustomerList = useCustomerList();
  const certainCustomerList = useCertainCustomerList(
    customerRisk
  );

  // Select the customer list based on the customerRisk prop.
  const customerList =
    customerRisk === "All" ? fullCustomerList : certainCustomerList;
  // Add loading and error handling
  if (!customerList) {
    return <div className="p-4">Loading customer data...</div>;
  }
  
  if ('isLoading' in customerList && customerList.isLoading) {
    return <div className="p-4">Loading customer data...</div>;
  }
  
  if ('error' in customerList && customerList.error) {
    return <div className="p-4">Error loading customer data: {customerList.error.message}</div>;
  }
  
  const customers = 'customerList' in customerList ? customerList.customerList : customerList;
  
  if (customers.length === 0) {
    return <div className="p-4">No customer data available.</div>;
  }

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
      <table className="min-w-full divide-y-2 divide-gray-900 text-sm bg-[#1D283A]">
        <thead>
          <tr className="sticky top-0 z-30 bg-white dark:bg-[#1D283A]">
            {header.map((col, index) => (
              <th
                key={index}
                className={`whitespace-nowrap px-4 py-2 font-medium text-white bg-[#1D283A] ${
                  index === 0
                    ? "sticky left-0 z-40 min-w-[150px]"
                    : ""
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-900">
          {customers.map((row, index) => (
            <tr key={index}>
              <td className="sticky left-0 z-10 whitespace-nowrap px-4 py-2 text-white bg-[#1D283A] min-w-[150px]">
                {row["Customer ID"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Risk Profile"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["AUM Label"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Propensity"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Priority / Private"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Customer Type"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Pekerjaan"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Status Nikah"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Usia"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Annual Income"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Total FUM"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
                {row["Total AUM"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white">
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
