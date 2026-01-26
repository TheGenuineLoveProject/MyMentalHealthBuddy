export interface Skill {
  id: string;
  name: string;
  description: string;
  category: "mi" | "practices" | "nlp" | "cognitive" | "somatic";
  level: "beginner" | "intermediate" | "advanced";
  safetyNote?: string;
}

export interface SkillPack {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
  safetyNote: string;
}

const skillPacks: Record<string, SkillPack> = {};

export function registerSkillPack(pack: SkillPack): void {
  skillPacks[pack.id] = pack;
}

export function getSkillPack(packId: string): SkillPack | undefined {
  return skillPacks[packId];
}

export function getAllSkillPacks(): SkillPack[] {
  return Object.values(skillPacks);
}

export function getSkillsByLevel(level: "beginner" | "intermediate" | "advanced"): Skill[] {
  const allSkills: Skill[] = [];
  for (const pack of Object.values(skillPacks)) {
    allSkills.push(...pack.skills.filter(s => s.level === level));
  }
  return allSkills;
}

export function getSkillsByCategory(category: Skill["category"]): Skill[] {
  const allSkills: Skill[] = [];
  for (const pack of Object.values(skillPacks)) {
    allSkills.push(...pack.skills.filter(s => s.category === category));
  }
  return allSkills;
}
