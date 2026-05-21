import { useState, useEffect, useRef } from "react";
import { Heart, Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX, Check } from "lucide-react";

const BODY_PARTS = [
  { id: "feet", name: "Feet & Toes", duration: 20, instruction: "Notice any sensations in your feet. Feel the weight, temperature, and any tension. Breathe and let go." },
  { id: "legs", name: "Lower Legs", duration: 20, instruction: "Move your awareness up to your calves and shins. Notice any tightness or comfort. Relax with each exhale." },
  { id: "thighs", name: "Upper Legs", duration: 20, instruction: "Feel your thighs resting. Notice where they touch the surface beneath you. Release any held tension." },
  { id: "hips", name: "Hips & Pelvis", duration: 20, instruction: "Bring attention to your hips and lower back. This area holds much stress. Breathe deeply and soften." },
  { id: "belly", name: "Belly & Core", duration: 25, instruction: "Notice your belly rising and falling with breath. Let it be soft and relaxed. Release any tightening." },
  { id: "chest", name: "Chest & Heart", duration: 25, instruction: "Feel your heartbeat. Notice your chest expand and contract. Send gratitude to your heart for its constant work." },
  { id: "hands", name: "Hands & Arms", duration: 20, instruction: "Feel the sensations in your fingers, palms, wrists, and arms. Let them feel heavy and relaxed." },
  { id: "shoulders", name: "Shoulders & Neck", duration: 25, instruction: "These areas hold much tension. Let your shoulders drop away from your ears. Soften your neck." },
  { id: "face", name: "Face & Head", duration: 25, instruction: "Relax your jaw, soften your eyes, smooth your forehead. Let all expression melt away." },
  { id: "whole", name: "Whole Body", duration: 30, instruction: "Now feel your entire body as one. Notice the peaceful wholeness. You are calm, relaxed, and present." },
];

export default function BodyScanMeditation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPart, setCurrentPart] = useState(0);
  const [timer, setTimer] = useState(BODY_PARTS[0].duration);
  const [completed, setCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("body_scan_sessions");
    if (saved) setSessionsCompleted(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (isPlaying && !completed) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (currentPart < BODY_PARTS.length - 1) {
              setCurrentPart((p) => p + 1);
              return BODY_PARTS[currentPart + 1].duration;
            } else {
              setCompleted(true);
              setIsPlaying(false);
              const newCount = sessionsCompleted + 1;
              setSessionsCompleted(newCount);
              try { localStorage.setItem("body_scan_sessions", newCount.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [isPlaying, currentPart, completed, sessionsCompleted]);

  const togglePlay = () => {
    if (completed) {
      reset();
    }
    setIsPlaying(!isPlaying);
  };

  const skipPart = () => {
    if (currentPart < BODY_PARTS.length - 1) {
      setCurrentPart((p) => p + 1);
      setTimer(BODY_PARTS[currentPart + 1].duration);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentPart(0);
    setTimer(BODY_PARTS[0].duration);
    setCompleted(false);
  };

  const part = BODY_PARTS[currentPart];
  const totalDuration = BODY_PARTS.reduce((sum, p) => sum + p.duration, 0);
  const elapsedDuration = BODY_PARTS.slice(0, currentPart).reduce((sum, p) => sum + p.duration, 0) + (BODY_PARTS[currentPart].duration - timer);
  const overallProgress = (elapsedDuration / totalDuration) * 100;

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="body-scan-meditation">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-pink-400/10 to-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-bodyscan-title">
                Body Scan Meditation
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Release tension from head to toe</p>
            </div>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {Math.floor(totalDuration / 60)} min session
          </span>
        </div>

        {!completed ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-[var(--text-muted)] mb-2">
                <span>Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-1000"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 text-white mb-6 text-center">
              <div className="text-sm text-white/80 mb-2">Focus on your</div>
              <div className="text-3xl font-display font-bold mb-3" data-testid="text-body-part">
                {part.name}
              </div>
              <p className="text-white/90 leading-relaxed mb-4" data-testid="text-instruction">
                {part.instruction}
              </p>
              <div className="text-5xl font-bold" data-testid="text-timer">
                {timer}s
              </div>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {BODY_PARTS.map((p, i) => (
                <div
                  key={p.id}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < currentPart
                      ? "bg-emerald-500"
                      : i === currentPart
                      ? "bg-pink-500 scale-125"
                      : "bg-[var(--surface)]"
                  }`}
                  title={p.name}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                data-testid="button-mute"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center"
                data-testid="button-play-pause"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              <button
                onClick={skipPart}
                disabled={currentPart >= BODY_PARTS.length - 1}
                className="p-3 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50"
                data-testid="button-skip"
                aria-label="Skip to next body part"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-2xl font-display font-bold text-[var(--text)] mb-2" data-testid="text-complete">
              Body Scan Complete
            </h4>
            <p className="text-[var(--text-secondary)] mb-6">
              You've completed a full body relaxation. Notice how calm and peaceful you feel.
            </p>
            <button
              onClick={reset}
              className="btn-gradient px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center gap-2 mx-auto"
              data-testid="button-restart"
            >
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
