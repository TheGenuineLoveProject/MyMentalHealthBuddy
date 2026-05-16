export const toneRules = {
  allowed: [
    "you may",
    "you might notice",
    "if it feels helpful",
    "some people find",
    "one possibility is",
    "it's okay to",
    "when you're ready",
    "if you'd like",
    "take what serves you",
    "you know yourself best",
    "there's no right way",
    "whatever feels true",
    "in your own time",
    "this is optional",
    "you might consider",
    "some find it helpful to",
  ],

  blocked: [
    "you should",
    "you must",
    "you need to",
    "you have to",
    "fix yourself",
    "heal faster",
    "the right way is",
    "you're supposed to",
    "normal people",
    "just be positive",
    "snap out of",
    "get over it",
    "stop being",
    "what's wrong with you",
    "you're broken",
    "that's not healthy",
    "you're too sensitive",
    "just relax",
    "calm down",
    "don't be",
    "you always",
    "you never",
  ],

  replacements: {
    "you should": "you might consider",
    "you must": "you may choose to",
    "you need to": "one option is",
    "you have to": "you could",
    "fix yourself": "explore what feels right",
    "heal faster": "move at your own pace",
    "the right way": "one approach",
    "calm down": "take a moment if you'd like",
    "just relax": "find what helps you settle",
  } as Record<string, string>,
};

export function validateTone(text: string): {
  isValid: boolean;
  violations: string[];
  suggestions: string[];
} {
  const lowerText = text.toLowerCase();
  const violations: string[] = [];
  const suggestions: string[] = [];

  for (const blocked of toneRules.blocked) {
    if (lowerText.includes(blocked.toLowerCase())) {
      violations.push(blocked);
      const replacement = toneRules.replacements[blocked];
      if (replacement) {
        suggestions.push(`Replace "${blocked}" with "${replacement}"`);
      }
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    suggestions,
  };
}

export function passesVulnerabilityTest(text: string): boolean {
  const result = validateTone(text);
  return result.isValid;
}

export const VULNERABILITY_TEST = `
Every sentence must pass this test:
"If someone is vulnerable, tired, or misunderstood — would this still feel safe?"
If not, it must be rewritten.
`;
