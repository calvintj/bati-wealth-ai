import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

pool.on('error', (err: Error) => {
  console.error('❌ Database connection error:', err);
  process.exit(1); // Exit the application if DB fails
});

console.log('✅ Connected to PostgreSQL');

export = {
  query: (text: string, params: any[]) => pool.query(text, params),
  pool
};
