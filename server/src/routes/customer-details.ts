import { Router } from "express";
import {
  getCustomerIDListController,
  getCustomerDetailsController,
  getRecommendationProductController,
  getCustomerPortfolioController,
  getOptimizedPortfolioController,
  getReturnPercentageController,
  getOwnedProductController,
  getActivityController,
  postActivityController,
  deleteActivityController,
  updateActivityController,
  getQuarterlyAUMController,
  getQuarterlyFUMController,
  updateCustomerInfoController,
  bulkUpdateCustomersController,
} from "../controllers/customer-details";
import { authMiddleware } from "../middleware/auth";
import { canView, canAdd, canUpdate, canDelete, canUpdateCustomerInfo } from "../middleware/permissions";

const router = Router();

router.get("/customer-id-list", getCustomerIDListController);
router.get("/customer-details", getCustomerDetailsController);
router.get("/recommendation-product", getRecommendationProductController);
router.get("/customer-portfolio", getCustomerPortfolioController);
router.get("/optimized-portfolio", getOptimizedPortfolioController);
router.get("/return-percentage", getReturnPercentageController);
router.get("/owned-product", getOwnedProductController);
router.get("/get-activity", authMiddleware, canView("/customer-details"), getActivityController);
router.post("/post-activity", authMiddleware, canAdd("/customer-details"), postActivityController);
router.delete("/delete-activity", authMiddleware, canDelete("/customer-details"), deleteActivityController);
router.put("/update-activity", authMiddleware, canUpdate("/customer-details"), updateActivityController);
router.get("/quarterly-aum", getQuarterlyAUMController);
router.get("/quarterly-fum", getQuarterlyFUMController);
router.put("/update-customer-info", authMiddleware, canUpdateCustomerInfo(), updateCustomerInfoController);
router.put("/bulk-update-customers", authMiddleware, canUpdate("/dashboard-overview"), bulkUpdateCustomersController);

export default router;
