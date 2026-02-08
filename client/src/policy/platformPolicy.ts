export const AGE_REQUIREMENT_TEXT = "For adults 18 and older";

export const NOT_THERAPY_TEXT = "This platform provides educational wellness tools, not therapy or counseling";

export const NOT_MEDICAL_ADVICE_TEXT = "This content is for educational purposes only and does not constitute medical advice";

export const FORBIDDEN_CLAIMS = [
  "cure",
  "diagnose", 
  "treat",
  "guarantee",
  "medical treatment",
  "therapy session",
  "clinical",
  "prescription",
  "licensed therapist",
  "mental health treatment"
] as const;

export const CRISIS_TEXT = "If you are in immediate danger, please contact local emergency services or a crisis helpline";

export const LEGAL_LINKS = {
  privacy: "/privacy",
  terms: "/terms",
  disclaimer: "/disclaimer",
  crisis: "/crisis"
} as const;

export const SAFE_LANGUAGE = {
  instead_of_therapy: "self-reflection tools",
  instead_of_treatment: "wellness practices",
  instead_of_cure: "support your reflection",
  instead_of_diagnose: "explore patterns",
  instead_of_guarantee: "may help you"
} as const;
