import { Router } from "express";
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

router.get("/total-customer", getTotalCustomerController);
router.get("/total-aum", getTotalAUMController);
router.get("/total-fbi", getTotalFBIController);
router.get("/quarterly-fbi", getQuarterlyFBIController);
router.get("/quarterly-fum", getQuarterlyFUMController);
router.get("/top-products", getTopProductsController);
router.get("/certain-customer-list", getCertainCustomerListController);

export default router;