import { Router } from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { optionalAuth, requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { chatCompletion, isConfigured } from "../utils/aiClient.mjs";
import { increment, getSummary } from "../utils/metrics.mjs";

const router = Router();

const SYSTEM_PROMPT = `
You are a gentle, supportive mental health companion.
- Validate feelings
- Do NOT diagnose
- Do NOT give commands
- Use soft language
- If crisis → provide help resources
Always end with:
"Take what serves you. You know yourself best."
`;

const CRISIS_KEYWORDS = [
  "kill myself","suicide","end my life","want to die",
  "hurt myself","self harm","cut myself"
];

function detectCrisis(text = "") {
  const t = text.toLowerCase();
  return CRISIS_KEYWORDS.some(k => t.includes(k));
}

const CRISIS_RESPONSE = {
  reply: `I'm really sorry you're going through this.

You deserve support right now.

Please reach out:
- Call or text 988 (US)
- Text HOME to 741741

If in danger call 911 immediately.

You are not alone.`,
  crisis: true
};

const FALLBACK_BRANCHES = [
  {
    name: "overwhelmed",
    keywords: ["overwhelmed","too much","can't cope","cant cope","drowning","swamped"],
    reply: "It sounds like a lot is landing on you at once. When everything feels stacked up, even one slow breath can create a small pocket of space. What is the single heaviest piece right now?"
  },
  {
    name: "anxious",
    keywords: ["anxious","anxiety","panic","panicking","worried","nervous","on edge"],
    reply: "Anxiety can make the body feel like it is bracing for something. You might try naming five things you can see around you — that often helps the nervous system soften a little. What feels most uncertain right now?"
  },
  {
    name: "sad",
    keywords: ["sad","hopeless","empty","numb","depressed","down","blue"],
    reply: "I hear the heaviness in what you shared. Sadness deserves to be witnessed, not rushed. Is there anything small that has felt even a little kind to you today?"
  },
  {
    name: "angry",
    keywords: ["angry","furious","rage","mad","frustrated","irritated","resentful"],
    reply: "Anger is often a signal that something important to you was crossed. You are allowed to feel it without acting on it. What boundary or value do you think this is pointing toward?"
  },
  {
    name: "lonely",
    keywords: ["lonely","alone","isolated","no one","nobody","disconnected"],
    reply: "Loneliness can feel like a quiet ache, even when others are around. Being seen — even by yourself, even right now — counts. Who or what has felt safest to you recently?"
  },
  {
    name: "tired",
    keywords: ["tired","exhausted","burned out","burnout","drained","no energy"],
    reply: "Burnout often shows up when you have been carrying more than your share for too long. Rest is not a reward you have to earn. What is one thing you could set down today, even briefly?"
  },
  {
    name: "generic",
    keywords: [],
    reply: "I am here with you. Whatever you are carrying right now is welcome in this space. Would you like to tell me a little more about what is going on?"
  }
];

function buildSupportiveReply(text = "") {
  const t = (text || "").toLowerCase();
  for (const branch of FALLBACK_BRANCHES) {
    if (branch.keywords.length === 0) continue;
    if (branch.keywords.some(k => t.includes(k))) {
      return { reply: `${branch.reply}\n\nTake what serves you. You know yourself best.`, branch: branch.name };
    }
  }
  const generic = FALLBACK_BRANCHES[FALLBACK_BRANCHES.length - 1];
  return { reply: `${generic.reply}\n\nTake what serves you. You know yourself best.`, branch: generic.name };
}

router.post("/chat", optionalAuth, async (req, res) => {
  try {
    const userId = req.dbUserId || null;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    // 🚨 crisis handling FIRST
    if (detectCrisis(message)) {
      increment("ai_chat_message_count", { plan: userId ? "user" : "guest" });
      increment("ai_crisis_detected", { plan: userId ? "user" : "guest" });
      return res.json(CRISIS_RESPONSE);
    }

    // history (only if authed)
    let history = [];
    if (userId) {
      const result = await db.execute(sql`
        SELECT role, content
        FROM ai_messages
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 10
      `);
      history = (result.rows || []).reverse();
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message }
    ];

    let reply;
    let source = "openai";
    let fallbackBranch = null;

    if (isConfigured()) {
      const result = await chatCompletion({
        messages,
        temperature: 0.7,
        maxTokens: 300
      });

      if (result.success) {
        reply = result.content;
      } else {
        const fb = buildSupportiveReply(message);
        reply = fb.reply;
        source = "fallback_error";
        fallbackBranch = fb.branch;
      }
    } else {
      const fb = buildSupportiveReply(message);
      reply = fb.reply;
      source = "fallback_offline";
      fallbackBranch = fb.branch;
    }

    // 💾 persist ONLY if user exists
    if (userId) {
      await db.execute(sql`
        INSERT INTO ai_messages (user_id, role, content)
        VALUES (${userId}, 'user', ${message})
      `);

      await db.execute(sql`
        INSERT INTO ai_messages (user_id, role, content)
        VALUES (${userId}, 'assistant', ${reply})
      `);
    }

    increment("ai_chat_message_count", { plan: userId ? "user" : "guest" });
    increment("ai_chat_reply_source", { plan: source });
    if (fallbackBranch) {
      increment("ai_fallback_branch", { plan: fallbackBranch });
    }

    res.json({ reply });

  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ error: "AI chat failed" });
  }
});

// Admin-only self-tuning insights: see which fallback branches users hit,
// how often the AI vs the offline/error fallback served them, and crisis volume.
router.get("/insights", requireAuth, requireAdmin, (_req, res) => {
  const summary = getSummary();
  const all = summary.counters || {};
  const insights = {
    chatVolume: all.ai_chat_message_count || { total: 0, byPlan: {} },
    replySource: all.ai_chat_reply_source || { total: 0, byPlan: {} },
    fallbackBranchHits: all.ai_fallback_branch || { total: 0, byPlan: {} },
    crisisDetected: all.ai_crisis_detected || { total: 0, byPlan: {} },
    knownBranches: FALLBACK_BRANCHES.map(b => b.name),
    uptimeSeconds: summary.uptimeSeconds,
    collectedSince: summary.collectedSince,
  };
  res.json({ ok: true, insights });
});

export default router;
