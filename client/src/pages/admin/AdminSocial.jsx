// PHASE11733_ADMINSOCIAL_VISUAL_TOKEN_PATCH
// PHASE11735_ADMINSOCIAL_REMAINING_TOKEN_CLEANUP
import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Calendar, Hash, Zap, FileText, Check, Clock, RefreshCw, Copy, Eye, Edit, TrendingUp, Loader2, Plus, Send, Save, X, Sparkles, Target, ArrowRight, Link2, ChevronRight, Filter, BarChart3, CheckCircle2, XCircle, Globe, Shield, BookOpen, Mail, Megaphone } from 'lucide-react';
import { SiInstagram, SiX, SiYoutube, SiFacebook, SiPinterest, SiTiktok } from "react-icons/si";
import { FaLinkedin as SiLinkedin } from "react-icons/fa";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import Button from "../../components/ui/Button";

const API_BASE = "/api/admin/social/enterprise";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: SiInstagram, color: "#E4405F", charLimit: 2200 },
  { id: "x", name: "X / Twitter", icon: SiX, color: "#000000", charLimit: 280 },
  { id: "facebook", name: "Facebook", icon: SiFacebook, color: "#1877F2", charLimit: 63206 },
  { id: "tiktok", name: "TikTok", icon: SiTiktok, color: "#000000", charLimit: 2200 },
  { id: "linkedin", name: "LinkedIn", icon: SiLinkedin, color: "#0A66C2", charLimit: 3000 },
  { id: "youtube", name: "YouTube", icon: SiYoutube, color: "#FF0000", charLimit: 5000 },
  { id: "pinterest", name: "Pinterest", icon: SiPinterest, color: "#BD081C", charLimit: 500 },
];

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-[var(--glp-sage-10)] text-[var(--glp-deep-teal)] dark:bg-[var(--glp-deep-teal)] dark:text-[var(--glp-ivory)]", icon: Edit },
  review: { label: "Review", color: "bg-[rgba(212,175,55,0.18)] text-[var(--glp-charcoal)] dark:bg-[rgba(212,175,55,0.22)] dark:text-[var(--glp-gold)]", icon: Eye },
  approved: { label: "Approved", color: "bg-[rgba(143,191,159,0.28)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.18)] dark:text-[var(--glp-sage)]", icon: CheckCircle2 },
  posted: { label: "Posted", color: "bg-[rgba(47,93,93,0.14)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.14)] dark:text-[var(--glp-sage)]", icon: Send },
};

const PILLAR_TEMPLATES = [
  { id: "micro-tool", name: "Pillar A: Micro-tool", hook: "Try this in 60 seconds.", cta: "Save this. Practice inside The Genuine Love Project.", ctaUrl: "/tools", icon: Sparkles },
  { id: "feature-demo", name: "Pillar B: Feature Demo", hook: "When you feel scattered, start here.", cta: "Try it today.", ctaUrl: "/mood", icon: Target },
  { id: "blog-authority", name: "Pillar C: Blog Authority", hook: "Read the full guide.", cta: "Read the full guide.", ctaUrl: "/blog", icon: BookOpen },
  { id: "newsletter", name: "Pillar D: Newsletter", hook: "A gentle practice, every week.", cta: "Join the newsletter.", ctaUrl: "/newsletter", icon: Mail },
];

const HASHTAG_PRESETS = {
  brand: ["#TheGenuineLoveProject", "#GenuineLove", "#LiveInLove"],
  topic: ["#SelfCompassion", "#EmotionalWellness", "#JournalingPractice", "#TraumaHealing"],
  intent: ["#DailyPractice", "#MindfulLiving", "#HealingJourney"],
};

const BANNED_PHRASES = [
  "diagnos", "treatment", "support", "therapy session", "clinical",
  "today only", "don't miss", "fix yourself", "limited time",
  "act now", "hurry", "you're broken", "what's wrong with you"
];

function safetyCheck(text) {
  if (!text) return { pass: false, issues: ["Empty content"] };
  const lower = text.toLowerCase();
  const issues = [];
  BANNED_PHRASES.forEach(phrase => {
    if (lower.includes(phrase)) issues.push(`Contains banned phrase: "${phrase}"`);
  });
  return { pass: issues.length === 0, issues };
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`} data-testid={`badge-status-${status}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  };
  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-[rgba(250,249,247,0.86)] dark:bg-[var(--glp-deep-teal)] border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-charcoal)] transition-colors" data-testid={`button-copy-${label}`}>
      {copied ? <CheckCircle2 className="w-3 h-3 text-[var(--glp-sage)]" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : `Copy ${label}`}
    </button>
  );
}

