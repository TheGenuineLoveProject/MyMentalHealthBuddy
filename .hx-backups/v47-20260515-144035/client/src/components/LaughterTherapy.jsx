import { useState, useEffect, useCallback } from "react";
import { Smile, Play, Pause, RotateCcw, Timer, Sparkles, Heart } from 'lucide-react';

const LAUGHTER_EXERCISES = [
  {
    id: "lion",
    name: "Lion Laugh",
    icon: "🦁",
    duration: 30,
    color: "from-amber-500 to-orange-500",
    description: "Big roaring laughs like a lion",
    instructions: [
      "Open your mouth wide",
      "Stretch your arms like lion paws",
      "Let out a big 'HA HA HA!' roar",
      "Feel the power in your laugh",
      "Let your whole body shake with laughter",
    ],
  },
  {
    id: "gradient",
    name: "Gradient Laugh",
    icon: "📈",
    duration: 45,
    color: "from-blue-500 to-cyan-500",
    description: "Start soft, build to belly laughs",
    instructions: [
      "Start with a small chuckle: 'heh heh'",
      "Gradually increase: 'ha ha ha'",
      "Build to louder laughter",
      "Reach your biggest belly laugh",
      "Hold that joyful feeling",
    ],
  },
  {
    id: "milkshake",
    name: "Milkshake Laugh",
    icon: "🥤",
    duration: 30,
    color: "from-pink-500 to-rose-500",
    description: "Shake your body while laughing",
    instructions: [
      "Pretend you're holding two milkshakes",
      "Start shaking them up and down",
      "Add laughter: 'Ho ho ho!'",
      "Shake faster and laugh louder",
      "Feel the vibrations through your body",
    ],
  },
  {
    id: "aloha",
    name: "Aloha Laugh",
    icon: "🌺",
    duration: 30,
    color: "from-teal-500 to-emerald-500",
    description: "Spread your arms wide with joy",
    instructions: [
      "Spread your arms wide open",
      "Take a deep breath",
      "Laugh 'ALOHA HA HA HA!'",
      "Feel the openness in your chest",
      "Embrace the joyful energy",
    ],
  },
  {
    id: "silent",
    name: "Silent Laugh",
    icon: "🤐",
    duration: 30,
    color: "from-violet-500 to-purple-500",
    description: "Laugh without making sound",
    instructions: [
      "Keep your mouth open",
      "Laugh silently - just the motion",
      "Feel your belly and diaphragm move",
      "Let your shoulders shake",
      "Notice how it still feels good!",
    ],
  },
  {
    id: "cell",
    name: "Cell Phone Laugh",
    icon: "📱",
    duration: 30,
    color: "from-indigo-500 to-blue-500",
    description: "Pretend you heard the funniest joke",
    instructions: [
      "Hold your hand like a phone",
      "Pretend you just heard something hilarious",
      "Start laughing at the 'joke'",
      "Really get into it!",
      "Your body doesn't know it's pretend",
    ],
  },
];

const LAUGHTER_BENEFITS = [
  { icon: "😌", text: "Reduces stress hormones" },
  { icon: "💪", text: "Boosts immune system" },
  { icon: "🧠", text: "Releases endorphins" },
  { icon: "❤️", text: "Improves heart health" },
  { icon: "😊", text: "Elevates mood naturally" },
  { icon: "🔋", text: "Increases energy" },
];

