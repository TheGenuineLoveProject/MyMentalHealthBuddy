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

  // PHASE 4: Vite middleware integration (MUST come BEFORE route registration)
  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    
    // Calculate client root path from TypeScript source location
    // From apps/server/src, go up 2 levels then into apps/client
    const clientRoot = path.join(__dirname, "../../client");
    
    logger.info("Client root configured", { clientRoot });
    
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false  // Disable HMR to eliminate WebSocket errors in Replit iframe
      },
      appType: "custom",
      root: clientRoot,
    });
    
    app.use(vite.middlewares);
    
    // Only serve index.html for non-API, non-asset requests
    app.use((req, res, next) => {
      // Skip API routes and asset files
      if (
        req.originalUrl.startsWith("/api") ||
        req.originalUrl.match(/\.(js|jsx|ts|tsx|css|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
      ) {
        return next();
      }
      
      const url = req.originalUrl;
      
      // Serve index.html for all other requests
      (async () => {
        try {
          // Inline HTML template for development
          const template = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="AI-powered mental health support platform" />
    <title>MyMentalHealthBuddy</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
          const html = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e: any) {
          vite.ssrFixStacktrace(e);
          next(e);
        }
      })();
    });
  }

  // PHASE 5: Register all API routes (AFTER Vite middleware)
  registerRoutes(app);

  // PHASE 6: Fallback - serve static assets (for production builds)
  app.use(express.static(path.join(__dirname, "../public")));

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
