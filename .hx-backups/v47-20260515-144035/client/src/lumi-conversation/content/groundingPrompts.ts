/**
 * Phase 15 (spec-aligned) — 15 grounding prompts.
 *
 * Contract: gentle, sensory, optional, with no required answer. None of
 * these prompts probe history, ask for diagnoses, or require disclosure.
 */

export type GroundingPrompt = {
  id: string;
  text: string;
  helperHint: string;
};

export const groundingPrompts: GroundingPrompt[] = [
  {
    id: "g01",
    text: "Notice one thing around you that feels safe or familiar.",
    helperHint: "You don't need to name it out loud. Just notice it for a moment.",
  },
  {
    id: "g02",
    text: "What can you hear right now, even if it's quiet?",
    helperHint: "Even silence counts. No need to share what comes up.",
  },
  {
    id: "g03",
    text: "Place a hand somewhere it feels steady — your chest, a knee, the edge of a chair.",
    helperHint: "If touch isn't right today, just notice somewhere your body meets something solid.",
  },
  {
    id: "g04",
    text: "Find one color in the room and stay with it for a slow breath.",
    helperHint: "Any color. There's no right one.",
  },
  {
    id: "g05",
    text: "Notice your feet — what they're touching, how they feel, whether they're warm or cool.",
    helperHint: "If you can't feel them clearly, just imagine them being there.",
  },
  {
    id: "g06",
    text: "If you have water nearby, take a small sip — slowly, and only if you'd like.",
    helperHint: "Hydration can settle the body. If you don't have any, that's okay too.",
  },
  {
    id: "g07",
    text: "Name one texture within reach — fabric, paper, wood, your sleeve.",
    helperHint: "You can stay with it for as long or short as feels right.",
  },
  {
    id: "g08",
    text: "Look gently around the room and find something curved or rounded.",
    helperHint: "The eye softens when it follows curves. No need to rush.",
  },
  {
    id: "g09",
    text: "Take one slower breath — about four seconds in, six seconds out.",
    helperHint: "If counting feels like too much, just breathe out a little longer than you breathe in.",
  },
  {
    id: "g10",
    text: "Notice the temperature of the air against your face or hands.",
    helperHint: "Warm, cool, neutral — anything counts.",
  },
  {
    id: "g11",
    text: "If your jaw or shoulders are holding tension, see if they want to soften — only a little.",
    helperHint: "A small softening is enough. You don't have to fully relax.",
  },
  {
    id: "g12",
    text: "Look out the nearest window or doorway, even if just for a moment.",
    helperHint: "If neither is reachable, looking at a calm image counts.",
  },
  {
    id: "g13",
    text: "Notice one thing in front of you that wasn't made by a human.",
    helperHint: "Daylight, plants, water, your own breath — anything.",
  },
  {
    id: "g14",
    text: "Press your feet softly into the floor and feel the ground holding you.",
    helperHint: "It's okay if the feeling is faint. The floor is there either way.",
  },
  {
    id: "g15",
    text: "Take a moment to notice that you are here, right now, in this quiet exchange.",
    helperHint: "Being here is enough. Nothing else is required.",
  },
];

export function pickGroundingPrompt(seed?: number): GroundingPrompt {
  const i =
    typeof seed === "number"
      ? ((seed % groundingPrompts.length) + groundingPrompts.length) % groundingPrompts.length
      : Math.floor(Math.random() * groundingPrompts.length);
  return groundingPrompts[i];
}

export const GROUNDING_PROMPT_COUNT = groundingPrompts.length;
