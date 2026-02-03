import { useState, useEffect } from "react";
import { Target, CheckCircle, Clock, Sparkles, Trophy, ChevronRight, Flame, Zap } from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";
import { useToast } from "@/hooks/use-toast";

export default function QuestPanel({ compact = false }) {
  const { quests, progress, refreshQuests, isLoading } = useGamification();
  const [expandedQuest, setExpandedQuest] = useState(null);
  const [savedInterest, setSavedInterest] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSavedInterest(localStorage.getItem('glp_quest_interest') === 'true');
    }
  }, []);

  const activeQuests = quests.filter(q => !q.isCompleted);
  const completedQuests = quests.filter(q => q.isCompleted);

  const getQuestIcon = (questType) => {
    switch (questType) {
      case "breathing": return "🌬️";
      case "meditation": return "🧘";
      case "journal": return "📝";
      case "mood": return "😊";
      case "any_tool": return "🛠️";
      case "streak": return "🔥";
      default: return "⭐";
    }
  };

  const getProgressColor = (current, target) => {
    const percent = (current / target) * 100;
    if (percent >= 100) return "bg-emerald-500";
    if (percent >= 50) return "bg-amber-500";
    return "bg-blue-500";
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50 animate-pulse motion-reduce:animate-none">
        <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-slate-700/50 rounded-xl"></div>
          <div className="h-16 bg-slate-700/50 rounded-xl"></div>
          <div className="h-16 bg-slate-700/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div 
        className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-4 border border-violet-500/20"
        data-testid="quest-panel-compact"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-400" />
            <h3 className="font-semibold text-white">Daily Quests</h3>
          </div>
          <span className="text-xs text-violet-300 bg-violet-600/30 px-2 py-1 rounded-full">
            {completedQuests.length}/{quests.length}
          </span>
        </div>
        
        <div className="space-y-2">
          {activeQuests.slice(0, 2).map((quest) => (
            <div 
              key={quest.id}
              className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg"
            >
              <span className="text-lg">{getQuestIcon(quest.questType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{quest.title}</p>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-full rounded-full ${getProgressColor(quest.currentCount, quest.targetCount)}`}
                    style={{ width: `${Math.min((quest.currentCount / quest.targetCount) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <span className="text-amber-400 text-xs font-medium">+{quest.xpReward}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
      data-testid="quest-panel"
    >
      <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-violet-900/30 to-purple-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Daily Quests</h2>
              <p className="text-violet-300 text-sm">Complete quests to earn bonus XP</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-xl font-bold text-white">{completedQuests.length}/{quests.length}</span>
            </div>
            <p className="text-xs text-slate-400">completed today</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-white">{progress.currentStreak} day streak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white">Level {progress.level}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Educational-only: Empty state with calm explanation */}
        {quests.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Your Quests Are Loading</h3>
            <p className="text-slate-400 text-sm mb-4">
              Daily quests help you build gentle wellness habits at your own pace. 
              Use any wellness tool to start earning quest progress.
            </p>
            {savedInterest ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                <CheckCircle className="w-4 h-4" />
                Interest saved
              </div>
            ) : (
              <button
                onClick={() => {
                  localStorage.setItem('glp_quest_interest', 'true');
                  setSavedInterest(true);
                  toast({
                    title: "Interest Saved",
                    description: "We'll let you know when personalized quests are ready for you."
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                data-testid="btn-save-quest-interest"
              >
                Notify me when ready
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {quests.map((quest) => {
              const isCompleted = quest.isCompleted;
              const progressPercent = Math.min((quest.currentCount / quest.targetCount) * 100, 100);
              
              return (
                <div
                  key={quest.id}
                  className={`p-4 rounded-xl transition-all ${
                    isCompleted 
                      ? "bg-emerald-900/20 border border-emerald-500/30" 
                      : "bg-slate-800/30 border border-slate-700/50 hover:border-violet-500/30"
                  }`}
                  data-testid={`quest-${quest.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isCompleted ? "bg-emerald-600/30" : "bg-violet-600/30"
                    }`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : getQuestIcon(quest.questType)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${isCompleted ? "text-emerald-300" : "text-white"}`}>
                          {quest.title}
                        </h3>
                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                          isCompleted 
                            ? "bg-emerald-600/30 text-emerald-300" 
                            : "bg-amber-600/30 text-amber-300"
                        }`}>
                          +{quest.xpReward} XP
                        </span>
                      </div>
                      <p className={`text-sm ${isCompleted ? "text-emerald-400/70" : "text-slate-400"}`}>
                        {quest.description}
                      </p>
                      
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={isCompleted ? "text-emerald-400" : "text-slate-500"}>
                            {quest.currentCount}/{quest.targetCount}
                          </span>
                          <span className={isCompleted ? "text-emerald-400" : "text-slate-500"}>
                            {progressPercent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              isCompleted ? "bg-emerald-500" : getProgressColor(quest.currentCount, quest.targetCount)
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <p className="text-center text-sm text-slate-500">
          <Sparkles className="w-4 h-4 inline mr-1 text-violet-400" />
          Quests reset daily at midnight
        </p>
      </div>
    </div>
  );
}
