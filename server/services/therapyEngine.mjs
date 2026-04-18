export function detectTherapyMode(message = "") {
  const text = message.toLowerCase();

  if (
    text.includes("panic") ||
    text.includes("anxious") ||
    text.includes("overwhelmed") ||
    text.includes("ground") ||
    text.includes("calm down")
  ) {
    return "dbt_grounding";
  }

  if (
    text.includes("thought") ||
    text.includes("thinking") ||
    text.includes("worried") ||
    text.includes("catastroph") ||
    text.includes("what if")
  ) {
    return "cbt_reframe";
  }

  if (
    text.includes("numb") ||
    text.includes("sad") ||
    text.includes("lonely") ||
    text.includes("hurt") ||
    text.includes("grief")
  ) {
    return "emotion_reflection";
  }

  return "supportive_reflection";
}

export function buildTherapySystemAddendum(mode = "supportive_reflection") {
  const common = `
Use short paragraphs.
Be warm, nonjudgmental, and non-clinical.
Do not diagnose.
Do not promise outcomes.
Do not use forceful commands.
Do not shame, pressure, or moralize.
End with: "Take what serves you. You know yourself best."
`;

  const variants = {
    dbt_grounding: `
Focus on present-moment grounding.
Offer 1-2 very small stabilizing steps only.
Prefer body + breath + sensory orientation.
Use language like: "You might try..." or "One option is..."
`,
    cbt_reframe: `
Gently identify possible thought patterns without labeling them clinically.
Offer one softer alternative perspective.
Do not argue with the user.
Use tentative phrasing like: "It may be possible that..."
`,
    emotion_reflection: `
Prioritize naming and validating emotion.
Reflect themes back clearly.
Do not rush into fixing.
If offering a next step, keep it extremely small.
`,
    supportive_reflection: `
Reflect, validate, and clarify.
Offer one optional next step only if it fits naturally.
`
  };

  return `${common}\n${variants[mode] || variants.supportive_reflection}`;
}

export function generateFallbackReply(message = "", mode = "supportive_reflection") {
  const text = message.toLowerCase();

  if (mode === "dbt_grounding") {
    return `It sounds like your system may be carrying a lot right now. You might try one very small grounding step: press both feet into the floor and take one slow breath out longer than the breath in. If it helps, name 3 things you can see around you. Take what serves you. You know yourself best.`;
  }

  if (mode === "cbt_reframe") {
    return `It makes sense that your mind is trying to protect you by scanning for what could go wrong. One gentler possibility is that the pressure may feel absolute right now, even if the full picture is a little wider than this moment makes it seem. Take what serves you. You know yourself best.`;
  }

  if (mode === "emotion_reflection") {
    return `It sounds like something here is carrying real weight for you. Even putting words to it matters. You do not have to solve everything in one step, and it may be enough right now just to notice what feels most present. Take what serves you. You know yourself best.`;
  }

  return `It seems like you're carrying a lot right now. Even naming that here matters. If it feels supportive, you might stay with just one part of what feels heaviest instead of the whole thing at once. Take what serves you. You know yourself best.`;
}
