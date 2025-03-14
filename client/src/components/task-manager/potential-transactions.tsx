import usePotentialTransaction from "../../hooks/task-manager/use-potential-transaction";

export default function OwnedProductTable() {
  // Hook
  const { data, isLoading, error } = usePotentialTransaction();
  const potentialTransactions = data?.potential_transaction || [];

  if (isLoading) {
    return <div>Loading potential transaction data...</div>;
  }

  if (error) {
    return <div>Error loading potential transaction data: {error.message}</div>;
  }

  return (
    <div className="h-[310px] flex flex-col mb-3">
      <div className="flex-1 overflow-auto rounded-2xl">
        {/* <div className="rounded-2xl mx-2"> */}
        <table className="divide-y-2 divide-gray-900 text-sm text-center w-full">
          <thead className="sticky top-0 bg-[#1D283A] z-10">
            <tr>
              <th className="py-2">ID Nasabah</th>
              <th>Nama Produk</th>
              <th>Untung/Rugi (%)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-900">
            {potentialTransactions?.map((product, index) => (
              <tr key={index}>
                <td className="py-2">{product.id_nasabah}</td>
                <td>{product.nama_produk}</td>
                <td>
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
                <td className="p-2">
                  <div className="flex justify-center items-center w-full h-full">
                    {product.profit > 0 ? (
                      <p className="text-black bg-green-500 rounded-md w-24">
                        Ambil Profit
                      </p>
                    ) : (
                      <p className="text-black bg-yellow-500 rounded-md w-24">
                        Janji Temu
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* </div> */}
      </div>
    </div>
  );
}
