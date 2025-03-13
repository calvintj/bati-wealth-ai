import { useLastTransaction } from "../../hooks/task-manager/use-last-transactions";

interface LastTransaction {
  transaction_id: string;
  bp_number_wm_core: string;
  jumlah_amount: number;
}

export default function LastTransaction() {
  const { lastTransaction = [], loading, error } = useLastTransaction() as unknown as {
    lastTransaction: LastTransaction[];
    loading: boolean;
    error: Error | null;
  };
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  };
  const currentDate = today.toLocaleDateString("id-ID", options);

  if (loading) {
    return <div>Loading last transaction data...</div>;
  }

  if (error) {
    return <div>Error loading last transaction data: {error.message}</div>;
  }
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
          {lastTransaction.map((transaction: LastTransaction) => (
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
