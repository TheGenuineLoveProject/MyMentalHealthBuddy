import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Import routers AFTER setting up environment
import authRouter from "./routes/auth.mjs";
import adminRouter from "./routes/admin.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();

  // 1. Core middleware FIRST
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  // 2. API routes BEFORE Vite
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);

  // 3. Health check
  app.get("/api/health-check", (_req, res) => {
    res.json({ ok: true, env: "development" });
  });

  // 4. Vite middleware for frontend
  const vite = await createViteServer({
    configFile: resolve(__dirname, "../vite.config.js"),
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  // 5. SPA fallback LAST
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
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dev server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);