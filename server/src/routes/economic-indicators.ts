import { Router } from "express";
import { getEconomicIndicatorsController } from "../controllers/economic-indicators";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Get economic indicators (GDP Growth, BI Rate, Inflation Rate)
router.get(
  "/",
  authMiddleware,
  getEconomicIndicatorsController
);

export default router;

