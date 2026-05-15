import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, Lightbulb, Calendar, Clock, TrendingUp, Sparkles, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import "@/styles/sacred-visuals.css";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const INSIGHT_TEMPLATES = {
  happiest_day: (day) => `You tend to feel most joyful on ${day}s. This could be a great day for important decisions or creative work.`,
  calmest_time: (time) => `Your calmest hour is around ${time}. Consider scheduling mindfulness or reflection during this peaceful window.`,
  most_active: (day) => `${day}s show the most emotional variety. You're processing more on these days - that's healthy self-awareness.`,
  mood_pattern: (pattern) => pattern === "improving" 
    ? "Your overall mood has been trending upward. Keep nurturing what's working for you."
    : pattern === "stable"
      ? "Your emotional state has been beautifully stable. This consistency is a sign of inner balance."
      : "You've been navigating some emotional waves lately. Remember: this too shall pass.",
  emotion_strength: (emotion) => `"${emotion}" is your most frequently logged emotion. Understanding this pattern helps you honor your authentic feelings.`,
  streak_insight: (days) => `You've maintained ${days} days of consistent journaling. This dedication is building powerful self-awareness.`,
};

export default function MoodInsight({ compact = false }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  const { data: insights, isLoading, refetch } = useQuery({
    queryKey: ["/api/insights/mood"],
    staleTime: 1000 * 60 * 15
  });

  const insightsList = insights?.insights || [];
  const currentInsight = insightsList[currentInsightIndex];

  const speakInsight = () => {
    if (!currentInsight) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentInsight.text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const nextInsight = () => {
    if (insightsList.length > 1) {
      setCurrentInsightIndex((prev) => (prev + 1) % insightsList.length);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (!currentInsight) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-playfair text-lg font-semibold text-gray-800 dark:text-white">
            Mood Insights
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Keep logging your moods and journal entries. After a few days, personalized insights will appear here based on your patterns.
        </p>
      </div>
    );
  }

  const emotionColors = {
    joy: "glow-ring-joy",
    calm: "glow-ring-calm",
    grateful: "glow-ring-grateful",
    hopeful: "glow-ring-hopeful",
    healing: "glow-ring-healing",
    loved: "glow-ring-loved",
    sad: "glow-ring-sad",
    anxious: "glow-ring-anxious",
    balanced: "glow-ring-balanced"
  };

  const glowClass = emotionColors[currentInsight.relatedEmotion] || "glow-ring-balanced";

  if (compact) {
    return (
      <div className="p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {currentInsight.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative p-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-violet-100 dark:border-gray-700 shadow-lg overflow-hidden`} data-testid="mood-insight">
      <div className={`glow-ring rounded-2xl ${glowClass}`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center shadow-md lotus-blossom">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-semibold text-gray-800 dark:text-white">
                Mood Insights
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Patterns from your journey
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={speakInsight}
              className="p-2 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition"
              title={isSpeaking ? "Stop" : "Read aloud"}
              data-testid="button-speak-insight"
            >
              {isSpeaking ? (
                <VolumeX className="w-5 h-5 text-violet-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-violet-400" />
              )}
            </button>
            {insightsList.length > 1 && (
              <button
                onClick={nextInsight}
                className="p-2 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition"
                title="Next insight"
                data-testid="button-next-insight"
              >
                <ChevronRight className="w-5 h-5 text-violet-400" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <div className="flex-shrink-0 mt-1">
              <Sparkles className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                {currentInsight.text}
              </p>
              {currentInsight.dataPoint && (
                <div className="flex items-center gap-2 mt-3 text-sm text-violet-600 dark:text-violet-400">
                  {currentInsight.type === "day_pattern" && <Calendar className="w-4 h-4" />}
                  {currentInsight.type === "time_pattern" && <Clock className="w-4 h-4" />}
                  {currentInsight.type === "trend" && <TrendingUp className="w-4 h-4" />}
                  <span>{currentInsight.dataPoint}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {insightsList.length > 1 && (
          <div className="flex items-center justify-center gap-1">
            {insightsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentInsightIndex(idx)}
                className={`w-2 h-2 rounded-full transition ${
                  idx === currentInsightIndex 
                    ? "bg-violet-500 w-4" 
                    : "bg-violet-200 dark:bg-violet-700"
                }`}
                data-testid={`insight-dot-${idx}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function MoodInsightMini({ insight }) {
  if (!insight) return null;
  
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
      <Lightbulb className="w-4 h-4 text-violet-500 flex-shrink-0" />
      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
        {insight}
      </p>
    </div>
  );
}
