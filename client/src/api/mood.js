// MyMentalHealthBuddy — Mood API (React Query)
// Works with backend route: /api/mood
// Fully Replit-compatible and Vite-safe

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ----------------------------------------------
// API Helpers (consistent with Replit proxy)
// ----------------------------------------------
const API = "/api/mood";

// Fetch recent moods
async function fetchMoods() {
  const res = await fetch(API, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to load moods");
  }

  return res.json();
}

// Submit mood entry
async function submitMood(moodValue) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mood: moodValue }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to save mood");
  }

  return res.json();
}

// ----------------------------------------------
// React Query Hooks
// ----------------------------------------------
export function useMoods() {
  return useQuery({
    queryKey: ["moods"],
    queryFn: fetchMoods,
  });
}

export function useSubmitMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitMood,
    onSuccess: () => {
      // Refresh mood list after saving
      queryClient.invalidateQueries(["moods"]);
    },
  });
}