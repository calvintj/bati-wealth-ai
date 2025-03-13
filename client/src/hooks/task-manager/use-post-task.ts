import { useState } from "react";
import { postTask } from "../../services/task-manager/task-manager-api"; // Your API client helper
import { Task } from "../../types/task-manager";

const usePostTask = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const postData = async (payload: Task) => {
    setLoading(true);
    setError(null);
    try {
      const result = await postTask(payload);
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

export default usePostTask;
