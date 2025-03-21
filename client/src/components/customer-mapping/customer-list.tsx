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
    <div className="w-full overflow-scroll rounded-2xl max-h-[500px]">
      <table className="min-w-full divide-y-2 divide-gray-900 text-sm bg-[#1D283A]">
        <thead>
          <tr className="sticky top-0 z-30 bg-[#1D283A]">
            {header.map((col, index) => (
              <th
                key={index}
                className={`whitespace-nowrap px-4 py-2 font-medium text-white ${
                  index === 0
                    ? "sticky left-0 z-40 min-w-[150px] bg-[#1D283A]"
                    : ""
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-900">
          {displayList.map((row, index) => (
            <tr key={index}>
              <td className="sticky left-0 z-10 whitespace-nowrap px-4 py-2 text-white bg-[#1D283A] min-w-[150px]">
                {row["Customer ID"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Risk Profile"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["AUM Label"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Propensity"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Priority / Private"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Customer Type"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Pekerjaan"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Status Nikah"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Usia"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Annual Income"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Total FUM"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
                {row["Total AUM"]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-white bg-[#1D283A]">
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
