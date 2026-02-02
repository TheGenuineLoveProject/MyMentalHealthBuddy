import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";

const MOOD_COLORS = {
  calm: { bg: "bg-teal-100 dark:bg-teal-900/40", border: "border-teal-300 dark:border-teal-700", label: "Calm" },
  anxious: { bg: "bg-rose-100 dark:bg-rose-900/40", border: "border-rose-300 dark:border-rose-700", label: "Anxious" },
  happy: { bg: "bg-amber-100 dark:bg-amber-900/40", border: "border-amber-300 dark:border-amber-700", label: "Happy" },
  sad: { bg: "bg-blue-100 dark:bg-blue-900/40", border: "border-blue-300 dark:border-blue-700", label: "Sad" },
  neutral: { bg: "bg-gray-100 dark:bg-gray-800/40", border: "border-gray-300 dark:border-gray-600", label: "Neutral" },
  hopeful: { bg: "bg-emerald-100 dark:bg-emerald-900/40", border: "border-emerald-300 dark:border-emerald-700", label: "Hopeful" },
  grateful: { bg: "bg-yellow-100 dark:bg-yellow-900/40", border: "border-yellow-300 dark:border-yellow-700", label: "Grateful" },
  angry: { bg: "bg-red-100 dark:bg-red-900/40", border: "border-red-300 dark:border-red-700", label: "Angry" }
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function EmotionCalendar({ 
  moodData = {},
  onDateSelect,
  className = ""
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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
