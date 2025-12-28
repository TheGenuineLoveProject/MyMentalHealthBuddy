export const journalPrompts = {
  awareness: [
    "What am I avoiding noticing right now?",
    "Where in my body do I feel the most tension, and what might it be holding?",
  ],
  agency: [
    "What decision am I pretending I haven't already made?",
    "Where am I waiting for permission I could give myself?",
    "What would I do differently if I trusted my own judgment more?",
  ],
  relationships: [
    "Who do I owe a difficult conversation, and what's stopping me?",
    "What unspoken expectation am I carrying in a relationship right now?",
  ],
  meaning: [
    "What would I regret not doing if I had six months left?",
    "What am I building that will outlast me?",
    "What truth have I learned this year that I didn't know before?",
  ],
};

export function getRandomPrompt(category) {
  const prompts = journalPrompts[category];
  if (!prompts) return null;
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function getDailyPrompt() {
  const categories = Object.keys(journalPrompts);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const categoryIndex = dayOfYear % categories.length;
  const category = categories[categoryIndex];
  const prompts = journalPrompts[category];
  const promptIndex = dayOfYear % prompts.length;
  return { category, prompt: prompts[promptIndex] };
}
