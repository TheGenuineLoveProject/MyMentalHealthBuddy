import { Router } from "express";
const router = Router();

// Fake in-memory snapshots
const FAKE_SNAPSHOTS = [
  {
    id: 1,
    date: new Date().toISOString(),
    metrics: { DAU: 123, EngagementScore: 96 }
  }
];

// GET all snapshots
router.get("/snapshots", (req, res) => {
  try {
    res.json(FAKE_SNAPSHOTS);
  } catch (err) {
    console.error("analytics-load-error", err);
    res.status(500).json({ error: "snapshots-failed" });
  }
});

// POST new snapshot
router.post("/snapshots", (req, res) => {
  try {
    const item = {
      id: Date.now(),
      date: new Date().toISOString(),
      metrics: req.body?.metrics || {}
    };

    FAKE_SNAPSHOTS.push(item);
    res.status(201).json(item);
  } catch (err) {
    console.error("analytics-save-error", err);
    res.status(500).json({ error: "save-failed" });
  }
});

export default router;