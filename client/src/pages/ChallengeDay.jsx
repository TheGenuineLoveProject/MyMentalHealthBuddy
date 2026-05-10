import { useState, useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, Clock, ArrowRight, Share2, Loader2, Sparkles } from 'lucide-react';
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { ReflectionCard } from "../components/share";
import ShareModal from "../components/share/ShareModal";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const CHALLENGE_DAYS = [
  { day: 1, title: "Name One Feeling", description: "Take 60 seconds to identify and name one emotion you're experiencing.", prompt: "Right now, I notice I'm feeling...", duration: "60 seconds" },
  { day: 2, title: "Slow Your Breath", description: "Three slow breaths. In through the nose, out through the mouth.", prompt: "As I breathe out, I release...", duration: "90 seconds" },
  { day: 3, title: "One Kind Thought", description: "Offer yourself one kind thought—as you would to a friend.", prompt: "Something kind I can say to myself today is...", duration: "60 seconds" },
  { day: 4, title: "Notice Your Body", description: "Scan your body briefly. Where do you feel tension? Where is there ease?", prompt: "Right now, my body feels...", duration: "2 minutes" },
  { day: 5, title: "Small Boundary", description: "Identify one small boundary you could set today—even with yourself.", prompt: "One boundary that would support me is...", duration: "90 seconds" },
  { day: 6, title: "Gratitude Micro-Moment", description: "Notice one tiny thing you're grateful for. It can be very small.", prompt: "One small thing I appreciate right now is...", duration: "60 seconds" },
  { day: 7, title: "Reflect & Celebrate", description: "Look back at your week. What did you notice? What surprised you?", prompt: "This week, I learned about myself that...", duration: "3 minutes" },
];

