import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import authRouter from "./routes/auth.mjs";
import adminRouter from "./routes/admin.mjs";
import blogRouter from "./routes/blog.mjs";
import journalRouter from "./routes/journal.mjs";
import moodRouter from "./routes/mood.mjs";
import healthRouter from "./routes/health.mjs";
import accountRouter from "./routes/account.mjs";
import aiRouter from "./routes/ai.mjs";
import analyticsRouter from "./routes/analytics.mjs";
import billingRouter from "./routes/billing.mjs";
import gamificationRouter from "./routes/gamification.mjs";
import onboardingRouter from "./routes/onboarding.mjs";
import therapyRouter from "./routes/therapy.mjs";
import dashboardRouter from "./routes/ui-dashboard.mjs";
import webhookRouter from "./routes/webhook.mjs";
import insightsRouter from "./routes/insights.mjs";
import statesRouter from "./routes/states.mjs";
import promptsRouter from "./routes/prompts.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/journal", journalRouter);
  app.use("/api/mood", moodRouter);
  app.use("/api/health", healthRouter);
  app.use("/api/account", accountRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/billing", billingRouter);
  app.use("/api/gamification", gamificationRouter);
  app.use("/api/onboarding", onboardingRouter);
  app.use("/api/therapy", therapyRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/webhook", webhookRouter);
  app.use("/api/insights", insightsRouter);
  app.use("/api/states", statesRouter);
  app.use("/api/prompts", promptsRouter);

  app.get("/api/health-check", (_req, res) => {
    res.json({ ok: true, env: "development" });
  });

  const vite = await createViteServer({
    configFile: resolve(__dirname, "../vite.config.js"),
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const fs = await import("fs/promises");
      const indexPath = resolve(__dirname, "../client/index.html");
      let template = await fs.readFile(indexPath, "utf-8");
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dev server listening on http://0.0.0.0:${PORT}`);
  });

  function gracefulShutdown(signal) {
    console.log(`${signal} received, shutting down...`);
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 5000);
  }

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

startServer().catch(console.error);
