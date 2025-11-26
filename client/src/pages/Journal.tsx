import { useState, useEffect } from "react";
import { apiGet, apiPost, ApiError } from "../utils/api";
import { BookOpen, Send, Calendar, Sparkles } from "lucide-react";

type JournalEntry = {
  id: number;
  text: string;
  title?: string;
  createdAt: string;
};

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadEntries() {
    try {
      setIsLoading(true);
      const data = await apiGet<{ list: JournalEntry[] }>("/api/journal");
      setEntries(data.list || []);
    } catch (err) {
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newEntry.trim()) return; });
      setSuccess("Your thoughts have been saved!");
      setNewEntry("");
      loadEntries();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to save. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getPrompt() {
    const prompts = [
      "What made you smile today?",
      "What are you grateful for right now?",
      "How are you feeling in this moment?",
      "What's one thing you accomplished today?",
      "What's been on your mind lately?",
      "Describe a small joy from today.",
      "What would make tomorrow great?",
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  return (
    <div data-testid="page-journal" className="min-h-screen" style={{ background: "var(--background)" }}>
      <div 
        className="py-12 px-6 mb-8 animate-fade-in"
        style={{ 
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          borderRadius: "0 0 2rem 2rem"
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-white" />
            <h1 
              data-testid="text-journal-title"
              className="text-3xl font-bold text-white"
            >
              Personal Journal
            </h1>
          </div>
          <p className="text-white/90 text-lg">
            Your private space for reflection and self-discovery
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-12">
        {error && (
          <div
            data-testid="text-error"
            role="alert"
            className="p-4 rounded-xl mb-6 animate-fade-in flex items-center gap-3"
            style={{ background: "#fef2f2", color: "#dc2626" }}
          >
            <span className="text-xl">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div
            data-testid="text-success"
            role="status"
            className="p-4 rounded-xl mb-6 animate-fade-in flex items-center gap-3"
            style={{ background: "#f0fdf4", color: "#16a34a" }}
          >
            <Sparkles className="w-5 h-5" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} data-testid="form-journal" className="mb-8 animate-fade-in">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4" style={{ color: "var(--text-muted)" }}>
              <Sparkles className="w-4 h-4" />
              <span className="text-sm italic">{getPrompt()}</span>
            </div>
            
            <label htmlFor="journal-entry" className="sr-only">
              Write your journal entry
            </label>
            <textarea
              id="journal-entry"
              data-testid="input-journal-entry"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="What's on your mind today? Write freely..."
              maxLength={10000}
              className="w-full min-h-40 p-4 rounded-xl border-0 text-base resize-y"
              style={{ 
                background: "var(--background)",
                color: "var(--text-primary)",
                lineHeight: 1.8
              }}
            />
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {newEntry.length.toLocaleString()}/10,000 characters
              </span>
              <button
                type="submit"
                data-testid="button-save-journal"
                disabled={isSaving || !newEntry.trim()}
                aria-busy={isSaving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5" style={{ color: "var(--primary)" }} />
          <h2 
            data-testid="text-entries-title"
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Past Entries
          </h2>
          <span 
            className="text-sm px-2 py-0.5 rounded-full"
            style={{ background: "var(--primary-light)", color: "var(--primary)" }}
          >
            {entries.length}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-32 rounded-xl" data-testid={`skeleton-entry-${i}`} />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div
            data-testid="text-empty-journal"
            className="card p-8 text-center animate-fade-in"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Your journal awaits
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Start writing above to capture your thoughts and feelings.
            </p>
          </div>
        ) : (
          <div data-testid="list-journal-entries" className="space-y-4">
            {entries.map((entry, index) => (
              <article
                key={entry.id}
                data-testid={`card-journal-entry-${index}`}
                className="card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                  <time
                    data-testid={`text-entry-date-${index}`}
                    dateTime={entry.createdAt}
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {formatDate(entry.createdAt)}
                  </time>
                </div>
                <p
                  data-testid={`text-entry-content-${index}`}
                  className="whitespace-pre-wrap leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  {entry.text}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
