import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
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

async function startDevServer() {
  const app = express();

  // Trust proxy for secure cookies
  app.set('trust proxy', 1);

  // --- basic middleware ---
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

  // --- sessions ---
  app.use(buildSessionMiddleware());

  // --- API routes ---
  app.use('/api/auth', authRouter);
  app.use('/api/blog', blogRouter);
  app.use('/api/journal', journalRouter);
  app.use('/api/mood', moodRouter);
  app.use('/api/health', healthRouter);

  // --- health ---
  app.get('/health', (_req, res) => res.json({ ok: true, app: 'The Genuine Love Project' }));

  // Create Vite server in middleware mode using the config file
  const vite = await createViteServer({
    configFile: join(__dirname, '..', 'vite.config.js'),
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Use Vite's middleware for HMR and serving files
  app.use(vite.middlewares);

  const PORT = Number(process.env.PORT ?? 5000);
  const HOST = process.env.HOST ?? "0.0.0.0";

  const server = app.listen(PORT, HOST, () => {
    console.log(`✅ Dev server listening on http://${HOST}:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} already in use. Shutting down cleanly.`);
      process.exit(1);
    } else {
      throw err;
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    vite.close();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

startDevServer().catch(err => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
