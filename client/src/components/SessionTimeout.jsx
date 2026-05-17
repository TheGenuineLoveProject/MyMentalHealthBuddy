import { useState, useEffect, useCallback } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAuthToken } from "@/lib/api";

const TIMEOUT_WARNING = 5 * 60 * 1000;
const SESSION_TIMEOUT = 30 * 60 * 1000;

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setTimeLeft(0);
  }, []);

  useEffect(() => {
    let warningTimer;
    let countdownInterval;

    const startTimers = () => {
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);

      warningTimer = setTimeout(() => {
        setShowWarning(true);
        setTimeLeft(TIMEOUT_WARNING / 1000);

        countdownInterval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, SESSION_TIMEOUT - TIMEOUT_WARNING);
    };

    const handleActivity = () => {
      if (showWarning) return;
      startTimers();
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    startTimers();

    return () => {
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [showWarning]);

  const handleExtend = async () => {
    try {
      const extendToken = getAuthToken();
      await fetch("/api/session/extend", {
        method: "POST",
        credentials: "include",
        headers: extendToken ? { Authorization: `Bearer ${extendToken}` } : {},
      });
      resetTimer();
    } catch {
      resetTimer();
    }
  };

  if (!showWarning) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="alertdialog"
      aria-label="Session timeout warning"
    >
      <div className="bg-background rounded-xl p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Session Expiring</h2>
            <p className="text-muted-foreground text-sm">
              Your session will expire in {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground mb-6">
          Would you like to stay logged in? Click below to extend your session.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={handleExtend}
            className="flex-1 min-h-[44px]"
            data-testid="button-extend-session"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Stay Logged In
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/api/logout")}
            className="flex-1 min-h-[44px]"
            data-testid="button-logout"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
