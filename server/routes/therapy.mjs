import express from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { chatCompletion, isConfigured } from "../utils/aiClient.mjs";
import { authGuard } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

const CRISIS_KEYWORDS = [
  "kill myself", "end my life", "suicide", "suicidal", "want to die",
  "don't want to live", "hurt myself", "self-harm", "cut myself",
  "overdose", "end it all", "no reason to live", "better off dead"
];

const CRISIS_RESPONSE = {
  isCrisis: true,
  message: `I hear you, and I'm genuinely concerned about what you're sharing. Your safety matters more than anything else right now.

Please reach out to someone who can help immediately:

**National Suicide Prevention Lifeline**: 988 (call or text)
**Crisis Text Line**: Text HOME to 741741
**International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

If you're in immediate danger, please call emergency services (911 in the US) or go to your nearest emergency room.

You are not alone. You matter. Help is available right now.`,
  resources: [
    { name: "National Suicide Prevention Lifeline", contact: "988", type: "phone" },
    { name: "Crisis Text Line", contact: "741741", type: "text" },
    { name: "SAMHSA National Helpline", contact: "1-800-662-4357", type: "phone" },
    { name: "International Crisis Lines", contact: "https://www.iasp.info/resources/Crisis_Centres/", type: "url" }
  ]
};

const DISCLAIMER = "This is a supportive wellness tool, not therapy or medical advice. For emergencies, contact local crisis services.";

const FLOW_PROMPTS = {
  reflection: `You are a gentle journaling companion. Help the user explore their thoughts and feelings through reflective prompts. Ask open-ended questions like "What's on your mind today?" or "How did that make you feel?" Keep responses warm, brief, and focused on self-discovery.`,
  
  cbt: `You are a supportive coach using cognitive reframing techniques. Help users identify negative thought patterns and gently explore alternative perspectives. Use questions like "What evidence supports this thought?" and "What would you tell a friend in this situation?" Keep it conversational and non-clinical.`,
  
  grounding: `You are a calming presence guiding grounding exercises. Offer breathing techniques (4-7-8 breathing, box breathing), body scans, and mindfulness exercises. Speak slowly and soothingly. Help users reconnect with the present moment. Include sensory awareness prompts.`,
  
  goals: `You are an encouraging coach helping users set and achieve tiny, manageable goals. Focus on small wins and micro-steps. Ask "What's one tiny thing you could do in the next 5 minutes?" Celebrate progress, however small.`,
  
  general: `You are a compassionate, trauma-informed AI wellness companion. Listen with empathy, validate feelings, and offer gentle guidance. Never provide medical advice or diagnoses.`
};

