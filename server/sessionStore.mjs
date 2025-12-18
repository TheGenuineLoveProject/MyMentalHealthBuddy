import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

const PgSession = connectPgSimple(session);

export function buildSessionMiddleware() {
  const isProd = process.env.NODE_ENV === "production";
  const hasDb = !!process.env.DATABASE_URL;

  // Always set trust proxy on Replit/Autoscale (important for secure cookies behind proxy)
  const cookie = {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd, // secure cookies only in prod
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const base = {
    name: "tglp.sid",
    secret: process.env.SESSION_SECRET || "dev-session-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie,
  };

  // ✅ Production + DATABASE_URL => Postgres-backed sessions (Autoscale safe)
  if (isProd && hasDb) {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    return session({
      ...base,
      store: new PgSession({
        pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
    });
  }

  // Dev fallback (ok locally)
  return session(base);
}