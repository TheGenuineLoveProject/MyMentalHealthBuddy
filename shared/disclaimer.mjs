// =====================================================
// FILE: shared/disclaimer.mjs
// Shared disclaimer constants for mental wellness platform
// =====================================================

export const DISCLAIMER_TEXT = `The Genuine Love Project provides general wellness support and self-help tools. This is not a substitute for professional mental health care, therapy, or medical advice. If you are experiencing a mental health crisis or emergency, please contact emergency services (911) or a crisis helpline immediately.`;

export const MIRROR_DISCLAIMER = `The Gentle Mirror feature offers supportive reflections based on your input. These reflections are AI-generated and should not be considered professional therapy or clinical advice. Please consult a licensed mental health professional for personalized care.`;

export const JOURNALING_DISCLAIMER = `Journal prompts and insights are designed to support your self-reflection journey. They are not a replacement for professional mental health services. If you're struggling, please reach out to a qualified therapist or counselor.`;

export const AI_CHAT_DISCLAIMER = `AI-assisted chat provides supportive conversation and wellness guidance. This is not therapy or professional counseling. For mental health concerns, please consult a licensed professional.`;

export const CRISIS_DISCLAIMER = `If you are in immediate danger or experiencing a mental health emergency, please call 911, go to your nearest emergency room, or contact the 988 Suicide & Crisis Lifeline.`;

export function getDisclaimerText() {
  return DISCLAIMER_TEXT;
}

export function getMirrorDisclaimer() {
  return MIRROR_DISCLAIMER;
}

export function getJournalingDisclaimer() {
  return JOURNALING_DISCLAIMER;
}
