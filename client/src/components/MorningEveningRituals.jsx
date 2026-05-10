import { useState, useEffect } from "react";
import { Sun, Moon, CheckCircle, Flame, Heart, Star, Wind } from 'lucide-react';

const MORNING_RITUALS = [
  { id: "hydrate", icon: "💧", name: "Drink water", xp: 10, description: "Start with a glass of water to hydrate your body" },
  { id: "stretch", icon: "🧘", name: "Gentle stretch", xp: 15, description: "5 minutes of gentle stretching to wake your body" },
  { id: "breathe", icon: "🌬️", name: "Deep breaths", xp: 10, description: "Take 5 deep, intentional breaths" },
  { id: "gratitude", icon: "🙏", name: "Morning gratitude", xp: 15, description: "Name 3 things you're grateful for" },
  { id: "intention", icon: "🎯", name: "Set intention", xp: 15, description: "Set one positive intention for the day" },
  { id: "sunlight", icon: "☀️", name: "Get sunlight", xp: 10, description: "Spend a few minutes in natural light" },
  { id: "nourish", icon: "🍎", name: "Healthy breakfast", xp: 20, description: "Fuel your body with nutritious food" },
  { id: "mindful", icon: "🧠", name: "Mindful moment", xp: 15, description: "One minute of mindful awareness" },
];

const EVENING_RITUALS = [
  { id: "reflect", icon: "📝", name: "Daily reflection", xp: 15, description: "Reflect on 3 good things from today" },
  { id: "unplug", icon: "📵", name: "Digital sunset", xp: 15, description: "Put away devices 30 min before bed" },
  { id: "calm", icon: "🌿", name: "Calming activity", xp: 10, description: "Read, meditate, or gentle stretching" },
  { id: "prepare", icon: "👔", name: "Prepare tomorrow", xp: 10, description: "Set out clothes or prep for tomorrow" },
  { id: "release", icon: "💭", name: "Release worries", xp: 15, description: "Write down any lingering thoughts" },
  { id: "selfcare", icon: "🛁", name: "Self-care moment", xp: 15, description: "Skincare, tea, or calming routine" },
  { id: "appreciate", icon: "💜", name: "Self-appreciation", xp: 15, description: "Acknowledge one thing you did well" },
  { id: "wind", icon: "😴", name: "Wind down", xp: 10, description: "Dim lights and prepare for rest" },
];

