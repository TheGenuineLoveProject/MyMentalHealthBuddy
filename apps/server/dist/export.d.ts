import type { SelectJournal, SelectMoodEntry } from "../../shared/schema.js";
export declare class DataExporter {
    /**
     * Convert journals to CSV format
     */
    static journalsToCSV(journals: SelectJournal[]): string;
    /**
     * Convert mood entries to CSV format
     */
    static moodsToCSV(moods: SelectMoodEntry[]): string;
    /**
     * Escape CSV values to handle commas, quotes, and newlines
     */
    private static escapeCsv;
    /**
     * Generate mood analytics summary
     */
    static generateMoodAnalytics(moods: SelectMoodEntry[]): {
        totalEntries: number;
        averageIntensity: number;
        moodDistribution: Record<string, number>;
        commonTriggers: string[];
        commonActivities: string[];
        trends: {
            weeklyAverage: number;
            improving: boolean;
        };
    };
    /**
     * Generate personalized insights based on mood patterns
     */
    static generateInsights(moods: SelectMoodEntry[]): string[];
}
//# sourceMappingURL=export.d.ts.map