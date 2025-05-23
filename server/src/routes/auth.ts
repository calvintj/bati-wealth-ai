import { Router } from "express";
import {
  loginUser,
  registerUser,
  updateUser,
  updatePassword,
  getUsers,
  deleteUser,
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
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  registerUser
);

// Get all users route
router.get("/users", getUsers);

// Update user route (includes rm_number as a URL parameter)
router.put("/update-user/:rm_number", updateUser);

// Delete user route
router.delete("/delete-user/:rm_number", deleteUser);

// Update password route
router.put("/update-password", updatePassword);

export default router;
