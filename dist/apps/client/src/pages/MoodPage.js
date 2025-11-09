import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Download, TrendingUp } from "lucide-react";
import { AtmosphericBackground } from "@/components/atmospheric";
import { SkeletonContentList } from "@/components/LoadingStates";
const MOODS = ["Happy", "Sad", "Anxious", "Calm", "Angry", "Stressed", "Content"];
export function MoodPage() {
    const [mood, setMood] = useState("");
    const [intensity, setIntensity] = useState(5);
    const [notes, setNotes] = useState("");
    const { data: moods = [], isLoading } = useQuery({
        queryKey: ["/api/moods"],
    });
    const { data: analytics } = useQuery({
        queryKey: ["/api/moods/analytics"]
    });
    const handleExport = async (format) => {
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
        }
        catch (error) {
            console.error("Export failed:", error);
        }
    };
    const createMoodMutation = useMutation({
        mutationFn: async (data) => {
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
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!mood)
            return;
        createMoodMutation.mutate({
            mood,
            intensity,
            notes: notes || undefined
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(AtmosphericBackground, { scene: "focus", intensity: "subtle", showParticles: false }), _jsxs("div", { className: "max-w-4xl mx-auto p-6 relative z-10", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Mood Tracker" }), moods.length > 0 && (_jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => handleExport("csv"), className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2", "data-testid": "button-export-csv", children: [_jsx(Download, { size: 16 }), "Export CSV"] }), _jsxs("button", { onClick: () => handleExport("json"), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2", "data-testid": "button-export-json", children: [_jsx(Download, { size: 16 }), "Export JSON"] })] }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "How are you feeling?" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Mood" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: MOODS.map((m) => (_jsx("button", { type: "button", onClick: () => setMood(m), className: `px-4 py-2 rounded-lg border ${mood === m
                                                        ? "bg-blue-500 text-white border-blue-600"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`, "data-testid": `button-mood-${m.toLowerCase()}`, children: m }, m))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: ["Intensity: ", intensity, "/10"] }), _jsx("input", { type: "range", min: "1", max: "10", value: intensity, onChange: (e) => setIntensity(Number(e.target.value)), className: "w-full", "data-testid": "input-intensity" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Notes (optional)" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "What's contributing to this mood?", "data-testid": "input-mood-notes" })] }), _jsx("button", { type: "submit", disabled: !mood || createMoodMutation.isPending, className: "w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300", "data-testid": "button-save-mood", children: createMoodMutation.isPending ? "Saving..." : "Save Mood Entry" })] })] }), analytics && analytics.insights.length > 0 && (_jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 mb-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(TrendingUp, { className: "text-blue-600" }), _jsx("h2", { className: "text-xl font-semibold", children: "Your Insights" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Entries" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: analytics.totalEntries })] }), _jsxs("div", { className: "bg-white rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Average Intensity" }), _jsxs("p", { className: "text-2xl font-bold text-purple-600", children: [analytics.averageIntensity, "/10"] })] })] }), _jsx("div", { className: "space-y-2", children: analytics.insights.map((insight, i) => (_jsx("div", { className: "bg-white rounded-lg p-3 text-sm", children: insight }, i))) })] })), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Recent Entries" }), isLoading ? (_jsx(SkeletonContentList, { count: 3 })) : moods.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No mood entries yet. Start tracking your mood above!" })) : (_jsx("div", { className: "space-y-3", children: moods.map((entry) => (_jsx("div", { className: "border-l-4 border-blue-500 pl-4 py-2", "data-testid": `mood-entry-${entry.id}`, children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: entry.mood }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Intensity: ", entry.intensity, "/10"] }), entry.notes && _jsx("p", { className: "text-sm mt-1", children: entry.notes })] }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(entry.createdAt).toLocaleDateString() })] }) }, entry.id))) }))] })] })] }));
}
