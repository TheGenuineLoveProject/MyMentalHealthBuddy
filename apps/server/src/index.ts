import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";
import { createSessionMiddleware } from "./lib/session.js";
import { validateEnv } from "./lib/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables on startup
try {
  validateEnv();
} catch (error) {
  console.error("❌ Environment validation failed:", error);
  console.log("⚠️  Continuing with available environment variables...");
}

const app = express();

// Security and performance middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // Vite handles CSP in dev
}));
app.use(compression());
app.use(morgan("dev"));

// Body parsing (will be configured per-route for Stripe webhooks)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (production-grade with PostgreSQL store)
app.use(createSessionMiddleware());

// Register all API routes
registerRoutes(app);

// Fallback: serve static assets
app.use(express.static(path.join(__dirname, "../public")));

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("💥 Server error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
