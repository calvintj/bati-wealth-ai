import fetchReprofileRiskTarget from "../../services/task-manager/reprofile-risk-target-api";
import { useQuery } from "@tanstack/react-query";
import { ReProfileRiskTargetResponse } from "@/types/page/task-manager";

const useReprofileRiskTarget = () => {
  return useQuery<ReProfileRiskTargetResponse, Error>({
    queryKey: ["reProfileRiskTarget"],
    queryFn: fetchReprofileRiskTarget,
    staleTime: 5 * 60 * 1000,
  });
};

export default useReprofileRiskTarget;
