// server/app.mjs
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.mjs";
import adminRouter from "./routes/admin.mjs";
import contentRouter from "./routes/content.mjs";
import meaningRouter from "./routes/meaning.mjs";
const app = express();

// Core middleware
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic health
app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * Mount routers if they exist.
 * If a router file has a syntax/runtime import error, it will be skipped,
 * so your tests will see 404. That’s why these router files must compile cleanly.
 */
async function mountIfExists(mountPath, modulePath) {
  try {
    const mod = await import(modulePath);
    const router = mod.default || mod.router;
    if (router) app.use(mountPath, router);
  } catch (_e) {
    // ignore missing/invalid router files
  }
}

// Mount what we have
await mountIfExists("/api", "./routes/api.mjs");
await mountIfExists("/api/auth", "./routes/auth.mjs");
await mountIfExists("/api/admin", "./routes/admin.mjs");
await mountIfExists("/api/content", "./routes/content.mjs");
await mountIfExists("/api/meaning", "./routes/meaning.mjs");
await mountIfExists("/api/healing", "./routes/healing.mjs");

// JSON 404 (important so tests don't get HTML)
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found", path: req.path });
});

export default app;