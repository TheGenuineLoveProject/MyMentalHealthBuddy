// 360° CRITICAL: Sentry instrumentation now loaded via --import flag in package.json
// This ensures Sentry initializes BEFORE Express for proper auto-instrumentation

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
import { logger } from "./lib/logger.js";
import { configureSecurityHeaders, getCorsOptions } from "./lib/securityHeaders.js";
import * as Sentry from "@sentry/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're in development mode
const isDev = process.env.NODE_ENV !== "production";

// Validate environment variables on startup
try {
  validateEnv();
} catch (error) {
  logger.error("Environment validation failed", error instanceof Error ? error : new Error(String(error)));
  logger.warn("Continuing with available environment variables");
}

const app = express();

// Production-safe port resolution: SERVER_PORT (dev override) → PORT (platform-provided) → 5000 (fallback)
// This ensures development uses 5000 consistently while deployments respect platform-injected PORT
const PORT = Number(process.env.SERVER_PORT ?? process.env.PORT ?? 5000);

// 360° MIT-PhD Level Architecture: Async app configuration with proper middleware sequencing
async function configureApp() {
  // PHASE 1: Security and performance middleware (must be first)
  app.use(cors(getCorsOptions())); // 360° Production-grade CORS with allowlist
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled - using custom security headers below
  }));
  configureSecurityHeaders(app); // 360° Production-grade security headers
  app.use(compression());
  app.use(morgan("dev"));

  // PHASE 2: Body parsing (will be configured per-route for Stripe webhooks)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // PHASE 3: Session middleware (production-grade with PostgreSQL store)
  app.use(createSessionMiddleware());

  // PHASE 4: Static file serving (888...^ perfection - zero console errors)
  // Serve built client assets from apps/client/dist
  // In development: Use `vite build --watch` to auto-rebuild on changes
  // In production: Serve pre-built assets
  const clientDistPath = path.join(__dirname, "../../client/dist");
  
  logger.info("Serving client from", { path: clientDistPath, mode: isDev ? "development (watched build)" : "production" });
  
  app.use(express.static(clientDistPath));

  // PHASE 5: Register all API routes (AFTER static assets)
  registerRoutes(app);

  // PHASE 6: SPA fallback - serve index.html for all non-API routes
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    // Skip if file was found (static middleware already served it)
    if (res.headersSent) {
      return;
    }
    
    // Serve index.html for all other routes (SPA fallback)
    res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
      if (err) {
        logger.error("Failed to serve index.html", err instanceof Error ? err : new Error(String(err)));
        next(err);
      }
    });
  });

  // PHASE 7: Sentry error handler (MUST come AFTER all routes but BEFORE custom error handlers)
  Sentry.setupExpressErrorHandler(app);

  // PHASE 8: Custom error handler (MUST be last, after Sentry)
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error("Server error", err instanceof Error ? err : new Error(String(err)));
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
  });
}

// Start server with proper async configuration
async function startServer() {
  // Configure app with proper middleware sequencing
  await configureApp();
  
  app.listen(PORT, () => {
    logger.info("Server ready", { port: PORT });
    logger.info("Health check available", { endpoint: `/api/health` });
  });
}

startServer().catch((error) => {
  logger.error("Failed to start server", error instanceof Error ? error : new Error(String(error)));
  process.exit(1);
});
