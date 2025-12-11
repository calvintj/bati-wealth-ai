import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/services/market-indices/market-notes-api";
import { MarketNoteResponse, MarketNote } from "@/types/page/market-indices";
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

export const useGetNotes = (index_name?: string) => {
  return useQuery<MarketNoteResponse, Error>({
    queryKey: ["market-notes", index_name],
    queryFn: () => getNotes(index_name),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation<
    MarketNoteResponse,
    Error,
    { index_name: string; note_title: string; note_content: string }
  >({
    mutationFn: ({ index_name, note_title, note_content }) =>
      createNote(index_name, note_title, note_content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-notes"] });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Failed to create note", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation<
    MarketNoteResponse,
    Error,
    { id: number; note_title: string; note_content: string }
  >({
    mutationFn: ({ id, note_title, note_content }) =>
      updateNote(id, note_title, note_content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-notes"] });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Failed to update note", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation<MarketNoteResponse, Error, number>({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-notes"] });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Failed to delete note", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};
