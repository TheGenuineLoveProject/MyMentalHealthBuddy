/**
 * 12 Practices for Mind–Body–Soul Transformation
 * Non-substance, non-religious educational framework
 * 
 * Usage: Import for /paths/12-practices or daily practice generator
 * Note: Educational self-reflection only, not therapy
 */

export interface TwelvePractice {
  number: number;
  title: string;
  shortName: string;
  whyItHelps: string;
  reflectionPrompt: string;
  microAction: string;
  journalingTemplate: string;
  domain: "mind" | "body" | "soul" | "action";
}

export const TWELVE_PRACTICES: TwelvePractice[] = [
  {
    number: 1,
    title: "Begin with Willingness",
    shortName: "Willingness",
    whyItHelps: "Change starts with choosing to be open. Willingness creates the space for growth.",
    reflectionPrompt: "What am I willing to explore or change right now, even if it feels uncertain?",
    microAction: "Say out loud or write: 'I am willing to begin.'",
    journalingTemplate: "Today, I am willing to ___ because ___. Even though I feel ___, I choose to stay open to ___.",
    domain: "mind"
  },
  {
    number: 2,
    title: "Tell the Truth to Yourself",
    shortName: "Clarity",
    whyItHelps: "Honesty with yourself is the foundation of authentic living. Naming reality reduces its power over you.",
    reflectionPrompt: "What truth have I been avoiding or softening? What would change if I acknowledged it fully?",
    microAction: "Write one honest sentence about how you really feel today.",
    journalingTemplate: "The truth I've been avoiding is ___. I've softened it because ___. If I fully acknowledged it, I might ___.",
    domain: "mind"
  },
  {
    number: 3,
    title: "Clarify Your Values",
    shortName: "Values",
    whyItHelps: "Knowing what matters guides every decision. Values are your compass when the path is unclear.",
    reflectionPrompt: "What do I genuinely care about? What would I protect or pursue even if it was hard?",
    microAction: "Name 3 things that matter deeply to you. Write them down.",
    journalingTemplate: "Three things I genuinely care about: 1) ___ 2) ___ 3) ___. When I act from these values, I feel ___.",
    domain: "soul"
  },
  {
    number: 4,
    title: "Name Your Patterns",
    shortName: "Awareness",
    whyItHelps: "Awareness of patterns is the first step to changing them. What you can name, you can work with.",
    reflectionPrompt: "What patterns do I notice in my reactions, relationships, or choices? What keeps repeating?",
    microAction: "Notice one pattern today. Just notice—don't try to fix it yet.",
    journalingTemplate: "A pattern I keep noticing is ___. It usually shows up when ___. It may have started ___.",
    domain: "mind"
  },
  {
    number: 5,
    title: "Ask for Support",
    shortName: "Community",
    whyItHelps: "No one heals alone. Asking for help is strength, not weakness. Connection is medicine.",
    reflectionPrompt: "Where do I need support that I haven't asked for? Who might I reach out to?",
    microAction: "Send one message to someone you trust, even just to say hello.",
    journalingTemplate: "I need support with ___. Someone I could reach out to is ___. What holds me back from asking is ___.",
    domain: "action"
  },
  {
    number: 6,
    title: "Practice Repair",
    shortName: "Repair",
    whyItHelps: "Repair heals relationships and self-respect. It's not about being perfect—it's about caring enough to try.",
    reflectionPrompt: "Is there a relationship (including with myself) that needs repair? What small step could I take?",
    microAction: "Acknowledge one thing you wish you'd done differently. Silently or aloud.",
    journalingTemplate: "A relationship that needs repair is with ___. One thing I could do to begin is ___. What I fear about this is ___.",
    domain: "action"
  },
  {
    number: 7,
    title: "Release What You Can't Control",
    shortName: "Release",
    whyItHelps: "Letting go of what you cannot change frees energy for what you can. Release is not giving up—it's wisdom.",
    reflectionPrompt: "What am I trying to control that isn't mine to control? What would it feel like to let go?",
    microAction: "Take 3 breaths. On each exhale, imagine releasing one thing you can't control.",
    journalingTemplate: "Something I'm trying to control that isn't mine to control: ___. If I released it, I might feel ___.",
    domain: "soul"
  },
  {
    number: 8,
    title: "Build Protective Routines",
    shortName: "Routines",
    whyItHelps: "Structure creates safety. Routines protect your energy and support your nervous system.",
    reflectionPrompt: "What routines help me feel grounded? What routine could I add or strengthen?",
    microAction: "Identify one routine that supports you. Commit to doing it today.",
    journalingTemplate: "A routine that helps me feel grounded is ___. One routine I want to build or strengthen is ___.",
    domain: "body"
  },
  {
    number: 9,
    title: "Serve Something Bigger",
    shortName: "Meaning",
    whyItHelps: "Purpose beyond yourself creates resilience and joy. Contribution connects you to the larger story.",
    reflectionPrompt: "What matters beyond my personal comfort? How could I contribute to something larger?",
    microAction: "Do one small kind thing for someone else today, without expecting anything in return.",
    journalingTemplate: "Something that matters beyond myself is ___. One way I could contribute is ___.",
    domain: "soul"
  },
  {
    number: 10,
    title: "Practice Forgiveness",
    shortName: "Forgiveness",
    whyItHelps: "Forgiveness is for your freedom, not theirs. It doesn't mean forgetting or tolerating harm—it means releasing the grip.",
    reflectionPrompt: "Who or what am I still carrying resentment toward? What would release feel like? (Note: Forgiveness is optional and personal.)",
    microAction: "Acknowledge one resentment you're carrying. Just notice it with compassion.",
    journalingTemplate: "Something I'm still carrying resentment about: ___. I hold onto it because ___. If I released it, I might ___.",
    domain: "soul"
  },
  {
    number: 11,
    title: "Daily Review",
    shortName: "Review",
    whyItHelps: "Reflection without judgment builds wisdom. A daily review helps you learn and adjust with kindness.",
    reflectionPrompt: "What went well today? What would I do differently? What am I grateful for?",
    microAction: "Before bed, name one thing that went well and one thing you'd adjust tomorrow.",
    journalingTemplate: "Today, something that went well was ___. Something I'd adjust is ___. I'm grateful for ___.",
    domain: "mind"
  },
  {
    number: 12,
    title: "Keep Growing",
    shortName: "Growth",
    whyItHelps: "Growth is lifelong. There's no destination—only the practice of becoming more fully yourself.",
    reflectionPrompt: "What am I curious about? What edge am I ready to explore? How do I want to keep growing?",
    microAction: "Name one thing you want to learn or explore in the next month.",
    journalingTemplate: "Something I'm curious about is ___. An edge I'm ready to explore is ___. I want to keep growing by ___.",
    domain: "soul"
  }
];

export function getPracticeByNumber(num: number): TwelvePractice | undefined {
  return TWELVE_PRACTICES.find(p => p.number === num);
}

export function getDailyPractice(dayOfYear?: number): TwelvePractice {
  const day = dayOfYear ?? Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = day % 12;
  return TWELVE_PRACTICES[index];
}

export function getPracticesByDomain(domain: TwelvePractice["domain"]): TwelvePractice[] {
  return TWELVE_PRACTICES.filter(p => p.domain === domain);
}

export function getRandomPractice(): TwelvePractice {
  return TWELVE_PRACTICES[Math.floor(Math.random() * TWELVE_PRACTICES.length)];
}

export const PRACTICE_DOMAINS = {
  mind: { label: "Mind", description: "Awareness, clarity, and thought patterns", color: "blue" },
  body: { label: "Body", description: "Physical routines and nervous system care", color: "green" },
  soul: { label: "Soul", description: "Values, meaning, and connection", color: "purple" },
  action: { label: "Action", description: "Practical steps and relationships", color: "amber" }
};
