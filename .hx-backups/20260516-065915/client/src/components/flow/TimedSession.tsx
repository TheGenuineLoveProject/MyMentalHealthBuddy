import { useState, useEffect, useCallback } from "react";

type SessionLength = 5 | 10 | 15 | 20 | 30;

interface Props {
  onComplete: (text: string, duration: number) => void;
  onCancel?: () => void;
}

export default function TimedSession({ onComplete, onCancel }: Props) {
  const [duration, setDuration] = useState<SessionLength>(10);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [text, setText] = useState("");

  const startSession = useCallback(() => {
    setTimeLeft(duration * 60);
    setIsActive(true);
    setText("");
  }, [duration]);

  const endSession = useCallback(() => {
    setIsActive(false);
    if (text.trim()) {
      onComplete(text.trim(), duration * 60 - timeLeft);
    }
  }, [text, duration, timeLeft, onComplete]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && text.trim()) {
      onComplete(text.trim(), duration * 60);
    }
  }, [timeLeft, text, duration, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = isActive ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;

  if (!isActive) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-semibold">Timed Writing Session</h3>
        <p className="text-sm text-muted-foreground">
          A space for uninterrupted writing, if that feels right for you. You might let thoughts flow without editing.
        </p>

        <div className="flex justify-center gap-2">
          {([5, 10, 15, 20, 30] as SessionLength[]).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`rounded-lg px-4 py-2 text-sm ${
                duration === d
                  ? "bg-primary text-primary-foreground"
                  : "border hover:bg-muted"
              }`}
              data-testid={`button-duration-${d}`}
            >
              {d}m
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={startSession}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
            data-testid="button-start-session"
          >
            Begin
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="rounded-lg border px-6 py-2 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-mono font-semibold" data-testid="text-timer">
          {formatTime(timeLeft)}
        </div>
        <button
          onClick={endSession}
          className="rounded-lg border px-4 py-1 text-sm"
          data-testid="button-end-session"
        >
          Finish Early
        </button>
      </div>

      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder="Start writing... let your thoughts flow without judgment."
        className="w-full min-h-[300px] rounded-xl border p-4 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20"
        data-testid="textarea-timed-writing"
      />

      <p className="text-xs text-center text-muted-foreground">
        This is your space. Take what feels helpful. You know yourself best.
      </p>
    </div>
  );
}
