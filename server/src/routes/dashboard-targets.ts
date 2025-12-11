import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { canView, canAdd, canUpdate, canDelete } from "../middleware/permissions";
import {
  getTargetsController,
  getTargetController,
  upsertTargetController,
  updateTargetController,
  deleteTargetController,
} from "../controllers/dashboard-targets";

const router = Router();

router.get("/", authMiddleware, canView("/dashboard-overview"), getTargetsController);
router.get("/:metric_type", authMiddleware, canView("/dashboard-overview"), getTargetController);
router.post("/", authMiddleware, canAdd("/dashboard-overview"), upsertTargetController);
router.put("/:metric_type", authMiddleware, canUpdate("/dashboard-overview"), updateTargetController);
router.delete("/:metric_type", authMiddleware, canDelete("/dashboard-overview"), deleteTargetController);

export default router;


