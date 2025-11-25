import { useState, useEffect } from "react";
import { apiGet, apiPost, ApiError } from "../utils/api";

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
      console.error("Failed to load journal entries:", err);
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
    if (!newEntry.trim()) return;

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      await apiPost("/api/journal", { text: newEntry.trim() });
      setSuccess("Journal entry saved!");
      setNewEntry("");
      loadEntries();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to save journal entry. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div data-testid="page-journal" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1
        data-testid="text-journal-title"
        style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1f2937" }}
      >
        Personal Journal
      </h1>
      <p data-testid="text-journal-subtitle" style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Write freely. Your thoughts are private and secure.
      </p>

      {error && (
        <div
          data-testid="text-error"
          role="alert"
          style={{
            padding: "0.75rem",
            background: "#fef2f2",
            color: "#dc2626",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          data-testid="text-success"
          role="status"
          style={{
            padding: "0.75rem",
            background: "#f0fdf4",
            color: "#16a34a",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} data-testid="form-journal" style={{ marginBottom: "2rem" }}>
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
          style={{
            width: "100%",
            minHeight: "150px",
            padding: "1rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
            lineHeight: 1.6,
            resize: "vertical",
            marginBottom: "0.5rem",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            {newEntry.length}/10000 characters
          </span>
          <button
            type="submit"
            data-testid="button-save-journal"
            disabled={isSaving || !newEntry.trim()}
            aria-busy={isSaving}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              border: "none",
              background: isSaving || !newEntry.trim() ? "#9ca3af" : "#4f46e5",
              color: "white",
              fontWeight: 600,
              cursor: isSaving || !newEntry.trim() ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {isSaving ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>

      <h2
        data-testid="text-entries-title"
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBottom: "1rem",
          color: "#374151",
        }}
      >
        Past Entries
      </h2>

      {isLoading ? (
        <div data-testid="loading-entries" style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
          Loading your journal...
        </div>
      ) : entries.length === 0 ? (
        <div
          data-testid="text-empty-journal"
          style={{
            padding: "2rem",
            background: "#f9fafb",
            borderRadius: "12px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No journal entries yet</p>
          <p>Start writing above to capture your thoughts.</p>
        </div>
      ) : (
        <div data-testid="list-journal-entries" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {entries.map((entry, index) => (
            <article
              key={entry.id}
              data-testid={`card-journal-entry-${index}`}
              style={{
                padding: "1.25rem",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <time
                data-testid={`text-entry-date-${index}`}
                dateTime={entry.createdAt}
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#9ca3af",
                  marginBottom: "0.75rem",
                }}
              >
                {formatDate(entry.createdAt)}
              </time>
              <p
                data-testid={`text-entry-content-${index}`}
                style={{
                  color: "#374151",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  margin: 0,
                }}
              >
                {entry.text}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
