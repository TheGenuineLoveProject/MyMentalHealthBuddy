import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import helmet from "helmet";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from 'path';
import { buildSessionMiddleware } from './middleware/session.mjs';

// Import all route modules
import authRouter from './routes/auth.mjs';
import blogRouter from './routes/blog.mjs';
import journalRouter from './routes/journal.mjs';
import moodRouter from './routes/mood.mjs';
import healthRouter from './routes/health.mjs';
import accountRouter from './routes/account.mjs';
import adminRouter from './routes/admin.mjs';
import aiRouter from './routes/ai.mjs';
import analyticsRouter from './routes/analytics.mjs';
import billingRouter from './routes/billing.mjs';
import gamificationRouter from './routes/gamification.mjs';
import onboardingRouter from './routes/onboarding.mjs';
import therapyRouter from './routes/therapy.mjs';

import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.DATABASE_URL) {
  console.error("DEPLOY BLOCKED: DATABASE_URL is missing in production.");
  process.exit(1);
}

// Trust proxy for secure cookies behind load balancer
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

// Sessions
app.use(buildSessionMiddleware());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/blog', blogRouter);
app.use('/api/journal', journalRouter);
app.use('/api/mood', moodRouter);
app.use('/api/health', healthRouter);
app.use('/api/account', accountRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/billing', billingRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/therapy', therapyRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, service: "TheGenuineLoveProject", time: new Date().toISOString() });
});

// Serve frontend (Vite build output)
const distPath = join(__dirname, "../client/dist");
app.use(express.static(distPath));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

// Error handler
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
