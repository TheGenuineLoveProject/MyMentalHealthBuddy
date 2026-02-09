// server/app.mjs
// Shared Express app for testing and production
import express from "express";
import cookieParser from "cookie-parser";
import { logger } from "./utils/logger.mjs";

const app = express();

// Core middleware
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root-level health endpoints (tests expect these)
app.get("/healthz", (_req, res) => {
  res.status(200).json({ 
    ok: true, 
    status: "ok", 
    version: "2.0.0" 
  });
});

app.get("/api/health-check", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * Mount routers if they exist.
 * If a router file has a syntax/runtime import error, it will be skipped.
 */
async function mountIfExists(mountPath, modulePath) {
  try {
    const mod = await import(modulePath);
    const router = mod.default || mod.router;
    if (router) app.use(mountPath, router);
  } catch (e) {
    // Log errors in test mode for debugging
    if (process.env.NODE_ENV === "test") {
      logger.warn("Failed to mount route", { mountPath, error: e?.message || e });
    }
  }
}

// Mount all API routers
await mountIfExists("/api/auth", "./routes/auth.mjs");
await mountIfExists("/api/admin", "./routes/admin.mjs");
await mountIfExists("/api/journal", "./routes/journal.mjs");
await mountIfExists("/api/mood", "./routes/mood.mjs");
await mountIfExists("/api/moods", "./routes/mood.mjs");
await mountIfExists("/api/badges", "./routes/badges.mjs");
await mountIfExists("/api/invites", "./routes/invites.mjs");
await mountIfExists("/api/user/settings", "./routes/userSettings.mjs");
await mountIfExists("/api/states", "./routes/states.mjs");
await mountIfExists("/api/insights", "./routes/insights.mjs");
await mountIfExists("/api/wisdom", "./routes/wisdom.mjs");
await mountIfExists("/api/dialectics", "./routes/dialectics.mjs");
await mountIfExists("/api/practices", "./routes/practices.mjs");
await mountIfExists("/api/knowledge", "./routes/knowledge.mjs");
await mountIfExists("/api/philosophy", "./routes/philosophy.mjs");
await mountIfExists("/api/metacognition", "./routes/metacognition.mjs");
await mountIfExists("/api/creativity", "./routes/creativity.mjs");
await mountIfExists("/api/resilience", "./routes/resilience.mjs");
await mountIfExists("/api/foresight", "./routes/foresight.mjs");
await mountIfExists("/api/systems-compassion", "./routes/systems-compassion.mjs");
await mountIfExists("/api/collective-intelligence", "./routes/collective-intelligence.mjs");
await mountIfExists("/api/wisdom-synthesis", "./routes/wisdom-synthesis.mjs");
await mountIfExists("/api/cognitive-lab", "./routes/cognitive-lab.mjs");
await mountIfExists("/api/contemplative", "./routes/contemplative.mjs");
await mountIfExists("/api/ethical-reasoning", "./routes/ethical-reasoning.mjs");
await mountIfExists("/api/existential", "./routes/existential.mjs");
await mountIfExists("/api/embodiment", "./routes/embodiment.mjs");
await mountIfExists("/api/narrative", "./routes/narrative.mjs");
await mountIfExists("/api/relational", "./routes/relational.mjs");
await mountIfExists("/api/values", "./routes/values.mjs");
await mountIfExists("/api/neuro-integration", "./routes/neuro-integration.mjs");
await mountIfExists("/api/socio-ecology", "./routes/socio-ecology.mjs");
await mountIfExists("/api/praxis", "./routes/praxis.mjs");
await mountIfExists("/api/post-trauma", "./routes/post-trauma.mjs");
await mountIfExists("/api/healing", "./routes/healing-tools.mjs");
await mountIfExists("/api/meaning", "./routes/meaning-future.mjs");
await mountIfExists("/api/content", "./routes/content-generator.mjs");
await mountIfExists("/api/mirror", "./routes/mirror.mjs");
await mountIfExists("/api/ai", "./routes/ai.mjs");
await mountIfExists("/api/gamification", "./routes/gamification.mjs");
await mountIfExists("/api/health", "./routes/health.mjs");
await mountIfExists("/api/admin/soft-launch-metrics", "./routes/soft-launch-metrics.mjs");
await mountIfExists("/api/feedback", "./routes/feedback.mjs");
await mountIfExists("/api/gratitude", "./routes/gratitude.mjs");
await mountIfExists("/api/favorites", "./routes/favorites.mjs");
await mountIfExists("/api/admin/publishing", "./routes/admin-publishing.mjs");
await mountIfExists("/rss.xml", "./routes/rss.mjs");

// JSON 404 (important so tests don't get HTML)
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found", path: req.path });
});

export default app;
