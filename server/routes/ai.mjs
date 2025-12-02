// server/routes/ai.mjs

import express from "express";
import { z } from "zod";
import OpenAI from "openai";

import {
  success,
  badRequest,
  serverError,
  unauthorized,
} from "../utils/response.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

const OPENAI_API_KEY = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "";
const OPENAI_BASE_URL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined;
let openai = null;

if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
  });
}

// All AI routes require auth (you can relax this later if desired)
router.use(requireAuth);

const messageSchema = z.object({
  message: z.string().min(1, "Message is required."),
});

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const user = req.user;
    if (!user) return unauthorized(res);

    if (!openai) {
      return serverError(res, new Error("OpenAI not configured."), "AI not configured.");
    }

    const parseResult = messageSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.flatten();
      return badRequest(res, "Validation failed.", errors);
    }

    const { message } = parseResult.data;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a gentle emotional support companion for MyMentalHealthBuddy. " +
            "You never give medical advice or crisis instructions. You help users " +
            "name feelings, practice self-compassion, and explore honest questions " +
            "about their inner world.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "I'm here with you. I’m not sure what to say yet, but I care about how you feel.";

    return success(res, { reply }, "AI reply.");
  } catch (err) {
    return serverError(res, err);
  }
});

export default router;