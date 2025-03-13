import { useState, useEffect } from "react";
import fetchManagedNumbers from "../../services/task-manager/managed-numbers-api";

const useManagedNumbers = () => {
  const [managedNumbers, setManagedNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getManagedNumbers = async () => {
      try {
        const data = await fetchManagedNumbers();
        setManagedNumbers(data);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    getManagedNumbers();
  }, []);

  return { managedNumbers, loading, error };
};

export default useManagedNumbers;
