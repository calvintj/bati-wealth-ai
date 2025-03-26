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
} from "../controllers/customer-details";

const router = Router();

router.get("/customer-id-list", getCustomerIDListController);
router.get("/customer-details", getCustomerDetailsController);
router.get("/recommendation-product", getRecommendationProductController);
router.get("/customer-portfolio", getCustomerPortfolioController);
router.get("/optimized-portfolio", getOptimizedPortfolioController);
router.get("/return-percentage", getReturnPercentageController);
router.get("/owned-product", getOwnedProductController);
router.get("/get-activity", getActivityController);
router.post("/post-activity", postActivityController);
router.delete("/delete-activity", deleteActivityController);
router.put("/update-activity", updateActivityController);
router.get("/quarterly-aum", getQuarterlyAUMController);
router.get("/quarterly-fum", getQuarterlyFUMController);

export default router;
