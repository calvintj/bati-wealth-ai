import { NavLink } from "react-router-dom";
import useOfferProductRisk from "../../hooks/task-manager/use-offer-product-risk";
import { CiShare1 } from "react-icons/ci";

export default function OfferProductRisk() {
  // Hook
  const { offerProductRisk, loading, error } = useOfferProductRisk();

  if (loading) {
    return <div>Loading offer product risk data...</div>;
  }

  if (error) {
    return <div>Error loading offer product risk data: {error.message}</div>;
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
              <th>Produk Resiko Ditawarkan</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-900">
            {offerProductRisk.map((product, index) => (
              <tr key={index}>
                <td className="py-2">{product.bp_number_wm_core}</td>
                <td>{product.risk_profile}</td>
                <td className="">
                  {product.offer_product_risk_1 === "TRUE" && (
                    <span className="bg-[#2ABC36] text-white px-2 py-1 rounded mr-1">
                      1
                    </span>
                  )}
                  {product.offer_product_risk_2 === "TRUE" && (
                    <span className="bg-[#73BC2A] text-white px-2 py-1 rounded mr-1">
                      2
                    </span>
                  )}
                  {product.offer_product_risk_3 === "TRUE" && (
                    <span className="bg-[#FBB716] text-white px-2 py-1 rounded mr-1">
                      3
                    </span>
                  )}
                  {product.offer_product_risk_4 === "TRUE" && (
                    <span className="bg-[#FB6616] text-white px-2 py-1 rounded mr-1">
                      4
                    </span>
                  )}
                  {product.offer_product_risk_5 === "TRUE" && (
                    <span className="bg-[#B92932] text-white px-2 py-1 rounded mr-1">
                      5
                    </span>
                  )}
                </td>
                <td className="flex justify-center items-center">
                  <NavLink
                    to={`/customer-details?customerID=${product.bp_number_wm_core}`}
                    className="text-white p-2 bg-[#01ACD2] rounded-md my-2 w-20 flex justify-center items-center gap-2 cursor-pointer"
                  >
                    Profil
                    <CiShare1 />
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
