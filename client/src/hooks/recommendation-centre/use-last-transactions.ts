import { useQuery } from "@tanstack/react-query";
import fetchLastTransaction from "../../services/recommendation-centre/last-transactions-api";
import { LastTransactionResponse } from "@/types/page/task-manager";

export function useLastTransaction() {
  return useQuery<LastTransactionResponse, Error>({
    queryKey: ["lastTransaction"],
    queryFn: fetchLastTransaction,
    staleTime: 5 * 60 * 1000,
  });
}

export default useLastTransaction;
