import { useState, useEffect } from "react";
import fetchOwnedProduct from "../../services/customer-details/owned-products-api";

const useOwnedProduct = (customerID: string) => {
  const [ownedProduct, setOwnedProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerID) {
        setLoading(true); // Keep loading if no customerID
        return;
      }

      try {
        const data = await fetchOwnedProduct(customerID);
        setOwnedProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };
    fetchData();
  }, [customerID]);

  return { ownedProduct, loading, error };
};

export default useOwnedProduct;
