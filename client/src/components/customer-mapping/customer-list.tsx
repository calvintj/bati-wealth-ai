import { useCustomerList } from "../../hooks/customer-mapping/use-customer-list";
import { useCertainCustomerList } from "../../hooks/customer-mapping/use-certain-customer-list";
import { CertainCustomerList, CustomerList } from "@/types/page/customer-list";

interface CustomerListTableProps {
  propensity: string;
  aum: string;
}

const CustomerListTable = ({ propensity, aum }: CustomerListTableProps) => {
  // Hooks
  const customerList = useCustomerList() as CustomerList[];
  const certainCustomerList = useCertainCustomerList(
    propensity,
    aum
  ) as CertainCustomerList[];
  const header = [
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
  ];

  // Determine which list to use based on propensity and aum
  const displayList =
    propensity === "All" && aum === "All" ? customerList : certainCustomerList;

  return (
    <div className="w-full overflow-scroll rounded-2xl max-h-[300px] border-1 border-gray-300 dark:border-none">
      <table className="min-w-full divide-y-2 divide-gray-900 text-xs">
        <thead>
          <tr className="sticky top-0 z-30 bg-white dark:bg-[#1D283A]">
            {header.map((col, index) => (
              <th
                key={index}
                className={`whitespace-nowrap px-4 py-2 font-medium text-black dark:text-white ${
                  index === 0 ? "sticky left-0 z-40 bg-white dark:bg-[#1D283A]" : ""
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-900 whitespace-nowrap px-4 py-2 text-center text-black dark:text-white">
          {displayList.map((row, index) => (
            <tr key={index}>
              <td className="sticky left-0 z-10 px-4 py-2 bg-white dark:bg-[#1D283A]">
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
