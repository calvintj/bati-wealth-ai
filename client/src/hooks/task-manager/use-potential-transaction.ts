import { useQuery } from "@tanstack/react-query";
import fetchPotentialTransaction from "@/services/task-manager/potential-transactions-api";
import { PotentialTransactionResponse } from "@/types/page/task-manager";

const usePotentialTransaction = () => {
  return useQuery<PotentialTransactionResponse, Error>({
    queryKey: ["potentialTransaction"],
    queryFn: fetchPotentialTransaction,
    staleTime: 5 * 60 * 1000,
  });
};

export default usePotentialTransaction;
