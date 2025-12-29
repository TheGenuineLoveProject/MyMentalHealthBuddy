// server/routes/mirror.mjs
import express from "express";
import { ensureDisclaimer } from "../utils/safetyCheck.mjs";
import { mirrorRateLimit } from "../middleware/rateLimit.mjs";
const router = express.Router();

/**
 * Always-works Mirror endpoint.
 * - Accepts: { text: string }
 * - Returns: { ok, reflection, mode, title, note }
 * - Uses AI if available (optional). Falls back to local reflection ALWAYS.
 *
 * NOTE: This is journaling support, not medical advice.
 */

const DISCLAIMER =
  "Journaling support only — not medical advice or diagnosis. If you feel unsafe or at risk of harming yourself or someone else, seek immediate help (local emergency services).";

function safeTrim(s) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function clamp(s, max = 1400) {
  const t = String(s ?? "");
  return t.length > max ? t.slice(0, max) : t;
}

function localMirror(text) {
  const t = safeTrim(text);

  // Simple, compassionate, non-clinical reflection template
  const firstLine = t.split("\n").map((x) => x.trim()).filter(Boolean)[0] || t;

  return [
    "Here’s what I’m hearing (gently):",
    "",
    `• You’re carrying: ${clamp(firstLine, 180)}`,
    "• This makes sense — feelings are information, not a verdict.",
    "",
    "A kinder reframe:",
    "• “I’m having a human moment. I can take one small step with care.”",
    "",
    "One tiny next step (2 minutes):",
    "• Take 5 slow breaths (inhale 4, exhale 6), then write ONE honest sentence: “Right now I need ____.”",
    "",
    "If you want, add:",
    "• What happened right before this feeling showed up?",
    "• What would feel 5% safer or lighter in the next hour?",
  ].join("\n");
}

// Optional AI helper.
// This tries to use a project-provided AI util if it exists,
// otherwise it will always fall back to localMirror.
async function tryAIMirror(text) {
  // If you already have an OpenAI helper somewhere, wire it here.
  // We keep this defensive so NOTHING breaks if AI isn't configured.
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!apiKey) return null;

  // ✅ Safe: dynamic import only if file exists in your project.
  // If it doesn't exist, we catch and return null.
  try {
    // Example: if you have something like server/lib/openai.mjs exporting a function:
    // export async function generateMirrorReflection({ text }) { ... }
    const mod = await import("../lib/openai.mjs");
    if (typeof mod.generateMirrorReflection === "function") {
      const aiText = await mod.generateMirrorReflection({ text });
      return safeTrim(aiText);
    }
  } catch {
    // ignore; fallback will handle
  }

  // If no AI module wired, return null so local fallback runs.
  return null;
}

router.post("/", async (req, res) => {
  try {
    const input = safeTrim(req.body?.text);

    if (!input || input.length < 3) {
      return res.status(400).json({
        ok: false,
        error: "Missing text. Please write a bit more.",
        note: DISCLAIMER,
      });
    }

    // Try AI first (optional), otherwise fallback always.
    const ai = await tryAIMirror(input);
    const reflection = ai || localMirror(input);

    return res.json({
      ok: true,
      title: "Gentle Mirror",
      mode: ai ? "ai" : "local",
      reflection,
      note: DISCLAIMER,
    });
  } catch (e) {
    // Even here: return a valid reflection instead of failing hard.
    const fallback = localMirror(req.body?.text || "");
    return res.status(200).json({
      ok: true,
      title: "Gentle Mirror",
      mode: "local",
      reflection: fallback,
      note: DISCLAIMER,
    });
  }
});

export default router;