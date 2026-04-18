import { Router } from "express"
import { sql } from "drizzle-orm"
import db from "../db/client.mjs"

import { optionalAuth } from "../middleware/auth.mjs"
import { chatCompletion, isConfigured } from "../utils/aiClient.mjs"
import { increment, getSummary } from "../utils/metrics.mjs"

import { safetyGuardInput } from "../ai/safety/guard.mjs"
import { detectCrisis, CRISIS_RESPONSE } from "../ai/safety/crisis.mjs"
import { classifyCrisis } from "../ai/crisisClassifier.mjs"
import { assessRisk } from "../lib/promptEngine.mjs"

const router = Router()

// =========================
// SYSTEM PROMPT
// =========================
const SYSTEM_PROMPT = `
You are a gentle, supportive mental health companion.
- Validate feelings
- Do NOT diagnose
- Do NOT give commands
- Use soft language
- If crisis → provide help resources
Always end with:
"Take what serves you. You know yourself best."
`

// =========================
// FALLBACK THERAPY ENGINE (CBT/DBT)
// =========================
function buildSupportiveReply(text = "") {
  const t = text.toLowerCase()

  if (t.includes("overwhelmed") || t.includes("stressed")) {
    return `It sounds like a lot is landing on you at once.

Let’s slow this down together:
• What feels like the heaviest part right now?

Try this:
Take a slow breath in for 4… hold… and out for 6.

You don’t need to solve everything — just one small step.

Take what serves you. You know yourself best.`
  }

  if (t.includes("anxious") || t.includes("panic")) {
    return `Anxiety can make everything feel urgent.

Let’s ground your body:
• Look around and name 5 things you can see
• Feel your feet on the ground

You're safe in this moment.

Take what serves you. You know yourself best.`
  }

  if (t.includes("sad") || t.includes("empty")) {
    return `I hear the heaviness in what you're sharing.

You don’t have to rush out of this feeling.

• When did it start?
• What has helped even a little before?

I'm here with you.

Take what serves you. You know yourself best.`
  }

  if (t.includes("angry") || t.includes("frustrated")) {
    return `Anger often points to something important.

Before reacting:
• Name what boundary may have been crossed

Let your body settle first — then decide your next step.

Take what serves you. You know yourself best.`
  }

  return `I'm here with you.

Tell me a little more about what’s going on.

Take what serves you. You know yourself best.`
}

// =========================
// IN-MEMORY GUEST HISTORY
// =========================
const guestHistory = new Map()
const MAX_HISTORY = 10

function getGuestId(req) {
  const id = req.headers["x-guest-id"]
  return typeof id === "string" ? id : null
}

function pushGuestMessage(id, role, content) {
  if (!id) return
  const arr = guestHistory.get(id) || []
  arr.push({ role, content })
  if (arr.length > MAX_HISTORY) arr.shift()
  guestHistory.set(id, arr)
}

// =========================
// MAIN CHAT ROUTE
// =========================
router.post("/chat", optionalAuth, async (req, res) => {
  try {
    const { message } = req.body
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message required" })
    }

    // =========================
    // 1. INPUT SAFETY
    // =========================
    const guarded = safetyGuardInput(message)
    if (!guarded.allowed) {
      return res.json({
        reply: "I’m here to support you — could you rephrase that so I can better help?"
      })
    }

    const cleanText = guarded.text

    // =========================
    // 2. CRISIS KEYWORD CHECK
    // =========================
    if (detectCrisis(cleanText)) {
      return res.json({
        type: "crisis",
        reply: CRISIS_RESPONSE
      })
    }

    // =========================
    // 3. AI CLASSIFIER
    // =========================
    let score = 0
    try {
      const result = await classifyCrisis(global.openai, cleanText)
      score = result?.score || 0
    } catch {}

    // =========================
    // 4. RISK ENGINE
    // =========================
    const risk = assessRisk({ text: cleanText, score })

    if (risk.level === "high") {
      return res.json({
        type: "crisis",
        reply: CRISIS_RESPONSE
      })
    }

    // =========================
    // 5. HISTORY
    // =========================
    const userId = req.dbUserId || null
    const guestId = getGuestId(req)

    let history = []

    if (userId) {
      const result = await db.execute(sql`
        SELECT role, content
        FROM ai_messages
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 10
      `)
      history = (result.rows || []).reverse()
    } else if (guestId) {
      history = guestHistory.get(guestId) || []
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: cleanText }
    ]

    // =========================
    // 6. AI OR FALLBACK
    // =========================
    let reply

    if (isConfigured()) {
      try {
        const result = await chatCompletion({
          messages,
          temperature: 0.7,
          maxTokens: 300
        })

        reply = result?.content || buildSupportiveReply(cleanText)
      } catch {
        reply = buildSupportiveReply(cleanText)
      }
    } else {
      reply = buildSupportiveReply(cleanText)
    }

    // =========================
    // 7. SAVE HISTORY
    // =========================
    if (userId) {
      await db.execute(sql`
        INSERT INTO ai_messages (user_id, role, content)
        VALUES (${userId}, 'user', ${cleanText})
      `)

      await db.execute(sql`
        INSERT INTO ai_messages (user_id, role, content)
        VALUES (${userId}, 'assistant', ${reply})
      `)
    } else if (guestId) {
      pushGuestMessage(guestId, "user", cleanText)
      pushGuestMessage(guestId, "assistant", reply)
    }

    increment("ai_chat_message_count")

    return res.json({ reply })

  } catch (err) {
    console.error("AI chat error:", err)
    return res.status(500).json({
      reply: "Something went wrong, but I’m still here with you."
    })
  }
})

// =========================
// INSIGHTS
// =========================
router.get("/insights", async (req, res) => {
  const summary = getSummary()
  return res.json({ ok: true, summary })
})

export default router