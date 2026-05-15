export interface StatePattern {
  dimension: string;
  average: number;
  trend: "rising" | "falling" | "stable" | "volatile";
  observations: number;
}

export interface PatternInsight {
  type: "observation" | "correlation" | "anomaly" | "experiment";
  title: string;
  description: string;
  suggestion?: string;
}

export interface PatternLabSession {
  id: string;
  createdAt: string;
  windowDays: number;
  patterns: StatePattern[];
  insights: PatternInsight[];
  userNotes: string;
}

export const STATE_DIMENSIONS = [
  { id: "energy", label: "Energy", options: ["Depleted", "Low", "Neutral", "Steady", "Wired"] },
  { id: "clarity", label: "Clarity", options: ["Foggy", "Scattered", "Mixed", "Clear", "Sharp"] },
  { id: "openness", label: "Openness", options: ["Closed", "Guarded", "Selective", "Receptive", "Expansive"] },
  { id: "regulation", label: "Regulation", options: ["Reactive", "Unstable", "Variable", "Stable", "Grounded"] },
  { id: "presence", label: "Presence", options: ["Distant", "Distracted", "Partial", "Engaged", "Absorbed"] },
  { id: "pace", label: "Pace", options: ["Rushed", "Hurried", "Moderate", "Unhurried", "Still"] }
];

export const PATTERN_EXPERIMENTS: { title: string; description: string; duration: string }[] = [
  {
    title: "Morning Pages",
    description: "Write freely for 10 minutes each morning before any other activity. Notice if clarity patterns shift.",
    duration: "7 days"
  },
  {
    title: "Energy Mapping",
    description: "Track energy levels at 4 time points daily. Look for your natural rhythm.",
    duration: "5 days"
  },
  {
    title: "Screen Sunset",
    description: "No screens 1 hour before bed. Observe effects on next-day clarity and regulation.",
    duration: "5 days"
  },
  {
    title: "Gratitude Anchor",
    description: "Name 3 specific things you noticed with appreciation today. Track openness dimension.",
    duration: "7 days"
  },
  {
    title: "Body Scan Moments",
    description: "Pause 3x daily to notice physical sensations for 60 seconds. Observe presence patterns.",
    duration: "5 days"
  },
  {
    title: "Pace Experiment",
    description: "Deliberately slow one daily activity by 50%. Notice internal pace responses.",
    duration: "3 days"
  },
  {
    title: "Opposite Action",
    description: "When noticing a strong emotional pull, take 10 breaths before acting. Track regulation.",
    duration: "5 days"
  },
  {
    title: "Nature Micro-Dose",
    description: "Spend 20 minutes outdoors daily without devices. Observe all dimensions.",
    duration: "7 days"
  }
];

export function analyzePatterns(stateHistory: { dimension: string; value: number; timestamp: string }[], windowDays: number = 7): StatePattern[] {
  const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const recent = stateHistory.filter(s => new Date(s.timestamp).getTime() > cutoff);
  
  const byDimension: Record<string, number[]> = {};
  recent.forEach(s => {
    if (!byDimension[s.dimension]) byDimension[s.dimension] = [];
    byDimension[s.dimension].push(s.value);
  });

  return Object.entries(byDimension).map(([dimension, values]) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / values.length;
    
    let trend: StatePattern["trend"] = "stable";
    if (values.length >= 3) {
      const firstHalf = values.slice(0, Math.floor(values.length / 2));
      const secondHalf = values.slice(Math.floor(values.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (variance > 1.5) {
        trend = "volatile";
      } else if (secondAvg - firstAvg > 0.5) {
        trend = "rising";
      } else if (firstAvg - secondAvg > 0.5) {
        trend = "falling";
      }
    }

    return {
      dimension,
      average: Math.round(avg * 10) / 10,
      trend,
      observations: values.length
    };
  });
}

export function generateInsights(patterns: StatePattern[]): PatternInsight[] {
  const insights: PatternInsight[] = [];

  patterns.forEach(p => {
    if (p.trend === "volatile") {
      insights.push({
        type: "observation",
        title: `${p.dimension} shows variability`,
        description: `Your ${p.dimension.toLowerCase()} has been fluctuating. This is neither good nor bad — just worth noticing.`,
        suggestion: "You might explore what conditions correlate with shifts."
      });
    }

    if (p.average < 2) {
      insights.push({
        type: "observation",
        title: `${p.dimension} running low`,
        description: `${p.dimension} has been on the lower end recently. This is information, not a problem to fix.`,
        suggestion: "Consider what might be depleting this resource."
      });
    }

    if (p.average > 4) {
      insights.push({
        type: "observation",
        title: `${p.dimension} running high`,
        description: `${p.dimension} has been elevated. Notice how this feels and what supports it.`
      });
    }
  });

  const volatileDimensions = patterns.filter(p => p.trend === "volatile");
  if (volatileDimensions.length >= 2) {
    insights.push({
      type: "correlation",
      title: "Multiple dimensions fluctuating",
      description: "Several aspects of your state are in flux. This could indicate a transition period.",
      suggestion: "Increased self-observation might be helpful during this time."
    });
  }

  if (patterns.length >= 3 && insights.length === 0) {
    insights.push({
      type: "observation",
      title: "Relative stability observed",
      description: "Your tracked dimensions show consistent patterns. This baseline is useful for noticing future changes."
    });
  }

  return insights;
}

export function getRandomExperiment(): typeof PATTERN_EXPERIMENTS[0] {
  return PATTERN_EXPERIMENTS[Math.floor(Math.random() * PATTERN_EXPERIMENTS.length)];
}

export function savePatternLabSession(session: PatternLabSession): void {
  const key = "glp_pattern_lab_sessions";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([session, ...existing].slice(0, 20)));
}

export function getPatternLabSessions(): PatternLabSession[] {
  return JSON.parse(localStorage.getItem("glp_pattern_lab_sessions") || "[]");
}
