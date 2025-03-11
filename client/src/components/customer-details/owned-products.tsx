import PropTypes from "prop-types";
import useOwnedProduct from "../../hooks/customer-details/use-owned-products";
const OwnedProductTable = ({ customerID }) => {
  // Hook
  const { ownedProduct, loading, error } = useOwnedProduct(customerID);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Memuat Kepemilikan Produk...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        Error Memuat kepemilikan produk: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto rounded-2xl">
        <table className="min-w-full divide-y-2 divide-gray-900 text-sm dark:bg-[#1D283A] text-center">
          <thead>
            <tr className="sticky top-0 z-30">
              <th className="sticky left-0 z-40 whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white bg-white dark:bg-[#1D283A]">
                Nama Produk
              </th>
              <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white bg-white dark:bg-[#1D283A]">
                Keterangan
              </th>
              <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white bg-white dark:bg-[#1D283A]">
                Investasi
              </th>
              <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white bg-white dark:bg-[#1D283A]">
                Harga Beli
              </th>
              <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white bg-white dark:bg-[#1D283A]">
                Unit
              </th>
              <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white bg-white dark:bg-[#1D283A]">
                Untung/Rugi
              </th>
              <th className="sticky top-0 z-30 whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white bg-white dark:bg-[#1D283A]">
                Untung/Rugi (%)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-900">
            {ownedProduct.map((product, index) => (
              <tr key={index}>
                <td className="sticky left-0 z-10 whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1D283A]">
                  {product.nama_produk}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                  {product.keterangan}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                  {product.jumlah_amount}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                  {product.price_bought}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                  {product.jumlah_transaksi}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                  <span
                    className={
                      product.profit > 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {product.profit > 0
                      ? product.profit
                      : `(${Math.abs(product.profit)})`}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                  <span
                    className={
                      product.profit > 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {product.return_value > 0
                      ? `${(product.return_value * 100).toFixed(2)}%`
                      : `(${Math.abs(product.return_value * 100).toFixed(2)}%)`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnedProductTable;

OwnedProductTable.propTypes = {
  customerID: PropTypes.string.isRequired,
};
