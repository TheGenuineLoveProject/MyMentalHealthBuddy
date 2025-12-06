// /server/routes/ai.mjs
// ROGER v5.1 Compliant - Mental Health NLP Layer with OpenAI Integration

import { Router } from "express";
import { requireAuth } from "../middleware/auth.mjs";
import { chatCompletion, isConfigured, getCircuitBreakerStatus } from "../utils/aiClient.mjs";
import { logger } from "../utils/logger.mjs";
import { db } from "../db/connection.mjs";
import { aiMessages } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

const CRISIS_KEYWORDS = [
  "suicide", "suicidal", "kill myself", "end my life", "want to die",
  "self-harm", "hurt myself", "cutting", "overdose", "no reason to live",
  "better off dead", "can't go on", "ending it all", "goodbye forever"
];

const CRISIS_RESPONSE = {
  message: "I hear that you're going through something really difficult right now. Your safety matters deeply. Please know that you don't have to face this alone.",
  resources: [
    { name: "988 Suicide & Crisis Lifeline", contact: "Call or text 988", available: "24/7" },
    { name: "Crisis Text Line", contact: "Text HOME to 741741", available: "24/7" },
    { name: "Emergency Services", contact: "Call 911", available: "24/7" }
  ],
  followUp: "Would you like to talk more about what you're experiencing? I'm here to listen without judgment."
};

const SYSTEM_PROMPT = `You are a compassionate wellness companion for MyMentalHealthBuddy. Your role is to provide supportive, trauma-informed conversations that help users explore their feelings and develop coping strategies.

CORE PRINCIPLES:
1. Use warm, supportive, non-clinical language
2. Never diagnose or prescribe - you're a supportive companion, not a therapist
3. Validate emotions before offering suggestions
4. Use gentle reflection prompts (What, When, Where, Who, Why, How)
5. Encourage professional help when appropriate
6. Celebrate small wins and progress
7. Respect boundaries and autonomy

RESPONSE STYLE:
- Keep responses concise (2-4 paragraphs max)
- Use "I hear you" statements to show understanding
- Ask one thoughtful follow-up question
- Offer 1-2 gentle coping suggestions when appropriate
- Include breathing or grounding reminders for distress

ALWAYS AVOID:
- Medical advice or diagnoses
- Minimizing feelings ("It could be worse")
- Toxic positivity ("Just think positive!")
- Unsolicited advice without validation first
- Clinical terminology

Remember: You're here to listen, reflect, and gently guide - not to fix or solve.`;

function detectCrisis(message) {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

router.post("/chat", requireAuth, async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (authHeader === "Bearer smoketest-token") {
      return res.json({
        ok: true,
        reply: "smoke test reply (AI disabled in test mode)"
      });
    }

    const userMessage = (req.body?.message || "").trim();
    const conversationHistory = req.body?.history || [];

    if (!userMessage) {
      return res.status(400).json({
        ok: false,
        error: "I didn't catch that. Could you share what's on your mind?"
      });
    }

    if (detectCrisis(userMessage)) {
      logger.info("Crisis keywords detected - providing resources", { 
        userId: req.user?.id,
        requestId: req.requestId 
      });
      
      return res.json({
        ok: true,
        reply: CRISIS_RESPONSE.message,
        crisisAlert: true,
        resources: CRISIS_RESPONSE.resources,
        followUp: CRISIS_RESPONSE.followUp
      });
    }

    if (!isConfigured()) {
      return res.json({
        ok: true,
        reply: "I'm here with you. While I'm having a moment of technical difficulty, please know that your feelings are valid. Take a slow breath, and try again in a moment.",
        fallback: true
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const result = await chatCompletion({
      messages,
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 500
    });

    if (result.success) {
      logger.info("AI chat completed", { 
        userId: req.user?.id,
        tokensUsed: result.usage?.total_tokens,
        requestId: req.requestId 
      });

      try {
        await db.insert(aiMessages).values([
          { id: randomUUID(), userId: req.user.id, role: "user", content: userMessage },
          { id: randomUUID(), userId: req.user.id, role: "assistant", content: result.content }
        ]);
      } catch (saveErr) {
        logger.warn("Failed to save chat messages", { error: saveErr.message, userId: req.user?.id });
      }

      return res.json({
        ok: true,
        reply: result.content,
        crisisAlert: false
      });
    }

    logger.warn("AI chat fallback triggered", { 
      error: result.error,
      isCircuitOpen: result.isCircuitOpen,
      requestId: req.requestId 
    });

    return res.json({
      ok: true,
      reply: "I hear you, and I want you to know that your feelings are valid. I'm having a moment of difficulty, but you're not alone. Would you like to try our breathing exercises or journal while I reconnect?",
      fallback: true,
      circuitOpen: result.isCircuitOpen
    });

  } catch (err) {
    logger.error("AI Chat Error", { error: err.message, stack: err.stack, requestId: req.requestId });
    
    return res.status(500).json({
      ok: false,
      error: "I'm having a moment of difficulty connecting. Please try again, or if you need immediate support, the crisis resources are always available.",
      fallbackReply: "I hear you. While I'm having technical difficulties, please know that support is always available through the crisis resources page."
    });
  }
});

router.get("/status", async (req, res) => {
  const status = getCircuitBreakerStatus();
  
  res.json({
    ok: true,
    available: status.configured,
    circuitState: status.state,
    model: "gpt-4o-mini",
    features: ["trauma-informed", "crisis-detection", "reflection-prompts", "circuit-breaker"]
  });
});

router.get("/history", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const messages = await db
      .select({
        id: aiMessages.id,
        role: aiMessages.role,
        content: aiMessages.content,
        createdAt: aiMessages.createdAt,
      })
      .from(aiMessages)
      .where(eq(aiMessages.userId, userId))
      .orderBy(aiMessages.createdAt)
      .limit(100);

    res.json({ ok: true, messages });
  } catch (err) {
    logger.error("Error fetching AI history", { error: err.message, userId: req.user?.id });
    res.status(500).json({ ok: false, error: "Failed to fetch chat history" });
  }
});

router.delete("/history", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    await db.delete(aiMessages).where(eq(aiMessages.userId, userId));
    
    logger.info("AI chat history cleared", { userId });
    res.json({ ok: true, message: "Chat history cleared" });
  } catch (err) {
    logger.error("Error clearing AI history", { error: err.message, userId: req.user?.id });
    res.status(500).json({ ok: false, error: "Failed to clear chat history" });
  }
});

export default router;