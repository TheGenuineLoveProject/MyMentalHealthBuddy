import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Plus, Edit, Trash2 } from "lucide-react";

export function JournalPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: journals = [], isLoading } = useQuery({
    queryKey: ["/api/journals"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title?: string; content: string }) => {
      return apiRequest("/api/journals", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "x-user-id": "demo-user" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { title?: string; content: string } }) => {
      return apiRequest(`/api/journals/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "x-user-id": "demo-user" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/journals/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": "demo-user" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
    }
  });

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const handleEdit = (journal: any) => {
    setIsEditing(true);
    setEditingId(journal.id);
    setTitle(journal.title || "");
    setContent(journal.content);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: { title, content } });
    } else {
      createMutation.mutate({ title, content });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Journal</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            data-testid="button-new-journal"
          >
            <Plus size={18} />
            New Entry
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Entry" : "New Entry"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title (optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Give your entry a title..."
                data-testid="input-journal-title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your thoughts..."
                data-testid="input-journal-content"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!content.trim() || createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                data-testid="button-save-journal"
              >
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Entry"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                data-testid="button-cancel-journal"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : journals.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No journal entries yet.</p>
            <p>Start writing to track your thoughts and feelings.</p>
          </div>
        ) : (
          journals.map((journal: any) => (
            <div
              key={journal.id}
              className="bg-white rounded-lg shadow p-6"
              data-testid={`journal-entry-${journal.id}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  {journal.title && <h3 className="text-lg font-semibold">{journal.title}</h3>}
                  <p className="text-sm text-gray-500">
                    {new Date(journal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(journal)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    data-testid={`button-edit-journal-${journal.id}`}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(journal.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    data-testid={`button-delete-journal-${journal.id}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{journal.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
