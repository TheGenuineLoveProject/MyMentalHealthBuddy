import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, Calendar, ChevronLeft, ChevronRight, MessageCircle, Trash2, Plus, X, Loader2, Clock, Send, AlertCircle } from "lucide-react";
import { Instagram, Twitter, Youtube } from "../../lib/lucide-brands";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { SEO } from "../../components/SEO";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

// PHASE11661_SOCIAL_CALENDAR_VISUAL_TOKEN_PATCH

const PLATFORMS = {
  instagram: { icon: Instagram, color: "#E4405F", name: "Instagram" },
  tiktok: { icon: MessageCircle, color: "#000000", name: "TikTok" },
  threads: { icon: Twitter, color: "#1DA1F2", name: "Threads" },
  youtube: { icon: Youtube, color: "#FF0000", name: "YouTube" },
  x: { icon: Twitter, color: "#000000", name: "X/Twitter" },
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
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    draftId: "",
    platform: "instagram",
    theme: "",
    time: "12:00",
  });
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthDays(year, month);
  
  const { data: entries = [], isLoading, error, refetch } = useQuery({
    queryKey: ["/api/admin/social/calendar"],
  });
  
  const { data: drafts = [] } = useQuery({
    queryKey: ["/api/admin/social/drafts"],
  });
  
  const approvedDrafts = drafts.filter(d => d.status === "approved");
  
  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/admin/social/calendar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/calendar"] });
    },
  });
  
  const scheduleMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/calendar", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/calendar"] });
      setShowScheduleModal(false);
      setScheduleForm({ draftId: "", platform: "instagram", theme: "", time: "12:00" });
    },
  });
  
  const handleDateClick = (date) => {
    if (!date || date < new Date().setHours(0, 0, 0, 0)) return;
    setSelectedDate(date);
    setShowScheduleModal(true);
  };
  
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    const [hours, minutes] = scheduleForm.time.split(":").map(Number);
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    scheduleMutation.mutate({
      draftId: scheduleForm.draftId || null,
      scheduledDate: scheduledDate.toISOString(),
      platform: scheduleForm.platform,
      theme: scheduleForm.theme || (drafts.find(d => d.id === scheduleForm.draftId)?.theme) || "Scheduled Post",
      status: "scheduled",
    });
  };
  
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

  if (error) {
    return <AdminErrorBanner title="Unable to load social calendar" onRetry={refetch} />;
  }
  
  return (
    <div className="min-h-screen bg-[var(--glp-sage-10)] dark:bg-[var(--glp-charcoal)]">
      <SEO title="Social Calendar — Admin" noindex />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '0.5rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} />
          Back to Command Center
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/social" className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-deep-teal)] transition-colors" data-testid="link-back-social">
            <ArrowLeft className="w-5 h-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="text-page-title">
              Content Calendar
            </h1>
            <p className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
              Schedule and track your content
            </p>
          </div>
        </div>
        
        {error && (
          <div className="text-center py-16" data-testid="section-error">
            <AlertCircle className="w-12 h-12 text-[var(--glp-blossom)] mx-auto mb-4" />
            <p className="text-[var(--glp-blossom)] dark:text-[var(--glp-blossom)] mb-4">Failed to load data</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-[var(--glp-sage)] text-[var(--glp-ivory)] rounded-lg hover:opacity-90" data-testid="button-retry">
              Retry
            </button>
          </div>
        )}
        
        {!error && (
        <>
        <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] overflow-hidden" data-testid="section-calendar">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glp-sage)] dark:border-[var(--glp-sage)]">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-deep-teal)] transition-colors"
              data-testid="button-prev-month"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" />
            </button>
            
            <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="text-month-name">
              {monthName}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-deep-teal)] transition-colors"
              data-testid="button-next-month"
            >
              <ChevronRight className="w-5 h-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" />
            </button>
          </div>
          
          <div className="grid grid-cols-7">
            {DAYS.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-[var(--glp-deep-teal)] border-b border-[var(--glp-sage)] dark:border-[var(--glp-sage)]" data-testid={`header-day-${day.toLowerCase()}`}>
                {day}
              </div>
            ))}
            
            {days.map((date, i) => {
              const dayEntries = getEntriesForDate(date);
              const isToday = date && date.toDateString() === new Date().toDateString();
              const isPast = date && date < new Date().setHours(0, 0, 0, 0);
              
              return (
                <div
                  key={i}
                  onClick={() => !isPast && handleDateClick(date)}
                  data-testid={date ? `cell-day-${date.getDate()}` : `cell-empty-${i}`}
                  className={`min-h-[100px] p-2 border-b border-r border-[var(--glp-sage)] dark:border-[var(--glp-sage)] group ${
                    date ? "bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)]" : "bg-[var(--glp-sage-10)] dark:bg-[var(--glp-charcoal)]"
                  } ${date && !isPast ? "cursor-pointer hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-deep-teal)]/50" : ""} ${isPast ? "opacity-60" : ""}`}
                >
                  {date && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-sm ${
                          isToday 
                            ? "w-7 h-7 flex items-center justify-center rounded-full bg-[var(--glp-sage)] text-[var(--glp-ivory)] font-semibold"
                            : "text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]"
                        }`}>
                          {date.getDate()}
                        </div>
                        {!isPast && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDateClick(date); }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-[var(--glp-sage-10)] text-[var(--glp-sage)] transition-all"
                            data-testid={`button-add-${date.getDate()}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEntries.slice(0, 3).map(entry => {
                          const platform = PLATFORMS[entry.platform] || PLATFORMS.instagram;
                          const Icon = platform.icon;
                          const draft = drafts.find(d => d.id === entry.draftId);
                          
                          return (
                            <div
                              key={entry.id}
                              className="group flex items-center gap-1 text-xs p-1 rounded bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage-20)] dark:hover:bg-[var(--glp-charcoal)] transition-colors"
                              title={draft?.hook || entry.theme}
                              data-testid={`entry-${entry.id}`}
                            >
                              <Icon className="w-3 h-3 flex-shrink-0" style={{ color: platform.color }} />
                              <span className="truncate text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                                {entry.theme || "Post"}
                              </span>
                              <button
                                onClick={() => deleteMutation.mutate(entry.id)}
                                className="ml-auto opacity-0 group-hover:opacity-100 text-[var(--glp-sage)] hover:text-[var(--glp-blossom)] transition-all"
                                data-testid={`button-delete-entry-${entry.id}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                        
                        {dayEntries.length > 3 && (
                          <span className="text-xs text-[var(--glp-deep-teal)]">
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
        
        <div className="mt-8 bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] p-6" data-testid="section-upcoming-posts">
          <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-4">
            Upcoming Posts
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin motion-reduce:animate-none w-6 h-6 border-2 border-[var(--glp-sage)] border-t-transparent rounded-full" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-[var(--glp-deep-teal)] text-center py-8" data-testid="text-empty-upcoming">
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
                    className="flex items-center gap-4 p-3 rounded-lg bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)]"
                    data-testid={`row-calendar-${entry.id}`}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: platform.color }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] truncate">
                        {draft?.hook || entry.theme || "Scheduled Post"}
                      </p>
                      <p className="text-sm text-[var(--glp-deep-teal)]">
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
                      className="p-2 text-[var(--glp-sage)] hover:text-[var(--glp-blossom)] transition-colors"
                      data-testid={`button-delete-upcoming-${entry.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </>
        )}
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
      
      {showScheduleModal && (
        <div className="fixed inset-0 bg-[rgba(47,93,93,0.45)] flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl shadow-[0_24px_60px_rgba(47,93,93,0.18)] w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-[var(--glp-sage)] dark:border-[var(--glp-sage)]">
              <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--glp-sage)]" />
                Schedule Content
              </h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-deep-teal)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[var(--glp-deep-teal)]" />
              </button>
            </div>
            
            <form onSubmit={handleScheduleSubmit} className="p-4 space-y-4" data-testid="form-schedule">
              <div className="p-3 bg-[var(--glp-sage-10)] rounded-lg text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                <Clock className="w-4 h-4 inline-block mr-2 text-[var(--glp-sage)]" />
                Scheduling for: {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              
              {approvedDrafts.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-1">
                    Select Approved Draft (Optional)
                  </label>
                  <select
                    value={scheduleForm.draftId}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, draftId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)]"
                    data-testid="select-draft"
                  >
                    <option value="">Create new slot</option>
                    {approvedDrafts.map(draft => (
                      <option key={draft.id} value={draft.id}>
                        {draft.hook?.slice(0, 50) || draft.theme || "Untitled"} ({draft.platform})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-1">
                    Platform
                  </label>
                  <select
                    value={scheduleForm.platform}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)]"
                    data-testid="select-platform"
                  >
                    {Object.entries(PLATFORMS).map(([id, p]) => (
                      <option key={id} value={id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)]"
                    data-testid="input-time"
                  />
                </div>
              </div>
              
              {!scheduleForm.draftId && (
                <div>
                  <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-1">
                    Theme/Topic
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.theme}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, theme: e.target.value }))}
                    placeholder="e.g., Self-Compassion Monday"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)]"
                    data-testid="input-theme"
                  />
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] rounded-lg text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-deep-teal)] transition-colors"
                  data-testid="button-cancel-schedule"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="flex-1 px-4 py-2 bg-[var(--glp-sage)] text-[var(--glp-ivory)] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="button-confirm-schedule"
                >
                  {scheduleMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
