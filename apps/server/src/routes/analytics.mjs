import { Router } from 'express';
const r = Router();

// Tiny in-memory snapshots (replace with DB reads)
const snapshots = [];
r.get('/snapshots', (req,res)=> res.json(snapshots));
r.post('/snapshots', expressJsonGuard, (req,res)=>{
  const s = { at: Date.now(), ...req.body };
  snapshots.push(s);
  res.status(201).json(s);
});
r.get('/kpis', (req,res)=> res.json({ DAU: 0, ActiveUsers: 0, EngagementScore: 0 }));

function expressJsonGuard(req,res,next){ return next(); } // placeholder for raw-body collisions
export default r;
