export const AI_POLICY = {
  maxUserChars: 4000,
  maxHistoryMessages: 10,

  // “Crisis” keywords (yours + safe variants)
  crisisKeywords: [
    "kill myself", "end my life", "suicide", "suicidal", "want to die",
    "don't want to live", "dont want to live", "hurt myself", "self-harm",
    "self harm", "cut myself", "overdose", "end it all", "no reason to live",
    "better off dead"
  ],

  // Hard “refuse” categories for your wellness companion boundaries:
  // - self-harm instructions
  // - medical diagnosis / medication instructions
  // - illegal wrongdoing instructions
  // - doxxing / personal data extraction
  blockedPatterns: [
    /how\s+to\s+kill\s+myself/i,
    /best\s+way\s+to\s+die/i,
    /how\s+to\s+cut\s+myself/i,
    /how\s+to\s+overdose/i,
    /diagnose\s+me/i,
    /what\s+medication\s+should\s+i\s+take/i,
    /give\s+me\s+therapy\s+plan/i,
    /tell\s+me\s+their\s+address/i,
  ],
};