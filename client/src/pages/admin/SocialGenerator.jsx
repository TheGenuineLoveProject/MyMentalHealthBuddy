import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, Sparkles, Instagram, Twitter, Youtube, 
  MessageCircle, Save, Wand2, AlertCircle, CheckCircle,
  Loader2, RefreshCw, Shield, Zap, Clock, Hash, Linkedin
} from "lucide-react";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/SafetyFooter";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F" },
  { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "#000000" },
  { id: "x", name: "X/Threads", icon: Twitter, color: "#1DA1F2" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
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
  "Self-Compassion",
  "Attachment",
  "Anxiety",
  "Depression",
  "Relationships",
];

const STYLES = [
  { id: "warm", name: "Warm & Supportive", description: "Gentle, nurturing tone" },
  { id: "educational", name: "Educational", description: "Informative, research-backed" },
  { id: "empowering", name: "Empowering", description: "Strength-focused, motivating" },
  { id: "reflective", name: "Reflective", description: "Thoughtful, introspective" },
];

const LEVELS = [
  { id: "beginner", name: "Beginner", description: "Simple, accessible" },
  { id: "intermediate", name: "Intermediate", description: "Balanced depth" },
  { id: "advanced", name: "Advanced", description: "Detailed, scholarly" },
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
    style: "warm",
    level: "intermediate",
  });
  const [errors, setErrors] = useState({});
  const [aiGenerated, setAiGenerated] = useState(null);
  const [complianceResult, setComplianceResult] = useState(null);
  const [alternativeHooks, setAlternativeHooks] = useState([]);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState(null);
  
  const { data: platformSpecs = {} } = useQuery({
    queryKey: ["/api/admin/social/platforms/specs"],
  });
  
  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/drafts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/drafts"] });
      navigate("/admin/social");
    },
  });
  
  const generateMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/generate", data),
    onSuccess: (data) => {
      setAiGenerated(data);
      setAlternativeHooks(data.alternativeHooks || []);
      setForm(prev => ({
        ...prev,
        hook: data.hook || prev.hook,
        caption: data.caption || prev.caption,
        cta: data.cta || prev.cta,
        hashtags: data.hashtags || prev.hashtags,
        disclaimer: data.disclaimer || prev.disclaimer,
      }));
      checkCompliance(data.caption);
    },
  });
  
  const complianceMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/compliance/check", data),
    onSuccess: (data) => setComplianceResult(data),
  });
  
  const rewriteMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/compliance/rewrite", data),
    onSuccess: (data) => {
      if (data.rewritten) {
        setForm(prev => ({ ...prev, caption: data.rewritten }));
        checkCompliance(data.rewritten);
      }
    },
  });
  
  const [imageError, setImageError] = useState(null);
  const [enhanceError, setEnhanceError] = useState(null);
  
  const imageGenerateMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/generate/image", data),
    onSuccess: (data) => { setGeneratedImage(data); setImageError(null); },
    onError: (err) => setImageError(err.message || "Failed to generate image"),
  });
  
  const enhanceMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/enhance", data),
    onSuccess: (data) => { setEnhancementSuggestions(data); setEnhanceError(null); },
    onError: (err) => setEnhanceError(err.message || "Failed to enhance content"),
  });
  
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    if (field === "caption" && value.length > 50) {
      checkCompliance(value);
    }
  };
  
  const checkCompliance = (text) => {
    if (text && text.length > 20) {
      complianceMutation.mutate({ text });
    }
  };
  
  const handleGenerate = () => {
    if (!form.theme) {
      setErrors({ theme: "Please select a theme first" });
      return;
    }
    generateMutation.mutate({
      theme: form.theme,
      platform: form.platform,
      style: form.style,
      level: form.level,
    });
  };
  
  const handleRewrite = () => {
    if (form.caption && complianceResult?.issues?.length > 0) {
      rewriteMutation.mutate({
        text: form.caption,
        issues: complianceResult.issues,
      });
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
  const currentSpec = platformSpecs[form.platform] || {};
  const captionLength = form.caption?.length || 0;
  const isOverLimit = currentSpec.maxChars && captionLength > currentSpec.maxChars;
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/social" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              AI Content Generator
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create trauma-informed wellness content with AI assistance
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !form.theme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            data-testid="button-ai-generate"
          >
            {generateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            Generate with AI
          </button>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Platform & Settings
                </h2>
                
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {PLATFORMS.map(platform => {
                    const Icon = platform.icon;
                    const isSelected = form.platform === platform.id;
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => handleChange("platform", platform.id)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? "border-[var(--glp-sage)] bg-[var(--glp-sage-10)]" 
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                        data-testid={`button-platform-${platform.id}`}
                      >
                        <Icon className="w-5 h-5" style={{ color: platform.color }} />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {platform.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {currentSpec.maxChars && (
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Zap className="w-4 h-4" />
                      <span>Max: {currentSpec.maxChars} chars</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Hash className="w-4 h-4" />
                      <span>Hashtags: {currentSpec.hashtagLimit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>Best: {currentSpec.bestTimes?.join(", ")}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Theme *
                    </label>
                    <select
                      value={form.theme}
                      onChange={(e) => handleChange("theme", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.theme ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      } bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm`}
                      data-testid="select-theme"
                    >
                      <option value="">Select theme...</option>
                      {THEMES.map(theme => (
                        <option key={theme} value={theme}>{theme}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Style
                    </label>
                    <select
                      value={form.style}
                      onChange={(e) => handleChange("style", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                      data-testid="select-style"
                    >
                      {STYLES.map(style => (
                        <option key={style.id} value={style.id}>{style.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Level
                    </label>
                    <select
                      value={form.level}
                      onChange={(e) => handleChange("level", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                      data-testid="select-level"
                    >
                      {LEVELS.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Content
                  </h2>
                  {complianceResult && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      complianceResult.status === "pass" 
                        ? "bg-emerald-100 text-emerald-700"
                        : complianceResult.status === "review"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {complianceResult.status === "pass" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                      Compliance: {complianceResult.score}%
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Hook (2-second attention grabber) *
                      </label>
                      {alternativeHooks.length > 0 && (
                        <span className="text-xs text-slate-500">{alternativeHooks.length} alternatives available</span>
                      )}
                    </div>
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
                    {alternativeHooks.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {alternativeHooks.map((hook, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleChange("hook", hook)}
                            className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            {hook.substring(0, 40)}...
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Caption *
                      </label>
                      <span className={`text-xs ${isOverLimit ? "text-red-500" : "text-slate-500"}`}>
                        {captionLength}{currentSpec.maxChars ? ` / ${currentSpec.maxChars}` : ""} chars
                      </span>
                    </div>
                    <textarea
                      value={form.caption}
                      onChange={(e) => handleChange("caption", e.target.value)}
                      onBlur={() => checkCompliance(form.caption)}
                      placeholder="Write your main content here. Use trauma-informed language..."
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.caption ? "border-red-500" : isOverLimit ? "border-amber-500" : "border-slate-200 dark:border-slate-700"
                      } bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none`}
                      data-testid="input-caption"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Call to Action
                      </label>
                      <input
                        type="text"
                        value={form.cta}
                        onChange={(e) => handleChange("cta", e.target.value)}
                        placeholder="e.g., Save this for later..."
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        data-testid="input-cta"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Hashtags
                      </label>
                      <input
                        type="text"
                        value={form.hashtags}
                        onChange={(e) => handleChange("hashtags", e.target.value)}
                        placeholder="#mentalhealth #healing #wellness"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        data-testid="input-hashtags"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Disclaimer
                    </label>
                    <select
                      value={form.disclaimer}
                      onChange={(e) => handleChange("disclaimer", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      data-testid="select-disclaimer"
                    >
                      <option value="">Select a disclaimer...</option>
                      {DISCLAIMER_TEMPLATES.map((d, idx) => (
                        <option key={idx} value={d}>{d.substring(0, 60)}...</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--glp-sage-deep)] text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                  data-testid="button-save-draft"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Draft
                </button>
              </div>
            </form>
          </div>
          
          <div className="space-y-6">
            {complianceResult && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Compliance Check
                  </h3>
                  {complianceResult.issues?.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRewrite}
                      disabled={rewriteMutation.isPending}
                      className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-1"
                      data-testid="button-ai-rewrite"
                    >
                      {rewriteMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                      AI Rewrite
                    </button>
                  )}
                </div>
                
                {complianceResult.issues?.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Issues Found</p>
                    {complianceResult.issues.slice(0, 5).map((issue, idx) => (
                      <div key={idx} className="text-sm p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                        <span className="font-medium">"{issue.phrase}"</span>
                        <p className="text-xs mt-1 opacity-80">{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {complianceResult.suggestions?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Suggestions</p>
                    {complianceResult.suggestions.slice(0, 3).map((sug, idx) => (
                      <div key={idx} className="text-sm p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                        {sug.message}
                      </div>
                    ))}
                  </div>
                )}
                
                {complianceResult.status === "pass" && (
                  <div className="text-sm p-3 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Content passes trauma-informed guidelines
                  </div>
                )}
              </div>
            )}
            
            {aiGenerated?.contentNotes && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" />
                  AI Notes
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {aiGenerated.contentNotes}
                </p>
              </div>
            )}
            
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  AI Image Generation
                </h3>
                <button
                  type="button"
                  onClick={() => imageGenerateMutation.mutate({
                    theme: form.theme || "self-care",
                    platform: form.platform,
                    style: "minimalist"
                  })}
                  disabled={imageGenerateMutation.isPending}
                  className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
                  data-testid="button-generate-image"
                >
                  {imageGenerateMutation.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  Generate Visual
                </button>
              </div>
              
              {imageError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {imageError}
                </div>
              )}
              
              {generatedImage?.image ? (
                <div className="space-y-3">
                  <img 
                    src={generatedImage.image} 
                    alt="AI-generated visual" 
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Trauma-informed visual for {generatedImage.platform}
                  </p>
                </div>
              ) : !imageError && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  Generate a calming, brand-aligned visual for your post
                </p>
              )}
            </div>
            
            {form.caption && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Content Enhancement
                  </h3>
                  <div className="flex gap-2">
                    {["engagement", "accessibility", "emotional"].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => enhanceMutation.mutate({ text: form.caption, type })}
                        disabled={enhanceMutation.isPending}
                        className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 capitalize"
                        data-testid={`button-enhance-${type}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {enhanceError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {enhanceError}
                  </div>
                )}
                
                {enhanceMutation.isPending && (
                  <div className="flex items-center justify-center py-4 text-slate-500 dark:text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Analyzing content...
                  </div>
                )}
                
                {enhancementSuggestions?.suggestions && (
                  <div className="space-y-3">
                    {enhancementSuggestions.suggestions.map((sug, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{sug.title}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">{sug.description}</p>
                        {sug.example && (
                          <p className="text-xs mt-2 p-2 bg-white dark:bg-slate-700 rounded border border-blue-100 dark:border-blue-800 italic">
                            "{sug.example}"
                          </p>
                        )}
                      </div>
                    ))}
                    
                    {enhancementSuggestions.enhancedVersion && (
                      <div className="pt-3 border-t border-blue-100 dark:border-blue-800">
                        <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">Enhanced Version:</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 p-2 bg-white dark:bg-slate-700 rounded">
                          {enhancementSuggestions.enhancedVersion}
                        </p>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, caption: enhancementSuggestions.enhancedVersion }))}
                          className="mt-2 text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                          data-testid="button-apply-enhanced"
                        >
                          Apply Enhanced Version
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Trauma-Informed Tips
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Use "you might" instead of "you should"
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Say "may help" instead of "will fix"
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Include pacing cues like "at your own pace"
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Add crisis resources for sensitive topics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <SafetyFooter />
    </div>
  );
}
