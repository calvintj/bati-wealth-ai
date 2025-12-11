import { Request, Response } from "express";
import {
  getProductPicks,
  createProductPick,
  updateProductPick,
  deleteProductPick,
  getNewsNotes,
  createNewsNote,
  updateNewsNote,
  deleteNewsNote,
} from "../models/market-news";

// Product Picks Controllers
export const getProductPicksController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { pick_date } = req.query;
    const result = await getProductPicks(
      rm_number,
      pick_date as string | undefined
    );
    res.json(result);
  } catch (error: any) {
    console.error("Error fetching product picks:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const createProductPickController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { ticker, pick_date, reason, priority } = req.body;

    if (!ticker || !pick_date) {
      res.status(400).json({ error: "Ticker and pick_date are required" });
      return;
    }

    const result = await createProductPick(
      rm_number,
      ticker,
      pick_date,
      reason,
      priority
    );
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Error creating product pick:", error);
    if (
      error.message?.includes("unique") ||
      error.message?.includes("duplicate")
    ) {
      res
        .status(409)
        .json({ error: "Product pick already exists for this date" });
      return;
    }
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const updateProductPickController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { ticker, pick_date, reason, priority, is_active } = req.body;

    const result = await updateProductPick(
      parseInt(id),
      rm_number,
      ticker,
      pick_date,
      reason,
      priority,
      is_active
    );
    res.json(result);
  } catch (error: any) {
    console.error("Error updating product pick:", error);
    if (error.message?.includes("not found")) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const deleteProductPickController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const result = await deleteProductPick(parseInt(id), rm_number);
    res.json(result);
  } catch (error: any) {
    console.error("Error deleting product pick:", error);
    if (error.message?.includes("not found")) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// News Notes Controllers
export const getNewsNotesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { news_id } = req.query;
    const result = await getNewsNotes(
      rm_number,
      news_id ? parseInt(news_id as string) : undefined
    );
    res.json(result);
  } catch (error: any) {
    console.error("Error fetching news notes:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const createNewsNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { note_title, note_content, news_id, relevance_tags } = req.body;

    if (!note_title || !note_content) {
      res.status(400).json({ error: "Note title and content are required" });
      return;
    }

    const result = await createNewsNote(
      rm_number,
      note_title,
      note_content,
      news_id,
      relevance_tags
    );
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Error creating news note:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const updateNewsNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { note_title, note_content, news_id, relevance_tags } = req.body;

    const result = await updateNewsNote(
      parseInt(id),
      rm_number,
      note_title,
      note_content,
      news_id,
      relevance_tags
    );
    res.json(result);
  } catch (error: any) {
    console.error("Error updating news note:", error);
    if (error.message?.includes("not found")) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const deleteNewsNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const result = await deleteNewsNote(parseInt(id), rm_number);
    res.json(result);
  } catch (error: any) {
    console.error("Error deleting news note:", error);
    if (error.message?.includes("not found")) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
