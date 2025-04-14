import { useCertainCustomerList } from "../../hooks/dashboard-overview/use-certain-customer-list";
import { useCustomerList } from "../../hooks/customer-mapping/use-customer-list";

const CustomerListTable = ({ customerRisk }: { customerRisk: string }) => {
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
      <table className="min-w-full divide-y-2 divide-gray-900 text-xs">
        <thead>
          <tr className="sticky top-0 z-30 bg-[#1D283A]">
            {header.map((col, index) => (
              <th
                key={index}
                className={`whitespace-nowrap px-4 py-2 font-medium text-white ${
                  index === 0
                    ? "sticky left-0 z-40 bg-[#1D283A]"
                    : ""
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-900 whitespace-nowrap px-4 py-2 text-center">
          {customers.map((row, index) => (
            <tr key={index}>
              <td className="sticky left-0 z-10 px-4 py-2 bg-[#1D283A]">
                {row["Customer ID"]}
              </td>
              <td>{row["Risk Profile"]}</td>
              <td>{row["AUM Label"]}</td>
              <td>{row["Propensity"]}</td>
              <td>{row["Priority / Private"]}</td>
              <td>{row["Customer Type"]}</td>
              <td>{row["Pekerjaan"]}</td>
              <td>{row["Status Nikah"]}</td>
              <td>{row["Usia"]}</td>
              <td>{row["Annual Income"]}</td>
              <td>{row["Total FUM"]}</td>
              <td>{row["Total AUM"]}</td>
              <td>{row["Total FBI"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerListTable;