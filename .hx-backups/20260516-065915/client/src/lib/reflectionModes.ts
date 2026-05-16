export type ReflectionMode = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  questions: string[];
  closingPrompt: string;
};

export const reflectionModes: ReflectionMode[] = [
  {
    id: "narrative",
    name: "Narrative Mirror",
    subtitle: "Story-based reflection",
    description: "Explore your inner narrative — what story is playing right now?",
    icon: "BookOpen",
    questions: [
      "If this moment were a chapter in your life, what would you title it?",
      "What character are you playing right now — and who would you rather be?",
      "What story keeps repeating? You might notice it without needing to fix it.",
      "If you could rewrite one line of your inner dialogue today, what might it be?",
      "What ending are you afraid of — and what ending might you actually want?",
      "Is there a plot twist you've been avoiding?",
      "What would the wisest version of you whisper to you right now?",
    ],
    closingPrompt: "You're the author of what comes next. Take or leave any of this.",
  },
  {
    id: "somatic",
    name: "Somatic Scan",
    subtitle: "Body-centered awareness",
    description: "Notice what your body is holding — without needing to change it.",
    icon: "Heart",
    questions: [
      "Where in your body do you feel the most tension right now?",
      "If that area could speak, what might it say?",
      "What does your breathing tell you about your state?",
      "Is there a part of your body asking for attention?",
      "What would it feel like to soften your jaw and shoulders for 10 seconds?",
      "Where does safety live in your body?",
      "What sensation are you most avoiding right now?",
    ],
    closingPrompt: "Your body carries wisdom. Thank it for showing up today.",
  },
  {
    id: "systems",
    name: "Systems Thinking",
    subtitle: "Pattern recognition",
    description: "Zoom out — what systems and patterns are at play in your life?",
    icon: "Network",
    questions: [
      "What feedback loop are you caught in right now?",
      "If this challenge were a symptom, what might be the underlying system?",
      "What small input could create a different output?",
      "Who else is affected by the pattern you're noticing?",
      "What would change if you removed one variable from this situation?",
      "Where is there leverage — a small change with big impact?",
      "What are you optimizing for? Is that what you actually want?",
    ],
    closingPrompt: "Complex systems respond to small, consistent shifts. No rush.",
  },
  {
    id: "gratitude",
    name: "Appreciation Lens",
    subtitle: "What's working",
    description: "Notice what's already here — without forcing positivity.",
    icon: "Sun",
    questions: [
      "What's one thing that worked today, even slightly?",
      "Who showed up for you recently — even in a small way?",
      "What part of your body is functioning well right now?",
      "What did past-you do that current-you benefits from?",
      "What ordinary thing would you miss if it were gone?",
      "Where did you show up for yourself this week?",
      "What's one thing you're learning, even if it's hard?",
    ],
    closingPrompt: "Appreciation isn't about ignoring pain — it's about balance.",
  },
  {
    id: "shadow",
    name: "Shadow Work",
    subtitle: "Gentle integration",
    description: "Explore the parts of yourself you usually avoid — with compassion.",
    icon: "Moon",
    questions: [
      "What emotion are you least comfortable feeling?",
      "What trait do you criticize in others that might live in you too?",
      "What need are you ashamed of having?",
      "What would happen if you accepted the part of you that you hide?",
      "What is your anger protecting?",
      "What belief about yourself feels true but might not be?",
      "What would you do if you weren't afraid of being judged?",
    ],
    closingPrompt: "The shadow isn't bad — it's just unseen. You're allowed to look.",
  },
  {
    id: "values",
    name: "Values Alignment",
    subtitle: "Living by design",
    description: "Check in on whether your actions match your deepest values.",
    icon: "Compass",
    questions: [
      "What value did you honor today?",
      "Where is there a gap between what you say matters and what you do?",
      "What would your 80-year-old self say about how you're living?",
      "What are you tolerating that doesn't align with who you want to be?",
      "If you only had 5 values, what would they be?",
      "What's one action you could take today that aligns with your core value?",
      "What legacy are you building — intentionally or not?",
    ],
    closingPrompt: "Values are a compass, not a whip. You're allowed to recalibrate.",
  },
];

export function getRandomQuestion(modeId: string): string | null {
  const mode = reflectionModes.find((m) => m.id === modeId);
  if (!mode) return null;
  const idx = Math.floor(Math.random() * mode.questions.length);
  return mode.questions[idx];
}

export function getModeById(modeId: string): ReflectionMode | undefined {
  return reflectionModes.find((m) => m.id === modeId);
}

export default reflectionModes;
