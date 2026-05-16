import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import { Check } from "lucide-react";

const DIMENSIONS = {
  energy: {
    label: "Energy",
    levels: ["depleted", "low", "neutral", "available", "wired"],
  },
  clarity: {
    label: "Clarity",
    levels: ["foggy", "scattered", "functional", "clear", "sharp"],
  },
  openness: {
    label: "Openness",
    levels: ["closed", "guarded", "neutral", "receptive", "porous"],
  },
  regulation: {
    label: "Regulation",
    levels: ["dysregulated", "activated", "settling", "settled", "still"],
  },
  presence: {
    label: "Presence",
    levels: ["elsewhere", "drifting", "intermittent", "mostly-here", "anchored"],
  },
};

function DimensionRow({ dimension, value, onChange }) {
  const { label, levels } = DIMENSIONS[dimension];
  
  return (
    <div className="py-4 border-b border-[var(--glp-ink)]/5 last:border-0">
      <div className="text-sm font-medium text-[var(--glp-ink)]/70 mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(dimension, level)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
              value === level
                ? "bg-[var(--glp-sage-deep)] text-white"
                : "bg-[var(--glp-ink)]/5 text-[var(--glp-ink)]/60 hover:bg-[var(--glp-ink)]/10"
            }`}
            data-testid={`button-state-${dimension}-${level}`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StateTracker({ onComplete }) {
  const [state, setState] = useState({
    energy: "",
    clarity: "",
    openness: "",
    regulation: "",
    presence: "",
  });
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/states", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/states"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setSaved(true);
      if (onComplete) setTimeout(onComplete, 1500);
    },
  });

  function handleChange(dimension, value) {
    setState((prev) => ({ ...prev, [dimension]: value }));
  }

  function isComplete() {
    return Object.values(state).every((v) => v !== "");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isComplete()) return;
    saveMutation.mutate({ ...state, note: note || undefined });
  }

  if (saved) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[var(--glp-sage)]/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-[var(--glp-sage-deep)]" />
        </div>
        <p className="text-[var(--glp-ink)]/60">State recorded</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[var(--glp-ink)]">Notice your state</h2>
        <p className="text-sm text-[var(--glp-ink)]/50 mt-1">
          No judgment. Just observation.
        </p>
      </div>

      {Object.keys(DIMENSIONS).map((dimension) => (
        <DimensionRow
          key={dimension}
          dimension={dimension}
          value={state[dimension]}
          onChange={handleChange}
        />
      ))}

      <div className="pt-4">
        <label className="text-sm text-[var(--glp-ink)]/50 block mb-2">
          Anything to note? (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Context, observations..."
          className="w-full p-3 rounded-lg border border-[var(--glp-ink)]/10 bg-white text-sm resize-none focus:outline-none focus:border-[var(--glp-sage-deep)]/30"
          rows={2}
          data-testid="input-state-note"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={!isComplete() || saveMutation.isPending}
          className="w-full py-3 rounded-xl bg-[var(--glp-sage-deep)] text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          data-testid="button-save-state"
        >
          {saveMutation.isPending ? "Saving..." : "Record state"}
        </button>
      </div>
    </form>
  );
}
