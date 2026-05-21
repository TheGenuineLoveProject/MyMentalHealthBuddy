import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Sunrise, Moon, Heart, Sparkles, CheckCircle2, Clock, Target, Flame, Leaf, Shield, Wind, Waves, Sun } from 'lucide-react';
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { useSEO } from "../hooks/useSEO";
import SafetyFooter from "../components/ui/ReflectionFooter";

const MORNING_PRACTICES = [
  { id: "gratitude", name: "Gratitude Moment", duration: "2 min", icon: Heart, description: "Start your day by acknowledging three things you appreciate", href: "/journal" },
  { id: "breathing", name: "Morning Breathwork", duration: "5 min", icon: Wind, description: "Energizing breath to awaken your nervous system gently", href: "/breathing" },
  { id: "intention", name: "Daily Intention", duration: "3 min", icon: Target, description: "Set a meaningful focus for your day ahead", href: "/journal" },
  { id: "affirmation", name: "Self-Affirmation", duration: "2 min", icon: Sparkles, description: "Speak kindness to yourself to begin", href: "/affirmations" }
];

const MIDDAY_PRACTICES = [
  { id: "grounding", name: "Grounding Check-In", duration: "3 min", icon: Leaf, description: "Reconnect with your body and present moment", href: "/grounding" },
  { id: "stress-reset", name: "Stress Reset", duration: "5 min", icon: Shield, description: "Release accumulated tension from the morning", href: "/breathing" },
  { id: "mindful-pause", name: "Mindful Pause", duration: "2 min", icon: Clock, description: "A brief pause to check in with yourself", href: "/meditation" },
  { id: "movement", name: "Gentle Movement", duration: "5 min", icon: Waves, description: "Reconnect with your body through gentle stretching", href: "/grounding" }
];

const EVENING_PRACTICES = [
  { id: "reflection", name: "Evening Reflection", duration: "5 min", icon: Moon, description: "Process your day with gentle curiosity", href: "/journal" },
  { id: "calming", name: "Calming Breath", duration: "5 min", icon: Wind, description: "Prepare your nervous system for rest", href: "/breathing" },
  { id: "gratitude-close", name: "Gratitude Close", duration: "3 min", icon: Heart, description: "End your day with appreciation", href: "/journal" },
  { id: "release", name: "Letting Go Practice", duration: "5 min", icon: Sparkles, description: "Release what no longer serves you", href: "/meditation" }
];

const QUICK_RESETS = [
  { id: "box-breath", name: "Box Breathing", duration: "1 min", description: "4-4-4-4 pattern for quick calm", href: "/breathing" },
  { id: "54321", name: "5-4-3-2-1 Grounding", duration: "2 min", description: "Use your senses to return to now", href: "/grounding" },
  { id: "self-hug", name: "Self-Compassion Pause", duration: "1 min", description: "Place hand on heart, breathe", href: "/self-care" },
  { id: "stretch", name: "Tension Release", duration: "2 min", description: "Shake, stretch, and release", href: "/grounding" }
];

