// server/routes/ai.mjs

import express from "express";
import { randomUUID } from "crypto";
import OpenAI from "openai";
import { db } from "../db/connection.mjs";
import { aiMessages } from "../../shared/schema.mjs";
import { eq, sql } from "drizzle-orm";

import {
  success,
  badRequest,
  serverError,
  unauthorized,
} from "../utils/response.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { chatMessageSchema, validateBody } from "../validation/schemas.mjs";
import { aiRateLimit } from "../middleware/rateLimit.mjs";

const router = express.Router();

// Apply AI-specific rate limiting
router.use(aiRateLimit);

const OPENAI_API_KEY = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "";
const OPENAI_BASE_URL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined;
let openai = null;

if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
  });
}

// All AI routes require auth
router.use(requireAuth);

// System prompt for therapeutic AI companion
const SYSTEM_PROMPT = `You are a gentle, empathetic emotional support companion for MyMentalHealthBuddy. 

Your role:
- Listen with compassion and validate feelings
- Help users name and explore their emotions
- Practice trauma-informed, non-judgmental communication
- Encourage self-compassion and reflection
- Provide gentle coping strategies when appropriate

Important guidelines:
- Never give medical advice or diagnose conditions
- Never provide crisis intervention instructions directly
- If someone expresses thoughts of self-harm or suicide, gently acknowledge their pain and encourage them to reach out to a crisis helpline (988 in the US) or visit the Crisis Resources page
- Keep responses warm, concise, and supportive
- Ask open-ended questions to encourage reflection
- Remember you are a supportive companion, not a therapist replacement`;

// Fallback responses when AI is unavailable
const FALLBACK_RESPONSES = [
  "I'm here with you. While I'm having some technical difficulties, please know that your feelings are valid and you matter.",
  "I'm experiencing some connection issues, but I want you to know that I'm here to listen. Would you like to try again in a moment?",
  "I'm having trouble connecting right now, but please don't feel alone. If you need immediate support, consider reaching out to a crisis helpline or visiting our Crisis Resources page.",
];

/**
 * GET /api/ai/history
 * Get chat history for authenticated user
 */
router.get("/history", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return unauthorized(res);

    const messages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.userId, userId))
      .orderBy(sql`${aiMessages.createdAt} ASC`)
      .limit(50);

    return success(res, { messages }, "Chat history loaded.");
  } catch (err) {
    console.error("[ai/history] Error:", err);
    return serverError(res, err, "Failed to load chat history.");
  }
});

/**
 * DELETE /api/ai/history
 * Clear chat history for authenticated user
 */
router.delete("/history", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return unauthorized(res);

    await db.delete(aiMessages).where(eq(aiMessages.userId, userId));

    return success(res, {}, "Chat history cleared.");
  } catch (err) {
    console.error("[ai/history/clear] Error:", err);
    return serverError(res, err, "Failed to clear chat history.");
  }
});

/**
 * POST /api/ai/chat
 * Send a message to AI companion
 */
router.post("/chat", validateBody(chatMessageSchema), async (req, res) => {
  try {
    const user = req.user;
    if (!user) return unauthorized(res);

    const { message } = req.validatedBody;

    // Save user message to history
    await db.insert(aiMessages).values({
      id: randomUUID(),
      userId: user.id,
      role: "user",
      content: message,
      createdAt: new Date(),
    });

    // Check if OpenAI is configured
    if (!openai) {
      const fallbackReply = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      
      // Save fallback response
      await db.insert(aiMessages).values({
        id: randomUUID(),
        userId: user.id,
        role: "assistant",
        content: fallbackReply,
        createdAt: new Date(),
      });

      return success(res, { 
        reply: fallbackReply,
        isOffline: true 
      }, "AI is currently offline.");
    }

    // Get recent conversation history for context
    const recentMessages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.userId, user.id))
      .orderBy(sql`${aiMessages.createdAt} DESC`)
      .limit(10);

    // Build conversation context (reverse to get chronological order)
    const conversationHistory = recentMessages
      .reverse()
      .slice(0, -1) // Exclude the message we just added
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversationHistory,
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply = completion.choices?.[0]?.message?.content ??
        "I'm here with you. I'm not sure what to say yet, but I care about how you feel.";

      // Save assistant response to history
      await db.insert(aiMessages).values({
        id: randomUUID(),
        userId: user.id,
        role: "assistant",
        content: reply,
        createdAt: new Date(),
      });

      return success(res, { reply }, "AI reply.");
    } catch (aiError) {
      console.error("[ai/chat] OpenAI error:", aiError);
      
      const fallbackReply = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      
      // Save fallback response
      await db.insert(aiMessages).values({
        id: randomUUID(),
        userId: user.id,
        role: "assistant",
        content: fallbackReply,
        createdAt: new Date(),
      });

      return success(res, { 
        reply: fallbackReply,
        isOffline: true 
      }, "AI is temporarily unavailable.");
    }
  } catch (err) {
    console.error("[ai/chat] Unexpected error:", err);
    return serverError(res, err, "Failed to process message.");
  }
});

export default router;
