import { useLastTransaction } from "../../hooks/task-manager/use-last-transactions";

export default function LastTransaction() {
  const lastTransaction = useLastTransaction();
  const today = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  const currentDate = today.toLocaleDateString("id-ID", options);

  return (
    <div className="p-4">
      <h1 className="font-bold text-2xl">Transaksi Terakhir</h1>
      <p className="text-gray-400">{currentDate}</p>
      <table className="divide-gray-900 text-center w-full border-separate border-spacing-y-3.5">
        <thead>
          <tr>
            <th>ID Nasabah</th>
            <th>Kode</th>
            <th>Jumlah</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {lastTransaction.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{transaction.bp_number_wm_core}</td>
              <td>{transaction.transaction_id}</td>
              <td>{transaction.jumlah_amount}</td>
              <td>Beli</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
