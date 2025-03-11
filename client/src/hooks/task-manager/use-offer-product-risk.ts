import { useState, useEffect } from "react";
import fetchOfferProductList from "../../services/task-manager/offer-products-list-api";

const useOfferProductRisk = () => {
  const [offerProductRisk, setOfferProductRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOfferProductList();
        setOfferProductRisk(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { offerProductRisk, loading, error };
};

export default useOfferProductRisk;
