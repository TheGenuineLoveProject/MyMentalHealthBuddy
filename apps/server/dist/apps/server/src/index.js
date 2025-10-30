import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import expressStaticGzip from "express-static-gzip";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { validateEnv } from "./lib/env.js";
import { requestTimeout, timeoutPresets } from "./lib/requestTimeout.js";
import { devAuthFallback } from "./lib/authMiddleware.js";
import { configureSecurityHeaders, getCorsOptions } from "./lib/securityHeaders.js";
import { setupGracefulShutdown } from "./lib/gracefulShutdown.js";
import { monitoring, monitoringMiddleware } from "./lib/monitoring.js";
import { varyHeader } from "./lib/apiCache.js";
const PgSession = connectPg(session);
dotenv.config();
const env = validateEnv();
console.log("✅ Environment variables validated");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const isProduction = process.env.NODE_ENV === "production";
const isDev = !isProduction;
// === 360° MIDDLEWARE INTEGRATION === //
// 1. Monitoring (track ALL requests)
app.use(monitoringMiddleware);
// 2. Session configuration for authentication (PostgreSQL-backed for production)
const sessionConfig = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction, // HTTPS only in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
};
// Configure session store based on environment
if (isProduction) {
    // Production REQUIRES PostgreSQL for multi-instance compatibility
    // DATABASE_URL is validated as required in production by env.ts
    // Autoscale-safe database connection pool (360° production-ready)
    const pgPool = new pg.Pool({
        connectionString: env.DATABASE_URL,
        max: 10, // Conservative max for Autoscale (multiple instances share connection limit)
        min: 0, // CRITICAL: 0 for Autoscale (avoid pre-warming connections per instance)
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 5000, // Timeout for acquiring connection (5s)
        allowExitOnIdle: true, // Allow pool to exit when idle (important for Autoscale)
        statement_timeout: 30000, // SQL statement timeout (30s)
        query_timeout: 30000, // Query timeout (30s)
    });
    sessionConfig.store = new PgSession({
        pool: pgPool,
        tableName: 'user_sessions',
        createTableIfMissing: true
    });
    console.log('✅ PostgreSQL session store configured (production multi-instance ready)');
}
else {
    // Development uses memory store (fine for single instance)
    console.log('⚠️  Using memory session store (development only - not suitable for production)');
}
app.use(session(sessionConfig));
// 3. Development auth fallback (auto-disabled in production)
app.use(devAuthFallback);
// 4. Security headers (CSP, HSTS, etc.)
configureSecurityHeaders(app);
// 5. CORS with proper configuration
app.use(cors(getCorsOptions()));
// 6. Helmet for additional security
app.use(helmet({
    contentSecurityPolicy: false, // Using custom CSP from securityHeaders
    crossOriginEmbedderPolicy: false,
    frameguard: isDev ? false : { action: 'sameorigin' } // Disable in dev for Replit webview
}));
// 7. Compression (optimized for 360° performance)
app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    level: 6, // Optimal balance between speed and compression (1-9, default 6)
    threshold: 1024, // Only compress responses larger than 1KB
    memLevel: 8, // Memory level for compression (1-9, default 8)
}));
// 8. JSON parsing
app.use(express.json({ limit: '10mb' }));
// 9. Request timeout middleware
app.use(requestTimeout(timeoutPresets.normal));
// Request validation middleware
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
            if (!req.is('application/json')) {
                return res.status(415).json({
                    error: 'Content-Type must be application/json'
                });
            }
        }
    }
    next();
});
// Enhanced health check endpoint with comprehensive monitoring
app.get("/health", async (req, res) => {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    const health = {
        status: "healthy",
        ok: true,
        service: "MyMentalHealthBuddy API",
        version: "1.1.0",
        environment: isProduction ? "production" : "development",
        timestamp: new Date().toISOString(),
        uptime: {
            seconds: Math.round(uptime),
            formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
        },
        memory: {
            used: Math.round(memUsage.heapUsed / 1024 / 1024),
            total: Math.round(memUsage.heapTotal / 1024 / 1024),
            rss: Math.round(memUsage.rss / 1024 / 1024),
            external: Math.round(memUsage.external / 1024 / 1024),
            unit: "MB",
            usage: `${Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)}%`
        },
        system: {
            platform: process.platform,
            nodeVersion: process.version,
            pid: process.pid
        }
    };
    // Set cache control for health checks (short cache for monitoring)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json(health);
});
// Readiness check endpoint (for deployment platforms)
app.get("/ready", async (req, res) => {
    try {
        // Check if server is ready to accept requests
        const isReady = true; // Add actual readiness checks here (e.g., database connection)
        if (isReady) {
            res.status(200).json({ ready: true, message: "Server is ready" });
        }
        else {
            res.status(503).json({ ready: false, message: "Server not ready" });
        }
    }
    catch (error) {
        res.status(503).json({ ready: false, error: "Readiness check failed" });
    }
});
// Monitoring stats endpoint
app.get("/api/monitoring/stats", (req, res) => {
    const stats = monitoring.getMetricsSummary();
    res.json(stats);
});
// 360° Performance: Vary header for proper cache keying
app.use('/api', varyHeader(['Authorization', 'Accept-Encoding', 'Accept']));
// Register application routes
registerRoutes(app);
// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.path,
        method: req.method
    });
});
// Global error handler middleware
app.use((err, req, res, next) => {
    // Log the error with stack trace
    console.error('[GLOBAL ERROR HANDLER]', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
        timestamp: new Date().toISOString()
    });
    // Handle ValidationError with specific status code
    if (err.name === 'ValidationError') {
        return res.status(err.statusCode || 400).json({
            error: err.message,
            details: err.errors,
            ...(isProduction ? {} : { stack: err.stack })
        });
    }
    // Handle OpenAI errors
    if (err.name && err.name.includes('OpenAIError')) {
        return res.status(err.statusCode || 500).json({
            error: err.message,
            code: err.code,
            ...(isProduction ? {} : { stack: err.stack })
        });
    }
    // Don't leak error details in production for unknown errors
    const errorMessage = isProduction
        ? 'An unexpected error occurred. Please try again.'
        : err.message;
    res.status(err.statusCode || 500).json({
        error: errorMessage,
        ...(isProduction ? {} : { stack: err.stack })
    });
});
// Development mode: Vite middleware integration
if (isDev) {
    // Use __dirname for robustness: from dist/apps/server/src, go up to workspace root
    // __dirname: /workspace/apps/server/dist/apps/server/src
    // Go up 6 levels to workspace root, then into apps/client  
    const clientRoot = path.join(__dirname, '../../../../../../apps/client');
    const workspaceRoot = path.join(__dirname, '../../../../../..');
    console.log(`📁 Client root: ${clientRoot}`);
    console.log(`📁 Workspace root: ${workspaceRoot}`);
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
        root: clientRoot,
        resolve: {
            preserveSymlinks: false
        }
    });
    app.use(vite.middlewares);
    // Only serve index.html for non-API, non-asset requests
    app.use('*', async (req, res, next) => {
        // Skip API routes and asset files
        if (req.originalUrl.startsWith('/api') ||
            req.originalUrl.match(/\.(js|jsx|ts|tsx|css|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
            return next();
        }
        const url = req.originalUrl;
        try {
            // Inline HTML template for development
            let template = `<!doctype html>
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
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        }
        catch (e) {
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });
}
// Production static file serving
if (isProduction) {
    // Use __dirname for robustness: from dist/apps/server/src, go up to workspace root
    // __dirname: /workspace/apps/server/dist/apps/server/src
    // Go up 6 levels to workspace root, then into apps/client/dist
    const clientDistPath = path.join(__dirname, '../../../../../../apps/client/dist');
    console.log(`📦 Production dist: ${clientDistPath}`);
    app.use(expressStaticGzip(clientDistPath, {
        enableBrotli: true,
        orderPreference: ['br', 'gz'],
        serveStatic: {
            maxAge: '1y',
            immutable: true,
            etag: true,
            lastModified: true,
            setHeaders: (res, filePath) => {
                if (filePath.endsWith('.html')) {
                    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
                }
                else if (filePath.match(/\.(js|css|woff2?|ttf|eot)$/)) {
                    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                }
                else if (filePath.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)) {
                    res.setHeader('Cache-Control', 'public, max-age=2592000');
                }
            }
        }
    }));
    app.get("*", (req, res) => {
        res.sendFile(path.join(clientDistPath, "index.html"));
    });
}
// Global error handlers are now managed by gracefulShutdown module
// (configured below after server starts)
// Start server
async function startServer() {
    const server = app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server running on port ${PORT} (${isProduction ? "production" : "development"} mode)`);
        console.log(`🔒 Security middleware: CORS, Helmet, Compression, Session enabled`);
        console.log(`🛡️  Advanced Security: CSP headers, Rate limiting, Monitoring active`);
        console.log(`📊 Request logging: Enabled`);
        console.log(`⚡ Global error handlers: Active`);
        console.log(`🔄 Request timeout protection: 30s`);
        console.log(`📈 Monitoring: /api/monitoring/stats endpoint available`);
        if (isDev) {
            console.log(`🎨 Vite middleware: Enabled (serving frontend on same port)`);
        }
    });
    // Handle server errors
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use`);
        }
        else {
            console.error('❌ Server error:', error);
        }
        process.exit(1);
    });
    // Setup graceful shutdown for Cloud Run / Autoscale deployments
    setupGracefulShutdown(server, {
        timeout: 30000, // 30 seconds
        onShutdown: async () => {
            console.log('[SHUTDOWN] Cleaning up resources...');
            // Add any cleanup logic here (close DB connections, etc.)
        }
    });
}
startServer();
export { app };
