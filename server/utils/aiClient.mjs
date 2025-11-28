// server/utils/aiClient.mjs
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "";

if (!apiKey) {
  console.warn("[AI] OPENAI_API_KEY is not set. AI features will be disabled.");
}

const client = apiKey ? new OpenAI({ apiKey }) : null;

/**
 * Simple non-streaming AI helper for therapy-style messages.
 * messages = [{ role: "user" | "system" | "assistant", content: "..." }, ...]
 */
export async function sendTherapyMessage({ messages, userId = "anonymous" }) {
  if (!client) {
    return {
      ok: false,
      error: "AI not configured (missing OPENAI_API_KEY)",
      message: "AI is currently unavailable."
    };
  }

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages,
    temperature: 0.7,
    max_tokens: 700,
    user: userId
  });

  const text = response.choices?.[0]?.message?.content || "";

  return {
    ok: true,
    message: text,
    raw: response
  };
}