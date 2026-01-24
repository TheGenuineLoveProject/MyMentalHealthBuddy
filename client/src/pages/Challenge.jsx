import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, Heart, CheckCircle, Circle, Calendar, 
  Sparkles, ArrowRight, ChevronRight
} from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";

const CHALLENGE_DAYS = [
  {
    day: 1,
    title: "Name One Feeling",
    description: "Take 60 seconds to identify and name one emotion you're experiencing.",
    prompt: "Right now, I notice I'm feeling...",
    duration: "60 seconds"
  },
  {
    day: 2,
    title: "Slow Your Breath",
    description: "Three slow breaths. In through the nose, out through the mouth.",
    prompt: "As I breathe out, I release...",
    duration: "90 seconds"
  },
  {
    day: 3,
    title: "One Kind Thought",
    description: "Offer yourself one kind thought—as you would to a friend.",
    prompt: "Something kind I can say to myself today is...",
    duration: "60 seconds"
  },
  {
    day: 4,
    title: "Notice Your Body",
    description: "Scan your body briefly. Where do you feel tension? Where is there ease?",
    prompt: "Right now, my body feels...",
    duration: "2 minutes"
  },
  {
    day: 5,
    title: "Small Boundary",
    description: "Identify one small boundary you could set today—even with yourself.",
    prompt: "One boundary that would support me is...",
    duration: "90 seconds"
  },
  {
    day: 6,
    title: "Gratitude Micro-Moment",
    description: "Notice one tiny thing you're grateful for. It can be very small.",
    prompt: "One small thing I appreciate right now is...",
    duration: "60 seconds"
  },
  {
    day: 7,
    title: "Reflect & Celebrate",
    description: "Look back at your week. What did you notice? What surprised you?",
    prompt: "This week, I learned about myself that...",
    duration: "3 minutes"
  },
];

export default function Challenge() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("glp-challenge-progress");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("glp-challenge-progress", JSON.stringify(progress));
  }, [progress]);

  const completedCount = Object.keys(progress).filter(k => progress[k]).length;
  const percentComplete = Math.round((completedCount / 7) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--glp-sage-10)] to-white dark:from-slate-900 dark:to-slate-800">
      <SEO 
        title="7-Day Gentle Challenge | The Genuine Love Project"
        description="A gentle 7-day self-reflection practice. Skip anytime. You're always welcome."
      />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              7-Day Gentle Challenge
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Small daily practices. Skip anytime. You're still welcome here.
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--glp-sage-10)] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[var(--glp-sage)]" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {completedCount} of 7 days
                </p>
                <p className="text-sm text-slate-500">completed</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--glp-sage)]">{percentComplete}%</p>
            </div>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-[var(--glp-sage)] h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          
          <p className="text-xs text-slate-500 mt-3 text-center">
            No pressure to complete. Your pace is perfect.
          </p>
        </div>
        
        <div className="space-y-4">
          {CHALLENGE_DAYS.map((day) => {
            const isCompleted = progress[day.day];
            
            return (
              <Link
                key={day.day}
                href={`/challenge/day/${day.day}`}
                className={`block bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border-2 transition-all hover:shadow-md ${
                  isCompleted 
                    ? "border-[var(--glp-sage)]" 
                    : "border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                }`}
                data-testid={`challenge-day-${day.day}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? "bg-[var(--glp-sage)]" 
                      : "bg-slate-100 dark:bg-slate-700"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        {day.day}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {day.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {day.duration} • {day.description}
                    </p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 p-4 bg-[var(--glp-rose-15)] dark:bg-rose-900/20 rounded-xl text-center">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong>Skip today. You're still welcome here.</strong><br />
            This isn't about perfection. It's about small moments of showing up for yourself.
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
    </div>
  );
}

export { CHALLENGE_DAYS };
