import { useState } from "react";

type Belief = {
  id: string;
  text: string;
  category: "self" | "world" | "others" | "future";
  strength: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
};

const CATEGORIES = [
  { id: "self", label: "About Myself", color: "bg-rose-100 dark:bg-rose-900/30" },
  { id: "world", label: "About the World", color: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "others", label: "About Others", color: "bg-amber-100 dark:bg-amber-900/30" },
  { id: "future", label: "About the Future", color: "bg-emerald-100 dark:bg-emerald-900/30" },
] as const;

const STORAGE_KEY = "glp_beliefs";

function loadBeliefs(): Belief[] {
  try {
    return ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  } catch {
    return [];
  }
}

function saveBeliefs(beliefs: Belief[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(beliefs)); } catch (err) { console.warn("[storage-safe-write]", err); }
}

export default function BeliefMapper() {
  const [beliefs, setBeliefs] = useState<Belief[]>(loadBeliefs);
  const [newBelief, setNewBelief] = useState("");
  const [category, setCategory] = useState<Belief["category"]>("self");

  function addBelief() {
    if (!newBelief.trim()) return;

    const belief: Belief = {
      id: Date.now().toString(),
      text: newBelief.trim(),
      category,
      strength: 3,
      createdAt: new Date().toISOString(),
    };

    const updated = [belief, ...beliefs];
    setBeliefs(updated);
    saveBeliefs(updated);
    setNewBelief("");
  }

  function removeBelief(id: string) {
    const updated = beliefs.filter((b) => b.id !== id);
    setBeliefs(updated);
    saveBeliefs(updated);
  }

  function updateStrength(id: string, strength: Belief["strength"]) {
    const updated = beliefs.map((b) =>
      b.id === id ? { ...b, strength } : b
    );
    setBeliefs(updated);
    saveBeliefs(updated);
  }

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    beliefs: beliefs.filter((b) => b.category === cat.id),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Belief Mapping</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track statements you repeat to yourself. No judgment - just awareness.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newBelief}
          onChange={(e) => setNewBelief(e.target.value)}
          placeholder="A belief I notice in myself..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
          onKeyDown={(e) => e.key === "Enter" && addBelief()}
          data-testid="input-new-belief"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Belief["category"])}
          className="rounded-lg border px-3 py-2 text-sm"
          data-testid="select-belief-category"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <button
          onClick={addBelief}
          disabled={!newBelief.trim()}
          className="rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
          data-testid="button-add-belief"
        >
          Add
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {grouped.map((group) => (
          <div key={group.id} className={`rounded-xl p-4 ${group.color}`}>
            <h3 className="font-medium mb-3">{group.label}</h3>
            {group.beliefs.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No beliefs recorded yet</p>
            ) : (
              <div className="space-y-2">
                {group.beliefs.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-start gap-2 rounded-lg bg-background/50 p-2"
                    data-testid={`belief-${b.id}`}
                  >
                    <div className="flex-1">
                      <p className="text-sm">"{b.text}"</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStrength(b.id, s as Belief["strength"])}
                            className={`w-4 h-4 rounded-full border ${
                              s <= b.strength ? "bg-primary" : "bg-muted"
                            }`}
                            aria-label={`Strength ${s}`}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => removeBelief(b.id)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                      aria-label="Remove belief"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        You are the authority on your own beliefs. This is a mirror, not a judge.
      </p>
    </div>
  );
}
