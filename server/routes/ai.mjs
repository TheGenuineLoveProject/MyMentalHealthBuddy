import { Router } from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { authGuard, optionalAuth } from "../middleware/auth.mjs";
import { aiRateLimit } from "../middleware/rateLimit.mjs";
import { chatCompletion, isConfigured } from "../utils/aiClient.mjs";
import { logger } from "../utils/logger.mjs";
import { checkResponseSafety, sanitizeAIResponse, ensureDisclaimer } from "../utils/safetyCheck.mjs";
import { increment } from "../utils/metrics.mjs";

const router = Router();
router.use(aiRateLimit);

const FREE_DAILY_SESSION_LIMIT = 5;
const STARTER_DAILY_SESSION_LIMIT = 25;

function detectCrisis(text = "") {
  const normalized = text.toLowerCase();

  const highRiskPatterns = [
    "i want to kill myself",
    "i want to die",
    "suicide",
    "end my life",
    "hurt myself",
    "self harm",
  ];

  return highRiskPatterns.some((pattern) => normalized.includes(pattern));
}

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


function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Phase 3: structured CBT/DBT-informed fallback used when OpenAI is offline
// or the API call fails. Validation -> reflection -> one coping step -> one
// gentle question. Non-clinical, no diagnosis, no monetization.
function buildSupportiveReply(text = "") {
  const normalized = String(text).toLowerCase();

  if (normalized.includes("overwhelmed") || normalized.includes("anxious") || normalized.includes("anxiety")) {
    return "It's understandable to feel anxious or overwhelmed when there's a lot on your plate. It sounds like your mind may be carrying many things at once right now. One gentle next step could be to pause and take three slow breaths, then choose just one small task that feels most manageable. What feels heaviest right now?";
  }

  if (normalized.includes("sad") || normalized.includes("depressed") || normalized.includes("hopeless") || normalized.includes("empty")) {
    return "It takes courage to put words to a heavy feeling like that. It sounds like something inside is asking to be heard. One small step could be to place a hand on your chest and notice your breath for a few seconds, simply acknowledging the feeling without trying to fix it. What's been weighing on you most lately?";
  }

  if (normalized.includes("angry") || normalized.includes("frustrated") || normalized.includes("furious")) {
    return "Anger and frustration often show up when something important to us feels unmet. It makes sense to feel strongly here. One option is to step away for a moment and let your body settle — feet on the floor, a slow exhale longer than the inhale. What do you think this feeling might be protecting?";
  }

  if (normalized.includes("lonely") || normalized.includes("alone") || normalized.includes("isolated")) {
    return "Loneliness is one of the harder feelings to sit with, and it's okay to name it. It sounds like a part of you is longing for connection. One small step might be to send a brief message to someone who has felt safe in the past — even a single sentence. Who comes to mind when you think of someone who has truly listened to you?";
  }

  if (normalized.includes("tired") || normalized.includes("exhausted") || normalized.includes("burned out") || normalized.includes("burnt out")) {
    return "That kind of tiredness is real, and your body and mind may be asking for rest in a way that is hard to ignore. One gentle next step could be to lower the bar for the next hour — just one small thing instead of many. What would 'enough' look like for you today?";
  }

  return "Thank you for sharing that with me. I'm here to listen without judgment. Sometimes naming a feeling out loud is itself a small step. If you'd like, we can try a quick grounding exercise — noticing five things you can see, four you can touch, three you can hear. What's most on your mind right now?";
}

