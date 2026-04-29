export const EMOTION_CONFIG = {
  idle:      { image: 'default', animation: 'lumi-breathe',      duration: Infinity, label: 'Lumi is breathing calmly' },
  welcome:   { image: 'default', animation: 'lumi-wave',         duration: 2400,     label: 'Lumi is waving hello' },
  listen:    { image: 'default', animation: 'lumi-attentive',    duration: Infinity, label: 'Lumi is listening attentively' },
  think:     { image: 'thinking', animation: 'lumi-think',      duration: Infinity, label: 'Lumi is thinking' },
  speak:     { image: 'default', animation: 'lumi-speak',        duration: Infinity, label: 'Lumi is speaking' },
  celebrate: { image: 'golden', animation: 'lumi-jump',        duration: 1800,     label: 'Lumi is celebrating' },
  calm:      { image: 'blue', animation: 'lumi-float',          duration: Infinity, label: 'Lumi is calm' },
  love:      { image: 'coral', animation: 'lumi-pulse-heart',  duration: Infinity, label: 'Lumi is radiating warmth' },
  insight:   { image: 'default', animation: 'lumi-sparkle',      duration: 6000,     label: 'Lumi is sharing insight' },
  rest:      { image: 'lavender', animation: 'lumi-dim',        duration: Infinity, label: 'Lumi is resting' },
  sleep:     { image: 'sleeping', animation: 'lumi-snooze',     duration: Infinity, label: 'Lumi is sleeping' },
  focus:     { image: 'blue', animation: 'lumi-steady',         duration: Infinity, label: 'Lumi is focused' },
  joy:       { image: 'golden', animation: 'lumi-bounce-fast',  duration: 3000,     label: 'Lumi is joyful' },
  comfort:   { image: 'coral', animation: 'lumi-soften',        duration: Infinity, label: 'Lumi is offering comfort' },
  curiosity: { image: 'thinking', animation: 'lumi-peek',        duration: 4000,     label: 'Lumi is curious' },
  empathy:   { image: 'coral', animation: 'lumi-reach',         duration: Infinity, label: 'Lumi is reaching out with empathy' },
  proud:     { image: 'golden', animation: 'lumi-stand-tall',   duration: 3000,     label: 'Lumi is proud of you' },
  surprise:  { image: 'default', animation: 'lumi-pop',          duration: 400,      label: 'Lumi is surprised' },
};

export const IDLE_ROTATION = ['idle', 'curiosity', 'rest'];

export const TIME_STATES = {
  morning: { hourStart: 5, hourEnd: 11, emotion: 'welcome', greeting: 'Good morning' },
  midday:  { hourStart: 11, hourEnd: 17, emotion: 'idle',    greeting: 'Hello' },
  evening: { hourStart: 17, hourEnd: 21, emotion: 'calm',   greeting: 'Good evening' },
  night:   { hourStart: 21, hourEnd: 5,  emotion: 'rest',   greeting: 'Rest well' },
};

export const MILESTONES = {
  FIRST_CHAT:  { emotion: 'celebrate', message: 'Your first conversation!' },
  STREAK_3:    { emotion: 'proud',     message: '3-day streak!' },
  STREAK_7:    { emotion: 'celebrate', message: 'One week strong!' },
  STREAK_30:   { emotion: 'joy',       message: '30 days of growth!' },
  JOURNAL_10:  { emotion: 'insight',   message: '10 reflections written' },
  BREATHING_5: { emotion: 'calm',      message: '5 breathing sessions' },
};
