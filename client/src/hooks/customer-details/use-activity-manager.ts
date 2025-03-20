import { deleteActivity, getActivity, postActivity, updateActivity } from "@/services/customer-details/activity-manager-api";
import { Activity, ActivityResponse } from "@/types/page/customer-details";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePostActivity = () => {
  return useMutation<ActivityResponse, Error, Activity>({
    mutationFn: postActivity,
  });
};

export const useGetActivity = (customerID: string) => {
  return useQuery<ActivityResponse, Error>({
    queryKey: ["activity", customerID],
    queryFn: () => getActivity(customerID),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteActivity = () => {
  return useMutation<ActivityResponse, Error, string>({
    mutationFn: deleteActivity,
  });
};

export const useUpdateActivity = () => {
  return useMutation<ActivityResponse, Error, Activity>({
    mutationFn: updateActivity,
  });
};
