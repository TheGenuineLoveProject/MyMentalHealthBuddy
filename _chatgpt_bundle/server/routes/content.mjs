// server/routes/content.mjs
// AI + Content Delivery Routes (Protected)

import express from 'express';
import { authGuard } from '../middleware/auth.mjs';

const router = express.Router();

// Example: protected content feed
router.get('/feed', authGuard, async (req, res) => {
  res.status(200).json({
    ok: true,
    content: [
      { id: 1, title: 'Daily Healing', type: 'article' },
      { id: 2, title: 'Breathing Exercise', type: 'audio' },
    ],
  });
});

// Example: protected journals feed
router.get('/my-content', authGuard, async (req, res) => {
  res.status(200).json({
    ok: true,
    user: req.user,
    message: 'Protected content route is working.',
  });
});

export default router;