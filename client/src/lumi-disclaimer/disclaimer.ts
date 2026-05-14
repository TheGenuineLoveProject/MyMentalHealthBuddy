/**
 * @fileoverview Centralized Disclaimer System
 * @module lumi-disclaimer
 * @version 1.0.0
 * @since Phase 43
 */

export const REQUIRED_DISCLAIMER = "Journaling support only — not medical advice." as const;

export const REQUIRED_LOCATIONS = [
  "onboarding", "journaling", "reflections", "exports", "AI guidance",
  "settings", "footer systems", "API responses", "UI pages", "tests",
  "crisis pages", "mood entry", "thought records", "agent responses",
  "email templates", "push notifications",
] as const;

export const FULL_DISCLAIMER = `${REQUIRED_DISCLAIMER}\n\nIf you're in crisis, call or text 988 (Suicide & Crisis Lifeline) — 24/7.\nFor medical advice, consult a licensed healthcare professional.` as const;
export const SHORT_DISCLAIMER = REQUIRED_DISCLAIMER;
export const INLINE_DISCLAIMER = "[Journaling support — not medical advice]" as const;
export const API_DISCLAIMER = { disclaimer: REQUIRED_DISCLAIMER, type: "not_medical_advice" as const, required: true as const };

export function hasDisclaimer(text: string): boolean {
  return text.includes(REQUIRED_DISCLAIMER);
}

export function enforceDisclaimer(text: string): string {
  if (hasDisclaimer(text)) return text;
  return `${text.trim()}\n\n${REQUIRED_DISCLAIMER}`;
}

export function validateDisclaimers(entries: Record<string, string>): Array<{ location: string; present: boolean; text: string }> {
  return Object.entries(entries).map(([location, text]) => ({ location, present: hasDisclaimer(text), text }));
}

export function getDisclaimerForContext(context: (typeof REQUIRED_LOCATIONS)[number]): string {
  switch (context) {
    case "onboarding": return FULL_DISCLAIMER;
    case "API responses": return REQUIRED_DISCLAIMER;
    case "push notifications": return SHORT_DISCLAIMER;
    case "agent responses": return INLINE_DISCLAIMER;
    default: return REQUIRED_DISCLAIMER;
  }
}
