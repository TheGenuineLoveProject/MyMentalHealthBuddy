import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useUserStats(userId) {
  const moodsQuery = useQuery({
    queryKey: ["/api/moods"],
    enabled: !!userId
  });

  const journalsQuery = useQuery({
    queryKey: ["/api/journals"],
    enabled: !!userId
  });

  const stats = useMemo(() => {
    const moods = moodsQuery.data || [];
    const journals = journalsQuery.data || [];
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const allEntryDates = new Set([
      ...moods.map(m => new Date(m.createdAt).toDateString()),
      ...journals.map(j => new Date(j.createdAt).toDateString())
    ]);

    const sortedDates = Array.from(allEntryDates)
      .map(d => new Date(d))
      .sort((a, b) => b - a);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    for (const date of sortedDates) {
      if (!lastDate) {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        if (date.toDateString() === today || date.toDateString() === yesterday) {
          tempStreak = 1;
          lastDate = date;
        } else {
          tempStreak = 0;
          lastDate = date;
        }
      } else {
        const dayDiff = Math.round((lastDate - date) / (24 * 60 * 60 * 1000));
        if (dayDiff === 1) {
          tempStreak++;
          lastDate = date;
        } else {
          if (currentStreak === 0) currentStreak = tempStreak;
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          lastDate = date;
        }
      }
    }
    if (currentStreak === 0) currentStreak = tempStreak;
    longestStreak = Math.max(longestStreak, tempStreak);

    const moodsThisWeek = moods.filter(m => new Date(m.createdAt) >= oneWeekAgo);
    const journalsThisWeek = journals.filter(j => new Date(j.createdAt) >= oneWeekAgo);

    const emotionCounts = moods.reduce((acc, mood) => {
      const emotion = mood.emotion || mood.rating || "neutral";
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});

    const mostFrequentEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

    const weeklyEmotionCounts = moodsThisWeek.reduce((acc, mood) => {
      const emotion = mood.emotion || mood.rating || "neutral";
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});

    const weeklyMostFrequent = Object.entries(weeklyEmotionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

    const uniqueDaysActive = new Set([
      ...moods.filter(m => new Date(m.createdAt) >= oneMonthAgo)
        .map(m => new Date(m.createdAt).toDateString()),
      ...journals.filter(j => new Date(j.createdAt) >= oneMonthAgo)
        .map(j => new Date(j.createdAt).toDateString())
    ]).size;

    const averageMoodScore = moods.length > 0
      ? moods.reduce((sum, m) => sum + (m.score || 5), 0) / moods.length
      : 5;

    const weeklyAverageMood = moodsThisWeek.length > 0
      ? moodsThisWeek.reduce((sum, m) => sum + (m.score || 5), 0) / moodsThisWeek.length
      : 5;

    const totalWordCount = journals.reduce((sum, j) => {
      return sum + (j.text?.split(/\s+/).length || 0);
    }, 0);

    let lastGap = 0;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const gap = Math.round((sortedDates[i] - sortedDates[i + 1]) / (24 * 60 * 60 * 1000));
      if (gap > lastGap) lastGap = gap;
    }

    return {
      totalMoods: moods.length,
      totalJournals: journals.length,
      totalEntries: moods.length + journals.length,
      moodsThisWeek: moodsThisWeek.length,
      journalsThisWeek: journalsThisWeek.length,
      entriesThisWeek: moodsThisWeek.length + journalsThisWeek.length,
      currentStreak,
      longestStreak,
      mostFrequentEmotion,
      weeklyMostFrequent,
      daysActiveThisMonth: uniqueDaysActive,
      averageMoodScore: Math.round(averageMoodScore * 10) / 10,
      weeklyAverageMood: Math.round(weeklyAverageMood * 10) / 10,
      totalWordCount,
      longestGap: lastGap,
      emotionBreakdown: emotionCounts,
      isLoading: moodsQuery.isLoading || journalsQuery.isLoading,
      error: moodsQuery.error || journalsQuery.error
    };
  }, [moodsQuery.data, journalsQuery.data]);

  return stats;
}

export default useUserStats;
