import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, Filter, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";

const MOOD_COLORS = {
  calm: { bg: "bg-teal-100 dark:bg-teal-900/40", border: "border-teal-300 dark:border-teal-700", label: "Calm", hex: "#14b8a6" },
  anxious: { bg: "bg-rose-100 dark:bg-rose-900/40", border: "border-rose-300 dark:border-rose-700", label: "Anxious", hex: "#f43f5e" },
  happy: { bg: "bg-amber-100 dark:bg-amber-900/40", border: "border-amber-300 dark:border-amber-700", label: "Happy", hex: "#f59e0b" },
  joy: { bg: "bg-amber-100 dark:bg-amber-900/40", border: "border-amber-300 dark:border-amber-700", label: "Joy", hex: "#fbbf24" },
  sad: { bg: "bg-blue-100 dark:bg-blue-900/40", border: "border-blue-300 dark:border-blue-700", label: "Sad", hex: "#3b82f6" },
  neutral: { bg: "bg-gray-100 dark:bg-gray-800/40", border: "border-gray-300 dark:border-gray-600", label: "Neutral", hex: "#6b7280" },
  hopeful: { bg: "bg-emerald-100 dark:bg-emerald-900/40", border: "border-emerald-300 dark:border-emerald-700", label: "Hopeful", hex: "#10b981" },
  grateful: { bg: "bg-yellow-100 dark:bg-yellow-900/40", border: "border-yellow-300 dark:border-yellow-700", label: "Grateful", hex: "#eab308" },
  angry: { bg: "bg-red-100 dark:bg-red-900/40", border: "border-red-300 dark:border-red-700", label: "Angry", hex: "#ef4444" },
  loved: { bg: "bg-pink-100 dark:bg-pink-900/40", border: "border-pink-300 dark:border-pink-700", label: "Loved", hex: "#ec4899" },
  peaceful: { bg: "bg-sky-100 dark:bg-sky-900/40", border: "border-sky-300 dark:border-sky-700", label: "Peaceful", hex: "#0ea5e9" },
  tired: { bg: "bg-indigo-100 dark:bg-indigo-900/40", border: "border-indigo-300 dark:border-indigo-700", label: "Tired", hex: "#8b5cf6" }
};

const VIEW_MODES = { weekly: "Weekly", monthly: "Monthly", history: "All Time" };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function MoodDonutChart({ moodCounts, total }) {
  if (total === 0) return null;
  
  const entries = Object.entries(moodCounts).filter(([, count]) => count > 0);
  let startAngle = 0;
  
  return (
    <div className="flex items-center justify-center gap-4 mt-4 p-3 bg-muted/30 rounded-xl">
      <svg viewBox="0 0 100 100" className="w-20 h-20" aria-label="Mood distribution chart">
        {entries.map(([mood, count]) => {
          const percentage = count / total;
          const angle = percentage * 360;
          const endAngle = startAngle + angle;
          
          const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
          const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
          const x2 = 50 + 35 * Math.cos((endAngle - 90) * Math.PI / 180);
          const y2 = 50 + 35 * Math.sin((endAngle - 90) * Math.PI / 180);
          
          const largeArc = angle > 180 ? 1 : 0;
          const pathData = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`;
          
          const currentStart = startAngle;
          startAngle = endAngle;
          
          return (
            <path
              key={mood}
              d={pathData}
              fill={MOOD_COLORS[mood]?.hex || "#6b7280"}
              stroke="white"
              strokeWidth="1"
            >
              <title>{MOOD_COLORS[mood]?.label || mood}: {Math.round(percentage * 100)}%</title>
            </path>
          );
        })}
        <circle cx="50" cy="50" r="18" fill="white" className="dark:fill-gray-800" />
        <text x="50" y="54" textAnchor="middle" className="text-xs font-bold fill-current">{total}</text>
      </svg>
      <div className="flex flex-col gap-1 text-xs">
        {entries.slice(0, 4).map(([mood, count]) => (
          <div key={mood} className="flex items-center gap-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: MOOD_COLORS[mood]?.hex || "#6b7280" }}
            />
            <span className="text-muted-foreground">{MOOD_COLORS[mood]?.label || mood}</span>
            <span className="font-medium">{Math.round((count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EmotionCalendar({ 
  moodData = {},
  onDateSelect,
  className = ""
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("monthly");
  const [moodFilter, setMoodFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const moodStats = useMemo(() => {
    const counts = {};
    let total = 0;
    Object.values(moodData).forEach(mood => {
      if (mood) {
        counts[mood] = (counts[mood] || 0) + 1;
        total++;
      }
    });
    return { counts, total };
  }, [moodData]);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ 
        day, 
        date: dateStr,
        mood: moodData[dateStr] || null
      });
    }

    return days;
  }, [year, month, moodData]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (dateInfo) => {
    if (dateInfo.day) {
      setSelectedDate(dateInfo.date);
      if (onDateSelect) {
        onDateSelect(dateInfo.date, dateInfo.mood);
      }
    }
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-[#d4af37]" aria-hidden="true" />
            Emotion Calendar
          </CardTitle>
          <div className="flex items-center gap-1" role="group" aria-label="Month navigation">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              className="h-8 w-8 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label="Previous month"
              data-testid="button-prev-month"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </Button>
            <span className="min-w-[140px] text-center font-medium" aria-live="polite">
              {monthName} {year}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
              className="h-8 w-8 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label="Next month"
              data-testid="button-next-month"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="grid grid-cols-7 gap-1"
          role="grid"
          aria-label={`Calendar for ${monthName} ${year}`}
        >
          {WEEKDAYS.map(day => (
            <div 
              key={day} 
              className="text-center text-xs font-medium text-muted-foreground py-2"
              role="columnheader"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((dateInfo, i) => {
            const moodStyle = dateInfo.mood ? MOOD_COLORS[dateInfo.mood] : null;
            const isSelected = selectedDate === dateInfo.date;
            const todayClass = dateInfo.date && isToday(dateInfo.date);

            return (
              <button
                key={i}
                onClick={() => handleDateClick(dateInfo)}
                disabled={!dateInfo.day}
                className={`
                  aspect-square rounded-lg text-sm font-medium transition-all
                  ${dateInfo.day ? 'hover:bg-muted cursor-pointer' : 'cursor-default'}
                  ${moodStyle ? `${moodStyle.bg} ${moodStyle.border} border` : ''}
                  ${isSelected ? 'ring-2 ring-[#d4af37] ring-offset-1' : ''}
                  ${todayClass ? 'font-bold text-[#d4af37]' : ''}
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-1
                `}
                role="gridcell"
                aria-label={dateInfo.day ? `${monthName} ${dateInfo.day}${dateInfo.mood ? `, mood: ${MOOD_COLORS[dateInfo.mood]?.label}` : ''}` : undefined}
                aria-selected={isSelected}
                data-testid={dateInfo.day ? `calendar-day-${dateInfo.day}` : undefined}
              >
                {dateInfo.day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center" role="legend" aria-label="Mood color legend">
          {Object.entries(MOOD_COLORS).slice(0, 5).map(([mood, style]) => (
            <div key={mood} className="flex items-center gap-1 text-xs">
              <span className={`w-3 h-3 rounded-full ${style.bg} ${style.border} border`} aria-hidden="true" />
              <span className="text-muted-foreground">{style.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
