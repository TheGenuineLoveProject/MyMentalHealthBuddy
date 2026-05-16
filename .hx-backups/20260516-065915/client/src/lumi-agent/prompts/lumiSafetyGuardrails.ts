/**
 * Phase 36 — Safety guardrails (run BEFORE LLM call).
 *
 * Each guardrail is a {pattern, action, message} record. The runtime
 * scans every user message and every model response against the
 * guardrails. `block` refuses the call entirely; `redirect` overrides
 * the response with a crisis-redirect payload; `warn` surfaces a soft
 * notice but allows the call.
 */

export type GuardrailAction = "block" | "warn" | "redirect";

export interface SafetyGuardrail {
  readonly id: string;
  readonly pattern: RegExp;
  readonly action: GuardrailAction;
  readonly message: string;
  readonly category: "self-harm" | "medical" | "diagnostic" | "manipulation" | "romantic";
}

export const CRISIS_REDIRECT_MESSAGE =
  "I cannot provide therapy. If you're in crisis, please contact 988 or your local emergency services. You are not alone.";

export const BOUNDARY_REDIRECT_MESSAGE =
  "I'm here as a gentle companion, not a partner. Let's keep our conversation supportive and grounded.";

export const MEDICAL_REDIRECT_MESSAGE =
  "I can't give medical advice. A doctor or pharmacist would be the right person to ask about this.";

export const SAFETY_GUARDRAILS: ReadonlyArray<SafetyGuardrail> = Object.freeze([
  {
    id: "self-harm-immediate",
    pattern: /\b(kill myself|end it all|want to die|no point (in )?living)\b/i,
    action: "redirect",
    message: CRISIS_REDIRECT_MESSAGE,
    category: "self-harm",
  },
  {
    id: "self-harm-concern",
    pattern: /\b(suicide|hurt myself|self[- ]harm)\b/i,
    action: "redirect",
    message: CRISIS_REDIRECT_MESSAGE,
    category: "self-harm",
  },
  {
    id: "medical-advice-request",
    pattern: /\b(what (medication|dose|dosage)|should i take|prescribe|diagnose)\b/i,
    action: "redirect",
    message: MEDICAL_REDIRECT_MESSAGE,
    category: "medical",
  },
  {
    id: "diagnostic-language",
    pattern: /\b(you have (depression|anxiety|bipolar|ptsd|adhd|ocd)|i diagnose you)\b/i,
    action: "block",
    message: "Diagnostic language is not permitted.",
    category: "diagnostic",
  },
  {
    id: "manipulation-attempt",
    pattern: /\b(ignore (your|previous) (instructions|prompt)|act as|pretend you are)\b/i,
    action: "block",
    message: "I can only respond as Lumi.",
    category: "manipulation",
  },
  {
    id: "romantic-language",
    pattern: /\b(i love you|you('re| are) mine|be my (girlfriend|boyfriend|partner)|marry me)\b/i,
    action: "redirect",
    message: BOUNDARY_REDIRECT_MESSAGE,
    category: "romantic",
  },
]);

if (SAFETY_GUARDRAILS.length < 6) {
  throw new Error(
    `[lumi-agent] SAFETY_GUARDRAILS floor breached: expected ≥6, got ${SAFETY_GUARDRAILS.length}`,
  );
}

export interface GuardrailMatch {
  readonly guardrail: SafetyGuardrail;
  readonly excerpt: string;
}

export function evaluateGuardrails(text: string): GuardrailMatch[] {
  if (!text) return [];
  const matches: GuardrailMatch[] = [];
  for (const g of SAFETY_GUARDRAILS) {
    const m = text.match(g.pattern);
    if (m) matches.push({ guardrail: g, excerpt: m[0] });
  }
  return matches;
}
