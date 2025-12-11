import {
  deleteActivity,
  getActivity,
  postActivity,
  updateActivity,
} from "@/services/customer-details/activity-manager-api";
import { Activity, ActivityResponse } from "@/types/page/customer-details";
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

export const usePostActivity = () => {
  return useMutation<ActivityResponse, Error, Activity>({
    mutationFn: postActivity,
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

      toast.error("Failed to create activity", {
        description: errorMessage,
        duration: 5000,
      });
    },
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
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Failed to delete activity", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};

export const useUpdateActivity = () => {
  return useMutation<ActivityResponse, Error, Activity>({
    mutationFn: updateActivity,
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Failed to update activity", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};
