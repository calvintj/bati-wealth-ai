import { useState, useEffect } from "react";
import fetchPotentialTransaction from "../../services/task-manager/potential-transactions-api";

const usePotentialTransaction = () => {
  const [potentialTransaction, setPotentialTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPotentialTransaction();
        setPotentialTransaction(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { potentialTransaction, loading, error };
};

export default usePotentialTransaction;
