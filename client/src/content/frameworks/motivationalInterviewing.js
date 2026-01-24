/**
 * Motivational Interviewing Language Patterns Library
 * Social work-informed, educational, non-clinical
 * 
 * Based on MI principles: Autonomy, Evocation, Collaboration, Compassion
 * Used as language patterns for self-reflection, not therapy
 */

export const miPrinciples = {
  autonomy: [
    "You choose what feels right.",
    "This is your pace, your path.",
    "Only you know what works for you.",
    "There's no pressure here—only options.",
    "You're the expert on your own life."
  ],
  evocation: [
    "What matters most to you right now?",
    "What's one thing you'd like to feel differently about?",
    "What would feel like a win today?",
    "What's already working that you want more of?",
    "What would your wisest self say?"
  ],
  collaboration: [
    "Let's explore together.",
    "We'll take this one step at a time.",
    "This is a partnership—you lead.",
    "Think of this as a gentle conversation with yourself.",
    "We're here to support, not direct."
  ],
  compassion: [
    "Nothing here is forced.",
    "It's okay to not be okay.",
    "You don't have to have it all figured out.",
    "Every small step counts.",
    "You're doing something brave just by being here."
  ]
};

export const miMicroPatterns = {
  readinessScale: [
    "On a scale of 1–10, how ready do you feel to try a small step?",
    "Where would you place yourself on a readiness scale today?",
    "If 10 is 'totally ready,' where are you right now?",
    "What number feels honest about your energy for this?"
  ],
  incrementalChange: [
    "What would make this feel even 1% easier?",
    "What's the smallest possible step you could take?",
    "If you could change just one tiny thing, what would it be?",
    "What's the least overwhelming way to start?"
  ],
  motivationExploration: [
    "What's one reason you might want this change?",
    "What would be different if this worked?",
    "What's pulling you toward something new?",
    "What part of you believes this is possible?"
  ],
  ambivalenceHonoring: [
    "It's okay to feel two things at once.",
    "Part of you wants change, part of you doesn't—that's normal.",
    "Mixed feelings are actually a sign you're thinking deeply.",
    "You don't have to resolve the conflict right now."
  ],
  strengthsRecognition: [
    "What helped you get through hard things before?",
    "What strength do you already have that could help here?",
    "What are you already doing well?",
    "What would someone who cares about you say about your strengths?"
  ]
};

export const miReflectivePrompts = {
  journaling: [
    "What feels important about this topic for you?",
    "What would feel like progress, even small progress?",
    "What obstacles do you anticipate? What might help?",
    "If nothing changed, what would that mean for you?",
    "What's one value this connects to?"
  ],
  onboarding: [
    "What brought you here today?",
    "What would you like to feel more of?",
    "What matters most to you in your healing journey?",
    "What's one thing you hope to explore?"
  ],
  checkIn: [
    "How are you arriving today?",
    "What's present for you right now?",
    "On a scale of 1–10, how's your energy?",
    "What do you need most in this moment?"
  ],
  challenge: [
    "How did that feel?",
    "What did you notice?",
    "What worked well?",
    "What would you do differently next time?",
    "How might you build on this?"
  ]
};

export const miUpgradeCtas = {
  nonPressuring: [
    "If you're curious about going deeper, there's more here for you.",
    "Ready to explore more? Premium offers additional tools—no pressure.",
    "Some people find the extended practices helpful. Want to see them?",
    "There's a fuller version of this if you'd like to continue.",
    "Unlock more when you're ready—completely at your pace."
  ],
  valueAligned: [
    "This matters to you. Premium can help you go further.",
    "Your growth is worth investing in—when it feels right.",
    "More depth is available if this resonates.",
    "Your journey deserves support. See what's possible."
  ]
};

export const personInEnvironment = {
  supportPrompts: [
    "What in your environment supports this goal?",
    "Who in your life might help with this?",
    "What space or place helps you feel calm?",
    "What resources do you already have access to?"
  ],
  barrierPrompts: [
    "What makes this harder? (time, people, space, money, energy)",
    "What obstacle feels most pressing right now?",
    "What's competing for your attention?",
    "What part of your environment works against this?"
  ],
  practicalSupport: [
    "What practical support would help this week?",
    "What's one environmental change that might make this easier?",
    "If you could adjust one external thing, what would it be?",
    "What accommodation would help you succeed?"
  ],
  strengthsBased: [
    "What's already working that you could build on?",
    "When has something similar worked for you before?",
    "What resources have helped you in the past?",
    "What part of this comes naturally to you?"
  ]
};

export function pickMiPattern(category, subcategory, index = 0) {
  const patterns = miMicroPatterns[category] || miPrinciples[category] || [];
  if (!patterns.length) return '';
  return patterns[index % patterns.length];
}

export function getRandomMiPrinciple(principle) {
  const options = miPrinciples[principle] || [];
  return options[Math.floor(Math.random() * options.length)] || '';
}

export default {
  principles: miPrinciples,
  patterns: miMicroPatterns,
  prompts: miReflectivePrompts,
  ctas: miUpgradeCtas,
  pie: personInEnvironment,
  pick: pickMiPattern,
  random: getRandomMiPrinciple
};
