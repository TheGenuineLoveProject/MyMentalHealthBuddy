import express from "express";
const router = express.Router();

router.get("/snapshots", (req, res) => {
  const now = new Date().toISOString();
  const analytics = [
    { id: 1, metric: "Active Users", value: 122, timestamp: now },
    { id: 2, metric: "Mood Improvement", value: 93, timestamp: now },
    { id: 3, metric: "Engagement Score", value: 98, timestamp: now },
  ];
  res.json({ success: true, analytics });
});

export default router;
