import api from "@/services/api";
import { MarketNoteResponse, MarketNote } from "@/types/page/market-indices";
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

export const getNotes = async (index_name?: string): Promise<MarketNoteResponse> => {
  try {
    const rm_number = getRmNumber();
    const params: any = { rm_number };
    if (index_name) {
      params.index_name = index_name;
    }
    const response = await api.get("/market-indices/notes", { params });
    return response.data as MarketNoteResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createNote = async (
  index_name: string,
  note_title: string,
  note_content: string
): Promise<MarketNoteResponse> => {
  try {
    const rm_number = getRmNumber();
    const response = await api.post("/market-indices/notes", {
      rm_number,
      index_name,
      note_title,
      note_content,
    });
    return response.data as MarketNoteResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateNote = async (
  id: number,
  note_title: string,
  note_content: string
): Promise<MarketNoteResponse> => {
  try {
    const response = await api.put("/market-indices/notes", {
      id,
      note_title,
      note_content,
    });
    return response.data as MarketNoteResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteNote = async (id: number): Promise<MarketNoteResponse> => {
  try {
    const response = await api.delete("/market-indices/notes", {
      params: { id: id.toString() },
    });
    return response.data as MarketNoteResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};


