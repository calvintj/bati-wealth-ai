import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { canView } from "../middleware/permissions";
import {
  getTotalCustomerController,
  getTotalAUMController,
  getTotalFBIController,
  getQuarterlyFUMController,
  getQuarterlyFBIController,
  getTopProductsController,
  getCertainCustomerListController,
} from "../controllers/overview";

const router = Router();

router.get("/total-customer", authMiddleware, canView("/dashboard-overview"), getTotalCustomerController);
router.get("/total-aum", authMiddleware, canView("/dashboard-overview"), getTotalAUMController);
router.get("/total-fbi", authMiddleware, canView("/dashboard-overview"), getTotalFBIController);
router.get("/quarterly-fbi", authMiddleware, canView("/dashboard-overview"), getQuarterlyFBIController);
router.get("/quarterly-fum", authMiddleware, canView("/dashboard-overview"), getQuarterlyFUMController);
router.get("/top-products", authMiddleware, canView("/dashboard-overview"), getTopProductsController);
router.get("/certain-customer-list", authMiddleware, canView("/dashboard-overview"), getCertainCustomerListController);

export default router;
