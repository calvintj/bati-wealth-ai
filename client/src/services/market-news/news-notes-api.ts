import api from "@/services/api";
import { NewsNoteResponse, NewsNote } from "@/types/page/market-news";
import axios from "axios";

export const getNewsNotes = async (
  news_id?: number
): Promise<NewsNoteResponse> => {
  try {
    const response = await api.get("/market-news/news-notes", {
      params: news_id ? { news_id } : {},
    });
    return response.data as NewsNoteResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createNewsNote = async (
  note_title: string,
  note_content: string,
  news_id?: number,
  relevance_tags?: string[]
): Promise<NewsNote> => {
  try {
    const response = await api.post("/market-news/news-notes", {
      note_title,
      note_content,
      news_id,
      relevance_tags,
    });
    return response.data as NewsNote;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateNewsNote = async (
  id: number,
  note_title?: string,
  note_content?: string,
  news_id?: number,
  relevance_tags?: string[]
): Promise<NewsNote> => {
  try {
    const response = await api.put(`/market-news/news-notes/${id}`, {
      note_title,
      note_content,
      news_id,
      relevance_tags,
    });
    return response.data as NewsNote;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteNewsNote = async (id: number): Promise<NewsNote> => {
  try {
    const response = await api.delete(`/market-news/news-notes/${id}`);
    return response.data as NewsNote;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

