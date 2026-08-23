import pg from "pg";
import { getPostgresConnectionString, getPostgresSslConfig } from "./sslConfig.mjs";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";

const { Pool } = pg;

export function createSessionMiddleware() {
  const PgSession = connectPgSimple(session);

  const pool = new Pool({
    connectionString: getPostgresConnectionString(process.env.DATABASE_URL),
    ssl: process.env.NODE_ENV === "production" ? getPostgresSslConfig() : false
  });

  return session({
    name: "genuine-love-session",
    store: new PgSession({
      pool,
      tableName: "session"
    }),
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  });
}