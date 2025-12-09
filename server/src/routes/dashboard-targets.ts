import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getTargetsController,
  getTargetController,
  upsertTargetController,
  updateTargetController,
  deleteTargetController,
} from "../controllers/dashboard-targets";

const router = Router();

router.get("/", authMiddleware, getTargetsController);
router.get("/:metric_type", authMiddleware, getTargetController);
router.post("/", authMiddleware, upsertTargetController);
router.put("/:metric_type", authMiddleware, updateTargetController);
router.delete("/:metric_type", authMiddleware, deleteTargetController);

export default router;


