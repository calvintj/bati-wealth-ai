import useGetRecommendationProduct from "../../hooks/customer-details/use-recommendation-products";

export default function RecommendationProduct({
  customerID,
}: {
  customerID: string;
}) {
  const {
    data: recommendationProduct,
    isLoading: loading,
    error,
  } = useGetRecommendationProduct(customerID);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        Memuat Rekomendasi Produk...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        Error: {error.message}
      </div>
    );

  return (
    <div className="text-black dark:text-white">
      <ul>
        {recommendationProduct?.map((product, index) => (
          <li key={index} className="text-md">
            <div className="p-4 bg-white dark:bg-[#1D283A] rounded-2xl mb-2 h-[150px] border border-gray-300 dark:border-none">
              <p className="uppercase font-bold text-lg mb-2">Aksi Potensial</p>
              <div className="flex justify-between items-center">
                <div>
                  <p>{product.nama_produk}</p>
                  <p>{product.profit}</p>
                </div>
                <div>
                  <button
                    className={`px-2 py-1 rounded mr-1 w-15 cursor-pointer ${
                      product.profit >= 0
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.profit >= 0 ? "Beli" : "Jual"}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-[#1D283A] rounded-2xl mb-2 h-[150px] border border-gray-300 dark:border-none">
              <p className="uppercase font-bold text-lg mb-2">
                Produk Resiko Rekomendasi
              </p>
              {product.offer_product_risk_1 === "TRUE" && (
                <span className="bg-[#2ABC36] px-2 py-1 rounded mr-1">
                  1
                </span>
              )}
              {product.offer_product_risk_2 === "TRUE" && (
                <span className="bg-[#73BC2A] px-2 py-1 rounded mr-1">
                  2
                </span>
              )}
              {product.offer_product_risk_3 === "TRUE" && (
                <span className="bg-[#FBB716] px-2 py-1 rounded mr-1">
                  3
                </span>
              )}
              {product.offer_product_risk_4 === "TRUE" && (
                <span className="bg-[#FB6616] px-2 py-1 rounded mr-1">
                  4
                </span>
              )}
              {product.offer_product_risk_5 === "TRUE" && (
                <span className="bg-[#B92932] text-white px-2 py-1 rounded mr-1">
                  5
                </span>
              )}
            </div>
            <div className="p-4 bg-white dark:bg-[#1D283A] rounded-2xl h-[150px] border border-gray-300 dark:border-none">
              <p className="uppercase font-bold text-lg mb-2">
                Reprofil Rekomendasi
              </p>
              {product.offer_reprofile_risk_target === "0" && (
                <span>0 - Not Target</span>
              )}
              {product.offer_reprofile_risk_target === "1" && (
                <span>1 - Conservative</span>
              )}
              {product.offer_reprofile_risk_target === "2" && (
                <span>2 - Balanced</span>
              )}
              {product.offer_reprofile_risk_target === "3" && (
                <span>3 - Balanced</span>
              )}
              {product.offer_reprofile_risk_target === "4" && (
                <span>4 - Balanced</span>
              )}
              {product.offer_reprofile_risk_target === "5" && (
                <span>5 - Aggressive</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
