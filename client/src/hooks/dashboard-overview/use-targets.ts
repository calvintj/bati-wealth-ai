import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTargets,
  getTarget,
  upsertTarget,
  updateTarget,
  deleteTarget,
  CreateTargetData,
  UpdateTargetData,
  DashboardTarget,
} from "@/services/dashboard-overview/targets-api";

export const useGetTargets = () => {
  return useQuery<{ targets: DashboardTarget[] }, Error>({
    queryKey: ["dashboard-targets"],
    queryFn: getTargets,
  });
};

export const useGetTarget = (metric_type: "customers" | "aum" | "fbi") => {
  return useQuery<{ target: DashboardTarget | null }, Error>({
    queryKey: ["dashboard-target", metric_type],
    queryFn: () => getTarget(metric_type),
  });
};

export const useUpsertTarget = () => {
  const queryClient = useQueryClient();
  return useMutation<{ target: DashboardTarget }, Error, CreateTargetData>({
    mutationFn: upsertTarget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-targets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-target"] });
    },
  });
};

export const useUpdateTarget = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { target: DashboardTarget },
    Error,
    { metric_type: "customers" | "aum" | "fbi"; data: UpdateTargetData }
  >({
    mutationFn: ({ metric_type, data }) => updateTarget(metric_type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-targets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-target"] });
    },
  });
};

export const useDeleteTarget = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, "customers" | "aum" | "fbi">({
    mutationFn: deleteTarget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-targets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-target"] });
    },
  });
};


