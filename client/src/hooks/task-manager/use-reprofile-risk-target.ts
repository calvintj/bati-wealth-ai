import { useState, useEffect } from "react";
import fetchReprofileRiskTarget from "../../services/task-manager/reprofile-risk-target-api";

const useReprofileRiskTarget = () => {
  const [reProfileRiskTarget, setReProfileRiskTarget] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReprofileRiskTarget();
        setReProfileRiskTarget(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { reProfileRiskTarget, loading, error };
};

export default useReprofileRiskTarget;