export default function AdminSocial() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [posts, setPosts] = useState([]);
  const [weeklyQueue, setWeeklyQueue] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [redirectsList, setRedirectsList] = useState([]);
  const [clickStats, setClickStats] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [signals, setSignals] = useState({ topThemes: [], recentBlogActivity: [], statusCounts: {}, suggestedFocus: [] });
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showUtmBuilder, setShowUtmBuilder] = useState(false);
  const [showRepurpose, setShowRepurpose] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (campaignFilter) params.set("campaign_id", campaignFilter);

      const [postsRes, weeklyRes, campaignsRes, redirectsRes, clicksRes, blogRes, signalsRes, auditRes] = await Promise.all([
        fetch(`${API_BASE}/posts?${params}`, { credentials: "include" }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/weekly-queue`, { credentials: "include" }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/campaigns`, { credentials: "include" }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`/r/list`, { credentials: "include" }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/click-stats`, { credentials: "include" }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`/api/blog/posts?limit=20`, { credentials: "include" }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/signals`, { credentials: "include" }).then(r => r.json()).catch(() => ({ data: {} })),
        fetch(`${API_BASE}/audit?limit=50`, { credentials: "include" }).then(r => r.json()).catch(() => ({ data: [] })),
      ]);
      setPosts(postsRes.data || []);
      setWeeklyQueue(weeklyRes.data || []);
      setCampaigns(campaignsRes.data || []);
      setRedirectsList(redirectsRes.data || []);
      setClickStats(clicksRes.data || []);
      setBlogPosts(Array.isArray(blogRes.data) ? blogRes.data : Array.isArray(blogRes) ? blogRes : []);
      setSignals(signalsRes.data || { topThemes: [], recentBlogActivity: [], statusCounts: {}, suggestedFocus: [] });
      setAuditLog(auditRes.data || []);
    } catch (e) { console.error("Fetch error:", e); }
    setLoading(false);
  }, [statusFilter, campaignFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const transitionPost = async (id, action, extra = {}) => {
    setActionLoading(id);
    try {
      await fetch(`${API_BASE}/post/${id}/${action}`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extra),
      });
      await fetchData();
    } catch (e) { console.error("Transition error:", e); }
    setActionLoading("");
  };

  const grouped = { draft: [], review: [], approved: [], posted: [] };
  posts.forEach(p => { if (grouped[p.status]) grouped[p.status].push(p); });

  const TABS = [
    { id: "pipeline", label: "Pipeline", icon: Zap },
    { id: "weekly", label: "Weekly Queue", icon: Calendar },
    { id: "editor", label: "Create Post", icon: Plus },
    { id: "signals", label: "Signals", icon: BarChart3 },
    { id: "repurpose", label: "Repurpose", icon: BookOpen },
    { id: "audit", label: "Audit Log", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--glp-ivory)] via-[var(--glp-sage-10)] to-[rgba(244,199,195,0.18)] dark:from-[var(--glp-charcoal)] dark:via-[var(--glp-deep-teal)] dark:to-[var(--glp-charcoal)] p-4 md:p-6">
      <SEO title="Social Ops Console | Admin" description="Enterprise social media operations console" />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">
              <Link href="/admin" className="hover:text-[var(--glp-deep-teal)] transition-colors" data-testid="link-admin-home">Admin</Link>
              <ChevronRight className="w-3 h-3" />
              <span>Social Ops Console</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--glp-deep-teal)] to-[var(--glp-sage)] bg-clip-text text-transparent" data-testid="text-page-title">
              Enterprise Social Ops Console
            </h1>
            <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-1">Publish → Repurpose → Track → Learn → Improve</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchData} variant="secondary" size="sm" data-testid="button-refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setShowCampaignModal(true)} variant="primary" size="sm" data-testid="button-new-campaign">
              <Megaphone className="w-4 h-4" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(grouped).map(([status, items]) => (
            <button key={status} onClick={() => setStatusFilter(statusFilter === status ? "" : status)} className={`p-3 rounded-xl border transition-all text-left ${statusFilter === status ? "ring-2 ring-[var(--glp-sage)] border-[var(--glp-sage)] dark:border-[var(--glp-sage)]" : "border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)]"} bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] hover:shadow-md`} data-testid={`button-filter-${status}`}>
              <div className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{items.length}</div>
              <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] flex items-center gap-1">
                <StatusBadge status={status} />
              </div>
            </button>
          ))}
          <div className="p-3 rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)]">
            <div className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{campaigns.length}</div>
            <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] flex items-center gap-1"><Megaphone className="w-3 h-3" /> Campaigns</div>
          </div>
        </div>

        {/* Campaign Filter */}
        {campaigns.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[var(--glp-sage)]" />
            <button onClick={() => setCampaignFilter("")} className={`px-2 py-1 rounded text-xs transition-colors ${!campaignFilter ? "bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.16)] dark:text-[var(--glp-sage)]" : "bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]"}`} data-testid="button-campaign-all">All</button>
            {campaigns.map(c => (
              <button key={c.id} onClick={() => setCampaignFilter(campaignFilter === c.id ? "" : c.id)} className={`px-2 py-1 rounded text-xs transition-colors ${campaignFilter === c.id ? "bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.16)] dark:text-[var(--glp-sage)]" : "bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]"}`} data-testid={`button-campaign-${c.id}`}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] rounded-xl overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] shadow-sm" : "text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:text-[var(--glp-deep-teal)] dark:hover:text-[var(--glp-sage)]"}`} data-testid={`tab-${tab.id}`}>
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--glp-deep-teal)]" />
          </div>
        ) : (
          <>
            {/* Pipeline Board */}
            {activeTab === "pipeline" && (
              <PipelineBoard grouped={grouped} actionLoading={actionLoading} transitionPost={transitionPost} onEdit={(post) => { setEditingPost(post); setActiveTab("editor"); }} />
            )}

            {/* Weekly Queue */}
            {activeTab === "weekly" && (
              <WeeklyQueueView queue={weeklyQueue} />
            )}

            {/* Post Editor */}
            {activeTab === "editor" && (
              <PostEditor post={editingPost} campaigns={campaigns} onSave={() => { setEditingPost(null); fetchData(); }} onCancel={() => { setEditingPost(null); setActiveTab("pipeline"); }} />
            )}

            {/* Signals */}
            {activeTab === "signals" && (
              <SignalsPanel clickStats={clickStats} redirectsList={redirectsList} signals={signals} onRefresh={fetchData} />
            )}

            {/* Repurpose from Blog */}
            {activeTab === "repurpose" && (
              <RepurposePanel blogPosts={blogPosts} campaigns={campaigns} onDone={fetchData} />
            )}

            {/* Audit Log */}
            {activeTab === "audit" && (
              <AuditLogPanel auditLog={auditLog} />
            )}
          </>
        )}

        {/* Campaign Modal */}
        {showCampaignModal && (
          <CampaignModal onClose={() => setShowCampaignModal(false)} onCreated={() => { setShowCampaignModal(false); fetchData(); }} />
        )}
      </div>
      <SafetyFooter />
    </div>
  );
}

