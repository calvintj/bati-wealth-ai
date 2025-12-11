import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { canView, canAdd, canUpdate, canDelete } from "../middleware/permissions";
import {
  getProductPicksController,
  createProductPickController,
  updateProductPickController,
  deleteProductPickController,
  getNewsNotesController,
  createNewsNoteController,
  updateNewsNoteController,
  deleteNewsNoteController,
} from "../controllers/market-news";

const router = Router();

// Product Picks Routes
router.get("/product-picks", authMiddleware, canView("/market-news"), getProductPicksController);
router.post("/product-picks", authMiddleware, canAdd("/market-news"), createProductPickController);
router.put("/product-picks/:id", authMiddleware, canUpdate("/market-news"), updateProductPickController);
router.delete("/product-picks/:id", authMiddleware, canDelete("/market-news"), deleteProductPickController);

// News Notes Routes
router.get("/news-notes", authMiddleware, canView("/market-news"), getNewsNotesController);
router.post("/news-notes", authMiddleware, canAdd("/market-news"), createNewsNoteController);
router.put("/news-notes/:id", authMiddleware, canUpdate("/market-news"), updateNewsNoteController);
router.delete("/news-notes/:id", authMiddleware, canDelete("/market-news"), deleteNewsNoteController);

export default router;

