// client/src/copy/mood.ts

export const MOOD_COPY = {
  intro: {
    title: "Mood Check-in",
    question: "How are you feeling right now?"
  },

  tags: {
    label: "Add context (optional)",
    helper: "Choose up to two"
  },

  reflection: {
    prompt: "What feels most present for you in this moment?",
    summary: "You’re feeling {{mood}}. That makes sense."
  },

  nextStep: {
    label: "If you’d like, one small step could be:",
    options: [
      "Take one slow breath",
      "Write one sentence in your journal"
    ]
  },

  exit: {
    save: "Save mood",
    journal: "Journal",
    ai: "Reflect with AI",
    end: "End session"
  }
};