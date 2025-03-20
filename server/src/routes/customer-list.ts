import { Router } from "express";
import {
  getCustomerListController,
  getCertainCustomerListController,
} from "../controllers/customer-list";

const router = Router();

router.get("/customer-list", getCustomerListController);
router.get("/certain-customer-list", getCertainCustomerListController);

export default router;