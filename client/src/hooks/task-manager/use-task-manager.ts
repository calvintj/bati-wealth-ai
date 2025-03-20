import { deleteTask, getTask, postTask, updateTask } from "@/services/task-manager/task-manager-api";
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

export const useDeleteTask = () => {
  return useMutation<TaskResponse, Error, string>({
    mutationFn: deleteTask,
  });
};

export const useUpdateTask = () => {
  return useMutation<TaskResponse, Error, TaskRow>({
    mutationFn: updateTask,
  });
};
