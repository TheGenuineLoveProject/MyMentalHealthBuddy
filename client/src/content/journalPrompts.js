/**
 * Journal Prompts with MI (Motivational Interviewing) Integration
 * 
 * Combines traditional reflection prompts with MI principles:
 * - Autonomy: You choose what feels right
 * - Evocation: Drawing out your own wisdom
 * - Collaboration: Partnership in exploration
 * - Compassion: Non-judgmental support
 */

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
};

export const miEnhancedPrompts = {
  readiness: {
    label: "Readiness Check",
    description: "Exploring where you are right now—no pressure to change",
    prompts: [
      { question: "On a scale of 1–10, how ready do you feel to explore this area?", followUp: "What would move you one number higher?" },
      { question: "What part of you wants change? What part doesn't?", followUp: "Both parts have wisdom—what might they be saying?" },
      { question: "If this changed tomorrow, what would be different?", followUp: "How important is that difference to you?" },
      { question: "What would 'success' look like for you here?", followUp: "What's one small sign you'd notice first?" },
    ]
  },
  strengths: {
    label: "Strengths Discovery",
    description: "Recognizing what's already working in your life",
    prompts: [
      { question: "What helped you get through hard things before?", followUp: "How might that same quality help now?" },
      { question: "What are you already doing well, even if imperfectly?", followUp: "What would it mean to do a little more of that?" },
      { question: "What would someone who loves you say about your strengths?", followUp: "Can you allow that to be true?" },
      { question: "What resources—internal or external—do you already have?", followUp: "Which one feels most accessible right now?" },
    ]
  },
  ambivalence: {
    label: "Holding Complexity",
    description: "Making space for mixed feelings without rushing resolution",
    prompts: [
      { question: "What's one thing you both want and fear?", followUp: "How does it feel to name both sides?" },
      { question: "Where are you saying 'yes' when you mean 'maybe'?", followUp: "What would it take to be more honest?" },
      { question: "What are you not ready to change—and is that okay for now?", followUp: "What support would help when you are ready?" },
      { question: "What would happen if you stopped pushing yourself?", followUp: "What might self-compassion look like here?" },
    ]
  },
  incremental: {
    label: "Small Steps",
    description: "Finding the tiniest next step that still feels meaningful",
    prompts: [
      { question: "What's the smallest possible step you could take?", followUp: "What would make even that 1% easier?" },
      { question: "What could you try for just 5 minutes?", followUp: "What would you learn from that experiment?" },
      { question: "If you couldn't fail, what would you try first?", followUp: "What's a low-risk version of that?" },
      { question: "What's one thing you could do differently today—just today?", followUp: "What support would help you try it?" },
    ]
  },
  values: {
    label: "Values Exploration",
    description: "Connecting to what matters most to you",
    prompts: [
      { question: "What value is this connected to for you?", followUp: "When have you lived that value well?" },
      { question: "If this change happened, what would it mean about who you are?", followUp: "How does that feel?" },
      { question: "What's one reason—your reason—that this matters?", followUp: "Where did that reason come from?" },
      { question: "Who do you want to become, and how does this fit?", followUp: "What's one quality of that future self you already have?" },
    ]
  },
  environment: {
    label: "Environment Scan",
    description: "Looking at what supports or challenges your growth",
    prompts: [
      { question: "What in your environment supports your goals?", followUp: "How can you access more of that?" },
      { question: "What obstacle feels most pressing right now?", followUp: "What's one way to work with it, not against it?" },
      { question: "Who in your life might help with this?", followUp: "What would you need from them?" },
      { question: "What practical change would make this easier?", followUp: "What's stopping you from making it?" },
    ]
  }
};

export const promptCategories = {
  awareness: {
    label: "Awareness",
    description: "Noticing what's present without judgment",
  },
  agency: {
    label: "Agency",
    description: "Recognizing your capacity to act",
  },
  relationships: {
    label: "Relationships",
    description: "Examining connection and boundaries",
  },
  meaning: {
    label: "Meaning",
    description: "Exploring purpose and direction",
  },
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

export function getMiPrompt(category, index = 0) {
  const section = miEnhancedPrompts[category];
  if (!section) return null;
  const promptData = section.prompts[index % section.prompts.length];
  return {
    ...promptData,
    category: section.label,
    description: section.description
  };
}

export function getDailyMiPrompt() {
  const categories = Object.keys(miEnhancedPrompts);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const categoryIndex = dayOfYear % categories.length;
  const category = categories[categoryIndex];
  const section = miEnhancedPrompts[category];
  const promptIndex = dayOfYear % section.prompts.length;
  return {
    category,
    label: section.label,
    description: section.description,
    ...section.prompts[promptIndex]
  };
}

export function getMiAffirmation() {
  const affirmations = [
    "You're the expert on your own life.",
    "This is your pace, your path.",
    "Nothing here is forced.",
    "Every small step counts.",
    "You don't have to have it all figured out.",
    "Mixed feelings are a sign you're thinking deeply.",
    "You're doing something brave just by being here."
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return affirmations[dayOfYear % affirmations.length];
}

export default journalPrompts;
