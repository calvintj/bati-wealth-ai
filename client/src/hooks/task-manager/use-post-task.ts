import { useState } from "react";
import { postTask } from "../../services/task-manager/task-manager-api"; // Your API client helper

const usePostTask = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await postTask(payload);
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

export default usePostTask;
