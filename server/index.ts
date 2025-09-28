import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { setupRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import healRoutes from "./routes/heal";

// Load environment variables first
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== "production";

// Database connection
let databaseUrl = process.env.DATABASE_URL;
let db: ReturnType<typeof drizzle> | null = null;

// Fix for HTML-encoded DATABASE_URL
if (databaseUrl) {
  // Remove any potential "DATABASE_URL=" prefix if it exists
  if (databaseUrl.startsWith("DATABASE_URL=")) {
    databaseUrl = databaseUrl.substring("DATABASE_URL=".length);
  }
  // Fix HTML encoding issues
  databaseUrl = databaseUrl.replace(/&amp;/g, "&");

  try {
    const client = postgres(databaseUrl);
    db = drizzle(client);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    console.log("⚠️ Falling back to in-memory storage");
  }
} else {
  console.log("⚠️ No DATABASE_URL found, using in-memory storage");
}

// Session store setup
const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || "mymentalhealthbuddy-secret-key-2024",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !isDev,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: isDev ? "lax" : "strict",
  },
};

// Only add PostgreSQL session store if database connection was successful
if (db && databaseUrl) {
  try {
    const PgSession = connectPgSimple(session);
    sessionConfig.store = new PgSession({
      conString: databaseUrl,
      tableName: "sessions",
      createTableIfMissing: true,
    });
    console.log("✅ PostgreSQL session store configured");
  } catch (error) {
    console.error("⚠️ Session store configuration failed:", error);
    console.log("⚠️ Using memory session store");
  }
} else {
  console.log("⚠️ Using memory session store");
}

// Middleware
app.use(
  cors({
    origin: isDev ? true : process.env.FRONTEND_URL || "https://mymentalhealthbuddy.replit.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

// Store db in app locals for access in routes
app.locals.db = db;

// Setup heal routes
app.use("/api", healRoutes);

// Setup API routes
setupRoutes(app, db);

// Create HTTP server
const server = createServer(app);

// Setup frontend serving
async function startServer() {
  if (isDev) {
    // Development: Use Vite middleware
    await setupVite(app, server);
  } else {
    // Production: Serve static files
    try {
      serveStatic(app);
    } catch (error) {
      console.error("❌ Failed to serve static files:", error);
      console.log("⚠️ Running in development mode instead");
      await setupVite(app, server);
    }
  }

  // Error handler (must be last)
  app.use(errorHandler);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Environment: ${isDev ? "development" : "production"}`);
    console.log(`💾 Database: ${db ? "PostgreSQL" : "In-memory"}`);
  });
}

startServer().catch(console.error);
