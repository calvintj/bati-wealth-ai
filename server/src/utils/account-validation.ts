import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// Validation rules for login
export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      // Allow admin email to bypass RM format check
      if (value === "admin@batiinvestasi.ai") return true;

      // Check if email follows RM[XXX]@batiinvestasi.ai format
      const rmEmailPattern = /^RM\d{3}@batiinvestasi\.ai$/;
      if (!rmEmailPattern.test(value)) {
        throw new Error(
          "Email must be in format RMXXX@batiinvestasi.ai where XXX is your RM number"
        );
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation rules for registration
export const validateRegister = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value, { req }) => {
      // Allow admin email
      if (value === "admin@batiinvestasi.ai" && req.body.role === "admin")
        return true;

      // For RM accounts, ensure email matches RM number
      const rmNumber = req.body.rm_number;
      if (!rmNumber) {
        throw new Error("RM number is required");
      }

      // Remove any leading zeros from RM number after "RM"
      const normalizedRmNumber = rmNumber.replace(/^RM0+/, "RM");
      const expectedEmail = `${normalizedRmNumber}@batiinvestasi.ai`;

      if (value.toLowerCase() !== expectedEmail.toLowerCase()) {
        throw new Error(`Email must be ${expectedEmail}`);
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("rm_number")
    .matches(/^RM\d{3}$/)
    .withMessage(
      "RM number must be in format RMXXX where XXX is a 3-digit number"
    ),
];

// Middleware to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
