import { db } from "../db/index.mjs";
import { journals } from "../../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";

export async function getJournalMirrorInsights(userId, limit = 5) {
  try {
    const recentEntries = await db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt))
      .limit(limit);

    if (!recentEntries.length) {
      return {
        patterns: [],
        themes: [],
        growth: null,
        suggestion: "Start journaling to discover patterns in your thoughts and feelings."
      };
    }

    const themes = extractThemes(recentEntries);
    const patterns = detectPatterns(recentEntries);
    
    return {
      patterns,
      themes,
      entryCount: recentEntries.length,
      suggestion: generateSuggestion(themes, patterns)
    };
  } catch (error) {
    console.error("JournalingMirror error:", error);
    return { patterns: [], themes: [], suggestion: null };
  }
}

function extractThemes(entries) {
  const themeKeywords = {
    gratitude: ["grateful", "thankful", "appreciate", "blessed"],
    growth: ["learn", "grow", "progress", "improve", "better"],
    healing: ["heal", "recover", "release", "let go", "peace"],
    relationships: ["friend", "family", "love", "connection", "support"],
    anxiety: ["worry", "anxious", "stress", "overwhelm", "fear"],
    hope: ["hope", "dream", "goal", "future", "wish"]
  };

  const themeCounts = {};
  
  entries.forEach(entry => {
    const content = (entry.content || "").toLowerCase();
    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      keywords.forEach(keyword => {
        if (content.includes(keyword)) {
          themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        }
      });
    });
  });

  return Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme]) => theme);
}

function detectPatterns(entries) {
  const patterns = [];
  
  if (entries.length >= 3) {
    patterns.push("Regular journaling practice detected");
  }
  
  const avgLength = entries.reduce((sum, e) => sum + (e.content?.length || 0), 0) / entries.length;
  if (avgLength > 500) {
    patterns.push("Deep reflection tendency");
  }
  
  return patterns;
}

function generateSuggestion(themes, patterns) {
  if (themes.includes("anxiety")) {
    return "Consider trying a grounding exercise before your next journal session.";
  }
  if (themes.includes("gratitude")) {
    return "Your gratitude practice is growing. Keep nurturing this positive focus.";
  }
  if (themes.includes("growth")) {
    return "You're showing beautiful self-awareness in your growth journey.";
  }
  return "Continue exploring your inner world through journaling.";
}

export default { getJournalMirrorInsights };
