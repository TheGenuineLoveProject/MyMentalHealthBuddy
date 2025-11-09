import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ChevronLeft, ChevronRight, Instagram, Twitter } from 'lucide-react';
/**
 * Visual Calendar Component for Social Media Scheduling
 * Shows monthly view with scheduled posts
 */
export function CalendarView({ posts, onDateClick }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
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
    const getPostsForDate = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return posts.filter(post => post.date === dateStr);
    };
    const renderCalendarDays = () => {
        const days = [];
        // Empty cells for days before month starts
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(_jsx("div", { className: "min-h-[100px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" }, `empty-${i}`));
        }
        // Calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const postsOnDay = getPostsForDate(day);
            const isToday = day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
            days.push(_jsxs("div", { onClick: () => onDateClick?.(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)), className: `min-h-[100px] border border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isToday ? 'bg-primary/10' : ''}`, "data-testid": `calendar-day-${day}`, children: [_jsx("div", { className: `text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`, children: day }), _jsxs("div", { className: "space-y-1", children: [postsOnDay.slice(0, 3).map((post) => (_jsx("div", { className: "text-xs p-1 bg-blue-100 dark:bg-blue-900 rounded truncate", "data-testid": `calendar-post-${post.id}`, children: _jsxs("div", { className: "flex items-center gap-1", children: [post.platforms.includes('instagram') && _jsx(Instagram, { className: "h-3 w-3" }), post.platforms.includes('twitter') && _jsx(Twitter, { className: "h-3 w-3" }), _jsx("span", { className: "truncate", children: post.time })] }) }, post.id))), postsOnDay.length > 3 && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["+", postsOnDay.length - 3, " more"] }))] })] }, day));
        }
        return days;
    };
    return (_jsxs(Card, { className: "p-6", "data-testid": "calendar-view", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h2", { className: "text-2xl font-bold", "data-testid": "text-calendar-month", children: [monthNames[currentDate.getMonth()], " ", currentDate.getFullYear()] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: goToPreviousMonth, "data-testid": "button-prev-month", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "secondary", size: "sm", onClick: goToNextMonth, "data-testid": "button-next-month", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }), _jsx("div", { className: "grid grid-cols-7 gap-0 mb-2", children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (_jsx("div", { className: "text-center text-sm font-medium p-2 text-muted-foreground", children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-0 border-t border-l border-gray-200 dark:border-gray-700", children: renderCalendarDays() }), _jsxs("div", { className: "mt-6 flex gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-primary/10 rounded" }), _jsx("span", { children: "Today" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded" }), _jsx("span", { children: "Scheduled Post" })] })] })] }));
}
