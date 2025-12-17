import pgSession from "connect-pg-simple";
import session from "express-session";
import { Pool } from "pg";

export function makeSessionStore() {
  const PgSession = pgSession(session);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });

  return new PgSession({
    pool,
    tableName: "sessions",
    createTableIfMissing: true,
  });
}