export default function MorningEveningRituals({ onXpEarned }) {
  const [activeTab, setActiveTab] = useState(() => {
    const hour = new Date().getHours();
    return hour < 14 ? "morning" : "evening";
  });
  const [completedMorning, setCompletedMorning] = useState(() => {
    const saved = localStorage.getItem("morningRituals");
    const data = saved ? JSON.parse(saved) : { date: null, completed: [] };
    if (data.date !== new Date().toDateString()) {
      return [];
    }
    return data.completed;
  });
  const [completedEvening, setCompletedEvening] = useState(() => {
    const saved = localStorage.getItem("eveningRituals");
    const data = saved ? JSON.parse(saved) : { date: null, completed: [] };
    if (data.date !== new Date().toDateString()) {
      return [];
    }
    return data.completed;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("ritualStreak");
    return saved ? JSON.parse(saved) : { count: 0, lastDate: null };
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const rituals = activeTab === "morning" ? MORNING_RITUALS : EVENING_RITUALS;
  const completed = activeTab === "morning" ? completedMorning : completedEvening;
  const setCompleted = activeTab === "morning" ? setCompletedMorning : setCompletedEvening;

  const totalXp = rituals.reduce((sum, r) => completed.includes(r.id) ? sum + r.xp : sum, 0);
  const maxXp = rituals.reduce((sum, r) => sum + r.xp, 0);
  const progressPercent = (completed.length / rituals.length) * 100;

  useEffect(() => {
    const key = activeTab === "morning" ? "morningRituals" : "eveningRituals";
    localStorage.setItem(key, JSON.stringify({
      date: new Date().toDateString(),
      completed,
    }));
  }, [completed, activeTab]);

  useEffect(() => {
    const allMorningDone = completedMorning.length === MORNING_RITUALS.length;
    const allEveningDone = completedEvening.length === EVENING_RITUALS.length;
    
    if (allMorningDone && allEveningDone) {
      const today = new Date().toDateString();
      if (streak.lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = streak.lastDate === yesterday.toDateString();
        
        const newStreak = {
          count: isConsecutive ? streak.count + 1 : 1,
          lastDate: today,
        };
        setStreak(newStreak);
        localStorage.setItem("ritualStreak", JSON.stringify(newStreak));
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);
      }
    }
  }, [completedMorning, completedEvening, streak]);

  const toggleRitual = (id) => {
    const ritual = rituals.find(r => r.id === id);
    if (completed.includes(id)) {
      setCompleted(completed.filter((c) => c !== id));
    } else {
      setCompleted([...completed, id]);
      if (onXpEarned && ritual) {
        onXpEarned(`${activeTab === "morning" ? "Morning" : "Evening"} Ritual`, 30);
      }
    }
  };

  return (
    <div 
      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
      data-testid="morning-evening-rituals"
    >
      {showCelebration && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-3xl shadow-2xl text-center animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Perfect Day!</h2>
            <p className="text-amber-100">You completed all rituals</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-white">
              <Flame className="w-6 h-6" />
              <span className="text-xl font-bold">{streak.count} day streak!</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              activeTab === "morning" 
                ? "bg-gradient-to-br from-amber-400 to-orange-500" 
                : "bg-gradient-to-br from-indigo-500 to-purple-600"
            }`}>
              {activeTab === "morning" ? <Sun className="w-6 h-6 text-white" /> : <Moon className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {activeTab === "morning" ? "Morning Rituals" : "Evening Rituals"}
              </h2>
              <p className="text-slate-400 text-sm">Build healthy daily habits</p>
            </div>
          </div>
          
          {streak.count > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full border border-amber-500/30">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-semibold">{streak.count}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("morning")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "morning"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
            }`}
            data-testid="tab-morning"
          >
            <Sun className="w-4 h-4" />
            Morning
          </button>
          <button
            onClick={() => setActiveTab("evening")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "evening"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
            }`}
            data-testid="tab-evening"
          >
            <Moon className="w-4 h-4" />
            Evening
          </button>
        </div>

        <div className="bg-slate-800/50 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              activeTab === "morning"
                ? "bg-gradient-to-r from-amber-400 to-orange-500"
                : "bg-gradient-to-r from-indigo-400 to-purple-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-slate-400">{completed.length} of {rituals.length} complete</span>
          <span className="text-amber-400 font-medium">+{totalXp} XP earned</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-3">
          {rituals.map((ritual) => {
            const isCompleted = completed.includes(ritual.id);
            return (
              <button
                key={ritual.id}
                onClick={() => toggleRitual(ritual.id)}
                className={`w-full text-left p-4 rounded-xl transition-all transform hover:scale-[1.01] ${
                  isCompleted
                    ? "bg-emerald-900/30 border border-emerald-500/30"
                    : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                }`}
                data-testid={`ritual-${ritual.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    isCompleted ? "bg-emerald-600/30" : "bg-slate-700/50"
                  }`}>
                    {isCompleted ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : ritual.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${isCompleted ? "text-emerald-300" : "text-white"}`}>
                        {ritual.name}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isCompleted ? "bg-emerald-600/30 text-emerald-300" : "bg-amber-600/30 text-amber-300"
                      }`}>
                        +{ritual.xp} XP
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${isCompleted ? "text-emerald-400/70" : "text-slate-400"}`}>
                      {ritual.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Max {maxXp} XP daily</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Build lasting habits</span>
          </div>
        </div>
      </div>
    </div>
  );
}
