// PHASE116Z32_ADMIN_SOCIAL_GENERATOR_VISUAL_DRIFT_PATCH
// PHASE11673_SOCIAL_GENERATOR_VISUAL_TOKEN_PATCH
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, Sparkles, MessageCircle, Save, Wand2, AlertCircle, CheckCircle, Loader2, RefreshCw, Shield, Zap, Clock, Hash } from "lucide-react";
import { Instagram, Twitter, Youtube, Linkedin } from "../../lib/lucide-brands";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { SEO } from "../../components/SEO";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

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
    <div className="min-h-screen bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)]">
      <SEO title="Social Generator — Admin" noindex />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '0.5rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} />
          Back to Command Center
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/social" className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-charcoal)] transition-colors" data-testid="link-back-social">
            <ArrowLeft className="w-5 h-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="text-page-title">
              AI Content Generator
            </h1>
            <p className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
              Create trauma-informed wellness content with AI assistance
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !form.theme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            data-testid="button-ai-generate"
          >
            {generateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            Generate with AI
          </button>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] p-6">
                <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-4">
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
                            : "border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] hover:border-[var(--glp-sage)]"
                        }`}
                        data-testid={`button-platform-${platform.id}`}
                      >
                        <Icon className="w-5 h-5" style={{ color: platform.color }} />
                        <span className="text-xs font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                          {platform.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {currentSpec.maxChars && (
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] mb-4 text-sm">
                    <div className="flex items-center gap-1 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                      <Zap className="w-4 h-4" />
                      <span>Max: {currentSpec.maxChars} chars</span>
                    </div>
                    <div className="flex items-center gap-1 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                      <Hash className="w-4 h-4" />
                      <span>Hashtags: {currentSpec.hashtagLimit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                      <Clock className="w-4 h-4" />
                      <span>Best: {currentSpec.bestTimes?.join(", ")}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">
                      Theme *
                    </label>
                    <select
                      value={form.theme}
                      onChange={(e) => handleChange("theme", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.theme ? "border-[var(--glp-blossom)]" : "border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)]"
                      } bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] text-sm`}
                      data-testid="select-theme"
                    >
                      <option value="">Select theme...</option>
                      {THEMES.map(theme => (
                        <option key={theme} value={theme}>{theme}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">
                      Style
                    </label>
                    <select
                      value={form.style}
                      onChange={(e) => handleChange("style", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] text-sm"
                      data-testid="select-style"
                    >
                      {STYLES.map(style => (
                        <option key={style.id} value={style.id}>{style.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">
                      Level
                    </label>
                    <select
                      value={form.level}
                      onChange={(e) => handleChange("level", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] text-sm"
                      data-testid="select-level"
                    >
                      {LEVELS.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                    Content
                  </h2>
                  {complianceResult && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      complianceResult.status === "pass" 
                        ? "bg-[var(--glp-sage-10)] text-[var(--glp-deep-teal)]"
                        : complianceResult.status === "review"
                        ? "bg-[var(--glp-sage-10)] text-[var(--glp-deep-teal)]"
                        : "bg-[rgba(244,199,195,0.24)] text-[var(--glp-charcoal)]"
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
                      <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                        Hook (2-second attention grabber) *
                      </label>
                      {alternativeHooks.length > 0 && (
                        <span className="text-xs text-[var(--glp-deep-teal)]">{alternativeHooks.length} alternatives available</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={form.hook}
                      onChange={(e) => handleChange("hook", e.target.value)}
                      placeholder="e.g., Your nervous system isn't broken..."
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.hook ? "border-[var(--glp-blossom)]" : "border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)]"
                      } bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]`}
                      data-testid="input-hook"
                    />
                    {alternativeHooks.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {alternativeHooks.map((hook, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleChange("hook", hook)}
                            className="text-xs px-2 py-1 rounded bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:bg-[var(--glp-sage)] dark:hover:bg-[var(--glp-charcoal)] transition-colors"
                          >
                            {hook.substring(0, 40)}...
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                        Caption *
                      </label>
                      <span className={`text-xs ${isOverLimit ? "text-[var(--glp-blossom)]" : "text-[var(--glp-deep-teal)]"}`}>
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
                        errors.caption ? "border-[var(--glp-blossom)]" : isOverLimit ? "border-[var(--glp-gold)]" : "border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)]"
                      } bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] resize-none`}
                      data-testid="input-caption"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">
                        Call to Action
                      </label>
                      <input
                        type="text"
                        value={form.cta}
                        onChange={(e) => handleChange("cta", e.target.value)}
                        placeholder="e.g., Save this for later..."
                        className="w-full px-4 py-3 rounded-lg border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]"
                        data-testid="input-cta"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">
                        Hashtags
                      </label>
                      <input
                        type="text"
                        value={form.hashtags}
                        onChange={(e) => handleChange("hashtags", e.target.value)}
                        placeholder="#mentalhealth #healing #wellness"
                        className="w-full px-4 py-3 rounded-lg border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]"
                        data-testid="input-hashtags"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">
                      Disclaimer
                    </label>
                    <select
                      value={form.disclaimer}
                      onChange={(e) => handleChange("disclaimer", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]"
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
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                  data-testid="button-save-draft"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
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
              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Compliance Check
                  </h3>
                  {complianceResult.issues?.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRewrite}
                      disabled={rewriteMutation.isPending}
                      className="text-xs px-2 py-1 rounded bg-[var(--glp-sage-10)] text-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage)] flex items-center gap-1"
                      data-testid="button-ai-rewrite"
                    >
                      {rewriteMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin motion-reduce:animate-none" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                      AI Rewrite
                    </button>
                  )}
                </div>
                
                {complianceResult.issues?.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] uppercase">Issues Found</p>
                    {complianceResult.issues.slice(0, 5).map((issue, idx) => (
                      <div key={idx} className="text-sm p-2 rounded bg-[rgba(244,199,195,0.22)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                        <span className="font-medium">"{issue.phrase}"</span>
                        <p className="text-xs mt-1 opacity-80">{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {complianceResult.suggestions?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] uppercase">Suggestions</p>
                    {complianceResult.suggestions.slice(0, 3).map((sug, idx) => (
                      <div key={idx} className="text-sm p-2 rounded bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                        {sug.message}
                      </div>
                    ))}
                  </div>
                )}
                
                {complianceResult.status === "pass" && (
                  <div className="text-sm p-3 rounded bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Content passes trauma-informed guidelines
                  </div>
                )}
              </div>
            )}
            
            {aiGenerated?.contentNotes && (
              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] p-4">
                <h3 className="font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" />
                  AI Notes
                </h3>
                <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                  {aiGenerated.contentNotes}
                </p>
              </div>
            )}
            
            <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[var(--glp-deep-teal)]" />
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
                  className="text-xs px-3 py-1.5 rounded-lg bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:bg-[var(--glp-charcoal)] disabled:opacity-50 flex items-center gap-1"
                  data-testid="button-generate-image"
                >
                  {imageGenerateMutation.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin motion-reduce:animate-none" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  Generate Visual
                </button>
              </div>
              
              {imageError && (
                <div className="p-3 bg-[rgba(244,199,195,0.22)] dark:bg-[var(--glp-deep-teal)] rounded-lg text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {imageError}
                </div>
              )}
              
              {generatedImage?.image ? (
                <div className="space-y-3">
                  <img 
                    src={generatedImage.image} 
                    alt="AI-generated visual" 
                    className="w-full rounded-lg border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)]"
                  />
                  <p className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                    Trauma-informed visual for {generatedImage.platform}
                  </p>
                </div>
              ) : !imageError && (
                <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] text-center py-4">
                  Generate a calming, brand-aligned visual for your post
                </p>
              )}
            </div>
            
            {form.caption && (
              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--glp-deep-teal)]" />
                    Content Enhancement
                  </h3>
                  <div className="flex gap-2">
                    {["engagement", "accessibility", "emotional"].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => enhanceMutation.mutate({ text: form.caption, type })}
                        disabled={enhanceMutation.isPending}
                        className="text-xs px-2 py-1 rounded bg-[var(--glp-sage-10)] text-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage)] capitalize"
                        data-testid={`button-enhance-${type}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {enhanceError && (
                  <div className="p-3 bg-[rgba(244,199,195,0.22)] dark:bg-[var(--glp-deep-teal)] rounded-lg text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {enhanceError}
                  </div>
                )}
                
                {enhanceMutation.isPending && (
                  <div className="flex items-center justify-center py-4 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                    <Loader2 className="w-5 h-5 animate-spin motion-reduce:animate-none mr-2" />
                    Analyzing content...
                  </div>
                )}
                
                {enhancementSuggestions?.suggestions && (
                  <div className="space-y-3">
                    {enhancementSuggestions.suggestions.map((sug, idx) => (
                      <div key={idx} className="p-3 bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] rounded-lg">
                        <p className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-ivory)]">{sug.title}</p>
                        <p className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-1">{sug.description}</p>
                        {sug.example && (
                          <p className="text-xs mt-2 p-2 bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] italic">
                            "{sug.example}"
                          </p>
                        )}
                      </div>
                    ))}
                    
                    {enhancementSuggestions.enhancedVersion && (
                      <div className="pt-3 border-t border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)]">
                        <p className="text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-ivory)] mb-2">Enhanced Version:</p>
                        <p className="text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] p-2 bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded">
                          {enhancementSuggestions.enhancedVersion}
                        </p>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, caption: enhancementSuggestions.enhancedVersion }))}
                          className="mt-2 text-xs px-2 py-1 rounded bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:bg-[var(--glp-charcoal)]"
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
            
            <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] p-4">
              <h3 className="font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-3">
                Trauma-Informed Tips
              </h3>
              <ul className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--glp-sage)] mt-0.5 flex-shrink-0" />
                  Use "you might" instead of "you should"
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--glp-sage)] mt-0.5 flex-shrink-0" />
                  Say "may help" instead of "will fix"
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--glp-sage)] mt-0.5 flex-shrink-0" />
                  Include pacing cues like "at your own pace"
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--glp-sage)] mt-0.5 flex-shrink-0" />
                  Add crisis resources for sensitive topics
                </li>
              </ul>
            </div>

            {form.caption && (
              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] p-4" data-testid="section-canva-export">
                <h3 className="font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-3 flex items-center gap-2">
                  <Save className="w-4 h-4 text-[var(--glp-deep-teal)]" />
                  Canva Export Copy Blocks
                </h3>
                <p className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-3">
                  Copy these pre-formatted text blocks into your Canva designs. Each is sized for a different platform.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Instagram Post (1080x1080)", maxChars: 125, format: (text) => text.substring(0, 125) + (text.length > 125 ? "..." : "") },
                    { label: "Instagram Caption", maxChars: 2200, format: (text) => `${form.hook ? form.hook + "\n\n" : ""}${text}\n\n${form.cta || "If you'd like to explore more, the link is in our bio."}\n\n${form.hashtags || "#GenuineLove #SelfLoveJourney #HealingPath"}` },
                    { label: "Reel / TikTok Caption", maxChars: 300, format: (text) => `${text.substring(0, 250)}${text.length > 250 ? "..." : ""}\n\n${form.hashtags ? form.hashtags.split(" ").slice(0, 5).join(" ") : "#GenuineLove #HealingPath"}` },
                    { label: "YouTube Short Description", maxChars: 500, format: (text) => `${form.hook || ""}\n\n${text.substring(0, 400)}${text.length > 400 ? "..." : ""}\n\n${form.disclaimer || "This content is for educational purposes only."}\n\nLearn more: thegenuineloveproject.com` },
                    { label: "X / Twitter Post", maxChars: 280, format: (text) => text.substring(0, 250) + (text.length > 250 ? "..." : "") + "\n\n" + (form.hashtags ? form.hashtags.split(" ").slice(0, 3).join(" ") : "#GenuineLove") },
                  ].map(({ label, format }) => {
                    const formatted = format(form.caption);
                    return (
                      <div key={label} className="border border-[var(--glp-sage-20)] dark:border-[var(--glp-sage)] rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{label}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(formatted);
                            }}
                            className="text-xs px-2 py-0.5 rounded bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:bg-[var(--glp-sage)] dark:hover:bg-[var(--glp-charcoal)] transition-colors"
                            data-testid={`button-copy-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                          >
                            Copy
                          </button>
                        </div>
                        <pre className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] whitespace-pre-wrap font-sans leading-relaxed max-h-24 overflow-y-auto">
                          {formatted}
                        </pre>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <SafetyFooter />
    </div>
  );
}
