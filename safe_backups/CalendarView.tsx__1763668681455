import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { ChevronLeft, ChevronRight, Instagram, Twitter } from 'lucide-react';

interface ScheduledPost {
  id: number;
  date: string;
  content: string;
  platforms: string[];
  time: string;
}

interface CalendarViewProps {
  posts: ScheduledPost[];
  onDateClick?: (date: Date) => void;
}

/**
 * Visual Calendar Component for Social Media Scheduling
 * Shows monthly view with scheduled posts
 */
export function CalendarView({ posts, onDateClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getPostsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(post => post.date === dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const postsOnDay = getPostsForDate(day);
      const isToday = day === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => onDateClick?.(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          className={`min-h-[100px] border border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            isToday ? 'bg-primary/10' : ''
          }`}
          data-testid={`calendar-day-${day}`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
            {day}
          </div>
          <div className="space-y-1">
            {postsOnDay.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="text-xs p-1 bg-blue-100 dark:bg-blue-900 rounded truncate"
                data-testid={`calendar-post-${post.id}`}
              >
                <div className="flex items-center gap-1">
                  {post.platforms.includes('instagram') && <Instagram className="h-3 w-3" />}
                  {post.platforms.includes('twitter') && <Twitter className="h-3 w-3" />}
                  <span className="truncate">{post.time}</span>
                </div>
              </div>
            ))}
            {postsOnDay.length > 3 && (
              <div className="text-xs text-muted-foreground">+{postsOnDay.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <Card className="p-6" data-testid="calendar-view">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" data-testid="text-calendar-month">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={goToPreviousMonth}
            data-testid="button-prev-month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToNextMonth}
            data-testid="button-next-month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium p-2 text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-200 dark:border-gray-700">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary/10 rounded" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded" />
          <span>Scheduled Post</span>
        </div>
      </div>
    </Card>
  );
}