export default function ChallengeDay() {
  const [, params] = useRoute("/challenge/day/:dayNum");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const dayNum = parseInt(params?.dayNum || "1", 10);
  
  const day = CHALLENGE_DAYS.find(d => d.day === dayNum) || CHALLENGE_DAYS[0];
  const nextDay = CHALLENGE_DAYS.find(d => d.day === dayNum + 1);
  
  const [reflection, setReflection] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  
  const { data: progressData, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/gamification/progress"],
    enabled: !!user,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("glp-challenge-progress");
      const progress = saved ? JSON.parse(saved) : {};
      const localCompleted = !!progress[dayNum];
      
      // Check server-side completion if user is authenticated
      if (user && progressData?.sessions) {
        const serverCompleted = progressData.sessions.some(
          s => s.toolName === `challenge-day-${dayNum}`
        );
        setCompleted(serverCompleted || localCompleted);
      } else {
        setCompleted(localCompleted);
      }
    } catch {
      setCompleted(false);
    }
  }, [dayNum, user, progressData]);

  const completeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/gamification/record-session", {
        toolName: `challenge-day-${dayNum}`,
        durationSeconds: dayNum === 7 ? 180 : 90,
        metadata: { day: dayNum, title: day.title }
      });
    },
    onSuccess: (data) => {
      try {
        const saved = localStorage.getItem("glp-challenge-progress");
        const progress = saved ? JSON.parse(saved) : {};
        progress[dayNum] = true;
        localStorage.setItem("glp-challenge-progress", JSON.stringify(progress));
      } catch {}
      
      setCompleted(true);
      setXpEarned(data?.xpEarned || 25);
      queryClient.invalidateQueries({ queryKey: ["/api/gamification/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
      
      toast({
        title: "Day Complete!",
        description: `You earned ${data?.xpEarned || 25} XP. Great work on your healing journey.`,
      });
    },
    onError: () => {
      try {
        const saved = localStorage.getItem("glp-challenge-progress");
        const progress = saved ? JSON.parse(saved) : {};
        progress[dayNum] = true;
        localStorage.setItem("glp-challenge-progress", JSON.stringify(progress));
      } catch {}
      setCompleted(true);
      toast({
        title: "Day Complete!",
        description: "Progress saved locally. Keep going!",
      });
    }
  });

  const handleComplete = () => {
    if (user) {
      completeMutation.mutate();
    } else {
      try {
        const saved = localStorage.getItem("glp-challenge-progress");
        const progress = saved ? JSON.parse(saved) : {};
        progress[dayNum] = true;
        localStorage.setItem("glp-challenge-progress", JSON.stringify(progress));
      } catch {}
      setCompleted(true);
      toast({
        title: "Day Complete!",
        description: "Sign in to earn XP and track your streak!",
      });
    }
  };

  const handleSaveCard = ({ text, theme }) => {
    try {
      const saved = localStorage.getItem("glp-reflection-cards");
      const cards = saved ? JSON.parse(saved) : [];
      cards.push({
        id: Date.now(),
        text,
        theme,
        day: dayNum,
        date: new Date().toISOString(),
      });
      localStorage.setItem("glp-reflection-cards", JSON.stringify(cards));
      toast({
        title: "Card Saved",
        description: "Your reflection card has been saved.",
      });
    } catch {
      toast({
        title: "Couldn't save card",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
  <WellnessPageShell
    title="ChallengeDay"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div className="min-h-screen bg-gradient-to-b from-[var(--glp-sage-10)] to-white dark:from-slate-900 dark:to-slate-800">
      <SEO 
        title={`Day ${dayNum}: ${day.title} | 7-Day Gentle Challenge`}
        description={day.description}
      />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/challenge" className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[var(--glp-sage)] text-white text-sm font-medium rounded-full">
              Day {dayNum} of 7
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              {day.duration}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {day.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {day.description}
          </p>
          
          <div className="bg-[var(--glp-sage-10)] dark:bg-slate-700 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Today's prompt:
            </p>
            <p className="text-lg italic text-slate-800 dark:text-white">
              "{day.prompt}"
            </p>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write your reflection here... (only you see this)"
              className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--glp-sage)] text-slate-800 dark:text-white"
              rows={5}
              data-testid="reflection-textarea"
            />
            
            <p className="text-xs text-slate-400 text-center">
              Your reflections stay private. Delete anytime.
            </p>
          </div>
        </div>
        
        {reflection && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">
              Create a shareable card (if you'd like)
            </h2>
            <ReflectionCard
              reflection={reflection.slice(0, 150)}
              editable={true}
              onSave={handleSaveCard}
            />
            
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--glp-sage)] hover:bg-[var(--glp-sage-10)] rounded-lg transition-colors"
                data-testid="button-share"
              >
                <Share2 className="w-4 h-4" />
                Share if it resonates
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          {!completed ? (
            <button
              onClick={handleComplete}
              disabled={completeMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--glp-sage)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-complete-day"
            >
              {completeMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Mark Day Complete
                </>
              )}
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-medium">
              <CheckCircle className="w-5 h-5" />
              Day Completed!
              {xpEarned > 0 && (
                <span className="flex items-center gap-1 ml-2 text-sm">
                  <Sparkles className="w-4 h-4" /> +{xpEarned} XP
                </span>
              )}
            </div>
          )}
          
          {nextDay && (
            <Link
              href={`/challenge/day/${nextDay.day}`}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Next Day
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-[var(--glp-rose-15)] dark:bg-rose-900/20 rounded-xl text-center">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong>Skip today. You're still welcome here.</strong><br />
            If this doesn't feel supportive, pause or stop. You can switch to something gentler. Come back whenever you're ready—there's no deadline.
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
          <p className="text-xs text-slate-500">
            Educational support only—not therapy or medical advice.{" "}
            <a href="/crisis" className="text-[var(--glp-sage)] hover:underline font-medium">
              If you're in crisis, get help now →
            </a>
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/crisis"
            className="text-sm text-[var(--glp-sage)] hover:underline"
          >
            Need urgent support? Visit our crisis page →
          </Link>
        </div>
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
      
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        shareText={`Day ${dayNum}: ${day.title} - "${reflection.slice(0, 100)}..."`}
        shareUrl={`https://genuineloveproject.com/challenge`}
        title="Share your reflection"
      />
    </div>
  </WellnessPageShell>
  );
}
