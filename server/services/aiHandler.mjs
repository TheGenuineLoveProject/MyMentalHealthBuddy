// server/services/aiHandler.mjs
// Thin wrapper for routes — delegates to canonical client.
import { chatCompletion } from "../utils/aiClient.mjs";
import { askAI } from "./aiService.mjs";
import { logger } from "../utils/logger.mjs";

const MAX_INPUT_LENGTH = 4000;
const SYSTEM_PROMPT_DEFAULT =
  process.env.AI_SYSTEM_PROMPT ||
  "You are a calming mental-health buddy. Validate feelings, do not diagnose.";

export async function handleAIChat(message) {
  return askAI(message);
}

export default { handleAIChat };

export async function runAIEmployee(req, res) {
  const message = String(req.body?.message || "").trim();

  if (!message) {
    return res.status(400).json({ error: "Message required." });
  }
  if (message.length > MAX_INPUT_LENGTH) {
    return res
      .status(400)
      .json({ error: `Message too long (max ${MAX_INPUT_LENGTH} chars).` });
  }

  const result = await chatCompletion({
    messages: [
      { role: "system", content: SYSTEM_PROMPT_DEFAULT },
      { role: "user", content: message },
    ],
    model: process.env.AI_MODEL || "gpt-4o-mini",
  });

  if (result.success) {
    logger.info("AI-Employee ok", {
      route: "/runAIEmployee",
      tokens: result.usage?.total_tokens || null,
      length: result.content?.length || 0,
    });
    return res.json({ ok: true, reply: result.content });
  }

  logger.warn("AI-Employee failed", {
    route: "/runAIEmployee",
    error: result.error,
    isCircuitOpen: !!result.isCircuitOpen,
  });
  return res.status(503).json({
    ok: false,
    error: result.error || "AI unavailable",
    fallback:
      "I'm having a hard time right now. Please try again in a moment.",
    isCircuitOpen: !!result.isCircuitOpen,
  });
}
