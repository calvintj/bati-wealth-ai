import { useState, useEffect } from "react";
import fetchRecommendationProduct from "../../services/customer-details/recommendation-products-api";

const useGetRecommendationProduct = (customerID: string) => {
  const [recommendationProduct, setRecommendationProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerID) {
        setLoading(true); // Keep loading if no customerID
        return;
      }

      try {
        const data = await fetchRecommendationProduct(customerID);
        setRecommendationProduct(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerID]);

  return { recommendationProduct, loading, error };
};

export default useGetRecommendationProduct;
