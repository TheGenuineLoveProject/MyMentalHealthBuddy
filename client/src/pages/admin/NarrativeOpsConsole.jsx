import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft, Plus, X, Loader2, Copy, Check, Filter,
  FileText, Clock, CheckCircle, Send, Share2, Eye,
  AlertTriangle, Shield, BarChart3, BookOpen, MessageCircle,
  Instagram, Twitter, Youtube, Globe, Edit, ChevronDown
} from "lucide-react";
import { SiInstagram, SiX, SiTiktok, SiYoutube, SiFacebook, SiLinkedin, SiPinterest } from "react-icons/si";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { useToast } from "@/hooks/use-toast";

const API_BASE = "/api/admin/social/enterprise";

const PLATFORM_INFO = {
  instagram: { name: "Instagram", icon: SiInstagram, color: "#E4405F", charLimit: 2200 },
  tiktok: { name: "TikTok", icon: SiTiktok, color: "#000000", charLimit: 2200 },
  x: { name: "X", icon: SiX, color: "#000000", charLimit: 280 },
  youtube: { name: "YouTube", icon: SiYoutube, color: "#FF0000", charLimit: 5000 },
  facebook: { name: "Facebook", icon: SiFacebook, color: "#1877F2", charLimit: 63206 },
  linkedin: { name: "LinkedIn", icon: SiLinkedin, color: "#0A66C2", charLimit: 3000 },
  threads: { name: "Threads", color: "#000000", charLimit: 500 },
  pinterest: { name: "Pinterest", icon: SiPinterest, color: "#E60023", charLimit: 500 },
};

