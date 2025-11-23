// server/db/connection.mjs
import 'dotenv/config';
import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const { Pool } = pkg;

// Use your DATABASE_URL from Replit Secrets
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true'
    ? { rejectUnauthorized: false }
    : undefined,
});

// ✅ THIS is the important part: named export "db"
export const db = drizzle(pool);

// (optional) export pool if you ever need it
export { pool };