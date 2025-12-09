import { Request, Response } from "express";
import {
  getWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../models/market-indices";

// Watchlist Controllers
export const getWatchlistsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rm_number } = req.query as { rm_number: string };
    if (!rm_number) {
      res.status(400).json({ error: "rm_number is required" });
      return;
    }
    const watchlists = await getWatchlists(rm_number);
    res.json(watchlists);
    return;
  } catch (error) {
    console.error("Error in getWatchlistsController:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const createWatchlistController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rm_number, watchlist_name, indices } = req.body;
    if (!rm_number || !watchlist_name || !Array.isArray(indices)) {
      res
        .status(400)
        .json({
          error: "rm_number, watchlist_name, and indices array are required",
        });
      return;
    }
    const watchlist = await createWatchlist(rm_number, watchlist_name, indices);
    res.status(201).json(watchlist);
    return;
  } catch (error) {
    console.error("Error in createWatchlistController:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const updateWatchlistController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, watchlist_name, indices } = req.body;
    if (!id || !watchlist_name || !Array.isArray(indices)) {
      res
        .status(400)
        .json({ error: "id, watchlist_name, and indices array are required" });
      return;
    }
    const watchlist = await updateWatchlist(id, watchlist_name, indices);
    res.json(watchlist);
    return;
  } catch (error) {
    console.error("Error in updateWatchlistController:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteWatchlistController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.query as { id: string };
    if (!id) {
      res.status(400).json({ error: "id is required" });
      return;
    }
    const watchlist = await deleteWatchlist(parseInt(id, 10));
    res.json(watchlist);
    return;
  } catch (error) {
    console.error("Error in deleteWatchlistController:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// Notes Controllers
export const getNotesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rm_number, index_name } = req.query as {
      rm_number: string;
      index_name?: string;
    };
    if (!rm_number) {
      res.status(400).json({ error: "rm_number is required" });
      return;
    }
    const notes = await getNotes(rm_number, index_name);
    res.json(notes);
    return;
  } catch (error) {
    console.error("Error in getNotesController:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const createNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rm_number, index_name, note_title, note_content } = req.body;
    if (!rm_number || !index_name || !note_title || !note_content) {
      res
        .status(400)
        .json({
          error:
            "rm_number, index_name, note_title, and note_content are required",
        });
      return;
    }
    const note = await createNote(
      rm_number,
      index_name,
      note_title,
      note_content
    );
    res.status(201).json(note);
    return;
  } catch (error) {
    console.error("Error in createNoteController:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const updateNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, note_title, note_content } = req.body;
    if (!id || !note_title || !note_content) {
      res
        .status(400)
        .json({ error: "id, note_title, and note_content are required" });
      return;
    }
    const note = await updateNote(id, note_title, note_content);
    res.json(note);
    return;
  } catch (error) {
    console.error("Error in updateNoteController:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.query as { id: string };
    if (!id) {
      res.status(400).json({ error: "id is required" });
      return;
    }
    const note = await deleteNote(parseInt(id, 10));
    res.json(note);
    return;
  } catch (error) {
    console.error("Error in deleteNoteController:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

