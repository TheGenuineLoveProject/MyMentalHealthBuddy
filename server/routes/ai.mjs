// server/routes/ai.mjs

import express from "express";
import { randomUUID } from "crypto";
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
import { chatCompletion, isConfigured, getCircuitBreakerStatus } from "../utils/aiClient.mjs";

const router = express.Router();

// Apply AI-specific rate limiting
router.use(aiRateLimit);

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

    await db.insert(aiMessages).values({
      id: randomUUID(),
      userId: user.id,
      role: "user",
      content: message,
      createdAt: new Date(),
    });

    if (!isConfigured()) {
      const fallbackReply = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      
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

    const recentMessages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.userId, user.id))
      .orderBy(sql`${aiMessages.createdAt} DESC`)
      .limit(10);

    const conversationHistory = recentMessages
      .reverse()
      .slice(0, -1)
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

    const result = await chatCompletion({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory,
        { role: "user", content: message },
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 500,
    });

    if (result.success) {
      const reply = result.content || "I'm here with you. I'm not sure what to say yet, but I care about how you feel.";

      await db.insert(aiMessages).values({
        id: randomUUID(),
        userId: user.id,
        role: "assistant",
        content: reply,
        createdAt: new Date(),
      });

      return success(res, { reply }, "AI reply.");
    }

    const fallbackReply = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    
    await db.insert(aiMessages).values({
      id: randomUUID(),
      userId: user.id,
      role: "assistant",
      content: fallbackReply,
      createdAt: new Date(),
    });

    return success(res, { 
      reply: fallbackReply,
      isOffline: true,
      circuitOpen: result.isCircuitOpen,
    }, "AI is temporarily unavailable.");
  } catch (err) {
    console.error("[ai/chat] Unexpected error:", err);
    return serverError(res, err, "Failed to process message.");
  }
});

/**
 * GET /api/ai/status
 * Get AI service status including circuit breaker state
 */
router.get("/status", (req, res) => {
  const status = getCircuitBreakerStatus();
  return success(res, status, "AI service status.");
});

export default router;
