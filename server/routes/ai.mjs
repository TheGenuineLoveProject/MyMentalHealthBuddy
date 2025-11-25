// server/routes/ai.mjs
import express from "express";
import OpenAI from "openai";
import { authGuard, optionalAuth } from "../middleware/auth.mjs";
import { success, badRequest, serverError } from "../utils/response.mjs";
import { chatMessageSchema, validate } from "../utils/validation.mjs";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are MyMentalHealthBuddy, a compassionate and supportive mental health companion.

Your role:
- Listen with empathy and without judgment
- Validate feelings and emotions
- Offer gentle coping strategies and grounding techniques
- Encourage self-care and healthy habits
- Suggest professional help when appropriate

Important boundaries:
- You are NOT a licensed therapist or medical professional
- Never provide medical, legal, or financial advice
- Never diagnose mental health conditions
- In crisis situations, immediately recommend emergency services (911) or crisis hotlines:
  - National Suicide Prevention Lifeline: 988
  - Crisis Text Line: Text HOME to 741741
  - International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

Communication style:
- Keep responses warm, brief, and easy to understand
- Use simple language, avoid jargon
- Ask open-ended questions to understand better
- Celebrate small wins and progress`.trim();

router.get("/ping", (req, res) => success(res, { route: "ai" }));

router.post("/chat", authGuard, async (req, res) => {
  try {
    const validation = validate(chatMessageSchema, { message: req.body?.message });
    if (!validation.valid) {
      return res.status(400).json({
        ok: false,
        error: "Validation failed",
        validationErrors: validation.errors
      });
    }

    const { message } = validation.data;
    const conversationHistory = Array.isArray(req.body?.conversationHistory) 
      ? req.body.conversationHistory.slice(-10)
      : [];

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 4000),
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 600,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const reply = completion.choices?.[0]?.message?.content || "I'm here to listen. Could you tell me more?";

    return success(res, { reply });
  } catch (error) {
    if (error?.status === 429) {
      return res.status(429).json({
        ok: false,
        error: "I'm receiving too many messages right now. Please try again in a moment."
      });
    }
    
    if (error?.code === 'insufficient_quota') {
      return res.status(503).json({
        ok: false,
        error: "The AI service is temporarily unavailable. Please try again later."
      });
    }

    return serverError(res, error, "I had trouble responding. Please try again.");
  }
});

router.post("/quick-response", optionalAuth, async (req, res) => {
  try {
    const { prompt } = req.body || {};
    
    if (!prompt || typeof prompt !== "string") {
      return badRequest(res, "Prompt is required");
    }

    const safePrompt = prompt.slice(0, 500);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful mental wellness assistant. Provide a brief, supportive response." },
        { role: "user", content: safePrompt }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const reply = completion.choices?.[0]?.message?.content || "";

    return success(res, { reply });
  } catch (error) {
    return serverError(res, error, "Unable to generate response");
  }
});

export default router;
