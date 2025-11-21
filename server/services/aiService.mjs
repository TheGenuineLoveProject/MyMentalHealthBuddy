import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askAI(message) {
  try {
    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-5.1",
      messages: [
        { role: "system", content: process.env.AI_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    return {
      ok: true,
      reply: completion.choices[0].message.content,
    };

  } catch (err) {
    console.error("AI Error:", err);

    return {
      ok: false,
      reply:
        "I’m here with you. Something went wrong on my side, but you’re safe. Let’s try again gently.",
    };
  }
}
