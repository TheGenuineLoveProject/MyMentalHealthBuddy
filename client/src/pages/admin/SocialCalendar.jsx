import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, Calendar, ChevronLeft, ChevronRight, 
  Instagram, Twitter, Youtube, MessageCircle, Trash2
} from "lucide-react";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/SafetyFooter";

const PLATFORMS = {
  instagram: { icon: Instagram, color: "#E4405F" },
  tiktok: { icon: MessageCircle, color: "#000000" },
  threads: { icon: Twitter, color: "#1DA1F2" },
  youtube: { icon: Youtube, color: "#FF0000" },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
}

export default function SocialCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthDays(year, month);
  
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/admin/social/calendar"],
  });
  
  const { data: drafts = [] } = useQuery({
    queryKey: ["/api/admin/social/drafts"],
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/admin/social/calendar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/calendar"] });
    },
  });
  
  const getEntriesForDate = (date) => {
    if (!date) return [];
    return entries.filter(e => {
      const entryDate = new Date(e.scheduledDate);
      return entryDate.toDateString() === date.toDateString();
    });
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/social" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Content Calendar
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Schedule and track your content
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              data-testid="button-prev-month"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {monthName}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              data-testid="button-next-month"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-7">
            {DAYS.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-slate-500 border-b border-slate-200 dark:border-slate-700">
                {day}
              </div>
            ))}
            
            {days.map((date, i) => {
              const dayEntries = getEntriesForDate(date);
              const isToday = date && date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={i}
                  className={`min-h-[100px] p-2 border-b border-r border-slate-200 dark:border-slate-700 ${
                    date ? "bg-white dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-900"
                  }`}
                >
                  {date && (
                    <>
                      <div className={`text-sm mb-2 ${
                        isToday 
                          ? "w-7 h-7 flex items-center justify-center rounded-full bg-[var(--glp-sage)] text-white font-semibold"
                          : "text-slate-600 dark:text-slate-400"
                      }`}>
                        {date.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEntries.slice(0, 3).map(entry => {
                          const platform = PLATFORMS[entry.platform] || PLATFORMS.instagram;
                          const Icon = platform.icon;
                          const draft = drafts.find(d => d.id === entry.draftId);
                          
                          return (
                            <div
                              key={entry.id}
                              className="group flex items-center gap-1 text-xs p-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                              title={draft?.hook || entry.theme}
                            >
                              <Icon className="w-3 h-3 flex-shrink-0" style={{ color: platform.color }} />
                              <span className="truncate text-slate-700 dark:text-slate-300">
                                {entry.theme || "Post"}
                              </span>
                              <button
                                onClick={() => deleteMutation.mutate(entry.id)}
                                className="ml-auto opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                        
                        {dayEntries.length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{dayEntries.length - 3} more
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Upcoming Posts
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-[var(--glp-sage)] border-t-transparent rounded-full" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No scheduled posts yet. Create a draft and add it to the calendar.
            </p>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 10).map(entry => {
                const platform = PLATFORMS[entry.platform] || PLATFORMS.instagram;
                const Icon = platform.icon;
                const draft = drafts.find(d => d.id === entry.draftId);
                
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                    data-testid={`row-calendar-${entry.id}`}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: platform.color }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {draft?.hook || entry.theme || "Scheduled Post"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(entry.scheduledDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => deleteMutation.mutate(entry.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
