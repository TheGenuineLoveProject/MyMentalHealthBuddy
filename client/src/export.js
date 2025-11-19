// CSV Export Utilities
export class DataExporter {
    /**
     * Convert journals to CSV format
     */
    static journalsToCSV(journals) {
        if (journals.length === 0) {
            return "id,title,content,mood,tags,isPrivate,createdAt,updatedAt\n";
        }
        const headers = "id,title,content,mood,tags,isPrivate,createdAt,updatedAt\n";
        const rows = journals.map(j => {
            return [
                j.id,
                this.escapeCsv(j.title || ""),
                this.escapeCsv(j.content),
                this.escapeCsv(j.mood || ""),
                this.escapeCsv(j.tags?.join(";") || ""),
                j.isPrivate,
                new Date(j.createdAt).toISOString(),
                new Date(j.updatedAt).toISOString()
            ].join(",");
        }).join("\n");
        return headers + rows;
    }
    /**
     * Convert mood entries to CSV format
     */
    static moodsToCSV(moods) {
        if (moods.length === 0) {
            return "id,mood,intensity,notes,activities,triggers,createdAt\n";
        }
        const headers = "id,mood,intensity,notes,activities,triggers,createdAt\n";
        const rows = moods.map(m => {
            return [
                m.id,
                this.escapeCsv(m.mood),
                m.intensity,
                this.escapeCsv(m.notes || ""),
                this.escapeCsv(m.activities?.join(";") || ""),
                this.escapeCsv(m.triggers?.join(";") || ""),
                new Date(m.createdAt).toISOString()
            ].join(",");
        }).join("\n");
        return headers + rows;
    }
    /**
     * Escape CSV values to handle commas, quotes, and newlines
     */
    static escapeCsv(value) {
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
    /**
     * Generate mood analytics summary
     */
    static generateMoodAnalytics(moods) {
        if (moods.length === 0) {
            return {
                totalEntries: 0,
                averageIntensity: 0,
                moodDistribution: {},
                commonTriggers: [],
                commonActivities: [],
                trends: { weeklyAverage: 0, improving: false }
            };
        }
        // Calculate average intensity
        const totalIntensity = moods.reduce((sum, m) => sum + m.intensity, 0);
        const averageIntensity = parseFloat((totalIntensity / moods.length).toFixed(2));
        // Mood distribution
        const moodDistribution = {};
        moods.forEach(m => {
            moodDistribution[m.mood] = (moodDistribution[m.mood] || 0) + 1;
        });
        // Common triggers
        const triggerCounts = {};
        moods.forEach(m => {
            m.triggers?.forEach((t) => {
                triggerCounts[t] = (triggerCounts[t] || 0) + 1;
            });
        });
        const commonTriggers = Object.entries(triggerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([trigger]) => trigger);
        // Common activities
        const activityCounts = {};
        moods.forEach(m => {
            m.activities?.forEach((a) => {
                activityCounts[a] = (activityCounts[a] || 0) + 1;
            });
        });
        const commonActivities = Object.entries(activityCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([activity]) => activity);
        // Weekly trends
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentMoods = moods.filter(m => new Date(m.createdAt) >= oneWeekAgo);
        const weeklyAverage = recentMoods.length > 0
            ? parseFloat((recentMoods.reduce((sum, m) => sum + m.intensity, 0) / recentMoods.length).toFixed(2))
            : averageIntensity;
        const improving = weeklyAverage >= averageIntensity;
        return {
            totalEntries: moods.length,
            averageIntensity,
            moodDistribution,
            commonTriggers,
            commonActivities,
            trends: {
                weeklyAverage,
                improving
            }
        };
    }
    /**
     * Generate personalized insights based on mood patterns
     */
    static generateInsights(moods) {
        const insights = [];
        if (moods.length === 0) {
            return ["Start tracking your moods to receive personalized insights!"];
        }
        const analytics = this.generateMoodAnalytics(moods);
        // Insight 1: Overall mood
        if (analytics.averageIntensity >= 7) {
            insights.push("✨ You've been feeling generally positive! Keep up the great work.");
        }
        else if (analytics.averageIntensity >= 5) {
            insights.push("💙 Your mood has been balanced. Remember to practice self-care.");
        }
        else {
            insights.push("🌱 You've been experiencing some challenges. Consider reaching out to a mental health professional for support.");
        }
        // Insight 2: Trends
        if (analytics.trends.improving) {
            insights.push(`📈 Your mood is trending upward! Your weekly average (${analytics.trends.weeklyAverage}/10) is better than your overall average.`);
        }
        else {
            insights.push(`💡 Your mood has dipped recently. Consider what might be affecting you and practice extra self-care.`);
        }
        // Insight 3: Triggers
        if (analytics.commonTriggers.length > 0) {
            insights.push(`⚠️ Common triggers you've identified: ${analytics.commonTriggers.slice(0, 3).join(", ")}. Being aware of these can help you prepare.`);
        }
        // Insight 4: Activities
        if (analytics.commonActivities.length > 0) {
            insights.push(`🎯 Activities associated with your moods: ${analytics.commonActivities.slice(0, 3).join(", ")}. Notice which ones help!`);
        }
        // Insight 5: Frequency
        if (moods.length >= 7) {
            insights.push(`🎉 You've logged ${moods.length} mood entries! Consistent tracking helps identify patterns.`);
        }
        else {
            insights.push(`📝 Try tracking your mood daily for better insights. You're off to a great start!`);
        }
        return insights;
    }
}
