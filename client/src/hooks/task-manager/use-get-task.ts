import { useState, useEffect } from "react";
import { getTask } from "../../services/task-manager/task-manager-api";

const useGetTask = () => {
  const [task, setTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTask();
        setTask(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { task, loading, error };
};

export default useGetTask;
