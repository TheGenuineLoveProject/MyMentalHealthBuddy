import { useState, useEffect } from "react";
import { Trophy, Star, Clock, CheckCircle2, Circle, Flame, Target, Calendar, ChevronRight, Sparkles, Heart } from "lucide-react";

const CHALLENGES = {
  daily: [
    { id: "d1", title: "Morning Intention", description: "Set a positive intention for your day within 30 minutes of waking", points: 10, duration: "5 min" },
    { id: "d2", title: "Mindful Eating", description: "Eat one meal without distractions, savoring each bite", points: 15, duration: "20 min" },
    { id: "d3", title: "Gratitude Pause", description: "Stop 3 times today to notice something you're grateful for", points: 10, duration: "3 min" },
    { id: "d4", title: "Tech-Free Hour", description: "Spend one hour completely unplugged from devices", points: 20, duration: "60 min" },
    { id: "d5", title: "Nature Connection", description: "Spend 10 minutes outdoors, noticing natural sounds and sights", points: 15, duration: "10 min" },
    { id: "d6", title: "Kindness Act", description: "Do something kind for someone without expecting anything in return", points: 15, duration: "10 min" },
    { id: "d7", title: "Body Awareness", description: "Do a 5-minute body scan, noticing sensations without judgment", points: 10, duration: "5 min" },
  ],
  weekly: [
    { id: "w1", title: "Meditation Streak", description: "Meditate for at least 5 minutes every day this week", points: 100, duration: "35 min/week" },
    { id: "w2", title: "Digital Sunset", description: "No screens after 9pm for 5 days this week", points: 80, duration: "5 days" },
    { id: "w3", title: "Gratitude Journal", description: "Write in your gratitude journal every day this week", points: 70, duration: "15 min/day" },
    { id: "w4", title: "Mindful Movement", description: "Practice yoga or stretching for 15 minutes, 4 times this week", points: 60, duration: "60 min/week" },
    { id: "w5", title: "Sleep Hygiene", description: "Go to bed and wake up at consistent times for 5 days", points: 75, duration: "5 days" },
  ],
  monthly: [
    { id: "m1", title: "Meditation Master", description: "Complete 20 meditation sessions this month", points: 300, duration: "20 sessions" },
    { id: "m2", title: "Wellness Warrior", description: "Complete at least one wellness activity every day", points: 500, duration: "30 days" },
    { id: "m3", title: "Journaling Journey", description: "Write at least 15 journal entries this month", points: 250, duration: "15 entries" },
    { id: "m4", title: "Social Connection", description: "Have meaningful conversations with 10 different people", points: 200, duration: "10 people" },
  ],
};

const STORAGE_KEY = "mindfulness-challenges";

export default function MindfulnessChallenges() {
  const [selectedType, setSelectedType] = useState("daily");
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedChallenges(data.completed || {});
      setTotalPoints(data.totalPoints || 0);
      setCurrentStreak(data.streak || 0);
      setLevel(Math.floor((data.totalPoints || 0) / 500) + 1);
    }
  }, []);

  const saveProgress = (completed, points, streak) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completed,
        totalPoints: points,
        streak,
        lastActive: new Date().toISOString(),
      }));
    } catch (err) { console.warn("[storage-safe-write]", err); }
  };

  const toggleChallenge = (challenge) => {
    const today = new Date().toDateString();
    const key = `${challenge.id}-${today}`;
    
    const newCompleted = { ...completedChallenges };
    let newPoints = totalPoints;
    
    if (newCompleted[key]) {
      delete newCompleted[key];
      newPoints -= challenge.points;
    } else {
      newCompleted[key] = { completedAt: new Date().toISOString(), points: challenge.points };
      newPoints += challenge.points;
    }
    
    setCompletedChallenges(newCompleted);
    setTotalPoints(newPoints);
    setLevel(Math.floor(newPoints / 500) + 1);
    saveProgress(newCompleted, newPoints, currentStreak);
  };

  const isCompletedToday = (challengeId) => {
    const today = new Date().toDateString();
    const key = `${challengeId}-${today}`;
    return !!completedChallenges[key];
  };

  const getTodayProgress = () => {
    const today = new Date().toDateString();
    const todayCompleted = Object.keys(completedChallenges).filter(k => k.includes(today)).length;
    const dailyTotal = CHALLENGES.daily.length;
    return { completed: todayCompleted, total: dailyTotal };
  };

  const getWeekProgress = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    let weeklyCompleted = 0;
    Object.keys(completedChallenges).forEach(key => {
      const challengeDate = new Date(completedChallenges[key].completedAt);
      if (challengeDate >= weekStart) weeklyCompleted++;
    });
    
    return weeklyCompleted;
  };

  const challenges = CHALLENGES[selectedType];
  const todayProgress = getTodayProgress();
  const pointsToNextLevel = (level * 500) - totalPoints;

  return (
    <div 
      className="min-h-[500px] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 rounded-3xl p-6 relative overflow-hidden"
      data-testid="mindfulness-challenges"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mindfulness Challenges</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Daily, weekly & monthly goals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Level</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{level}</div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                style={{ width: `${((totalPoints % 500) / 500) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">{pointsToNextLevel} pts to next level</p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-emerald-500" aria-hidden="true" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Points</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalPoints}</div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-orange-500" aria-hidden="true" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Streak</span>
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentStreak}</div>
            <p className="text-[10px] text-gray-500">days</p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-blue-500" aria-hidden="true" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Today</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {todayProgress.completed}/{todayProgress.total}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { key: "daily", label: "Daily", icon: Clock },
            { key: "weekly", label: "Weekly", icon: Calendar },
            { key: "monthly", label: "Monthly", icon: Trophy },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedType === key
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                  : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
              }`}
              data-testid={`button-type-${key}`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {challenges.map((challenge) => {
            const isCompleted = isCompletedToday(challenge.id);
            
            return (
              <button
                key={challenge.id}
                onClick={() => toggleChallenge(challenge)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  isCompleted
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                    : "bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white hover:shadow-md"
                }`}
                data-testid={`challenge-${challenge.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{challenge.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isCompleted ? "text-white/80" : "text-gray-500"}`}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {challenge.duration}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isCompleted 
                            ? "bg-white/20" 
                            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        }`}>
                          +{challenge.points}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm ${isCompleted ? "text-white/80" : "text-gray-600 dark:text-gray-400"}`}>
                      {challenge.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isCompleted ? "" : "text-gray-400"}`} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
            Tips for Success
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Start with daily challenges to build momentum</li>
            <li>• Set reminders to complete your challenges</li>
            <li>• Stack challenges with existing habits</li>
            <li>• Celebrate small wins along the way</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">This Week's Progress</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                You've completed {getWeekProgress()} challenges this week!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
