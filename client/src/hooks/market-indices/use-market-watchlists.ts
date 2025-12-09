import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
} from "@/services/market-indices/market-watchlists-api";
import { MarketWatchlistResponse, MarketWatchlist } from "@/types/page/market-indices";

export const useGetWatchlists = () => {
  return useQuery<MarketWatchlistResponse, Error>({
    queryKey: ["market-watchlists"],
    queryFn: getWatchlists,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateWatchlist = () => {
  const queryClient = useQueryClient();
  return useMutation<MarketWatchlistResponse, Error, { watchlist_name: string; indices: string[] }>({
    mutationFn: ({ watchlist_name, indices }) => createWatchlist(watchlist_name, indices),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-watchlists"] });
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
    mutationFn: ({ id, watchlist_name, indices }) => updateWatchlist(id, watchlist_name, indices),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-watchlists"] });
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
  });
};


