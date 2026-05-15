/**
 * The 12-Phase Self-Alignment Path™
 * Educational, reflective, non-religious, non-clinical
 * 
 * IMPORTANT LEGAL NOTE:
 * This is NOT called "12-Step" on the platform.
 * No higher power language required.
 * Optional framing: values, meaning, integrity, conscience, purpose.
 * 
 * Delivered as:
 * - Optional pathway (not default)
 * - Self-paced
 * - Opt-out at every step
 * - No completion pressure
 */

export const twelvePhases = [
  {
    number: 1,
    name: "Awareness",
    domain: "Mind",
    tagline: "Something wants my attention",
    description: "Noticing patterns, feelings, or situations that are calling for your awareness.",
    reflection: "What part of your life is asking for more attention right now?",
    practice: "Spend 5 minutes journaling about what's been on your mind lately without judgment.",
    journalPrompts: [
      "What keeps showing up in my thoughts?",
      "What am I avoiding looking at?",
      "Where do I feel tension or unease?",
      "What would I notice if I slowed down?"
    ],
    example: "I've been snapping at people lately. Something is bothering me beneath the surface.",
    tinyAction: "Name the feeling in 3 words or less.",
    estimatedTime: "5-10 minutes",
    canSkip: true
  },
  {
    number: 2,
    name: "Willingness",
    domain: "Mind",
    tagline: "I'm open to a small shift",
    description: "Opening yourself to the possibility of change, even if you're not sure what it looks like.",
    reflection: "What small shift might you be willing to consider?",
    practice: "Write one sentence: 'I'm willing to explore...'",
    journalPrompts: [
      "What am I curious about changing?",
      "What feels possible, even if it's small?",
      "Where is my resistance? What is it protecting?",
      "What would willingness look like today?"
    ],
    example: "I'm not ready to change everything, but I'm curious about trying one small thing.",
    tinyAction: "Complete: 'I'm willing to try...' (one sentence only).",
    estimatedTime: "5-10 minutes",
    canSkip: true
  },
  {
    number: 3,
    name: "Self-Honesty",
    domain: "Mind",
    tagline: "Here's what's actually happening",
    description: "Looking clearly at your current reality with compassion, not judgment.",
    reflection: "What's the truth you've been avoiding or minimizing?",
    practice: "Complete the sentence: 'The truth is...' three times.",
    journalPrompts: [
      "What am I pretending not to know?",
      "What would I admit if I felt completely safe?",
      "What story have I been telling that isn't quite true?",
      "What needs acknowledgment?"
    ],
    example: "The truth is, I'm more exhausted than I've been admitting—even to myself.",
    tinyAction: "Write one honest sentence starting with 'The truth is...'",
    estimatedTime: "10-15 minutes",
    canSkip: true
  },
  {
    number: 4,
    name: "Responsibility",
    domain: "Body",
    tagline: "What's mine to work with?",
    description: "Identifying what you can influence and releasing what you cannot control.",
    reflection: "What is within your power to change? What isn't?",
    practice: "Make two lists: 'Within my control' and 'Outside my control.'",
    journalPrompts: [
      "What am I responsible for in this situation?",
      "What am I trying to control that isn't mine?",
      "Where can I take action?",
      "What do I need to let go of?"
    ],
    example: "I can't control others, but I can control my boundary. I can say 'no' to this request.",
    tinyAction: "Write one boundary sentence: 'I can/I can't control...'",
    estimatedTime: "10-15 minutes",
    canSkip: true
  },
  {
    number: 5,
    name: "Values Alignment",
    domain: "Values",
    tagline: "What do I stand for?",
    description: "Clarifying your core values and how they guide your choices.",
    reflection: "What values feel most important to you right now?",
    practice: "Choose 3-5 values that resonate most. How are you living them?",
    journalPrompts: [
      "What matters most to me?",
      "When do I feel most like myself?",
      "What would I want to be remembered for?",
      "Where are my actions misaligned with my values?"
    ],
    coreValues: [
      "Authenticity", "Compassion", "Courage", "Creativity", "Curiosity",
      "Fairness", "Freedom", "Growth", "Honesty", "Humor", "Integrity",
      "Justice", "Kindness", "Love", "Loyalty", "Peace", "Respect",
      "Responsibility", "Security", "Service", "Wisdom"
    ],
    example: "I value honesty, but I've been avoiding a hard conversation. My actions don't match my values.",
    tinyAction: "Circle one value that feels important today.",
    estimatedTime: "15-20 minutes",
    canSkip: true
  },
  {
    number: 6,
    name: "Pattern Review",
    domain: "Mind",
    tagline: "What repeats?",
    description: "Examining recurring patterns in thoughts, behaviors, and relationships.",
    reflection: "What patterns show up again and again in your life?",
    practice: "Identify one pattern you'd like to understand better.",
    journalPrompts: [
      "What situations keep recurring?",
      "What triggers predictable reactions in me?",
      "What patterns did I learn growing up?",
      "What would breaking this pattern look like?"
    ],
    example: "I notice I shut down when people raise their voice. This pattern started in childhood.",
    tinyAction: "Name one pattern: 'When X happens, I usually Y.'",
    estimatedTime: "15-20 minutes",
    canSkip: true
  },
  {
    number: 7,
    name: "Release",
    domain: "Body",
    tagline: "What no longer serves?",
    description: "Letting go of beliefs, behaviors, or burdens that are holding you back.",
    reflection: "What are you ready to release, even partially?",
    practice: "Write what you're releasing on paper. You can keep it, tear it, or burn it safely.",
    journalPrompts: [
      "What belief no longer serves me?",
      "What am I holding onto that's heavy?",
      "What would I release if I trusted I'd be okay?",
      "What does 'letting go' mean to me?"
    ],
    example: "I'm releasing the belief that I have to be perfect to be loved.",
    tinyAction: "Write: 'I'm ready to release...' (one thing only).",
    estimatedTime: "15-20 minutes",
    canSkip: true
  },
  {
    number: 8,
    name: "Skill Building",
    domain: "Action",
    tagline: "What can I practice?",
    description: "Developing new skills and capacities that support your wellbeing.",
    reflection: "What skill would help you most right now?",
    practice: "Choose one skill to practice this week. Start small.",
    journalPrompts: [
      "What skill would change my life if I developed it?",
      "What have I been avoiding learning?",
      "What would 'practice' look like?",
      "How can I make learning feel safe?"
    ],
    suggestedSkills: [
      "Setting boundaries", "Self-soothing", "Asking for help",
      "Saying no", "Emotional regulation", "Active listening",
      "Self-advocacy", "Mindful pause", "Gratitude practice"
    ],
    example: "Practice a 60-second breath reset. Stop if needed.",
    tinyAction: "Pick one skill. Practice for 60 seconds—then stop.",
    estimatedTime: "Ongoing",
    canSkip: true
  },
  {
    number: 9,
    name: "Repair",
    domain: "Action",
    tagline: "What needs care or clarity?",
    description: "Addressing harm, misunderstandings, or neglected relationships—starting with yourself.",
    reflection: "What relationship (including with yourself) needs repair?",
    practice: "Write a letter of repair—you don't have to send it.",
    journalPrompts: [
      "What needs acknowledgment or apology?",
      "How have I neglected my own needs?",
      "What relationship deserves more care?",
      "What would repair look like in practice?"
    ],
    example: "I've been neglecting my own rest. Repair starts with myself.",
    tinyAction: "Name one relationship (even with yourself) that needs care.",
    estimatedTime: "20-30 minutes",
    canSkip: true
  },
  {
    number: 10,
    name: "Integration",
    domain: "Body",
    tagline: "How this fits my life",
    description: "Weaving new insights and practices into your daily life.",
    reflection: "How will you integrate what you've learned?",
    practice: "Create one new ritual or routine that reflects your growth.",
    journalPrompts: [
      "What insight do I want to remember?",
      "How can I build this into my daily life?",
      "What support do I need?",
      "What will remind me of this when I forget?"
    ],
    example: "I'll add a 2-minute morning check-in to my routine.",
    tinyAction: "Choose one small ritual to try tomorrow.",
    estimatedTime: "15-20 minutes",
    canSkip: true
  },
  {
    number: 11,
    name: "Service",
    domain: "Values",
    tagline: "How I show up with integrity",
    description: "Contributing to others and the world in alignment with your values.",
    reflection: "How might you offer your gifts to others?",
    practice: "Do one small act of service this week—for someone else or your community.",
    journalPrompts: [
      "What do I have to offer?",
      "How does helping others help me?",
      "What cause or community matters to me?",
      "What would meaningful contribution look like?"
    ],
    example: "Send one encouraging text to someone who might need it.",
    tinyAction: "Do one kind thing for someone (or yourself) today.",
    estimatedTime: "Ongoing",
    canSkip: true
  },
  {
    number: 12,
    name: "Continuity",
    domain: "Action",
    tagline: "How I sustain this gently",
    description: "Creating sustainable practices for ongoing growth and self-compassion.",
    reflection: "How will you maintain this journey without pressure or perfection?",
    practice: "Design your 'maintenance plan'—small, sustainable, kind.",
    journalPrompts: [
      "What does sustainable growth look like for me?",
      "How can I be gentle with myself when I slip?",
      "What anchors me?",
      "What does 'enough' look like?"
    ],
    example: "When I slip, I'll say: 'That's human. What's one gentle next step?'",
    tinyAction: "Write one sentence: 'When I slip, I'll...'",
    estimatedTime: "15-20 minutes",
    canSkip: true
  }
];

