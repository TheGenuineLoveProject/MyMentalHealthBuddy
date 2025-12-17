import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";

const { Pool } = pg;

export function createSessionMiddleware() {
  const PgSession = connectPgSimple(session);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
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
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  });
}