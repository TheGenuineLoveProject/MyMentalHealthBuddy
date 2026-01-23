import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, Sparkles, Instagram, Twitter, Youtube, 
  MessageCircle, Save, Wand2, AlertCircle
} from "lucide-react";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/SafetyFooter";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F" },
  { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "#000000" },
  { id: "threads", name: "Threads/X", icon: Twitter, color: "#1DA1F2" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000" },
];

const THEMES = [
  "Self-Regulation",
  "Boundaries",
  "Values",
  "Journaling",
  "Repair",
  "Sleep",
  "Community",
  "Inner Child",
  "Nervous System",
  "Grounding",
];

const DISCLAIMER_TEMPLATES = [
  "This content is for educational purposes only and not a substitute for professional mental health support.",
  "If you're in crisis, please reach out to 988 (Suicide & Crisis Lifeline) or text HOME to 741741.",
  "Everyone's healing journey is unique. Take what resonates and leave the rest.",
];

export default function SocialGenerator() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    platform: "instagram",
    theme: "",
    hook: "",
    caption: "",
    cta: "",
    hashtags: "",
    disclaimer: "",
  });
  const [errors, setErrors] = useState({});
  
  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/drafts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/drafts"] });
      navigate("/admin/social");
    },
  });
  
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!form.hook.trim()) newErrors.hook = "Hook is required";
    if (!form.caption.trim()) newErrors.caption = "Caption is required";
    if (!form.theme) newErrors.theme = "Please select a theme";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    createMutation.mutate(form);
  };
  
  const selectedPlatform = PLATFORMS.find(p => p.id === form.platform);
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/social" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Create Content Draft
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Craft trauma-informed wellness content
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Platform & Theme
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {PLATFORMS.map(platform => {
                const Icon = platform.icon;
                const isSelected = form.platform === platform.id;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => handleChange("platform", platform.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? "border-[var(--glp-sage)] bg-[var(--glp-sage-10)]" 
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                    data-testid={`button-platform-${platform.id}`}
                  >
                    <Icon className="w-6 h-6" style={{ color: platform.color }} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {platform.name}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Theme *
              </label>
              <select
                value={form.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.theme ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                data-testid="select-theme"
              >
                <option value="">Select a theme...</option>
                {THEMES.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
              {errors.theme && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.theme}
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Content
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hook (2-second attention grabber) *
                </label>
                <input
                  type="text"
                  value={form.hook}
                  onChange={(e) => handleChange("hook", e.target.value)}
                  placeholder="e.g., Your nervous system isn't broken..."
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.hook ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                  data-testid="input-hook"
                />
                {errors.hook && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.hook}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Caption *
                </label>
                <textarea
                  value={form.caption}
                  onChange={(e) => handleChange("caption", e.target.value)}
                  placeholder="Write your main content here. Use trauma-informed language: 'you might notice...', 'some people find...', 'if it feels right...'"
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.caption ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none`}
                  data-testid="input-caption"
                />
                {errors.caption && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.caption}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {form.caption.length} characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Call to Action (optional)
                </label>
                <input
                  type="text"
                  value={form.cta}
                  onChange={(e) => handleChange("cta", e.target.value)}
                  placeholder="e.g., Save this for when you need it"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  data-testid="input-cta"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hashtags (optional)
                </label>
                <input
                  type="text"
                  value={form.hashtags}
                  onChange={(e) => handleChange("hashtags", e.target.value)}
                  placeholder="#mentalhealth #selflove #healing #wellness"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  data-testid="input-hashtags"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Disclaimer (optional)
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {DISCLAIMER_TEMPLATES.map((template, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleChange("disclaimer", template)}
                  className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Template {i + 1}
                </button>
              ))}
            </div>
            
            <textarea
              value={form.disclaimer}
              onChange={(e) => handleChange("disclaimer", e.target.value)}
              placeholder="Add a disclaimer if needed..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
              data-testid="input-disclaimer"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--glp-sage)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              data-testid="button-save-draft"
            >
              <Save className="w-5 h-5" />
              {createMutation.isPending ? "Saving..." : "Save Draft"}
            </button>
          </div>
          
          {createMutation.isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to save draft. Please try again.
            </p>
          )}
        </form>
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
