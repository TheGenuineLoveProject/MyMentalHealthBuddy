import { Router } from "express";
import { z } from "zod";

const router = Router();

const Body = z.object({
  message: z.string().min(1).max(6000),
  mode: z.enum(["support", "journaling", "coping", "crisis"]).default("support")
});

function isCrisisLike(text) {
  const t = text.toLowerCase();
  return (
    t.includes("suicide") ||
    t.includes("kill myself") ||
    t.includes("end my life") ||
    t.includes("hurt myself")
  );
}

router.post("/", async (req, res) => {
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { message, mode } = parsed.data;

  if (mode === "crisis" || isCrisisLike(message)) {
    return res.json({
      type: "crisis",
      title: "You deserve support right now",
      message:
        "If you’re in immediate danger or thinking about harming yourself, please call your local emergency number now.\n\nUS/Canada: Call or text 988.\nUK/Ireland: Samaritans 116 123.\nAustralia: Lifeline 13 11 14.\n\nIf you want, tell me your country and I’ll show options."
    });
  }

  // Hook your OpenAI route/service here (keep it gentle + not medical advice)
  return res.json({
    type: "support",
    message:
      "I’m here with you. Would you like to talk about what happened, what you’re feeling in your body, or what you need most right now?"
  });
});

export default router;