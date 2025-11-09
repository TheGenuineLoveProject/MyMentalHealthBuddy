import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import { SkeletonContentList } from "@/components/LoadingStates";
export function JournalPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { data: journals = [], isLoading } = useQuery({
        queryKey: ["/api/journals"],
    });
    const createMutation = useMutation({
        mutationFn: async (data) => {
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
        mutationFn: async ({ id, data }) => {
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
        mutationFn: async (id) => {
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
    const handleEdit = (journal) => {
        setIsEditing(true);
        setEditingId(journal.id);
        setTitle(journal.title || "");
        setContent(journal.content);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim())
            return;
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: { title, content } });
        }
        else {
            createMutation.mutate({ title, content });
        }
    };
    const handleExport = async (format) => {
        try {
            const response = await fetch(`/api/journals/export?format=${format}`, {
                headers: { "x-user-id": "demo-user" }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `journals-${Date.now()}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        catch (error) {
            console.error("Export failed:", error);
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Journal" }), _jsxs("div", { className: "flex gap-2", children: [journals.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => handleExport("csv"), className: "px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm", "data-testid": "button-export-journals-csv", children: [_jsx(Download, { size: 16 }), "CSV"] }), _jsxs("button", { onClick: () => handleExport("json"), className: "px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm", "data-testid": "button-export-journals-json", children: [_jsx(Download, { size: 16 }), "JSON"] })] })), !isEditing && (_jsxs("button", { onClick: () => setIsEditing(true), className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", "data-testid": "button-new-journal", children: [_jsx(Plus, { size: 18 }), "New Entry"] }))] })] }), isEditing && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: editingId ? "Edit Entry" : "New Entry" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Title (optional)" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Give your entry a title...", "data-testid": "input-journal-title" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Content" }), _jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), rows: 8, className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Write your thoughts...", "data-testid": "input-journal-content", required: true })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", disabled: !content.trim() || createMutation.isPending || updateMutation.isPending, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300", "data-testid": "button-save-journal", children: createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Entry" }), _jsx("button", { type: "button", onClick: resetForm, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300", "data-testid": "button-cancel-journal", children: "Cancel" })] })] })] })), _jsx("div", { className: "space-y-4", children: isLoading ? (_jsx(SkeletonContentList, { count: 3 })) : journals.length === 0 ? (_jsxs("div", { className: "text-center text-gray-500 py-8", children: [_jsx("p", { children: "No journal entries yet." }), _jsx("p", { children: "Start writing to track your thoughts and feelings." })] })) : (journals.map((journal) => (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", "data-testid": `journal-entry-${journal.id}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [journal.title && _jsx("h3", { className: "text-lg font-semibold", children: journal.title }), _jsx("p", { className: "text-sm text-gray-500", children: new Date(journal.createdAt).toLocaleDateString() })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(journal), className: "p-2 text-blue-600 hover:bg-blue-50 rounded", "data-testid": `button-edit-journal-${journal.id}`, children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => deleteMutation.mutate(journal.id), className: "p-2 text-red-600 hover:bg-red-50 rounded", "data-testid": `button-delete-journal-${journal.id}`, children: _jsx(Trash2, { size: 18 }) })] })] }), _jsx("p", { className: "text-gray-700 whitespace-pre-wrap", children: journal.content })] }, journal.id)))) })] }));
}
