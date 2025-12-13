import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
} from "@/services/market-indices/market-watchlists-api";
import {
  MarketWatchlistResponse,
  MarketWatchlist,
} from "@/types/page/market-indices";
import { toast } from "sonner";
import axios from "axios";

// Helper to extract error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || "Terjadi kesalahan";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan yang tidak diketahui";
};

export const useGetWatchlists = () => {
  return useQuery<MarketWatchlistResponse, Error>({
    queryKey: ["market-watchlists"],
    queryFn: getWatchlists,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateWatchlist = () => {
  const queryClient = useQueryClient();
  return useMutation<
    MarketWatchlistResponse,
    Error,
    { watchlist_name: string; indices: string[] }
  >({
    mutationFn: ({ watchlist_name, indices }) =>
      createWatchlist(watchlist_name, indices),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-watchlists"] });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Gagal membuat watchlist", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};

export const useUpdateWatchlist = () => {
  const queryClient = useQueryClient();
  return useMutation<
    MarketWatchlistResponse,
    Error,
    { id: number; watchlist_name: string; indices: string[] }
  >({
    mutationFn: ({ id, watchlist_name, indices }) =>
      updateWatchlist(id, watchlist_name, indices),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-watchlists"] });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Gagal memperbarui watchlist", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};

export const useDeleteWatchlist = () => {
  const queryClient = useQueryClient();
  return useMutation<MarketWatchlistResponse, Error, number>({
    mutationFn: deleteWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-watchlists"] });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Only show toast if it's not a permission error (already shown by interceptor)
      if (
        !errorMessage.toLowerCase().includes("permission") &&
        !errorMessage.toLowerCase().includes("access denied")
      ) {
        toast.error("Gagal menghapus watchlist", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });
};
