import { getTask, postTask } from "@/services/task-manager/task-manager-api";
import { TaskResponse, TaskRow } from "@/types/page/task-manager";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetTask = () => {
  return useQuery<TaskResponse, Error>({
    queryKey: ["task"],
    queryFn: getTask,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePostTask = () => {
  return useMutation<TaskResponse, Error, TaskRow>({
    mutationFn: postTask,
  });
};
