// ---------------------------------------------
// GPT-5 Streaming AI Route — Trauma-Informed Buddy
// ---------------------------------------------
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/ai-stream", async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const { message, mood } = req.body;

    const stream = await openai.chat.completions.create({
      model: "gpt-5", // GPT-5 therapeutic model
      stream: true,
      messages: [
        {
          role: "system",
          content: `
You are MyMentalHealthBuddy GPT-5 — a trauma-informed, deeply empathic emotional companion.

Rules:
• Respond gently, slowly, and with warm attunement.
• Validate feelings before offering guidance.
• Use grounding tools (slow breath cues, vagus nerve soothing).
• Avoid clinical claims, diagnoses, or medical directives.
• If user expresses harm, gently guide them to call 988.

Mood tuning:
If mood = "sad" → comfort softly.
If mood = "anxious" → regulate breathing (3-3-6), reassure safety.
If mood = "angry" → acknowledge hurt without judgment.
If mood = "lonely" → affirm presence and connection.
        `,
        },
        { role: "user", content: message },
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices?.[0]?.delta?.content;
      if (text) {
        res.write(`data: ${text}\n\n`);
      }
    }

    res.end();
  } catch (err) {
    console.error("GPT-5 stream error:", err);
    res.write(`data: I'm here with you. Something went wrong.\n\n`);
    res.end();
  }
});