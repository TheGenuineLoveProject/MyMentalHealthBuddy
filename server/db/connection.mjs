// server/db/connection.mjs
// Single Drizzle client for the whole app

import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../shared/schema.mjs";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("[DB] Missing DATABASE_URL in environment.");
  process.exit(1);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

export { schema };

export async function closeDb() {
  try {
    await pool.end();
    console.log("[DB] Pool closed cleanly.");
  } catch (err) {
    console.error("[DB] Error closing pool:", err);
  }
}
