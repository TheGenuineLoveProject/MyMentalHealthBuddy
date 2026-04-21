// server/services/aiClient.mjs
// Thin shim — delegates to canonical client at server/utils/aiClient.mjs
import { chatCompletion } from "../utils/aiClient.mjs";

const FALLBACK_TEXT =
  "I'm having trouble responding right now. Please try again shortly.";

export async function safeAIResponse(messages) {
  const result = await chatCompletion({ messages });

  if (result.success) {
    return { ok: true, text: result.content || "" };
  }

  return {
    ok: false,
    error: result.error || "AI unavailable",
    fallback: FALLBACK_TEXT,
    isCircuitOpen: !!result.isCircuitOpen,
  };
}
