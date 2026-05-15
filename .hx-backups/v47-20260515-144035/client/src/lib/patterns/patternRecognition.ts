export interface ReflectionData {
  timestamp: string;
  text: string;
  tags?: string[];
  stateSnapshot?: Record<string, number>;
}

export interface PatternInsight {
  type: "temporal" | "thematic" | "state" | "growth";
  title: string;
  observation: string;
  question: string;
  confidence: "emerging" | "developing" | "established";
  dataPoints: number;
}

const TEMPORAL_PATTERNS = {
  morning: { label: "Morning Reflector", question: "What draws you to reflect in the early hours?" },
  evening: { label: "Evening Processor", question: "How does end-of-day reflection serve your unwinding?" },
  weekend: { label: "Weekend Explorer", question: "What space does the weekend create for deeper inquiry?" },
  consistent: { label: "Steady Practice", question: "What does consistent reflection provide that sporadic doesn't?" },
};

const THEME_CLUSTERS = [
  { themes: ["work", "career", "job", "boss"], cluster: "Professional Life", question: "How is your relationship with work evolving?" },
  { themes: ["relationship", "partner", "love", "family"], cluster: "Relational Patterns", question: "What patterns in connection are you noticing?" },
  { themes: ["anxiety", "worry", "fear", "nervous"], cluster: "Safety & Security", question: "What does your nervous system need to feel safer?" },
  { themes: ["sad", "grief", "loss", "hurt"], cluster: "Processing Loss", question: "What grief might be asking for acknowledgment?" },
  { themes: ["stuck", "blocked", "frozen", "can't"], cluster: "Movement & Flow", question: "Where is energy wanting to move but can't?" },
  { themes: ["hope", "calm", "peace", "grateful"], cluster: "Emerging Ease", question: "What conditions support your sense of peace?" },
  { themes: ["self-doubt", "imposter", "worthless", "fail"], cluster: "Self-Perception", question: "Whose voice is speaking when you doubt yourself?" },
  { themes: ["tired", "exhausted", "burnout", "drained"], cluster: "Energy Management", question: "What is depleting you that you haven't named?" },
];

export function analyzePatterns(reflections: ReflectionData[]): PatternInsight[] {
  if (reflections.length < 3) return [];
  
  const insights: PatternInsight[] = [];
  const allTags = reflections.flatMap(r => r.tags || []);
  const tagCounts: Record<string, number> = {};
  
  for (const tag of allTags) {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  }
  
  for (const cluster of THEME_CLUSTERS) {
    const count = cluster.themes.reduce((sum, t) => sum + (tagCounts[t] || 0), 0);
    if (count >= 2) {
      const confidence = count >= 5 ? "established" : count >= 3 ? "developing" : "emerging";
      insights.push({
        type: "thematic",
        title: cluster.cluster,
        observation: `This theme appears in ${count} of your reflections.`,
        question: cluster.question,
        confidence,
        dataPoints: count,
      });
    }
  }
  
  const hours = reflections.map(r => new Date(r.timestamp).getHours());
  const morningCount = hours.filter(h => h >= 5 && h < 10).length;
  const eveningCount = hours.filter(h => h >= 18 && h < 23).length;
  
  if (morningCount >= reflections.length * 0.5) {
    insights.push({
      type: "temporal",
      title: TEMPORAL_PATTERNS.morning.label,
      observation: `${Math.round(morningCount / reflections.length * 100)}% of your reflections happen in the morning.`,
      question: TEMPORAL_PATTERNS.morning.question,
      confidence: morningCount >= 5 ? "established" : "developing",
      dataPoints: morningCount,
    });
  } else if (eveningCount >= reflections.length * 0.5) {
    insights.push({
      type: "temporal",
      title: TEMPORAL_PATTERNS.evening.label,
      observation: `${Math.round(eveningCount / reflections.length * 100)}% of your reflections happen in the evening.`,
      question: TEMPORAL_PATTERNS.evening.question,
      confidence: eveningCount >= 5 ? "established" : "developing",
      dataPoints: eveningCount,
    });
  }
  
  if (reflections.length >= 7) {
    const daySpread = new Set(reflections.map(r => new Date(r.timestamp).toDateString())).size;
    if (daySpread >= 5) {
      insights.push({
        type: "growth",
        title: "Consistent Practice",
        observation: `You've reflected on ${daySpread} different days — building a genuine practice.`,
        question: "What keeps you coming back to reflection?",
        confidence: "established",
        dataPoints: daySpread,
      });
    }
  }
  
  return insights.slice(0, 5);
}

export function getGrowthMetrics(reflections: ReflectionData[]) {
  const totalReflections = reflections.length;
  const uniqueDays = new Set(reflections.map(r => new Date(r.timestamp).toDateString())).size;
  const avgLength = reflections.length > 0
    ? Math.round(reflections.reduce((sum, r) => sum + r.text.length, 0) / reflections.length)
    : 0;
  
  const streakDays = calculateStreak(reflections.map(r => r.timestamp));
  
  return {
    totalReflections,
    uniqueDays,
    avgLength,
    streakDays,
    depthScore: Math.min(100, Math.round((avgLength / 500) * 100)),
  };
}

function calculateStreak(timestamps: string[]): number {
  if (timestamps.length === 0) return 0;
  
  const dates = [...new Set(timestamps.map(t => new Date(t).toDateString()))].sort().reverse();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (dates[0] !== today && dates[0] !== yesterday) return 0;
  
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff <= 1.5) streak++;
    else break;
  }
  
  return streak;
}
