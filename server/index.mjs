import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname, join } from 'path';
import process from "node:process";
import authRouter from './routes/auth.mjs';
import adminRouter from './routes/admin.mjs';
import blogRouter from './routes/blog.mjs';
import journalRouter from './routes/journal.mjs';
import moodRouter from './routes/mood.mjs';
import healthRouter from './routes/health.mjs';
import accountRouter from './routes/account.mjs';
import aiRouter from './routes/ai.mjs';
import analyticsRouter from './routes/analytics.mjs';
import billingRouter from './routes/billing.mjs';
import gamificationRouter from './routes/gamification.mjs';
import onboardingRouter from './routes/onboarding.mjs';
import therapyRouter from './routes/therapy.mjs';
import dashboardRouter from './routes/ui-dashboard.mjs';
import webhookRouter from "./routes/webhook.mjs";
import insightsRouter from './routes/insights.mjs';
import statesRouter from './routes/states.mjs';
import promptsRouter from './routes/prompts.mjs';
import mirrorRouter from "./routes/mirror.mjs";
import communityRouter from "./routes/community.mjs";
import wisdomRouter from "./routes/wisdom.mjs";
import dialecticsRouter from "./routes/dialectics.mjs";
import practicesRouter from "./routes/practices.mjs";
import knowledgeRouter from "./routes/knowledge.mjs";
import philosophyRouter from "./routes/philosophy.mjs";
import metacognitionRouter from "./routes/metacognition.mjs";
import creativityRouter from "./routes/creativity.mjs";
import resilienceRouter from "./routes/resilience.mjs";
import foresightRouter from "./routes/foresight.mjs";
import systemsCompassionRouter from "./routes/systems-compassion.mjs";
import collectiveIntelligenceRouter from "./routes/collective-intelligence.mjs";
import { requestId, requestLogger } from "./middleware/requestId.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.DATABASE_URL) {
  console.error("DEPLOY BLOCKED: DATABASE_URL is missing in production.");
  process.exit(1);
}

const app = express();

app.set('trust proxy', 1);

// Request tracking middleware (first in chain)
app.use(requestId);
app.use(requestLogger);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Production-safe CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGINS,
  isProduction ? undefined : "http://localhost:5000",
  isProduction ? undefined : "http://localhost:5173",
].filter(Boolean).flatMap((value) =>
  value.split(",").map((entry) => entry.trim()).filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // In development, allow all origins
    if (!isProduction) return callback(null, true);
    // In production, check allowlist
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/journal', journalRouter);
app.use('/api/mood', moodRouter);
app.use('/api/health', healthRouter);
app.use('/api/account', accountRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/billing', billingRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/therapy', therapyRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/states', statesRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/mirror', mirrorRouter);
app.use('/api/community', communityRouter);
app.use('/api/wisdom', wisdomRouter);
app.use('/api/dialectics', dialecticsRouter);
app.use('/api/practices', practicesRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/philosophy', philosophyRouter);
app.use('/api/metacognition', metacognitionRouter);
app.use('/api/creativity', creativityRouter);
app.use('/api/resilience', resilienceRouter);
app.use('/api/foresight', foresightRouter);
app.use('/api/systems-compassion', systemsCompassionRouter);
app.use('/api/collective-intelligence', collectiveIntelligenceRouter);

app.get("/api/health-check", (_req, res) => {
  res.json({ ok: true, env: isProduction ? "production" : "development" });
});
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

const distPath = join(__dirname, "../client/dist");
app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(500).json({
    ok: false,
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong. Please try again.",
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

function gracefulShutdown(signal) {
  console.log(`${signal} received, shutting down gracefully...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => {
  console.log("[shutdown] SIGTERM received");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("[shutdown] SIGINT received");
  process.exit(0);
});