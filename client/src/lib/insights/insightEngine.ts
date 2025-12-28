export type InsightCard = {
  title: string;
  body: string;
  tag?: "Name it" | "Normalize it" | "Next kind step";
  subtitle?: string;
  badge?: string;
};

export type EngineOutput = {
  cards: InsightCard[];
  tags: string[];
};

function clampText(s: string, max = 320) {
  const t = (s || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

const EMOTION_MAP: { label: string; keywords: string[] }[] = [
  { label: "Overwhelmed", keywords: ["overwhelmed", "too much", "drowning", "flood", "pressure"] },
  { label: "Anxious", keywords: ["anxious", "worried", "panic", "nervous", "afraid"] },
  { label: "Sad", keywords: ["sad", "down", "heavy", "cry", "grief", "hurt"] },
  { label: "Angry", keywords: ["angry", "mad", "furious", "resent", "irritated"] },
  { label: "Lonely", keywords: ["lonely", "alone", "isolated", "no one", "left out"] },
  { label: "Stuck", keywords: ["stuck", "blocked", "can't", "trapped", "frozen"] },
  { label: "Self-doubt", keywords: ["doubt", "not good", "fail", "mess", "imposter", "worthless"] },
  { label: "Tired", keywords: ["tired", "exhausted", "burnout", "sleepy", "drained"] },
  { label: "Hopeful", keywords: ["hope", "better", "trust", "calm", "peace", "grateful"] },
];

const NORMALIZE_LINES = [
  "It makes sense you feel this way — your system is trying to protect you.",
  "You're not 'wrong' for feeling this. Feelings are information, not a verdict.",
  "Many humans feel this. You're having a human moment, and you're allowed to slow down.",
  "Nothing about this makes you unworthy. You're learning, not failing.",
];

const NEXT_KIND_STEPS = [
  "Take 5 slow breaths. Inhale 4… exhale 6… and repeat.",
  "Name 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, 1 you can taste.",
  "Put a hand on your chest and say: 'I'm here. I can take one kind step.'",
  "Drink water and do a 60-second shoulder roll + jaw unclench.",
  "Write one sentence: 'Right now, I need _____.' No fixing — just honesty.",
];

function pick<T>(arr: T[], seed: number) {
  return arr[Math.abs(seed) % arr.length];
}

function hashSeed(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return h;
}

function detectTags(text: string): string[] {
  const t = text.toLowerCase();
  const tags: string[] = [];

  for (const e of EMOTION_MAP) {
    if (e.keywords.some((k) => t.includes(k))) tags.push(e.label);
  }

  if (t.includes("sleep") || t.includes("insomnia")) tags.push("Sleep");
  if (t.includes("work") || t.includes("job") || t.includes("boss")) tags.push("Work");
  if (t.includes("relationship") || t.includes("partner") || t.includes("family")) tags.push("Relationships");

  return Array.from(new Set(tags)).slice(0, 5);
}

function emotionGuess(tags: string[]) {
  const primary = tags.find((x) => !["Sleep", "Work", "Relationships"].includes(x));
  return primary ?? "Present moment";
}

export function buildInsightCards(reflectionText: string): EngineOutput {
  const safeText = (reflectionText ?? "").trim();
  const seed = hashSeed(safeText || "seed");

  const tags = detectTags(safeText);
  const primary = emotionGuess(tags);

  const nameIt: InsightCard = {
    title: "Name it",
    subtitle: "A gentle label can reduce intensity",
    body:
      primary === "Present moment"
        ? "You may be in a tender moment. If you want, choose a word: calm / heavy / tense / tender / unsure."
        : `This sounds like: ${primary}. (You can rename it — you're in charge.)`,
    badge: "Clarity",
  };

  const normalizeIt: InsightCard = {
    title: "Normalize it",
    subtitle: "Validation without judgment",
    body: pick(NORMALIZE_LINES, seed),
    badge: "Kindness",
  };

  const nextStep: InsightCard = {
    title: "Next kind step",
    subtitle: "Small actions create safety",
    body: pick(NEXT_KIND_STEPS, seed + 7),
    badge: "Action (2 min)",
  };

  return { cards: [nameIt, normalizeIt, nextStep], tags };
}

export function buildSimpleInsightCards(input: {
  text: string;
  summary?: string;
  themes?: string[];
}): InsightCard[] {
  const text = clampText(input.text, 320);
  const themes = (input.themes || []).slice(0, 3);

  const themeLine =
    themes.length > 0 ? `Themes you may be touching: ${themes.join(", ")}.` : "";

  return [
    {
      tag: "Name it",
      title: "Name what's here",
      body:
        `In one sentence, what feeling is most present right now? ` +
        `Try: "Right now I'm feeling ___." ` +
        (themeLine ? ` ${themeLine}` : ""),
    },
    {
      tag: "Normalize it",
      title: "You're not weird for this",
      body:
        `If you're having a hard moment, it makes sense your mind wants safety. ` +
        `This is a human response — not a personal failure.`,
    },
    {
      tag: "Next kind step",
      title: "One kind next step",
      body:
        `Choose one gentle action that supports you in the next 5 minutes: ` +
        `drink water, breathe slowly 5 times, unclench your jaw, write one honest line.`,
    },
  ];
}
