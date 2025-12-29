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

export default router;