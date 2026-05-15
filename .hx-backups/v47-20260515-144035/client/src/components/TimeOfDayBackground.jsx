import { useState, useEffect } from "react";

const TIME_THEMES = {
  morning: {
    gradient: "linear-gradient(135deg, #fff9e6 0%, #ffe4c4 30%, #ffd4a8 70%, #ffc58b 100%)",
    overlay: "rgba(255, 215, 0, 0.05)",
    message: "Good morning, beautiful soul",
  },
  afternoon: {
    gradient: "linear-gradient(135deg, #f0f9f4 0%, #d4e8dc 30%, #8fbf9f 70%, #2f5d5d 100%)",
    overlay: "rgba(143, 191, 159, 0.05)",
    message: "Embrace this moment of peace",
  },
  evening: {
    gradient: "linear-gradient(135deg, #f5e6d3 0%, #e8c4a8 30%, #b48c8c 70%, #8b6b6b 100%)",
    overlay: "rgba(180, 140, 140, 0.05)",
    message: "Let the day gently release",
  },
  night: {
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #2f5d5d 70%, #1a1a2e 100%)",
    overlay: "rgba(47, 93, 93, 0.1)",
    message: "Rest well, dear one",
  },
};

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export default function TimeOfDayBackground({ 
  children, 
  className = "",
  showMessage = false,
  intensity = "light"
}) {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setIsTransitioning(true);
        setTimeout(() => {
          setTimeOfDay(newTimeOfDay);
          setIsTransitioning(false);
        }, 500);
      }
    };

    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [timeOfDay]);

  const theme = TIME_THEMES[timeOfDay];
  const isDark = timeOfDay === "night";
  
  const opacityMap = {
    light: 0.3,
    medium: 0.5,
    strong: 0.7,
  };

  return (
    <div 
      className={`relative min-h-screen transition-all duration-1000 ${isTransitioning ? "opacity-80" : "opacity-100"} ${className}`}
      style={{
        background: theme.gradient,
      }}
      data-testid="time-of-day-background"
      data-time={timeOfDay}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: theme.overlay,
          opacity: opacityMap[intensity] || 0.3,
        }}
        aria-hidden="true"
      />
      
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)",
          animation: "float 20s ease-in-out infinite",
        }}
        aria-hidden="true"
      />
      
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 80%, rgba(143, 191, 159, 0.06) 0%, transparent 50%)",
          animation: "float 25s ease-in-out infinite reverse",
        }}
        aria-hidden="true"
      />

      {showMessage && (
        <div 
          className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-500 ${
            isDark ? "bg-white/10 text-white/80" : "bg-white/60 text-gray-700"
          }`}
          role="status"
          aria-live="polite"
        >
          <span className="mr-2" aria-hidden="true">
            {timeOfDay === "morning" && "🌅"}
            {timeOfDay === "afternoon" && "☀️"}
            {timeOfDay === "evening" && "🌇"}
            {timeOfDay === "night" && "🌙"}
          </span>
          {theme.message}
        </div>
      )}

      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay);

  useEffect(() => {
    const checkTime = () => setTimeOfDay(getTimeOfDay());
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    timeOfDay,
    theme: TIME_THEMES[timeOfDay],
    isDark: timeOfDay === "night",
    isDay: timeOfDay === "morning" || timeOfDay === "afternoon",
  };
}
