/**
 * WeeklyRecap.jsx
 * "Your Week in Genuine Love" - Weekly progress summary
 * 
 * Features:
 * - Gentle, non-pressuring progress language
 * - Shareable card format
 * - No streak shame / skip-friendly
 * - Celebrates consistency over intensity
 */

import { useState } from 'react';
import { Calendar, Heart, Sparkles, TrendingUp, BookOpen, Share2 } from 'lucide-react';
import ShareableReflectionCard from './ShareableReflectionCard';

const WEEK_SUMMARY_COPY = {
  intro: [
    "Here's a gentle look at your week.",
    "A moment to notice what you've been exploring.",
    "Your week, reflected back with kindness.",
    "A soft summary of your practice."
  ],
  noActivity: [
    "This week was quieter — and that's okay.",
    "Some weeks are for rest. This was one of those.",
    "No pressure. You're welcome back anytime.",
    "Taking a break is part of the process."
  ],
  someActivity: [
    "You showed up this week. That matters.",
    "Small moments of presence add up.",
    "You made time for yourself.",
    "Consistency over intensity — you're doing it."
  ],
  highActivity: [
    "You've been showing up for yourself.",
    "This week held some meaningful moments.",
    "Your practice is building something lasting.",
    "Steady presence creates lasting change."
  ]
};

const PILLAR_ICONS = {
  calm: '🌿',
  clarity: '✨',
  confidence: '🧭',
  connection: '💚',
  growth: '📈',
  purpose: '⭐'
};

function getActivityLevel(stats) {
  const total = (stats.journalEntries || 0) + (stats.moodCheckins || 0) + (stats.toolsUsed || 0);
  if (total === 0) return 'noActivity';
  if (total <= 3) return 'someActivity';
  return 'highActivity';
}

function getRandomCopy(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function WeeklyRecap({
  weekStartDate = new Date(),
  stats = {},
  topPillars = [],
  favoriteReflection = null,
  onShare = null,
  className = ''
}) {
  const [showShareCard, setShowShareCard] = useState(false);
  
  const activityLevel = getActivityLevel(stats);
  const introCopy = getRandomCopy(WEEK_SUMMARY_COPY.intro);
  const activityCopy = getRandomCopy(WEEK_SUMMARY_COPY[activityLevel]);
  
  const weekLabel = weekStartDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  const statItems = [
    { 
      icon: BookOpen, 
      label: 'Journal entries', 
      value: stats.journalEntries || 0,
      show: true
    },
    { 
      icon: Heart, 
      label: 'Mood check-ins', 
      value: stats.moodCheckins || 0,
      show: true
    },
    { 
      icon: Sparkles, 
      label: 'Tools explored', 
      value: stats.toolsUsed || 0,
      show: true
    }
  ].filter(item => item.show);

  return (
    <div className={`bg-[var(--bg-secondary)] rounded-2xl p-6 ${className}`} data-testid="weekly-recap">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Your Week in Genuine Love
        </h2>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-1" data-testid="text-week-label">
        Week of {weekLabel}
      </p>
      <p className="text-sm text-[var(--text-tertiary)] mb-6" data-testid="text-intro-copy">
        {introCopy}
      </p>

      {activityLevel !== 'noActivity' ? (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {statItems.map((item, index) => (
              <div 
                key={item.label}
                className="text-center p-3 bg-[var(--bg-primary)] rounded-xl"
                data-testid={`stat-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon 
                  className="w-5 h-5 mx-auto mb-2 text-[var(--primary)]" 
                  aria-hidden="true" 
                />
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {item.value}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {topPillars.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                Areas you explored:
              </p>
              <div className="flex flex-wrap gap-2">
                {topPillars.map((pillar) => (
                  <span
                    key={pillar.id}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-[var(--primary-soft)] text-[var(--primary)] rounded-full"
                    data-testid={`pillar-tag-${pillar.id}`}
                  >
                    {PILLAR_ICONS[pillar.id] || '💚'} {pillar.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}

      <div className="p-4 bg-[var(--bg-primary)] rounded-xl mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            This week
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]" data-testid="text-activity-summary">
          {activityCopy}
        </p>
      </div>

      {favoriteReflection && (
        <div className="mb-6">
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            A moment worth remembering:
          </p>
          <blockquote 
            className="text-sm italic text-[var(--text-primary)] pl-4 border-l-2 border-[var(--primary)]"
            data-testid="text-favorite-reflection"
          >
            "{favoriteReflection}"
          </blockquote>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowShareCard(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-full text-sm font-medium hover:opacity-90 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]"
          data-testid="button-share-recap"
          aria-label="Share your weekly recap"
        >
          <Share2 className="w-4 h-4" aria-hidden="true" />
          Share
        </button>
      </div>

      <p className="text-xs text-[var(--text-tertiary)] mt-4">
        No pressure to share. This is yours to keep or let go.
      </p>

      {showShareCard && favoriteReflection && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-dialog-title"
        >
          <div className="bg-[var(--bg-primary)] rounded-2xl p-6 max-w-md w-full">
            <h3 
              id="share-dialog-title"
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
            >
              Share your reflection
            </h3>
            <ShareableReflectionCard 
              reflection={favoriteReflection}
              category="Weekly Reflection"
              onShare={() => {
                onShare?.();
                setShowShareCard(false);
              }}
            />
            <button
              onClick={() => setShowShareCard(false)}
              className="w-full mt-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              data-testid="button-close-share"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function WeeklyRecapSkeleton() {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 animate-pulse">
      <div className="h-6 w-48 bg-[var(--bg-tertiary)] rounded mb-4" />
      <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded mb-6" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[var(--bg-tertiary)] rounded-xl" />
        ))}
      </div>
      <div className="h-20 bg-[var(--bg-tertiary)] rounded-xl" />
    </div>
  );
}
