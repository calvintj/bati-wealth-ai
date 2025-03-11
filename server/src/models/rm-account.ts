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
  hashedPassword: string
): Promise<void> => {
  const queryText =
    "INSERT INTO rm_account (email, password_hash) VALUES ($1, $2)";
  await db.query(queryText, [email, hashedPassword]);
};

// Update user
const updateAccount = async (
  rm_number: string,
  email: string
): Promise<void> => {
  const queryText = "UPDATE rm_account SET email = $1 WHERE rm_number = $2";
  await db.query(queryText, [email, rm_number]);
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