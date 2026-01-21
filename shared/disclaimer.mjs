// =====================================================
// FILE: shared/disclaimer.mjs
// =====================================================

export const DISCLAIMER_TEXT = `This tool is designed for self-reflection and personal growth. 
It is not a substitute for professional mental health treatment, therapy, or crisis intervention.
If you are experiencing a mental health emergency, please contact emergency services or a crisis hotline.`;

export const MIRROR_DISCLAIMER = `Mirror responses are AI-generated reflections intended to support 
your self-awareness journey. They do not constitute professional advice or diagnosis.`;

export const JOURNALING_DISCLAIMER = `Journaling prompts are designed to encourage self-expression 
and reflection. Your entries are private and secure.`;

export function getDisclaimerText() {
  return DISCLAIMER_TEXT;
}

export function getMirrorDisclaimer() {
  return MIRROR_DISCLAIMER;
}

export function getJournalingDisclaimer() {
  return JOURNALING_DISCLAIMER;
}
