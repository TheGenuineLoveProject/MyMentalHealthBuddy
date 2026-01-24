// /content/microcopy/wellnessMicrocopy.js
// @generated — deterministic microcopy library (Wellness)
// Notes: Original text. Inclusive, consent-led, legally safer. No medical claims.

export const wellnessMicrocopy = {
  consent: [
    "Only if it feels okay.",
    "You’re in charge here.",
    "Take what fits, leave the rest.",
    "You can stop at any time.",
    "Go at your pace.",
  ],
  pacing: [
    "Slow is strong.",
    "One small step is enough.",
    "Let this be gentle.",
    "No need to force anything.",
    "We’re aiming for “a little better,” not perfect.",
  ],
  grounding: [
    "Feel your feet. Notice the support underneath you.",
    "Look around and name one safe, neutral thing you can see.",
    "Notice one sound. Then another.",
    "Touch something nearby and feel its texture.",
    "Let your shoulders soften by one percent.",
  ],
  reassurance: [
    "Nothing is wrong with you for feeling this.",
    "This is a human response.",
    "You’re allowed to take breaks.",
    "It’s okay if this doesn’t help today.",
    "You’re doing the best you can with what you have right now.",
  ],
  exits: [
    "If anything feels too intense, open your eyes, look around, and return to the room.",
    "You can pause, sip water, or switch to a simpler step.",
    "Try a shorter version, or come back later.",
    "If this stirs discomfort, choose comfort over completion.",
  ],
  safety: [
    "If you feel unsafe or in immediate danger, contact local emergency services.",
    "If you need urgent support, visit Crisis Resources.",
    "If this brings up overwhelm, choose support and safety first.",
  ],
  reflection: [
    "What changed, even slightly?",
    "What feels a touch softer right now?",
    "What do you need next: rest, water, movement, or connection?",
    "What would be the kindest next step?",
  ],
  encouragement: [
    "Tiny steps count.",
    "You can try again when you’re ready.",
    "Gentle repetition builds safety.",
    "Even noticing is progress.",
  ],
};

// Deterministic “pick” based on a string seed.
export function pick(seed, list) {
  const s = String(seed || "");
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return list[h % list.length];
}

// Tier templates: consistent across all Wellness pages.
export function buildTierCopy({ routeKey, tier }) {
  const k = `${routeKey}:${tier}`;
  const consent = pick(k, wellnessMicrocopy.consent);
  const pacing = pick(`${k}:pacing`, wellnessMicrocopy.pacing);
  const reassurance = pick(`${k}:reassure`, wellnessMicrocopy.reassurance);
  const exit = pick(`${k}:exit`, wellnessMicrocopy.exits);

  const commonFooter = {
    consent,
    pacing,
    reassurance,
    pauseLine: "Pause or stop anytime. You’re in control.",
    exitLine: exit,
  };

  const tiers = {
    micro10s: {
      label: "10 seconds",
      intent: "A quick reset you can do anywhere.",
      ...commonFooter,
    },
    short1to3: {
      label: "1–3 minutes",
      intent: "A short practice to steady your attention.",
      ...commonFooter,
    },
    deep3to10: {
      label: "3–10 minutes",
      intent: "A deeper practice for when you have more space.",
      ...commonFooter,
    },
  };

  return tiers[tier];
}