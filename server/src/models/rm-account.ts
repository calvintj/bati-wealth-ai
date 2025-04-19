import db from "../config/db";

// Find user by email
const findAccountByEmail = async (email: string): Promise<any> => {
  const queryText = "SELECT * FROM rm_account WHERE LOWER(email) = LOWER($1)";
  const result = await db.query(queryText, [email]);
  return result.rows[0]; // assuming email is unique
};

// Create new user
const createAccount = async (
  email: string,
  rm_number: string,
  hashedPassword: string,
  role: string = "user" // Default role is user
): Promise<void> => {
  const queryText =
    "INSERT INTO rm_account (email, rm_number, password_hash, role) VALUES ($1, $2, $3, $4)";
  await db.query(queryText, [email, rm_number, hashedPassword, role]);
};

// Update user
const updateAccount = async (
  rm_number: string,
  email: string,
  role?: string
): Promise<void> => {
  const queryText =
    "UPDATE rm_account SET email = $1, role = COALESCE($2, role) WHERE rm_number = $3";
  await db.query(queryText, [email, role, rm_number]);
};

// Update password
const updatePassword = async (
  email: string,
  hashedPassword: string
): Promise<void> => {
  const queryText =
    "UPDATE rm_account SET password_hash = $1 WHERE LOWER(email) = LOWER($2)";
  await db.query(queryText, [hashedPassword, email]);
};

export { findAccountByEmail, createAccount, updateAccount, updatePassword };

export const getAllUsers = async (): Promise<any[]> => {
  const result = await db.query(
    "SELECT rm_account_id, email, rm_number, role, created_at FROM rm_account WHERE role = 'user' ORDER BY created_at DESC",
    []
  );
  return result.rows;
};

export const deleteUserByRMNumber = async (
  rm_number: string
): Promise<boolean> => {
  const result = await db.query(
    "DELETE FROM rm_account WHERE rm_number = $1 RETURNING rm_number",
    [rm_number]
  );
  return (result.rowCount ?? 0) > 0;
};
