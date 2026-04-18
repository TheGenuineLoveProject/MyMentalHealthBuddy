/**
 * Therapy Intelligence Layer
 * ---------------------------------------------------------------
 * Additive, non-destructive enhancement that wraps the normal
 * non-crisis reply produced by routes/ai.mjs.
 *
 * Hard rules:
 * - NEVER bypasses or replaces crisis detection (caller short-circuits first).
 * - NEVER mutates or drops the existing reply text.
 * - Pure functions only. No DB. No network. No side effects.
 * - Returns a structured `therapy` envelope that the frontend can
 *   render alongside the existing reply, or ignore entirely.
 *
 * Frameworks blended (educational, non-clinical):
 *   - Reflective listening (Rogers / Motivational Interviewing)
 *   - Somatic anchoring (Polyvagal-informed grounding)
 *   - Cognitive reframe (CBT-style, gentle, consent-based)
 *   - Micro-action (behavioral activation, one tiny step)
 *   - Self-compassion close (Neff)
 *
 * Voice always honors the project's standing rules:
 *   - Trauma-informed, non-clinical
 *   - Calm, consent-based language
 *   - "Take what serves you. You know yourself best." closer is preserved
 *     by the caller; this layer never duplicates it.
 */

const FEELING_LEXICON = {
  anxious: ["anxious", "panic", "panicky", "worried", "nervous", "on edge", "racing"],
  overwhelmed: ["overwhelmed", "too much", "can't cope", "cant cope", "drowning", "buried"],
  sad: ["sad", "down", "blue", "low", "hopeless", "empty", "numb", "lonely"],
  angry: ["angry", "mad", "furious", "resentful", "irritated", "frustrated"],
  ashamed: ["ashamed", "embarrassed", "guilty", "worthless", "stupid"],
  tired: ["tired", "exhausted", "drained", "burned out", "burnt out"],
  hopeful: ["hopeful", "better", "lighter", "calmer", "steady", "okay"],
};

const SOMATIC_ANCHORS = {
  anxious: "Place one hand on your chest, one on your belly. Let your exhale be a little longer than your inhale, just for three breaths.",
  overwhelmed: "Press both feet flat into the floor. Notice the support underneath you. You don't have to carry every piece in this minute.",
  sad: "If it feels okay, place a hand on your heart. You don't have to fix the sadness. You can just be with it for a moment.",
  angry: "Unclench your jaw. Drop your shoulders one inch. Let the breath out slowly through pursed lips.",
  ashamed: "Soften your gaze. Place a warm hand on your cheek or shoulder. The voice that judges you is not the whole truth.",
  tired: "Let your body be heavier than usual for a moment. Rest is information, not failure.",
  hopeful: "Notice where the steadiness lives in your body. That's a resource. You can return to it.",
  default: "Take one slow breath. Notice that you're here, reading this. That counts.",
};

const REFRAMES = {
  anxious: "Anxiety is often the body trying to protect you. It is not proof that something is wrong with you.",
  overwhelmed: "Feeling overwhelmed usually means the load is real, not that you are weak. Smaller pieces are still progress.",
  sad: "Sadness can be a signal that something matters. You are allowed to grieve, even quietly.",
  angry: "Anger often points to a value or a boundary. It is data, not a character flaw.",
  ashamed: "Shame says 'I am bad.' Compassion says 'I am human, and this is hard.' Try the second sentence.",
  tired: "Tiredness is honest feedback. Recovery is not a reward you earn — it is part of the work.",
  hopeful: "Hope doesn't have to be loud. Quiet steadiness is also a form of hope.",
  default: "Whatever you're feeling is allowed to be here. You don't have to justify it.",
};

const MICRO_ACTIONS = {
  anxious: "Name one thing in the room you can see, hear, and touch. Then decide what comes next.",
  overwhelmed: "Pick the one item that, if it were done, would lighten the rest. Just identify it. You don't have to do it yet.",
  sad: "Write one sentence: 'Right now, what I need most is ___.' You don't have to act on it.",
  angry: "Before responding, write the first draft of what you wish you could say — for your eyes only. Then decide.",
  ashamed: "Send yourself one sentence you would say to a friend in the same situation.",
  tired: "Schedule one act of rest in the next 24 hours, however small. Put it on the calendar like a meeting.",
  hopeful: "Write down one thing that helped today, so future-you can find it.",
  default: "Pick one small kind action toward yourself in the next 10 minutes. It can be very small.",
};

function detectPrimaryFeeling(text = "") {
  const t = String(text || "").toLowerCase();
  for (const [feeling, words] of Object.entries(FEELING_LEXICON)) {
    if (words.some((w) => t.includes(w))) return feeling;
  }
  return "default";
}

function detectAllFeelings(text = "") {
  const t = String(text || "").toLowerCase();
  const found = [];
  for (const [feeling, words] of Object.entries(FEELING_LEXICON)) {
    if (words.some((w) => t.includes(w))) found.push(feeling);
  }
  return found;
}

function reflectiveListenLead(feeling) {
  switch (feeling) {
    case "anxious":      return "It sounds like a lot is firing in your system right now.";
    case "overwhelmed":  return "It makes sense that this feels like too much at once.";
    case "sad":          return "I hear the weight in what you shared.";
    case "angry":        return "Something feels crossed, and that matters.";
    case "ashamed":      return "I'm glad you said this out loud, even just to me.";
    case "tired":        return "Your tiredness is real. It is not a character flaw.";
    case "hopeful":      return "It sounds like something is shifting, even a little.";
    default:             return "I'm here with you.";
  }
}

