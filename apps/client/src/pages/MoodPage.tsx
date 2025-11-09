import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import type { SelectMoodEntry } from "@shared/schema";
import { Download, TrendingUp } from "lucide-react";
import { AtmosphericBackground } from "@/components/atmospheric";

const MOODS = ["Happy", "Sad", "Anxious", "Calm", "Angry", "Stressed", "Content"];

export function MoodPage() {
  const [mood, setMood] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState("");

  const { data: moods = [], isLoading } = useQuery<SelectMoodEntry[]>({
    queryKey: ["/api/moods"],
  });

  const { data: analytics } = useQuery<{
    totalEntries: number;
    averageIntensity: number;
    moodDistribution: Record<string, number>;
    commonTriggers: string[];
    commonActivities: string[];
    trends: { weeklyAverage: number; improving: boolean };
    insights: string[];
  }>({
    queryKey: ["/api/moods/analytics"]
  });

  const handleExport = async (format: "csv" | "json") => {
    try {
      const response = await fetch(`/api/moods/export?format=${format}`, {
        headers: { "x-user-id": "demo-user" }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `moods-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const createMoodMutation = useMutation({
    mutationFn: async (data: { mood: string; intensity: number; notes?: string }) => {
      return apiRequest("/api/moods", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "x-user-id": "demo-user" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/moods/analytics"] });
      setMood("");
      setIntensity(5);
      setNotes("");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return;

    createMoodMutation.mutate({
      mood,
      intensity,
      notes: notes || undefined
    });
  };

  return (
    <>
      {/* Atmospheric Background for Focus and Clarity */}
      <AtmosphericBackground scene="focus" intensity="subtle" showParticles={false} />
      
      <div className="max-w-4xl mx-auto p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mood Tracker</h1>
        {moods.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => handleExport("csv")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              data-testid="button-export-csv"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => handleExport("json")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              data-testid="button-export-json"
            >
              <Download size={16} />
              Export JSON
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mood</label>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`px-4 py-2 rounded-lg border ${
                    mood === m
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                  data-testid={`button-mood-${m.toLowerCase()}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Intensity: {intensity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full"
              data-testid="input-intensity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's contributing to this mood?"
              data-testid="input-mood-notes"
            />
          </div>

          <button
            type="submit"
            disabled={!mood || createMoodMutation.isPending}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            data-testid="button-save-mood"
          >
            {createMoodMutation.isPending ? "Saving..." : "Save Mood Entry"}
          </button>
        </form>
      </div>

      {analytics && analytics.insights.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600" />
            <h2 className="text-xl font-semibold">Your Insights</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.totalEntries}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Average Intensity</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.averageIntensity}/10</p>
            </div>
          </div>
          <div className="space-y-2">
            {analytics.insights.map((insight, i) => (
              <div key={i} className="bg-white rounded-lg p-3 text-sm">
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : moods.length === 0 ? (
          <p className="text-gray-500">No mood entries yet. Start tracking your mood above!</p>
        ) : (
          <div className="space-y-3">
            {moods.map((entry) => (
              <div
                key={entry.id}
                className="border-l-4 border-blue-500 pl-4 py-2"
                data-testid={`mood-entry-${entry.id}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{entry.mood}</p>
                    <p className="text-sm text-gray-600">Intensity: {entry.intensity}/10</p>
                    {entry.notes && <p className="text-sm mt-1">{entry.notes}</p>}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
