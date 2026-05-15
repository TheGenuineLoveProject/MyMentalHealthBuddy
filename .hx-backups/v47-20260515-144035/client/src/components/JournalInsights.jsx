import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Lightbulb, Sparkles, BarChart3, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const MOOD_COLORS = {
  joy: "#FFD93D",
  peace: "#8FBF9F",
  gratitude: "#D4AF37",
  love: "#E8A0BF",
  hope: "#87CEEB",
  neutral: "#9CA3AF",
  sadness: "#6B7280",
  anxiety: "#F59E0B",
  anger: "#EF4444",
  fear: "#8B5CF6"
};

const SENTIMENT_LABELS = {
  positive: { label: "Positive", color: "#8FBF9F", icon: TrendingUp },
  neutral: { label: "Neutral", color: "#9CA3AF", icon: Minus },
  negative: { label: "Needs Care", color: "#E8A0BF", icon: ArrowDown }
};

const PROMPTS_BY_MOOD = {
  positive: [
    "What brought you this sense of peace today?",
    "How can you carry this feeling forward?",
    "Write about a moment that made you smile."
  ],
  neutral: [
    "What's on your mind right now?",
    "Describe one thing you're grateful for today.",
    "What would make today feel complete?"
  ],
  negative: [
    "What would you say to a friend feeling this way?",
    "Name one small thing that could bring comfort.",
    "What do you need to hear right now?"
  ]
};

function analyzeSentiment(text) {
  if (!text) return { score: 0, label: "neutral" };
  
  const positiveWords = ["happy", "joy", "grateful", "peace", "love", "blessed", "wonderful", "amazing", "hope", "calm", "serene", "thankful", "beautiful", "growth", "healing", "strength", "proud", "accomplished"];
  const negativeWords = ["sad", "anxious", "worried", "fear", "angry", "frustrated", "overwhelmed", "stressed", "hurt", "pain", "difficult", "struggling", "tired", "exhausted", "lonely", "hopeless"];
  
  const words = text.toLowerCase().split(/\W+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const total = positiveCount + negativeCount;
  if (total === 0) return { score: 0, label: "neutral" };
  
  const score = (positiveCount - negativeCount) / total;
  
  if (score > 0.2) return { score, label: "positive" };
  if (score < -0.2) return { score, label: "negative" };
  return { score, label: "neutral" };
}

function extractKeywords(entries) {
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "i", "my", "me", "is", "was", "were", "been", "am", "are", "have", "has", "had", "do", "did", "it", "this", "that", "these", "those", "so", "very", "just", "about", "also", "really", "today", "now", "feel", "feeling"]);
  
  const wordCounts = {};
  
  entries.forEach(entry => {
    const words = (entry.content || "").toLowerCase().split(/\W+/);
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  });
  
  return Object.entries(wordCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));
}

