import { useState, useEffect, useCallback } from "react";
import { Activity, Sparkles, Heart, Timer, Play, Pause, RotateCcw, CheckCircle, Volume2, VolumeX } from 'lucide-react';

const SOMATIC_EXERCISES = [
  {
    id: "shake",
    name: "Shake It Out",
    icon: "🌊",
    duration: 60,
    color: "from-blue-500 to-cyan-500",
    description: "Release tension through gentle shaking movements",
    instructions: [
      "Stand with feet hip-width apart",
      "Start shaking your hands gently",
      "Let the shake travel up your arms",
      "Allow your whole body to shake loosely",
      "Breathe naturally as you shake",
      "Gradually slow down and become still",
    ],
    benefits: ["Releases stored tension", "Activates relaxation response", "Grounds you in your body"],
  },
  {
    id: "butterfly",
    name: "Butterfly Hug",
    icon: "🦋",
    duration: 90,
    color: "from-purple-500 to-pink-500",
    description: "Self-soothing bilateral stimulation for calm",
    instructions: [
      "Cross your arms over your chest",
      "Place hands on upper arms (butterfly position)",
      "Alternate tapping left and right",
      "Tap slowly, about 1 tap per second",
      "Focus on the sensation of your hands",
      "Breathe deeply and notice any calming",
    ],
    benefits: ["Reduces anxiety quickly", "Activates both brain hemispheres", "Self-soothing touch"],
  },
  {
    id: "lion",
    name: "Lion's Breath",
    icon: "🦁",
    duration: 45,
    color: "from-amber-500 to-orange-500",
    description: "Release jaw tension and emotional buildup",
    instructions: [
      "Inhale deeply through your nose",
      "Open your mouth wide, stick out tongue",
      "Exhale forcefully with a 'HA!' sound",
      "Let go of any held tension",
      "Repeat 3-5 times",
      "Notice the release in your face and jaw",
    ],
    benefits: ["Releases held emotions", "Reduces jaw tension", "Energizing and freeing"],
  },
  {
    id: "grounding",
    name: "Body Grounding",
    icon: "🌱",
    duration: 120,
    color: "from-emerald-500 to-teal-500",
    description: "Connect deeply with your body and the earth",
    instructions: [
      "Sit or stand with feet flat on floor",
      "Press your feet firmly into the ground",
      "Notice the sensation of support",
      "Scan up through your body slowly",
      "Feel where your body contacts surfaces",
      "Breathe and feel held by the earth",
    ],
    benefits: ["Reduces dissociation", "Increases body awareness", "Creates safety"],
  },
  {
    id: "tension",
    name: "Tension Release",
    icon: "💪",
    duration: 90,
    color: "from-rose-500 to-red-500",
    description: "Progressive tension and release for deep relaxation",
    instructions: [
      "Squeeze your fists tight for 5 seconds",
      "Release and notice the difference",
      "Tense your arms, hold, then release",
      "Continue with shoulders, face, legs",
      "End with whole body tension then release",
      "Feel the wave of relaxation",
    ],
    benefits: ["Deep muscle relaxation", "Increases body awareness", "Releases chronic tension"],
  },
  {
    id: "sigh",
    name: "Physiological Sigh",
    icon: "😮‍💨",
    duration: 60,
    color: "from-indigo-500 to-violet-500",
    description: "The fastest way to calm your nervous system",
    instructions: [
      "Inhale through nose (first breath)",
      "Take second small inhale to fully expand lungs",
      "Exhale slowly through mouth (long sigh)",
      "The double inhale is key",
      "Repeat 3-5 times",
      "Notice calm spreading through you",
    ],
    benefits: ["Fastest calming technique", "Resets nervous system", "Can be done anywhere"],
  },
];

export default function SomaticRelease({ onComplete, onXpEarned }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startTime, setStartTime] = useState(null);

  const exercise = selectedExercise ? SOMATIC_EXERCISES.find(e => e.id === selectedExercise) : null;

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
    const ex = SOMATIC_EXERCISES.find(e => e.id === id);
    setSelectedExercise(id);
    setTimeRemaining(ex.duration);
    setCurrentInstruction(0);
    setIsActive(true);
    setStartTime(Date.now());
  };

  const handleExerciseComplete = useCallback(() => {
    setIsActive(false);
    if (selectedExercise && !completedExercises.includes(selectedExercise)) {
      setCompletedExercises((prev) => [...prev, selectedExercise]);
    }
    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 60;
    if (onXpEarned) onXpEarned("Somatic Release", duration);
    if (onComplete) onComplete();
  }, [selectedExercise, completedExercises, startTime, onXpEarned, onComplete]);

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setSelectedExercise(null);
    setIsActive(false);
    setTimeRemaining(0);
    setCurrentInstruction(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = exercise ? ((exercise.duration - timeRemaining) / exercise.duration) * 100 : 0;

  if (selectedExercise && exercise) {
    return (
      <div 
        className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
        data-testid="somatic-release-active"
      >
        <div className={`bg-gradient-to-r ${exercise.color} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{exercise.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
                <p className="text-white/80 text-sm">{exercise.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              aria-label={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
            </button>
          </div>
          
          <div className="mt-4 bg-black/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-white/80 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white mb-2" aria-live="polite">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-slate-400">remaining</p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${exercise.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {currentInstruction + 1}
              </div>
              <div>
                <p className="text-lg text-white font-medium" aria-live="polite">
                  {exercise.instructions[currentInstruction]}
                </p>
                <div className="flex gap-2 mt-3">
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
              onClick={resetExercise}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
              data-testid="button-exit-exercise"
            >
              <RotateCcw className="w-5 h-5" />
              Exit
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700/50 bg-slate-900/30">
          <h4 className="text-sm font-semibold text-slate-400 mb-3">Benefits</h4>
          <div className="flex flex-wrap gap-2">
            {exercise.benefits.map((benefit, i) => (
              <span 
                key={i}
                className="px-3 py-1 bg-slate-800/50 rounded-full text-sm text-slate-300"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
      data-testid="somatic-release"
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Somatic Release</h2>
            <p className="text-slate-400 text-sm">Body-based exercises for emotional healing</p>
          </div>
        </div>
        
        {completedExercises.length > 0 && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{completedExercises.length} exercise{completedExercises.length !== 1 ? "s" : ""} completed today</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid gap-4">
          {SOMATIC_EXERCISES.map((ex) => {
            const isCompleted = completedExercises.includes(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => startExercise(ex.id)}
                className={`w-full text-left p-4 rounded-xl transition-all transform hover:scale-[1.02] ${
                  isCompleted 
                    ? "bg-emerald-900/30 border border-emerald-500/30" 
                    : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                }`}
                data-testid={`button-exercise-${ex.id}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{ex.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{ex.name}</h3>
                      {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{ex.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {Math.floor(ex.duration / 60)}:{(ex.duration % 60).toString().padStart(2, "0")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        +{Math.floor(ex.duration / 3)} XP
                      </span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${ex.color} flex items-center justify-center`}>
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <p className="text-center text-sm text-slate-500">
          <Heart className="w-4 h-4 inline mr-1" />
          Somatic exercises help release emotions stored in the body
        </p>
      </div>
    </div>
  );
}
