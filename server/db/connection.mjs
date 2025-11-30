// server/db/connection.mjs
// Single Drizzle client for the whole app, using the shared schema.

import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// IMPORTANT: path goes two levels up to the root /shared folder
import * as schema from "../../shared/schema.ts";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error(
    "[DB] Missing DATABASE_URL in environment. Set it in the Replit Secrets."
  );
  process.exit(1);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

// Some routes expect { db, schema } from this file
export { schema };

// Optional: tiny helper to close pool on shutdown
export async function closeDb() {
  try {
    await pool.end();
    console.log("[DB] Pool closed cleanly.");
  } catch (err) {
    console.error("[DB] Error closing pool:", err);
  }
}