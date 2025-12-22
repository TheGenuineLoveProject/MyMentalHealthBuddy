import { useState, useEffect, useRef } from "react";
import { Activity, Play, Pause, SkipForward, RotateCcw, Check, Volume2 } from "lucide-react";

const MUSCLE_GROUPS = [
  { id: "hands", name: "Hands & Forearms", duration: 15, tenseDuration: 5, instruction: "Make tight fists with both hands. Squeeze hard for 5 seconds, then release completely.", visual: "✊" },
  { id: "biceps", name: "Upper Arms", duration: 15, tenseDuration: 5, instruction: "Bend your elbows and tense your biceps. Hold tightly, then let your arms go limp.", visual: "💪" },
  { id: "shoulders", name: "Shoulders", duration: 15, tenseDuration: 5, instruction: "Raise your shoulders up to your ears. Hold the tension, then drop them down.", visual: "🙆" },
  { id: "forehead", name: "Forehead", duration: 15, tenseDuration: 5, instruction: "Raise your eyebrows as high as you can. Feel the tension, then smooth it out.", visual: "😤" },
  { id: "eyes", name: "Eyes & Nose", duration: 15, tenseDuration: 5, instruction: "Squeeze your eyes shut and scrunch your nose. Then relax your entire face.", visual: "😣" },
  { id: "jaw", name: "Jaw & Mouth", duration: 15, tenseDuration: 5, instruction: "Clench your jaw and press your tongue to the roof of your mouth. Release and let your mouth hang open slightly.", visual: "😬" },
  { id: "neck", name: "Neck", duration: 15, tenseDuration: 5, instruction: "Gently press your head back against the headrest or wall. Then bring it forward naturally.", visual: "🧘" },
  { id: "chest", name: "Chest", duration: 15, tenseDuration: 5, instruction: "Take a deep breath and hold it, feeling your chest expand. Exhale slowly and completely.", visual: "🫁" },
  { id: "stomach", name: "Stomach", duration: 15, tenseDuration: 5, instruction: "Tighten your stomach muscles as if bracing for impact. Then release and breathe naturally.", visual: "💫" },
  { id: "back", name: "Back", duration: 15, tenseDuration: 5, instruction: "Arch your back slightly, pressing shoulder blades together. Then relax into your seat.", visual: "🔙" },
  { id: "glutes", name: "Glutes & Hips", duration: 15, tenseDuration: 5, instruction: "Squeeze your buttocks together tightly. Then let all the tension melt away.", visual: "🪑" },
  { id: "thighs", name: "Thighs", duration: 15, tenseDuration: 5, instruction: "Press your thighs together firmly. Feel the tension, then let them relax apart.", visual: "🦵" },
  { id: "calves", name: "Calves", duration: 15, tenseDuration: 5, instruction: "Point your toes down, tensing your calves. Then flex your feet and release.", visual: "🦶" },
  { id: "feet", name: "Feet & Toes", duration: 15, tenseDuration: 5, instruction: "Curl your toes tightly as if gripping the floor. Then spread them wide and relax.", visual: "👣" },
];

export default function ProgressiveMuscleRelaxation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [timer, setTimer] = useState(5);
  const [completed, setCompleted] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("pmr_sessions");
    if (saved) setSessionsCompleted(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (isPlaying && !completed) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (phase === "intro") {
              setPhase("tense");
              return 5;
            } else if (phase === "tense") {
              setPhase("release");
              return 10;
            } else if (phase === "release") {
              if (currentGroup < MUSCLE_GROUPS.length - 1) {
                setCurrentGroup((g) => g + 1);
                setPhase("tense");
                return 5;
              } else {
                setCompleted(true);
                setIsPlaying(false);
                const newCount = sessionsCompleted + 1;
                setSessionsCompleted(newCount);
                localStorage.setItem("pmr_sessions", newCount.toString());
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [isPlaying, phase, currentGroup, completed, sessionsCompleted]);

  const togglePlay = () => {
    if (completed) reset();
    setIsPlaying(!isPlaying);
  };

  const skipGroup = () => {
    if (currentGroup < MUSCLE_GROUPS.length - 1) {
      setCurrentGroup((g) => g + 1);
      setPhase("tense");
      setTimer(5);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentGroup(0);
    setPhase("intro");
    setTimer(5);
    setCompleted(false);
  };

  const group = MUSCLE_GROUPS[currentGroup];
  const progress = ((currentGroup + (phase === "release" ? 0.7 : phase === "tense" ? 0.3 : 0)) / MUSCLE_GROUPS.length) * 100;

  const getPhaseColor = () => {
    switch (phase) {
      case "tense": return "from-red-400 to-orange-500";
      case "release": return "from-green-400 to-emerald-500";
      default: return "from-blue-400 to-indigo-500";
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case "intro": return "Get Ready";
      case "tense": return "TENSE!";
      case "release": return "Release & Relax";
      default: return "";
    }
  };

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="progressive-muscle-relaxation">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-pmr-title">
                Progressive Muscle Relaxation
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Release tension systematically</p>
            </div>
          </div>
          <span className="text-xs text-[var(--text-muted)]">~4 min session</span>
        </div>

        {!completed ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-[var(--text-muted)] mb-2">
                <span>Progress: {currentGroup + 1}/{MUSCLE_GROUPS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${getPhaseColor()} transition-all duration-500`} style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className={`p-6 rounded-2xl bg-gradient-to-br ${getPhaseColor()} text-white mb-6 text-center transition-all duration-300`}>
              <div className="text-5xl mb-3" data-testid="text-visual">{group.visual}</div>
              <div className="text-sm text-white/80 mb-1">Focus on your</div>
              <div className="text-2xl font-display font-bold mb-2" data-testid="text-muscle-group">{group.name}</div>
              <div className={`text-lg font-bold mb-3 ${phase === "tense" ? "animate-pulse" : ""}`} data-testid="text-phase">
                {getPhaseText()}
              </div>
              <div className="text-6xl font-bold mb-4" data-testid="text-timer">{timer}s</div>
              <p className="text-white/90 text-sm" data-testid="text-instruction">{group.instruction}</p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePlay}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${getPhaseColor()} text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center`}
                data-testid="button-play-pause"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
              <button
                onClick={skipGroup}
                disabled={currentGroup >= MUSCLE_GROUPS.length - 1}
                className="p-3 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50"
                data-testid="button-skip"
                aria-label="Skip to next muscle group"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center gap-1 mt-6">
              {MUSCLE_GROUPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < currentGroup ? "bg-emerald-500" : i === currentGroup ? "bg-violet-500 scale-125" : "bg-[var(--surface)]"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-2xl font-display font-bold text-[var(--text)] mb-2" data-testid="text-complete">
              Deep Relaxation Achieved
            </h4>
            <p className="text-[var(--text-secondary)] mb-6">
              Your entire body is now relaxed. Enjoy this peaceful feeling.
            </p>
            <button onClick={reset} className="btn-gradient px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center gap-2 mx-auto" data-testid="button-restart">
              <RotateCcw className="w-5 h-5" />
              Start Again
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--text-muted)]">
            🧘 Sessions completed: <strong className="text-[var(--primary)]">{sessionsCompleted}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
