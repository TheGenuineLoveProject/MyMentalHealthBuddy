import { Router } from "express";
import { requireAuth } from "../middleware/auth.mjs";
import OpenAI from "openai";
import { checkResponseSafety, sanitizeAIResponse, ensureDisclaimer } from "../utils/safetyCheck.mjs";

const router = Router();

const MIRROR_SYSTEM_PROMPT = `You are a gentle mirror for journaling. Your role is to reflect the user's words back to them without interpretation, advice, or diagnosis.

MANDATORY RULES:
1. NEVER give advice or tell the user what to do
2. NEVER diagnose or label their experience
3. NEVER interpret meaning beyond what they explicitly wrote
4. NEVER use words like "should", "must", "need to", "have to"
5. ALWAYS ask permission before offering any reflection
6. ALWAYS include the disclaimer at the end

Your responses should:
- Summarize or rephrase what the user wrote
- Highlight themes THEY already expressed
- Use tentative language: "You might notice...", "One way to describe what you wrote is...", "It seems like you mentioned..."
- Be brief and gentle

Always end with:
"Please ignore anything that doesn't feel accurate or helpful. You know yourself best."`;

const REFLECTION_PROMPT = `Here is a gentle reflection of what you wrote.
It may not fully capture your experience — please keep only what feels true to you.

`;

router.post("/reflect", requireAuth, async (req, res) => {
  try {
    const { text, permission } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ ok: false, message: "Text is required" });
    }

    if (!permission) {
      return res.json({
        ok: true,
        askingPermission: true,
        message: "Would you like a gentle reflection of what you wrote? This is completely optional — your words are valuable as they are.",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        ok: true,
        reflection: REFLECTION_PROMPT + "Your words carry their own meaning. Sometimes simply writing is enough.\n\nPlease ignore anything that doesn't feel accurate or helpful. You know yourself best.",
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: MIRROR_SYSTEM_PROMPT },
        { role: "user", content: `Please provide a gentle, non-directive reflection of this journal entry:\n\n"${text}"` },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    let reflection = completion.choices[0]?.message?.content || 
      "Your words hold their own meaning. Sometimes the act of writing is the insight itself.";

    const safetyResult = checkResponseSafety(reflection);
    if (!safetyResult.passes) {
      console.warn("Mirror response safety check failed:", safetyResult.violations);
      reflection = sanitizeAIResponse(reflection);
    }
    
    reflection = ensureDisclaimer(reflection);

    res.json({
      ok: true,
      reflection: REFLECTION_PROMPT + reflection,
    });
  } catch (err) {
    console.error("Mirror reflection error:", err);
    res.json({
      ok: true,
      reflection: REFLECTION_PROMPT + "Your words carry their own meaning. Sometimes simply writing is enough.\n\nPlease ignore anything that doesn't feel accurate or helpful. You know yourself best.",
    });
  }
});

export default router;
