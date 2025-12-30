import express from 'express';
import cors from 'cors';

import authRoutes from '../server/routes/auth.mjs';
import moodRoutes from '../server/routes/mood.mjs';
import journalRoutes from '../server/routes/journal.mjs';
import aiRoutes from '../server/routes/ai.mjs';

export function createTestApp() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  app.use('/api/auth', authRoutes);
  app.use('/api/mood', moodRoutes);
  app.use('/api/journal', journalRoutes);
  app.use('/api/ai', aiRoutes);
  
  app.use((err, req, res, _next) => {
    console.error('[Test Error]', err);
    res.status(500).json({ ok: false, message: err.message });
  });
  
  return app;
}
