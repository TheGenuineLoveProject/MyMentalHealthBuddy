/**
 * Phase 32 — Cognitive Defusion exercises (ACT-derived, opt-in).
 *
 * Text-only delivery; no animations, no gamification, no completion %.
 */

export type DefusionExerciseType = "leaves-on-a-stream" | "labeling-thoughts" | "word-repetition";

export interface DefusionExercise {
  readonly type: DefusionExerciseType;
  readonly title: string;
  readonly estimatedMinutes: number;
  readonly instructions: ReadonlyArray<string>;
  readonly closingNote: string;
}

export const DEFUSION_EXERCISES: ReadonlyArray<DefusionExercise> = Object.freeze([
  {
    type: "leaves-on-a-stream",
    title: "Leaves on a Stream",
    estimatedMinutes: 5,
    instructions: Object.freeze([
      "Find a quiet place and sit comfortably.",
      "Imagine a slow stream with leaves drifting past on the surface.",
      "When a thought arrives, picture it written on one of the leaves.",
      "Watch the leaf carry the thought downstream. You don't push it. You don't follow it.",
      "If the stream stops or your mind wanders, simply notice and return to the image.",
      "Continue for as long as feels gentle.",
    ]),
    closingNote: "Thoughts are not facts. You don't have to act on every one that passes by.",
  },
  {
    type: "labeling-thoughts",
    title: "Labeling Thoughts",
    estimatedMinutes: 3,
    instructions: Object.freeze([
      "When a difficult thought shows up, pause.",
      "Silently say: \"I'm having the thought that ___\".",
      "Notice that you are the one observing the thought, not the thought itself.",
      "If the thought returns, label it again. No judgment.",
    ]),
    closingNote: "You are not your thoughts. You are the one noticing them.",
  },
  {
    type: "word-repetition",
    title: "Word Repetition",
    estimatedMinutes: 2,
    instructions: Object.freeze([
      "Pick a difficult word that's been on your mind.",
      "Say it aloud, slowly, for 30 seconds.",
      "Notice how the word starts to sound like a sound, not a meaning.",
      "Stop when ready.",
    ]),
    closingNote: "Words are sounds we attach meaning to. The meaning can soften.",
  },
]);

export function getDefusionExercise(type: DefusionExerciseType): DefusionExercise | undefined {
  return DEFUSION_EXERCISES.find((e) => e.type === type);
}
