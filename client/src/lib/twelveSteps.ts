/**
 * The 12 Steps of Genuine Love
 * Non-clinical, growth-oriented transformation framework
 * 
 * Usage: Each step has beginner explanation, example scenario,
 * tiny action (≤2 minutes), and optional journal prompt
 */

export interface GenuineLoveStep {
  id: number;
  name: string;
  tagline: string;
  beginner: string;
  example: string;
  tinyAction: string;
  journalPrompt: string;
  domain: "mind" | "body" | "values" | "action";
}

export const TWELVE_STEPS: GenuineLoveStep[] = [
  {
    id: 1,
    name: "Pause",
    tagline: "I notice what's happening without judgment",
    beginner: "Before reacting, take one breath. Notice what you're feeling or thinking without trying to change it.",
    example: "You feel frustrated in a conversation. Instead of snapping back, you pause and notice the tension in your chest.",
    tinyAction: "Take 3 slow breaths right now. Just notice.",
    journalPrompt: "When did I pause today instead of reacting? How did it feel?",
    domain: "body"
  },
  {
    id: 2,
    name: "Name",
    tagline: "I label the feeling or need",
    beginner: "Give words to what you're experiencing. Naming emotions helps reduce their intensity.",
    example: "Instead of 'I feel bad,' you say 'I feel anxious about tomorrow's meeting.'",
    tinyAction: "Complete this: 'Right now I feel _____ because _____.'",
    journalPrompt: "What emotion came up most often today? What triggered it?",
    domain: "mind"
  },
  {
    id: 3,
    name: "Safety",
    tagline: "I choose what feels safe right now",
    beginner: "You always have permission to stop, slow down, or choose something gentler. Safety comes first.",
    example: "A meditation feels overwhelming, so you choose a simple grounding exercise instead.",
    tinyAction: "Ask yourself: 'What would feel safe for me right now?'",
    journalPrompt: "When did I honor my need for safety today? When did I push past it?",
    domain: "body"
  },
  {
    id: 4,
    name: "Responsibility",
    tagline: "I own my next best step",
    beginner: "Focus on what's within your control. You can't change others, but you can choose your response.",
    example: "Instead of waiting for someone to apologize, you decide how you want to move forward.",
    tinyAction: "Identify one thing you can control about a current challenge.",
    journalPrompt: "What's one thing I'm responsible for that I've been avoiding?",
    domain: "action"
  },
  {
    id: 5,
    name: "Support",
    tagline: "I ask for help or resources",
    beginner: "Reaching out isn't weakness—it's wisdom. Support can come from people, tools, or practices.",
    example: "You text a friend when you're struggling instead of isolating yourself.",
    tinyAction: "Think of one person or resource you could reach out to today.",
    journalPrompt: "Who or what supported me recently? How did it help?",
    domain: "action"
  },
  {
    id: 6,
    name: "Values",
    tagline: "I choose alignment over impulse",
    beginner: "When making decisions, ask: 'Does this match who I want to be?' Values guide better than urges.",
    example: "You want to skip the gym but remember that health is a core value, so you go anyway.",
    tinyAction: "Name one core value that guides your decisions.",
    journalPrompt: "When did my actions align with my values today? When didn't they?",
    domain: "values"
  },
  {
    id: 7,
    name: "Repair",
    tagline: "I make amends when appropriate",
    beginner: "Everyone makes mistakes. Genuine repair means acknowledging harm and taking action to make it right.",
    example: "You apologize for being short with a colleague and commit to handling stress better.",
    tinyAction: "Is there a small repair you could make today? Even acknowledging counts.",
    journalPrompt: "What relationship needs repair? What's one step I could take?",
    domain: "action"
  },
  {
    id: 8,
    name: "Boundaries",
    tagline: "I protect my dignity and time",
    beginner: "Healthy boundaries aren't walls—they're guidelines that help you show up as your best self.",
    example: "You decline an invitation that would drain you, even though you feel guilty.",
    tinyAction: "Identify one boundary you need to set or reinforce.",
    journalPrompt: "Where do I need stronger boundaries? What makes it hard to set them?",
    domain: "values"
  },
  {
    id: 9,
    name: "Practice",
    tagline: "I repeat tiny habits daily",
    beginner: "Growth happens through consistent small actions, not occasional big efforts.",
    example: "You commit to 2 minutes of journaling each morning, no matter what.",
    tinyAction: "Choose one tiny habit you'll do today.",
    journalPrompt: "What tiny habit would most improve my daily life?",
    domain: "action"
  },
  {
    id: 10,
    name: "Reflection",
    tagline: "I learn from patterns",
    beginner: "Looking back helps you move forward. Notice what works, what doesn't, and why.",
    example: "You realize you always feel drained after certain types of interactions and plan accordingly.",
    tinyAction: "Reflect: What pattern am I noticing in my life right now?",
    journalPrompt: "What keeps repeating in my life? What might it be teaching me?",
    domain: "mind"
  },
  {
    id: 11,
    name: "Contribution",
    tagline: "I share good with others",
    beginner: "Giving to others creates meaning and connection. It doesn't have to be big—kindness counts.",
    example: "You send a message of appreciation to someone who helped you.",
    tinyAction: "Do one small act of kindness today.",
    journalPrompt: "How did I contribute to someone else's wellbeing recently?",
    domain: "values"
  },
  {
    id: 12,
    name: "Integration",
    tagline: "I live it consistently",
    beginner: "Integration means these practices become part of who you are, not just what you do sometimes.",
    example: "Pausing, naming feelings, and honoring boundaries become automatic, not effortful.",
    tinyAction: "Which step feels most natural to you now? Celebrate that growth.",
    journalPrompt: "How have I changed through this practice? What's still growing?",
    domain: "mind"
  }
];

export function getStepById(id: number): GenuineLoveStep | undefined {
  return TWELVE_STEPS.find(step => step.id === id);
}

export function getStepsByDomain(domain: GenuineLoveStep["domain"]): GenuineLoveStep[] {
  return TWELVE_STEPS.filter(step => step.domain === domain);
}

export function getNextStep(currentId: number): GenuineLoveStep | undefined {
  if (currentId >= 12) return undefined;
  return getStepById(currentId + 1);
}

export function getRandomTinyAction(): { step: GenuineLoveStep; action: string } {
  const step = TWELVE_STEPS[Math.floor(Math.random() * TWELVE_STEPS.length)];
  return { step, action: step.tinyAction };
}
