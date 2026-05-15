/**
 * Phase 35 — Library downloads (client-side content generation).
 *
 * No server. Content rendered to plain-text/Markdown at request time.
 * Every download appends the "Not a replacement for professional care"
 * disclaimer (governance Rule 2) and the /crisis pointer (Rule 5).
 */

import { getLibraryItem, type LibraryItem } from "./libraryCatalog";

export interface DownloadPayload {
  readonly content: string;
  readonly filename: string;
  readonly mimeType: string;
}

export const PROFESSIONAL_CARE_DISCLAIMER =
  "This material is for educational and self-help purposes only. It is not a replacement for professional mental health care. If you are in crisis, please reach 988 (US) or your local emergency services.";

const ITEM_BODIES: Readonly<Record<string, string>> = Object.freeze({
  "thought-record-guide": [
    "# Thought Record Guide",
    "",
    "1. Notice the situation.",
    "2. Write down the automatic thoughts that came up.",
    "3. Name the emotions and rate their intensity (0-10).",
    "4. List evidence for the thought.",
    "5. List evidence against the thought.",
    "6. Write a more balanced thought.",
    "7. Re-rate the emotions.",
  ].join("\n"),
  "sleep-hygiene-checklist": [
    "# Sleep Hygiene Checklist",
    "",
    "- [ ] Same wake time most days",
    "- [ ] Wind-down ritual 30 minutes before bed",
    "- [ ] Cool, dark, quiet room",
    "- [ ] Screens away an hour before sleep (when possible)",
    "- [ ] Caffeine cut-off after early afternoon",
    "- [ ] Bed for sleep and rest, not for work",
  ].join("\n"),
  "grounding-techniques-card": [
    "# Grounding Techniques",
    "",
    "5-4-3-2-1: Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.",
    "",
    "Box breathing: 4 in, 4 hold, 4 out, 4 hold.",
    "",
    "Cold water: hands or face.",
    "",
    "Body scan: feet → legs → torso → arms → head.",
    "",
    "Naming: \"I am here. It is [day]. I am safe right now.\"",
  ].join("\n"),
  "breathing-exercise-script": [
    "# Breathing Exercise Script (7.1s cycle)",
    "",
    "Inhale slowly for about 2.8 seconds.",
    "Hold gently for 0.4 seconds.",
    "Exhale slowly for 3.6 seconds.",
    "Rest for 0.3 seconds.",
    "Repeat for as many cycles as feels gentle.",
  ].join("\n"),
  "mood-tracking-starter": [
    "# Mood Tracking Starter",
    "",
    "Track once a day at most. Use a 1–5 scale (1 = Very Low, 5 = Very Good).",
    "Add a short note only if you want to. Skip days are fine. There is no streak.",
  ].join("\n"),
  "boundary-setting-worksheet": [
    "# Boundary Setting Worksheet",
    "",
    "1. What feels overwhelming or off?",
    "2. What do I need more of? Less of?",
    "3. What is one small request I could make?",
    "4. How would I phrase it gently?",
    "5. What support do I have if it goes badly?",
  ].join("\n"),
  "self-compassion-journal-prompts": [
    "# Self-Compassion Journal Prompts",
    "",
    "1. What would I say to a friend going through this?",
    "2. What part of me needs care right now?",
    "3. What is one kind thing I can offer myself today?",
    "(... 17 more prompts in the printable version.)",
  ].join("\n"),
  "panic-attack-grounding-guide": [
    "# Panic Attack Grounding",
    "",
    "Read this before you need it.",
    "",
    "1. Name what is happening: \"This is panic. It will pass.\"",
    "2. Slow your exhale. Make it longer than the inhale.",
    "3. Press feet into the floor. Notice the contact.",
    "4. 5-4-3-2-1 sensory grounding.",
    "5. Sip water. Notice the temperature.",
    "6. Wait. Panic peaks within minutes.",
  ].join("\n"),
  "social-anxiety-exposure-ladder": [
    "# Social Anxiety Exposure Ladder",
    "",
    "Rung 1 (easiest): A small step that feels just slightly uncomfortable.",
    "Rung 2: ...",
    "Rung 10 (hardest): A goal you might not reach for months. That is fine.",
    "",
    "Move at your pace. There is no schedule.",
  ].join("\n"),
  "grief-support-guide": [
    "# Grief Support Guide",
    "",
    "Grief is not linear. It does not follow stages in order.",
    "Some days are softer. Some days are sharper. Both are part of grief.",
    "Rest is part of grieving. Eating is part of grieving. Crying is part of grieving.",
  ].join("\n"),
  "communication-skills-worksheet": [
    "# Communication Skills Worksheet",
    "",
    "I-statements: \"I feel ___ when ___ because ___.\"",
    "Reflective listening: \"It sounds like you're feeling ___.\"",
    "Asking for what you need: \"Would you be open to ___?\"",
  ].join("\n"),
  "stress-management-plan": [
    "# Stress Management Plan",
    "",
    "When stress builds up, I will:",
    "1. Notice the early signs (shoulder tension / shallow breath / racing thoughts).",
    "2. Pause for a few breaths.",
    "3. Choose one of: a walk / a glass of water / texting a person who feels safe.",
    "4. Reach out for support if it stays high for more than a day.",
  ].join("\n"),
});

export class LibraryItemNotFoundError extends Error {
  constructor(itemId: string) {
    super(`[lumi-library] item not found: ${itemId}`);
    this.name = "LibraryItemNotFoundError";
  }
}

export function downloadItem(itemId: string): DownloadPayload {
  const item: LibraryItem | undefined = getLibraryItem(itemId);
  if (!item) throw new LibraryItemNotFoundError(itemId);
  if (!item.downloadable) throw new Error(`[lumi-library] item is not downloadable: ${itemId}`);
  const body = ITEM_BODIES[itemId] ?? `# ${item.title}\n\n${item.description}`;
  const content = [body, "", "---", "", PROFESSIONAL_CARE_DISCLAIMER].join("\n");
  return {
    content,
    filename: `${itemId}.md`,
    mimeType: "text/markdown;charset=utf-8",
  };
}
