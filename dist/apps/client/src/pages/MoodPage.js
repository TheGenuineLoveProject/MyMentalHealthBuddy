import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
const MOODS = ["Happy", "Sad", "Anxious", "Calm", "Angry", "Stressed", "Content"];
export function MoodPage() {
    const [mood, setMood] = useState("");
    const [intensity, setIntensity] = useState(5);
    const [notes, setNotes] = useState("");
    const { data: moods = [], isLoading } = useQuery({
        queryKey: ["/api/moods"],
    });
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
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Mood Tracker" }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "How are you feeling?" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Mood" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: MOODS.map((m) => (_jsx("button", { type: "button", onClick: () => setMood(m), className: `px-4 py-2 rounded-lg border ${mood === m
                                                ? "bg-blue-500 text-white border-blue-600"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`, "data-testid": `button-mood-${m.toLowerCase()}`, children: m }, m))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: ["Intensity: ", intensity, "/10"] }), _jsx("input", { type: "range", min: "1", max: "10", value: intensity, onChange: (e) => setIntensity(Number(e.target.value)), className: "w-full", "data-testid": "input-intensity" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Notes (optional)" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "What's contributing to this mood?", "data-testid": "input-mood-notes" })] }), _jsx("button", { type: "submit", disabled: !mood || createMoodMutation.isPending, className: "w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300", "data-testid": "button-save-mood", children: createMoodMutation.isPending ? "Saving..." : "Save Mood Entry" })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Recent Entries" }), isLoading ? (_jsx("p", { className: "text-gray-500", children: "Loading..." })) : moods.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No mood entries yet. Start tracking your mood above!" })) : (_jsx("div", { className: "space-y-3", children: moods.map((entry) => (_jsx("div", { className: "border-l-4 border-blue-500 pl-4 py-2", "data-testid": `mood-entry-${entry.id}`, children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: entry.mood }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Intensity: ", entry.intensity, "/10"] }), entry.notes && _jsx("p", { className: "text-sm mt-1", children: entry.notes })] }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(entry.createdAt).toLocaleDateString() })] }) }, entry.id))) }))] })] }));
}
