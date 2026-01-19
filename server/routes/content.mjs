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

export const contentRouter = express.Router();

/**
 * GET /api/content/formats
 * Returns available content formats.
 */
contentRouter.get("/formats", (req, res) => {
  return res.status(200).json({
    ok: true,
    formats: [
      "daily_post",
      "blog_post",
      "carousel",
      "short_video_script",
      "email_newsletter",
      "affirmation_pack",
      "journal_prompt_pack",
    ],
  });
});

/**
 * POST /api/content/generate
 * Minimal working endpoint to satisfy tests + enable future AI generation.
 */
contentRouter.post("/generate", express.json(), async (req, res) => {
  const { format = "daily_post", topic = "Genuine Love", tone = "warm" } = req.body || {};

  // Minimal “working now” generation (safe fallback)
  const output = {
    format,
    title: `${topic} — ${format.replaceAll("_", " ")}`,
    tone,
    body:
      `Today, choose one small act of genuine love.\n` +
      `Breathe. Notice your body. Speak gently to yourself.\n` +
      `Then take one brave, kind step in the direction you know is true.`,
  };

  return res.status(200).json({ ok: true, output });
});