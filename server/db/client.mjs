# server/db/client.mjs
import 'dotenv/config';
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("[FATAL] DATABASE_URL missing");
  process.exit(1);
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
export const db = drizzle(pool);