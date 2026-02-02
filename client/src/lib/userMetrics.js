export function calculateStreak(entries = []) {
  if (!entries.length) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.createdAt);
    entryDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0 || diffDays === 1) {
      streak++;
      currentDate = entryDate;
    } else if (diffDays > 1) {
      break;
    }
  }
  
  return streak;
}

export function calculateMoodAverage(entries = []) {
  if (!entries.length) return 0;
  
  const moodEntries = entries.filter(e => typeof e.rating === 'number' || typeof e.mood === 'number');
  if (!moodEntries.length) return 0;
  
  const sum = moodEntries.reduce((acc, e) => acc + (e.rating || e.mood || 0), 0);
  return sum / moodEntries.length;
}

export function calculateMilestones(stats = {}) {
  const { totalEntries = 0, streakDays = 0, moodAverage = 0, entriesByMood = {} } = stats;
  
  const calmEntries = (entriesByMood.calm || 0) + (entriesByMood.peaceful || 0) + (entriesByMood.relaxed || 0);
  const joyEntries = (entriesByMood.joy || 0) + (entriesByMood.happy || 0) + (entriesByMood.grateful || 0);
  
  return [
    { id: "first-entry", achieved: totalEntries >= 1 },
    { id: "7-days", achieved: streakDays >= 7 },
    { id: "30-days", achieved: streakDays >= 30 },
    { id: "100-entries", achieved: totalEntries >= 100 },
    { id: "calm-week", achieved: calmEntries >= 7 },
    { id: "joy-streak", achieved: joyEntries >= 5 && moodAverage >= 7 }
  ];
}

export function getMoodCategory(rating) {
  if (rating >= 8) return { category: "thriving", emoji: "🌟", color: "#8fbf9f" };
  if (rating >= 6) return { category: "good", emoji: "😊", color: "#a8d4a8" };
  if (rating >= 4) return { category: "neutral", emoji: "😐", color: "#d4af37" };
  if (rating >= 2) return { category: "low", emoji: "😔", color: "#e8b4a0" };
  return { category: "struggling", emoji: "💔", color: "#f4c7c3" };
}

export function getMotivationalMessage(stats = {}) {
  const { moodAverage = 0, streakDays = 0, trend = "stable" } = stats;
  
  if (streakDays >= 30) {
    return {
      message: "A month of dedication to your healing. You're building something beautiful.",
      type: "celebration"
    };
  }
  
  if (streakDays >= 7) {
    return {
      message: "A week of showing up for yourself. That takes real courage.",
      type: "encouragement"
    };
  }
  
  if (trend === "improving") {
    return {
      message: "Your journey is showing positive movement. Keep nurturing yourself.",
      type: "progress"
    };
  }
  
  if (moodAverage < 4) {
    return {
      message: "Difficult days are part of healing. You're still here, and that matters.",
      type: "support"
    };
  }
  
  if (moodAverage >= 7) {
    return {
      message: "You're radiating genuine love. Keep shining.",
      type: "joy"
    };
  }
  
  return {
    message: "Every moment of reflection is a gift to your future self.",
    type: "wisdom"
  };
}

export function getLotusGuideTrigger(currentMood, previousMood, stats = {}) {
  const { streakDays = 0, totalEntries = 0 } = stats;
  
  if (totalEntries === 1) {
    return {
      trigger: "first-entry",
      message: "Your healing journey has begun. Welcome, brave soul.",
      action: "celebrate",
      glow: "golden"
    };
  }
  
  if (currentMood <= 3 && (!previousMood || previousMood > 4)) {
    return {
      trigger: "low-mood",
      message: "I notice you're going through something difficult. Remember: this feeling is temporary. Would you like to try a grounding exercise?",
      action: "offer-grounding",
      glow: "soft-rose"
    };
  }
  
  if (currentMood >= 8 && (!previousMood || previousMood < 7)) {
    return {
      trigger: "mood-improvement",
      message: "Beautiful! Your spirit is shining today. What's bringing you joy?",
      action: "celebrate",
      glow: "golden"
    };
  }
  
  if (streakDays === 7) {
    return {
      trigger: "streak-7",
      message: "🌱 One week of showing up for yourself! You've earned the 7-Day badge.",
      action: "award-badge",
      glow: "golden-pulse"
    };
  }
  
  if (streakDays === 30) {
    return {
      trigger: "streak-30",
      message: "🌸 A full month of healing practice! You're truly dedicated to your growth.",
      action: "award-badge",
      glow: "golden-pulse"
    };
  }
  
  return null;
}

export function getWeeklyTrend(entries = []) {
  if (entries.length < 2) return "stable";
  
  const lastWeek = entries.slice(0, 7);
  const previousWeek = entries.slice(7, 14);
  
  if (previousWeek.length === 0) return "stable";
  
  const currentAvg = calculateMoodAverage(lastWeek);
  const previousAvg = calculateMoodAverage(previousWeek);
  
  const diff = currentAvg - previousAvg;
  
  if (diff >= 1) return "improving";
  if (diff <= -1) return "declining";
  return "stable";
}

export function formatUserMetrics(moodEntries = [], journalEntries = []) {
  const allEntries = [...moodEntries, ...journalEntries].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  const streakDays = calculateStreak(allEntries);
  const moodAverage = calculateMoodAverage(moodEntries);
  const totalEntries = allEntries.length;
  const trend = getWeeklyTrend(moodEntries);
  
  const entriesByMood = {};
  moodEntries.forEach(e => {
    const cat = getMoodCategory(e.rating || e.mood || 5).category;
    entriesByMood[cat] = (entriesByMood[cat] || 0) + 1;
  });
  
  const milestones = calculateMilestones({ totalEntries, streakDays, moodAverage, entriesByMood });
  const motivation = getMotivationalMessage({ moodAverage, streakDays, trend });
  
  return {
    streakDays,
    moodAverage,
    totalEntries,
    trend,
    milestones,
    motivation,
    entriesByMood
  };
}
