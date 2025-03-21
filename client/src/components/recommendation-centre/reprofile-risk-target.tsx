import Link from "next/link";
import useReprofileRiskTarget from "@/hooks/recommendation-centre/use-reprofile-risk-target";
import { CiShare1 } from "react-icons/ci";

export default function ReprofileRiskTarget() {
  // Hook
  const { data, isLoading, error } = useReprofileRiskTarget();
  const reProfileRiskTarget = data?.reprofile_risk_target || [];

  if (isLoading) {
    return <div>Loading reprofile risk target data...</div>;
  }

  if (error) {
    return <div>Error loading reprofile risk target data: {error.message}</div>;
  }

  return (
    <div className="h-[310px] flex flex-col">
      <div className="flex-1 overflow-auto rounded-2xl">
        {/* <div className="rounded-2xl mx-2"> */}
        <table className="divide-y-2 divide-gray-900 text-sm text-center w-full">
          <thead className="sticky top-0 bg-[#1D283A] z-10">
            <tr>
              <th className="py-2">ID Nasabah</th>
              <th>Profil Resiko</th>
              <th>Target Profil</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-900">
            {reProfileRiskTarget?.map((product, index) => (
              <tr key={index}>
                <td className="py-2">{product.bp_number_wm_core}</td>
                <td>{product.risk_profile}</td>
                <td className="">
                  {product.offer_reprofile_risk_target === "1" && (
                    <span className="text-white">1 - Conservative</span>
                  )}
                  {product.offer_reprofile_risk_target === "2" && (
                    <span className="text-white">2 - Balanced</span>
                  )}
                  {product.offer_reprofile_risk_target === "3" && (
                    <span className="text-white">3 - Balanced</span>
                  )}
                  {product.offer_reprofile_risk_target === "4" && (
                    <span className="text-white">4 - Balanced</span>
                  )}
                  {product.offer_reprofile_risk_target === "5" && (
                    <span className="text-white">5 - Aggressive</span>
                  )}
                </td>
                <td className="flex justify-center items-center">
                  <Link
                    href={`/customer-details?customerID=${product.bp_number_wm_core}`}
                    className="text-white p-2 bg-[#01ACD2] rounded-md my-2 w-20 flex justify-center items-center gap-2 cursor-pointer"
                  >
                    Profil
                    <CiShare1 />
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
