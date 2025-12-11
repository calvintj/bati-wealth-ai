import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { canView, canAdd, canUpdate, canDelete } from "../middleware/permissions";
import {
  getManagedNumbersController,
  getIncreasedNumbersController,
  getPortfolioController,
  getLastTransactionController,
  getPotentialTransactionController,
  getTaskController,
  postTaskController,
  getOfferProductRiskController,
  getReProfileRiskTargetController,
  deleteTaskController,
  updateTaskController,
} from "../controllers/task-manager";

const router = Router();

// All routes require authentication and view permission
router.get("/managed-number", authMiddleware, canView("/recommendation-centre"), getManagedNumbersController);
router.get("/increased-number", authMiddleware, canView("/recommendation-centre"), getIncreasedNumbersController);
router.get("/portfolio", authMiddleware, canView("/recommendation-centre"), getPortfolioController);
router.get("/last-transaction", authMiddleware, canView("/recommendation-centre"), getLastTransactionController);
router.get("/potential-transaction", authMiddleware, canView("/recommendation-centre"), getPotentialTransactionController);
router.get("/get-task", authMiddleware, canView("/recommendation-centre"), getTaskController);
router.get("/offer-product-risk", authMiddleware, canView("/recommendation-centre"), getOfferProductRiskController);
router.get("/re-profile-risk-target", authMiddleware, canView("/recommendation-centre"), getReProfileRiskTargetController);
router.post("/post-task", authMiddleware, canAdd("/recommendation-centre"), postTaskController);
router.delete("/delete-task", authMiddleware, canDelete("/recommendation-centre"), deleteTaskController);
router.put("/update-task", authMiddleware, canUpdate("/recommendation-centre"), updateTaskController);

export default router;
