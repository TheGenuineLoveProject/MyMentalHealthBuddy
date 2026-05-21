import { useState, useMemo } from "react";

type TimelineEntry = {
  id: string;
  date: string;
  type: "reflection" | "belief" | "insight" | "milestone";
  content: string;
  tags?: string[];
};

const STORAGE_KEYS = {
  reflections: "glp_saved_reflections",
  beliefs: "glp_beliefs",
  silence: "glp_silence_entries",
};

function loadAllEntries(): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  try {
    const reflections = ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.reflections) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
    for (const r of reflections) {
      entries.push({
        id: `r-${r.createdAt}`,
        date: r.createdAt,
        type: "reflection",
        content: r.reflection?.slice(0, 200) || "Reflection saved",
        tags: r.tags,
      });
    }

    const beliefs = ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.beliefs) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
    for (const b of beliefs) {
      entries.push({
        id: `b-${b.id}`,
        date: b.createdAt,
        type: "belief",
        content: `"${b.text}"`,
      });
    }

    const silence = ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.silence) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
    for (const s of silence) {
      entries.push({
        id: `s-${s.id}`,
        date: s.createdAt,
        type: "insight",
        content: s.text?.slice(0, 200) || "Private reflection",
      });
    }
  } catch {
    // Ignore parse errors
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown date";
  }
}

const TYPE_STYLES = {
  reflection: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    dot: "bg-blue-500",
    label: "Reflection",
  },
  belief: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    dot: "bg-amber-500",
    label: "Belief Noted",
  },
  insight: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    dot: "bg-emerald-500",
    label: "Private Entry",
  },
  milestone: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    dot: "bg-purple-500",
    label: "Milestone",
  },
};

export default function GrowthTimeline() {
  const entries = useMemo(() => loadAllEntries(), []);
  const [filter, setFilter] = useState<TimelineEntry["type"] | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? entries : entries.filter((e) => e.type === filter)),
    [entries, filter]
  );

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Your Growth Timeline</h2>
        <p className="text-muted-foreground mt-2">
          Start journaling to see your personal evolution unfold here.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          No comparison. No ranking. Just your own journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Your Growth Timeline</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {entries.length} moments of self-reflection. Progress shown as continuity, not improvement.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {(["all", "reflection", "belief", "insight"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-muted"
            }`}
            data-testid={`button-filter-${f}`}
          >
            {f === "all" ? "All" : TYPE_STYLES[f].label}
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {filtered.map((entry) => {
            const style = TYPE_STYLES[entry.type];
            return (
              <div
                key={entry.id}
                className={`relative ml-10 rounded-xl p-4 ${style.bg}`}
                data-testid={`timeline-entry-${entry.id}`}
              >
                <div className={`absolute -left-[26px] top-5 w-3 h-3 rounded-full ${style.dot}`} />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {style.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{entry.content}</p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {entry.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-background/50 px-2 py-0.5 text-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        You are the author of your own evolution. No one else can define it.
      </p>
    </div>
  );
}
