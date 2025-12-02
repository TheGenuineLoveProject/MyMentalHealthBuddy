import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Notebook, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient.js";

export default function JournalPage() {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/journal"],
    select: (data) => data.journals || data || [],
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
      <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-2xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-neutral-800 rounded w-1/4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-neutral-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-neutral-400 hover:text-white transition" data-testid="link-back">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold" data-testid="text-title">Journal</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            data-testid="button-new"
          >
            <Plus className="w-5 h-5" />
            <span>New Entry</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200" data-testid="text-error">
            {error}
            <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-neutral-800 p-6 rounded-xl" data-testid="form-journal">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="w-full p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
                data-testid="input-title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts..."
                rows={6}
                className="w-full p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition resize-none"
                data-testid="input-content"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
                data-testid="button-save"
              >
                {createMutation.isPending ? "Saving..." : "Save Entry"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition"
                data-testid="button-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <Notebook className="w-16 h-16 mx-auto text-neutral-600 mb-4" />
            <h2 className="text-xl font-semibold text-neutral-400">No journal entries yet</h2>
            <p className="text-neutral-500 mt-2">Start writing to track your thoughts and feelings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-neutral-800 rounded-xl overflow-hidden"
                data-testid={`entry-${entry.id}`}
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-700/50 transition"
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                >
                  <div>
                    <h3 className="font-semibold">{entry.title || "Untitled"}</h3>
                    <p className="text-sm text-neutral-400">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(entry.id);
                      }}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-neutral-400 hover:text-red-400 transition disabled:opacity-50"
                      data-testid={`button-delete-${entry.id}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {expandedId === entry.id ? (
                      <ChevronUp className="w-5 h-5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                </div>
                {expandedId === entry.id && (
                  <div className="px-4 pb-4 border-t border-neutral-700 pt-4">
                    <p className="text-neutral-300 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
