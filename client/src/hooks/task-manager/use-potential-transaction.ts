import { useState, useEffect } from "react";
import fetchPotentialTransaction from "../../services/task-manager/potential-transactions-api";

const usePotentialTransaction = () => {
  const [potentialTransaction, setPotentialTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPotentialTransaction();
        setPotentialTransaction(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { potentialTransaction, loading, error };
};

export default usePotentialTransaction;