export default function LaughterTherapy({ onComplete, onXpEarned }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [totalLaughMinutes, setTotalLaughMinutes] = useState(() => {
    const saved = localStorage.getItem("laughterMinutes");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [startTime, setStartTime] = useState(null);

  const exercise = selectedExercise ? LAUGHTER_EXERCISES.find(e => e.id === selectedExercise) : null;

  useEffect(() => {
    let interval;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((t) => {
          if (t <= 1) {
            handleExerciseComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (isActive && exercise) {
      const instructionDuration = exercise.duration / exercise.instructions.length;
      const elapsed = exercise.duration - timeRemaining;
      const newInstruction = Math.min(
        Math.floor(elapsed / instructionDuration),
        exercise.instructions.length - 1
      );
      setCurrentInstruction(newInstruction);
    }
  }, [timeRemaining, isActive, exercise]);

  const startExercise = (id) => {
    const ex = LAUGHTER_EXERCISES.find(e => e.id === id);
    setSelectedExercise(id);
    setTimeRemaining(ex.duration);
    setCurrentInstruction(0);
    setIsActive(true);
    setStartTime(Date.now());
  };

  const handleExerciseComplete = useCallback(() => {
    setIsActive(false);
    if (selectedExercise) {
      if (!completedExercises.includes(selectedExercise)) {
        setCompletedExercises((prev) => [...prev, selectedExercise]);
      }
      const ex = LAUGHTER_EXERCISES.find(e => e.id === selectedExercise);
      const newMinutes = totalLaughMinutes + Math.ceil(ex.duration / 60);
      setTotalLaughMinutes(newMinutes);
      localStorage.setItem("laughterMinutes", newMinutes.toString());
    }
    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 30;
    if (onXpEarned) onXpEarned("Laughter Therapy", duration);
    if (onComplete) onComplete();
  }, [selectedExercise, completedExercises, totalLaughMinutes, startTime, onXpEarned, onComplete]);

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const exitExercise = () => {
    setSelectedExercise(null);
    setIsActive(false);
    setTimeRemaining(0);
    setCurrentInstruction(0);
  };

  const progress = exercise ? ((exercise.duration - timeRemaining) / exercise.duration) * 100 : 0;

  if (selectedExercise && exercise) {
    return (
      <div 
        className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
        data-testid="laughter-exercise-active"
      >
        <div className={`bg-gradient-to-r ${exercise.color} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce">{exercise.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
                <p className="text-white/80 text-sm">{exercise.description}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-black/20 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-white/80 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div 
              className={`text-8xl mb-4 transition-transform duration-300 ${isActive ? "animate-pulse scale-110" : ""}`}
            >
              😂
            </div>
            <div className="text-4xl font-bold text-white mb-2" aria-live="polite">
              {timeRemaining}s
            </div>
            <p className="text-slate-400">Keep laughing!</p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
            <p className="text-lg text-white text-center font-medium" aria-live="polite">
              {exercise.instructions[currentInstruction]}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              {exercise.instructions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i <= currentInstruction ? "bg-white" : "bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={togglePause}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isActive 
                  ? "bg-amber-600/80 hover:bg-amber-600 text-white" 
                  : "bg-emerald-600/80 hover:bg-emerald-600 text-white"
              }`}
              data-testid="button-pause-play"
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isActive ? "Pause" : "Resume"}
            </button>
            <button
              onClick={exitExercise}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
              data-testid="button-exit"
            >
              <RotateCcw className="w-5 h-5" />
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
      data-testid="laughter-therapy"
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Laughter Therapy</h2>
              <p className="text-slate-400 text-sm">Laughter yoga for instant mood boost</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-400">{totalLaughMinutes}</div>
            <div className="text-xs text-slate-500">minutes laughed</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {LAUGHTER_BENEFITS.slice(0, 3).map((benefit, i) => (
            <span 
              key={i}
              className="flex items-center gap-1 px-3 py-1 bg-slate-800/50 rounded-full text-sm text-slate-300"
            >
              <span>{benefit.icon}</span>
              {benefit.text}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {LAUGHTER_EXERCISES.map((ex) => {
            const isCompleted = completedExercises.includes(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => startExercise(ex.id)}
                className={`text-left p-4 rounded-xl transition-all transform hover:scale-[1.02] ${
                  isCompleted 
                    ? "bg-emerald-900/30 border border-emerald-500/30" 
                    : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                }`}
                data-testid={`button-exercise-${ex.id}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{ex.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{ex.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Timer className="w-3 h-3" />
                      {ex.duration}s
                    </div>
                  </div>
                  {isCompleted ? (
                    <Heart className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${ex.color} flex items-center justify-center`}>
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </div>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{ex.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">
            <Sparkles className="w-4 h-4 inline mr-1 text-amber-400" />
            Did you know? Even fake laughter triggers real health benefits!
          </p>
          <p className="text-xs text-slate-500">
            Your body can't tell the difference between real and voluntary laughter
          </p>
        </div>
      </div>
    </div>
  );
}
