// -------------------------
// AI Chat Route
// -------------------------
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.json({ reply: "I'm here — tell me anything 💚" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are MyMentalHealthBuddy, a gentle, trauma-informed supportive companion. Always respond with empathy."
        },
        { role: "user", content: message }
      ]
    });

    const aiResponse =
      completion.choices?.[0]?.message?.content ||
      "I'm here with you — please try again 💚";

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("AI backend error:", error);
    res.json({
      reply: "Hmm… I couldn’t process that. But I'm still right here for you 💚"
    });
  }
});