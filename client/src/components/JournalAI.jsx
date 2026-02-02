import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Heart, Wind, Music, BookOpen, Loader2 } from "lucide-react";
import { useEmotion } from "../context/EmotionContext";
import VoiceAffirmation from "./VoiceAffirmation";

const MOOD_KEYWORDS = {
  joy: ["happy", "joyful", "excited", "wonderful", "amazing", "great", "blessed", "grateful"],
  calm: ["peaceful", "calm", "relaxed", "serene", "quiet", "still", "centered"],
  sad: ["sad", "down", "depressed", "lonely", "hurt", "crying", "tears", "lost"],
  anxious: ["anxious", "worried", "stressed", "nervous", "afraid", "scared", "panic"],
  grateful: ["grateful", "thankful", "appreciate", "blessed", "fortunate"],
  angry: ["angry", "frustrated", "annoyed", "mad", "upset", "furious"],
  hopeful: ["hope", "hopeful", "optimistic", "looking forward", "excited about"],
  loved: ["loved", "love", "caring", "supported", "connected", "belonging"]
};

const TOOL_RECOMMENDATIONS = {
  joy: { tool: "Gratitude Journal", icon: BookOpen, action: "Capture this moment" },
  calm: { tool: "Meditation", icon: Wind, action: "Deepen your peace" },
  sad: { tool: "Breathwork", icon: Wind, action: "Gentle breathing exercise" },
  anxious: { tool: "4-7-8 Breathing", icon: Wind, action: "Calm your nervous system" },
  grateful: { tool: "Reflection", icon: Heart, action: "Expand your gratitude" },
  angry: { tool: "Release Writing", icon: BookOpen, action: "Express and release" },
  hopeful: { tool: "Vision Board", icon: Sparkles, action: "Visualize your future" },
  loved: { tool: "Heart Meditation", icon: Heart, action: "Radiate love outward" },
  neutral: { tool: "Mindful Music", icon: Music, action: "Gentle background sounds" }
};

const LOCAL_AFFIRMATIONS = {
  joy: ["Your joy is a gift to the world.", "Celebrate this beautiful feeling.", "You deserve every moment of happiness."],
  calm: ["Peace flows through you.", "In stillness, you find strength.", "Your calm presence heals."],
  sad: ["It's okay to feel this way.", "Your tears water the seeds of growth.", "This too shall pass, and you will bloom."],
  anxious: ["You are safe in this moment.", "Breathe. You've survived every challenge before.", "Anxiety is temporary; your strength is permanent."],
  grateful: ["Gratitude opens doors to abundance.", "Your thankful heart attracts miracles.", "Each blessing recognized multiplies."],
  angry: ["Your feelings are valid.", "This energy can be transformed.", "Behind anger lies a boundary worth honoring."],
  hopeful: ["Hope is the seed of all change.", "Your optimism creates your reality.", "Beautiful things await you."],
  loved: ["You are worthy of infinite love.", "Love flows to and through you.", "You belong here."],
  neutral: ["Balance is a gift.", "You are exactly where you need to be.", "Each moment is an opportunity."]
};

function analyzeMood(text) {
  const lowerText = text.toLowerCase();
  const moodScores = {};

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    moodScores[mood] = keywords.filter(kw => lowerText.includes(kw)).length;
  }

  const topMood = Object.entries(moodScores)
    .sort(([, a], [, b]) => b - a)
    .find(([, score]) => score > 0);

  return topMood ? topMood[0] : "neutral";
}

function getLocalAffirmation(mood) {
  const affirmations = LOCAL_AFFIRMATIONS[mood] || LOCAL_AFFIRMATIONS.neutral;
  return affirmations[Math.floor(Math.random() * affirmations.length)];
}

export default function JournalAI({ 
  journalText, 
  onAnalysisComplete,
  showVoice = true,
  className = "" 
}) {
  const { setEmotion } = useEmotion();
  const [analysis, setAnalysis] = useState(null);
  const [showAffirmation, setShowAffirmation] = useState(false);

  const analysisMutation = useMutation({
    mutationFn: async (text) => {
      try {
        const response = await apiRequest("/api/ai/analyze-journal", {
          method: "POST",
          body: JSON.stringify({ text })
        });
        return response;
      } catch {
        const detectedMood = analyzeMood(text);
        return {
          mood: detectedMood,
          affirmation: getLocalAffirmation(detectedMood),
          recommendation: TOOL_RECOMMENDATIONS[detectedMood] || TOOL_RECOMMENDATIONS.neutral,
          isLocal: true
        };
      }
    },
    onSuccess: (data) => {
      setAnalysis(data);
      setEmotion(data.mood, 0.8);
      setShowAffirmation(true);
      onAnalysisComplete?.(data);
    }
  });

  const analyze = useCallback(() => {
    if (journalText && journalText.length > 10) {
      analysisMutation.mutate(journalText);
    }
  }, [journalText, analysisMutation]);

  const recommendation = analysis?.recommendation || TOOL_RECOMMENDATIONS.neutral;
  const RecommendIcon = recommendation.icon || Sparkles;

  if (!analysis && !analysisMutation.isPending) {
    return (
      <button
        onClick={analyze}
        disabled={!journalText || journalText.length < 10}
        className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--glp-sage)] to-[var(--glp-teal)] text-white font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        data-testid="button-analyze-journal"
      >
        <Sparkles className="w-4 h-4" />
        <span>Get Insights</span>
      </button>
    );
  }

  if (analysisMutation.isPending) {
    return (
      <div className={`flex items-center gap-2 text-[var(--glp-sage)] ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Analyzing your words...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} data-testid="journal-ai-insights">
      {showVoice && showAffirmation && analysis?.affirmation && (
        <VoiceAffirmation
          text={analysis.affirmation}
          onComplete={() => setShowAffirmation(false)}
        />
      )}

      <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--glp-sage)]/10 to-[var(--glp-teal)]/10 border border-[var(--glp-sage)]/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--glp-sage)]/20 flex items-center justify-center flex-shrink-0">
            <RecommendIcon className="w-5 h-5 text-[var(--glp-sage)]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              Recommended: {recommendation.tool}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {recommendation.action}
            </p>
          </div>
        </div>

        {analysis?.affirmation && (
          <div className="mt-4 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <p className="text-xs uppercase tracking-wide text-[var(--glp-gold)] mb-1">
              Your Affirmation
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 italic font-playfair">
              "{analysis.affirmation}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
