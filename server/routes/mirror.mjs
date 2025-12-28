import express from "express";
import { ensureDisclaimer } from "../utils/safetyCheck.mjs";

const router = express.Router();

/**
 * POST /api/mirror
 * Safe baseline: mirrors the user's words (no diagnosis, no advice).
 * Optional: enableAI flag can be used later, but keep baseline safe.
 */
router.post("/mirror", async (req, res) => {
  try {
    const { text = "", enableAI = false } = req.body || {};

    // Safety + disclaimer gate (must NOT be declared twice anywhere)
    const disclaimer = ensureDisclaimer({ feature: "mirror" });

    const clean = String(text || "").trim();
    if (!clean) {
      return res.status(400).json({
        ok: false,
        error: "Please write something first.",
        disclaimer,
      });
    }

    // LOCAL SAFE MIRROR (no AI, no therapy)
    const reflection =
      "Here is what I hear in your words:\n\n" +
      clean +
      "\n\nIf you want, what part of this feels most important right now?";

    return res.json({
      ok: true,
      reflection,
      usedAI: false,
      disclaimer,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Mirror failed.",
    });
  }
});

export default router;