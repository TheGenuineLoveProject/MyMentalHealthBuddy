import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Clock, Target, Sparkles, Heart, Brain, Moon, Sun, Repeat, CheckCircle2, Plus, Flame, Leaf, Shield, Star } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { useSEO } from "../hooks/useSEO";
import SafetyFooter from "../components/ui/SafetyFooter";

const ROUTINE_TEMPLATES = [
  {
    id: "morning-calm",
    name: "Morning Calm",
    duration: "15 min",
    icon: Sun,
    description: "Start your day with peaceful intention",
    steps: [
      { name: "Gentle stretching", duration: "3 min", href: "/grounding" },
      { name: "Gratitude journaling", duration: "5 min", href: "/journal" },
      { name: "Breathing exercise", duration: "5 min", href: "/breathing" },
      { name: "Set daily intention", duration: "2 min", href: "/journal" }
    ],
    benefits: ["Reduced morning anxiety", "Improved focus", "Positive mindset"]
  },
  {
    id: "stress-relief",
    name: "Stress Relief Reset",
    duration: "10 min",
    icon: Shield,
    description: "When life feels overwhelming",
    steps: [
      { name: "5-4-3-2-1 grounding", duration: "2 min", href: "/grounding" },
      { name: "Box breathing", duration: "4 min", href: "/breathing" },
      { name: "Self-compassion pause", duration: "2 min", href: "/self-care" },
      { name: "Gentle body scan", duration: "2 min", href: "/meditation" }
    ],
    benefits: ["Nervous system regulation", "Mental clarity", "Emotional balance"]
  },
  {
    id: "evening-wind",
    name: "Evening Wind Down",
    duration: "20 min",
    icon: Moon,
    description: "Prepare your mind and body for rest",
    steps: [
      { name: "Daily reflection", duration: "5 min", href: "/journal" },
      { name: "Tension release", duration: "5 min", href: "/grounding" },
      { name: "4-7-8 breathing", duration: "5 min", href: "/breathing" },
      { name: "Gratitude close", duration: "5 min", href: "/journal" }
    ],
    benefits: ["Better sleep quality", "Processing the day", "Peaceful transition"]
  },
  {
    id: "self-love",
    name: "Self-Love Ritual",
    duration: "15 min",
    icon: Heart,
    description: "Nurture your relationship with yourself",
    steps: [
      { name: "Mirror affirmations", duration: "3 min", href: "/affirmations" },
      { name: "Self-appreciation list", duration: "5 min", href: "/journal" },
      { name: "Heart-centered breathing", duration: "4 min", href: "/breathing" },
      { name: "Loving-kindness meditation", duration: "3 min", href: "/meditation" }
    ],
    benefits: ["Improved self-esteem", "Self-compassion", "Inner peace"]
  },
  {
    id: "focus-boost",
    name: "Focus & Clarity",
    duration: "12 min",
    icon: Brain,
    description: "Sharpen your mind and attention",
    steps: [
      { name: "Energizing breath", duration: "3 min", href: "/breathing" },
      { name: "Intention setting", duration: "3 min", href: "/journal" },
      { name: "Mindfulness anchor", duration: "4 min", href: "/meditation" },
      { name: "Priority clarity", duration: "2 min", href: "/journal" }
    ],
    benefits: ["Enhanced concentration", "Mental sharpness", "Productive mindset"]
  },
  {
    id: "anxiety-ease",
    name: "Anxiety Ease",
    duration: "10 min",
    icon: Leaf,
    description: "Gentle practices for anxious moments",
    steps: [
      { name: "Grounding exercise", duration: "3 min", href: "/grounding" },
      { name: "Extended exhale breath", duration: "4 min", href: "/breathing" },
      { name: "Worry release writing", duration: "3 min", href: "/journal" }
    ],
    benefits: ["Calmed nervous system", "Reduced worry", "Present moment focus"]
  }
];

const HABIT_CATEGORIES = [
  { id: "mind", name: "Mind", icon: Brain, color: "indigo" },
  { id: "body", name: "Body", icon: Leaf, color: "green" },
  { id: "heart", name: "Heart", icon: Heart, color: "rose" },
  { id: "spirit", name: "Spirit", icon: Sparkles, color: "amber" }
];

