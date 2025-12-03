// server/db/connection.mjs
// Single Drizzle client for the whole app

import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../shared/schema.mjs";
import { logger } from "../utils/logger.mjs";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  logger.error("Missing DATABASE_URL in environment");
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
    logger.info("Database pool closed cleanly");
  } catch (err) {
    logger.error("Error closing database pool", { error: err.message });
  }
}
