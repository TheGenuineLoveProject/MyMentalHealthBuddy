import express from "express";

const router = express.Router();

/**
 * Placeholder route: keeps imports from breaking until Figma integration is added.
 * Later you can add:
 * - OAuth flow
 * - token storage
 * - fetch file nodes
 * - export images/styles
 */
router.get("/health", (req, res) => {
  res.json({ ok: true, service: "figma", status: "placeholder" });
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