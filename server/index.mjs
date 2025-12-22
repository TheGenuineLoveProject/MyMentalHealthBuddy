import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildSessionMiddleware } from './middleware/session.mjs';

import authRouter from './routes/auth.mjs';
import blogRouter from './routes/blog.mjs';
import journalRouter from './routes/journal.mjs';
import moodRouter from './routes/mood.mjs';
import healthRouter from './routes/health.mjs';

import process from "node:process";

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server listening on http://${HOST}:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} already in use. Shutting down cleanly.`);
    process.exit(1);
  } else {
    throw err;
  }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.DATABASE_URL) {
  console.error("❌ DEPLOY BLOCKED: DATABASE_URL is missing in production. Add it in Replit Deploy Secrets.");
  process.exit(1);
}

const sessionStore =
  isProduction && process.env.DATABASE_URL
    ? new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: "user_sessions",
        createTableIfMissing: true,
      })
    : undefined;
// Trust proxy for secure cookies behind load balancer (Autoscale)
app.set('trust proxy', 1);

// --- basic middleware ---
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// --- sessions (MemoryStore in dev; Postgres store in production) ---
app.use(buildSessionMiddleware());

// --- API routes ---
app.use('/api/auth', authRouter);
app.use('/api/blog', blogRouter);
app.use('/api/journal', journalRouter);
app.use('/api/mood', moodRouter);
app.use('/api/health', healthRouter);

// --- health ---
app.get('/health', (_req, res) => res.json({ ok: true, app: 'The Genuine Love Project' }));

// --- serve Vite build ---
const distPath = join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (_req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

const PORT = Number(process.env.PORT ?? 5000);
const HOST = process.env.HOST ?? "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`✅ Server listening on http://${HOST}:${PORT}`);
});