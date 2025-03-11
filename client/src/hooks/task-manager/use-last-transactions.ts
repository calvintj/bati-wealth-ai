import { useState, useEffect } from "react";
import fetchLastTransaction from "../../services/task-manager/last-transactions-api";

export function useLastTransaction() {
  const [lastTransaction, setLastTransaction] = useState([]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await fetchLastTransaction();
        setLastTransaction(data);
      } catch (error) {
        console.error("Error fetching last transactions:", error);
      }
    };

    getTransactions();
  }, []);

  return lastTransaction;
}

export default useLastTransaction;
