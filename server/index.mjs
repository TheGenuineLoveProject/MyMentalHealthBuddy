import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from 'path';
import { buildSessionMiddleware } from './middleware/session.mjs';

import authRouter from './routes/auth.mjs';
import blogRouter from './routes/blog.mjs';
import journalRouter from './routes/journal.mjs';
import moodRouter from './routes/mood.mjs';
import healthRouter from './routes/health.mjs';

import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.DATABASE_URL) {
  console.error("DEPLOY BLOCKED: DATABASE_URL is missing in production. Add it in Replit Deploy Secrets.");
  process.exit(1);
}

// Trust proxy for secure cookies behind load balancer (Autoscale)
app.set('trust proxy', 1);

// Core middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// Sessions (MemoryStore in dev; Postgres store in production)
app.use(buildSessionMiddleware());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/blog', blogRouter);
app.use('/api/journal', journalRouter);
app.use('/api/mood', moodRouter);
app.use('/api/health', healthRouter);

// Health check endpoint
app.get('/health', (_req, res) => res.json({ ok: true, app: 'The Genuine Love Project' }));

// Serve frontend (Vite build output)
const distPath = join(__dirname, "../client/dist");
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

// Error handler (always JSON)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    ok: false,
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong. Please try again.",
  });
});

const PORT = Number(process.env.PORT || 5000);
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
