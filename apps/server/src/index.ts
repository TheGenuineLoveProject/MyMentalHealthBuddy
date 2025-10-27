import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import expressStaticGzip from "express-static-gzip";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const isProduction = process.env.NODE_ENV === "production";

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    console.log(`[${logLevel}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Security middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));

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

// Health check endpoint with enhanced monitoring
app.get("/health", async (req, res) => {
  const health = {
    ok: true,
    service: "MyMentalHealthBuddy API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: "MB"
    }
  };
  res.json(health);
});

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
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log the error with stack trace
  console.error('[GLOBAL ERROR HANDLER]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const errorMessage = isProduction 
    ? 'An unexpected error occurred. Please try again.' 
    : err.message;

  res.status(500).json({
    error: errorMessage,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

// Production static file serving
if (isProduction) {
  const clientDistPath = path.join(__dirname, "../../../../../client/dist");
  
  app.use(
    expressStaticGzip(clientDistPath, {
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
          } else if (filePath.match(/\.(js|css|woff2?|ttf|eot)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else if (filePath.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=2592000');
          }
        }
      }
    })
  );
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('[UNHANDLED PROMISE REJECTION]', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
    timestamp: new Date().toISOString()
  });
  
  // In production, you might want to:
  // 1. Log to monitoring service (Sentry, DataDog, etc.)
  // 2. Gracefully shutdown if critical
  // For now, we log and continue
});

// Global uncaught exception handler
process.on('uncaughtException', (error: Error) => {
  console.error('[UNCAUGHT EXCEPTION]', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  // Uncaught exceptions are serious - the process is in an undefined state
  // Best practice is to gracefully shutdown
  console.error('Server is shutting down due to uncaught exception...');
  process.exit(1);
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server gracefully');
  process.exit(0);
});

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT} (${isProduction ? "production" : "development"} mode)`);
  console.log(`🔒 Security middleware: CORS, Helmet, Compression enabled`);
  console.log(`📊 Request logging: Enabled`);
  console.log(`⚡ Global error handlers: Active`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

export { app };
