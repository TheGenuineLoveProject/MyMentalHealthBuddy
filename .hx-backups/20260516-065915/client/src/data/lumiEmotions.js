export const EMOTION_CONFIG = {
  idle:      { image: 'default', animation: 'lumi-breathe',      duration: Infinity },
  welcome:   { image: 'default', animation: 'lumi-wave',         duration: 2400 },
  listen:    { image: 'default', animation: 'lumi-attentive',    duration: Infinity },
  think:     { image: 'thinking', animation: 'lumi-think',      duration: Infinity },
  speak:     { image: 'default', animation: 'lumi-speak',        duration: Infinity },
  celebrate: { image: 'golden', animation: 'lumi-jump',        duration: 1800 },
  calm:      { image: 'blue', animation: 'lumi-float',          duration: Infinity },
  love:      { image: 'coral', animation: 'lumi-pulse-heart',  duration: Infinity },
  insight:   { image: 'default', animation: 'lumi-sparkle',      duration: 6000 },
  rest:      { image: 'lavender', animation: 'lumi-dim',        duration: Infinity },
  sleep:     { image: 'sleeping', animation: 'lumi-snooze',     duration: Infinity },
  focus:     { image: 'blue', animation: 'lumi-steady',         duration: Infinity },
  joy:       { image: 'golden', animation: 'lumi-bounce-fast',  duration: 3000 },
  comfort:   { image: 'coral', animation: 'lumi-soften',        duration: Infinity },
  curiosity: { image: 'thinking', animation: 'lumi-peek',        duration: 4000 },
  empathy:   { image: 'coral', animation: 'lumi-reach',         duration: Infinity },
  proud:     { image: 'golden', animation: 'lumi-stand-tall',   duration: 3000 },
  surprise:  { image: 'default', animation: 'lumi-pop',          duration: 400 },
};
export const IDLE_ROTATION = ['idle', 'curiosity', 'rest'];

/**
 * MILESTONES — keyed by useLumiBehavior's stat-tracking thresholds.
 * Each entry maps to a short celebration emotion that auto-reverts to idle
 * via EMOTION_CONFIG[emotion].duration. Strings are intentionally gentle
 * (trauma-informed, no shame-flavored "streak broken!" framing) and used
 * by future toast/announcer surfaces.
 */
export const MILESTONES = {
  FIRST_CHAT:  { emotion: 'celebrate', message: 'You took the first step.' },
  STREAK_3:    { emotion: 'joy',       message: 'Three days of showing up.' },
  STREAK_7:    { emotion: 'proud',     message: 'A full week. That is real care.' },
  STREAK_30:   { emotion: 'celebrate', message: 'Thirty days. This is becoming who you are.' },
  JOURNAL_10:  { emotion: 'insight',   message: 'Ten journal entries — your story is unfolding.' },
  BREATHING_5: { emotion: 'calm',      message: 'Five breath sessions. Welcome back to your body.' },
};

/**
 * TIME_STATES — wall-clock slots used by useLumiBehavior to pick the
 * arrival greeting + initial emotion. `night` wraps midnight (21..5);
 * the lookup helper handles the wrap explicitly so we don't need to
 * normalize hours here.
 */
export const TIME_STATES = {
  morning: { hourStart: 5,  hourEnd: 11, emotion: 'welcome', greeting: 'Good morning. How is your heart today?' },
  midday:  { hourStart: 11, hourEnd: 17, emotion: 'idle',    greeting: 'Hi again. How is the day treating you?' },
  evening: { hourStart: 17, hourEnd: 21, emotion: 'calm',    greeting: 'Welcome back. Soft landings into the evening.' },
  night:   { hourStart: 21, hourEnd: 5,  emotion: 'rest',    greeting: 'Late evening. Rest is healing too.' },
};
