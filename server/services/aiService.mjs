// server/services/aiService.mjs
import OpenAI from "openai";

// Create OpenAI client using your API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Ask the AI a question and get a text reply.
 * @param {string} message - User's message to send to the AI.
 * @returns {Promise<string>} - The AI's reply text.
 */
export async function askAI(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a warm, supportive mental health buddy." },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "I’m here with you, but I couldn’t think of a reply right now.";

    return reply;
  } catch (err) {
    console.error("AI service error:", err);
    return "I’m having trouble thinking right now, but you’re not alone. Please try again in a moment.";
  }
}