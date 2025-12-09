import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getWatchlistsController,
  createWatchlistController,
  updateWatchlistController,
  deleteWatchlistController,
  getNotesController,
  createNoteController,
  updateNoteController,
  deleteNoteController,
} from "../controllers/market-indices";

const router = Router();

// Watchlist routes
router.get("/watchlists", authMiddleware, getWatchlistsController);
router.post("/watchlists", authMiddleware, createWatchlistController);
router.put("/watchlists", authMiddleware, updateWatchlistController);
router.delete("/watchlists", authMiddleware, deleteWatchlistController);

// Notes routes
router.get("/notes", authMiddleware, getNotesController);
router.post("/notes", authMiddleware, createNoteController);
router.put("/notes", authMiddleware, updateNoteController);
router.delete("/notes", authMiddleware, deleteNoteController);

export default router;

