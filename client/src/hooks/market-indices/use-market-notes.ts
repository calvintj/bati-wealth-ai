import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/services/market-indices/market-notes-api";
import { MarketNoteResponse, MarketNote } from "@/types/page/market-indices";

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
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation<
    MarketNoteResponse,
    Error,
    { id: number; note_title: string; note_content: string }
  >({
    mutationFn: ({ id, note_title, note_content }) => updateNote(id, note_title, note_content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-notes"] });
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
  });
};


