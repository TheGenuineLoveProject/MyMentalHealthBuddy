const FORBIDDEN_PATTERNS = [
  { pattern: /\b(cure|cures|cured|curing)\b/i, reason: "Avoid medical claims — use 'support' or 'explore' instead" },
  { pattern: /\bthis will (fix|heal|cure|solve|treat)\b/i, reason: "Avoid definitive outcome claims" },
  { pattern: /\bguaranteed?\b/i, reason: "Avoid guarantees — wellness is personal and non-linear" },
  { pattern: /\bdiagnos(e|is|ed|ing)\b/i, reason: "Avoid diagnostic language — this is educational, not clinical" },
  { pattern: /\bprescri(be|ption|bed)\b/i, reason: "Avoid prescriptive medical language" },
  { pattern: /\btreat(ment|ing|s)?\b(?!\s+(yourself|others|people|each|one another)\s+(with|to)\s+(kindness|compassion|respect|care|love|grace|gentleness))/i, reason: "Avoid clinical treatment language unless paired with compassion framing" },
  { pattern: /\bhurry\b.*\b(before|now|today)\b/i, reason: "Avoid urgency manipulation" },
  { pattern: /\blast chance\b/i, reason: "Avoid scarcity/urgency manipulation" },
  { pattern: /\bdon'?t miss\b/i, reason: "Avoid FOMO language" },
  { pattern: /\byou should be ashamed\b/i, reason: "Avoid shame-based language" },
  { pattern: /\byou'?re (broken|damaged|wrong|failing)\b/i, reason: "Avoid pathologizing language" },
  { pattern: /\bif you don'?t .* you'?ll\b/i, reason: "Avoid fear-based conditional threats" },
];

const SENSITIVE_TOPICS = [
  /\bsuicid(e|al)\b/i,
  /\bself[- ]?harm\b/i,
  /\babuse\b/i,
  /\bdomestic violence\b/i,
  /\beating disorder\b/i,
  /\baddiction\b/i,
  /\btrauma\b/i,
  /\bptsd\b/i,
];

export function validatePublishingContent(title, excerpt, body) {
  const errors = [];
  const warnings = [];
  const combined = `${title || ""} ${excerpt || ""} ${body || ""}`;

  for (const { pattern, reason } of FORBIDDEN_PATTERNS) {
    if (pattern.test(combined)) {
      errors.push(reason);
    }
  }

  const touchesSensitiveTopic = SENSITIVE_TOPICS.some(p => p.test(combined));
  if (touchesSensitiveTopic) {
    const hasCrisisLink = /crisis|988|hotline|lifeline|emergency|help\s*line/i.test(combined);
    if (!hasCrisisLink) {
      warnings.push("Content touches sensitive topics — consider including a crisis support link (e.g., /crisis or 988 Lifeline)");
    }
  }

  if (!body || body.trim().length < 50) {
    errors.push("Body content is too short to publish (minimum 50 characters)");
  }

  if (!title || title.trim().length < 3) {
    errors.push("Title is required (minimum 3 characters)");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
