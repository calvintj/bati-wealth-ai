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
      <div className="flex justify-center items-center h-full text-gray-600 dark:text-gray-300">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-2"></div>
          <p>Memuat Rekomendasi Produk...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-full text-red-600 dark:text-red-400">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>Error: {error.message}</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rekomendasi Produk
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Berdasarkan Profil Risiko
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendationProduct?.map((product, index) => (
          <div key={index} className="space-y-4">
            <div className="bg-white dark:bg-[#1D283A] rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {product.nama_produk}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {product.profit}
                  </p>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    product.profit >= 0
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {product.profit >= 0 ? "Beli" : "Jual"}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1D283A] rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Produk Resiko Rekomendasi
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.offer_product_risk_1 === "TRUE" && (
                  <span className="bg-[#2ABC36] text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    Risiko 1
                  </span>
                )}
                {product.offer_product_risk_2 === "TRUE" && (
                  <span className="bg-[#73BC2A] text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    Risiko 2
                  </span>
                )}
                {product.offer_product_risk_3 === "TRUE" && (
                  <span className="bg-[#FBB716] text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    Risiko 3
                  </span>
                )}
                {product.offer_product_risk_4 === "TRUE" && (
                  <span className="bg-[#FB6616] text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    Risiko 4
                  </span>
                )}
                {product.offer_product_risk_5 === "TRUE" && (
                  <span className="bg-[#B92932] text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    Risiko 5
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1D283A] rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Reprofil Rekomendasi
              </h3>
              <div className="flex items-center">
                <span className="text-gray-900 dark:text-white font-medium">
                  {product.offer_reprofile_risk_target === "0" &&
                    "0 - Not Target"}
                  {product.offer_reprofile_risk_target === "1" &&
                    "1 - Conservative"}
                  {product.offer_reprofile_risk_target === "2" &&
                    "2 - Balanced"}
                  {product.offer_reprofile_risk_target === "3" &&
                    "3 - Balanced"}
                  {product.offer_reprofile_risk_target === "4" &&
                    "4 - Balanced"}
                  {product.offer_reprofile_risk_target === "5" &&
                    "5 - Aggressive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
