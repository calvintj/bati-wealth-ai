import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNewsNotes,
  createNewsNote,
  updateNewsNote,
  deleteNewsNote,
} from "@/services/market-news/news-notes-api";
import { NewsNoteResponse, NewsNote } from "@/types/page/market-news";

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