export const pathwayMetadata = {
  name: "The 12-Phase Self-Alignment Path™",
  tagline: "A gentle journey toward inner alignment",
  description: "An optional, self-paced pathway for exploring personal growth through reflection, values clarification, and gentle practice. Not therapy, not treatment—just thoughtful self-exploration.",
  disclaimer: "This is an educational wellness tool, not medical or mental health treatment. Pause or stop anytime. If you're in crisis, please visit /crisis for immediate support resources.",
  domains: {
    mind: { phases: [1, 2, 3, 6], color: "var(--sage-500)", icon: "Brain" },
    body: { phases: [4, 7, 10], color: "var(--teal-500)", icon: "Heart" },
    values: { phases: [5, 11], color: "var(--rose-500)", icon: "Compass" },
    action: { phases: [8, 9, 12], color: "var(--amber-500)", icon: "Zap" }
  },
  features: [
    "Self-paced progression",
    "Skip any phase",
    "No completion pressure",
    "Journal prompts for each phase",
    "Practical exercises",
    "Values-based (no religious content)"
  ]
};

export function getPhase(number) {
  return twelvePhases.find(p => p.number === number);
}

export function getPhasesByDomain(domain) {
  return twelvePhases.filter(p => p.domain.toLowerCase() === domain.toLowerCase());
}

export function getProgress(completedPhases = []) {
  return {
    completed: completedPhases.length,
    total: 12,
    percentage: Math.round((completedPhases.length / 12) * 100),
    nextPhase: twelvePhases.find(p => !completedPhases.includes(p.number))
  };
}

export default {
  phases: twelvePhases,
  metadata: pathwayMetadata,
  getPhase,
  getPhasesByDomain,
  getProgress
};
