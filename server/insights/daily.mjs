export function getDailyInsight() {
  const insights = [
    "Clarity comes after permission to feel.",
    "You are not behind. You are integrating.",
    "Small honesty today prevents big pain tomorrow.",
    "Rest is a strategy, not a failure.",
    "Consistency beats intensity."
  ];

  return insights[Math.floor(Math.random() * insights.length)];
}
