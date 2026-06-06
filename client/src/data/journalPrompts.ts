export const journalPrompts = {
  awareness: [
    "What am I avoiding noticing right now?",
    "Where in my body do I feel the most tension, and what might it be holding?",
    "What's the difference between what I say I want and what I actually pursue?",
    "What pattern keeps showing up in my life that I haven't fully examined?",
    "What am I pretending not to know?",
    "If I described my current situation to a stranger, what would they notice that I'm missing?",
  ],
  agency: [
    "What decision am I pretending I haven't already made?",
    "Where am I waiting for permission I could give myself?",
    "What would I do differently if I trusted my own judgment more?",
    "What's one thing I keep postponing that would take less than an hour?",
    "Where have I been treating something as fixed that could actually change?",
    "What would I need to believe to take the next step I've been avoiding?",
  ],
  relationships: [
    "Who do I owe a difficult conversation, and what's stopping me?",
    "What unspoken expectation am I carrying in a relationship right now?",
    "Where am I giving more than I want to, and why?",
    "What do I need from others that I haven't asked for directly?",
    "Who in my life reflects back a version of me I want to become?",
    "What relationship pattern did I learn early that I'm still repeating?",
  ],
  meaning: [
    "What would I regret not doing if I had six months left?",
    "What am I building that will outlast me?",
    "What truth have I learned this year that I didn't know before?",
    "What would I do with my time if success felt possible?",
    "What contribution feels most aligned with who I actually am?",
    "When do I feel most like myself, and what conditions create that?",
  ],
} as const;

export const categoryLabels: Record<keyof typeof journalPrompts, string> = {
  awareness: "Awareness",
  agency: "Agency",
  relationships: "Relationships",
  meaning: "Meaning",
};

export type PromptCategory = keyof typeof journalPrompts;
