import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Plus, FileText, Trash2, BookOpen, Download, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { SEO } from "../../components/SEO";

const TEMPLATE_TYPES = [
  { id: "hook", name: "Hook", description: "2-second attention grabber" },
  { id: "caption", name: "Caption", description: "Main post content" },
  { id: "thread", name: "Thread", description: "Multi-post story" },
  { id: "carousel", name: "Carousel", description: "5-card outline" },
  { id: "cta", name: "CTA", description: "Call to action" },
  { id: "disclaimer", name: "Disclaimer", description: "Safety disclaimers" },
];

const LEVELS = ["beginner", "intermediate", "advanced"];

export default function SocialLibrary() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "hook",
    name: "",
    structure: "",
    voiceRules: "",
    level: "beginner",
  });
  
  const { data: templates = [], isLoading, error, refetch } = useQuery({
    queryKey: ["/api/admin/social/templates"],
  });
  
  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/templates", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/templates"] });
      setShowForm(false);
      setForm({ type: "hook", name: "", structure: "", voiceRules: "", level: "beginner" });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/admin/social/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/templates"] });
    },
  });
  
  const seedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/social/templates/seed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/templates"] });
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.structure.trim()) return;
    createMutation.mutate(form);
  };
  
  const groupedTemplates = TEMPLATE_TYPES.reduce((acc, type) => {
    acc[type.id] = templates.filter(t => t.type === type.id);
    return acc;
  }, {});
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title="Social Library — Admin" noindex />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '0.5rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} />
          Back to Command Center
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/social" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" data-testid="link-back-social">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-page-title">
                Template Library
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Reusable content structures for consistency
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--glp-sage)] text-[var(--glp-sage)] rounded-lg hover:bg-[var(--glp-sage-10)] transition-colors disabled:opacity-50"
              data-testid="button-seed-templates"
            >
              {seedMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Load Presets
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--glp-sage)] text-white rounded-lg hover:opacity-90 transition-opacity"
              data-testid="button-add-template"
            >
              <Plus className="w-4 h-4" />
              Add Template
            </button>
          </div>
        </div>
        
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              New Template
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  data-testid="select-template-type"
                >
                  {TEMPLATE_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Gentle Invitation"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  data-testid="input-template-name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  data-testid="select-template-level"
                >
                  {LEVELS.map(l => (
                    <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Structure</label>
              <textarea
                value={form.structure}
                onChange={(e) => setForm(prev => ({ ...prev, structure: e.target.value }))}
                placeholder="Template structure with [placeholders]..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
                data-testid="input-template-structure"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Voice Rules (optional)</label>
              <input
                type="text"
                value={form.voiceRules}
                onChange={(e) => setForm(prev => ({ ...prev, voiceRules: e.target.value }))}
                placeholder="e.g., Calm, non-clinical, consent-based language"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                data-testid="input-template-voice"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-[var(--glp-sage)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                data-testid="button-save-template"
              >
                {createMutation.isPending ? "Saving..." : "Save Template"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                data-testid="button-cancel-template"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        {error && (
          <div className="text-center py-16" data-testid="section-error">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 mb-4">Failed to load data</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-[var(--glp-sage)] text-white rounded-lg hover:opacity-90" data-testid="button-retry">
              Retry
            </button>
          </div>
        )}
        
        {!error && isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin motion-reduce:animate-none w-8 h-8 border-4 border-[var(--glp-sage)] border-t-transparent rounded-full" />
          </div>
        ) : !error && templates.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" data-testid="section-empty">
            <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No templates yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Load presets or create your first template to get started</p>
          </div>
        ) : !error ? (
          <div className="space-y-8">
            {TEMPLATE_TYPES.map(type => {
              const typeTemplates = groupedTemplates[type.id] || [];
              return (
                <div key={type.id} data-testid={`section-type-${type.id}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-[var(--glp-sage)]" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {type.name}
                    </h2>
                    <span className="text-sm text-slate-500">({typeTemplates.length})</span>
                  </div>
                  
                  {typeTemplates.length === 0 ? (
                    <p className="text-sm text-slate-500 italic" data-testid={`text-empty-${type.id}`}>No templates yet</p>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {typeTemplates.map(template => (
                        <div 
                          key={template.id}
                          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                          data-testid={`card-template-${template.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-slate-900 dark:text-white">
                              {template.name || "Untitled"}
                            </h3>
                            <button
                              onClick={() => deleteMutation.mutate(template.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                              data-testid={`button-delete-template-${template.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-2">
                            {template.structure}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400" data-testid={`badge-level-${template.id}`}>
                              {template.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
