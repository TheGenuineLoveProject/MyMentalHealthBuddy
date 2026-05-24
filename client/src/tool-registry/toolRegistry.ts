export interface ToolDefinition {
  id: string;
  title: string;
  category: string;
  route: string;
  emotionalGoal?: string;
  intensity?: "low" | "medium" | "high";
  visibility: "public" | "private" | "admin";
  tags?: string[];
}

export const toolRegistry: ToolDefinition[] = [
  {
    id: "breath-pacer",
    title: "Breath Pacer",
    category: "Nervous System",
    route: "/tools/breath-pacer",
    emotionalGoal: "Calming",
    intensity: "low",
    visibility: "public",
    tags: ["breathing", "calm", "grounding"]
  },
  {
    id: "emotion-wheel",
    title: "Emotion Wheel",
    category: "Self Awareness",
    route: "/tools/emotion-wheel",
    emotionalGoal: "Reflection",
    intensity: "low",
    visibility: "public",
    tags: ["emotion", "awareness", "reflection"]
  },
  {
    id: "journal",
    title: "Journal",
    category: "Reflection",
    route: "/journal",
    emotionalGoal: "Processing",
    intensity: "medium",
    visibility: "public",
    tags: ["journaling", "reflection"]
  }
];
