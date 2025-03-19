import { useQuery } from "@tanstack/react-query";
import fetchManagedNumbers from "@/services/task-manager/managed-numbers-api";
import { ManagedNumbersResponse } from "@/types/page/task-manager";

const useManagedNumbers = () => {
  return useQuery<ManagedNumbersResponse, Error>({
    queryKey: ["managedNumbers"],
    queryFn: fetchManagedNumbers,
    staleTime: 5 * 60 * 1000,
  });
};

export default useManagedNumbers;
