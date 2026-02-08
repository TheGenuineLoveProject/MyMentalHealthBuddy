import { Router } from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { authGuard } from "../middleware/auth.mjs";
import { chatCompletion, isConfigured } from "../utils/aiClient.mjs";
import { logger } from "../utils/logger.mjs";
import { checkResponseSafety, sanitizeAIResponse, ensureDisclaimer } from "../utils/safetyCheck.mjs";
import { increment } from "../utils/metrics.mjs";

const router = Router();

const FREE_DAILY_SESSION_LIMIT = 5;

const CRISIS_KEYWORDS = [
  "kill myself", "end my life", "suicide", "suicidal", "want to die",
  "don't want to live", "hurt myself", "self-harm", "cut myself",
  "overdose", "end it all", "no reason to live", "better off dead"
];

const CRISIS_RESPONSE = {
  isCrisis: true,
  reply: `I hear you, and I'm genuinely concerned about what you're sharing. Your safety matters more than anything else right now.

Please reach out to someone who can help immediately:

**National Suicide Prevention Lifeline**: 988 (call or text)
**Crisis Text Line**: Text HOME to 741741

If you're in immediate danger, please call emergency services (911 in the US) or go to your nearest emergency room.

You are not alone. You matter. Help is available right now.`,
  resources: [
    { name: "National Suicide Prevention Lifeline", contact: "988", type: "phone" },
    { name: "Crisis Text Line", contact: "741741", type: "text" }
  ]
};

const SYSTEM_PROMPT = `You are a gentle companion for The Genuine Love Project. Your role is to:
- Listen and reflect what you hear without interpretation
- Use tentative language: "You might notice...", "It seems like...", "One way to describe this..."
- Validate feelings without advice or diagnosis
- Never use "should", "must", "need to", or "have to"
- Never make promises about outcomes or healing
- Never create urgency or pressure
- Recognize crisis situations and provide appropriate resources

You are a mirror, not an authority. The user knows themselves better than you ever could.
Always end with: "Take what serves you. You know yourself best."`;


function detectCrisis(message) {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

router.post("/chat", authGuard, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "Missing userId or message" });
    }

    const userSubResult = await db.execute(sql`
      SELECT subscription_status FROM users WHERE id = ${userId} LIMIT 1
    `);
    const subStatus = userSubResult.rows?.[0]?.subscription_status || "free";

    if (subStatus !== "pro") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const countResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM ai_messages 
        WHERE user_id = ${userId} AND role = 'user' AND created_at >= ${todayStart.toISOString()}
      `);
      const todayCount = parseInt(countResult.rows?.[0]?.count || "0", 10);
      if (todayCount >= FREE_DAILY_SESSION_LIMIT) {
        increment("ai_chat_limit_hit", { plan: "free" });
        return res.status(429).json({
          error: "Daily session limit reached",
          limit: FREE_DAILY_SESSION_LIMIT,
          message: "You've used your free sessions for today. They reset tomorrow, or you can upgrade to Pro for unlimited access.",
        });
      }
    }

    if (detectCrisis(message)) {
      logger.warn("Crisis detected in AI chat", { userId });
      return res.json(CRISIS_RESPONSE);
    }

    const historyResult = await db.execute(sql`
      SELECT role, content FROM ai_messages 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    const history = (historyResult.rows || []).reverse().map(row => ({
      role: row.role,
      content: row.content,
    }));

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message },
    ];

    let aiResponse;

    if (isConfigured()) {
      const result = await chatCompletion({
        messages,
        temperature: 0.8,
        maxTokens: 500,
      });

      if (result.success) {
        aiResponse = result.content;
      } else {
        logger.warn("OpenAI failed, using fallback", { error: result.error });
        aiResponse = "I'm here with you. While I'm having a brief moment of difficulty, please know that you are not alone. Would you like to share more about how you're feeling?";
      }
    } else {
      aiResponse = "I'm here with you. You are not alone. (AI is currently in offline mode)";
    }

    const safetyResult = checkResponseSafety(aiResponse);
    if (!safetyResult.passes) {
      logger.warn("AI response safety check failed", { violations: safetyResult.violations });
      aiResponse = sanitizeAIResponse(aiResponse);
    }
    
    aiResponse = ensureDisclaimer(aiResponse);

    const messageId = generateId("msg");
    const responseId = generateId("msg");

    await db.execute(sql`
      INSERT INTO ai_messages (id, user_id, role, content, created_at)
      VALUES (${messageId}, ${userId}, 'user', ${message}, NOW())
    `);

    await db.execute(sql`
      INSERT INTO ai_messages (id, user_id, role, content, created_at)
      VALUES (${responseId}, ${userId}, 'assistant', ${aiResponse}, NOW())
    `);

    increment("ai_chat_message_count", { plan: subStatus });
    if (subStatus === "pro") increment("pro_user_action", { plan: "pro" });
    res.json({ reply: aiResponse, messageId: responseId });
  } catch (err) {
    logger.error("AI chat error", { error: err.message, userId: req.user?.id });
    res.status(500).json({ error: "AI chat failed" });
  }
});

router.get("/history", authGuard, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await db.execute(sql`
      SELECT id, role, content, created_at 
      FROM ai_messages 
      WHERE user_id = ${userId}
      ORDER BY created_at ASC
    `);

    res.json({ ok: true, messages: result.rows || [] });
  } catch (err) {
    logger.error("Get chat history error", { error: err.message, userId: req.user?.id });
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

router.delete("/history", authGuard, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await db.execute(sql`DELETE FROM ai_messages WHERE user_id = ${userId}`);

    res.json({ ok: true, message: "Chat history cleared" });
  } catch (err) {
    logger.error("Clear chat history error", { error: err.message, userId: req.user?.id });
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

export default router;
