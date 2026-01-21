export interface SearchItem {
  title: string;
  description: string;
  tags: string[];
  path: string;
  type: 'Tool' | 'Guide' | 'Term' | 'Q&A' | 'News' | 'Resource';
}

export const searchIndex: SearchItem[] = [
  { title: "Healing Library", description: "Browse our complete collection of wellness resources, guides, and tools", tags: ["library", "resources", "wellness"], path: "/healing-library", type: "Resource" },
  { title: "Breathing Exercises", description: "Calming breathwork techniques to reduce anxiety and stress", tags: ["breathing", "calm", "anxiety", "stress"], path: "/breathing", type: "Tool" },
  { title: "Grounding Techniques", description: "5-4-3-2-1 and other grounding exercises for anxiety relief", tags: ["grounding", "anxiety", "present", "5-4-3-2-1"], path: "/grounding", type: "Tool" },
  { title: "Calming Scenes", description: "Peaceful visual environments for relaxation and stress relief", tags: ["calm", "relaxation", "visual", "nature"], path: "/calming-scenes", type: "Tool" },
  { title: "Guided Journaling", description: "Reflective prompts and guided journal entries for emotional processing", tags: ["journal", "reflection", "writing", "emotions"], path: "/guided-journaling", type: "Tool" },
  { title: "Cognitive Tools", description: "CBT-based techniques for reframing thoughts and building resilience", tags: ["cbt", "cognitive", "thoughts", "reframe"], path: "/cognitive-tools", type: "Tool" },
  { title: "Stress Response Guide", description: "Understanding your body's stress response and healthy coping strategies", tags: ["stress", "coping", "nervous system", "regulation"], path: "/stress-response", type: "Guide" },
  { title: "Sleep Guide", description: "Evidence-based tips for better sleep hygiene and rest", tags: ["sleep", "rest", "insomnia", "hygiene"], path: "/sleep-guide", type: "Guide" },
  { title: "Daily Routines", description: "Build healthy daily habits with structured wellness routines", tags: ["routines", "habits", "daily", "structure"], path: "/daily-routines", type: "Guide" },
  { title: "How-To Guides", description: "Step-by-step instructions for using platform features", tags: ["how-to", "tutorials", "instructions"], path: "/how-to-guides", type: "Guide" },
  { title: "FAQ", description: "Frequently asked questions about the platform and mental wellness", tags: ["faq", "questions", "help", "support"], path: "/faq", type: "Q&A" },
  { title: "Glossary", description: "Definitions of mental health and wellness terms", tags: ["glossary", "terms", "definitions", "vocabulary"], path: "/glossary", type: "Term" },
  { title: "Full Glossary", description: "Complete A-Z glossary of wellness and mental health terminology", tags: ["glossary", "complete", "terms", "dictionary"], path: "/glossary-full", type: "Term" },
  { title: "News & Updates", description: "Latest updates, features, and wellness insights", tags: ["news", "updates", "blog", "articles"], path: "/news", type: "News" },
  { title: "Research Hub", description: "Evidence-based research summaries supporting our methods", tags: ["research", "evidence", "science", "studies"], path: "/research", type: "Resource" },
  { title: "Crisis Support", description: "Immediate resources and helplines for mental health emergencies", tags: ["crisis", "emergency", "helpline", "988"], path: "/crisis", type: "Resource" },
  { title: "Support Resources", description: "Additional mental health resources and professional support options", tags: ["support", "resources", "help", "professional"], path: "/support", type: "Resource" },
  { title: "Tools Overview", description: "Browse all available wellness tools and exercises", tags: ["tools", "exercises", "overview", "features"], path: "/tools", type: "Resource" },
  { title: "Mood Tracker", description: "Track and visualize your emotional patterns over time", tags: ["mood", "tracking", "emotions", "patterns"], path: "/mood", type: "Tool" },
  { title: "State Tracker", description: "Monitor your current emotional and mental state", tags: ["state", "tracking", "current", "check-in"], path: "/state", type: "Tool" },
  { title: "Journal", description: "Private journaling space for reflection and emotional processing", tags: ["journal", "writing", "private", "reflection"], path: "/journal", type: "Tool" },
  { title: "AI Chat", description: "Compassionate AI companion for supportive conversations", tags: ["chat", "ai", "companion", "support"], path: "/chat", type: "Tool" },
  { title: "Wellness Hub", description: "Central dashboard for all your wellness activities", tags: ["wellness", "hub", "dashboard", "overview"], path: "/wellness", type: "Resource" },
  { title: "Analytics", description: "Insights and trends from your wellness journey", tags: ["analytics", "insights", "trends", "progress"], path: "/analytics", type: "Tool" },
  { title: "Pricing", description: "Subscription plans and premium features", tags: ["pricing", "plans", "premium", "subscription"], path: "/pricing", type: "Resource" },
  { title: "About Our Approach", description: "Learn about our trauma-informed, evidence-based methodology", tags: ["about", "approach", "methodology", "values"], path: "/about", type: "Resource" },
  { title: "Mindful Walking", description: "Guided walking meditation for movement and mindfulness", tags: ["walking", "mindful", "movement", "meditation"], path: "/mindful-walking", type: "Tool" },
  { title: "Body Scan", description: "Progressive relaxation through body awareness", tags: ["body", "scan", "relaxation", "awareness"], path: "/body-scan", type: "Tool" },
  { title: "Gratitude Practice", description: "Cultivate gratitude through guided exercises", tags: ["gratitude", "positive", "appreciation", "practice"], path: "/gratitude", type: "Tool" },
  { title: "Self-Compassion", description: "Exercises for building kindness toward yourself", tags: ["self-compassion", "kindness", "self-love", "acceptance"], path: "/self-compassion", type: "Tool" },
  { title: "Affirmations", description: "Positive affirmations for daily encouragement", tags: ["affirmations", "positive", "daily", "encouragement"], path: "/affirmations", type: "Tool" },
  { title: "Meditation Timer", description: "Simple timer for meditation practice", tags: ["meditation", "timer", "practice", "mindfulness"], path: "/meditation-timer", type: "Tool" },
  { title: "Thought Diary", description: "CBT thought diary for tracking and reframing thoughts", tags: ["cbt", "thoughts", "diary", "reframe"], path: "/thought-diary", type: "Tool" },
  { title: "Emotion Wheel", description: "Identify and explore your emotions with the emotion wheel", tags: ["emotions", "wheel", "identify", "feelings"], path: "/emotion-wheel", type: "Tool" },
];

export function searchContent(query: string): SearchItem[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  const terms = lowerQuery.split(/\s+/).filter(t => t.length > 1);
  
  return searchIndex
    .map(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery) ? 10 : 0;
      const descMatch = item.description.toLowerCase().includes(lowerQuery) ? 5 : 0;
      const tagMatch = item.tags.some(tag => tag.includes(lowerQuery)) ? 8 : 0;
      const termMatches = terms.reduce((score, term) => {
        if (item.title.toLowerCase().includes(term)) return score + 3;
        if (item.description.toLowerCase().includes(term)) return score + 2;
        if (item.tags.some(tag => tag.includes(term))) return score + 2;
        return score;
      }, 0);
      
      return { item, score: titleMatch + descMatch + tagMatch + termMatches };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(r => r.item);
}
