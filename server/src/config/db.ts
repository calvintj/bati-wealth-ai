import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "5432", 10),
    });

// Add this function to test the database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connection successful");
    client.release();
    return true;
  } catch (err) {
    console.error("❌ Database connection test failed:", err);
    return false;
  }
};

// Test connection on startup
testConnection();

pool.on("error", (err: Error) => {
  console.error("❌ Database connection error:", err);
  process.exit(1);
});

console.log("✅ Connected to PostgreSQL");

export = {
  query: (text: string, params: any[]) => pool.query(text, params),
  pool,
};
