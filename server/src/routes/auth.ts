import { Router } from "express";
import {
  loginUser,
  registerUser,
  updateUser,
  updatePassword,
} from "../controllers/auth";
import {
  validateLogin,
  validateRegister,
  handleValidationErrors,
} from "../utils/account-validation";

const router = Router();

// Login route
router.post("/login", validateLogin, handleValidationErrors, loginUser);

// Register route
router.post("/register", validateRegister, handleValidationErrors, registerUser);

// Update user route (includes rm_number as a URL parameter)
router.put("/update-user/:rm_number", updateUser);

// Update password route
router.put("/update-password", updatePassword);

export default router;
