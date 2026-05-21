import { useState, useEffect, useRef, useContext } from "react";
import { Footprints, Play, Pause, CheckCircle, Clock, MapPin, Heart, Wind, Eye, Ear, Sparkles, RotateCcw } from "lucide-react";
import GamificationContext from "../context/GamificationContext.jsx";

const WALKING_MEDITATIONS = [
  {
    id: "grounding",
    name: "Grounding Walk",
    duration: 10,
    description: "Connect with the earth beneath your feet",
    icon: "🌍",
    color: "from-emerald-500 to-teal-500",
    steps: [
      { time: 0, instruction: "Begin walking at a natural pace. Feel your feet touching the ground.", focus: "feet" },
      { time: 60, instruction: "Notice the sensation of your weight shifting from one foot to the other.", focus: "movement" },
      { time: 120, instruction: "Feel the texture of the ground beneath you - is it soft, hard, uneven?", focus: "ground" },
      { time: 180, instruction: "With each step, imagine roots growing from your feet into the earth.", focus: "visualization" },
      { time: 300, instruction: "Walk as if kissing the earth with your feet - gently and mindfully.", focus: "intention" },
      { time: 420, instruction: "Notice how connected you feel to the ground supporting you.", focus: "connection" },
      { time: 540, instruction: "Slowly bring awareness back to your surroundings as you complete the walk.", focus: "completion" },
    ],
  },
  {
    id: "sensory",
    name: "Sensory Awareness Walk",
    duration: 15,
    description: "Engage all five senses mindfully",
    icon: "👁️",
    color: "from-violet-500 to-purple-500",
    steps: [
      { time: 0, instruction: "Begin walking and bring attention to what you can SEE around you.", focus: "sight" },
      { time: 120, instruction: "Notice colors, shapes, light and shadow. Really observe your environment.", focus: "sight" },
      { time: 240, instruction: "Now shift to what you can HEAR - near sounds and distant sounds.", focus: "hearing" },
      { time: 360, instruction: "Feel the air on your skin. Notice temperature, breeze, humidity.", focus: "touch" },
      { time: 480, instruction: "Breathe deeply. What can you SMELL? Fresh air, flowers, earth?", focus: "smell" },
      { time: 600, instruction: "If eating/drinking, notice the TASTE. Otherwise, notice your mouth.", focus: "taste" },
      { time: 720, instruction: "Try to hold awareness of all senses simultaneously as you walk.", focus: "integration" },
      { time: 840, instruction: "Complete your walk with gratitude for your senses.", focus: "gratitude" },
    ],
  },
  {
    id: "breathing",
    name: "Breath-Synchronized Walk",
    duration: 10,
    description: "Coordinate breathing with steps",
    icon: "🌬️",
    color: "from-cyan-500 to-blue-500",
    steps: [
      { time: 0, instruction: "Begin walking slowly. Notice your natural breathing rhythm.", focus: "breath" },
      { time: 60, instruction: "Start counting steps with your inhale - try 3-4 steps per inhale.", focus: "inhale" },
      { time: 150, instruction: "Now count steps with your exhale - try 4-5 steps per exhale.", focus: "exhale" },
      { time: 240, instruction: "Find a rhythm that feels comfortable - 4 steps inhale, 4 steps exhale.", focus: "rhythm" },
      { time: 360, instruction: "With each exhale, release any tension you're carrying.", focus: "release" },
      { time: 480, instruction: "Feel your body becoming lighter with each synchronized step.", focus: "lightness" },
      { time: 540, instruction: "Conclude by taking 3 deep breaths while standing still.", focus: "completion" },
    ],
  },
  {
    id: "gratitude",
    name: "Gratitude Walk",
    duration: 12,
    description: "Walk with appreciation and joy",
    icon: "🙏",
    color: "from-rose-500 to-pink-500",
    steps: [
      { time: 0, instruction: "Begin walking and smile gently. Set an intention of gratitude.", focus: "intention" },
      { time: 90, instruction: "Think of one thing in nature you're grateful for right now.", focus: "nature" },
      { time: 180, instruction: "Think of one person you're grateful to have in your life.", focus: "people" },
      { time: 300, instruction: "Think of one ability your body has that you appreciate.", focus: "body" },
      { time: 420, instruction: "Think of one experience today that brought you joy.", focus: "experience" },
      { time: 540, instruction: "Think of one challenge that helped you grow.", focus: "growth" },
      { time: 660, instruction: "Finish by being grateful for this moment of mindful walking.", focus: "presence" },
    ],
  },
];

