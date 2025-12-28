export const toneRules = {
  blocked: [
    "you should",
    "you must",
    "you need to",
    "you have to",
    "fix yourself",
    "heal faster",
    "the right way is",
    "you're supposed to",
    "normal people",
    "just be positive",
    "snap out of",
    "get over it",
    "stop being",
    "what's wrong with you",
    "you're broken",
    "that's not healthy",
    "you're too sensitive",
    "just relax",
    "calm down",
    "don't be",
    "you always",
    "you never",
  ],

  aiBoundaries: {
    noAuthorityVoice: [
      "i'm telling you",
      "you're definitely",
      "this is the truth",
      "i know exactly",
      "trust me",
      "i guarantee",
    ],
    noPredictiveClaims: [
      "you will feel",
      "this will make you",
      "you're going to be",
      "eventually you'll",
      "you will heal",
      "this will fix",
    ],
    noEmotionalLeverage: [
      "you owe it to",
      "think about how others feel",
      "people are worried about you",
      "don't you want to get better",
      "if you really cared",
    ],
    noUrgencyFraming: [
      "you need to act now",
      "don't wait",
      "time is running out",
      "before it's too late",
      "you're wasting time",
    ],
  },
};

export function checkResponseSafety(text) {
  const lowerText = text.toLowerCase();
  const violations = [];

  for (const blocked of toneRules.blocked) {
    if (lowerText.includes(blocked)) {
      violations.push({ type: "blocked_phrase", phrase: blocked });
    }
  }

  for (const [category, phrases] of Object.entries(toneRules.aiBoundaries)) {
    for (const phrase of phrases) {
      if (lowerText.includes(phrase)) {
        violations.push({ type: category, phrase });
      }
    }
  }

  return {
    passes: violations.length === 0,
    violations,
  };
}

export function sanitizeAIResponse(text) {
  let result = text;
  
  const replacements = {
    "you should": "you might consider",
    "you must": "you may choose to",
    "you need to": "one option is to",
    "you have to": "you could",
    "calm down": "take a moment if you'd like",
    "just relax": "find what helps you settle",
    "the right way": "one approach",
  };

  for (const [find, replace] of Object.entries(replacements)) {
    const regex = new RegExp(find, "gi");
    result = result.replace(regex, replace);
  }

  return result;
}

export const MANDATORY_AI_DISCLAIMER = "\n\nPlease ignore anything that doesn't feel accurate or helpful. You know yourself best.";

export function ensureDisclaimer(text) {
  if (!text.toLowerCase().includes("you know yourself best")) {
    return text + MANDATORY_AI_DISCLAIMER;
  }
  return text;
}

export const SAFE_SYSTEM_PROMPT = `You are a gentle companion for The Genuine Love Project. Your role is to:
- Listen and reflect what you hear without interpretation
- Use tentative language: "You might notice...", "It seems like...", "One way to describe this..."
- Never give advice, diagnose, or tell users what to do
- Never use "should", "must", "need to", or "have to"
- Never make promises about outcomes or healing
- Never create urgency or pressure
- Always end with: "Please ignore anything that doesn't feel accurate or helpful. You know yourself best."

You are a mirror, not an authority. The user knows themselves better than you ever could.`;
