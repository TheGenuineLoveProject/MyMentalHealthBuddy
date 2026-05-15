// client/src/content/modules/miContent.js
export const MI_CARD_SET = {
  oars: {
    title: "OARS",
    items: [
      { label: "Open question", text: "What matters most to you about changing this right now?" },
      { label: "Affirmation", text: "Name one strength you’re using to keep going—even if it’s small." },
      { label: "Reflection", text: "It sounds like part of you wants change, and part of you wants safety. What does each part need?" },
      { label: "Summary", text: "In one sentence: what are you choosing to try next, and why?" },
    ],
  },
  rulers: {
    title: "Importance / Confidence",
    items: [
      { label: "Importance (0–10)", text: "How important is this change to you today?" },
      { label: "Confidence (0–10)", text: "How confident are you that you can take one tiny step?" },
      { label: "If lower", text: "What would move it up by ONE point?" },
    ],
  },
  commitment: {
    title: "Micro-Commitment",
    items: [
      { label: "Tiny step", text: "What is the smallest next step you can do in under 2 minutes?" },
      { label: "When/where", text: "When and where will you do it?" },
      { label: "If-then", text: "If something gets in the way, what’s your backup plan?" },
    ],
  },
};