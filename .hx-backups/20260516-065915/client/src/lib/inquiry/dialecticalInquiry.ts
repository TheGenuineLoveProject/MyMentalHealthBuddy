export interface DialecticalStep {
  phase: "thesis" | "antithesis" | "synthesis" | "integration";
  prompt: string;
  guidance: string;
}

export interface DialecticalSession {
  topic: string;
  thesis: string;
  antithesis: string;
  synthesis: string;
  integration: string;
  timestamp: string;
}

export const DIALECTICAL_STEPS: DialecticalStep[] = [
  {
    phase: "thesis",
    prompt: "What is your current position or belief about this topic?",
    guidance: "State your view clearly. What do you believe to be true? Don't censor yourself—this is your starting point."
  },
  {
    phase: "antithesis",
    prompt: "What is the strongest opposing view? Argue against yourself.",
    guidance: "Steel-man the opposition. If someone deeply disagreed with you, what would their best argument be? Make it as strong as possible."
  },
  {
    phase: "synthesis",
    prompt: "What truth exists in both positions? How might they be reconciled?",
    guidance: "Look for the higher ground where both views contain partial truth. What larger perspective holds both?"
  },
  {
    phase: "integration",
    prompt: "What new understanding emerges? How does this change your original position?",
    guidance: "You've held tension between opposites. What new position emerges that's richer than either starting point?"
  }
];

export const INQUIRY_DOMAINS = [
  {
    id: "self",
    name: "Self & Identity",
    prompts: [
      "Who am I when no one is watching?",
      "What parts of myself do I hide from others?",
      "What would I do if I couldn't fail?",
      "What am I pretending not to know?"
    ]
  },
  {
    id: "relationships",
    name: "Relationships & Connection",
    prompts: [
      "What pattern keeps showing up in my relationships?",
      "What am I seeking from others that I could give myself?",
      "Where am I giving to receive?",
      "What would unconditional love look like here?"
    ]
  },
  {
    id: "purpose",
    name: "Purpose & Meaning",
    prompts: [
      "What would I do even if no one ever knew?",
      "What breaks my heart about the world?",
      "What comes naturally to me that others find difficult?",
      "If I had 5 years left, what would matter?"
    ]
  },
  {
    id: "growth",
    name: "Growth & Change",
    prompts: [
      "What am I resisting that might be trying to help me?",
      "What lesson keeps presenting itself until I learn it?",
      "What would the next version of me believe?",
      "What am I outgrowing?"
    ]
  },
  {
    id: "fear",
    name: "Fear & Shadow",
    prompts: [
      "What am I most afraid others will discover about me?",
      "What judgments of others reveal my own shadow?",
      "What would I do if fear wasn't a factor?",
      "What am I avoiding by staying busy?"
    ]
  },
  {
    id: "truth",
    name: "Truth & Reality",
    prompts: [
      "What do I believe that might not be true?",
      "What uncomfortable truth am I not facing?",
      "What would change if I stopped believing this?",
      "Where am I lying to myself?"
    ]
  }
];

export function getDialecticalStep(phase: DialecticalStep["phase"]): DialecticalStep {
  return DIALECTICAL_STEPS.find(s => s.phase === phase)!;
}

export function getRandomInquiryPrompt(domainId?: string): string {
  if (domainId) {
    const domain = INQUIRY_DOMAINS.find(d => d.id === domainId);
    if (domain) {
      return domain.prompts[Math.floor(Math.random() * domain.prompts.length)];
    }
  }
  const allPrompts = INQUIRY_DOMAINS.flatMap(d => d.prompts);
  return allPrompts[Math.floor(Math.random() * allPrompts.length)];
}

export function saveDialecticalSession(session: DialecticalSession): void {
  const key = "glp_dialectical_sessions";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([session, ...existing].slice(0, 30)));
}

export function getDialecticalSessions(): DialecticalSession[] {
  const key = "glp_dialectical_sessions";
  return JSON.parse(localStorage.getItem(key) || "[]");
}
