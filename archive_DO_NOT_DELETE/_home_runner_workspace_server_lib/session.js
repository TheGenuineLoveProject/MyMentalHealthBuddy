import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";
const PgSession = connectPg(session);
const { Pool } = pg;
export function createSessionStore() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error("DATABASE_URL environment variable is required for session management");
    }
    const pool = new Pool({
        connectionString: dbUrl,
    });
    return new PgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true,
    });
}
export function createSessionMiddleware() {
    const isProduction = process.env.NODE_ENV === "production";
    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
        throw new Error("SESSION_SECRET environment variable is required for session management");
    }
    if (sessionSecret.length < 32) {
        throw new Error("SESSION_SECRET must be at least 32 characters for security");
    }
    return session({
        store: createSessionStore(),
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: isProduction,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: isProduction ? "strict" : "lax",
        },
    });
}
