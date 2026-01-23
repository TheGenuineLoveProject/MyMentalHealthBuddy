import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMoodColor(rating) {
  if (rating <= 3) return "var(--glp-rose)";
  if (rating <= 5) return "var(--glp-gold)";
  if (rating <= 7) return "var(--glp-sage)";
  return "var(--glp-sage-deep)";
}

function getMoodLabel(rating) {
  if (rating <= 3) return "Low";
  if (rating <= 5) return "Neutral";
  if (rating <= 7) return "Good";
  return "Great";
}

export default function MoodHistoryChart({ compact = false }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/mood/stats"],
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-end justify-between gap-1 h-16">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 rounded-t"
              style={{ 
                height: `${30 + Math.random() * 40}%`,
                background: 'var(--glp-sage-15)'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div 
        className="text-center py-4 rounded-xl flex items-center justify-center gap-2"
        style={{ background: 'var(--glp-rose-15)' }}
        data-testid="mood-history-error"
        role="alert"
      >
        <AlertCircle className="w-4 h-4" style={{ color: 'var(--glp-rose)' }} aria-hidden="true" />
        <p className="text-sm" style={{ color: 'var(--glp-rose)' }}>
          Unable to load mood history
        </p>
      </div>
    );
  }

  const stats = data?.data || data || {};
  const history = stats.last7Days || [];
  
  if (history.length === 0) {
    return (
      <div 
        className="text-center py-6 rounded-xl"
        style={{ background: 'var(--glp-sage-10)' }}
        data-testid="mood-history-empty"
      >
        <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.6 }}>
          No mood entries yet. Track your first mood to see your history.
        </p>
      </div>
    );
  }

  const maxRating = 10;
  const reversedHistory = [...history].reverse();

  return (
    <div data-testid="mood-history-chart" aria-label="Mood history for the last 7 days">
      <div className="flex items-end justify-between gap-1.5" style={{ height: compact ? '48px' : '80px' }}>
        {reversedHistory.map((entry, idx) => {
          const rating = entry.rating || 5;
          const heightPercent = (rating / maxRating) * 100;
          const date = entry.createdAt ? new Date(entry.createdAt) : null;
          const dayName = date && !isNaN(date.getTime()) ? DAYS[date.getDay()] : `Day ${idx + 1}`;
          
          return (
            <div 
              key={idx}
              className="flex-1 flex flex-col items-center gap-1"
              title={`${dayName}: ${rating}/10 - ${getMoodLabel(rating)}`}
            >
              <div 
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{ 
                  height: `${heightPercent}%`,
                  background: getMoodColor(rating),
                  minHeight: '4px'
                }}
                aria-label={`${dayName}: ${rating} out of 10`}
              />
              {!compact && (
                <span className="text-xs" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>
                  {dayName.slice(0, 1)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {!compact && stats.trend && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <span 
            className="text-xs px-2 py-1 rounded-full"
            style={{ 
              background: stats.trend === 'improving' ? 'var(--glp-sage-15)' : 
                          stats.trend === 'declining' ? 'var(--glp-rose-15)' : 
                          'var(--glp-sage-10)',
              color: stats.trend === 'improving' ? 'var(--glp-sage-deep)' : 
                     stats.trend === 'declining' ? 'var(--glp-blush)' : 
                     'var(--glp-ink)'
            }}
          >
            {stats.trend === 'improving' ? '↑ Improving' : 
             stats.trend === 'declining' ? '↓ Declining' : 
             '→ Stable'}
          </span>
        </div>
      )}
    </div>
  );
}