/**
 * upgradeTherapyReply(reply, { message, history })
 * ---------------------------------------------------------------
 * Wraps the existing reply with a structured therapy envelope.
 * The caller continues to send `reply` as the primary text.
 * The `therapy` object is additive metadata.
 */
export function upgradeTherapyReply(reply, opts = {}) {
  const message = String(opts?.message || "");
  const history = Array.isArray(opts?.history) ? opts.history : [];

  const primaryFeeling = detectPrimaryFeeling(message);
  const allFeelings = detectAllFeelings(message);

  return {
    reply, // unchanged, never mutated
    therapy: {
      version: "1.0.0",
      primaryFeeling,
      detectedFeelings: allFeelings,
      reflection: reflectiveListenLead(primaryFeeling),
      somaticAnchor: SOMATIC_ANCHORS[primaryFeeling] || SOMATIC_ANCHORS.default,
      reframe: REFRAMES[primaryFeeling] || REFRAMES.default,
      microAction: MICRO_ACTIONS[primaryFeeling] || MICRO_ACTIONS.default,
      consent: "Take only what fits. Skip what doesn't.",
      historyDepth: history.length,
    },
  };
}

/**
 * buildJournalSummary({ entries })
 * ---------------------------------------------------------------
 * Pure function. Accepts an array of entries (strings or
 * { content, created_at } objects) and returns themes, dominant
 * feelings, and one supportive observation.
 */
export function buildJournalSummary(opts = {}) {
  const raw = Array.isArray(opts?.entries) ? opts.entries : [];
  const texts = raw
    .map((e) => (typeof e === "string" ? e : e?.content || ""))
    .filter((s) => typeof s === "string" && s.trim().length > 0);

  if (texts.length === 0) {
    return {
      version: "1.0.0",
      entryCount: 0,
      dominantFeelings: [],
      themes: [],
      observation: "There are no entries to summarize yet. When you're ready, even one sentence is enough.",
      consent: "This is a reflection, not a diagnosis.",
    };
  }

  const feelingTally = {};
  for (const t of texts) {
    for (const f of detectAllFeelings(t)) {
      feelingTally[f] = (feelingTally[f] || 0) + 1;
    }
  }

  const dominantFeelings = Object.entries(feelingTally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([feeling, count]) => ({ feeling, count }));

  const THEME_KEYWORDS = {
    work:          ["work", "job", "boss", "deadline", "manager", "career"],
    relationships: ["partner", "spouse", "friend", "family", "mom", "dad", "sibling"],
    body:          ["sleep", "tired", "pain", "body", "eat", "appetite"],
    money:         ["money", "rent", "bills", "debt", "broke"],
    self:          ["myself", "identity", "purpose", "who am i", "meaning"],
    growth:        ["progress", "better", "learning", "trying", "practice"],
  };

  const themes = [];
  const joined = texts.join(" \n ").toLowerCase();
  for (const [theme, words] of Object.entries(THEME_KEYWORDS)) {
    if (words.some((w) => joined.includes(w))) themes.push(theme);
  }

  const top = dominantFeelings[0]?.feeling;
  const observation = top
    ? `Across ${texts.length} ${texts.length === 1 ? "entry" : "entries"}, "${top}" shows up most. That's worth noticing — not judging.`
    : `Across ${texts.length} ${texts.length === 1 ? "entry" : "entries"}, no single feeling dominates. That mix is human.`;

  return {
    version: "1.0.0",
    entryCount: texts.length,
    dominantFeelings,
    themes,
    observation,
    consent: "This is a reflection, not a diagnosis.",
  };
}

/**
 * buildCopingPlan({ message, mood, energy })
 * ---------------------------------------------------------------
 * Pure function. Produces a structured 4-step plan.
 * mood: optional string (e.g. "anxious", "sad")
 * energy: optional integer 1-5
 */
export function buildCopingPlan(opts = {}) {
  const message = String(opts?.message || "");
  const declaredMood = String(opts?.mood || "").toLowerCase().trim();
  const energyRaw = Number(opts?.energy);
  const energy = Number.isFinite(energyRaw) ? Math.max(1, Math.min(5, Math.round(energyRaw))) : null;

  const inferred = detectPrimaryFeeling(message);
  const feeling =
    declaredMood && (FEELING_LEXICON[declaredMood] || declaredMood === "default")
      ? declaredMood
      : inferred;

  const baseStep4 = MICRO_ACTIONS[feeling] || MICRO_ACTIONS.default;
  const step4 =
    energy !== null && energy <= 2
      ? `Make it even smaller than usual: ${baseStep4} If even that feels like too much, drink one glass of water and call that the win.`
      : baseStep4;

  return {
    version: "1.0.0",
    feeling,
    energy,
    plan: {
      step1_ground:    SOMATIC_ANCHORS[feeling] || SOMATIC_ANCHORS.default,
      step2_reflect:   reflectiveListenLead(feeling),
      step3_reframe:   REFRAMES[feeling] || REFRAMES.default,
      step4_microStep: step4,
    },
    reminder: "Take what serves you. You know yourself best.",
    consent: "This is supportive, not clinical. If risk feels real, please use 988 (US/Canada) or text HOME to 741741.",
  };
}

export default {
  upgradeTherapyReply,
  buildJournalSummary,
  buildCopingPlan,
};
