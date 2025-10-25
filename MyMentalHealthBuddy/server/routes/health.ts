import type { Router } from 'express';

export default function mountHealth(r: Router) {
  r.get('/health', (_req, res) => {
    res.setHeader('x-app', 'mhb');
    res.json({ ok: true, service: 'mhb-server', time: new Date().toISOString() });
  });
}