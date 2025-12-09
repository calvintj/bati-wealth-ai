import api from "@/services/api";
import { ProductPickResponse, ProductPick } from "@/types/page/market-news";
import axios from "axios";

export const getProductPicks = async (
  pick_date?: string
): Promise<ProductPickResponse> => {
  try {
    const response = await api.get("/market-news/product-picks", {
      params: pick_date ? { pick_date } : {},
    });
    return response.data as ProductPickResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createProductPick = async (
  ticker: string,
  pick_date: string,
  reason?: string,
  priority?: number
): Promise<ProductPick> => {
  try {
    const response = await api.post("/market-news/product-picks", {
      ticker,
      pick_date,
      reason,
      priority,
    });
    return response.data as ProductPick;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateProductPick = async (
  id: number,
  ticker?: string,
  pick_date?: string,
  reason?: string,
  priority?: number,
  is_active?: boolean
): Promise<ProductPick> => {
  try {
    const response = await api.put(`/market-news/product-picks/${id}`, {
      ticker,
      pick_date,
      reason,
      priority,
      is_active,
    });
    return response.data as ProductPick;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteProductPick = async (id: number): Promise<ProductPick> => {
  try {
    const response = await api.delete(`/market-news/product-picks/${id}`);
    return response.data as ProductPick;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

