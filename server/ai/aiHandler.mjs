// ===== AI EMPLOYEE (REPLIT-SAFE 8888^) =====
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function runAIEmployee(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required." });
    }

    const stream = await client.chat.completions.create({
      model: "gpt-5.1",
      stream: true,
      messages: [
        { role: "system", content: "You are a calming mental-health buddy." },
        { role: "user", content: message }
      ],
    });

    res.setHeader("Content-Type", "text/event-stream");

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || "";
      res.write(`data: ${token}\n\n`);
    }

    res.end();

  } catch (err) {
    console.error("AI Employee error:", err);
    res.status(500).json({ error: "AI error" });
  }
}