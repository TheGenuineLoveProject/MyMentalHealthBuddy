import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLumiEmotion } from "./useLumiEmotion";
import { useLumiTheme } from "./useLumiTheme";
import { TIME_STATES, MILESTONES } from "../data/lumiEmotions";

const STATS_STORAGE_KEY = "lumi-stats-v1";
const TYPING_DEBOUNCE_MS = 1000;
const SLEEP_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

const DEFAULT_STATS = {
  totalChats: 0,
  breathingSessions: 0,
  journalEntries: 0,
  consecutiveDays: 0,
  lastActiveISO: null,
};

function isNightHour(hour) {
  // TIME_STATES.night spans 21..5 (wraps midnight).
  return hour >= 21 || hour < 5;
}

function timeStateForHour(hour) {
  for (const [key, cfg] of Object.entries(TIME_STATES)) {
    const { hourStart, hourEnd } = cfg;
    if (hourStart < hourEnd) {
      if (hour >= hourStart && hour < hourEnd) return { key, ...cfg };
    } else {
      // Wrap-around (e.g. night 21..5)
      if (hour >= hourStart || hour < hourEnd) return { key, ...cfg };
    }
  }
  return { key: "midday", ...TIME_STATES.midday };
}

function readStats() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return { ...DEFAULT_STATS };
  }
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

function writeStats(stats) {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}

