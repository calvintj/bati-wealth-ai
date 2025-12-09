import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductPicks,
  createProductPick,
  updateProductPick,
  deleteProductPick,
} from "@/services/market-news/product-picks-api";
import { ProductPickResponse, ProductPick } from "@/types/page/market-news";

export const useGetProductPicks = (pick_date?: string) => {
  return useQuery<ProductPickResponse>({
    queryKey: ["productPicks", pick_date],
    queryFn: () => getProductPicks(pick_date),
  });
};

export const useCreateProductPick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticker,
      pick_date,
      reason,
      priority,
    }: {
      ticker: string;
      pick_date: string;
      reason?: string;
      priority?: number;
    }) => createProductPick(ticker, pick_date, reason, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productPicks"] });
    },
  });
};

export const useUpdateProductPick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ticker,
      pick_date,
      reason,
      priority,
      is_active,
    }: {
      id: number;
      ticker?: string;
      pick_date?: string;
      reason?: string;
      priority?: number;
      is_active?: boolean;
    }) => updateProductPick(id, ticker, pick_date, reason, priority, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productPicks"] });
    },
  });
};

export const useDeleteProductPick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProductPick(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productPicks"] });
    },
  });
};

