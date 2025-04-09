import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findAccountByEmail,
  createAccount,
  updateAccount,
  updatePassword as updatePasswordInDB,
} from "../models/rm-account";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in the .env file");
}

// 🟢 LOGIN USER
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing credentials");
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const account = await findAccountByEmail(email);
    if (!account) {
      console.log("Account not found for email:", email);
      res.status(400).json({ error: "Invalid email." });
      return;
    }

    const isMatch = await bcrypt.compare(password, account.password_hash);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      res.status(400).json({ error: "Invalid password." });
      return;
    }

    if (!JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      res.status(500).json({ error: "Server configuration error" });
      return;
    }

    const token = jwt.sign(
      {
        id: account.rm_account_id,
        email: account.email,
        rm_number: account.rm_number,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("Login successful for email:", email);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: account.rm_account_id,
        email: account.email,
        rm_number: account.rm_number,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

// 🟢 REGISTER USER
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const existingAccount = await findAccountByEmail(email);
    if (existingAccount) {
      res.status(400).json({ error: "Email already in use." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createAccount(email, hashedPassword);

    res.status(201).json({ message: "User registered successfully." });
    return;
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// 🟢 UPDATE USER
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const { rm_number } = req.params;
    if (!rm_number) {
      res
        .status(400)
        .json({ error: "rm_number is required in URL parameter." });
      return;
    }

    await updateAccount(rm_number, email);
    res.status(200).json({ message: "User updated successfully." });
    return;
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// 🟢 UPDATE PASSWORD
export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, newPassword } = req.body;
    const account = await findAccountByEmail(email);
    if (!account) {
      res.status(400).json({ error: "Invalid email." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePasswordInDB(email, hashedPassword);
    res.status(200).json({ message: "Password updated successfully." });
    return;
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
