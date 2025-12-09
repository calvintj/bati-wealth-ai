import api from "@/services/api";
import { MarketWatchlistResponse, MarketWatchlist } from "@/types/page/market-indices";
import axios from "axios";

const getRmNumber = (): string => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    return tokenPayload.rm_number;
  } catch {
    throw new Error("Invalid token format");
  }
};

export const getWatchlists = async (): Promise<MarketWatchlistResponse> => {
  try {
    const rm_number = getRmNumber();
    const response = await api.get("/market-indices/watchlists", {
      params: { rm_number },
    });
    return response.data as MarketWatchlistResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createWatchlist = async (
  watchlist_name: string,
  indices: string[]
): Promise<MarketWatchlistResponse> => {
  try {
    const rm_number = getRmNumber();
    const response = await api.post("/market-indices/watchlists", {
      rm_number,
      watchlist_name,
      indices,
    });
    return response.data as MarketWatchlistResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateWatchlist = async (
  id: number,
  watchlist_name: string,
  indices: string[]
): Promise<MarketWatchlistResponse> => {
  try {
    const response = await api.put("/market-indices/watchlists", {
      id,
      watchlist_name,
      indices,
    });
    return response.data as MarketWatchlistResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteWatchlist = async (id: number): Promise<MarketWatchlistResponse> => {
  try {
    const response = await api.delete("/market-indices/watchlists", {
      params: { id: id.toString() },
    });
    return response.data as MarketWatchlistResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};