function rollConsecutiveDays(stats) {
  // Bump consecutive-day counter if the last active day was yesterday;
  // reset to 1 if it's been longer; leave alone if same calendar day.
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  if (stats.lastActiveISO === todayKey) return stats;

  let nextStreak = 1;
  if (stats.lastActiveISO) {
    const last = new Date(stats.lastActiveISO);
    const diffDays = Math.round(
      (today.setHours(0, 0, 0, 0) - last.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) nextStreak = (stats.consecutiveDays || 0) + 1;
  }
  return { ...stats, consecutiveDays: nextStreak, lastActiveISO: todayKey };
}

/**
 * Threshold checks — return the milestone key (or null) that JUST got
 * crossed by this update. We don't fire milestones retroactively for
 * counts that are already past the threshold (only on the exact crossing).
 */
function detectMilestone(prev, next) {
  if (prev.totalChats < 1 && next.totalChats >= 1) return "FIRST_CHAT";
  if (prev.consecutiveDays < 3 && next.consecutiveDays >= 3) return "STREAK_3";
  if (prev.consecutiveDays < 7 && next.consecutiveDays >= 7) return "STREAK_7";
  if (prev.consecutiveDays < 30 && next.consecutiveDays >= 30) return "STREAK_30";
  if (prev.journalEntries < 10 && next.journalEntries >= 10) return "JOURNAL_10";
  if (prev.breathingSessions < 5 && next.breathingSessions >= 5) return "BREATHING_5";
  return null;
}

/**
 * useLumiBehavior
 * ----------------
 * Composes useLumiEmotion + useLumiTheme into a single companion behavior:
 *
 *   - On mount: reads the wall-clock hour and triggers the matching greeting
 *     (welcome / idle / calm / rest) — only if the user hasn't already been
 *     interacting (i.e. the emotion hook is still in its initial idle).
 *   - actions.recordChat(), recordBreathingSession(), recordJournalEntry():
 *     bump localStorage stats, check for milestone crossings, fire the
 *     associated celebration emotion.
 *   - onUserTyping(): nudges Lumi to 'listen' immediately, then debounces
 *     1s of typing-stopped before letting the emotion drift back.
 *   - Sleep mode: if the user has been idle for 5+ minutes during night
 *     hours (21..5), Lumi enters 'sleep'. Any explicit interaction wakes her.
 *
 * Return value matches the spec:
 *   { behavior, emotion, theme, greeting, isSleeping, stats, actions }
 */
export function useLumiBehavior() {
  const lumi = useLumiEmotion("idle");
  const { theme, themeId, setThemeId } = useLumiTheme();

  const [stats, setStats] = useState(() => readStats());
  const [isSleeping, setIsSleeping] = useState(false);
  const [greeting, setGreeting] = useState(null);

  const lastInteractionRef = useRef(Date.now());
  const sleepTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const greetingAppliedRef = useRef(false);

  // ── Greeting on mount ───────────────────────────────────────────────────
  useEffect(() => {
    if (greetingAppliedRef.current) return;
    greetingAppliedRef.current = true;
    const hour = new Date().getHours();
    const ts = timeStateForHour(hour);
    setGreeting({ text: ts.greeting, key: ts.key });
    // Trigger the time-state emotion (welcome / idle / calm / rest).
    lumi.setEmotion(ts.emotion);
    // Also bump the streak / lastActive bookkeeping on mount.
    setStats((prev) => {
      const rolled = rollConsecutiveDays(prev);
      if (rolled !== prev) writeStats(rolled);
      return rolled;
    });
  }, []);

  // ── Sleep watcher ──────────────────────────────────────────────────────
  // Polls every 30s. If the user has been idle (no interaction) for 5+ min
  // AND it's currently night hours, slip into 'sleep'. Wake on interaction.
  useEffect(() => {
    sleepTimerRef.current = setInterval(() => {
      const idleFor = Date.now() - lastInteractionRef.current;
      const hour = new Date().getHours();
      if (idleFor >= SLEEP_THRESHOLD_MS && isNightHour(hour)) {
        if (!isSleeping) {
          setIsSleeping(true);
          lumi.setEmotion("sleep");
        }
      } else if (isSleeping) {
        setIsSleeping(false);
      }
    }, 30000);
    return () => {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    };
  }, [isSleeping, lumi]);

  // ── Cleanup typing timer on unmount ────────────────────────────────────
  useEffect(() => () => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
  }, []);

  const noteInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
    if (isSleeping) {
      setIsSleeping(false);
      lumi.setEmotion("welcome");
    }
  }, [isSleeping, lumi]);

  // ── Typing detector ────────────────────────────────────────────────────
  const onUserTyping = useCallback(() => {
    noteInteraction();
    lumi.onUserTyping();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      typingTimerRef.current = null;
      // Drift back to idle once typing stops for 1s — only if Lumi is still
      // in the 'listen' state we set above (don't yank her out of celebrate).
      if (lumi.emotion === "listen") lumi.setEmotion("idle");
    }, TYPING_DEBOUNCE_MS);
  }, [lumi, noteInteraction]);

  // ── Stat-bumping actions + milestone check ─────────────────────────────
  const bumpStat = useCallback(
    (field, by = 1) => {
      noteInteraction();
      setStats((prev) => {
        const next = { ...prev, [field]: (prev[field] || 0) + by };
        const rolled = rollConsecutiveDays(next);
        const milestone = detectMilestone(prev, rolled);
        writeStats(rolled);
        if (milestone) {
          lumi.onMilestone(milestone);
        }
        return rolled;
      });
    },
    [lumi, noteInteraction]
  );

  const actions = useMemo(
    () => ({
      recordChat: () => bumpStat("totalChats"),
      recordBreathingSession: () => bumpStat("breathingSessions"),
      recordJournalEntry: () => bumpStat("journalEntries"),
      // Pass-throughs to the underlying emotion hook.
      setEmotion: lumi.setEmotion,
      onAIProcessing: () => {
        noteInteraction();
        lumi.onAIProcessing();
      },
      onAIResponding: () => {
        noteInteraction();
        lumi.onAIResponding();
      },
      onUserTyping,
      onMilestone: (key) => {
        noteInteraction();
        lumi.onMilestone(key);
      },
      // Theme controls bubbled up so consumers don't have to call useLumiTheme separately.
      setThemeId,
    }),
    [bumpStat, lumi, noteInteraction, onUserTyping, setThemeId]
  );

  const behavior = useMemo(
    () => ({
      animationClass: lumi.animationClass,
      imageVariant: lumi.imageVariant,
      isAnimating: lumi.isAnimating,
      getImageSrc: lumi.getImageSrc,
      themeId,
      MILESTONES,
    }),
    [
      lumi.animationClass,
      lumi.imageVariant,
      lumi.isAnimating,
      lumi.getImageSrc,
      themeId,
    ]
  );

  return {
    behavior,
    emotion: lumi.emotion,
    theme,
    greeting,
    isSleeping,
    stats,
    actions,
  };
}

export default useLumiBehavior;
