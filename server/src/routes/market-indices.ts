import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { canView, canAdd, canUpdate, canDelete } from "../middleware/permissions";
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
router.get("/watchlists", authMiddleware, canView("/market-indices"), getWatchlistsController);
router.post("/watchlists", authMiddleware, canAdd("/market-indices"), createWatchlistController);
router.put("/watchlists", authMiddleware, canUpdate("/market-indices"), updateWatchlistController);
router.delete("/watchlists", authMiddleware, canDelete("/market-indices"), deleteWatchlistController);

// Notes routes
router.get("/notes", authMiddleware, canView("/market-indices"), getNotesController);
router.post("/notes", authMiddleware, canAdd("/market-indices"), createNoteController);
router.put("/notes", authMiddleware, canUpdate("/market-indices"), updateNoteController);
router.delete("/notes", authMiddleware, canDelete("/market-indices"), deleteNoteController);

export default router;

