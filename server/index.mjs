import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import aiRoutes from "./routes/ai.mjs";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";
import rateLimit from "./middleware/rateLimit.mjs";
import { sanitizeBody, securityHeaders, cspHeaders } from "./middleware/security.mjs";
import { requestId } from "./middleware/requestId.mjs";
import { requestLogger } from "./utils/logger.mjs";
import { initSentry, sentryErrorHandler, captureException } from "./utils/sentry.mjs";
import db from "./db/client.mjs";
import analyticsRoutes from "./routes/analytics.mjs";
import authRoutes from "./routes/auth.mjs";
import journalRoutes from "./routes/journal.mjs";
import moodRoutes from "./routes/mood.mjs";
import aiDashboardRoutes from "./routes/ai-dashboard.mjs";
import billingRoutes from "./routes/billing.mjs";
import contentRoutes from "./routes/content.mjs";
import canvaAuthRoutes from "./routes/canva-oauth.mjs";
import stripeWebhookRoutes from "./routes/stripeWebhook.mjs";
import accountRoutes from "./routes/account.mjs";
import gamificationRoutes from "./routes/gamification.mjs";
import uiDashboardRoutes from "./routes/ui-dashboard.mjs";
import healthRoutes from "./routes/health.mjs";
import adminRoutes from "./routes/admin.mjs";
import therapyRoutes from "./routes/therapy.mjs";
import proFeaturesRoutes from "./routes/pro-features.mjs";
import onboardingRoutes from "./routes/onboarding.mjs";
import { makeSessionStore } from "./utils/sessionStore.mjs";
import { createSessionMiddleware } from "./db/sessionStore.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";

if (isProd && !process.env.SESSION_SECRET) {
  console.error("FATAL: SESSION_SECRET is required in production");
  process.exit(1);
}

if (isProd && !process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is required in production for session persistence");
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.warn("Warning: Missing SESSION_SECRET. Using dev fallback.");
  process.env.SESSION_SECRET = "mmb-dev-secret-" + Math.random().toString(36);
}

const SESSION_TTL_DAYS = 14;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * SESSION_TTL_DAYS;

const sessionConfig = {
  store: process.env.DATABASE_URL ? makeSessionStore() : undefined,
  name: isProd ? "__Host-tglp.sid" : "tglp.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "lax" : "lax",
    maxAge: SESSION_TTL_MS,
    path: "/",
  },
};

if (!sessionConfig.store && isProd) {
  console.error("FATAL: MemoryStore cannot be used in production. Ensure DATABASE_URL is set.");
  process.exit(1);
}

if (!sessionConfig.store) {
  console.warn("⚠️  Using MemoryStore for sessions (development only). Sessions will not persist across restarts.");
}

const app = express();
initSentry(app);
app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cspHeaders);
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(requestId);
app.use(requestLogger);
app.use(securityHeaders);
app.use(sanitizeBody);
app.use(rateLimit);
app.use(session(sessionConfig));

app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai-dashboard", aiDashboardRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/canva", canvaAuthRoutes);
app.use("/api/webhooks/stripe", stripeWebhookRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/ui-dashboard", uiDashboardRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/therapy", therapyRoutes);
app.use("/api/pro", proFeaturesRoutes);
app.use("/api/onboarding", onboardingRoutes);

app.get("/api/ready", async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not ready" });
  }
});

// Serve brand assets
app.use("/brand", express.static(path.join(__dirname, "../public/brand")));

const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.use(sentryErrorHandler);
app.use((err, req, res, next) => {
  captureException(err);
  console.error("Error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = Number(process.env.PORT || 5000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));

export default app;
