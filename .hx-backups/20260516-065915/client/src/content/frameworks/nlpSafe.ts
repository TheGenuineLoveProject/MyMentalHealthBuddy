export const NLP_SAFE = {
  name: "Language Tools (Ethical NLP-Inspired)",
  rules: [
    "No coercion. No guaranteed claims. No replacing professional care.",
    "Use language to reduce shame, increase agency, and clarify next steps.",
  ],
  tools: [
    { name: "Name → Normalize → Next", example: "I feel anxious → That’s human → One tiny step: breathe + write 3 lines." },
    { name: "Yet Reframe", example: "I can’t do this → I can’t do this yet." },
    { name: "Choice Point", example: "Right now I can choose comfort, courage, or both—what’s smallest?" },
  ],
} as const;