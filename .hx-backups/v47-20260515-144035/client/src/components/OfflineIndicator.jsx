import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all ${
        isOnline
          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
          : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
      }`}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <Wifi className="w-5 h-5" />
          <span className="text-sm font-medium">Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5" />
          <span className="text-sm font-medium">You're offline</span>
        </>
      )}
    </div>
  );
}
