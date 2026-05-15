/**
 * Phase 15 (spec-aligned) — 15 reflection prompts.
 *
 * Contract: open, gentle, never required, never probing for trauma history.
 * The reflection card always carries the "no required answer" affordance.
 */

export type ReflectionPrompt = {
  id: string;
  text: string;
  helperHint: string;
};

export const reflectionPrompts: ReflectionPrompt[] = [
  {
    id: "r01",
    text: "What feels heaviest right now?",
    helperHint: "A word or a phrase is enough. There's no required answer.",
  },
  {
    id: "r02",
    text: "If today had a color, what color would it be?",
    helperHint: "Any answer fits — playful, dark, soft, bright. No interpretation needed.",
  },
  {
    id: "r03",
    text: "Is there one small thing that felt kind today, even if barely?",
    helperHint: "It can be tiny — a sip of water, a breath, a moment of quiet.",
  },
  {
    id: "r04",
    text: "What part of you needs the most softness today?",
    helperHint: "There's no wrong answer. Sometimes it's a feeling, sometimes a body part, sometimes just 'all of me'.",
  },
  {
    id: "r05",
    text: "Is there something you've been carrying that you'd like to set down for a moment?",
    helperHint: "Naming it counts as setting it down, even briefly.",
  },
  {
    id: "r06",
    text: "What would 'gentle' look like for the next ten minutes of your day?",
    helperHint: "It can be as small as a slower breath or as concrete as a glass of water.",
  },
  {
    id: "r07",
    text: "Is there a feeling you've been ignoring that's quietly asking for attention?",
    helperHint: "You don't have to do anything with it — just noticing is enough.",
  },
  {
    id: "r08",
    text: "Who or what helps you feel a little more like yourself?",
    helperHint: "It can be a person, a place, a song, or even a memory.",
  },
  {
    id: "r09",
    text: "If your body could ask for one thing right now, what might it be?",
    helperHint: "Rest, water, stillness, movement, warmth — anything is valid.",
  },
  {
    id: "r10",
    text: "What's something you don't have to figure out today?",
    helperHint: "Naming what can wait can be its own kind of relief.",
  },
  {
    id: "r11",
    text: "Is there a small kindness you could offer yourself in the next hour?",
    helperHint: "It doesn't have to be big or productive. Tiny counts.",
  },
  {
    id: "r12",
    text: "What does 'enough' look like, just for today?",
    helperHint: "Not perfect. Not finished. Just enough.",
  },
  {
    id: "r13",
    text: "Is there something you wish someone would say to you right now?",
    helperHint: "If you'd like, you can write it to yourself.",
  },
  {
    id: "r14",
    text: "What's one thing you'd like the rest of today to be free of?",
    helperHint: "Pressure, noise, comparison — naming it can soften it.",
  },
  {
    id: "r15",
    text: "If this moment had a wish for you, what might it be?",
    helperHint: "There are no required answers. You can leave it open.",
  },
];

export function pickReflectionPrompt(seed?: number): ReflectionPrompt {
  const i =
    typeof seed === "number"
      ? ((seed % reflectionPrompts.length) + reflectionPrompts.length) %
        reflectionPrompts.length
      : Math.floor(Math.random() * reflectionPrompts.length);
  return reflectionPrompts[i];
}

export const REFLECTION_PROMPT_COUNT = reflectionPrompts.length;
