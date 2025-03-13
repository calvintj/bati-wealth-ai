import { useState, useEffect } from "react";
import fetchIncreasedNumbers from "../../services/task-manager/increased-numbers-api";

const useIncreasedNumbers = () => {
  const [increasedNumbers, setIncreasedNumbers] = useState({
    lastQuarter: {
      year: null,
      quarter: null,
      all_customers: null,
      all_aum: null,
      all_fbi: null,
    },
    currentQuarter: {
      year: null,
      quarter: null,
      all_customers: null,
      all_aum: null,
      all_fbi: null,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getIncreasedNumbers = async () => {
      try {
        const data = await fetchIncreasedNumbers();
        setIncreasedNumbers({
          lastQuarter: {
            year: data.lastQuarter.year,
            quarter: data.lastQuarter.quarter,
            all_customers: data.lastQuarter.all_customers,
            all_aum: data.lastQuarter.all_aum,
            all_fbi: data.lastQuarter.all_fbi,
          },
          currentQuarter: {
            year: data.currentQuarter.year,
            quarter: data.currentQuarter.quarter,
            all_customers: data.currentQuarter.all_customers,
            all_aum: data.currentQuarter.all_aum,
            all_fbi: data.currentQuarter.all_fbi,
          },
        });
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    getIncreasedNumbers();
  }, []);

  return { increasedNumbers, loading, error };
};

export default useIncreasedNumbers;
