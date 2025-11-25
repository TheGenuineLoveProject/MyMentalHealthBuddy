import { useState, useEffect } from "react";

type JournalEntry = {
  id: number;
  text: string;
  createdAt: string;
};

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch("/journal", { headers });
      const data = await res.json();

      if (data.ok && Array.isArray(data.list)) {
        setEntries(data.list);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error("Failed to load journal entries:", err);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text: newEntry.trim() }),
      });

      const data = await res.json();
      if (data.ok) {
        setNewEntry("");
        loadEntries();
      }
    } catch (err) {
      console.error("Failed to save journal entry:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div data-testid="page-journal" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1
        data-testid="text-journal-title"
        style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}
      >
        Personal Journal
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Write freely. Your thoughts are private and secure.
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <textarea
          data-testid="input-journal-entry"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="What's on your mind today? Write freely..."
          style={{
            width: "100%",
            minHeight: "150px",
            padding: "1rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
            lineHeight: 1.6,
            resize: "vertical",
            marginBottom: "1rem",
          }}
        />
        <button
          type="submit"
          data-testid="button-save-journal"
          disabled={isSaving || !newEntry.trim()}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            border: "none",
            background: isSaving || !newEntry.trim() ? "#9ca3af" : "#4f46e5",
            color: "white",
            fontWeight: 600,
            cursor: isSaving || !newEntry.trim() ? "default" : "pointer",
          }}
        >
          {isSaving ? "Saving..." : "Save Entry"}
        </button>
      </form>

      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBottom: "1rem",
          color: "#374151",
        }}
      >
        Past Entries
      </h2>

      {isLoading && (
        <p data-testid="text-loading" style={{ color: "#6b7280" }}>
          Loading your journal...
        </p>
      )}

      {!isLoading && entries.length === 0 && (
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
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            data-testid={`card-journal-entry-${entry.id}`}
            style={{
              padding: "1.25rem",
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                color: "#9ca3af",
                marginBottom: "0.75rem",
              }}
            >
              {formatDate(entry.createdAt)}
            </p>
            <p
              style={{
                color: "#374151",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {entry.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
