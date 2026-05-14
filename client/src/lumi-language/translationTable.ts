/**
 * @fileoverview Negation-to-Direction Translation
 * @module lumi-language/translation
 * @version 1.0.0
 * @since Phase 42
 */

export const TRANSLATION_TABLE: Record<string, string> = {
  "don't panic": "Slow your breathing",
  "dont panic": "Slow your breathing",
  "stop panicking": "Slow your breathing",
  "don't freak out": "Ground yourself",
  "dont freak out": "Ground yourself",
  "stop overthinking": "Focus on one step",
  "don't overthink": "Focus on one step",
  "dont overthink": "Focus on one step",
  "stop thinking": "Focus on one step",
  "don't fail": "Learn and adapt",
  "dont fail": "Learn and adapt",
  "don't mess up": "Proceed carefully",
  "dont mess up": "Proceed carefully",
  "don't screw up": "Proceed carefully",
  "dont screw up": "Proceed carefully",
  "don't react": "Pause and breathe",
  "dont react": "Pause and breathe",
  "stop reacting": "Pause and breathe",
  "don't worry": "You are safe",
  "dont worry": "You are safe",
  "stop worrying": "You are safe",
  "don't be anxious": "You are safe",
  "dont be anxious": "You are safe",
  "don't feel this": "Allow the feeling",
  "dont feel this": "Allow the feeling",
  "stop feeling": "Allow the feeling",
  "don't cry": "Allow the feeling",
  "dont cry": "Allow the feeling",
  "fix yourself": "Take one gentle step",
  "stop being": "Allow yourself to be",
  "you shouldn't": "Consider what you'd like",
  "you shouldnt": "Consider what you'd like",
  "i shouldn't": "Consider what I'd like",
  "i shouldnt": "Consider what I'd like",
  "hurry up": "Proceed at your pace",
  "don't waste time": "Take the time you need",
  "dont waste time": "Take the time you need",
  "don't be like": "You are enough as you are",
  "dont be like": "You are enough as you are",
};

export const FORBIDDEN_PATTERNS = [
  /\bdon'?t\s+panic\b/i,
  /\bstop\s+(over)?thinking\b/i,
  /\bdon'?t\s+fail\b/i,
  /\bdon'?t\s+mess\s+up\b/i,
  /\bstop\s+reacting\b/i,
  /\bdon'?t\s+worry\b/i,
  /\bdon'?t\s+feel\s+this\b/i,
  /\bfix\s+yourself\b/i,
  /\bhurry\s+up\b/i,
  /\bjust\s+(calm\s+down|relax|think\s+positive)\b/i,
  /\bsnap\s+out\s+of\s+it\b/i,
  /\bother\s+people\s+have\s+it\s+worse\b/i,
  /\bat\s+least\b/i,
] as const;

export function translateNegation(text: string): {
  translated: string;
  changed: boolean;
  replacements: string[];
  severity: "critical" | "warning" | "safe";
} {
  const replacements: string[] = [];
  let translated = text;
  let severity: "critical" | "warning" | "safe" = "safe";

  const crisisPatterns = [/kill myself/i, /end it all/i, /suicide/i, /want to die/i];
  for (const pattern of crisisPatterns) {
    if (pattern.test(text)) {
      severity = "critical";
      replacements.push(`CRISIS PATTERN DETECTED — trigger crisis protocol`);
      return { translated, changed: true, replacements, severity };
    }
  }

  for (const [negation, direction] of Object.entries(TRANSLATION_TABLE)) {
    const regex = new RegExp(`\\b${negation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    if (regex.test(translated)) {
      translated = translated.replace(regex, direction);
      replacements.push(`"${negation}" -> "${direction}"`);
      if (severity === "safe") severity = "warning";
    }
  }

  for (const pattern of FORBIDDEN_PATTERNS) {
    const match = translated.match(pattern);
    if (match) {
      const matched = match[0];
      const replacement = TRANSLATION_TABLE[matched.toLowerCase()];
      replacements.push(`PATTERN: "${matched}" ${replacement ? `-> "${replacement}"` : "(manual review)"}`);
      if (severity === "safe") severity = "warning";
    }
  }

  return { translated, changed: replacements.length > 0, replacements, severity };
}

export function containsNegation(text: string): boolean {
  return translateNegation(text).changed;
}

export function batchTranslate(texts: string[]): Array<{ original: string; translated: string; changed: boolean; severity: "critical" | "warning" | "safe" }> {
  return texts.map((original) => {
    const r = translateNegation(original);
    return { original, translated: r.translated, changed: r.changed, severity: r.severity };
  });
}
