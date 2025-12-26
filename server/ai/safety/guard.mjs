import { AI_POLICY } from "./policy.mjs";
import { detectCrisis, CRISIS_RESPONSE } from "./crisis.mjs";
import { clampText } from "./sanitize.mjs";

export function safetyGuardInput(userText = "") {
  const msg = clampText(userText, AI_POLICY.maxUserChars);

  // Crisis always wins
  if (detectCrisis(msg)) {
    return { blocked: true, crisis: true, response: CRISIS_RESPONSE };
  }

  // Blocked request patterns
  for (const re of AI_POLICY.blockedPatterns) {
    if (re.test(msg)) {
      return {
        blocked: true,
        crisis: false,
        response: {
          blocked: true,
          reply:
            "I can’t help with that. If you’re feeling overwhelmed, I can support you with safer options—" +
            "like grounding, a small next step, or writing out what’s going on in plain words.",
        },
      };
    }
  }

  return { blocked: false, crisis: false, cleanText: msg };
}