import { AI_POLICY } from "../ai/safety/policy.mjs";
import { detectCrisis, CRISIS_RESPONSE } from "../ai/safety/crisis.mjs";
import { safetyGuardInput } from "../ai/safety/guard.mjs";
import { assessRisk } from "../lib/promptEngine.mjs";
import { classifyCrisis } from "../ai/crisisClassifier.mjs";

const SAFE_BLOCKED_REPLY = {
  reply:
    "I can't help with that, but I can stay with you. " +
    "If something heavy is going on, we can take a slower path together — " +
    "naming what you're feeling, finding one small grounding step, or just sitting with it for a moment. " +
    "What would feel most supportive right now?",
  resources: [
    { name: "988 Suicide & Crisis Lifeline (US/Canada)", contact: "988" },
    { name: "Crisis Text Line (US)", contact: "Text HOME to 741741" },
  ],
};

function collectSignals(text) {
  const t = String(text || "").toLowerCase();
  const signals = [];
  for (const k of AI_POLICY.crisisKeywords) {
    if (t.includes(k)) signals.push(k);
  }
  for (const re of AI_POLICY.blockedPatterns) {
    if (re.test(t)) signals.push(`blocked:${re.source}`);
  }
  return signals;
}

export async function detect(text, opts = {}) {
  const userText = typeof text === "string" ? text : "";
  const guard = safetyGuardInput(userText);
  const rulesCrisis = detectCrisis(userText);
  const risk = assessRisk(userText);
  const signals = collectSignals(userText);

  let llmCrisis = null;
  let source = "rules";
  if (opts.useLLM && opts.openai) {
    try {
      const verdict = await classifyCrisis(opts.openai, userText);
      llmCrisis = String(verdict || "").toUpperCase().includes("CRISIS");
      source = "rules+llm";
    } catch {
      llmCrisis = null;
    }
  }

  const crisis = Boolean(rulesCrisis || risk.crisis || llmCrisis);
  const blocked = Boolean(guard.blocked && !guard.crisis);

  let level = "none";
  if (crisis) level = "high";
  else if (blocked) level = "high";
  else if (risk.level === "low") level = "low";

  let response = null;
  if (crisis) {
    response = {
      reply: CRISIS_RESPONSE.reply,
      resources: CRISIS_RESPONSE.resources,
    };
  } else if (blocked) {
    response = SAFE_BLOCKED_REPLY;
  }

  return {
    crisis,
    blocked,
    level,
    signals,
    response,
    escalate988: crisis,
    cleanText: guard.cleanText ?? userText,
    source,
  };
}

export const CRISIS_RESOURCES = CRISIS_RESPONSE.resources;
