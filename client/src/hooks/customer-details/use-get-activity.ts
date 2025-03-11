import { useState, useEffect } from "react";
import { getActivity } from "../../services/customer-details/activity-manager-api";

const useGetActivity = (customerID) => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerID) return;
    const fetchData = async () => {
      try {
        const data = await getActivity(customerID);
        setActivity(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerID]);

  return { activity, loading, error };
};

export default useGetActivity;
