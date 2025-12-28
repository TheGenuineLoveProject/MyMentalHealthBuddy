import express from "express";
import { ensureDisclaimer } from "../utils/safetyCheck.mjs";

const router = express.Router();

/**
 * POST /api/mirror
 * Body: { text: string, enableAI?: boolean, permission?: boolean }
 *
 * - If enableAI is false (or missing): returns a SAFE local reflection (no AI).
 * - If enableAI is true:
 *    - If permission !== true: asks for consent first.
 *    - If permission === true: (placeholder) you can call your AI safely later.
 */
router.post("/", async (req, res) => {
  try {
    // 1) Basic input
    const text = String(req.body?.text ?? "").trim();
    const enableAI = Boolean(req.body?.enableAI);
    const permission = Boolean(req.body?.permission);

    if (!text) {
      return res.status(400).json({ ok: false, error: "Text is required." });
    }

    // 2) Always attach disclaimer (non-clinical, non-diagnostic)
    const disclaimer = ensureDisclaimer?.() ?? {
      title: "Gentle Mirror",
      note: "This is not medical advice or diagnosis. If you feel unsafe, please seek immediate help.",
    };

    // 3) SAFE LOCAL MIRROR (default)
    if (!enableAI) {
      const lines = text.split("\n").map(s => s.trim()).filter(Boolean);
      const snippet = lines.slice(0, 3).join("\n");

      const reflection =
        `Here’s what I hear in your words:\n\n` +
        `${snippet}\n\n` +
        `If you’d like, you can choose one sentence you want to be truer tomorrow.`;

      return res.json({
        ok: true,
        reflection,
        mode: "local",
        disclaimer,
      });
    }

    // 4) AI requested — require explicit consent
    if (!permission) {
      return res.json({
        ok: true,
        askingPermission: true,
        message:
          "AI reflection is optional. Do you want a gentle AI reflection (not advice, not diagnosis)?",
        mode: "permission",
        disclaimer,
      });
    }

    // 5) AI reflection placeholder (wire later)
    // For now, return a safe, non-AI fallback so endpoint works.
    const aiReflection =
      "Thank you for trusting this space. What you wrote matters. What feels like the smallest next kind step you can take for yourself today?";

    return res.json({
      ok: true,
      reflection: aiReflection,
      mode: "ai_stub",
      disclaimer,
    });
  } catch (err) {
    console.error("MIRROR_ERROR:", err);
    return res.status(500).json({ ok: false, error: "Mirror failed." });
  }
});

export default router;