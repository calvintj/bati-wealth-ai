import { useState } from "react";
import { postActivity } from "../../services/customer-details/activity-manager-api";
import { Activity } from "@/types/page/customer-details";

const usePostActivity = () => {
  const [data, setData] = useState<Activity | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const postData = async (payload: Activity) => {
    setLoading(true);
    setError(null);
    try {
      const result = await postActivity(payload);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, postData };
};

export default usePostActivity;
