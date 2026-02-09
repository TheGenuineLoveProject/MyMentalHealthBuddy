import { useState, useCallback } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft, Plus, X, Loader2, Copy, Check, Filter,
  FileText, Clock, CheckCircle, Send, Eye,
  AlertTriangle, Shield, BarChart3, BookOpen,
  Calendar, Target, Link2, ExternalLink, ChevronDown, ChevronRight,
  Megaphone, Zap, TrendingUp, Clipboard, Search, RefreshCw, AlertCircle
} from "lucide-react";
import { SiInstagram, SiX, SiTiktok, SiYoutube, SiFacebook, SiLinkedin, SiPinterest } from "react-icons/si";
import { queryClient, apiRequest } from "../../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { SEO } from "../../components/SEO";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

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

const NAV_TABS = [
  { key: "pipeline", label: "Pipeline", icon: FileText },
  { key: "campaigns", label: "Campaigns", icon: Target },
  { key: "weekly", label: "Weekly Queue", icon: Calendar },
  { key: "utm", label: "UTM Builder", icon: Link2 },
  { key: "signals", label: "Signals", icon: BarChart3 },
  { key: "audit", label: "Audit Log", icon: Shield },
];

const CTA_DESTINATIONS = [
  { label: "Blog", path: "/blog" },
  { label: "Newsletter", path: "/newsletter" },
  { label: "Pricing", path: "/pricing" },
  { label: "Tools", path: "/tools" },
  { label: "Crisis", path: "/crisis" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Mood Tracker", path: "/mood" },
  { label: "Journal", path: "/journal" },
];

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text || "").then(() => {
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
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${config.className}`} data-testid={`badge-status-${status}`}>
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

function SectionCard({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          {Icon && <Icon className="w-4 h-4 text-slate-500" />}
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function NarrativeOpsConsole() {
  const [activePanel, setActivePanel] = useState("pipeline");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [markPostedPlatforms, setMarkPostedPlatforms] = useState([]);
  const [showMarkPosted, setShowMarkPosted] = useState(null);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [utmForm, setUtmForm] = useState({ baseUrl: "", source: "instagram", medium: "social", campaign: "", content: "" });
  const [utmResult, setUtmResult] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [campaignForm, setCampaignForm] = useState({ name: "", goal: "", startDate: "", endDate: "" });
  const { toast } = useToast();

  const emptyForm = {
    title: "", content: "", platform: "instagram", theme: "",
    originType: "standalone", safetyNote: "", crisisLinkRequired: false,
    gentleCtaUrl: "", audience: "", hashtags: "",
    captions: { instagram: "", tiktok: "", x: "", youtube: "", facebook: "", linkedin: "" },
    campaignId: "", canvaUrl: "", mediaAssetUrl: "", scheduledFor: "",
  };
  const [form, setForm] = useState(emptyForm);

  const buildQueryUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (campaignFilter !== "all") params.set("campaign_id", campaignFilter);
    const qs = params.toString();
    return qs ? `${API_BASE}/posts?${qs}` : `${API_BASE}/posts`;
  }, [statusFilter, campaignFilter]);

  const { data: postsData, isLoading: postsLoading, error, refetch } = useQuery({
    queryKey: [API_BASE, "/posts", statusFilter, campaignFilter],
    queryFn: async () => {
      const res = await fetch(buildQueryUrl(), { credentials: "include" });
      return res.json();
    },
  });

  const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
    queryKey: [API_BASE, "/campaigns"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/campaigns`, { credentials: "include" });
      return res.json();
    },
  });

  const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
    queryKey: [API_BASE, "/weekly-queue"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/weekly-queue`, { credentials: "include" });
      return res.json();
    },
    enabled: activePanel === "weekly",
  });

  const { data: signalsData, isLoading: signalsLoading } = useQuery({
    queryKey: [API_BASE, "/signals"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/signals`, { credentials: "include" });
      return res.json();
    },
    enabled: activePanel === "signals",
  });

  const { data: clickData } = useQuery({
    queryKey: [API_BASE, "/click-stats"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/click-stats`, { credentials: "include" });
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

  const { data: blogData } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const res = await fetch("/api/blog?limit=20", { credentials: "include" });
      return res.json();
    },
    enabled: activePanel === "pipeline",
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
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/weekly-queue"] });
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
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/weekly-queue"] });
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

  const campaignMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", `${API_BASE}/campaigns`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/campaigns"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/audit"] });
      toast({ title: "Campaign created" });
      setShowCampaignForm(false);
      setCampaignForm({ name: "", goal: "", startDate: "", endDate: "" });
    },
    onError: (err) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const scheduleMutation = useMutation({
    mutationFn: async ({ id, scheduledFor }) => {
      const res = await apiRequest("POST", `${API_BASE}/post/${id}/schedule`, { scheduledFor });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/posts"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/weekly-queue"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/audit"] });
      toast({ title: "Post scheduled" });
      setShowScheduleModal(null);
      setScheduleDate("");
    },
    onError: (err) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const utmMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", `${API_BASE}/build-utm`, data);
      return res.json();
    },
    onSuccess: (data) => {
      setUtmResult(data?.data?.utmUrl || data?.utmUrl || "");
      toast({ title: "UTM link generated" });
    },
    onError: (err) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const blogToSocialMutation = useMutation({
    mutationFn: async ({ blogPostId, campaignId }) => {
      const res = await apiRequest("POST", `${API_BASE}/generate-from-blog`, { blogPostId, campaignId });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/posts"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "/audit"] });
      toast({ title: data?.message || "Drafts generated" });
    },
    onError: (err) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  function resetForm() {
    setShowCreateForm(false);
    setEditingPost(null);
    setForm(emptyForm);
  }

  function openEdit(post) {
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
      captions: post.captions || { instagram: "", tiktok: "", x: "", youtube: "", facebook: "", linkedin: "" },
      campaignId: post.campaignId || "",
      canvaUrl: post.canvaUrl || "",
      mediaAssetUrl: post.mediaAssetUrl || "",
      scheduledFor: post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : "",
    });
    setShowCreateForm(true);
  }

  function handleSubmitForm(e) {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      crisisLinkRequired: form.crisisLinkRequired ? 1 : 0,
      campaignId: form.campaignId || null,
      scheduledFor: form.scheduledFor || null,
    });
  }

  const posts = postsData?.data || postsData || [];
  const campaigns = campaignsData?.data || campaignsData || [];
  const weeklyPosts = weeklyData?.data || weeklyData || [];
  const signals = signalsData?.data || signalsData || {};
  const clicks = clickData?.data || clickData || [];
  const audit = auditData?.data || auditData || [];
  const blogs = blogData?.posts || blogData?.data || blogData || [];

  const postsByStatus = {
    draft: (Array.isArray(posts) ? posts : []).filter(p => p.status === "draft"),
    review: (Array.isArray(posts) ? posts : []).filter(p => p.status === "review"),
    approved: (Array.isArray(posts) ? posts : []).filter(p => p.status === "approved"),
    posted: (Array.isArray(posts) ? posts : []).filter(p => p.status === "posted"),
  };

  const getCampaignName = (id) => {
    if (!id) return "No Campaign";
    const c = (Array.isArray(campaigns) ? campaigns : []).find(c => c.id === id);
    return c?.name || "Unknown";
  };

  if (error) {
    return <AdminErrorBanner title="Unable to load narrative ops console" onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title="Narrative Ops Console — Admin" noindex />
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '0.5rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} />
          Back to Command Center
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/social" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" data-testid="link-back-social">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-page-title">
              Enterprise Social + Publishing Ops
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Campaigns, editorial pipeline, UTM tracking, weekly queue — manual-first
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700">
          {NAV_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActivePanel(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                  activePanel === tab.key
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-b-0 border-slate-200 dark:border-slate-700"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
                data-testid={`tab-${tab.key}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activePanel === "pipeline" && (
          <PipelinePanel
            posts={posts}
            postsByStatus={postsByStatus}
            postsLoading={postsLoading}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            campaignFilter={campaignFilter}
            setCampaignFilter={setCampaignFilter}
            campaigns={campaigns}
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
            showCreateForm={showCreateForm}
            setShowCreateForm={setShowCreateForm}
            editingPost={editingPost}
            form={form}
            setForm={setForm}
            handleSubmitForm={handleSubmitForm}
            createMutation={createMutation}
            transitionMutation={transitionMutation}
            markPostedPlatforms={markPostedPlatforms}
            setMarkPostedPlatforms={setMarkPostedPlatforms}
            showMarkPosted={showMarkPosted}
            setShowMarkPosted={setShowMarkPosted}
            openEdit={openEdit}
            resetForm={resetForm}
            getCampaignName={getCampaignName}
            showScheduleModal={showScheduleModal}
            setShowScheduleModal={setShowScheduleModal}
            scheduleDate={scheduleDate}
            setScheduleDate={setScheduleDate}
            scheduleMutation={scheduleMutation}
            blogs={blogs}
            blogToSocialMutation={blogToSocialMutation}
          />
        )}

        {activePanel === "campaigns" && (
          <CampaignsPanel
            campaigns={campaigns}
            campaignsLoading={campaignsLoading}
            showCampaignForm={showCampaignForm}
            setShowCampaignForm={setShowCampaignForm}
            campaignForm={campaignForm}
            setCampaignForm={setCampaignForm}
            campaignMutation={campaignMutation}
            postsByStatus={postsByStatus}
            posts={posts}
          />
        )}

        {activePanel === "weekly" && (
          <WeeklyQueuePanel
            weeklyPosts={weeklyPosts}
            weeklyLoading={weeklyLoading}
            getCampaignName={getCampaignName}
            setSelectedPost={setSelectedPost}
            setActivePanel={setActivePanel}
          />
        )}

        {activePanel === "utm" && (
          <UTMBuilderPanel
            utmForm={utmForm}
            setUtmForm={setUtmForm}
            utmResult={utmResult}
            setUtmResult={setUtmResult}
            utmMutation={utmMutation}
          />
        )}

        {activePanel === "signals" && (
          <SignalsPanel signals={signals} clicks={clicks} signalsLoading={signalsLoading} />
        )}

        {activePanel === "audit" && (
          <AuditPanel audit={audit} auditLoading={auditLoading} />
        )}

        <SafetyFooter />
      </div>
    </div>
  );
}