function RoutineCard({ routine, onStart }) {
  const Icon = routine.icon;
  
  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all"
      data-testid={`routine-card-${routine.id}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-100 to-sage-50 dark:from-sage-900/50 dark:to-slate-800 flex items-center justify-center">
          <Icon className="w-6 h-6 text-sage-600 dark:text-sage-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-playfair text-lg text-slate-800 dark:text-slate-200">{routine.name}</h3>
            <span className="text-xs text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-900/30 px-2 py-1 rounded-full">
              {routine.duration}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{routine.description}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {routine.steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm">
            <span className="w-5 h-5 rounded-full bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400 flex items-center justify-center text-xs font-medium">
              {idx + 1}
            </span>
            <span className="flex-1 text-slate-600 dark:text-slate-400">{step.name}</span>
            <span className="text-slate-400 dark:text-slate-500 text-xs">{step.duration}</span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {routine.benefits.map((benefit, idx) => (
          <span key={idx} className="text-xs text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-900/30 px-2 py-1 rounded-full">
            {benefit}
          </span>
        ))}
      </div>
      
      <Link href={routine.steps[0].href}>
        <button 
          className="w-full py-3 bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-xl font-medium transition-all"
          data-testid={`start-routine-${routine.id}`}
        >
          Begin Routine
        </button>
      </Link>
    </div>
  );
}

function HabitTracker() {
  const [selectedCategory, setSelectedCategory] = useState("mind");
  
  const categoryHabits = {
    mind: ["Journaling", "Meditation", "Learning", "Gratitude"],
    body: ["Movement", "Hydration", "Sleep", "Breathing"],
    heart: ["Connection", "Kindness", "Self-care", "Expression"],
    spirit: ["Reflection", "Presence", "Purpose", "Wonder"]
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
      <h3 className="font-playfair text-xl text-slate-800 dark:text-slate-200 mb-4">Habit Building</h3>
      
      <div className="flex gap-2 mb-6">
        {HABIT_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300"
                  : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"
              }`}
              data-testid={`habit-category-${cat.id}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{cat.name}</span>
            </button>
          );
        })}
      </div>
      
      <div className="space-y-3">
        {categoryHabits[selectedCategory].map((habit, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <button 
              className="w-6 h-6 rounded-full border-2 border-sage-300 dark:border-sage-600 hover:border-sage-500 transition-colors"
              data-testid={`habit-check-${habit.toLowerCase()}`}
            />
            <span className="flex-1 text-slate-700 dark:text-slate-300">{habit}</span>
            <Flame className="w-4 h-4 text-slate-300 dark:text-slate-600" />
          </div>
        ))}
      </div>
      
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4 italic">
        Track your progress by marking habits complete each day
      </p>
    </div>
  );
}

export default function RoutinesPage() {
  useSEO({
    title: "Wellness Routines & Habits | The Genuine Love Project",
    description: "Build lasting wellness habits with guided routines for morning calm, stress relief, evening wind down, self-love, and more."
  });
  
  return (
    <WellnessPageShell>
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/dashboard">
            <span className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 mb-6 cursor-pointer" data-testid="back-link">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </span>
          </Link>
          
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 text-sm font-medium tracking-wider uppercase mb-3">
              <Repeat className="w-4 h-4" />
              Routines & Habits
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl text-slate-800 dark:text-slate-100 mb-3">
              Build Your Wellness <span className="text-sage-600 dark:text-sage-400 italic">Foundation</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Small, consistent actions add up over time. Choose routines that resonate with your current needs.
            </p>
          </header>
          
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2">
              <h2 className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-4">Guided Routines</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {ROUTINE_TEMPLATES.map(routine => (
                  <RoutineCard key={routine.id} routine={routine} />
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <h2 className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-4">Daily Habits</h2>
              <HabitTracker />
              
              <div className="mt-6 bg-gradient-to-br from-sage-50 to-cream-50 dark:from-sage-900/30 dark:to-slate-800 rounded-2xl p-6 border border-sage-100 dark:border-sage-800">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-amber-500" />
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Habit Stacking Tip</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Attach new habits to existing ones. "After I pour my morning coffee, I will take 3 deep breaths."
                </p>
              </div>
            </div>
          </div>
          
          <SafetyFooter />
        </div>
      </div>
    </WellnessPageShell>
  );
}
