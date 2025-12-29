// server/routes/mirror.mjs
import express from "express";

const router = express.Router();

function safeText(v) {
  return String(v ?? "").trim();
}

function clamp(s, n = 2200) {
  const t = safeText(s);
  if (t.length <= n) return t;
  return t.slice(0, n) + "…";
}

function localMirror(text) {
  // Non-medical, supportive, actionable, “gentle mirror”
  const t = clamp(text, 1200);

  const lines = [];
  lines.push("Here’s a gentle mirror of what I’m hearing:");
  lines.push("");
  lines.push(`• You’re carrying: ${summarizeFeeling(t)}`);
  lines.push("• It makes sense to feel this way — your mind is trying to protect you.");
  lines.push("• You don’t have to fix everything right now. One kind step is enough.");
  lines.push("");
  lines.push("Try this next (pick ONE):");
  lines.push("1) Take 3 slow breaths (inhale 4, exhale 6).");
  lines.push("2) Write one honest sentence: “Right now I feel ____ and I need ____.”");
  lines.push("3) Place a hand on your chest and say: “I’m here. I can take one step.”");
  lines.push("");
  lines.push("A gentle question:");
  lines.push("• If the part of you that feels this way could speak without being judged, what would it say?");
  lines.push("");
  lines.push("What you wrote:");
  lines.push(t);

  return lines.join("\n");
}

function summarizeFeeling(text) {
  const t = text.toLowerCase();
  const hits = [];

  const map = [
    ["anxious", ["anxious", "anxiety", "panic", "nervous", "worried", "fear"]],
    ["sad", ["sad", "down", "cry", "grief", "hurt", "lonely"]],
    ["stressed", ["stress", "overwhelmed", "too much", "pressure", "burnout"]],
    ["angry", ["angry", "mad", "furious", "irritated", "resent"]],
    ["tired", ["tired", "exhaust", "sleep", "insomnia", "drained"]],
    ["stuck", ["stuck", "trapped", "blocked", "can’t", "hopeless"]],
  ];

  for (const [label, keys] of map) {
    if (keys.some((k) => t.includes(k))) hits.push(label);
  }

  if (!hits.length) return "a lot at once";
  return hits.slice(0, 3).join(", ");
}

/**
 * Optional AI reflection:
 * - If OPENAI_API_KEY exists and your project already has an OpenAI helper, wire it here.
 * - This file will still work perfectly without AI — it will always fallback to localMirror().
 */
async function tryAIReflection(text) {
  const key = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!key) return null;

  // If your repo already has an OpenAI wrapper, import & use it here.
  // Keeping this route safe: if AI fails, we return null and fallback.
  // Example pseudo:
  // const reflection = await generateMirrorWithOpenAI(text)
  // return reflection

  return null; // <-- leave as null unless you wire your existing OpenAI helper
}

router.post("/", async (req, res) => {
  try {
    const text = safeText(req.body?.text);

    if (!text || text.length < 2) {
      return res.status(400).json({
        ok: false,
        error: "Missing text.",
        reflection: "",
        mode: "local",
        title: "Gentle Mirror",
        note: "Journaling support only — not medical advice.",
      });
    }

    // Try AI if configured, otherwise fallback
    let reflection = null;
    try {
      reflection = await tryAIReflection(text);
    } catch {
      reflection = null;
    }

    if (reflection && String(reflection).trim().length) {
      return res.json({
        ok: true,
        reflection: String(reflection).trim(),
        mode: "ai",
        title: "Gentle Mirror",
        note: "Journaling support only — not medical advice.",
      });
    }

    // Always provide a local reflection
    const local = localMirror(text);
    return res.json({
      ok: true,
      reflection: local,
      mode: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY ? "local_fallback" : "local",
      title: "Gentle Mirror",
      note: "Journaling support only — not medical advice.",
    });
  } catch (e) {
    // Even on errors, still return a local reflection if possible
    const text = safeText(req.body?.text);
    const local = text ? localMirror(text) : "";
    return res.status(200).json({
      ok: true,
      reflection: local || "I’m here with you. Try writing 2–3 honest sentences and press Reflect again.",
      mode: "local_fallback",
      title: "Gentle Mirror",
      note: "Journaling support only — not medical advice.",
    });
  }
});

export default router;