import { useState } from "react";
import { postActivity } from "../../services/customer-details/activity-manager-api";

const usePostActivity = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await postActivity(payload);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, postData };
};

export default usePostActivity;