function PipelinePanel({
  posts, postsByStatus, postsLoading, statusFilter, setStatusFilter,
  campaignFilter, setCampaignFilter, campaigns,
  selectedPost, setSelectedPost, showCreateForm, setShowCreateForm,
  editingPost, form, setForm, handleSubmitForm, createMutation,
  transitionMutation, markPostedPlatforms, setMarkPostedPlatforms,
  showMarkPosted, setShowMarkPosted, openEdit, resetForm, getCampaignName,
  showScheduleModal, setShowScheduleModal, scheduleDate, setScheduleDate, scheduleMutation,
  blogs, blogToSocialMutation
}) {
  const [expandedColumn, setExpandedColumn] = useState(null);
  const [platformTab, setPlatformTab] = useState("instagram");
  const [showBlogGenerator, setShowBlogGenerator] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            data-testid="select-status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="approved">Approved</option>
            <option value="posted">Posted</option>
          </select>
        </div>
        <select
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          data-testid="select-campaign-filter"
        >
          <option value="all">All Campaigns</option>
          {(Array.isArray(campaigns) ? campaigns : []).map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <div className="flex-1" />
        <button
          onClick={() => setShowBlogGenerator(!showBlogGenerator)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          data-testid="button-blog-generator"
        >
          <Zap className="w-4 h-4" />
          Generate from Blog
        </button>
        <button
          onClick={() => { resetForm(); setShowCreateForm(true); }}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
          data-testid="button-create-post"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {showBlogGenerator && (
        <SectionCard title="Generate 7 Social Drafts from Blog Post" icon={BookOpen}>
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Select a blog post to automatically generate 7 social drafts (micro-tool, quote, story, demo, newsletter bridge, invitation, authority). All created as drafts — human review required.</p>
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {(Array.isArray(blogs) ? blogs : []).map(blog => (
                <button
                  key={blog.id}
                  onClick={() => blogToSocialMutation.mutate({ blogPostId: blog.id })}
                  disabled={blogToSocialMutation.isPending}
                  className="flex items-center justify-between p-2 text-left text-sm rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  data-testid={`button-generate-from-blog-${blog.id}`}
                >
                  <span className="truncate">{blog.title}</span>
                  <Zap className="w-3 h-3 text-purple-500 flex-shrink-0 ml-2" />
                </button>
              ))}
              {(!blogs || blogs.length === 0) && <p className="text-xs text-slate-400">No blog posts found.</p>}
            </div>
            {blogToSocialMutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating drafts...
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {showCreateForm && (
        <PostEditorForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmitForm}
          onCancel={resetForm}
          isEdit={!!editingPost}
          isPending={createMutation.isPending}
          campaigns={campaigns}
          platformTab={platformTab}
          setPlatformTab={setPlatformTab}
        />
      )}

      {postsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {["draft", "review", "approved", "posted"].map(status => (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <StatusBadge status={status} />
                <span className="text-xs text-slate-400">{postsByStatus[status]?.length || 0}</span>
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {(postsByStatus[status] || []).map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelect={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                    isSelected={selectedPost?.id === post.id}
                    onAction={(action, body) => transitionMutation.mutate({ id: post.id, action, body })}
                    onEdit={() => openEdit(post)}
                    onMarkPosted={() => { setShowMarkPosted(post); setMarkPostedPlatforms([]); }}
                    onSchedule={() => { setShowScheduleModal(post); setScheduleDate(""); }}
                    getCampaignName={getCampaignName}
                    isPending={transitionMutation.isPending}
                  />
                ))}
                {(postsByStatus[status] || []).length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No posts</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPost && (
        <PostDetailPanel
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          getCampaignName={getCampaignName}
          platformTab={platformTab}
          setPlatformTab={setPlatformTab}
        />
      )}

      {showMarkPosted && (
        <MarkPostedModal
          post={showMarkPosted}
          platforms={markPostedPlatforms}
          setPlatforms={setMarkPostedPlatforms}
          onConfirm={() => transitionMutation.mutate({ id: showMarkPosted.id, action: "mark-posted", body: { platforms: markPostedPlatforms } })}
          onClose={() => setShowMarkPosted(null)}
          isPending={transitionMutation.isPending}
        />
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Schedule Post</h3>
            <p className="text-sm text-slate-500 mb-3">{showScheduleModal.title || showScheduleModal.content?.substring(0, 60)}</p>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white mb-4"
              data-testid="input-schedule-date"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowScheduleModal(null)} className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400" data-testid="button-cancel-schedule">Cancel</button>
              <button
                onClick={() => scheduleMutation.mutate({ id: showScheduleModal.id, scheduledFor: scheduleDate })}
                disabled={!scheduleDate || scheduleMutation.isPending}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                data-testid="button-confirm-schedule"
              >
                {scheduleMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onSelect, isSelected, onAction, onEdit, onMarkPosted, onSchedule, getCampaignName, isPending }) {
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-sm"
      }`}
      data-testid={`card-post-${post.id}`}
    >
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 mb-1">
        {post.title || post.content?.substring(0, 80)}
      </p>
      <div className="flex flex-wrap gap-1 mb-2">
        {post.theme && (
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">
            {post.theme}
          </span>
        )}
        {post.campaignId && (
          <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400">
            {getCampaignName(post.campaignId)}
          </span>
        )}
        {post.scheduledFor && (
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
            <Calendar className="w-2.5 h-2.5" />
            {new Date(post.scheduledFor).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          {post.status === "draft" && (
            <>
              <button onClick={onEdit} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300" data-testid={`button-edit-${post.id}`}>Edit</button>
              <button onClick={() => onAction("submit")} disabled={isPending} className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 hover:bg-amber-200" data-testid={`button-submit-${post.id}`}>Submit</button>
              <button onClick={onSchedule} className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200" data-testid={`button-schedule-${post.id}`}><Calendar className="w-3 h-3" /></button>
            </>
          )}
          {post.status === "review" && (
            <>
              <button onClick={onEdit} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300" data-testid={`button-edit-review-${post.id}`}>Edit</button>
              <button onClick={() => onAction("approve")} disabled={isPending} className="px-2 py-0.5 rounded bg-green-100 text-green-700 hover:bg-green-200" data-testid={`button-approve-${post.id}`}>Approve</button>
            </>
          )}
          {post.status === "approved" && (
            <>
              <button onClick={onMarkPosted} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center gap-0.5" data-testid={`button-mark-posted-${post.id}`}><Send className="w-3 h-3" />Post</button>
              <button onClick={onSchedule} className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200" data-testid={`button-schedule-approved-${post.id}`}><Calendar className="w-3 h-3" /></button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PostEditorForm({ form, setForm, onSubmit, onCancel, isEdit, isPending, campaigns, platformTab, setPlatformTab }) {
  const updateCaption = (platform, value) => {
    setForm(f => ({ ...f, captions: { ...f.captions, [platform]: value } }));
  };

  return (
    <SectionCard title={isEdit ? "Edit Post" : "Create New Post"} icon={FileText} className="mb-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="Post title"
              data-testid="input-title"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Theme</label>
              <select value={form.theme} onChange={(e) => setForm(f => ({ ...f, theme: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-testid="select-theme">
                <option value="">Select theme</option>
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Campaign</label>
              <select value={form.campaignId} onChange={(e) => setForm(f => ({ ...f, campaignId: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-testid="select-campaign">
                <option value="">No campaign</option>
                {(Array.isArray(campaigns) ? campaigns : []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Content (primary)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
            rows={3}
            className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Main content..."
            required
            data-testid="textarea-content"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Platform Captions</label>
          <div className="flex gap-1 mb-2 flex-wrap">
            {Object.entries(PLATFORM_INFO).map(([key, info]) => {
              const Icon = info.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPlatformTab(key)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    platformTab === key ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                  data-testid={`tab-platform-${key}`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {info.name}
                </button>
              );
            })}
          </div>
          <div className="relative">
            <textarea
              value={form.captions[platformTab] || ""}
              onChange={(e) => updateCaption(platformTab, e.target.value)}
              rows={3}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder={`${PLATFORM_INFO[platformTab]?.name} caption...`}
              data-testid={`textarea-caption-${platformTab}`}
            />
            <div className="absolute bottom-2 right-2">
              <CharCount text={form.captions[platformTab]} limit={PLATFORM_INFO[platformTab]?.charLimit} />
            </div>
          </div>
          <div className="flex gap-1 mt-1">
            <CopyBtn text={form.captions[platformTab]} label={PLATFORM_INFO[platformTab]?.name} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Safety Note *</label>
            <input
              value={form.safetyNote}
              onChange={(e) => setForm(f => ({ ...f, safetyNote: e.target.value }))}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="e.g. Educational only. Not therapy."
              required
              data-testid="input-safety-note"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">CTA URL</label>
            <select value={form.gentleCtaUrl} onChange={(e) => setForm(f => ({ ...f, gentleCtaUrl: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-testid="select-cta">
              <option value="">Select destination</option>
              {CTA_DESTINATIONS.map(d => <option key={d.path} value={d.path}>{d.label} ({d.path})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Origin Type</label>
            <select value={form.originType} onChange={(e) => setForm(f => ({ ...f, originType: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-testid="select-origin">
              {ORIGIN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Canva URL</label>
            <input
              value={form.canvaUrl}
              onChange={(e) => setForm(f => ({ ...f, canvaUrl: e.target.value }))}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="https://www.canva.com/design/..."
              data-testid="input-canva-url"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Media Asset URL</label>
            <input
              value={form.mediaAssetUrl}
              onChange={(e) => setForm(f => ({ ...f, mediaAssetUrl: e.target.value }))}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="Image/video URL..."
              data-testid="input-media-url"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Scheduled For</label>
            <input
              type="datetime-local"
              value={form.scheduledFor}
              onChange={(e) => setForm(f => ({ ...f, scheduledFor: e.target.value }))}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              data-testid="input-scheduled-for"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Hashtags</label>
            <input
              value={form.hashtags}
              onChange={(e) => setForm(f => ({ ...f, hashtags: e.target.value }))}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="#selflove #healing #mentalwellness"
              data-testid="input-hashtags"
            />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.crisisLinkRequired}
                onChange={(e) => setForm(f => ({ ...f, crisisLinkRequired: e.target.checked }))}
                className="rounded"
                data-testid="checkbox-crisis-link"
              />
              Crisis link required
            </label>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" data-testid="button-cancel-form">Cancel</button>
          <button type="submit" disabled={isPending} className="px-4 py-2 text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 disabled:opacity-50 flex items-center gap-2" data-testid="button-submit-form">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Update Post" : "Create Draft"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}

function PostDetailPanel({ post, onClose, getCampaignName, platformTab, setPlatformTab }) {
  return (
    <SectionCard title="Post Details" icon={Eye} className="mt-4">
      <button onClick={onClose} className="absolute top-3 right-4 text-slate-400 hover:text-slate-600" data-testid="button-close-detail">
        <X className="w-4 h-4" />
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <span className="text-xs font-medium text-slate-500">Title</span>
            <p className="text-sm text-slate-800 dark:text-slate-200">{post.title || "Untitled"}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Content</span>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.content}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs font-medium text-slate-500">Status</span>
              <div><StatusBadge status={post.status} /></div>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Theme</span>
              <p className="text-sm text-slate-700 dark:text-slate-300">{post.theme || "—"}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Campaign</span>
              <p className="text-sm text-slate-700 dark:text-slate-300">{getCampaignName(post.campaignId)}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Safety Note</span>
              <p className="text-sm text-slate-700 dark:text-slate-300">{post.safetyNote || "—"}</p>
            </div>
          </div>
          {post.canvaUrl && (
            <div>
              <span className="text-xs font-medium text-slate-500">Canva</span>
              <a href={post.canvaUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                Open in Canva <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          {post.utmUrl && (
            <div>
              <span className="text-xs font-medium text-slate-500">UTM Link</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-xs">{post.utmUrl}</span>
                <CopyBtn text={post.utmUrl} label="UTM" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
            {post.createdBy && <div>Created: {post.createdBy}</div>}
            {post.reviewedBy && <div>Reviewed: {post.reviewedBy}</div>}
            {post.approvedBy && <div>Approved: {post.approvedBy}</div>}
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 mb-2 block">Platform Captions</span>
          <div className="flex gap-1 mb-2 flex-wrap">
            {Object.entries(PLATFORM_INFO).map(([key, info]) => {
              const Icon = info.icon;
              const hasContent = post.captions?.[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPlatformTab(key)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                    platformTab === key
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : hasContent
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-400"
                  }`}
                  data-testid={`detail-tab-${key}`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {info.name}
                </button>
              );
            })}
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 min-h-[120px]">
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {post.captions?.[platformTab] || "(No caption for this platform)"}
            </p>
            <div className="flex items-center justify-between mt-2">
              <CharCount text={post.captions?.[platformTab]} limit={PLATFORM_INFO[platformTab]?.charLimit} />
              {post.captions?.[platformTab] && <CopyBtn text={post.captions[platformTab]} label={PLATFORM_INFO[platformTab]?.name} />}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function MarkPostedModal({ post, platforms, setPlatforms, onConfirm, onClose, isPending }) {
  const togglePlatform = (p) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Mark as Posted</h3>
        <p className="text-sm text-slate-500 mb-4">{post.title || post.content?.substring(0, 60)}</p>
        <p className="text-xs text-slate-500 mb-2">Select platforms where you manually posted:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(PLATFORM_INFO).map(([key, info]) => {
            const Icon = info.icon;
            const isSelected = platforms.includes(key);
            return (
              <button
                key={key}
                onClick={() => togglePlatform(key)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  isSelected ? "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "border-slate-200 dark:border-slate-600 text-slate-500"
                }`}
                data-testid={`toggle-platform-${key}`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {info.name}
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400" data-testid="button-cancel-posted">Cancel</button>
          <button onClick={onConfirm} disabled={platforms.length === 0 || isPending} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2" data-testid="button-confirm-posted">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Confirm Posted
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignsPanel({ campaigns, campaignsLoading, showCampaignForm, setShowCampaignForm, campaignForm, setCampaignForm, campaignMutation, posts }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Campaigns</h2>
        <button
          onClick={() => setShowCampaignForm(!showCampaignForm)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
          data-testid="button-new-campaign"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {showCampaignForm && (
        <SectionCard title="Create Campaign" icon={Target}>
          <form onSubmit={(e) => { e.preventDefault(); campaignMutation.mutate(campaignForm); }} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Campaign Name *</label>
                <input
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g. Launch Week, Journal Series"
                  required
                  data-testid="input-campaign-name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Goal</label>
                <input
                  value={campaignForm.goal}
                  onChange={(e) => setCampaignForm(f => ({ ...f, goal: e.target.value }))}
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g. Drive 200 newsletter signups"
                  data-testid="input-campaign-goal"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
                <input type="date" value={campaignForm.startDate} onChange={(e) => setCampaignForm(f => ({ ...f, startDate: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-testid="input-campaign-start" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">End Date</label>
                <input type="date" value={campaignForm.endDate} onChange={(e) => setCampaignForm(f => ({ ...f, endDate: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-testid="input-campaign-end" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowCampaignForm(false)} className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400" data-testid="button-cancel-campaign">Cancel</button>
              <button type="submit" disabled={campaignMutation.isPending} className="px-4 py-2 text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 disabled:opacity-50 flex items-center gap-2" data-testid="button-save-campaign">
                {campaignMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Campaign
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {campaignsLoading ? (
        <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Array.isArray(campaigns) ? campaigns : []).map(campaign => {
            const campPosts = (Array.isArray(posts) ? posts : []).filter(p => p.campaignId === campaign.id);
            const draftCount = campPosts.filter(p => p.status === "draft").length;
            const postedCount = campPosts.filter(p => p.status === "posted").length;
            return (
              <div key={campaign.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4" data-testid={`card-campaign-${campaign.id}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{campaign.name}</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${campaign.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {campaign.status}
                  </span>
                </div>
                {campaign.goal && <p className="text-xs text-slate-500 mb-3">{campaign.goal}</p>}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {campaign.startDate && <span>{new Date(campaign.startDate).toLocaleDateString()}</span>}
                  {campaign.startDate && campaign.endDate && <span>→</span>}
                  {campaign.endDate && <span>{new Date(campaign.endDate).toLocaleDateString()}</span>}
                </div>
                <div className="flex gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                  <span className="text-slate-500">{campPosts.length} posts</span>
                  <span className="text-amber-500">{draftCount} drafts</span>
                  <span className="text-green-500">{postedCount} posted</span>
                </div>
              </div>
            );
          })}
          {(!campaigns || campaigns.length === 0) && (
            <p className="text-sm text-slate-400 col-span-full text-center py-8">No campaigns yet. Create one to organize your posts.</p>
          )}
        </div>
      )}
    </div>
  );
}

function WeeklyQueuePanel({ weeklyPosts, weeklyLoading, getCampaignName, setSelectedPost, setActivePanel }) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const getPostsForDay = (date) => {
    return (Array.isArray(weeklyPosts) ? weeklyPosts : []).filter(p => {
      const pDate = new Date(p.scheduledFor);
      return pDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Weekly Queue — Next 7 Days
        </h2>
        <span className="text-sm text-slate-400">{(Array.isArray(weeklyPosts) ? weeklyPosts : []).length} scheduled</span>
      </div>

      {weeklyLoading ? (
        <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {days.map(day => {
            const dayPosts = getPostsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={day.toISOString()}
                className={`rounded-xl border p-3 min-h-[120px] ${
                  isToday
                    ? "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  {isToday && <span className="ml-1 text-blue-600 dark:text-blue-400">(Today)</span>}
                </div>
                <div className="space-y-1">
                  {dayPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => { setSelectedPost(post); setActivePanel("pipeline"); }}
                      className="p-2 rounded bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors"
                      data-testid={`weekly-post-${post.id}`}
                    >
                      <p className="line-clamp-2">{post.title || post.content?.substring(0, 50)}</p>
                      <StatusBadge status={post.status} />
                    </div>
                  ))}
                  {dayPosts.length === 0 && (
                    <p className="text-[10px] text-slate-300 dark:text-slate-600 text-center pt-4">No posts</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UTMBuilderPanel({ utmForm, setUtmForm, utmResult, setUtmResult, utmMutation }) {
  const handleBuild = (e) => {
    e.preventDefault();
    utmMutation.mutate(utmForm);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <SectionCard title="UTM Link Builder" icon={Link2}>
        <p className="text-xs text-slate-500 mb-4">Generate trackable links for social posts. Links follow your CTA destinations for clean attribution.</p>
        <form onSubmit={handleBuild} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Base URL *</label>
            <select
              value={utmForm.baseUrl}
              onChange={(e) => setUtmForm(f => ({ ...f, baseUrl: e.target.value }))}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              data-testid="select-utm-base"
            >
              <option value="">Select page or enter URL</option>
              {CTA_DESTINATIONS.map(d => (
                <option key={d.path} value={`${window.location.origin}${d.path}`}>{d.label} ({d.path})</option>
              ))}
            </select>
            <input
              value={utmForm.baseUrl}
              onChange={(e) => setUtmForm(f => ({ ...f, baseUrl: e.target.value }))}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white mt-1"
              placeholder="Or paste custom URL..."
              data-testid="input-utm-base"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Source *</label>
              <select value={utmForm.source} onChange={(e) => setUtmForm(f => ({ ...f, source: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-testid="select-utm-source">
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="x">X / Twitter</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Medium *</label>
              <select value={utmForm.medium} onChange={(e) => setUtmForm(f => ({ ...f, medium: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" data-testid="select-utm-medium">
                <option value="social">Social</option>
                <option value="organic">Organic</option>
                <option value="email">Email</option>
                <option value="referral">Referral</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Campaign *</label>
              <input
                value={utmForm.campaign}
                onChange={(e) => setUtmForm(f => ({ ...f, campaign: e.target.value }))}
                className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g. launch-week-feb"
                required
                data-testid="input-utm-campaign"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Content (optional)</label>
              <input
                value={utmForm.content}
                onChange={(e) => setUtmForm(f => ({ ...f, content: e.target.value }))}
                className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g. carousel-1, cta-button"
                data-testid="input-utm-content"
              />
            </div>
          </div>
          <button type="submit" disabled={utmMutation.isPending || !utmForm.baseUrl || !utmForm.campaign} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2" data-testid="button-build-utm">
            {utmMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
            Build UTM Link
          </button>
        </form>

        {utmResult && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Generated UTM Link:</p>
            <div className="flex items-center gap-2">
              <code className="text-xs text-green-800 dark:text-green-300 break-all flex-1">{utmResult}</code>
              <CopyBtn text={utmResult} label="Copy Link" />
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function SignalsPanel({ signals, clicks, signalsLoading }) {
  if (signalsLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  const statusCounts = signals?.statusCounts || {};
  const topThemes = signals?.topThemes || [];
  const recentBlog = signals?.recentBlogActivity || [];
  const suggestedFocus = signals?.suggestedFocus || [];
  const clickStats = Array.isArray(clicks) ? clicks : [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Performance Signals (Read-Only)
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <div key={key} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{statusCounts[key] || 0}</div>
            <div className="text-xs text-slate-500">{config.label}</div>
          </div>
        ))}
      </div>

      {suggestedFocus.length > 0 && (
        <SectionCard title="Suggested Focus" icon={TrendingUp}>
          <ul className="space-y-2">
            {suggestedFocus.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Top Themes (Posted)" icon={Target}>
          {topThemes.length > 0 ? (
            <div className="space-y-2">
              {topThemes.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{t.theme}</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">{t.count} posts</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-slate-400">No posted themes yet.</p>}
        </SectionCard>

        <SectionCard title="UTM Click Stats (7 days)" icon={Clipboard}>
          {clickStats.length > 0 ? (
            <div className="space-y-2">
              {clickStats.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{c.path}</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-600">{c.count} clicks</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-slate-400">No UTM click data yet.</p>}
        </SectionCard>
      </div>

      {recentBlog.length > 0 && (
        <SectionCard title="Recent Blog Activity (7 days)" icon={BookOpen}>
          <div className="space-y-2">
            {recentBlog.map((b, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300 truncate">{b.path}</span>
                <span className="text-xs text-slate-500">{b.eventName}: {b.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function AuditPanel({ audit, auditLoading }) {
  if (auditLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  const events = Array.isArray(audit) ? audit : [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        Audit Log (Immutable)
      </h2>
      <SectionCard>
        {events.length > 0 ? (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {events.map((evt, i) => (
              <div key={evt.id || i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm" data-testid={`audit-event-${evt.id || i}`}>
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-slate-400 mt-2" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{evt.type}</span>
                    <span className="text-xs text-slate-400">{new Date(evt.createdAt).toLocaleString()}</span>
                  </div>
                  {evt.meta && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {typeof evt.meta === "string" ? evt.meta : JSON.stringify(evt.meta)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-slate-400 text-center py-8">No audit events yet.</p>}
      </SectionCard>
    </div>
  );
}
