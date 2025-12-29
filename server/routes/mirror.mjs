// server/routes/mirror.mjs
import express from "express";

const router = express.Router();

/**
 * Gentle fallback mirror that ALWAYS returns something helpful.
 * Not therapy, not diagnosis. Journaling support only.
 */
function safeTrim(s) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function clamp(s, n = 900) {
  const t = safeTrim(s);
  return t.length > n ? t.slice(0, n).trimEnd() + "…" : t;
}

function buildLocalReflection(inputRaw) {
  const input = clamp(inputRaw, 420);

  const lines = [
    `Here’s a gentle mirror of what I’m hearing:`,
    ``,
    `• You shared: "${input}"`,
    ``,
    `It makes sense to feel this way — your system is trying to protect you.`,
    `You don’t have to fix everything right now. One kind step is enough.`,
    ``,
    `Try this next (pick ONE):`,
    `1) Take 3 slow breaths (inhale 4, exhale 6).`,
    `2) Write one honest sentence: “Right now I feel ___ and I need ___.”`,
    `3) Place a hand on your chest and say: “I’m here. I can take one kind step.”`,
    ``,
    `A gentle question:`,
    `If the part of you that feels this way could speak without being judged, what would it say?`,
  ];

  return lines.join("\n");
}

/**
 * Optional AI mode.
 * - If OPENAI_API_KEY is missing OR request fails => fallback to local reflection.
 * - This keeps your UI stable 100% of the time.
 */
async function tryAiReflection(text) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  // Keep it simple and safe. Use your own internal endpoint if you have one.
  // This implementation uses a generic fetch call; if you already have an OpenAI wrapper,
  // swap this out to your project’s helper.
  try {
    const prompt = [
      `You are a gentle journaling reflection tool.`,
      `Do NOT provide medical advice or diagnosis.`,
      `Be warm, grounded, and practical.`,
      `Return 6–10 lines max.`,
      ``,
      `User text: ${JSON.stringify(text)}`,
    ].join("\n");

    // If you already have an internal AI route, replace this whole block with that call.
    // Otherwise: fallback immediately (return null) so the system is never blocked.
    // (Leaving this as "null" by default is safest for stability.)
    return null;

    // Example (ONLY if you have a known working provider in your app):
    // const res = await fetch("https://api.openai.com/v1/responses", { ... })
    // const data = await res.json()
    // return data.output_text ?? null
  } catch {
    return null;
  }
}

router.post("/", async (req, res) => {
  try {
    const text = safeTrim(req.body?.text);

    if (text.length < 10) {
      return res.status(400).json({
        ok: false,
        error: "Please write a little more (at least ~10 characters).",
        mode: "validation",
        title: "Gentle Mirror",
        note: "Journaling support only — not medical advice.",
      });
    }

    // 1) Try AI (optional)
    const ai = await tryAiReflection(text);

    // 2) Always fallback if AI not available
    const reflection = ai || buildLocalReflection(text);
    const mode = ai ? "ai" : "local_fallback";

    return res.json({
      ok: true,
      reflection,
      mode,
      title: "Gentle Mirror",
      note: "Journaling support only — not medical advice.",
    });
  } catch (e) {
    // Absolute last-resort fallback
    return res.json({
      ok: true,
      reflection: buildLocalReflection(req.body?.text),
      mode: "local_fallback",
      title: "Gentle Mirror",
      note: "Journaling support only — not medical advice.",
    });
  }
});

export default router;