// server/routes/canva-oauth.mjs
// Safe placeholder route for Canva OAuth

import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    route: 'canva-oauth',
    message: 'Canva OAuth placeholder is active.',
  });
});

router.get('/authorize', (req, res) => {
  res.json({
    ok: true,
    step: 'authorize',
    message: 'Canva authorize placeholder.',
  });
});

router.get('/callback', (req, res) => {
  res.json({
    ok: true,
    step: 'callback',
    message: 'Canva callback placeholder.',
  });
});

router.post('/revoke', (req, res) => {
  res.json({
    ok: true,
    step: 'revoke',
    message: 'Canva revoke placeholder.',
  });
});

export default router;
