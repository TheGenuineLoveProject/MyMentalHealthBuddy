const insights = [
  "Most clarity comes not from solving more problems, but from choosing which ones no longer deserve attention.",
  "A calm nervous system often makes better decisions than a brilliant mind under pressure.",
  "Progress is easier to sustain when it is defined by direction, not speed.",
  "You don’t need certainty to act — only enough information to take the next honest step.",
  "Energy follows permission. If you never allow rest, insight has nowhere to land.",
];

export function getTodaysInsight(): string {
  const day = new Date().getDate();
  return insights[day % insights.length];
}