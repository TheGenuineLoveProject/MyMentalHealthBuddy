/**
 * @fileoverview Wisdom, Affirmations & Healing Content
 * @module data/wisdom
 * Emotionally intelligent content for the entire platform.
 * No negation. Directional language only. Grade 6 reading level.
 *
 * Source: HX-OS vNEXT language governance prompt (attached 2026-05-14).
 * Shipped data-only per user direction — no router/page/CSS changes.
 * Crisis routing per Primary Law: any surface that consumes this content
 * must preserve /crisis + 988 + Crisis Text 741741.
 */

// ─── Daily Affirmations ───
export const AFFIRMATIONS = [
  "You are enough, exactly as you are right now.",
  "Your feelings are valid. Every single one of them.",
  "You have made it through every hard day so far. That matters.",
  "Progress is not linear. Growth happens in its own time.",
  "You are worthy of care, including your own.",
  "Today, you get to choose what feels right for you.",
  "Your presence in this world is meaningful.",
  "It is okay to rest. Rest is part of moving forward.",
  "You are more than what you achieve. You are enough just being.",
  "Gentleness toward yourself is a strength, not a weakness.",
  "Each breath you take is proof that you are still here, still trying.",
  "You do not need to have everything figured out today.",
  "Your story is still being written, and you hold the pen.",
  "Choosing yourself is always the right choice.",
  "You deserve the same kindness you offer to others.",
  "Small steps count. Every step forward matters.",
  "Your worth is not measured by productivity.",
  "It takes courage to check in with yourself. That courage is in you.",
  "Healing is not a destination. It is a direction you choose.",
  "You are allowed to change, to grow, to become more yourself.",
  "The way you speak to yourself matters. Choose words that build you up.",
  "You are not behind. You are on your own path, in your own time.",
  "Your emotions are messengers, not enemies. Listen to what they share.",
  "Today, give yourself permission to be human.",
  "The love you give yourself sets the standard for all other love.",
  "You are building something beautiful, even on the messy days.",
  "Trust the process, even when you cannot see the full picture.",
  "Your mind is a garden. You get to choose what grows there.",
  "Being gentle with yourself is a revolutionary act.",
  "You carry wisdom inside you that you have not even discovered yet.",
] as const;

export function getDailyAffirmation(): string {
  const index = new Date().getDate() % AFFIRMATIONS.length;
  return AFFIRMATIONS[index];
}

export function getRandomAffirmation(): string {
  return AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
}

