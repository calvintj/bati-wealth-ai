import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
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
router.get("/product-picks", authMiddleware, getProductPicksController);
router.post("/product-picks", authMiddleware, createProductPickController);
router.put("/product-picks/:id", authMiddleware, updateProductPickController);
router.delete("/product-picks/:id", authMiddleware, deleteProductPickController);

// News Notes Routes
router.get("/news-notes", authMiddleware, getNewsNotesController);
router.post("/news-notes", authMiddleware, createNewsNoteController);
router.put("/news-notes/:id", authMiddleware, updateNewsNoteController);
router.delete("/news-notes/:id", authMiddleware, deleteNewsNoteController);

export default router;