export default function JournalInsights({ className = "", compact = false }) {
  const { user } = useAuth();
  
  const { data: journals = [] } = useQuery({
    queryKey: ["/api/journals"],
    enabled: !!user,
    staleTime: 60000,
  });

  const insights = useMemo(() => {
    if (!journals.length) return null;

    const recentEntries = journals.slice(0, 30);
    
    const sentimentHistory = recentEntries.map(entry => ({
      date: new Date(entry.createdAt),
      sentiment: analyzeSentiment(entry.content)
    }));
    
    const avgSentiment = sentimentHistory.reduce((sum, e) => sum + e.sentiment.score, 0) / sentimentHistory.length;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSentiments = sentimentHistory.filter(s => s.date >= weekAgo);
    const olderSentiments = sentimentHistory.filter(s => s.date < weekAgo);
    
    const recentAvg = recentSentiments.length 
      ? recentSentiments.reduce((sum, e) => sum + e.sentiment.score, 0) / recentSentiments.length 
      : 0;
    const olderAvg = olderSentiments.length 
      ? olderSentiments.reduce((sum, e) => sum + e.sentiment.score, 0) / olderSentiments.length 
      : 0;
    
    const trend = recentAvg - olderAvg;
    
    const keywords = extractKeywords(recentEntries);
    
    const overallLabel = avgSentiment > 0.2 ? "positive" : avgSentiment < -0.2 ? "negative" : "neutral";
    const suggestedPrompts = PROMPTS_BY_MOOD[overallLabel];
    
    let trendMessage = "";
    if (trend > 0.1) {
      trendMessage = "Your journaling shows increasing positivity this week!";
    } else if (trend < -0.1) {
      trendMessage = "You've been processing some heavier emotions. That's okay—healing takes time.";
    } else {
      trendMessage = "Your emotional journey has been steady. Keep reflecting.";
    }

    return {
      avgSentiment,
      overallLabel,
      trend,
      trendMessage,
      sentimentHistory: sentimentHistory.slice(0, 7).reverse(),
      keywords,
      suggestedPrompts,
      entryCount: journals.length
    };
  }, [journals]);

  if (!user || !insights) {
    return (
      <div className={`p-6 rounded-2xl ${className}`} style={{ background: 'var(--glp-sage-10)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6" style={{ color: 'var(--glp-gold)' }} />
          <h3 className="font-serif font-semibold" style={{ color: 'var(--glp-ink)' }}>
            Journal Insights
          </h3>
        </div>
        <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
          Start journaling to unlock personalized insights about your emotional journey.
        </p>
      </div>
    );
  }

  const sentimentInfo = SENTIMENT_LABELS[insights.overallLabel];
  const TrendIcon = insights.trend > 0.1 ? ArrowUp : insights.trend < -0.1 ? ArrowDown : Minus;

  if (compact) {
    return (
      <div className={`p-4 rounded-xl ${className}`} style={{ background: 'var(--glp-sage-10)' }} data-testid="journal-insights-compact">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" style={{ color: sentimentInfo.color }} />
            <span className="font-medium" style={{ color: 'var(--glp-ink)' }}>
              {sentimentInfo.label} Week
            </span>
          </div>
          <TrendIcon className="w-4 h-4" style={{ color: insights.trend > 0 ? 'var(--glp-sage)' : insights.trend < 0 ? 'var(--glp-rose)' : 'var(--glp-ink)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl p-6 shadow-lg ${className}`} style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }} data-testid="journal-insights">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" 
             style={{ background: 'linear-gradient(135deg, var(--glp-gold-30), var(--glp-gold-50))' }}>
          <Lightbulb className="w-6 h-6" style={{ color: 'var(--glp-gold)' }} />
        </div>
        <div>
          <h3 className="text-xl font-serif font-semibold" style={{ color: 'var(--glp-ink)' }}>
            Your Journey Insights
          </h3>
          <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
            Based on {insights.entryCount} journal entries
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl mb-6" style={{ background: sentimentInfo.color + '20' }}>
        <div className="flex items-center gap-2 mb-2">
          <TrendIcon className="w-5 h-5" style={{ color: sentimentInfo.color }} />
          <span className="font-semibold" style={{ color: 'var(--glp-ink)' }}>{insights.trendMessage}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--glp-ink)' }}>
          Recent Emotional Flow
        </h4>
        <div className="flex items-end gap-1 h-20">
          {insights.sentimentHistory.map((day, i) => {
            const height = Math.abs(day.sentiment.score) * 60 + 20;
            const color = day.sentiment.score > 0 ? 'var(--glp-sage)' : day.sentiment.score < 0 ? 'var(--glp-rose)' : 'var(--glp-ink)';
            return (
              <div 
                key={i} 
                className="flex-1 rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${height}%`, background: color, opacity: 0.6 + (i * 0.05) }}
                title={day.date.toLocaleDateString()}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {insights.keywords.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--glp-ink)' }}>
            Your Frequent Themes
          </h4>
          <div className="flex flex-wrap gap-2">
            {insights.keywords.slice(0, 10).map(({ word, count }) => (
              <span 
                key={word}
                className="px-3 py-1 rounded-full text-sm"
                style={{ 
                  background: 'var(--glp-sage-10)', 
                  color: 'var(--glp-sage)',
                  fontSize: `${Math.min(0.875 + count * 0.1, 1.25)}rem`
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl" style={{ background: 'var(--glp-gold-10)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--glp-gold)' }} />
          <h4 className="text-sm font-medium" style={{ color: 'var(--glp-gold-dark)' }}>
            Suggested Prompts
          </h4>
        </div>
        <ul className="space-y-2">
          {insights.suggestedPrompts.map((prompt, i) => (
            <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--glp-ink)' }}>
              <span style={{ color: 'var(--glp-gold)' }}>•</span>
              {prompt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
