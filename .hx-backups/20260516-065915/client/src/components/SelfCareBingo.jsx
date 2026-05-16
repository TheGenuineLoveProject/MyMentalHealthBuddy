import { useState, useEffect } from "react";
import { Sparkles, RotateCcw, Trophy, Heart, Star, Check, Gift } from "lucide-react";

const BINGO_ACTIVITIES = [
  { id: 1, text: "Take 5 deep breaths", category: "mindfulness", points: 10 },
  { id: 2, text: "Drink 8 glasses of water", category: "physical", points: 15 },
  { id: 3, text: "Go for a 10-min walk", category: "physical", points: 20 },
  { id: 4, text: "Call/text a friend", category: "social", points: 15 },
  { id: 5, text: "Write 3 gratitudes", category: "emotional", points: 15 },
  { id: 6, text: "Stretch for 5 minutes", category: "physical", points: 10 },
  { id: 7, text: "Read for 15 minutes", category: "mental", points: 15 },
  { id: 8, text: "Eat a healthy meal", category: "physical", points: 15 },
  { id: 9, text: "Take a screen break", category: "mental", points: 10 },
  { id: 10, text: "Practice self-compassion", category: "emotional", points: 15 },
  { id: 11, text: "Tidy one space", category: "physical", points: 10 },
  { id: 12, text: "Say no to something", category: "emotional", points: 20 },
  { id: 13, text: "FREE SPACE", category: "free", points: 0 },
  { id: 14, text: "Listen to calming music", category: "mindfulness", points: 10 },
  { id: 15, text: "Get 7+ hours sleep", category: "physical", points: 25 },
  { id: 16, text: "Do something creative", category: "mental", points: 20 },
  { id: 17, text: "Give someone a compliment", category: "social", points: 10 },
  { id: 18, text: "Journal for 10 minutes", category: "emotional", points: 15 },
  { id: 19, text: "Take a relaxing bath/shower", category: "physical", points: 15 },
  { id: 20, text: "Meditate for 5 minutes", category: "mindfulness", points: 15 },
  { id: 21, text: "Learn something new", category: "mental", points: 20 },
  { id: 22, text: "Cook a homemade meal", category: "physical", points: 20 },
  { id: 23, text: "Spend time in nature", category: "mindfulness", points: 20 },
  { id: 24, text: "Do a random act of kindness", category: "social", points: 20 },
  { id: 25, text: "Celebrate a small win", category: "emotional", points: 15 },
];

const CATEGORY_COLORS = {
  mindfulness: "from-teal-400 to-cyan-500",
  physical: "from-emerald-400 to-green-500",
  social: "from-blue-400 to-indigo-500",
  emotional: "from-rose-400 to-pink-500",
  mental: "from-purple-400 to-violet-500",
  free: "from-amber-400 to-orange-500",
};

const WINNING_PATTERNS = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

const STORAGE_KEY = "self-care-bingo";

export default function SelfCareBingo() {
  const [completed, setCompleted] = useState(new Set([12]));
  const [totalPoints, setTotalPoints] = useState(0);
  const [bingos, setBingos] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setCompleted(new Set(data.completed || [12]));
      setTotalPoints(data.totalPoints || 0);
      setStreak(data.streak || 0);
      
      const today = new Date().toDateString();
      if (data.lastPlayed !== today && data.lastPlayed) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (data.lastPlayed !== yesterday.toDateString()) {
          setStreak(0);
        }
      }
    }
  }, []);

  useEffect(() => {
    const wonPatterns = WINNING_PATTERNS.filter((pattern) =>
      pattern.every((idx) => completed.has(idx))
    );
    setBingos(wonPatterns);
    
    if (wonPatterns.length > bingos.length && bingos.length > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [completed]);

  const saveProgress = (newCompleted, points) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completed: Array.from(newCompleted),
      totalPoints: points,
      streak,
      lastPlayed: new Date().toDateString(),
    }));
  };

  const toggleCell = (index) => {
    if (index === 12) return;
    
    const newCompleted = new Set(completed);
    const activity = BINGO_ACTIVITIES[index];
    let newPoints = totalPoints;
    
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
      newPoints -= activity.points;
    } else {
      newCompleted.add(index);
      newPoints += activity.points;
    }
    
    setCompleted(newCompleted);
    setTotalPoints(newPoints);
    saveProgress(newCompleted, newPoints);
  };

  const resetBoard = () => {
    const newCompleted = new Set([12]);
    setCompleted(newCompleted);
    setTotalPoints(0);
    setBingos([]);
    const newStreak = streak + 1;
    setStreak(newStreak);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completed: [12],
      totalPoints: 0,
      streak: newStreak,
      lastPlayed: new Date().toDateString(),
    }));
  };

  const isInWinningPattern = (index) => {
    return bingos.some((pattern) => pattern.includes(index));
  };

  return (
    <div 
      className="min-h-[500px] bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-pink-950/30 dark:via-rose-950/30 dark:to-orange-950/30 rounded-3xl p-6 relative overflow-hidden"
      data-testid="self-care-bingo"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-400/20 to-amber-500/20 rounded-full blur-3xl" />
      
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-2xl animate-bounce">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">BINGO!</h3>
            <p className="text-gray-600 dark:text-gray-400">You completed a line!</p>
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Self-Care Bingo</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete activities for wellness points</p>
            </div>
          </div>
          <button
            onClick={resetBoard}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-xl font-medium text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg transition-all"
            data-testid="button-new-card"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            New Card
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{totalPoints}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Points</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{bingos.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Bingos</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{streak}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {["M", "I", "N", "D", "S"].map((letter, idx) => (
            <div
              key={idx}
              className="h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md"
            >
              {letter}
            </div>
          ))}
          
          {BINGO_ACTIVITIES.map((activity, index) => {
            const isCompleted = completed.has(index);
            const isWinning = isInWinningPattern(index);
            const isFree = index === 12;
            
            return (
              <button
                key={activity.id}
                onClick={() => toggleCell(index)}
                disabled={isFree}
                className={`aspect-square rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all shadow-md relative overflow-hidden ${
                  isCompleted
                    ? isWinning
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg transform scale-105"
                      : `bg-gradient-to-br ${CATEGORY_COLORS[activity.category]} text-white shadow-lg`
                    : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
                } ${isFree ? "cursor-default" : "cursor-pointer hover:shadow-lg"}`}
                data-testid={`bingo-cell-${index}`}
                aria-label={`${activity.text}${isCompleted ? " - completed" : ""}`}
              >
                {isCompleted && !isFree && (
                  <div className="absolute top-1 right-1">
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </div>
                )}
                
                <span className="text-[10px] leading-tight font-medium">
                  {activity.text}
                </span>
                
                {!isFree && (
                  <span className={`text-[8px] mt-1 ${isCompleted ? "opacity-80" : "text-gray-500"}`}>
                    +{activity.points}pts
                  </span>
                )}
                
                {isFree && (
                  <Star className="w-5 h-5 text-amber-500 mt-1" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" aria-hidden="true" />
            Category Legend
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== "free").map(([category, color]) => (
              <div key={category} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${color}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
            How to Play
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Complete self-care activities throughout your day</li>
            <li>• Tap a cell to mark it complete and earn points</li>
            <li>• Complete 5 in a row (horizontal, vertical, or diagonal) for BINGO!</li>
            <li>• Start a new card each day to build your streak</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
