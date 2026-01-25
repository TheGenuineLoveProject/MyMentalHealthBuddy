/**
 * Benefits Library (benefitsBank.ts)
 * Centralized, non-repetitive benefit bullets
 * 
 * Usage: getBenefitsForRoute("uniqueKey").slice(0, 3)
 * Legal: All wording is safe—no promises, no medical claims
 */

export interface BenefitBullet {
  text: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
}

const BENEFIT_POOL: BenefitBullet[] = [
  { text: "Build self-awareness through guided reflection", level: "beginner", category: "general" },
  { text: "Practice emotional regulation skills at your own pace", level: "beginner", category: "general" },
  { text: "Develop healthy coping strategies for daily life", level: "beginner", category: "general" },
  { text: "Create space for self-compassion and growth", level: "beginner", category: "general" },
  { text: "Learn evidence-informed wellness practices", level: "beginner", category: "general" },
  
  { text: "Deepen your understanding of personal patterns", level: "intermediate", category: "general" },
  { text: "Strengthen your emotional vocabulary", level: "intermediate", category: "general" },
  { text: "Build sustainable habits for lasting change", level: "intermediate", category: "general" },
  { text: "Explore values-based decision making", level: "intermediate", category: "general" },
  { text: "Practice mindful awareness in daily moments", level: "intermediate", category: "general" },
  
  { text: "Master advanced self-reflection techniques", level: "advanced", category: "general" },
  { text: "Integrate insights across life domains", level: "advanced", category: "general" },
  { text: "Develop personalized wellness routines", level: "advanced", category: "general" },
  { text: "Cultivate long-term resilience and adaptability", level: "advanced", category: "general" },
  
  { text: "Support restful sleep through calming practices", level: "beginner", category: "sleep" },
  { text: "Build a consistent wind-down routine", level: "beginner", category: "sleep" },
  { text: "Learn to quiet racing thoughts before bed", level: "intermediate", category: "sleep" },
  { text: "Create a sanctuary for rest and renewal", level: "intermediate", category: "sleep" },
  
  { text: "Recognize and name anxious feelings", level: "beginner", category: "anxiety" },
  { text: "Practice grounding techniques for calm", level: "beginner", category: "anxiety" },
  { text: "Develop your personal toolkit for worry", level: "intermediate", category: "anxiety" },
  { text: "Build tolerance for uncertainty", level: "advanced", category: "anxiety" },
  
  { text: "Identify what healthy boundaries look like", level: "beginner", category: "boundaries" },
  { text: "Practice saying 'no' with kindness", level: "intermediate", category: "boundaries" },
  { text: "Protect your energy while staying connected", level: "intermediate", category: "boundaries" },
  { text: "Build confidence in your limits", level: "advanced", category: "boundaries" },
  
  { text: "Reconnect with your inherent worth", level: "beginner", category: "self-worth" },
  { text: "Challenge unhelpful self-beliefs gently", level: "intermediate", category: "self-worth" },
  { text: "Build a foundation of self-respect", level: "intermediate", category: "self-worth" },
  { text: "Cultivate unconditional self-regard", level: "advanced", category: "self-worth" },
  
  { text: "Learn what helps you bounce back", level: "beginner", category: "resilience" },
  { text: "Build your personal toolkit for tough times", level: "intermediate", category: "resilience" },
  { text: "Develop adaptability and flexibility", level: "intermediate", category: "resilience" },
  { text: "Turn challenges into growth opportunities", level: "advanced", category: "resilience" },
  
  { text: "Honor your grief at your own pace", level: "beginner", category: "grief" },
  { text: "Find gentle ways to process loss", level: "intermediate", category: "grief" },
  { text: "Create meaningful rituals for remembrance", level: "intermediate", category: "grief" },
  { text: "Integrate loss into your life story", level: "advanced", category: "grief" },
  
  { text: "Practice being kind to yourself", level: "beginner", category: "self-compassion" },
  { text: "Replace self-criticism with understanding", level: "intermediate", category: "self-compassion" },
  { text: "Extend the compassion you'd give a friend", level: "intermediate", category: "self-compassion" },
  { text: "Build a lasting relationship with yourself", level: "advanced", category: "self-compassion" },
  
  { text: "Notice your body's stress signals", level: "beginner", category: "body" },
  { text: "Practice nervous system regulation", level: "intermediate", category: "body" },
  { text: "Develop somatic awareness skills", level: "intermediate", category: "body" },
  { text: "Integrate mind-body practices daily", level: "advanced", category: "body" },
  
  { text: "Create small rituals that anchor your day", level: "beginner", category: "practice" },
  { text: "Build consistency through micro-habits", level: "intermediate", category: "practice" },
  { text: "Design a sustainable daily practice", level: "intermediate", category: "practice" },
  { text: "Master the art of gentle discipline", level: "advanced", category: "practice" },
  
  { text: "Explore what genuinely matters to you", level: "beginner", category: "values" },
  { text: "Align daily choices with your values", level: "intermediate", category: "values" },
  { text: "Make decisions from your center", level: "intermediate", category: "values" },
  { text: "Live with integrity and purpose", level: "advanced", category: "values" },
  
  { text: "Develop a calmer relationship with thoughts", level: "beginner", category: "mindfulness" },
  { text: "Practice present-moment awareness", level: "intermediate", category: "mindfulness" },
  { text: "Notice without judgment", level: "intermediate", category: "mindfulness" },
  { text: "Cultivate equanimity in daily life", level: "advanced", category: "mindfulness" },
];

const ROUTE_CATEGORY_MAP: Record<string, string> = {
  sleep: "sleep",
  "sleep-hygiene": "sleep",
  anxiety: "anxiety",
  "anxiety-skills": "anxiety",
  "grounding-techniques": "anxiety",
  boundaries: "boundaries",
  "self-worth": "self-worth",
  "self-worth-reflection": "self-worth",
  resilience: "resilience",
  grief: "grief",
  "self-compassion": "self-compassion",
  body: "body",
  "body-mind": "body",
  practice: "practice",
  "daily-practice": "practice",
  values: "values",
  "values-finder": "values",
  mindfulness: "mindfulness",
  meditation: "mindfulness",
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getBenefitsForRoute(routeKey: string): string[] {
  const category = ROUTE_CATEGORY_MAP[routeKey] || "general";
  const categoryBenefits = BENEFIT_POOL.filter(b => b.category === category);
  const generalBenefits = BENEFIT_POOL.filter(b => b.category === "general");
  
  const combined = [...categoryBenefits, ...generalBenefits];
  const shuffled = shuffleArray(combined);
  
  return shuffled.slice(0, 6).map(b => b.text);
}

export function getBeginnerBenefits(): string[] {
  return shuffleArray(
    BENEFIT_POOL.filter(b => b.level === "beginner")
  ).slice(0, 4).map(b => b.text);
}

export function getIntermediateBenefits(): string[] {
  return shuffleArray(
    BENEFIT_POOL.filter(b => b.level === "intermediate")
  ).slice(0, 4).map(b => b.text);
}

export function getAdvancedBenefits(): string[] {
  return shuffleArray(
    BENEFIT_POOL.filter(b => b.level === "advanced")
  ).slice(0, 4).map(b => b.text);
}

export function getBenefitsByCategory(category: string): string[] {
  return shuffleArray(
    BENEFIT_POOL.filter(b => b.category === category)
  ).slice(0, 4).map(b => b.text);
}

export function getLevelBenefits(level: "beginner" | "intermediate" | "advanced"): string[] {
  return shuffleArray(
    BENEFIT_POOL.filter(b => b.level === level)
  ).slice(0, 4).map(b => b.text);
}
