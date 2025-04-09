import { Router } from "express";
import cors from "cors";
import {
  getCustomerListController,
  getCertainCustomerListController,
} from "../controllers/customer-list";

const router = Router();

// Enable CORS specifically for these routes
const routeSpecificCors = cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  optionsSuccessStatus: 204,
});

// Apply the route-specific CORS
router.options("/certain-customer-list", routeSpecificCors);
router.get("/customer-list", routeSpecificCors, getCustomerListController);
router.get(
  "/certain-customer-list",
  routeSpecificCors,
  getCertainCustomerListController
);

export default router;
