import express from "express";

const router = express.Router();

// Placeholder route (keeps the platform stable even if Figma is not configured yet)
router.get("/status", (req, res) => {
  res.json({
    ok: true,
    feature: "figma",
    status: "placeholder",
    note: "Figma integration is not enabled yet.",
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "figma", status: "operational", timestamp: new Date().toISOString() });
});

export default router;