// server/routes/buddy.mjs
//
// MMHB Buddy Engine — healing-domain endpoint.
// POST /api/buddy { message } -> { ok, text, state }
//
// Healing domain only. No business logic. No monetization.
// Crisis short-circuits server-side via the unified crisisDetection facade.
// Does NOT touch /api/ai/chat, memory, profile, summary, provider, or
// orchestrator — it is intentionally a thin, self-contained surface that
// returns visual-state + supportive copy for the BuddyAvatar component.

import { Router } from "express";
import { detect as detectCrisisFacade } from "../engine/crisisDetection.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

const STATES = [
  "calm",
  "sad",
  "anxious",
  "overwhelmed",
  "encouraged",
  "crisis",
  "celebrate",
];

// Server-side mirror of the client BUDDY visual contract (v1.1).
// Kept here so /api/buddy can return a complete `buddy` block in its response,
// which lets a future hardware adapter or alternate client render correctly
// without re-implementing the visual vocabulary.
const BUDDY_VISUALS = {
  calm:        { motion: "idle",       eyeColor: "#6FE3B0", heartColor: "#7FD8A8", heartPulse: 5200 },
  sad:         { motion: "slow_glow",  eyeColor: "#7FB3D5", heartColor: "#5DA3C9", heartPulse: 6400 },
  anxious:     { motion: "breathing",  eyeColor: "#F2C94C", heartColor: "#F0B040", heartPulse: 2200 },
  overwhelmed: { motion: "grounding",  eyeColor: "#E08AB8", heartColor: "#D4729E", heartPulse: 1800 },
  encouraged:  { motion: "warm_glow",  eyeColor: "#7AE2A6", heartColor: "#5DDB94", heartPulse: 4400 },
  crisis:      { motion: "steady",     eyeColor: "#FF6B6B", heartColor: "#FF8585", heartPulse: 1400 },
  celebrate:   { motion: "sparkle",    eyeColor: "#A78BFA", heartColor: "#FFD75A", heartPulse: 3200 },
};

function buildBuddyBlock(state) {
  const safeStateName = STATES.includes(state) ? state : "calm";
  const v = BUDDY_VISUALS[safeStateName] || BUDDY_VISUALS.calm;
  return {
    state: safeStateName,
    safetyMode: safeStateName === "crisis" ? "active" : "passive",
    motion: v.motion,
    eyeColor: v.eyeColor,
    heartColor: v.heartColor,
    heartPulse: v.heartPulse,
  };
}

// Spec-required canonical crisis line. This exact string MUST appear in every
// crisis-state response (verified at the boundary by ensureCrisisLineInText).
const CRISIS_LINE =
  "988 Suicide & Crisis Lifeline by calling or texting 988";

function ensureCrisisLineInText(text) {
  const t = String(text || "").trim();
  if (t.includes(CRISIS_LINE)) return t;
  const opener =
    "You are not alone, and reaching out matters. If you are in crisis or thinking of harming yourself, you can reach the " +
    CRISIS_LINE +
    ". I'm here with you while you take the next small step.";
  return t ? `${opener}\n\n${t}` : opener;
}

const REPLY_LIBRARY = {
  calm: [
    "I'm here with you. Whatever's on your mind, we can take it one breath at a time.",
    "It's okay to just be still for a moment. I'm here whenever you're ready to share.",
    "Thank you for showing up today. What would feel kind to your nervous system right now?",
  ],
  sad: [
    "That sounds heavy, and I'm glad you said it out loud. You don't have to carry it alone right now.",
    "Sadness is allowed to take up space here. Would it help to name what's underneath it, or just sit with it together?",
    "I hear you. Sometimes naming the weight is the first soft thing we can do for ourselves.",
  ],
  anxious: [
    "Anxiety can feel like the body running ahead of the moment. Let's slow it down together — one slow inhale, one longer exhale.",
    "I notice some worry in what you shared. You're safe enough right now to take one breath with me. What feels loudest?",
    "Your nervous system is asking for care. Can we name one thing you can see, one thing you can hear, and one thing you can feel?",
  ],
  overwhelmed: [
    "That's a lot to be holding. Let's set everything else down for a moment — what's the one piece that feels heaviest?",
    "When everything feels like too much, even one slow breath counts as progress. I'm here with you.",
    "You don't have to sort it all right now. We can start with just naming what's loudest, gently.",
  ],
  encouraged: [
    "I love hearing that. Notice that this steadier feeling belongs to you — your work made room for it.",
    "That sounds like real movement. Want to mark it with one sentence to your future self?",
    "Beautiful. What helped this feeling arrive? Naming it helps it visit again.",
  ],
  crisis: [
    "I'm really glad you told me. You matter, and you don't have to be alone in this moment.\n\nIf you're in immediate danger, please call or text 988 (US/Canada) or text HOME to 741741. If you're outside North America, please reach out to a local crisis line.\n\nI'll stay right here with you.",
  ],
  celebrate: [
    "Yes! Let yourself feel this. You earned every part of it.",
    "I'm celebrating with you. What part of this do you most want to remember?",
    "This is wonderful. Take a slow breath and let your body register the good — it deserves to land.",
  ],
};

