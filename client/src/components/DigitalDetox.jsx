import { useState, useEffect, useRef } from "react";
import { Smartphone, PowerOff, Play, Pause, Check, Clock, Trophy, Zap } from "lucide-react";

const DETOX_DURATIONS = [
  { minutes: 15, label: "Quick Break", points: 15 },
  { minutes: 30, label: "Power Down", points: 35 },
  { minutes: 60, label: "Digital Sunset", points: 75 },
  { minutes: 120, label: "Deep Detox", points: 160 },
  { minutes: 240, label: "Half Day", points: 350 },
];

const DETOX_ACTIVITIES = [
  { icon: "📖", text: "Read a physical book" },
  { icon: "🚶", text: "Go for a walk outside" },
  { icon: "🧘", text: "Meditate or do yoga" },
  { icon: "☕", text: "Enjoy a mindful drink" },
  { icon: "🎨", text: "Draw or create art" },
  { icon: "🎵", text: "Listen to music mindfully" },
  { icon: "🌳", text: "Spend time in nature" },
  { icon: "👥", text: "Have a face-to-face conversation" },
  { icon: "✍️", text: "Write in a journal" },
  { icon: "🧩", text: "Do a puzzle or play a board game" },
];

const BENEFITS = [
  "Reduced anxiety and stress",
  "Better sleep quality",
  "Improved focus and attention",
  "Deeper real-world connections",
  "More present moment awareness",
  "Increased creativity",
];

export default function DigitalDetox() {
  const [isDetoxing, setIsDetoxing] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("digital_detox_data");
    if (saved) {
      const data = JSON.parse(saved);
      setTotalMinutes(data.totalMinutes || 0);
      setSessionsCompleted(data.sessions || 0);
      setTotalPoints(data.points || 0);
    }
  }, []);

  useEffect(() => {
    if (isDetoxing && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            completeDetox();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [isDetoxing, timeRemaining]);

  const startDetox = (duration) => {
    setSelectedDuration(duration);
    setTimeRemaining(duration.minutes * 60);
    setIsDetoxing(true);
    setCompleted(false);
  };

  const completeDetox = () => {
    clearInterval(intervalRef.current);
    setIsDetoxing(false);
    setCompleted(true);
    
    const newMinutes = totalMinutes + selectedDuration.minutes;
    const newSessions = sessionsCompleted + 1;
    const newPoints = totalPoints + selectedDuration.points;
    
    setTotalMinutes(newMinutes);
    setSessionsCompleted(newSessions);
    setTotalPoints(newPoints);
    
    localStorage.setItem("digital_detox_data", JSON.stringify({
      totalMinutes: newMinutes,
      sessions: newSessions,
      points: newPoints,
    }));
  };

  const endEarly = () => {
    clearInterval(intervalRef.current);
    const minutesCompleted = Math.floor((selectedDuration.minutes * 60 - timeRemaining) / 60);
    const partialPoints = Math.floor(selectedDuration.points * (minutesCompleted / selectedDuration.minutes));
    
    setIsDetoxing(false);
    setCompleted(true);
    
    const newMinutes = totalMinutes + minutesCompleted;
    const newSessions = sessionsCompleted + 1;
    const newPoints = totalPoints + partialPoints;
    
    setTotalMinutes(newMinutes);
    setSessionsCompleted(newSessions);
    setTotalPoints(newPoints);
    
    localStorage.setItem("digital_detox_data", JSON.stringify({
      totalMinutes: newMinutes,
      sessions: newSessions,
      points: newPoints,
    }));
  };

  const reset = () => {
    setIsDetoxing(false);
    setCompleted(false);
    setSelectedDuration(null);
    setTimeRemaining(0);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = selectedDuration 
    ? ((selectedDuration.minutes * 60 - timeRemaining) / (selectedDuration.minutes * 60)) * 100 
    : 0;

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="digital-detox">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-sky-400/10 to-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg">
              <PowerOff className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-detox-title">
                Digital Detox
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Unplug and recharge</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/20">
            <Trophy className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-medium text-sky-700 dark:text-sky-300" data-testid="text-points">
              {totalPoints} pts
            </span>
          </div>
        </div>

        {!isDetoxing && !completed && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="p-3 rounded-xl bg-[var(--surface)] text-center">
                <Clock className="w-5 h-5 text-sky-500 mx-auto mb-1" />
                <span className="text-xl font-bold text-[var(--text)]">{totalMinutes}</span>
                <span className="text-xs text-[var(--text-muted)] block">mins unplugged</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] text-center">
                <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <span className="text-xl font-bold text-[var(--text)]">{sessionsCompleted}</span>
                <span className="text-xs text-[var(--text-muted)] block">sessions</span>
              </div>
            </div>

            <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Choose your detox duration:</h4>
            <div className="space-y-2 mb-6">
              {DETOX_DURATIONS.map((duration) => (
                <button
                  key={duration.minutes}
                  onClick={() => startDetox(duration)}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 hover:from-sky-100 hover:to-blue-100 dark:hover:from-sky-900/30 dark:hover:to-blue-900/30 text-left flex items-center justify-between transition-colors"
                  data-testid={`button-duration-${duration.minutes}`}
                >
                  <div>
                    <span className="font-medium text-[var(--text)]">{duration.label}</span>
                    <span className="text-sm text-[var(--text-muted)] block">{duration.minutes} minutes</span>
                  </div>
                  <span className="text-sm text-sky-600 dark:text-sky-400 font-medium">+{duration.points} pts</span>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface)]">
              <h4 className="text-sm font-medium text-[var(--text)] mb-2">Benefits of unplugging:</h4>
              <div className="grid grid-cols-2 gap-1">
                {BENEFITS.map((benefit, i) => (
                  <span key={i} className="text-xs text-[var(--text-muted)]">• {benefit}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {isDetoxing && (
          <div className="animate-fade-in-up">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-white text-center mb-6">
              <PowerOff className="w-12 h-12 mx-auto mb-3" />
              <h4 className="text-xl font-bold mb-2">{selectedDuration.label}</h4>
              <div className="text-5xl font-bold mb-2" data-testid="text-timer">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-white/80 text-sm">remaining</p>
              
              <div className="h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                Things to do while unplugged:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {DETOX_ACTIVITIES.slice(0, 6).map((activity, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--surface)] flex items-center gap-2">
                    <span className="text-xl">{activity.icon}</span>
                    <span className="text-sm text-[var(--text)]">{activity.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={endEarly}
                className="flex-1 py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)]"
                data-testid="button-end-early"
              >
                End Early
              </button>
              <button
                onClick={completeDetox}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold"
                data-testid="button-complete"
              >
                I'm Done!
              </button>
            </div>
          </div>
        )}

        {completed && (
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-xl">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-2xl font-display font-bold text-[var(--text)] mb-2" data-testid="text-complete">
              Digital Detox Complete!
            </h4>
            <p className="text-[var(--text-secondary)] mb-2">
              You earned {selectedDuration.points} points
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Total time unplugged: {totalMinutes} minutes
            </p>
            <button
              onClick={reset}
              className="btn-gradient px-8 py-4 rounded-xl font-semibold shadow-lg"
              data-testid="button-another"
            >
              Start Another Detox
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