const STATUS_CONFIG = {
  draft: { label: "Draft", className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300", icon: FileText },
  review: { label: "In Review", className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300", icon: Clock },
  approved: { label: "Approved", className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300", icon: CheckCircle },
  posted: { label: "Posted", className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300", icon: Send },
};

const THEMES = [
  "self-compassion", "boundaries", "healing", "gratitude", "mindfulness",
  "inner-child", "self-worth", "resilience", "emotional-intelligence", "growth",
  "trauma-awareness", "self-love", "community", "purpose"
];

const ORIGIN_TYPES = ["standalone", "blog", "newsletter", "reflection", "campaign"];

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" data-testid={`button-copy-${label}`}>
      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : label || "Copy"}
    </button>
  );
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${config.className}`}>
      <Icon className="w-3 h-3" /> {config.label}
    </span>
  );
}

function CharCount({ text, limit }) {
  const len = (text || "").length;
  const pct = limit ? (len / limit) * 100 : 0;
  const color = pct > 90 ? "text-red-500" : pct > 70 ? "text-amber-500" : "text-gray-400";
  return <span className={`text-xs ${color}`}>{len}{limit ? `/${limit}` : ""}</span>;
}

export default function NarrativeOpsConsole() {
  const [activePanel, setActivePanel] = useState("pipeline");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [markPostedPlatforms, setMarkPostedPlatforms] = useState([]);
  const [showMarkPosted, setShowMarkPosted] = useState(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "", content: "", platform: "instagram", theme: "",
    originType: "standalone", safetyNote: "", crisisLinkRequired: false,
    gentleCtaUrl: "", audience: "", hashtags: "",
    captions: { instagram: "", tiktok: "", x: "", youtube: "" },
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: [API_BASE, "/posts", statusFilter],
    queryFn: async () => {
      const url = statusFilter === "all" ? `${API_BASE}/posts` : `${API_BASE}/posts?status=${statusFilter}`;
      const res = await fetch(url, { credentials: "include" });
      return res.json();
    },
  });

  const { data: signalsData, isLoading: signalsLoading } = useQuery({
    queryKey: [API_BASE, "/signals"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/signals`, { credentials: "include" });
      return res.json();
    },
    enabled: activePanel === "signals",
  });

  const { data: auditData, isLoading: auditLoading } = useQuery({
    queryKey: [API_BASE, "/audit"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/audit`, { credentials: "include" });
      return res.json();
    },
    enabled: activePanel === "audit",
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const isEdit = !!editingPost;
      const res = isEdit
        ? await apiRequest("PUT", `${API_BASE}/post/${editingPost.id}`, data)
        : await apiRequest("POST", `${API_BASE}/post`, data);
      return { ...(await res.json()), _isEdit: isEdit };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/posts"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/audit"] });
      toast({ title: data._isEdit ? "Post updated" : "Draft created" });
      resetForm();
    },
    onError: (err) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const transitionMutation = useMutation({
    mutationFn: async ({ id, action, body }) => {
      try {
        const res = await apiRequest("POST", `${API_BASE}/post/${id}/${action}`, body || {});
        return await res.json();
      } catch (err) {
        let parsed = null;
        const colonIdx = err.message?.indexOf(": ");
        if (colonIdx > 0) {
          try { parsed = JSON.parse(err.message.substring(colonIdx + 2)); } catch {}
        }
        if (parsed) {
          const errObj = new Error(parsed.message || "Action failed");
          errObj.safetyErrors = parsed.errors || [];
          errObj.safetyWarnings = parsed.warnings || [];
          throw errObj;
        }
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/posts"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/audit"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/signals"] });
      toast({ title: data?.message || "Action completed" });
      setSelectedPost(null);
      setShowMarkPosted(null);
    },
    onError: (err) => {
      const parts = [err.message];
      if (err.safetyErrors?.length) parts.push("Blocked: " + err.safetyErrors.join("; "));
      if (err.safetyWarnings?.length) parts.push("Warnings: " + err.safetyWarnings.join("; "));
      toast({ title: "Action failed", description: parts.join("\n"), variant: "destructive" });
    },
  });

  function resetForm() {
    setShowCreateForm(false);
    setEditingPost(null);
    setForm({
      title: "", content: "", platform: "instagram", theme: "",
      originType: "standalone", safetyNote: "", crisisLinkRequired: false,
      gentleCtaUrl: "", audience: "", hashtags: "",
      captions: { instagram: "", tiktok: "", x: "", youtube: "" },
    });
  }

  function handleEdit(post) {
    setEditingPost(post);
    setForm({
      title: post.title || "",
      content: post.content || "",
      platform: post.platform || "instagram",
      theme: post.theme || "",
      originType: post.originType || "standalone",
      safetyNote: post.safetyNote || "",
      crisisLinkRequired: post.crisisLinkRequired === 1,
      gentleCtaUrl: post.gentleCtaUrl || "",
      audience: post.audience || "",
      hashtags: post.hashtags || "",
      captions: post.captions || { instagram: "", tiktok: "", x: "", youtube: "" },
    });
    setShowCreateForm(true);
    setActivePanel("pipeline");
  }

  const posts = postsData?.data || [];
  const signals = signalsData?.data || {};
  const auditEvents = auditData?.data || [];

  const statusCounts = {};
  posts.forEach(p => { statusCounts[p.status] = (statusCounts[p.status] || 0) + 1; });

  const panels = [
    { key: "pipeline", label: "Pipeline", icon: FileText },
    { key: "signals", label: "Signals", icon: BarChart3 },
    { key: "audit", label: "Audit Log", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:underline mb-6" data-testid="link-back-admin">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-ops-title">
            Narrative Operations Console
          </h1>
          <span className="text-xs px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">
            Enterprise v3.0
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Manual-first. Human-in-the-loop. No auto-posting. Ethical publishing only.
        </p>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {["draft", "review", "approved", "posted"].map(status => {
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            const count = statusCounts[status] || 0;
            return (
              <button
                key={status}
                onClick={() => { setStatusFilter(statusFilter === status ? "all" : status); setActivePanel("pipeline"); }}
                className={`rounded-xl p-4 text-center transition-all border ${statusFilter === status ? "ring-2 ring-slate-400 dark:ring-slate-500" : "hover:shadow-md"} ${config.className} border-transparent`}
                data-testid={`stat-social-${status}`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1 opacity-60" />
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs font-medium">{config.label}</div>
              </button>
            );
          })}
        </div>

        {/* Panel Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {panels.map(panel => (
            <button
              key={panel.key}
              onClick={() => setActivePanel(panel.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePanel === panel.key
                  ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-gray-900"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              data-testid={`tab-${panel.key}`}
            >
              <panel.icon className="w-4 h-4" /> {panel.label}
            </button>
          ))}
        </div>

        {/* ===== PIPELINE PANEL ===== */}
        {activePanel === "pipeline" && (
          <div className="space-y-4">
            {/* Create / Edit Form */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="text-sm px-2 py-1 rounded border dark:border-gray-600 bg-white dark:bg-gray-700" data-testid="select-ops-filter">
                  <option value="all">All ({posts.length})</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label} ({statusCounts[k] || 0})</option>
                  ))}
                </select>
              </div>
              <button onClick={() => { resetForm(); setShowCreateForm(true); }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-gray-900 hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
                data-testid="button-create-social">
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>

            {showCreateForm && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">{editingPost ? `Editing: ${editingPost.title}` : "Create New Post"}</h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600" data-testid="button-cancel-social"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Title *</label>
                      <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                        placeholder="Internal title for this post..."
                        className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-slate-400 outline-none"
                        data-testid="input-social-title" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Main Content *</label>
                      <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                        rows={4} placeholder="Your compassionate, healing-focused content..."
                        className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-slate-400 outline-none resize-y"
                        data-testid="textarea-social-content" />
                      <CharCount text={form.content} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Primary Platform</label>
                        <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" data-testid="select-social-platform">
                          {Object.entries(PLATFORM_INFO).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Theme</label>
                        <select value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" data-testid="select-social-theme">
                          <option value="">Select theme...</option>
                          {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Origin</label>
                        <select value={form.originType} onChange={e => setForm({ ...form, originType: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" data-testid="select-social-origin">
                          {ORIGIN_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Audience</label>
                        <input type="text" value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}
                          placeholder="e.g., Healing beginners"
                          className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 outline-none"
                          data-testid="input-social-audience" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Hashtags</label>
                      <input type="text" value={form.hashtags} onChange={e => setForm({ ...form, hashtags: e.target.value })}
                        placeholder="#genuinelove #healing #selfcare"
                        className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 outline-none"
                        data-testid="input-social-hashtags" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Gentle CTA URL</label>
                      <input type="text" value={form.gentleCtaUrl} onChange={e => setForm({ ...form, gentleCtaUrl: e.target.value })}
                        placeholder="https://thegenuineloveproject.com/blog/..."
                        className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 outline-none"
                        data-testid="input-social-cta" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Safety Note * <Shield className="w-3 h-3 inline" /></label>
                      <textarea value={form.safetyNote} onChange={e => setForm({ ...form, safetyNote: e.target.value })}
                        rows={2} placeholder="Why is this post safe to publish? Any considerations..."
                        className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-slate-400 outline-none resize-y"
                        data-testid="textarea-social-safety" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={form.crisisLinkRequired}
                        onChange={e => setForm({ ...form, crisisLinkRequired: e.target.checked })}
                        className="rounded" data-testid="checkbox-crisis-required" />
                      <label className="text-xs text-gray-600 dark:text-gray-400">Crisis link required in this content</label>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-3">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Platform Captions</h4>
                      {["instagram", "tiktok", "x", "youtube"].map(platform => {
                        const info = PLATFORM_INFO[platform];
                        return (
                          <div key={platform} className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">{info.name}</label>
                              <CharCount text={form.captions[platform]} limit={info.charLimit} />
                            </div>
                            <textarea
                              value={form.captions[platform] || ""}
                              onChange={e => setForm({ ...form, captions: { ...form.captions, [platform]: e.target.value } })}
                              rows={2} placeholder={`${info.name} caption...`}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 outline-none resize-y"
                              data-testid={`textarea-caption-${platform}`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => createMutation.mutate(form)}
                    disabled={!form.title.trim() || !form.content.trim() || !form.safetyNote.trim() || createMutation.isPending}
                    className="px-4 py-2 text-sm rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-gray-900 hover:bg-slate-700 disabled:opacity-50"
                    data-testid="button-save-social">
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingPost ? "Update Post" : "Save Draft"}
                  </button>
                  <button onClick={resetForm} className="px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300" data-testid="button-cancel-form">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Posts Pipeline */}
            {postsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No posts found. Create your first narrative post above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 hover:shadow-md transition-all"
                    data-testid={`card-social-${post.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <StatusBadge status={post.status} />
                          {post.theme && <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">{post.theme}</span>}
                          {post.originType && post.originType !== "standalone" && (
                            <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300">from: {post.originType}</span>
                          )}
                          {post.crisisLinkRequired === 1 && <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300">crisis link required</span>}
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{post.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{post.content}</p>
                        {post.gentleCtaUrl && <p className="text-xs text-blue-500 mt-1 truncate">CTA: {post.gentleCtaUrl}</p>}
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        {(post.status === "draft" || post.status === "review") && (
                          <button onClick={() => handleEdit(post)}
                            className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300" data-testid={`button-edit-social-${post.id}`}>
                            Edit
                          </button>
                        )}
                        {post.status === "draft" && (
                          <button onClick={() => transitionMutation.mutate({ id: post.id, action: "submit" })}
                            disabled={transitionMutation.isPending}
                            className="text-xs px-2 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                            data-testid={`button-submit-social-${post.id}`}>
                            Submit
                          </button>
                        )}
                        {post.status === "review" && (
                          <button onClick={() => transitionMutation.mutate({ id: post.id, action: "approve" })}
                            disabled={transitionMutation.isPending}
                            className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                            data-testid={`button-approve-social-${post.id}`}>
                            Approve
                          </button>
                        )}
                        {post.status === "approved" && (
                          <button onClick={() => { setShowMarkPosted(post.id); setMarkPostedPlatforms([]); }}
                            className="text-xs px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                            data-testid={`button-markposted-social-${post.id}`}>
                            Mark Posted
                          </button>
                        )}
                        <button onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                          className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                          data-testid={`button-detail-social-${post.id}`}>
                          <Eye className="w-3 h-3 inline" /> Detail
                        </button>
                      </div>
                    </div>

                    {/* Mark Posted Panel */}
                    {showMarkPosted === post.id && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-2">Select platforms where this was posted:</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {Object.entries(PLATFORM_INFO).map(([key, info]) => (
                            <button key={key}
                              onClick={() => setMarkPostedPlatforms(prev =>
                                prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
                              )}
                              className={`text-xs px-2 py-1 rounded transition-colors ${
                                markPostedPlatforms.includes(key)
                                  ? "bg-green-600 text-white"
                                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border"
                              }`} data-testid={`button-platform-${key}`}>
                              {info.name}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => transitionMutation.mutate({ id: post.id, action: "mark-posted", body: { platforms: markPostedPlatforms } })}
                            disabled={markPostedPlatforms.length === 0 || transitionMutation.isPending}
                            className="text-xs px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            data-testid="button-confirm-posted">
                            Confirm Posted
                          </button>
                          <button onClick={() => setShowMarkPosted(null)}
                            className="text-xs px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Detail Panel (Post Detail + Platform Copy) */}
                    {selectedPost?.id === post.id && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Narrative Lineage & Safety */}
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-2 text-xs">
                          <h4 className="font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Narrative Lineage</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div><span className="text-gray-400">Origin:</span> <span className="font-medium">{post.originType || "standalone"}</span></div>
                            <div><span className="text-gray-400">Theme:</span> <span className="font-medium">{post.theme || "—"}</span></div>
                            <div><span className="text-gray-400">Audience:</span> <span className="font-medium">{post.audience || "—"}</span></div>
                            <div><span className="text-gray-400">Platform:</span> <span className="font-medium">{post.platform}</span></div>
                          </div>
                          {post.gentleCtaUrl && <div><span className="text-gray-400">CTA:</span> <span className="text-blue-500">{post.gentleCtaUrl}</span></div>}
                          <div className="border-t dark:border-gray-700 pt-2 mt-2">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">Safety</h4>
                            <p className="text-gray-600 dark:text-gray-400">{post.safetyNote || "No safety note"}</p>
                            {post.crisisLinkRequired === 1 && <p className="text-red-500 font-medium mt-1">Crisis link required</p>}
                          </div>
                          <div className="border-t dark:border-gray-700 pt-2 mt-2">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">Timestamps</h4>
                            <div className="space-y-1">
                              <div><span className="text-gray-400">Created:</span> {post.createdAt ? new Date(post.createdAt).toLocaleString() : "—"} {post.createdBy && <span className="text-gray-500">by {post.createdBy}</span>}</div>
                              <div><span className="text-gray-400">Reviewed:</span> {post.reviewedAt ? new Date(post.reviewedAt).toLocaleString() : "—"} {post.reviewedBy && <span className="text-gray-500">by {post.reviewedBy}</span>}</div>
                              <div><span className="text-gray-400">Approved:</span> {post.approvedAt ? new Date(post.approvedAt).toLocaleString() : "—"} {post.approvedBy && <span className="text-gray-500">by {post.approvedBy}</span>}</div>
                              <div><span className="text-gray-400">Posted:</span> {post.postedAt ? new Date(post.postedAt).toLocaleString() : "—"}</div>
                              {post.postedPlatforms && Array.isArray(post.postedPlatforms) && post.postedPlatforms.length > 0 && (
                                <div><span className="text-gray-400">Posted on:</span> {post.postedPlatforms.join(", ")}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Platform Copy Panel */}
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-2 text-xs">
                          <h4 className="font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Platform Captions</h4>
                          {post.captions && typeof post.captions === "object" ? (
                            Object.entries(post.captions).filter(([, v]) => v).map(([platform, caption]) => {
                              const info = PLATFORM_INFO[platform];
                              return (
                                <div key={platform} className="p-2 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium capitalize">{info?.name || platform}</span>
                                    <div className="flex items-center gap-2">
                                      <CharCount text={caption} limit={info?.charLimit} />
                                      <CopyBtn text={caption} label={platform} />
                                    </div>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{caption}</p>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-gray-400">No platform captions added.</p>
                          )}
                          {post.hashtags && (
                            <div className="p-2 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">Hashtags</span>
                                <CopyBtn text={post.hashtags} label="hashtags" />
                              </div>
                              <p className="text-gray-600 dark:text-gray-400">{post.hashtags}</p>
                            </div>
                          )}
                          {post.content && (
                            <div className="p-2 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">Full Content</span>
                                <CopyBtn text={post.content} label="content" />
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap line-clamp-6">{post.content}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Content safety checks run before approval. Posts with medical claims, urgency manipulation, or pathologizing language will be blocked. Sensitive topics require crisis resource links.</span>
            </div>
          </div>
        )}

        {/* ===== SIGNALS PANEL ===== */}
        {activePanel === "signals" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-1" data-testid="text-signals-title">Signal Awareness</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Read-only insights. No scraping. No shadow tracking. Privacy-first analytics.</p>

            {signalsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Suggested Focus */}
                {signals.suggestedFocus?.length > 0 && (
                  <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Suggested Narrative Focus</h3>
                    <ul className="space-y-1">
                      {signals.suggestedFocus.map((s, i) => (
                        <li key={i} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                          <BarChart3 className="w-3 h-3 mt-1 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Top Themes */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Top Posted Themes</h3>
                  {signals.topThemes?.length > 0 ? (
                    <div className="space-y-2">
                      {signals.topThemes.map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                          <span className="text-sm capitalize">{t.theme || "untagged"}</span>
                          <span className="text-xs font-medium text-gray-500">{t.count} posts</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-gray-400">No theme data yet.</p>}
                </div>

                {/* Recent Blog Activity */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Blog Activity (7 days)</h3>
                  {signals.recentBlogActivity?.length > 0 ? (
                    <div className="space-y-2">
                      {signals.recentBlogActivity.map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                          <div className="min-w-0">
                            <span className="text-sm truncate block">{a.path || "—"}</span>
                            <span className="text-xs text-gray-400">{a.eventName}</span>
                          </div>
                          <span className="text-xs font-medium text-gray-500 shrink-0">{a.count} events</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-gray-400">No blog activity in the last 7 days.</p>}
                </div>

                {/* Status Counts */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pipeline Status Overview</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(signals.statusCounts || {}).map(([status, count]) => {
                      const config = STATUS_CONFIG[status];
                      return config ? (
                        <div key={status} className={`rounded-lg p-3 text-center ${config.className}`}>
                          <div className="text-xl font-bold">{count}</div>
                          <div className="text-xs">{config.label}</div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== AUDIT PANEL ===== */}
        {activePanel === "audit" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-1" data-testid="text-audit-title">Audit Log</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Immutable record of all editorial actions. Who created, reviewed, approved, and posted.</p>

            {auditLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : auditEvents.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No audit events recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {auditEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm"
                    data-testid={`audit-event-${event.id}`}>
                    <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {event.type.replace(/_/g, " ").replace(/social /i, "")}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">
                          {event.createdAt ? new Date(event.createdAt).toLocaleString() : "—"}
                        </span>
                      </div>
                      {event.meta && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {event.meta.title && <span>Post: "{event.meta.title}" </span>}
                          {event.meta.createdBy && <span>by {event.meta.createdBy} </span>}
                          {event.meta.submittedBy && <span>by {event.meta.submittedBy} </span>}
                          {event.meta.approvedBy && <span>by {event.meta.approvedBy} </span>}
                          {event.meta.editedBy && <span>by {event.meta.editedBy} </span>}
                          {event.meta.postedBy && <span>by {event.meta.postedBy} </span>}
                          {event.meta.platforms && <span>on {event.meta.platforms.join(", ")} </span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <SafetyFooter variant="compact" className="mt-8" />
      </div>
    </div>
  );
}
