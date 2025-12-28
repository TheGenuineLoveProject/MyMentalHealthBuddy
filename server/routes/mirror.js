import express from "express";

const router = express.Router();

/**
 * SAFETY: This endpoint does NOT diagnose, does NOT advise, does NOT interpret.
 * It only mirrors the user's own language + offers gentle reflection questions.
 */
function safeMirrorLocal(text = "") {
  const clean = String(text || "").trim().slice(0, 6000);

  // Very small local mirror (no AI). We can swap to AI later.
  const firstLines = clean
    .split(/\n+/)
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join("\n");

  const questions = [
    "What feels most important in what you wrote?",
    "What do you want to feel more of—just a little—this week?",
    "If you could offer yourself kindness here, what would it sound like?",
    "What is one tiny step that would feel respectful to you today?"
  ];

  return {
    mirror:
      (firstLines ? `Here is what I hear in your words:\n\n${firstLines}` : "I’m here with you.") +
      "\n\nIf you want, you can reflect on one of these questions:\n" +
      questions.map(q => `• ${q}`).join("\n"),
    questions,
    meta: {
      mode: "local_safe_mirror",
      truncated: clean.length >= 6000
    }
  };
}

router.post("/mirror", async (req, res) => {
  try {
    const { text, enableAI } = req.body || {};

    // AI is OPTIONAL and OFF by default.
    // If enableAI is true, we still keep behavior bounded (we’ll wire OpenAI later).
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Missing text." });
    }

    // For now: always local mirror (safe baseline).
    const result = safeMirrorLocal(text);

    res.json({
      ok: true,
      enableAI: Boolean(enableAI),
      ...result
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Mirror failed." });
  }
});

export default router;
