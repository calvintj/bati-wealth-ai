import { useState, useEffect } from "react";
import fetchReturnPercentage from "../../services/customer-details/return-percentage-api";

const useGetReturnPercentage = (customerID: string) => {
  const [returnPercentage, setReturnPercentage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReturnPercentage(customerID);
        setReturnPercentage(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerID]);

  return { returnPercentage, loading, error };
};

export default useGetReturnPercentage;
