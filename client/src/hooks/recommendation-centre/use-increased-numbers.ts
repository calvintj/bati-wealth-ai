import { useQuery } from "@tanstack/react-query";
import fetchIncreasedNumbers from "../../services/recommendation-centre/increased-numbers-api";
import { IncreasedNumbersResponse } from "@/types/page/task-manager";

const useIncreasedNumbers = () => {
  return useQuery<IncreasedNumbersResponse, Error>({
    queryKey: ["increasedNumbers"],
    queryFn: fetchIncreasedNumbers,
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });
};

export default useIncreasedNumbers;
