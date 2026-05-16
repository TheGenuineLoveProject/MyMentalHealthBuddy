export type HubTopic =
  | "anxiety"
  | "sleep"
  | "boundaries"
  | "selfWorth"
  | "resilience"
  | "focus"
  | "grief"
  | "relationships";

export const HUBS: { topic: HubTopic; title: string; description: string; tags: string[] }[] = [
  {
    topic: "anxiety",
    title: "Anxiety support skills",
    description: "Calm your body, steady your thoughts, take one tiny step.",
    tags: ["anxiety", "calm", "grounding", "breath", "reframe"],
  },
  {
    topic: "sleep",
    title: "Sleep reset",
    description: "Gentle routines and mind-settling tools for better rest habits.",
    tags: ["sleep", "winddown", "routine", "breath", "noise"],
  },
  {
    topic: "boundaries",
    title: "Boundaries & self-respect",
    description: "Clear limits, kinder self-talk, safer relationships.",
    tags: ["boundaries", "communication", "values", "assertiveness"],
  },
  {
    topic: "selfWorth",
    title: "Self-worth & confidence",
    description: "Build self-respect with small honest practices.",
    tags: ["self-worth", "confidence", "identity", "values", "compassion"],
  },
  {
    topic: "resilience",
    title: "Resilience & recovery",
    description: "Stabilize, regroup, and keep going—one step at a time.",
    tags: ["resilience", "stress", "coping", "routine", "support"],
  },
  {
    topic: "focus",
    title: "Focus & momentum",
    description: "Reduce overwhelm, choose the next right action.",
    tags: ["focus", "momentum", "overwhelm", "tiny-step"],
  },
  {
    topic: "grief",
    title: "Grief & change",
    description: "Gentle reflection tools for hard seasons.",
    tags: ["grief", "loss", "meaning", "support", "compassion"],
  },
  {
    topic: "relationships",
    title: "Relationships & connection",
    description: "Healthier patterns, communication, and repair.",
    tags: ["relationships", "repair", "communication", "boundaries", "values"],
  },
];

export function getHubByTopic(topic: string) {
  return HUBS.find((h) => h.topic === topic);
}

export function listHubTopics(): HubTopic[] {
  return HUBS.map((h) => h.topic);
}
