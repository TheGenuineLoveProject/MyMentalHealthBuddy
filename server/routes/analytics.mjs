import { Router } from 'express';
const r = Router();

// stub snapshot model
const FAKE_SNAPSHOTS = [
  { id: 1, date: new Date().toISOString(), metrics: { DAU: 123, EngagementScore: 96 } }
];

r.get('/snapshots', async (_req,res) => {
  try { res.json(FAKE_SNAPSHOTS); }
  catch(err){ console.error('analytics snapshots error', err); res.status(500).json({error:'snapshots failed'}); }
});

r.post('/snapshot', async (req,res) => {
  try {
    const item = { id: Date.now(), date: new Date().toISOString(), metrics: req.body?.metrics||{} };
    FAKE_SNAPSHOTS.push(item);
    res.status(201).json(item);
  } catch(err){ console.error('analytics save error', err); res.status(500).json({error:'save failed'}); }
});

export default r;
