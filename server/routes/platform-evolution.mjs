// server/routes/platform-evolution.mjs
// Platform Evolution Control Tool v1 — admin-gated, AUDIT-ONLY endpoint.
// Surfaces server/lib/platformEvolution.mjs static governance scan.
// Read-only: GET only, no mutation routes by design.

import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { runPlatformEvolutionAudit } from "../lib/platformEvolution.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

// Defense in depth: self-apply auth+admin even though app.mjs also wraps the mount.
router.use(requireAuth);
router.use(requireAdmin);

router.get("/status", async (_req, res) => {
  try {
    const report = await runPlatformEvolutionAudit();
    return res.json({ ok: true, ...report });
  } catch (err) {
    logger?.error?.("[platform-evolution] audit failed", err);
    return res.status(500).json({ ok: false, error: "Audit failed", detail: err?.message || String(err) });
  }
});

export default router;
