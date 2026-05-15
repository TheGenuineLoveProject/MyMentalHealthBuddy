import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sparkles, Heart, TrendingUp, Download, Volume2, VolumeX, Loader2, BookOpen, Smile, RefreshCw } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";

const POETIC_TEMPLATES = {
  joy: {
    feeling: "basking in the warmth of joy",
    healing: "your capacity for happiness",
    suggestion: "sharing this light with others"
  },
  calm: {
    feeling: "finding peace within yourself",
    healing: "your inner sanctuary of stillness",
    suggestion: "deepening your meditation practice"
  },
  sad: {
    feeling: "honoring your tender heart",
    healing: "the courage to feel deeply",
    suggestion: "gentle self-compassion rituals"
  },
  anxious: {
    feeling: "navigating waves of uncertainty",
    healing: "your nervous system's wisdom",
    suggestion: "grounding practices and breathwork"
  },
  grateful: {
    feeling: "overflowing with appreciation",
    healing: "your grateful heart",
    suggestion: "expanding your gratitude practice"
  },
  hopeful: {
    feeling: "holding space for possibility",
    healing: "your trust in the future",
    suggestion: "vision journaling and intention setting"
  },
  loved: {
    feeling: "surrounded by connection",
    healing: "your capacity to receive love",
    suggestion: "heart-opening meditations"
  },
  neutral: {
    feeling: "finding balance in the ordinary",
    healing: "your ability to simply be",
    suggestion: "mindful awareness practices"
  },
  balanced: {
    feeling: "walking a centered path",
    healing: "your emotional equilibrium",
    suggestion: "maintaining your current practices"
  }
};

function generatePoeticInsight(summary) {
  const template = POETIC_TEMPLATES[summary.dominantEmotion] || POETIC_TEMPLATES.balanced;
  
  return {
    feeling: `This week, you were ${template.feeling}. You showed up ${summary.moodEntryCount} times to honor your emotions.`,
    healing: `You are healing ${template.healing}. ${summary.gratitudeCount > 0 ? `Your ${summary.gratitudeCount} gratitude reflections watered the seeds of abundance.` : "Consider adding gratitude to your practice."}`,
    suggestion: `Consider more of ${template.suggestion} in the coming week. ${summary.journalCount > 0 ? `Your ${summary.journalCount} journal entries show beautiful self-reflection.` : "Journaling could deepen your insights."}`
  };
}

export default function ReflectionInsights({ 
  showVoice = true,
  className = "" 
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);

  const { data: summary, isLoading, refetch } = useQuery({
    queryKey: ["/api/gratitude/weekly-summary"],
    staleTime: 1000 * 60 * 5
  });

  const poeticInsight = useMemo(() => {
    if (!summary) return null;
    return generatePoeticInsight(summary);
  }, [summary]);

  const generateAIInsight = useMutation({
    mutationFn: async () => {
      setIsGeneratingAI(true);
      try {
        const response = await apiRequest("POST", "/api/ai/weekly-reflection", {
          summary
        });
        return response;
      } catch {
        return null;
      }
    },
    onSuccess: (data) => {
      if (data?.insight) {
        setAiInsight(data.insight);
      }
      setIsGeneratingAI(false);
    },
    onError: () => {
      setIsGeneratingAI(false);
    }
  });

  const speakInsight = () => {
    if (!poeticInsight) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${poeticInsight.feeling} ${poeticInsight.healing} ${poeticInsight.suggestion}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes("Samantha") || 
      v.name.includes("Karen") || 
      (v.lang.startsWith("en") && v.name.includes("Female"))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const downloadPDF = () => {
    if (!poeticInsight || !summary) return;

    const content = `
THE GENUINE LOVE PROJECT
Weekly Reflection - ${new Date().toLocaleDateString()}

YOUR WEEK AT A GLANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Mood Entries: ${summary.moodEntryCount}
📝 Journal Entries: ${summary.journalCount}
💝 Gratitude Reflections: ${summary.gratitudeCount}
🌈 Dominant Emotion: ${summary.dominantEmotion}
${summary.averageMoodScore ? `⭐ Average Mood: ${summary.averageMoodScore}/10` : ""}

YOUR POETIC INSIGHT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${poeticInsight.feeling}

${poeticInsight.healing}

${poeticInsight.suggestion}

${aiInsight ? `
AI REFLECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${aiInsight}
` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created with love by The Genuine Love Project
Remember: You are worthy of healing and happiness.
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `weekly-reflection-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className={`p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-900/20 dark:to-rose-900/20 ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          <span className="text-amber-700 dark:text-amber-300">Gathering your weekly wisdom...</span>
        </div>
      </div>
    );
  }

  if (!summary || (summary.moodEntryCount === 0 && summary.journalCount === 0 && summary.gratitudeCount === 0)) {
    return (
      <div className={`p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 text-center ${className}`} data-testid="reflection-insights-empty">
        <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Your Story is Just Beginning
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Start tracking your moods, writing journals, or practicing gratitude to receive your weekly reflection.
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl ${className}`}
      data-testid="reflection-insights"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-50 to-pink-100 dark:from-amber-900/30 dark:via-rose-900/20 dark:to-pink-900/30" />
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-yellow-200/40 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial from-rose-200/40 to-transparent rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-gray-800 dark:text-white">
                Weekly Reflection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your journey this week
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition"
              title="Refresh insights"
              data-testid="button-refresh-insights"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            {showVoice && (
              <button
                onClick={speakInsight}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition"
                title={isSpeaking ? "Stop reading" : "Read aloud"}
                data-testid="button-voice-insight"
              >
                {isSpeaking ? (
                  <VolumeX className="w-5 h-5 text-rose-500" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            )}
            <button
              onClick={downloadPDF}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition"
              title="Download reflection"
              data-testid="button-download-insight"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard icon={Smile} value={summary.moodEntryCount} label="Moods" color="sky" />
          <StatCard icon={BookOpen} value={summary.journalCount} label="Journals" color="violet" />
          <StatCard icon={Heart} value={summary.gratitudeCount} label="Gratitude" color="rose" />
          <StatCard icon={TrendingUp} value={summary.averageMoodScore || "-"} label="Avg Mood" color="amber" />
        </div>

        <div className="space-y-4 mb-6">
          <InsightCard
            emoji="🌸"
            title="This week you felt..."
            content={poeticInsight.feeling}
          />
          <InsightCard
            emoji="💚"
            title="You are healing..."
            content={poeticInsight.healing}
          />
          <InsightCard
            emoji="✨"
            title="Consider more of..."
            content={poeticInsight.suggestion}
          />
        </div>

        {aiInsight && (
          <div className="p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/50 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">AI Reflection</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic font-serif leading-relaxed">
              {aiInsight}
            </p>
          </div>
        )}

        <button
          onClick={() => generateAIInsight.mutate()}
          disabled={isGeneratingAI}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          data-testid="button-generate-ai-insight"
        >
          {isGeneratingAI ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating deeper insight...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Reflection
            </>
          )}
        </button>

        {summary.gratitudeThemes?.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Gratitude themes: {summary.gratitudeThemes.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  const colorClasses = {
    sky: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
    violet: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    rose: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
  };

  return (
    <div className={`p-3 rounded-xl ${colorClasses[color]} text-center`}>
      <Icon className="w-5 h-5 mx-auto mb-1" />
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}

function InsightCard({ emoji, title, content }) {
  return (
    <div className="p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/50">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-serif italic leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
