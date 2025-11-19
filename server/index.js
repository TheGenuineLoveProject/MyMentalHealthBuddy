// -------------------------
// AI Chat Route
// -------------------------
import OpenAI from "openai";
import cors from "cors";
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.json({ reply: "I'm here with you — tell me anything 💚" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are MyMentalHealthBuddy, a supportive, gentle, trauma-informed emotional companion. Always respond with empathy and calm encouragement."
        },
        { role: "user", content: message }
      ]
    });

    const aiResponse =
      completion.choices?.[0]?.message?.content ||
      "I’m here for you. Try again? 💚";

    res.json({ reply: aiResponse });
  } catch (err) {
    console.error("AI error:", err);
    res.json({
      reply:
        "I'm here for you. Something went wrong accessing my tools — try again? 💚"
    });
  }
});