// ─── Daily Wisdom Quotes ───
export const WISDOM_QUOTES = [
  { text: "The curious paradox is that when I accept myself just as I am, then I can change.", author: "Carl Rogers" },
  { text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha" },
  { text: "Be gentle with yourself. You are a child of the universe, no less than the trees and the stars.", author: "Max Ehrmann" },
  { text: "Self-compassion is simply giving the same kindness to ourselves that we would give to others.", author: "Christopher Germer" },
  { text: "The only journey is the journey within.", author: "Rainer Maria Rilke" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "You are the sky. Everything else is just the weather.", author: "Pema Chodron" },
  { text: "The wound is the place where the light enters you.", author: "Rumi" },
  { text: "To love oneself is the beginning of a lifelong romance.", author: "Oscar Wilde" },
  { text: "Nothing is impossible. The word itself says I'm possible.", author: "Audrey Hepburn" },
  { text: "Your present circumstances don't determine where you go. They merely determine where you start.", author: "Nido Qubein" },
  { text: "Healing takes courage, and we all have courage, even if we have to dig a little to find it.", author: "Tori Amos" },
] as const;

export function getDailyQuote(): (typeof WISDOM_QUOTES)[number] {
  const index = new Date().getDate() % WISDOM_QUOTES.length;
  return WISDOM_QUOTES[index];
}

// ─── Self-Check-In Prompts ───
export const CHECKIN_PROMPTS = [
  "What is one thing that felt good today, even if it was small?",
  "Where in your body are you holding tension right now?",
  "What emotion has been visiting you most often lately?",
  "What do you need more of in your life right now?",
  "What is something you are grateful for in this moment?",
  "If your inner child could speak, what would they say?",
  "What is one kind thing you can do for yourself today?",
  "When did you last feel truly at peace? What was different then?",
  "What are you carrying that you might set down for a while?",
  "What does your heart need to hear right now?",
  "What is one boundary that would protect your energy?",
  "When you look in the mirror, what do you want to see?",
  "What is a fear that has been quietly living in you?",
  "What brings you back to yourself when you feel lost?",
  "What would you tell a friend who feels exactly how you feel?",
  "What part of yourself have you been neglecting?",
  "What does rest look like for you, truly?",
  "What are you proud of yourself for, even if no one else knows?",
  "What truth have you been avoiding, and what would happen if you faced it gently?",
  "If you trusted yourself completely, what would you do differently?",
] as const;

export function getDailyPrompt(): string {
  const index = new Date().getDate() % CHECKIN_PROMPTS.length;
  return CHECKIN_PROMPTS[index];
}

// ─── Grounding Exercises (5-4-3-2-1) ───
export const GROUNDING_STEPS = [
  { number: 5, sense: "See", prompt: "Name 5 things you can see around you right now.", examples: ["A plant", "The sky", "Your hand", "A color you love", "Light through a window"] },
  { number: 4, sense: "Touch", prompt: "Name 4 things you can physically feel right now.", examples: ["Your feet on the floor", "Fabric against your skin", "The air on your face", "A texture nearby"] },
  { number: 3, sense: "Hear", prompt: "Name 3 sounds you can hear right now.", examples: ["Your breathing", "A distant sound", "Silence between sounds"] },
  { number: 2, sense: "Smell", prompt: "Name 2 scents you notice right now.", examples: ["Something familiar", "The air around you"] },
  { number: 1, sense: "Taste", prompt: "Name 1 taste in your mouth right now.", examples: ["A lingering flavor", "The freshness of air"] },
] as const;

// ─── Emotion Wheel Data ───
export const EMOTION_WHEEL = {
  core: ["Joy", "Sadness", "Fear", "Anger", "Disgust", "Surprise"],
  nuanced: {
    Joy: ["Happy", "Content", "Grateful", "Excited", "Proud", "Loved", "Hopeful", "Peaceful"],
    Sadness: ["Lonely", "Disappointed", "Hurt", "Grieving", "Empty", "Tired", "Overwhelmed", "Ashamed"],
    Fear: ["Anxious", "Worried", "Nervous", "Scared", "Panicked", "Insecure", "Uncertain", "Vulnerable"],
    Anger: ["Frustrated", "Annoyed", "Irritated", "Resentful", "Hostile", "Bitter", "Defensive", "Jealous"],
    Disgust: ["Disapproving", "Disappointed", "Repulsed", "Ashamed", "Guilty", "Embarrassed", "Judgmental"],
    Surprise: ["Startled", "Confused", "Amazed", "Curious", "Awe", "Disoriented"],
  },
} as const;

// ─── Breathing Guidance Text ───
export const BREATHING_GUIDANCE = {
  inhale: ["Breathe in slowly through your nose...", "Fill your belly with air, let it expand...", "Imagine breathing in calm, warm light...", "Let each inhale bring you back to now..."],
  hold: ["Pause gently...", "Let the calm settle...", "Rest in this moment...", "Just be here..."],
  exhale: ["Breathe out slowly through your mouth...", "Release what you do not need...", "Let your shoulders drop with the exhale...", "With each exhale, soften a little more..."],
  rest: ["Rest...", "Notice how you feel...", "A gentle pause...", "Before the next breath begins..."],
} as const;

// ─── Journal Guided Prompts ───
export const JOURNAL_PROMPTS = [
  { title: "Morning Intention", prompt: "What is one gentle intention you can set for today? It does not need to be big.", followUp: "How will you know today was a good day, even in a small way?" },
  { title: "Gratitude Practice", prompt: "What are three things you feel grateful for right now? They can be tiny.", followUp: "How does gratitude feel in your body when you focus on it?" },
  { title: "Self-Compassion Letter", prompt: "Write a short letter to yourself with the same kindness you would offer a dear friend.", followUp: "What would that friend say to comfort you right now?" },
  { title: "Emotion Exploration", prompt: "What emotion has been most present for you lately? Describe it like a weather pattern.", followUp: "If this emotion could speak, what would it say it needs?" },
  { title: "Letting Go", prompt: "What is one thing you are holding onto that you might gently set down?", followUp: "What would it feel like to release even a small part of it?" },
  { title: "Inner Wisdom", prompt: "Imagine your future self, five years from now, looking back at today. What would they say?", followUp: "What strength do they see in you that you might not see yet?" },
  { title: "Body Check-In", prompt: "Close your eyes and scan your body from head to toe. What do you notice?", followUp: "Where does your body feel safe? Where does it ask for attention?" },
  { title: "Values Reflection", prompt: "What matters most to you in life? List your top 5 values.", followUp: "Which value have you been living most? Which needs more attention?" },
] as const;

// ─── Coping Strategies ───
export const COPING_STRATEGIES = [
  { title: "Box Breathing", description: "Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 5 times.", duration: "2 min" },
  { title: "5-4-3-2-1 Grounding", description: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.", duration: "3 min" },
  { title: "Cold Water Reset", description: "Splash cold water on your face or hold an ice cube. This activates the dive reflex.", duration: "1 min" },
  { title: "Walking Meditation", description: "Walk slowly, feeling each step. Notice the shift in weight, the ground beneath you.", duration: "5 min" },
  { title: "Progressive Relaxation", description: "Tense and release each muscle group, starting from your toes up to your forehead.", duration: "10 min" },
  { title: "Self-Hug", description: "Cross your arms over your chest and gently squeeze. Hold for 30 seconds.", duration: "1 min" },
  { title: "Sound Bath", description: "Close your eyes and listen to ambient nature sounds or soft instrumental music.", duration: "5 min" },
  { title: "Sunlight Exposure", description: "Step outside and feel sunlight on your skin for a few minutes. Notice the warmth.", duration: "5 min" },
] as const;

// ─── Weekly Theme ───
export const WEEKLY_THEMES = [
  { week: 1, theme: "Self-Awareness", focus: "Noticing your thoughts and feelings without judgment" },
  { week: 2, theme: "Self-Compassion", focus: "Speaking to yourself with the kindness you give others" },
  { week: 3, theme: "Emotional Intelligence", focus: "Understanding what your emotions are trying to tell you" },
  { week: 4, theme: "Authenticity", focus: "Showing up as your genuine self, without apology" },
  { week: 5, theme: "Resilience", focus: "Building the strength to bounce back from hard moments" },
] as const;

export function getWeeklyTheme() {
  const week = (new Date().getDate() % 5) + 1;
  return WEEKLY_THEMES.find((t) => t.week === week) ?? WEEKLY_THEMES[0];
}
