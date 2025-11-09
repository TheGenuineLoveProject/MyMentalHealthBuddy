"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const routes_js_1 = require("./routes.js");
const session_js_1 = require("./lib/session.js");
const env_js_1 = require("./lib/env.js");
const logger_js_1 = require("./lib/logger.js");
const securityHeaders_js_1 = require("./lib/securityHeaders.js");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
// Check if we're in development mode
const isDev = process.env.NODE_ENV !== "production";
// Validate environment variables on startup
try {
    (0, env_js_1.validateEnv)();
}
catch (error) {
    logger_js_1.logger.error("Environment validation failed", error instanceof Error ? error : new Error(String(error)));
    logger_js_1.logger.warn("Continuing with available environment variables");
}
const app = (0, express_1.default)();
// Security and performance middleware
app.use((0, cors_1.default)((0, securityHeaders_js_1.getCorsOptions)())); // 360° Production-grade CORS with allowlist
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Disabled - using custom security headers below
}));
(0, securityHeaders_js_1.configureSecurityHeaders)(app); // 360° Production-grade security headers
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("dev"));
// Body parsing (will be configured per-route for Stripe webhooks)
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Session middleware (production-grade with PostgreSQL store)
app.use((0, session_js_1.createSessionMiddleware)());
// Register all API routes
(0, routes_js_1.registerRoutes)(app);
// Fallback: serve static assets
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Global error handler
app.use((err, _req, res, _next) => {
    logger_js_1.logger.error("Server error", err instanceof Error ? err : new Error(String(err)));
    res.status(err.status || 500).json({
        error: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});
const PORT = process.env.PORT || 5000;
// Start server with Vite integration in development
async function startServer() {
    // Development mode: Vite middleware integration
    if (isDev) {
        const { createServer: createViteServer } = await Promise.resolve().then(() => __importStar(require("vite")));
        // Calculate client root path from TypeScript source location
        // From apps/server/src, go up 2 levels then into apps/client
        const clientRoot = path_1.default.join(__dirname, "../../client");
        logger_js_1.logger.info("Client root configured", { clientRoot });
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "custom",
            root: clientRoot,
        });
        app.use(vite.middlewares);
        // Only serve index.html for non-API, non-asset requests
        app.use((req, res, next) => {
            // Skip API routes and asset files
            if (req.originalUrl.startsWith("/api") ||
                req.originalUrl.match(/\.(js|jsx|ts|tsx|css|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
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
                }
                catch (e) {
                    vite.ssrFixStacktrace(e);
                    next(e);
                }
            })();
        });
    }
    app.listen(PORT, () => {
        logger_js_1.logger.info("Server ready", { port: PORT });
        logger_js_1.logger.info("Health check available", { endpoint: `/api/health` });
    });
}
startServer().catch((error) => {
    logger_js_1.logger.error("Failed to start server", error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
});
