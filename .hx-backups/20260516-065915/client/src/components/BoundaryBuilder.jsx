import { useState, useEffect } from "react";
import { Shield, Plus, Check, Trash2 } from 'lucide-react';

const BOUNDARY_TYPES = [
  { id: "emotional", name: "Emotional", icon: "💝", description: "Protecting your feelings and emotional energy" },
  { id: "physical", name: "Physical", icon: "🏠", description: "Personal space and physical comfort" },
  { id: "time", name: "Time", icon: "⏰", description: "How you spend your time and energy" },
  { id: "digital", name: "Digital", icon: "📱", description: "Online presence and technology use" },
  { id: "social", name: "Social", icon: "👥", description: "Social interactions and relationships" },
  { id: "work", name: "Work", icon: "💼", description: "Professional boundaries and balance" },
];

const BOUNDARY_TEMPLATES = [
  { type: "emotional", text: "I will not take responsibility for other people's emotions" },
  { type: "emotional", text: "I will express my feelings without guilt" },
  { type: "time", text: "I will protect my rest time and not overcommit" },
  { type: "time", text: "I will say no to requests that drain me" },
  { type: "digital", text: "I will limit social media to specific times" },
  { type: "digital", text: "I will not respond to messages immediately" },
  { type: "work", text: "I will not check work emails after hours" },
  { type: "work", text: "I will take my full lunch break" },
  { type: "social", text: "I will leave gatherings when I feel drained" },
  { type: "physical", text: "I will ask before being hugged or touched" },
];

const AFFIRMATIONS = [
  "Setting boundaries is an act of self-love",
  "No is a complete sentence",
  "My needs are just as important as others'",
  "I deserve to feel safe and respected",
  "Boundaries protect my energy and peace",
];

export default function BoundaryBuilder() {
  const [boundaries, setBoundaries] = useState([]);
  const [newBoundary, setNewBoundary] = useState("");
  const [selectedType, setSelectedType] = useState("emotional");
  const [showTemplates, setShowTemplates] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [viewType, setViewType] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("boundary_builder_data");
    if (saved) {
      const data = JSON.parse(saved);
      setBoundaries(data.boundaries || []);
    }
    
    const affIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    setAffirmation(AFFIRMATIONS[affIndex]);
  }, []);

  const saveData = (newBoundaries) => {
    localStorage.setItem("boundary_builder_data", JSON.stringify({
      boundaries: newBoundaries,
    }));
  };

  const addBoundary = () => {
    if (!newBoundary.trim()) return;
    
    const boundary = {
      id: Date.now().toString(),
      text: newBoundary.trim(),
      type: selectedType,
      practiced: false,
      createdAt: new Date().toISOString(),
    };
    
    const updated = [...boundaries, boundary];
    setBoundaries(updated);
    saveData(updated);
    setNewBoundary("");
  };

  const useSuggestion = (template) => {
    setNewBoundary(template.text);
    setSelectedType(template.type);
    setShowTemplates(false);
  };

  const togglePracticed = (id) => {
    const updated = boundaries.map((b) =>
      b.id === id ? { ...b, practiced: !b.practiced } : b
    );
    setBoundaries(updated);
    saveData(updated);
  };

  const deleteBoundary = (id) => {
    const updated = boundaries.filter((b) => b.id !== id);
    setBoundaries(updated);
    saveData(updated);
  };

  const filteredBoundaries = viewType === "all"
    ? boundaries
    : boundaries.filter((b) => b.type === viewType);

  const getTypeData = (typeId) => BOUNDARY_TYPES.find((t) => t.id === typeId);

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="boundary-builder">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-boundary-title">
                Boundary Builder
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Set healthy limits</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 mb-6">
          <p className="text-violet-700 dark:text-violet-300 text-center italic">
            "{affirmation}"
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Add a new boundary:
            </label>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-xs text-[var(--primary)] hover:underline"
              data-testid="button-templates"
            >
              {showTemplates ? "Hide suggestions" : "Need ideas?"}
            </button>
          </div>

          {showTemplates && (
            <div className="mb-4 p-4 rounded-xl bg-[var(--surface)] animate-fade-in-up">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {BOUNDARY_TEMPLATES.map((template, i) => (
                  <button
                    key={i}
                    onClick={() => useSuggestion(template)}
                    className="w-full p-2 rounded-lg bg-[var(--bg)] hover:bg-violet-50 dark:hover:bg-violet-900/20 text-left text-sm flex items-center gap-2"
                    data-testid={`button-template-${i}`}
                  >
                    <span>{getTypeData(template.type)?.icon}</span>
                    <span className="text-[var(--text)]">{template.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-3">
            {BOUNDARY_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-2 rounded-lg text-xl transition-all ${
                  selectedType === type.id
                    ? "bg-violet-100 dark:bg-violet-900/30 scale-110"
                    : "bg-[var(--surface)] opacity-60 hover:opacity-100"
                }`}
                title={type.name}
                data-testid={`button-type-${type.id}`}
              >
                {type.icon}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBoundary}
              onChange={(e) => setNewBoundary(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBoundary()}
              placeholder="I will..."
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-violet-400"
              data-testid="input-boundary"
              aria-label="New boundary"
            />
            <button
              onClick={addBoundary}
              disabled={!newBoundary.trim()}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-400 to-purple-500 text-white font-medium disabled:opacity-50"
              data-testid="button-add"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setViewType("all")}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              viewType === "all"
                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                : "bg-[var(--surface)] text-[var(--text-muted)]"
            }`}
            data-testid="button-filter-all"
          >
            All ({boundaries.length})
          </button>
          {BOUNDARY_TYPES.map((type) => {
            const count = boundaries.filter((b) => b.type === type.id).length;
            if (count === 0) return null;
            return (
              <button
                key={type.id}
                onClick={() => setViewType(type.id)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${
                  viewType === type.id
                    ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                    : "bg-[var(--surface)] text-[var(--text-muted)]"
                }`}
                data-testid={`button-filter-${type.id}`}
              >
                <span>{type.icon}</span>
                {count}
              </button>
            );
          })}
        </div>

        {filteredBoundaries.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)]">
              {boundaries.length === 0
                ? "No boundaries set yet. Start protecting your peace!"
                : "No boundaries in this category."}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredBoundaries.map((boundary) => {
              const type = getTypeData(boundary.type);
              return (
                <div
                  key={boundary.id}
                  className={`p-4 rounded-xl ${
                    boundary.practiced
                      ? "bg-emerald-50 dark:bg-emerald-900/20"
                      : "bg-[var(--surface)]"
                  } flex items-center gap-3`}
                >
                  <button
                    onClick={() => togglePracticed(boundary.id)}
                    className={`p-2 rounded-lg ${
                      boundary.practiced
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                        : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
                    }`}
                    data-testid={`button-practice-${boundary.id}`}
                    aria-label="Mark as practiced"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <span className="text-xl">{type?.icon}</span>
                  <span className={`flex-1 ${boundary.practiced ? "text-emerald-700 dark:text-emerald-300" : "text-[var(--text)]"}`}>
                    {boundary.text}
                  </span>
                  <button
                    onClick={() => deleteBoundary(boundary.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    data-testid={`button-delete-${boundary.id}`}
                    aria-label="Delete boundary"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {boundaries.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
            {boundaries.filter((b) => b.practiced).length} of {boundaries.length} boundaries practiced today
          </div>
        )}
      </div>
    </div>
  );
}
