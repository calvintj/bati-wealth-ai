import { Router } from "express";
import {
  getCustomerListController,
  getCertainCustomerListController,
} from "../controllers/customer-list";

const router = Router();

router.get("/customer-list", getCustomerListController);
router.get("/customer-list/certain", getCertainCustomerListController);

export default router;