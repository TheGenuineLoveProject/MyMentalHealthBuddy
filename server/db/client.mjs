// server/db/client.mjs
import 'dotenv/config';
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { logger } from "../utils/logger.mjs";
import * as schema from "../../shared/schema.mjs";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  logger.error("FATAL: DATABASE_URL missing");
  process.exit(1);
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  logger.error('Unexpected database pool error', { error: err.message, code: err.code });
});

pool.on('connect', () => {
  logger.debug('Database pool connection established');
});

export const db = drizzle(pool, { schema });
export default db;
