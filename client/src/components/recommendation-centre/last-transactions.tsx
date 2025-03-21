"use client";

import React, { useMemo } from "react";
import { useLastTransaction } from "../../hooks/recommendation-centre/use-last-transactions";

export default function LastTransactionComponent() {
  const { data, isLoading, error } = useLastTransaction();
  const transactions = data?.last_transaction || [];

  const currentDate = useMemo(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return today.toLocaleDateString("id-ID", options);
  }, []);

  if (isLoading) {
    return <div>Loading last transaction data...</div>;
  }

  if (error) {
    return <div>Error loading last transaction data: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="font-bold text-2xl">Transaksi Terakhir</h1>
      <p className="text-gray-400">{currentDate}</p>
      {transactions.length === 0 ? (
        <p>No transactions available.</p>
      ) : (
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
            {transactions.map((transaction) => (
              <tr key={transaction.transaction_id}>
                <td>{transaction.bp_number_wm_core}</td>
                <td>{transaction.transaction_id}</td>
                <td>{transaction.jumlah_amount}</td>
                <td>Beli</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
