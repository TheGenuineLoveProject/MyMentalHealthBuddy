import express from "express";

const router = express.Router();

/**
 * Placeholder Figma route
 * - Keeps imports stable
 * - Lets you add real Figma integration later
 */
router.get("/figma/health", (_req, res) => {
  res.json({ ok: true, feature: "figma", status: "placeholder" });
});

router.get("/figma", (_req, res) => {
  res.status(501).json({
    ok: false,
    message: "Figma integration not enabled yet.",
    next: [
      "Add FIGMA_ACCESS_TOKEN to Secrets",
      "Add a real route that reads Figma files and returns design tokens"
    ]
  });
});

export default router;