/**
 * Phase 15 (spec-aligned) — 40 calm responses across 8 emotional tones.
 *
 * Contract: 1-3 sentences each. No diagnosis, no false sentience, no
 * dependency invitations, no romantic register, no clinical authority.
 * Every response carries a permission/optionality phrase.
 *
 * Five responses per tone × 8 tones = 40 total.
 */

import type { EmotionalTone } from "../state/conversationState";

export type CalmResponse = string;

export const calmResponses: Record<EmotionalTone, CalmResponse[]> = {
  anxious: [
    "That sounds like a lot to be holding. You're allowed to take it slowly — no pressure.",
    "Anxiety can feel loud. If a slower breath helps, you can take one whenever you're ready.",
    "It's okay to not have an answer right now. Pausing is its own kind of progress, at your own pace.",
    "You're carrying something heavy. You don't have to figure it out all at once.",
    "What you're feeling is real. We can sit with it gently, for as long as you'd like.",
  ],
  sad: [
    "That sounds tender. You're allowed to feel sad without needing a reason to fix it.",
    "Sadness asks to be felt, not solved. Take it gently — there's no rush.",
    "It's okay to let this be heavy for a moment. You don't have to carry it alone, if you don't want to.",
    "Some days hold more weight. You're allowed to move slowly through this one.",
    "Thank you for trusting this moment with it. Whatever you do next, you can do it gently.",
  ],
  angry: [
    "That anger sounds like it's pointing to something that matters. You're allowed to feel it without acting on it.",
    "It's okay to be angry. We can let it have its space here, if you'd like.",
    "Anger can be a signal, not a verdict. You choose what to do with it, at your own pace.",
    "What you're feeling makes sense. There's no need to soften it for anyone right now.",
    "Anger sometimes just wants to be heard. We can give it that, gently.",
  ],
  lonely: [
    "Loneliness is a real ache. You're not the only one feeling it tonight, if that helps even a little.",
    "Being here matters. You don't have to fill the quiet with anything, if you don't want to.",
    "It's okay to long for someone. You're allowed to feel that without judgment.",
    "Connection isn't always close. You're still here, and that counts.",
    "We can stay with this for a moment, if you'd like. No pressure to do anything else.",
  ],
  overwhelmed: [
    "That sounds like a lot at once. You're allowed to put some of it down for now.",
    "Overwhelm often means you've been carrying too much for too long. Whatever feels right, you can pace it.",
    "You don't have to sort it all today. One small thing at a time is enough.",
    "It makes sense that this feels heavy. You're allowed to take a breath before the next step.",
    "When everything is loud, it's okay to choose just one thing — or none at all.",
  ],
  calm: [
    "That sounds steady. You're allowed to enjoy this quiet, at your own pace.",
    "Steady moments are worth noticing. We can stay here for a while, if you'd like.",
    "It's nice to hear you're settled. No need to do anything with it — calm is enough.",
    "You found a steady place. That counts.",
    "Resting in calm is its own kind of practice. You can stay as long as feels right.",
  ],
  grateful: [
    "Gratitude is a soft place to land. You can stay there for a moment, if you'd like.",
    "It's kind of you to notice. Whatever it is, you're allowed to let it warm you, at your own pace.",
    "Holding gratitude gently is enough. Nothing else is needed.",
    "Thank you for sharing that. You can carry it with you, however feels right.",
    "Even small noticings count. You're allowed to let this one stay a while.",
  ],
  ambivalent: [
    "It's okay to feel two things at once. Both are allowed.",
    "Mixed feelings make sense — you don't have to choose between them right now.",
    "Sometimes the truth is both. You can let both be here, at your own pace.",
    "It's okay to not know which feeling is louder. Pausing with both is enough.",
    "You're allowed to hold contradiction. We can sit with it, if you'd like.",
  ],
};

export function pickResponse(tone: EmotionalTone, turnIndex: number): CalmResponse {
  const bank = calmResponses[tone];
  if (!bank || bank.length === 0) {
    // Defense-in-depth: should never happen, but never throw on a user message.
    return "I'm here for this, gently. You can take it at your own pace.";
  }
  const idx = ((turnIndex % bank.length) + bank.length) % bank.length;
  return bank[idx];
}

export const CALM_RESPONSE_COUNT = Object.values(calmResponses).reduce(
  (n, arr) => n + arr.length,
  0,
);