function PracticeCard({ practice, completed, onToggle }) {
  const Icon = practice.icon || Sparkles;
  
  return (
    <div 
      className={`p-4 rounded-xl border transition-all duration-300 ${
        completed 
          ? "bg-sage-50 dark:bg-sage-900/30 border-sage-200 dark:border-sage-700" 
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sage-300 dark:hover:border-sage-600"
      }`}
      data-testid={`practice-card-${practice.id}`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(practice.id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            completed 
              ? "bg-sage-500 border-sage-500 text-white" 
              : "border-slate-300 dark:border-slate-600 hover:border-sage-400"
          }`}
          data-testid={`toggle-${practice.id}`}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && <CheckCircle2 className="w-4 h-4" />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-4 h-4 ${completed ? "text-sage-500" : "text-sage-600 dark:text-sage-400"}`} />
            <h3 className={`font-medium ${completed ? "text-sage-700 dark:text-sage-300 line-through opacity-75" : "text-slate-800 dark:text-slate-200"}`}>
              {practice.name}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">{practice.duration}</span>
          </div>
          <p className={`text-sm ${completed ? "text-slate-400 dark:text-slate-500" : "text-slate-600 dark:text-slate-400"}`}>
            {practice.description}
          </p>
          {!completed && (
            <Link href={practice.href}>
              <span className="inline-block mt-2 text-sm text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 cursor-pointer" data-testid={`start-${practice.id}`}>
                Begin practice →
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickResetCard({ practice }) {
  return (
    <Link href={practice.href}>
      <div 
        className="p-4 rounded-xl bg-gradient-to-br from-sage-50 to-cream-50 dark:from-sage-900/40 dark:to-slate-800 border border-sage-100 dark:border-sage-800 hover:shadow-md transition-all cursor-pointer"
        data-testid={`quick-reset-${practice.id}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-slate-800 dark:text-slate-200">{practice.name}</h3>
          <span className="text-xs text-sage-600 dark:text-sage-400 bg-sage-100 dark:bg-sage-900/50 px-2 py-0.5 rounded-full">
            {practice.duration}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{practice.description}</p>
      </div>
    </Link>
  );
}

function PracticeSection({ title, icon: Icon, practices, completed, onToggle, timeOfDay }) {
  const completedCount = practices.filter(p => completed.includes(p.id)).length;
  const allCompleted = completedCount === practices.length;
  
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          allCompleted 
            ? "bg-sage-100 dark:bg-sage-900/50" 
            : timeOfDay === "morning" 
              ? "bg-amber-100 dark:bg-amber-900/30" 
              : timeOfDay === "evening" 
                ? "bg-indigo-100 dark:bg-indigo-900/30" 
                : "bg-sage-100 dark:bg-sage-900/30"
        }`}>
          <Icon className={`w-5 h-5 ${
            allCompleted 
              ? "text-sage-600 dark:text-sage-400" 
              : timeOfDay === "morning" 
                ? "text-amber-600 dark:text-amber-400" 
                : timeOfDay === "evening" 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-sage-600 dark:text-sage-400"
          }`} />
        </div>
        <div>
          <h2 className="font-playfair text-xl text-slate-800 dark:text-slate-200">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {completedCount} of {practices.length} completed
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {practices.map(practice => (
          <PracticeCard 
            key={practice.id}
            practice={practice}
            completed={completed.includes(practice.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}

export default function DailyPracticePage() {
  useSEO({
    title: "Daily Wellness Practice | The Genuine Love Project",
    description: "Build consistent wellness habits with morning, midday, and evening practices designed to support your emotional health throughout the day."
  });
  
  const [completedPractices, setCompletedPractices] = useState(() => {
    const saved = localStorage.getItem("dailyPractices");
    const data = saved ? JSON.parse(saved) : { date: null, completed: [] };
    const today = new Date().toDateString();
    return data.date === today ? data.completed : [];
  });
  
  const togglePractice = (id) => {
    setCompletedPractices(prev => {
      const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      try {
        localStorage.setItem("dailyPractices", JSON.stringify({
          date: new Date().toDateString(),
          completed: next
        }));
      } catch (err) { console.warn("[storage-safe-write]", err); }
      return next;
    });
  };
  
  const totalPractices = MORNING_PRACTICES.length + MIDDAY_PRACTICES.length + EVENING_PRACTICES.length;
  const completedCount = completedPractices.length;
  const progressPercent = Math.round((completedCount / totalPractices) * 100);

  return (
    <WellnessPageShell>
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/dashboard">
            <span className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 mb-6 cursor-pointer" data-testid="back-link">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </span>
          </Link>
          
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 text-sm font-medium tracking-wider uppercase mb-3">
              <Flame className="w-4 h-4" />
              Daily Practice
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl text-slate-800 dark:text-slate-100 mb-3">
              Your Wellness <span className="text-sage-600 dark:text-sage-400 italic">Rhythm</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Small, consistent practices create lasting change. Choose what feels right for you today.
            </p>
          </header>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Today's Progress</span>
              <span className="text-sm text-sage-600 dark:text-sage-400">{completedCount} / {totalPractices}</span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && (
              <p className="text-center text-sage-600 dark:text-sage-400 mt-3 text-sm">
                Wonderful! You've completed all practices for today.
              </p>
            )}
          </div>
          
          <PracticeSection 
            title="Morning Awakening" 
            icon={Sunrise}
            practices={MORNING_PRACTICES}
            completed={completedPractices}
            onToggle={togglePractice}
            timeOfDay="morning"
          />
          
          <PracticeSection 
            title="Midday Reset" 
            icon={Sun}
            practices={MIDDAY_PRACTICES}
            completed={completedPractices}
            onToggle={togglePractice}
            timeOfDay="midday"
          />
          
          <PracticeSection 
            title="Evening Wind Down" 
            icon={Moon}
            practices={EVENING_PRACTICES}
            completed={completedPractices}
            onToggle={togglePractice}
            timeOfDay="evening"
          />
          
          <section className="mt-12 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h2 className="font-playfair text-xl text-slate-800 dark:text-slate-200">Quick Resets</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Need a moment? Try these anytime.
                </p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {QUICK_RESETS.map(practice => (
                <QuickResetCard key={practice.id} practice={practice} />
              ))}
            </div>
          </section>
          
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm italic">
              "The journey of a thousand miles begins with a single breath."
            </p>
          </div>
          
          <SafetyFooter />
        </div>
      </div>
    </WellnessPageShell>
  );
}