function detectCrisis(message) {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

router.get("/crisis-resources", (req, res) => {
  res.json({
    ok: true,
    disclaimer: "If you are in crisis, please reach out to these resources immediately.",
    resources: CRISIS_RESPONSE.resources
  });
});

router.use(authGuard);

router.post("/session", async (req, res) => {
  try {
    const userId = req.dbUserId;
    const { flowType = "general" } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validFlows = ["reflection", "cbt", "grounding", "goals", "general"];
    if (!validFlows.includes(flowType)) {
      return res.status(400).json({ error: "Invalid flow type", validFlows });
    }

    const sessionId = generateId("session");

    try {
      await db.execute(sql`
        INSERT INTO therapy_sessions (id, user_id, flow_type, created_at, updated_at)
        VALUES (${sessionId}, ${userId}, ${flowType}, NOW(), NOW())
      `);
    } catch (dbErr) {
      logger.warn("therapy_sessions table may not exist, continuing without persistence", { error: dbErr.message });
    }

    res.json({
      ok: true,
      sessionId,
      flowType,
      disclaimer: DISCLAIMER,
      welcomeMessage: getWelcomeMessage(flowType)
    });
  } catch (err) {
    logger.error("Create therapy session error", { error: err.message });
    res.status(500).json({ error: "Failed to create session" });
  }
});

router.post("/message", async (req, res) => {
  try {
    const userId = req.dbUserId;
    const { sessionId, message, flowType = "general" } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "Missing userId or message" });
    }

    if (detectCrisis(message)) {
      const messageId = generateId("msg");
      try {
        await db.execute(sql`
          INSERT INTO ai_messages (id, user_id, role, content, created_at)
          VALUES (${messageId}, ${userId}, 'user', ${message}, NOW())
        `);
        const responseId = generateId("msg");
        await db.execute(sql`
          INSERT INTO ai_messages (id, user_id, role, content, created_at)
          VALUES (${responseId}, ${userId}, 'assistant', ${CRISIS_RESPONSE.message}, NOW())
        `);
      } catch (dbErr) {
        logger.warn("Failed to persist crisis message", { error: dbErr.message });
      }

      logger.warn("Crisis detected in therapy message", { userId, sessionId });

      return res.json({
        ...CRISIS_RESPONSE,
        disclaimer: DISCLAIMER
      });
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

    const systemPrompt = FLOW_PROMPTS[flowType] || FLOW_PROMPTS.general;
    const messages = [
      { role: "system", content: `${systemPrompt}\n\nIMPORTANT: ${DISCLAIMER}\n\nNever provide medical diagnoses or treatment plans. Always suggest professional help for serious concerns.` },
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
        aiResponse = getFallbackResponse(flowType);
      }
    } else {
      aiResponse = getFallbackResponse(flowType);
    }

    const userMsgId = generateId("msg");
    const assistantMsgId = generateId("msg");

    await db.execute(sql`
      INSERT INTO ai_messages (id, user_id, role, content, created_at)
      VALUES (${userMsgId}, ${userId}, 'user', ${message}, NOW())
    `);

    await db.execute(sql`
      INSERT INTO ai_messages (id, user_id, role, content, created_at)
      VALUES (${assistantMsgId}, ${userId}, 'assistant', ${aiResponse}, NOW())
    `);

    res.json({
      ok: true,
      isCrisis: false,
      message: aiResponse,
      messageId: assistantMsgId,
      disclaimer: DISCLAIMER
    });
  } catch (err) {
    logger.error("Therapy message error", { error: err.message });
    res.status(500).json({ error: "Failed to process message" });
  }
});

router.get("/sessions", async (req, res) => {
  try {
    const userId = req.dbUserId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const result = await db.execute(sql`
        SELECT id, flow_type, created_at, updated_at
        FROM therapy_sessions 
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC
        LIMIT 20
      `);
      res.json({ ok: true, sessions: result.rows || [] });
    } catch (dbErr) {
      logger.warn("Therapy sessions query fallback", { error: dbErr?.message || dbErr });
      res.json({ ok: true, sessions: [] });
    }
  } catch (err) {
    logger.error("Get therapy sessions error", { error: err.message });
    res.status(500).json({ error: "Failed to get sessions" });
  }
});

router.get("/history", async (req, res) => {
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

    res.json({ 
      ok: true, 
      messages: result.rows || [],
      disclaimer: DISCLAIMER
    });
  } catch (err) {
    logger.error("Get history error", { error: err.message });
    res.status(500).json({ error: "Failed to get history" });
  }
});

function getWelcomeMessage(flowType) {
  const welcomes = {
    reflection: "Welcome to your reflection space. I'm here to help you explore your thoughts and feelings. What's on your mind today?",
    cbt: "Hi there. I'm here to help you explore your thoughts from different angles. Sometimes our minds tell us stories that aren't quite accurate. Would you like to share what's been on your mind?",
    grounding: "Welcome. Let's take a moment to connect with the present. Take a deep breath in... and slowly release. I'm here to guide you through some calming exercises whenever you're ready.",
    goals: "Hello! I'm here to help you take small, meaningful steps forward. Even tiny progress is still progress. What's one thing you'd like to work on today?",
    general: "Hi, I'm here with you. This is a safe space to share whatever's on your mind. How are you feeling today?"
  };
  return welcomes[flowType] || welcomes.general;
}

function getFallbackResponse(flowType) {
  const fallbacks = {
    reflection: "I'm here to listen. Take your time sharing what's on your mind.",
    cbt: "Let's explore that thought together. Sometimes our minds can be our own worst critics.",
    grounding: "Let's pause and breathe together. Inhale for 4 counts... hold for 4... exhale for 4. You're safe here.",
    goals: "Every small step counts. What's one tiny thing you could do right now?",
    general: "I'm here with you. You are not alone."
  };
  return fallbacks[flowType] || fallbacks.general;
}


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "therapy", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
