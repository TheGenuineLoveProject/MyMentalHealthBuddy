import { registerSkillPack, SkillPack, Skill } from "../skillRegistry";

export interface Practice {
  id: string;
  number: number;
  name: string;
  domain: "mind" | "body" | "soul" | "action";
  description: string;
  reflection: string;
  microAction: string;
  safetyNote: string;
  level: "beginner" | "intermediate" | "advanced";
}

export const twelvePractices: Practice[] = [
  {
    id: "practice-1",
    number: 1,
    name: "Present Awareness",
    domain: "mind",
    description: "Notice what is happening in this moment without judgment",
    reflection: "What am I aware of right now in my body, thoughts, and surroundings?",
    microAction: "Take three slow breaths and name five things you can see",
    safetyNote: "If distressing thoughts arise, gently return to your breath or step away",
    level: "beginner"
  },
  {
    id: "practice-2",
    number: 2,
    name: "Self-Compassion",
    domain: "soul",
    description: "Treat yourself with the same kindness you would offer a friend",
    reflection: "How would I comfort a friend going through what I'm experiencing?",
    microAction: "Place a hand on your heart and speak one kind word to yourself",
    safetyNote: "Self-compassion may feel unfamiliar at first—start small",
    level: "beginner"
  },
  {
    id: "practice-3",
    number: 3,
    name: "Grounding",
    domain: "body",
    description: "Connect with physical sensations to anchor in the present",
    reflection: "Where in my body do I feel most stable right now?",
    microAction: "Press your feet firmly into the floor and notice the sensation",
    safetyNote: "If you feel overwhelmed, open your eyes and orient to your surroundings",
    level: "beginner"
  },
  {
    id: "practice-4",
    number: 4,
    name: "Values Clarity",
    domain: "soul",
    description: "Identify what matters most to guide your choices",
    reflection: "What do I want my life to stand for?",
    microAction: "Write down three values that feel important to you today",
    safetyNote: "Values are personal—there are no right or wrong answers",
    level: "intermediate"
  },
  {
    id: "practice-5",
    number: 5,
    name: "Boundary Setting",
    domain: "action",
    description: "Recognize and communicate your limits with care",
    reflection: "Where in my life do I need clearer boundaries?",
    microAction: "Practice saying 'I need...' or 'I'm not available for...' aloud",
    safetyNote: "Setting boundaries is a skill that develops over time",
    level: "intermediate"
  },
  {
    id: "practice-6",
    number: 6,
    name: "Nervous System Care",
    domain: "body",
    description: "Learn to recognize and support your body's stress responses",
    reflection: "What signals does my body give me when I'm overwhelmed?",
    microAction: "Exhale slowly for longer than you inhale (e.g., inhale 4, exhale 6)",
    safetyNote: "If you feel dizzy or uncomfortable, return to normal breathing",
    level: "intermediate"
  },
  {
    id: "practice-7",
    number: 7,
    name: "Thought Observation",
    domain: "mind",
    description: "Notice thoughts as mental events rather than facts",
    reflection: "What thoughts keep showing up for me? Can I observe them without believing them?",
    microAction: "When a thought arises, silently note 'thinking' and let it pass",
    safetyNote: "This is not about suppressing thoughts—just noticing them",
    level: "intermediate"
  },
  {
    id: "practice-8",
    number: 8,
    name: "Emotional Naming",
    domain: "soul",
    description: "Identify and name emotions to reduce their intensity",
    reflection: "What emotion am I experiencing? Where do I feel it in my body?",
    microAction: "Complete the phrase: 'Right now I am feeling...'",
    safetyNote: "All emotions are valid—naming them helps us understand ourselves",
    level: "beginner"
  },
  {
    id: "practice-9",
    number: 9,
    name: "Intentional Rest",
    domain: "body",
    description: "Create space for genuine restoration and recovery",
    reflection: "What does true rest look like for me?",
    microAction: "Schedule 10 minutes of unstructured time today",
    safetyNote: "Rest is not laziness—it is essential for wellbeing",
    level: "beginner"
  },
  {
    id: "practice-10",
    number: 10,
    name: "Connection Practice",
    domain: "action",
    description: "Nurture meaningful relationships with intention",
    reflection: "Who in my life would I like to connect with more?",
    microAction: "Send one brief message of appreciation to someone today",
    safetyNote: "Connection looks different for everyone—honor your needs",
    level: "intermediate"
  },
  {
    id: "practice-11",
    number: 11,
    name: "Purpose Reflection",
    domain: "soul",
    description: "Explore what gives your life meaning and direction",
    reflection: "What activities make me lose track of time in a good way?",
    microAction: "List three things that energize rather than drain you",
    safetyNote: "Purpose evolves over time—there is no need to have all the answers",
    level: "advanced"
  },
  {
    id: "practice-12",
    number: 12,
    name: "Integration",
    domain: "action",
    description: "Bring practices together into sustainable daily rhythms",
    reflection: "Which practices feel most natural to weave into my day?",
    microAction: "Choose one practice to try for the next week",
    safetyNote: "Start with one practice—building habits takes time",
    level: "advanced"
  }
];

const practiceSkills: Skill[] = twelvePractices.map(practice => ({
  id: practice.id,
  name: practice.name,
  description: practice.description,
  category: "practices" as const,
  level: practice.level,
  safetyNote: practice.safetyNote
}));

export const twelvePracticesPack: SkillPack = {
  id: "twelve-practices",
  name: "The 12 Practices",
  description: "A mind-body-soul transformation path for sustainable personal growth",
  skills: practiceSkills,
  safetyNote: "These practices are educational tools for self-reflection, not therapy or treatment."
};

registerSkillPack(twelvePracticesPack);

export function getPracticeByNumber(num: number): Practice | undefined {
  return twelvePractices.find(p => p.number === num);
}

export function getPracticesByDomain(domain: Practice["domain"]): Practice[] {
  return twelvePractices.filter(p => p.domain === domain);
}

export function getPracticesByLevel(level: Practice["level"]): Practice[] {
  return twelvePractices.filter(p => p.level === level);
}
