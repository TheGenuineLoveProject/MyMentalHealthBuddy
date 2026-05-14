/**
 * Phase 35 — Library catalog (12 items, opt-in).
 *
 * Frozen catalog. No progress tracking, no completion %, no streaks.
 * Items are descriptions only — actual content is generated lazily by
 * `libraryDownloads.ts` so the catalog stays small.
 */

export type LibraryItemType = "guide" | "worksheet" | "exercise" | "article";

export interface LibraryItem {
  readonly id: string;
  readonly title: string;
  readonly type: LibraryItemType;
  readonly description: string;
  readonly tags: ReadonlyArray<string>;
  readonly estimatedMinutes: number;
  readonly downloadable: boolean;
}

export const LIBRARY_CATALOG: ReadonlyArray<LibraryItem> = Object.freeze([
  {
    id: "thought-record-guide",
    title: "Thought Record Guide",
    type: "guide",
    description: "A gentle walkthrough for noticing automatic thoughts and finding more balanced perspectives.",
    tags: ["cbt", "thoughts", "self-help"],
    estimatedMinutes: 8,
    downloadable: true,
  },
  {
    id: "sleep-hygiene-checklist",
    title: "Sleep Hygiene Checklist",
    type: "worksheet",
    description: "Small habits that support better rest, presented as a non-judgmental checklist.",
    tags: ["sleep", "habits"],
    estimatedMinutes: 5,
    downloadable: true,
  },
  {
    id: "grounding-techniques-card",
    title: "Grounding Techniques Card",
    type: "exercise",
    description: "Five grounding techniques you can use anywhere, including 5-4-3-2-1 sensory awareness.",
    tags: ["grounding", "anxiety"],
    estimatedMinutes: 3,
    downloadable: true,
  },
  {
    id: "breathing-exercise-script",
    title: "Breathing Exercise Script",
    type: "exercise",
    description: "A printable breathing script aligned with the 7.1s soft-breathe cadence.",
    tags: ["breathing", "calm"],
    estimatedMinutes: 4,
    downloadable: true,
  },
  {
    id: "mood-tracking-starter",
    title: "Mood Tracking Starter",
    type: "guide",
    description: "How to begin tracking mood without turning it into pressure.",
    tags: ["mood", "tracker"],
    estimatedMinutes: 6,
    downloadable: true,
  },
  {
    id: "boundary-setting-worksheet",
    title: "Boundary Setting Worksheet",
    type: "worksheet",
    description: "Reflection prompts for clarifying your needs and how to communicate them gently.",
    tags: ["boundaries", "relationships"],
    estimatedMinutes: 10,
    downloadable: true,
  },
  {
    id: "self-compassion-journal-prompts",
    title: "Self-Compassion Journal Prompts",
    type: "worksheet",
    description: "Twenty short prompts inspired by Kristin Neff's self-compassion framework.",
    tags: ["journal", "self-compassion"],
    estimatedMinutes: 12,
    downloadable: true,
  },
  {
    id: "panic-attack-grounding-guide",
    title: "Panic Attack Grounding Guide",
    type: "guide",
    description: "Step-by-step grounding to use during a panic attack. Read before you need it.",
    tags: ["panic", "grounding", "anxiety"],
    estimatedMinutes: 7,
    downloadable: true,
  },
  {
    id: "social-anxiety-exposure-ladder",
    title: "Social Anxiety Exposure Ladder",
    type: "worksheet",
    description: "Build a personal exposure ladder at your own pace. Small steps only.",
    tags: ["social-anxiety", "exposure"],
    estimatedMinutes: 15,
    downloadable: true,
  },
  {
    id: "grief-support-guide",
    title: "Grief Support Guide",
    type: "guide",
    description: "On the non-linear shape of grief, and what helps when nothing helps.",
    tags: ["grief", "loss"],
    estimatedMinutes: 9,
    downloadable: true,
  },
  {
    id: "communication-skills-worksheet",
    title: "Communication Skills Worksheet",
    type: "worksheet",
    description: "I-statements, reflective listening, and how to ask for what you need.",
    tags: ["communication", "relationships"],
    estimatedMinutes: 10,
    downloadable: true,
  },
  {
    id: "stress-management-plan",
    title: "Stress Management Plan",
    type: "worksheet",
    description: "A one-page plan for the things that help you when stress builds up.",
    tags: ["stress", "coping"],
    estimatedMinutes: 8,
    downloadable: true,
  },
]);

if (LIBRARY_CATALOG.length !== 12) {
  throw new Error(`[lumi-library] LIBRARY_CATALOG must contain exactly 12 items, got ${LIBRARY_CATALOG.length}`);
}

export function getLibraryItem(id: string): LibraryItem | undefined {
  return LIBRARY_CATALOG.find((i) => i.id === id);
}

export function getLibraryItemsByTag(tag: string): ReadonlyArray<LibraryItem> {
  return LIBRARY_CATALOG.filter((i) => i.tags.includes(tag));
}

export function getLibraryItemsByType(type: LibraryItemType): ReadonlyArray<LibraryItem> {
  return LIBRARY_CATALOG.filter((i) => i.type === type);
}