function PipelineBoard({ grouped, actionLoading, transitionPost, onEdit }) {
  const [markPostedId, setMarkPostedId] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const columns = [
    { status: "draft", nextAction: "submit", nextLabel: "Submit for Review" },
    { status: "review", nextAction: "approve", nextLabel: "Approve" },
    { status: "approved", nextAction: "mark-posted", nextLabel: "Mark Posted" },
    { status: "posted", nextAction: null, nextLabel: null },
  ];

  const handleAction = (postId, action, post) => {
    if (action === "mark-posted") {
      setMarkPostedId(postId);
      setSelectedPlatforms(post.platform ? [post.platform] : []);
      return;
    }
    transitionPost(postId, action);
  };

  const confirmMarkPosted = () => {
    if (selectedPlatforms.length === 0) return;
    transitionPost(markPostedId, "mark-posted", { platforms: selectedPlatforms });
    setMarkPostedId(null);
    setSelectedPlatforms([]);
  };

  const togglePlatform = (p) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  return (
    <div className="space-y-4">
      {markPostedId && (
        <div className="bg-[rgba(47,93,93,0.10)] dark:bg-[rgba(143,191,159,0.10)] border border-[rgba(47,93,93,0.24)] dark:border-[rgba(143,191,159,0.24)] rounded-xl p-4" data-testid="mark-posted-panel">
          <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">Select platforms where this was posted:</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {PLATFORMS.map(p => {
              const Icon = p.icon;
              const active = selectedPlatforms.includes(p.id);
              return (
                <button key={p.id} onClick={() => togglePlatform(p.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${active ? "border-[var(--glp-sage)] bg-[rgba(143,191,159,0.26)] dark:bg-[rgba(143,191,159,0.18)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" : "border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)]"}`} data-testid={`button-platform-${p.id}`}>
                  <Icon className="w-3 h-3" style={{ color: active ? p.color : undefined }} />
                  {p.name}
                  {active && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button onClick={confirmMarkPosted} disabled={selectedPlatforms.length === 0} variant="gold" size="sm" data-testid="button-confirm-posted">
              <CheckCircle2 className="w-3 h-3" /> Confirm Posted
            </Button>
            <Button onClick={() => setMarkPostedId(null)} variant="secondary" size="sm" data-testid="button-cancel-posted">Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="pipeline-board">
        {columns.map(col => {
          const cfg = STATUS_CONFIG[col.status];
          const Icon = cfg.icon;
          const items = grouped[col.status] || [];
          return (
            <div key={col.status} className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[rgba(143,191,159,0.38)] dark:border-[rgba(143,191,159,0.28)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{cfg.label}</span>
                </div>
                <span className="text-xs text-[var(--glp-sage)] font-mono">{items.length}</span>
              </div>
              <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
                {items.length === 0 && (
                  <p className="text-xs text-[var(--glp-sage)] dark:text-[var(--glp-sage)] text-center py-4">No posts</p>
                )}
                {items.map(post => (
                  <div key={post.id} className="p-3 rounded-lg bg-[var(--glp-sage-10)] dark:bg-[rgba(47,93,93,0.54)] border border-[rgba(143,191,159,0.38)] dark:border-[rgba(143,191,159,0.28)] space-y-2" data-testid={`card-post-${post.id}`}>
                    <div className="text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] line-clamp-2">{post.title || "Untitled"}</div>
                    <p className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] line-clamp-2">{post.content?.substring(0, 100)}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.28)] dark:bg-[rgba(143,191,159,0.18)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{post.platform}</span>
                      {post.theme && <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.22)] dark:bg-[rgba(143,191,159,0.16)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{post.theme}</span>}
                      {post.scheduledFor && <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(47,93,93,0.14)] dark:bg-[rgba(143,191,159,0.14)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{new Date(post.scheduledFor).toLocaleDateString()}</span>}
                      {Array.isArray(post.postedPlatforms) && post.postedPlatforms.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.22)] dark:bg-[rgba(143,191,159,0.14)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{post.postedPlatforms.join(", ")}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {col.status !== "posted" && (
                        <button onClick={() => onEdit(post)} className="text-xs px-2 py-1 rounded bg-[rgba(143,191,159,0.28)] dark:bg-[rgba(143,191,159,0.18)] hover:bg-[rgba(143,191,159,0.32)] dark:hover:bg-[var(--glp-charcoal)] transition-colors" data-testid={`button-edit-${post.id}`}>
                          <Edit className="w-3 h-3" />
                        </button>
                      )}
                      {col.nextAction && (
                        <button onClick={() => handleAction(post.id, col.nextAction, post)} disabled={actionLoading === post.id} className="text-xs px-2 py-1 rounded bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:bg-[var(--glp-charcoal)] disabled:opacity-50 transition-colors flex items-center gap-1" data-testid={`button-${col.nextAction}-${post.id}`}>
                          {actionLoading === post.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                          {col.nextLabel}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyQueueView({ queue }) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayStr = d.toISOString().split("T")[0];
    const dayPosts = queue.filter(p => p.scheduledFor && p.scheduledFor.startsWith(dayStr));
    days.push({ date: d, dayStr, posts: dayPosts, isToday: i === 0 });
  }

  return (
    <div className="space-y-3" data-testid="weekly-queue">
      <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2"><Calendar className="w-5 h-5 text-[var(--glp-deep-teal)]" /> Next 7 Days</h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {days.map(day => (
          <div key={day.dayStr} className={`p-3 rounded-xl border ${day.isToday ? "border-[var(--glp-sage)] dark:border-[var(--glp-sage)] bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.10)]" : "border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)]"}`}>
            <div className="text-center mb-2">
              <div className={`text-xs font-medium ${day.isToday ? "text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" : "text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]"}`}>
                {day.date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className={`text-lg font-bold ${day.isToday ? "text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" : "text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]"}`}>
                {day.date.getDate()}
              </div>
            </div>
            {day.posts.length === 0 ? (
              <p className="text-xs text-[var(--glp-sage)] text-center">No posts</p>
            ) : (
              <div className="space-y-1">
                {day.posts.map(p => (
                  <div key={p.id} className="p-1.5 rounded bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] border border-[rgba(143,191,159,0.38)] dark:border-[rgba(143,191,159,0.28)] text-xs" data-testid={`queue-post-${p.id}`}>
                    <StatusBadge status={p.status} />
                    <div className="mt-1 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] line-clamp-2">{p.title || p.content?.substring(0, 40)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PostEditor({ post, campaigns, onSave, onCancel }) {
  const isEdit = !!post;
  const [form, setForm] = useState({
    title: post?.title || "",
    platform: post?.platform || "instagram",
    content: post?.content || "",
    theme: post?.theme || "self-compassion",
    hashtags: post?.hashtags || "",
    safetyNote: post?.safetyNote || "Educational content only. Not therapy or clinical advice.",
    crisisLinkRequired: post?.crisisLinkRequired || 0,
    campaignId: post?.campaignId || "",
    scheduledFor: post?.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : "",
    canvaUrl: post?.canvaUrl || "",
    mediaAssetUrl: post?.mediaAssetUrl || "",
    gentleCtaUrl: post?.gentleCtaUrl || "/tools",
    captions: post?.captions || { instagram: "", x: "", tiktok: "", facebook: "", linkedin: "", youtube: "", pinterest: "" },
  });
  const [saving, setSaving] = useState(false);
  const [safetyResult, setSafetyResult] = useState(null);
  const [utmResult, setUtmResult] = useState("");
  const [activeCaption, setActiveCaption] = useState("instagram");
  const [showTemplates, setShowTemplates] = useState(false);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateCaption = (platform, value) => setForm(prev => ({ ...prev, captions: { ...prev.captions, [platform]: value } }));

  const runSafetyCheck = () => {
    const allText = `${form.content} ${form.title} ${Object.values(form.captions).join(" ")}`;
    setSafetyResult(safetyCheck(allText));
  };

  const buildUtm = async () => {
    if (!form.gentleCtaUrl) return;
    try {
      const host = window.location.origin;
      const baseUrl = form.gentleCtaUrl.startsWith("http") ? form.gentleCtaUrl : `${host}${form.gentleCtaUrl}`;
      const res = await fetch(`${API_BASE}/build-utm`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, source: form.platform, medium: "social", campaign: form.theme || "general" }),
      });
      const data = await res.json();
      if (data.data?.utmUrl) setUtmResult(data.data.utmUrl);
    } catch (e) { console.error("UTM build error:", e); }
  };

  const createTrackedLink = async () => {
    if (!form.gentleCtaUrl) return;
    try {
      const host = window.location.origin;
      const fullUrl = form.gentleCtaUrl.startsWith("http") ? form.gentleCtaUrl : `${host}${form.gentleCtaUrl}`;
      const res = await fetch(`/r/create`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fullUrl, campaignId: form.campaignId || undefined }),
      });
      const data = await res.json();
      if (data.data?.slug) setUtmResult(`${host}/r/${data.data.slug}`);
    } catch (e) { console.error("Tracked link error:", e); }
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return;
    const allText = `${form.content} ${form.title} ${Object.values(form.captions).join(" ")}`;
    const check = safetyCheck(allText);
    setSafetyResult(check);
    if (!check.pass) return;
    if (!form.safetyNote || !form.safetyNote.trim()) {
      setSafetyResult({ pass: false, issues: ["Safety note is required before saving"] });
      return;
    }
    setSaving(true);
    try {
      const url = isEdit ? `${API_BASE}/post/${post.id}` : `${API_BASE}/post`;
      const method = isEdit ? "PUT" : "POST";
      const body = {
        ...form,
        scheduledFor: form.scheduledFor || null,
        campaignId: form.campaignId || null,
        crisisLinkRequired: form.crisisLinkRequired ? 1 : 0,
      };
      await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      onSave();
    } catch (e) { console.error("Save error:", e); }
    setSaving(false);
  };

  const applyTemplate = (template) => {
    updateField("content", `${template.hook}\n\n${template.cta}`);
    updateField("gentleCtaUrl", template.ctaUrl);
    setShowTemplates(false);
  };

  const applyHashtags = (set) => {
    const current = form.hashtags ? form.hashtags.split(" ").filter(Boolean) : [];
    const combined = [...new Set([...current, ...HASHTAG_PRESETS[set]])];
    updateField("hashtags", combined.join(" "));
  };

  return (
    <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] p-6 space-y-6" data-testid="post-editor">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{isEdit ? "Edit Post" : "Create New Post"}</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowTemplates(!showTemplates)} className="px-3 py-1.5 text-xs rounded-lg bg-[rgba(244,199,195,0.38)] dark:bg-[rgba(244,199,195,0.16)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:bg-[rgba(244,199,195,0.48)] dark:hover:bg-[rgba(244,199,195,0.22)] transition-colors flex items-center gap-1" data-testid="button-templates">
            <Sparkles className="w-3 h-3" /> Pillar Templates
          </button>
          <button onClick={onCancel} aria-label="Close editor" title="Close editor" className="p-1.5 rounded-lg hover:bg-[rgba(143,191,159,0.18)] dark:hover:bg-[var(--glp-charcoal)] transition-colors" data-testid="button-cancel-editor"><X className="w-4 h-4" aria-hidden="true" /></button>
        </div>
      </div>

      {/* Pillar Templates */}
      {showTemplates && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-[rgba(244,199,195,0.24)] dark:bg-[rgba(244,199,195,0.10)] rounded-lg border border-[rgba(244,199,195,0.52)] dark:border-[rgba(244,199,195,0.30)]">
          {PILLAR_TEMPLATES.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => applyTemplate(t)} className="p-3 rounded-lg bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] border border-[rgba(244,199,195,0.48)] dark:border-[rgba(244,199,195,0.30)] hover:border-[var(--glp-blossom)] dark:hover:border-[var(--glp-blossom)] transition-colors text-left" data-testid={`button-template-${t.id}`}>
                <Icon className="w-4 h-4 text-[var(--glp-deep-teal)] mb-1" />
                <div className="text-xs font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{t.name}</div>
                <div className="text-xs text-[var(--glp-deep-teal)] mt-0.5">{t.hook}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Title</label>
          <input value={form.title} onChange={e => updateField("title", e.target.value)} placeholder="Post title" className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="input-title" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Platform</label>
          <select value={form.platform} onChange={e => updateField("platform", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="select-platform">
            {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Theme</label>
          <select value={form.theme} onChange={e => updateField("theme", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="select-theme">
            {["self-compassion", "boundaries", "healing", "gratitude", "mindfulness", "inner-child", "self-worth", "resilience", "emotional-intelligence", "growth"].map(t => (
              <option key={t} value={t}>{t.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Main Content</label>
        <textarea value={form.content} onChange={e => updateField("content", e.target.value)} rows={4} placeholder="Write your post content..." className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] resize-y" data-testid="textarea-content" />
        <div className="text-xs text-[var(--glp-sage)] mt-1">{form.content.length} / {PLATFORMS.find(p => p.id === form.platform)?.charLimit || 2200} chars</div>
      </div>

      {/* Per-Platform Captions */}
      <div>
        <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-2">Per-Platform Captions</label>
        <div className="flex gap-1 mb-2 overflow-x-auto">
          {PLATFORMS.map(p => {
            const Icon = p.icon;
            return (
              <button key={p.id} onClick={() => setActiveCaption(p.id)} className={`flex items-center gap-1 px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${activeCaption === p.id ? "bg-[rgba(143,191,159,0.22)] dark:bg-[rgba(143,191,159,0.16)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" : "bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)]"}`} data-testid={`tab-caption-${p.id}`}>
                <Icon className="w-3 h-3" />
                {p.name}
              </button>
            );
          })}
        </div>
        <textarea value={form.captions[activeCaption] || ""} onChange={e => updateCaption(activeCaption, e.target.value)} rows={3} placeholder={`${activeCaption} caption...`} className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] resize-y" data-testid={`textarea-caption-${activeCaption}`} />
        <div className="flex items-center gap-2 mt-1">
          <CopyButton text={form.captions[activeCaption] || form.content} label={activeCaption} />
          <button onClick={() => updateCaption(activeCaption, form.content)} className="text-xs px-2 py-1 rounded bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] hover:bg-[rgba(143,191,159,0.28)] dark:hover:bg-[var(--glp-charcoal)] transition-colors" data-testid={`button-fill-caption-${activeCaption}`}>
            Fill from main content
          </button>
        </div>
      </div>

      {/* Hashtags */}
      <div>
        <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Hashtags</label>
        <input value={form.hashtags} onChange={e => updateField("hashtags", e.target.value)} placeholder="#TheGenuineLoveProject #SelfCompassion" className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="input-hashtags" />
        <div className="flex gap-1 mt-1">
          {Object.keys(HASHTAG_PRESETS).map(set => (
            <button key={set} onClick={() => applyHashtags(set)} className="text-xs px-2 py-0.5 rounded bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:bg-[rgba(143,191,159,0.22)] dark:hover:bg-[rgba(143,191,159,0.18)] transition-colors" data-testid={`button-hashtag-${set}`}>
              + {set}
            </button>
          ))}
        </div>
      </div>

      {/* CTA & UTM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">CTA Destination URL</label>
          <div className="flex gap-2">
            <input value={form.gentleCtaUrl} onChange={e => updateField("gentleCtaUrl", e.target.value)} placeholder="/tools" className="flex-1 px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="input-cta-url" />
          </div>
          <div className="flex gap-1 mt-1">
            {["/tools", "/mood", "/blog", "/newsletter", "/pricing", "/crisis"].map(url => (
              <button key={url} onClick={() => updateField("gentleCtaUrl", url)} className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] hover:bg-[rgba(143,191,159,0.28)] dark:hover:bg-[var(--glp-charcoal)] transition-colors" data-testid={`button-cta-${url.slice(1)}`}>
                {url}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Tracked Link / UTM</label>
          <div className="flex gap-1">
            <Button onClick={buildUtm} variant="primary" size="sm" data-testid="button-build-utm">
              <Link2 className="w-3 h-3" /> Build UTM
            </Button>
            <Button onClick={createTrackedLink} variant="gold" size="sm" data-testid="button-tracked-link">
              <Globe className="w-3 h-3" /> Create /r/ Link
            </Button>
          </div>
          {utmResult && (
            <div className="mt-1 flex items-center gap-1">
              <input value={utmResult} readOnly className="flex-1 px-2 py-1 rounded text-xs bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" data-testid="input-utm-result" />
              <CopyButton text={utmResult} label="link" />
            </div>
          )}
        </div>
      </div>

      {/* Safety & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Safety Note (required for approval)</label>
          <textarea value={form.safetyNote} onChange={e => updateField("safetyNote", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] resize-y" data-testid="textarea-safety" />
          <div className="flex items-center gap-2 mt-1">
            <label className="flex items-center gap-1 text-xs text-[var(--glp-deep-teal)] cursor-pointer">
              <input type="checkbox" checked={!!form.crisisLinkRequired} onChange={e => updateField("crisisLinkRequired", e.target.checked ? 1 : 0)} className="rounded" data-testid="checkbox-crisis" />
              Crisis link required
            </label>
            <button onClick={runSafetyCheck} className="text-xs px-2 py-1 rounded bg-[rgba(212,175,55,0.18)] dark:bg-[rgba(212,175,55,0.18)] text-[var(--glp-charcoal)] dark:text-[var(--glp-gold)] hover:bg-[rgba(212,175,55,0.26)] dark:hover:bg-[rgba(212,175,55,0.22)] transition-colors flex items-center gap-1" data-testid="button-safety-check">
              <Shield className="w-3 h-3" /> Run Safety Check
            </button>
          </div>
          {safetyResult && (
            <div className={`mt-1 p-2 rounded text-xs ${safetyResult.pass ? "bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.12)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" : "bg-[rgba(244,199,195,0.26)] dark:bg-[rgba(244,199,195,0.14)] text-[#9F3434] dark:text-[var(--glp-blossom)]"}`} data-testid="text-safety-result">
              {safetyResult.pass ? (
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Content passes safety checks</span>
              ) : (
                <div>
                  <span className="flex items-center gap-1 font-medium"><XCircle className="w-3 h-3" /> Issues found:</span>
                  <ul className="mt-1 ml-4 list-disc">{safetyResult.issues.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Schedule For</label>
            <input type="datetime-local" value={form.scheduledFor} onChange={e => updateField("scheduledFor", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="input-scheduled" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Campaign</label>
            <select value={form.campaignId} onChange={e => updateField("campaignId", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="select-campaign">
              <option value="">No campaign</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Canva URL</label>
              <input value={form.canvaUrl} onChange={e => updateField("canvaUrl", e.target.value)} placeholder="https://canva.com/..." className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="input-canva" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Media Asset URL</label>
              <input value={form.mediaAssetUrl} onChange={e => updateField("mediaAssetUrl", e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="input-media" />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-2 pt-4 border-t border-[rgba(143,191,159,0.38)] dark:border-[rgba(143,191,159,0.28)]">
        <Button onClick={onCancel} variant="secondary" size="sm" data-testid="button-cancel">Cancel</Button>
        <Button onClick={handleSave} disabled={saving || !form.title || !form.content} variant="primary" size="sm" data-testid="button-save-post">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Update Post" : "Create Draft"}
        </Button>
      </div>
    </div>
  );
}

function SignalsPanel({ clickStats, redirectsList, signals, onRefresh }) {
  return (
    <div className="space-y-4" data-testid="signals-panel">
      <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[var(--glp-deep-teal)]" /> Traffic Signals & Intelligence</h2>

      {signals.suggestedFocus && signals.suggestedFocus.length > 0 && (
        <div className="bg-[rgba(212,175,55,0.14)] dark:bg-[rgba(212,175,55,0.10)] border border-[rgba(212,175,55,0.35)] dark:border-[rgba(212,175,55,0.28)] rounded-xl p-4" data-testid="suggested-focus">
          <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-gold)] mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Suggested Focus</h3>
          <ul className="space-y-1">
            {signals.suggestedFocus.map((tip, i) => (
              <li key={i} className="text-xs text-[var(--glp-charcoal)] dark:text-[var(--glp-gold)] flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" /> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Pipeline Status Counts */}
        <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] p-4">
          <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-[var(--glp-deep-teal)]" /> Pipeline Status</h3>
          {signals.statusCounts && Object.keys(signals.statusCounts).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(signals.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between py-1 border-b border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)] last:border-0">
                  <StatusBadge status={status} />
                  <span className="text-sm font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--glp-sage)]">No pipeline data yet.</p>
          )}
        </div>

        {/* Top Themes */}
        <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] p-4">
          <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-3 flex items-center gap-2"><Hash className="w-4 h-4 text-[var(--glp-deep-teal)]" /> Top Posted Themes</h3>
          {signals.topThemes && signals.topThemes.length > 0 ? (
            <div className="space-y-2">
              {signals.topThemes.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)] last:border-0">
                  <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{t.theme || "untagged"}</span>
                  <span className="text-sm font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{t.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--glp-sage)]">No theme data yet. Post content to see trending themes.</p>
          )}
        </div>

        {/* Recent Blog Activity */}
        <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] p-4">
          <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-[var(--glp-sage)]" /> Blog Activity (7 days)</h3>
          {signals.recentBlogActivity && signals.recentBlogActivity.length > 0 ? (
            <div className="space-y-2">
              {signals.recentBlogActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)] last:border-0">
                  <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] truncate max-w-[160px]">{a.path}</span>
                  <span className="text-sm font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{a.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--glp-sage)]">No blog activity data yet.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* UTM Click Stats */}
        <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] p-4">
          <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[var(--glp-sage)]" /> UTM Clicks (7 days)</h3>
          {clickStats.length === 0 ? (
            <p className="text-xs text-[var(--glp-sage)]">No click data yet. Share tracked links to start seeing signals.</p>
          ) : (
            <div className="space-y-2">
              {clickStats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)] last:border-0">
                  <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] truncate max-w-[200px]">{stat.path}</span>
                  <span className="text-sm font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{stat.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tracked Redirects */}
        <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] p-4">
          <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-3 flex items-center gap-2"><Link2 className="w-4 h-4 text-[var(--glp-deep-teal)]" /> Tracked Links</h3>
          {redirectsList.length === 0 ? (
            <p className="text-xs text-[var(--glp-sage)]">No tracked links created yet. Use the editor to create /r/ links.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {redirectsList.map(r => (
                <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)] last:border-0" data-testid={`redirect-${r.id}`}>
                  <div>
                    <div className="text-xs font-mono text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">/r/{r.slug}</div>
                    <div className="text-xs text-[var(--glp-sage)] truncate max-w-[180px]">{r.url}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{r.clicks}</span>
                    <CopyButton text={`${window.location.origin}/r/${r.slug}`} label="link" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RepurposePanel({ blogPosts, campaigns, onDone }) {
  const [selectedBlog, setSelectedBlog] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!selectedBlog) return;
    setGenerating(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/generate-from-blog`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogPostId: selectedBlog, campaignId: selectedCampaign || undefined }),
      });
      const data = await res.json();
      setResult(data);
      onDone();
    } catch (e) { console.error("Repurpose error:", e); }
    setGenerating(false);
  };

  return (
    <div className="space-y-4" data-testid="repurpose-panel">
      <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2"><BookOpen className="w-5 h-5 text-[var(--glp-deep-teal)]" /> Repurpose from Blog</h2>
      <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Select a blog post to automatically generate draft social media posts using the 4-pillar strategy. All drafts are created in DRAFT status — never auto-approved.</p>

      <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Select Blog Post</label>
            <select value={selectedBlog} onChange={e => setSelectedBlog(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="select-blog-post">
              <option value="">Choose a blog post...</option>
              {blogPosts.map(bp => (
                <option key={bp.id} value={bp.id}>{bp.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Assign to Campaign (optional)</label>
            <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="select-repurpose-campaign">
              <option value="">No campaign</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={!selectedBlog || generating} variant="primary" size="sm" data-testid="button-generate-drafts">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Draft Posts
        </Button>

        {result && result.data && (
          <div className="p-3 bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.10)] rounded-lg border border-[rgba(143,191,159,0.38)] dark:border-[rgba(143,191,159,0.24)]">
            <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {result.message || `Generated ${result.data.length} drafts`}</p>
            <div className="mt-2 space-y-1">
              {result.data.map((d, i) => (
                <div key={i} className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> {d.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await fetch(`${API_BASE}/campaigns`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), goal }),
      });
      onCreated();
    } catch (e) { console.error("Campaign error:", e); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl" onClick={e => e.stopPropagation()} data-testid="modal-campaign">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">New Campaign</h3>
          <button onClick={onClose} aria-label="Close" title="Close" className="p-1 rounded hover:bg-[rgba(143,191,159,0.18)] dark:hover:bg-[var(--glp-charcoal)]" data-testid="button-close-campaign"><X className="w-4 h-4" aria-hidden="true" /></button>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Campaign Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Spring 2026 Launch" className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm" data-testid="input-campaign-name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">Goal (optional)</label>
          <textarea value={goal} onChange={e => setGoal(e.target.value)} rows={2} placeholder="Drive newsletter signups..." className="w-full px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-sm resize-y" data-testid="textarea-campaign-goal" />
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary" size="sm" data-testid="button-cancel-campaign">Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim() || saving} variant="primary" size="sm" data-testid="button-create-campaign">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            Create Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}

function AuditLogPanel({ auditLog }) {
  const eventLabels = {
    social_draft_created: "Draft Created",
    social_post_edited: "Post Edited",
    social_submitted_for_review: "Submitted for Review",
    social_post_approved: "Post Approved",
    social_post_marked_posted: "Marked as Posted",
    social_post_scheduled: "Post Scheduled",
    social_drafts_generated_from_blog: "Drafts from Blog",
    campaign_created: "Campaign Created",
  };

  return (
    <div className="space-y-4" data-testid="audit-log-panel">
      <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2"><Shield className="w-5 h-5 text-[var(--glp-deep-teal)]" /> Publishing Audit Log</h2>
      <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Every publishing action is logged for transparency and accountability. No auto-actions — all transitions are human-initiated.</p>

      <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.32)] overflow-hidden">
        {auditLog.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="w-8 h-8 text-[var(--glp-sage)] dark:text-[var(--glp-deep-teal)] mx-auto mb-2" />
            <p className="text-sm text-[var(--glp-sage)]">No audit events yet. Actions will appear here as you use the publishing pipeline.</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(143,191,159,0.30)] dark:divide-[rgba(143,191,159,0.22)] max-h-[600px] overflow-y-auto">
            {auditLog.map((event, i) => {
              const meta = typeof event.meta === "string" ? JSON.parse(event.meta || "{}") : (event.meta || {});
              const label = eventLabels[event.type] || event.type;
              return (
                <div key={event.id || i} className="px-4 py-3 flex items-start gap-3 hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-charcoal)]/50 transition-colors" data-testid={`audit-event-${i}`}>
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[var(--glp-sage)] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{label}</span>
                      {meta.createdBy && <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)]">by {meta.createdBy}</span>}
                      {meta.submittedBy && <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)]">by {meta.submittedBy}</span>}
                      {meta.approvedBy && <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)]">by {meta.approvedBy}</span>}
                      {meta.postedBy && <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)]">by {meta.postedBy}</span>}
                      {meta.editedBy && <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)]">by {meta.editedBy}</span>}
                      {meta.scheduledBy && <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(143,191,159,0.18)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)]">by {meta.scheduledBy}</span>}
                    </div>
                    <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-0.5">
                      {meta.title && <span>"{meta.title}" </span>}
                      {meta.blogTitle && <span>from "{meta.blogTitle}" </span>}
                      {meta.draftCount && <span>({meta.draftCount} drafts) </span>}
                      {meta.platforms && <span>on {Array.isArray(meta.platforms) ? meta.platforms.join(", ") : meta.platforms} </span>}
                      {meta.name && <span>"{meta.name}" </span>}
                    </div>
                    <div className="text-xs text-[var(--glp-sage)] mt-0.5">
                      {event.createdAt ? new Date(event.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