export default function MindfulWalking() {
  const gamification = useContext(GamificationContext);
  const recordSession = gamification?.recordSession || (() => {});
  const [selectedMeditation, setSelectedMeditation] = useState(WALKING_MEDITATIONS[0]);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("mindful_walking_sessions");
    if (saved) {
      setTotalSessions(parseInt(saved) || 0);
    }
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          
          const nextStep = selectedMeditation.steps.findIndex(
            (step, index) => index > currentStepIndex && step.time <= newTime
          );
          if (nextStep > currentStepIndex) {
            setCurrentStepIndex(nextStep);
          }
          
          if (newTime >= selectedMeditation.duration * 60) {
            handleComplete();
            return selectedMeditation.duration * 60;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, selectedMeditation, currentStepIndex]);

  const handleComplete = async () => {
    setIsActive(false);
    setIsComplete(true);
    
    const newTotal = totalSessions + 1;
    setTotalSessions(newTotal);
    try { localStorage.setItem("mindful_walking_sessions", newTotal.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }

    await recordSession("mindful_walking", elapsedTime, {
      meditation: selectedMeditation.name,
      totalSessions: newTotal,
    });
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setIsComplete(false);
    setElapsedTime(0);
    setCurrentStepIndex(0);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsComplete(false);
    setElapsedTime(0);
    setCurrentStepIndex(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = (elapsedTime / (selectedMeditation.duration * 60)) * 100;
  const currentStep = selectedMeditation.steps[currentStepIndex];

  const getFocusIcon = (focus) => {
    switch (focus) {
      case "sight": return <Eye className="w-5 h-5" />;
      case "hearing": return <Ear className="w-5 h-5" />;
      case "breath": case "inhale": case "exhale": return <Wind className="w-5 h-5" />;
      case "feet": case "movement": case "ground": return <Footprints className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6" data-testid="mindful-walking">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full mb-4">
          <Footprints className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-300 font-medium">Mindful Walking</span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)]">Walking Meditation</h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Turn your walk into a moving meditation
        </p>
      </div>

      {!isActive && !isComplete && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {WALKING_MEDITATIONS.map((meditation) => (
            <button
              key={meditation.id}
              onClick={() => setSelectedMeditation(meditation)}
              className={`p-4 rounded-xl transition-all text-left ${
                selectedMeditation.id === meditation.id
                  ? `bg-gradient-to-br ${meditation.color} text-white shadow-lg`
                  : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)]"
              }`}
              data-testid={`button-meditation-${meditation.id}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{meditation.icon}</span>
                <span className="font-semibold">{meditation.name}</span>
              </div>
              <p className={`text-sm ${
                selectedMeditation.id === meditation.id ? "text-white/80" : "text-[var(--text-secondary)]"
              }`}>
                {meditation.duration} min - {meditation.description}
              </p>
            </button>
          ))}
        </div>
      )}

      <div className={`bg-gradient-to-br ${selectedMeditation.color.replace("from-", "from-").replace("to-", "to-")}/20 rounded-2xl p-6 border border-opacity-20`}>
        {isComplete ? (
          <div className="text-center py-8 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Walk Complete!</h3>
            <p className="text-slate-300 mb-6">
              You completed a {selectedMeditation.duration}-minute {selectedMeditation.name.toLowerCase()}
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{formatTime(elapsedTime)}</div>
                <div className="text-xs text-slate-400">Duration</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <Footprints className="w-6 h-6 text-violet-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{totalSessions}</div>
                <div className="text-xs text-slate-400">Total Walks</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">+45</div>
                <div className="text-xs text-slate-400">XP Earned</div>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              data-testid="button-walk-again"
            >
              Walk Again
            </button>
          </div>
        ) : isActive ? (
          <div className="animate-fade-in-up">
            <div className="text-center mb-6">
              <span className="text-4xl mb-4 block">{selectedMeditation.icon}</span>
              <h3 className="text-xl font-semibold text-white">{selectedMeditation.name}</h3>
              <p className="text-sm text-slate-300 mt-1">Step {currentStepIndex + 1} of {selectedMeditation.steps.length}</p>
            </div>

            <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden mb-6">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${selectedMeditation.color} rounded-full transition-all duration-1000`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
              <span data-testid="text-elapsed-time">{formatTime(elapsedTime)}</span>
              <span>{formatTime(selectedMeditation.duration * 60)}</span>
            </div>

            <div className={`bg-gradient-to-r ${selectedMeditation.color} rounded-xl p-6 mb-6`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {getFocusIcon(currentStep.focus)}
                </div>
                <div className="text-xs text-white/70 uppercase tracking-wider">
                  Focus: {currentStep.focus}
                </div>
              </div>
              <p className="text-lg text-white leading-relaxed" data-testid="text-current-instruction">
                {currentStep.instruction}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePause}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                  isPaused
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                    : "bg-gradient-to-br from-amber-500 to-orange-500"
                }`}
                data-testid="button-pause"
                aria-label={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play className="w-8 h-8 ml-1" /> : <Pause className="w-8 h-8" />}
              </button>
              <button
                onClick={handleReset}
                className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-600/50 transition-all"
                data-testid="button-stop"
                aria-label="Stop"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {isPaused && (
              <p className="text-center text-amber-300 mt-4 animate-pulse">
                Walk paused - press play to continue
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className={`w-24 h-24 bg-gradient-to-br ${selectedMeditation.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <span className="text-5xl">{selectedMeditation.icon}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{selectedMeditation.name}</h3>
            <p className="text-slate-300 mb-6">{selectedMeditation.description}</p>
            
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Preparation Tips
              </h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2" />
                  Choose a quiet, safe path - indoors or outdoors
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2" />
                  Walk slowly enough to notice sensations
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2" />
                  Keep your gaze soft, looking ahead
                </li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              className={`px-8 py-4 bg-gradient-to-r ${selectedMeditation.color} text-white rounded-xl font-medium text-lg hover:shadow-lg transition-all flex items-center gap-2 mx-auto`}
              data-testid="button-start-walk"
            >
              <Play className="w-6 h-6" />
              Begin {selectedMeditation.duration}-Minute Walk
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <Footprints className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-[var(--text)]" data-testid="text-total-sessions">
            {totalSessions}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Walking Sessions</div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-[var(--text)]">
            +{totalSessions * 45}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Total XP</div>
        </div>
      </div>
    </div>
  );
}
