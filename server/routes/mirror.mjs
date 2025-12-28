import express from "express";
import { ensureDisclaimer } from "../utils/safetyCheck.mjs";
import { mirrorRateLimit } from "../middleware/rateLimit.mjs";

const router = express.Router();

// Apply gentle rate limiting
router.use(mirrorRateLimit);

const DISCLAIMER = {
  title: "Gentle Mirror",
  note: "This is a reflection tool for journaling support, not medical advice or diagnosis. If you feel unsafe, please seek immediate help.",
};

router.post("/", async (req, res) => {
  const startTime = Date.now();
  const requestId = req.requestId || "-";
  
  try {
    const text = String(req.body?.text ?? "").trim();
    const enableAI = Boolean(req.body?.enableAI);
    const permission = Boolean(req.body?.permission);

    if (!text) {
      return res.status(400).json({ ok: false, error: "Text is required." });
    }

    if (!enableAI) {
      const lines = text.split("\n").map(s => s.trim()).filter(Boolean);
      const snippet = lines.slice(0, 3).join("\n");

      let reflection =
        `Here's what I hear in your words:\n\n` +
        `${snippet}\n\n` +
        `If you'd like, you can choose one sentence you want to be truer tomorrow.`;

      reflection = ensureDisclaimer(reflection);

      return res.json({
        ok: true,
        reflection,
        mode: "local",
        disclaimer: DISCLAIMER,
      });
    }

    if (!permission) {
      return res.json({
        ok: true,
        askingPermission: true,
        message:
          "AI reflection is optional. Do you want a gentle AI reflection (not advice, not diagnosis)?",
        mode: "permission",
        disclaimer: DISCLAIMER,
      });
    }

    let aiReflection =
      "Thank you for trusting this space. What you wrote matters. What feels like the smallest next kind step you can take for yourself today?";

    aiReflection = ensureDisclaimer(aiReflection);

    return res.json({
      ok: true,
      reflection: aiReflection,
      mode: "ai_stub",
      disclaimer: DISCLAIMER,
    });
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`[ERROR] [${requestId}] MIRROR_ERROR duration=${duration}ms:`, err.message);
    return res.status(500).json({ ok: false, error: "Mirror failed." });
  }
});

export default router;
