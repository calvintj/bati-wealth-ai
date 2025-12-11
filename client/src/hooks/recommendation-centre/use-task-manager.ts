import {
  deleteTask,
  getTask,
  postTask,
  updateTask,
} from "@/services/recommendation-centre/task-manager-api";
import { TaskResponse, TaskRow } from "@/types/page/task-manager";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

// Helper to extract error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || "An error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

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
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Skip showing toast for 403 errors (already shown by interceptor)
      const is403Error =
        (axios.isAxiosError(error) && error.response?.status === 403) ||
        errorMessage.includes("403") ||
        errorMessage.toLowerCase().includes("permission") ||
        errorMessage.toLowerCase().includes("access denied");

      if (is403Error) {
        return;
      }

      toast.error("Failed to create task", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
};

export const useDeleteTask = () => {
  return useMutation<TaskResponse, Error, string>({
    mutationFn: deleteTask,
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Failed to delete task", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};

export const useUpdateTask = () => {
  return useMutation<TaskResponse, Error, TaskRow>({
    mutationFn: updateTask,
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Failed to update task", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};
