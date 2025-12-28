import { Router } from 'express';
import { getDailyInsight } from '../insights/daily.mjs';

const router = Router();

router.get('/daily', (_req, res) => {
  res.json({ insight: getDailyInsight() });
});

export default router;
