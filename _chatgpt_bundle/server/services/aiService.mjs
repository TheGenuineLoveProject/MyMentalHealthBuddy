// server/services/aiService.mjs
import OpenAI from "openai";
import { logger } from "../utils/logger.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askAI(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Genuine Love, a warm, compassionate AI wellness companion from The Genuine Love Project. You support users on their journey of self-love, healing, and emotional growth. Respond with empathy, encouragement, and gentle guidance." },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "I'm here with you, but I couldn't think of a reply right now.";

    return reply;
  } catch (err) {
    logger.error("AI service error", { error: err.message });
    return "I'm having trouble thinking right now, but you're not alone. Please try again in a moment.";
  }
}
