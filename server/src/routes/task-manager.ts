import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
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

// Example of unprotected routes
router.get("/managed-number", getManagedNumbersController);
router.get("/increased-number", getIncreasedNumbersController);
router.get("/portfolio", getPortfolioController);
router.get("/last-transaction", getLastTransactionController);
router.get("/potential-transaction", getPotentialTransactionController);
router.get("/get-task", getTaskController);
router.get("/offer-product-risk", getOfferProductRiskController);
router.get("/re-profile-risk-target", getReProfileRiskTargetController);
// Protect the POST route with authMiddleware
router.post("/post-task", authMiddleware, postTaskController);
router.delete("/delete-task", deleteTaskController);
router.put("/update-task", updateTaskController);

export default router;
