// server/routes/canva-oauth.mjs
// Safe placeholder route so imports never break.
// This keeps backend 1000% stable even if Canva OAuth is not implemented yet.

import express from 'express';

const router = express.Router();

// 1. Health check – used only to verify route is wired correctly.
router.get('/health', (req, res) => {
  res.json({
    ok: true,
    route: 'canva-oauth',
    message: 'Canva OAuth placeholder is active (mock only).',
  });
});

// 2. Authorization endpoint (mock)
router.get('/authorize', (req, res) => {
  res.json({
    ok: true,
    step: 'authorize',
    message: 'Canva authorize placeholder – real OAuth not configured yet.',
  });
});

// 3. Callback endpoint (mock)
router.get('/callback', (req, res) => {
  res.json({
    ok: true,
    step: 'callback',
    message: 'Canva callback placeholder – real OAuth not configured yet.',
  });
});

// 4. Revoke endpoint (mock)
router.post('/revoke', (req, res) => {
  res.json({
    ok: true,
    step: 'revoke',
    message: 'Canva revoke placeholder – real OAuth not configured yet.',
  });
});

export default router;