router.post("/chat", optionalAuth, async (req, res) => {
  try {
    const userId = req.dbUserId || null;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    let subStatus = "guest";
    if (userId) {
      const userSubResult = await db.execute(sql`
        SELECT subscription_status FROM users WHERE id = ${userId} LIMIT 1
      `);
      subStatus = userSubResult.rows?.[0]?.subscription_status || "free";

      increment("feature_gate_check", { plan: subStatus });
      const hasUnlimited = ["pro", "elite"].includes(subStatus);
      if (!hasUnlimited) {
        const dailyLimit = subStatus === "starter" ? STARTER_DAILY_SESSION_LIMIT : FREE_DAILY_SESSION_LIMIT;
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const countResult = await db.execute(sql`
          SELECT COUNT(*) as count FROM ai_messages 
          WHERE user_id = ${userId} AND role = 'user' AND created_at >= ${todayStart.toISOString()}
        `);
        const todayCount = parseInt(countResult.rows?.[0]?.count || "0", 10);
        if (todayCount >= dailyLimit) {
          increment("ai_chat_limit_hit", { plan: subStatus });
          const upgradeHint = subStatus === "starter"
            ? "You've used your 25 Starter sessions for today. They reset tomorrow, or upgrade to Pro for unlimited access."
            : "You've used your 5 free sessions for today. They reset tomorrow, or upgrade for more access.";
          return res.status(429).json({
            error: "Daily session limit reached",
            limit: dailyLimit,
            message: upgradeHint,
          });
        }
      }
    }

    if (detectCrisis(message)) {
      logger.warn("Crisis detected in AI chat", { userId });
      return res.json(CRISIS_RESPONSE);
    }

    let history = [];
    if (userId) {
      const historyResult = await db.execute(sql`
        SELECT role, content FROM ai_messages 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC 
        LIMIT 10
      `);
      history = (historyResult.rows || []).reverse().map(row => ({
        role: row.role,
        content: row.content,
      }));
    }

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
        logger.warn("OpenAI failed, using structured fallback", { error: result.error });
        aiResponse = buildSupportiveReply(message);
      }
    } else {
      aiResponse = buildSupportiveReply(message);
    }

    const safetyResult = checkResponseSafety(aiResponse);
    if (!safetyResult.passes) {
      logger.warn("AI response safety check failed", { violations: safetyResult.violations });
      aiResponse = sanitizeAIResponse(aiResponse);
    }
    
    aiResponse = ensureDisclaimer(aiResponse);

    const messageId = generateId("msg");
    const responseId = generateId("msg");

    if (userId) {
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
    } else {
      increment("ai_chat_message_count", { plan: "guest" });
    }
    res.json({ reply: aiResponse, messageId: responseId });
  } catch (err) {
    logger.error("AI chat error", { error: err.message, userId: req.dbUserId });
    res.status(500).json({ error: "AI chat failed" });
  }
});

router.get("/history", authGuard, async (req, res) => {
  try {
    const userId = req.dbUserId;
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
    logger.error("Get chat history error", { error: err.message, userId: req.dbUserId });
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

router.post("/reflect", authGuard, async (req, res) => {
  try {
    const userId = req.dbUserId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const subResult = await db.execute(sql`SELECT subscription_status FROM users WHERE id = ${userId}`);
    const status = subResult.rows?.[0]?.subscription_status;
    if (status !== "pro") {
      return res.status(403).json({ error: "Reflection summary is available with Pro." });
    }

    const result = await db.execute(sql`
      SELECT role, content FROM ai_messages 
      WHERE user_id = ${userId}
      ORDER BY created_at ASC
      LIMIT 20
    `);

    const history = result.rows || [];
    if (history.length < 2) {
      return res.json({ summary: "Not enough conversation to reflect on yet." });
    }

    const conversationText = history
      .map(m => `${m.role === "user" ? "You" : "Companion"}: ${m.content}`)
      .join("\n");

    const reflectPrompt = [
      {
        role: "system",
        content: `You are a gentle, non-directive summarizer for The Genuine Love Project.
Given a conversation between a user and their wellness companion, write a brief 2-3 sentence reflection.
Rules:
- Use tentative language ("It sounds like...", "You seemed to be exploring...")
- Do NOT give advice, diagnose, or interpret
- Do NOT claim progress, healing, or transformation
- Simply mirror back the themes the user touched on
- End with: "This is yours to keep or let go."
- Keep it under 60 words total`
      },
      { role: "user", content: `Here is the conversation:\n\n${conversationText}` }
    ];

    let summary;

    if (isConfigured()) {
      const aiResult = await chatCompletion({
        messages: reflectPrompt,
        temperature: 0.6,
        maxTokens: 150,
      });

      if (aiResult.success) {
        summary = aiResult.content;
        const safetyResult = checkResponseSafety(summary);
        if (!safetyResult.passes) {
          summary = sanitizeAIResponse(summary);
        }
      } else {
        summary = "Your conversation touched on something worth sitting with. This is yours to keep or let go.";
      }
    } else {
      summary = "Your conversation touched on something worth sitting with. This is yours to keep or let go.";
    }

    res.json({ summary });
  } catch (err) {
    logger.error("Reflection summary error", { error: err.message, userId: req.dbUserId });
    res.status(500).json({ error: "Could not generate reflection" });
  }
});

router.delete("/history", authGuard, async (req, res) => {
  try {
    const userId = req.dbUserId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await db.execute(sql`DELETE FROM ai_messages WHERE user_id = ${userId}`);

    res.json({ ok: true, message: "Chat history cleared" });
  } catch (err) {
    logger.error("Clear chat history error", { error: err.message, userId: req.dbUserId });
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "ai", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
