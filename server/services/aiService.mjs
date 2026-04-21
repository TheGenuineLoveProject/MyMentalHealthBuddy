// server/services/aiService.mjs
// Thin shim — delegates to canonical client at server/utils/aiClient.mjs
import { chatCompletion } from "../utils/aiClient.mjs";

const SYSTEM_PROMPT =
  "You are Genuine Love, a warm, compassionate AI wellness companion from " +
  "The Genuine Love Project. You support users on their journey of self-love, " +
  "healing, and emotional growth. Respond with empathy, encouragement, and " +
  "gentle guidance. Never diagnose. Never claim to be a therapist.";

const FALLBACK =
  "I'm having trouble thinking right now, but you're not alone. " +
  "Please try again in a moment.";

export async function askAI(message) {
  const result = await chatCompletion({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: String(message || "") },
    ],
    model: "gpt-4o-mini",
  });

  if (result.success && result.content) return result.content;
  return FALLBACK;
}
