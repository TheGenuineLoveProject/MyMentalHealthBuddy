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

// Boot diagnostic — log a redacted view of DATABASE_URL so production
// triage can confirm host/db without leaking credentials. Surfaces
// "host=... db=... ssl=..." and never the password or full URL.
try {
  const u = new URL(process.env.DATABASE_URL);
  const ssl = process.env.DATABASE_SSL === "false" ? "off" : "on";
  logger.info(`[db] connecting host=${u.hostname} db=${u.pathname.slice(1)} ssl=${ssl}`);
} catch {
  logger.warn("[db] DATABASE_URL is set but not a parseable URL");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
  // Hard timeouts so a hung Neon endpoint can never block boot. Without
  // these, ensureSchema() can wait forever on the first execute() call
  // (this exact failure mode caused the 2026-05-10 production crash-loop:
  // routes mounted, then port-never-opened timeout 49s later).
  connectionTimeoutMillis: 8000,    // give up establishing TCP+TLS+auth after 8s
  idleTimeoutMillis: 30000,         // close idle clients after 30s
  statement_timeout: 15000,         // server-side: cancel any single query >15s
  query_timeout: 15000,             // client-side belt+suspenders for the same
});

pool.on("error", (err) => {
  logger.warn(`[db] idle pool client error: ${err?.message || err}`);
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
