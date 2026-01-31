import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Calendar, Smile, Frown, Meh, Heart, Sparkles, Zap, Sun, Cloud } from "lucide-react";

const EMOTIONS = {
  Happy: { emoji: "😊", color: "#22c55e", icon: Smile },
  Grateful: { emoji: "🙏", color: "#d4af37", icon: Heart },
  Calm: { emoji: "😌", color: "#3b82f6", icon: Sun },
  Hopeful: { emoji: "🌟", color: "#8fbf9f", icon: Sparkles },
  Neutral: { emoji: "😐", color: "#64748b", icon: Meh },
  Anxious: { emoji: "😰", color: "#f59e0b", icon: Zap },
  Sad: { emoji: "😢", color: "#6366f1", icon: Frown },
  Overwhelmed: { emoji: "😓", color: "#8b5cf6", icon: Cloud },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function MoodCalendar({ className = "" }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const { data: entries = [] } = useQuery({
    queryKey: ["/api/mood"],
    staleTime: 30000,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const moodMap = useMemo(() => {
    const map = {};
    entries.forEach((entry) => {
      const date = new Date(entry.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(entry);
    });
    return map;
  }, [entries]);

  const getDayMood = (day) => {
    const key = `${year}-${month}-${day}`;
    const dayEntries = moodMap[key];
    if (!dayEntries || dayEntries.length === 0) return null;
    const latestEntry = dayEntries[dayEntries.length - 1];
    return EMOTIONS[latestEntry.emotion] || EMOTIONS.Neutral;
  };

  const getDayEntries = (day) => {
    const key = `${year}-${month}-${day}`;
    return moodMap[key] || [];
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const selectedDayEntries = selectedDay ? getDayEntries(selectedDay) : [];

  return (
    <div className={`mood-calendar ${className}`} data-testid="mood-calendar">
      <div className="bg-softWhite dark:bg-gray-800 rounded-xl shadow-lg border border-sageGreen/20 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-sageGreen/20 dark:border-gray-700 bg-gradient-to-r from-sageGreen/10 to-softWhite">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-deepTeal" aria-hidden="true" />
              <h2 className="font-serif text-lg font-semibold text-deepTeal dark:text-white">Mood Calendar</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-sageGreen/10 text-deepTeal transition"
                aria-label="Previous month"
                data-testid="prev-month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-sans font-medium text-deepTeal dark:text-white min-w-[140px] text-center">
                {MONTHS[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-sageGreen/10 text-deepTeal transition"
                aria-label="Next month"
                data-testid="next-month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center font-sans text-xs font-medium text-deepTeal/60 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const mood = getDayMood(day);
              const dayEntriesCount = getDayEntries(day).length;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-200 ${
                    isSelected
                      ? "ring-2 ring-deepTeal scale-105 shadow-md"
                      : "hover:bg-sageGreen/10"
                  } ${isToday(day) ? "ring-1 ring-metallicGold" : ""}`}
                  style={mood ? { backgroundColor: `${mood.color}20` } : {}}
                  data-testid={`calendar-day-${day}`}
                  aria-label={`${MONTHS[month]} ${day}, ${year}${mood ? ` - ${Object.keys(EMOTIONS).find(k => EMOTIONS[k] === mood)}` : ""}`}
                >
                  <span className={`font-sans text-sm ${isToday(day) ? "font-bold text-metallicGold" : "text-deepTeal dark:text-white"}`}>
                    {day}
                  </span>
                  {mood && (
                    <span 
                      className="text-lg leading-none mt-0.5"
                      style={{ filter: `drop-shadow(0 0 4px ${mood.color}40)` }}
                    >
                      {mood.emoji}
                    </span>
                  )}
                  {dayEntriesCount > 1 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-deepTeal text-softWhite text-[10px] flex items-center justify-center font-sans font-bold">
                      {dayEntriesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDay && (
          <div className="border-t border-sageGreen/20 dark:border-gray-700 p-4 bg-sageGreen/5">
            <h3 className="font-serif text-sm font-medium text-deepTeal dark:text-white mb-3">
              {MONTHS[month]} {selectedDay}, {year}
            </h3>
            {selectedDayEntries.length === 0 ? (
              <p className="font-sans text-sm text-deepTeal/60 dark:text-gray-400">No entries for this day.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedDayEntries.map((entry, idx) => {
                  const emotionData = EMOTIONS[entry.emotion] || EMOTIONS.Neutral;
                  const time = new Date(entry.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  });
                  return (
                    <div
                      key={entry.id || idx}
                      className="p-2 rounded-lg bg-softWhite dark:bg-gray-700 flex items-start gap-2"
                      data-testid={`calendar-entry-${entry.id || idx}`}
                    >
                      <span className="text-xl" style={{ filter: `drop-shadow(0 0 4px ${emotionData.color}40)` }}>
                        {emotionData.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-medium text-sm text-deepTeal dark:text-white">
                            {entry.emotion}
                          </span>
                          <span className="font-sans text-xs text-deepTeal/50">{time}</span>
                        </div>
                        {entry.content && (
                          <p className="font-sans text-xs text-deepTeal/70 dark:text-gray-300 line-clamp-2 mt-0.5">
                            {entry.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="border-t border-sageGreen/20 dark:border-gray-700 p-3 bg-sageGreen/5">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(EMOTIONS).slice(0, 4).map(([name, data]) => (
              <div key={name} className="flex items-center gap-1 text-xs font-sans text-deepTeal/70">
                <span className="text-sm">{data.emoji}</span>
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