const STATE_PATTERNS = [
  { state: "celebrate", re: /\b(yay|amazing|won|achieved|did it|so proud|celebrate|hooray|so happy)\b/i },
  { state: "encouraged", re: /\b(better|hopeful|stronger|grateful|thankful|encouraged|making progress|i can)\b/i },
  { state: "overwhelmed", re: /\b(overwhelm|too much|can'?t cope|breaking down|drowning|losing it)\b/i },
  { state: "anxious", re: /\b(anxious|panic|worried|nervous|scared|afraid|anxiety|on edge|racing)\b/i },
  { state: "sad", re: /\b(sad|down|depressed|grief|grieving|lonely|empty|crying|hurt|heartbroken)\b/i },
];

function classifyState(text) {
  const t = String(text || "").toLowerCase().trim();
  if (!t) return "calm";
  for (const { state, re } of STATE_PATTERNS) {
    if (re.test(t)) return state;
  }
  return "calm";
}

function pickReply(state) {
  const pool = REPLY_LIBRARY[state] || REPLY_LIBRARY.calm;
  return pool[Math.floor(Math.random() * pool.length)];
}

function safeState(value) {
  return STATES.includes(value) ? value : "calm";
}

router.post("/buddy", async (req, res) => {
  // === Validation: non-empty string, trimmed, <= 1000 chars ===
  const raw = typeof req.body?.message === "string" ? req.body.message : "";
  const message = raw.trim();

  if (!message) {
    return res.status(400).json({
      ok: false,
      error: "Please share a message so I can respond.",
      state: "calm",
      buddy: buildBuddyBlock("calm"),
    });
  }

  if (message.length > 1000) {
    return res.status(413).json({
      ok: false,
      error: "Message is too long. Please shorten it and try again.",
      state: "calm",
      buddy: buildBuddyBlock("calm"),
    });
  }

  // === Crisis short-circuit (server-canonical, BEFORE any AI/provider call) ===
  try {
    const verdict = await detectCrisisFacade(message);
    if (verdict?.crisis) {
      const baseReply = verdict?.response?.reply || pickReply("crisis");
      // Boundary guarantee: every crisis response includes the spec-required
      // "988 Suicide & Crisis Lifeline by calling or texting 988" phrase.
      const reply = ensureCrisisLineInText(baseReply);
      return res.json({
        ok: true,
        state: "crisis",
        text: reply,
        buddy: buildBuddyBlock("crisis"),
        crisis: true,
        resources: verdict?.response?.resources || [],
      });
    }
    if (verdict?.blocked) {
      return res.json({
        ok: true,
        state: "calm",
        text:
          verdict?.response?.reply ||
          "I can't help with that, but I can stay with you. What would feel supportive right now?",
        buddy: buildBuddyBlock("calm"),
      });
    }
  } catch (err) {
    logger?.warn?.("[buddy] crisis detection failed; continuing safely", {
      err: err?.message,
    });
    // Non-fatal — continue with normal flow.
  }

  // === Normal flow: classify -> reply ===
  const state = safeState(classifyState(message));
  const text = pickReply(state);

  return res.json({
    ok: true,
    state,
    text,
    buddy: buildBuddyBlock(state),
  });
});

export default router;
