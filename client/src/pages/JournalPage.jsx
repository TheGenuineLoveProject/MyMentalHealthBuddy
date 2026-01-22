import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Notebook, Plus, Trash2, ChevronDown, ChevronUp, PenLine, Calendar, Sparkles, X } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import SEO from "../components/SEO";

export default function JournalPage() {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/journal"],
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (data?.journals && Array.isArray(data.journals)) return data.journals;
      if (data?.data && Array.isArray(data.data)) return data.data;
      return [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/journal", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setTitle("");
      setContent("");
      setShowForm(false);
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Failed to save entry");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/journal/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (err) => {
      setError(err.message || "Failed to delete entry");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    setError("");
    createMutation.mutate({ title, content });
  }

  function handleDelete(id) {
    if (!confirm("Delete this journal entry?")) return;
    deleteMutation.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-mesh">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="skeleton h-10 w-1/3 rounded-xl"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Journal"
        description="Write and reflect on your thoughts in a private, secure journal. Express yourself freely and track your mental wellness journey."
      />
      <div className="min-h-screen safe-padding hero-gradient">
        <div className="container-sm px-responsive">
          <header className="flex-between mb-8">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 text-body-sm text-secondary hover:text-brand transition focus-ring rounded-lg px-2 py-1" 
                data-testid="link-back" 
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="icon-sm" aria-hidden="true" />
                Back
              </Link>
              <div className="flex items-center gap-3">
                <div className="icon-badge icon-badge-sage icon-circle-lg">
                  <Notebook className="icon-md" aria-hidden="true" />
                </div>
                <div className="stack-xs">
                  <h1 className="text-display-sm text-brand" data-testid="text-title">Reflective Journal</h1>
                  <p className="text-body-sm text-secondary">A safe space to process thoughts, honor feelings, and witness your own growth</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-gradient"
              data-testid="button-new"
              aria-expanded={showForm}
              aria-controls="journal-form"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </header>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--accent-rose-soft)] border border-[var(--accent-rose)]/30 text-[var(--accent-rose)] flex items-center justify-between" role="alert" data-testid="text-error">
              <span>{error}</span>
              <button 
                onClick={() => setError("")} 
                className="p-1 hover:bg-[var(--accent-rose)]/20 rounded-lg transition"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* New Entry Form */}
          {showForm && (
            <form 
              id="journal-form" 
              onSubmit={handleSubmit} 
              className="mb-8 card-elevated p-6 animate-scale-in" 
              data-testid="form-journal" 
              aria-label="New journal entry form"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold">New Journal Entry</h2>
              </div>
              
              <div className="mb-4">
                <label htmlFor="journal-title" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Title</label>
                <input
                  id="journal-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="input"
                  data-testid="input-title"
                  autoComplete="off"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="journal-content" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Content</label>
                <textarea
                  id="journal-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts..."
                  rows={6}
                  className="input resize-none"
                  data-testid="input-content"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="btn btn-gradient flex-1"
                  data-testid="button-save"
                  aria-busy={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      Save Entry
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                  data-testid="button-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Empty State */}
          {entries.length === 0 ? (
            <div className="text-center py-16 card-elevated" role="status">
              <div className="w-20 h-20 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center mx-auto mb-6">
                <Notebook className="w-10 h-10 text-[var(--primary)]" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No journal entries yet</h2>
              <p className="text-[var(--text-secondary)] mb-6">Start writing to track your thoughts and feelings</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-gradient"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
                Write Your First Entry
              </button>
            </div>
          ) : (
            <section className="space-y-4" aria-label="Journal entries">
              {entries.map((entry, index) => (
                <article
                  key={entry.id}
                  className="card-elevated overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  data-testid={`entry-${entry.id}`}
                >
                  <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-[var(--card-hover)] transition"
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setExpandedId(expandedId === entry.id ? null : entry.id)}
                    aria-expanded={expandedId === entry.id}
                    aria-controls={`entry-content-${entry.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
                        <PenLine className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{entry.title || "Untitled"}</h3>
                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5 mt-1">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <time dateTime={entry.createdAt}>
                            {new Date(entry.createdAt).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-rose)] hover:bg-[var(--accent-rose-soft)] transition disabled:opacity-50"
                        data-testid={`button-delete-${entry.id}`}
                        aria-label={`Delete entry: ${entry.title || "Untitled"}`}
                      >
                        <Trash2 className="w-5 h-5" aria-hidden="true" />
                      </button>
                      <div className="p-2 text-[var(--text-muted)]">
                        {expandedId === entry.id ? (
                          <ChevronUp className="w-5 h-5" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-5 h-5" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedId === entry.id && (
                    <div 
                      id={`entry-content-${entry.id}`} 
                      className="px-5 pb-5 border-t border-[var(--border)] pt-5 ml-16"
                    >
                      <p className="text-[var(--text)] leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
