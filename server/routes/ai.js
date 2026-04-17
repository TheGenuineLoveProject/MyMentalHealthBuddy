import express from "express";
import OpenAI from "openai";
import { getSession, addMessage } from "../memory/store.mjs";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function detectCrisis(message = "") {
  const text = message.toLowerCase();

  const crisisPatterns = [
    "suicide",
    "kill myself",
    "want to die",
    "end my life",
    "hurt myself",
    "self harm",
    "cut myself",
    "overdose",
    "no reason to live",
    "i should die",
    "i am going to die",
    "i want to disappear",
    "i want to end it",
    "i want to hurt someone",
    "kill them",
    "harm them"
  ];

  return crisisPatterns.some((pattern) => text.includes(pattern));
}

function buildCrisisResponse() {
  return {
    reply:
      "I'm really sorry you're going through this. You deserve immediate support right now. Please contact emergency services now if you're in immediate danger. If you're in the U.S. or Canada, call or text 988 right now for immediate crisis support. If you're elsewhere, contact your local emergency number or nearest crisis line right now. If you can, please tell a trusted person near you immediately and do not stay alone.",
    safety: {
      flagged: true,
      type: "crisis",
      action: "escalate_immediately"
    }
  };
}

function buildSystemPrompt() {
  return `
You are a compassionate, emotionally intelligent, trauma-aware mental wellness support assistant.

Your role:
- provide supportive, calm, nonjudgmental responses
- use light CBT/DBT-informed structure
- help the user name feelings, slow down, and choose one small next step
- keep responses clear, warm, and practical
- do not diagnose
- do not claim to be a therapist
- do not provide medical advice
- do not mention pricing, subscriptions, products, or monetization
- do not overwhelm the user
- if the user sounds distressed, prioritize grounding, validation, and emotional safety

Response style:
1. validate the feeling
2. briefly reflect what may be happening
3. offer one small coping step
4. end with one gentle follow-up question

Keep responses concise but human.
`.trim();
}

router.post("/chat", async (req, res) => {
  try {
    const { message, userId = "default-user" } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message required"
      });
    }

    if (detectCrisis(message)) {
      return res.status(200).json(buildCrisisResponse());
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt()
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I'm here with you. Can you tell me a little more about what feels hardest right now?";

    return res.status(200).json({
      reply,
      safety: {
        flagged: false,
        type: "normal"
      }
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      error: "AI failed",
      reply:
        "I'm here with you. Take one slow breath with me. What feels hardest right now?",
      safety: {
        flagged: false,
        type: "fallback"
      }
    });
  }
});

export default router;