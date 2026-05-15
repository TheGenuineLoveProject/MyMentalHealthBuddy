const blockedPhrases = [
  "you should",
  "fix yourself",
  "heal faster",
  "why haven’t you",
];

export function isSafeLanguage(text: string) {
  return !blockedPhrases.some((phrase) =>
    text.toLowerCase().includes(phrase)
  );
}