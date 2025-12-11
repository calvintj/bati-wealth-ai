import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNewsNotes,
  createNewsNote,
  updateNewsNote,
  deleteNewsNote,
} from "@/services/market-news/news-notes-api";
import { NewsNoteResponse, NewsNote } from "@/types/page/market-news";
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

export const useGetNewsNotes = (news_id?: number) => {
  return useQuery<NewsNoteResponse>({
    queryKey: ["newsNotes", news_id],
    queryFn: () => getNewsNotes(news_id),
  });
};

export const useCreateNewsNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      note_title,
      note_content,
      news_id,
      relevance_tags,
    }: {
      note_title: string;
      note_content: string;
      news_id?: number;
      relevance_tags?: string[];
    }) => createNewsNote(note_title, note_content, news_id, relevance_tags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsNotes"] });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Failed to create news note", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};

export const useUpdateNewsNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      note_title,
      note_content,
      news_id,
      relevance_tags,
    }: {
      id: number;
      note_title?: string;
      note_content?: string;
      news_id?: number;
      relevance_tags?: string[];
    }) => updateNewsNote(id, note_title, note_content, news_id, relevance_tags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsNotes"] });
    },
  });
};

export const useDeleteNewsNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNewsNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsNotes"] });
    },
  });
};
