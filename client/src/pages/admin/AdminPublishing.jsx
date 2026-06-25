// PHASE11714_ADMIN_PUBLISHING_VISUAL_TOKEN_PATCH
import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, FileText, Mail, Calendar, Copy, Check, Loader2, BarChart3, GitPullRequest, Lightbulb, AlertTriangle, CheckCircle, TrendingUp, Users, Eye, PenLine, Plus, X, Share2, Filter } from 'lucide-react';
import { queryClient, apiRequest } from "../../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { SEO } from "../../components/SEO";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-[var(--glp-sage-10)] dark:bg-[color-mix(in_srgb,var(--glp-gold)_18%,var(--glp-charcoal))] hover:bg-[color-mix(in_srgb,var(--glp-gold)_22%,var(--glp-ivory))] dark:hover:bg-[var(--glp-deep-teal)] transition-colors"
      data-testid={`button-copy-${label}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}

const PIPELINE_STATUS_BADGES = {
  draft: { label: "Draft", className: "bg-[var(--glp-sage-10)] dark:bg-[var(--glp-charcoal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]", icon: PenLine },
  review: { label: "In Review", className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300", icon: Eye },
  approved: { label: "Approved", className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300", icon: CheckCircle },
  published: { label: "Published", className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300", icon: CheckCircle },
};

const SHARE_TEMPLATES = {
  instagram: (title, url) => `${title}\n\nRead more on our blog \u2192 ${url}\n\n#genuinelove #mentalwellness #selfcare #healing`,
  x: (title, url) => `${title}\n\n${url}\n\n#mentalwellness #selfcare`,
  tiktok: (title) => `${title} \u2014 link in bio \u2764\uFE0F #genuineloveproject #mentalhealth #healing #selfcare`,
  youtube: (title, url) => `${title}\n\nRead the full article: ${url}\n\nThe Genuine Love Project \u2014 Live in Genuine Love.`,
};

function ShareCaptions({ title, slug }) {
  const url = `https://mymentalhealthbuddy.com/blog/${slug}`;
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors" data-testid={`button-share-${slug}`}>
        <Share2 className="w-3 h-3" /> Share
      </button>
    );
  }
  return (
    <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg space-y-2 text-xs">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-indigo-700 dark:text-indigo-300">Share Captions (copy & paste)</span>
        <button onClick={() => setOpen(false)} className="text-[var(--glp-sage)] hover:text-[var(--glp-deep-teal)]" data-testid={`button-close-share`}><X className="w-3 h-3" /></button>
      </div>
      {Object.entries(SHARE_TEMPLATES).map(([platform, fn]) => (
        <div key={platform} className="flex items-start gap-2">
          <span className="w-16 shrink-0 font-medium capitalize text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{platform}</span>
          <CopyButton text={fn(title, url)} label={`Copy ${platform}`} />
        </div>
      ))}
    </div>
  );
}

export default function AdminPublishing() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [showCreateDraft, setShowCreateDraft] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [draftForm, setDraftForm] = useState({ title: "", content: "", excerpt: "", contentType: "blog_post" });
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const tabs = [
    { key: "pipeline", label: "Editorial Pipeline", icon: GitPullRequest },
    { key: "recommendations", label: "Recommendations", icon: Lightbulb },
    { key: "registry", label: "Registry", icon: FileText },
    { key: "drafts", label: "Newsletter Drafts", icon: Mail },
    { key: "calendar", label: "Calendar", icon: Calendar },
    { key: "signals", label: "Signals", icon: BarChart3 },
  ];

  const { data: registryData, isLoading: regLoading, error: publishError, refetch: refetchRegistry } = useQuery({ queryKey: ["/api/admin/publishing/registry"] });
  const { data: draftsData, isLoading: draftsLoading } = useQuery({ queryKey: ["/api/admin/publishing/drafts"] });
  const { data: calendarData, isLoading: calLoading } = useQuery({ queryKey: ["/api/admin/publishing/calendar"] });
  const { data: signalsData, isLoading: sigLoading } = useQuery({ queryKey: ["/api/admin/publishing/signals/summary"] });
  const { data: pipelineData, isLoading: pipeLoading } = useQuery({
    queryKey: ["/api/blog/admin/stats"],
    enabled: activeTab === "pipeline",
  });
  const { data: recsData, isLoading: recsLoading } = useQuery({
    queryKey: ["/api/admin/publishing/recommendations"],
    enabled: activeTab === "recommendations",
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiRequest("PATCH", `/api/admin/publishing/registry/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/publishing/registry"] });
      toast({ title: "Status updated" });
    },
    onError: (err) => toast({ title: "Status update failed", description: err.message, variant: "destructive" }),
  });

  const pipelineActionMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      try {
        return await apiRequest("POST", `/api/blog/admin/${id}/${action}`);
      } catch (err) {
        let parsed = null;
        const colonIdx = err.message?.indexOf(": ");
        if (colonIdx > 0) {
          try { parsed = JSON.parse(err.message.substring(colonIdx + 2)); } catch {}
        }
        if (parsed) {
          const safetyErrors = parsed.errors || [];
          const safetyWarnings = parsed.warnings || [];
          const errorObj = new Error(parsed.message || "Action failed");
          errorObj.safetyErrors = safetyErrors;
          errorObj.safetyWarnings = safetyWarnings;
          throw errorObj;
        }
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/admin/stats"] });
      toast({ title: data?.message || "Action completed" });
    },
    onError: (err) => {
      const parts = [err.message];
      if (err.safetyErrors?.length) {
        parts.push("Blocked: " + err.safetyErrors.join("; "));
      }
      if (err.safetyWarnings?.length) {
        parts.push("Warnings: " + err.safetyWarnings.join("; "));
      }
      toast({ title: "Action failed", description: parts.join("\n"), variant: "destructive" });
    },
  });

  const createDraftMutation = useMutation({
    mutationFn: async (formData) => {
      const isEdit = !!editingPost;
      const res = isEdit
        ? await apiRequest("PUT", `/api/blog/admin/${editingPost.id}`, formData)
        : await apiRequest("POST", "/api/blog/admin/create", formData);
      return { ...(await res.json()), _isEdit: isEdit };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/admin/stats"] });
      toast({ title: data._isEdit ? "Draft updated" : "Draft created", description: data?.message || "" });
      setShowCreateDraft(false);
      setEditingPost(null);
      setDraftForm({ title: "", content: "", excerpt: "", contentType: "blog_post" });
    },
    onError: (err) => {
      toast({ title: "Failed to save draft", description: err.message, variant: "destructive" });
    },
  });

  function handleEditPost(post) {
    setEditingPost(post);
    setDraftForm({
      title: post.title || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      contentType: post.contentType || "blog_post",
    });
    setShowCreateDraft(true);
  }

  function handleCancelForm() {
    setShowCreateDraft(false);
    setEditingPost(null);
    setDraftForm({ title: "", content: "", excerpt: "", contentType: "blog_post" });
  }

  const registry = registryData?.data || [];
  const drafts = draftsData?.data || [];
  const calendar = calendarData?.data || [];
  const signals = signalsData?.data || {};
  const pipeline = pipelineData?.data || {};
  const recs = recsData?.data || {};

  const allPipelinePosts = pipeline.drafts || [];
  const filteredPosts = statusFilter === "all" ? allPipelinePosts : allPipelinePosts.filter(p => p.status === statusFilter);

  const today = new Date().toISOString().split("T")[0];
  const todayItems = calendar.filter(c => c.date === today);

  if (publishError) {
    return <AdminErrorBanner title="Unable to load publishing data" onRetry={refetchRegistry} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <SEO title="Blog Publishing — Admin" noindex />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>

        <h1 className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2" data-testid="text-publishing-title">
          Publishing Command Center
        </h1>
        <p className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-6">Manual-first publishing. No auto-posting. Human decisions only.</p>

        {todayItems.length > 0 && (
          <div className="mb-6 p-4 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Today's Publishing ({today})</h3>
            {todayItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <span className="text-xs px-2 py-0.5 rounded bg-[color-mix(in_srgb,var(--glp-gold)_22%,var(--glp-ivory))] dark:bg-[var(--glp-deep-teal)]">{item.channel}</span>
                <span className="text-sm">{item.title}</span>
                <span className="text-xs text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))]">{item.pillar}</span>
                {item.draft_id && <CopyButton text={item.draft_id} label="Copy ID" />}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[var(--glp-sage)] text-[var(--glp-ivory)]"
                  : "bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-ivory)] hover:bg-[var(--glp-sage-10)] dark:hover:bg-gray-700"
              }`}
              data-testid={`tab-${tab.key}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "pipeline" && (
          <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" data-testid="text-pipeline-title">Editorial Pipeline</h2>
              <button
                onClick={() => { setEditingPost(null); setDraftForm({ title: "", content: "", excerpt: "", contentType: "blog_post" }); setShowCreateDraft(!showCreateDraft); }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[var(--glp-sage)] text-[var(--glp-ivory)] hover:bg-[var(--glp-deep-teal)] transition-colors"
                data-testid="button-create-draft"
              >
                <Plus className="w-4 h-4" /> Create Draft
              </button>
            </div>
            <p className="text-sm text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))] dark:text-[var(--glp-sage)] mb-4">Blog posts flow: Draft → Review → Approved → Published. Content safety validation runs before publishing.</p>

            {showCreateDraft && (
              <div className="mb-6 p-4 border-2 border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{editingPost ? `Editing: ${editingPost.title}` : "New Draft"}</h3>
                  <button onClick={handleCancelForm} className="text-[var(--glp-sage)] hover:text-[var(--glp-deep-teal)]" data-testid="button-cancel-draft"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1 block">Title</label>
                    <input
                      type="text" value={draftForm.title}
                      onChange={(e) => setDraftForm({ ...draftForm, title: e.target.value })}
                      placeholder="A gentle title for your post..."
                      className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-[var(--glp-ivory)] dark:bg-[var(--glp-charcoal)] focus:ring-2 focus:ring-amber-400 outline-none"
                      data-testid="input-draft-title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1 block">Excerpt (optional)</label>
                    <input
                      type="text" value={draftForm.excerpt}
                      onChange={(e) => setDraftForm({ ...draftForm, excerpt: e.target.value })}
                      placeholder="A brief summary..."
                      className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-[var(--glp-ivory)] dark:bg-[var(--glp-charcoal)] focus:ring-2 focus:ring-amber-400 outline-none"
                      data-testid="input-draft-excerpt"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1 block">Content Type</label>
                    <select
                      value={draftForm.contentType}
                      onChange={(e) => setDraftForm({ ...draftForm, contentType: e.target.value })}
                      className="px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-[var(--glp-ivory)] dark:bg-[var(--glp-charcoal)] focus:ring-2 focus:ring-amber-400 outline-none"
                      data-testid="select-draft-type"
                    >
                      <option value="blog_post">Blog Post</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="reflection">Reflection</option>
                      <option value="essay">Essay</option>
                      <option value="note">Note</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1 block">Content</label>
                    <textarea
                      value={draftForm.content}
                      onChange={(e) => setDraftForm({ ...draftForm, content: e.target.value })}
                      placeholder="Write your compassionate, healing-focused content here..."
                      rows={8}
                      className="w-full px-3 py-2 text-sm rounded-lg border dark:border-gray-600 bg-[var(--glp-ivory)] dark:bg-[var(--glp-charcoal)] focus:ring-2 focus:ring-amber-400 outline-none resize-y"
                      data-testid="textarea-draft-content"
                    />
                    <div className="text-xs text-[var(--glp-sage)] mt-1">{draftForm.content.length} characters</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => createDraftMutation.mutate(draftForm)}
                      disabled={!draftForm.title.trim() || !draftForm.content.trim() || createDraftMutation.isPending}
                      className="px-4 py-2 text-sm rounded-lg bg-[var(--glp-sage)] text-[var(--glp-ivory)] hover:bg-[var(--glp-deep-teal)] disabled:opacity-50 transition-colors"
                      data-testid="button-save-draft"
                    >
                      {createDraftMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingPost ? "Update Draft" : "Save Draft"}
                    </button>
                    <button onClick={handleCancelForm} className="px-4 py-2 text-sm rounded-lg bg-[color-mix(in_srgb,var(--glp-sage)_18%,var(--glp-ivory))] dark:bg-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-sage-10)]0 transition-colors" data-testid="button-cancel-form">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {pipeLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {["draft", "review", "approved", "published"].map(status => {
                    const badge = PIPELINE_STATUS_BADGES[status];
                    const count = allPipelinePosts.filter(p => p.status === status).length;
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                        className={`rounded-lg p-3 text-center transition-all ${badge.className} ${statusFilter === status ? "ring-2 ring-amber-500" : "opacity-80 hover:opacity-100"}`}
                        data-testid={`stat-pipeline-${status}`}
                      >
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-xs font-medium">{badge.label}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-[var(--glp-sage)]" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-sm px-2 py-1 rounded border dark:border-gray-600 bg-[var(--glp-ivory)] dark:bg-[var(--glp-charcoal)]"
                    data-testid="select-status-filter"
                  >
                    <option value="all">All ({allPipelinePosts.length})</option>
                    <option value="draft">Draft ({allPipelinePosts.filter(p => p.status === "draft").length})</option>
                    <option value="review">In Review ({allPipelinePosts.filter(p => p.status === "review").length})</option>
                    <option value="approved">Approved ({allPipelinePosts.filter(p => p.status === "approved").length})</option>
                    <option value="published">Published ({allPipelinePosts.filter(p => p.status === "published").length})</option>
                  </select>
                </div>

                {filteredPosts.length === 0 ? (
                  <p className="text-center text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))] dark:text-[var(--glp-sage)] py-6">
                    {allPipelinePosts.length === 0
                      ? "No blog posts in the pipeline yet. Click 'Create Draft' to start your first post."
                      : `No posts with status "${statusFilter}". Try a different filter.`}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-pipeline">
                      <thead>
                        <tr className="border-b dark:border-[color-mix(in_srgb,var(--glp-sage)_35%,transparent)]">
                          <th className="text-left py-2 px-2">Title</th>
                          <th className="text-left py-2 px-2">Type</th>
                          <th className="text-left py-2 px-2">Status</th>
                          <th className="text-left py-2 px-2">Updated</th>
                          <th className="text-left py-2 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPosts.map(post => {
                          const badge = PIPELINE_STATUS_BADGES[post.status] || PIPELINE_STATUS_BADGES.draft;
                          const StatusIcon = badge.icon;
                          return (
                            <tr key={post.id} className="border-b dark:border-[color-mix(in_srgb,var(--glp-sage)_35%,transparent)]/50" data-testid={`row-pipeline-${post.id}`}>
                              <td className="py-2 px-2 font-medium max-w-xs truncate">{post.title}</td>
                              <td className="py-2 px-2"><span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">{post.contentType || "blog_post"}</span></td>
                              <td className="py-2 px-2">
                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${badge.className}`}>
                                  <StatusIcon className="w-3 h-3" /> {badge.label}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-xs text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))]">{post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "—"}</td>
                              <td className="py-2 px-2">
                                <div className="flex gap-1 flex-wrap">
                                  {(post.status === "draft" || post.status === "review") && (
                                    <button
                                      onClick={() => handleEditPost(post)}
                                      className="text-xs px-2 py-1 rounded bg-[color-mix(in_srgb,var(--glp-sage)_18%,var(--glp-ivory))] dark:bg-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage-10)] dark:hover:bg-[var(--glp-sage-10)]0"
                                      data-testid={`button-edit-${post.id}`}
                                    >
                                      Edit
                                    </button>
                                  )}
                                  {post.status === "draft" && (
                                    <button
                                      onClick={() => pipelineActionMutation.mutate({ id: post.id, action: "submit" })}
                                      disabled={pipelineActionMutation.isPending}
                                      className="text-xs px-2 py-1 rounded bg-yellow-500 text-[var(--glp-ivory)] hover:bg-yellow-600 disabled:opacity-50"
                                      data-testid={`button-submit-${post.id}`}
                                    >
                                      Submit for Review
                                    </button>
                                  )}
                                  {post.status === "review" && (
                                    <button
                                      onClick={() => pipelineActionMutation.mutate({ id: post.id, action: "approve" })}
                                      disabled={pipelineActionMutation.isPending}
                                      className="text-xs px-2 py-1 rounded bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:bg-[var(--glp-charcoal)] disabled:opacity-50"
                                      data-testid={`button-approve-${post.id}`}
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {post.status === "approved" && (
                                    <button
                                      onClick={() => pipelineActionMutation.mutate({ id: post.id, action: "publish" })}
                                      disabled={pipelineActionMutation.isPending}
                                      className="text-xs px-2 py-1 rounded bg-[var(--glp-sage)] text-[var(--glp-ivory)] hover:bg-[var(--glp-deep-teal)] disabled:opacity-50"
                                      data-testid={`button-publish-${post.id}`}
                                    >
                                      Publish
                                    </button>
                                  )}
                                  {post.slug && <CopyButton text={`/blog/${post.slug}`} label="Copy URL" />}
                                  {post.status === "published" && post.slug && <ShareCaptions title={post.title} slug={post.slug} />}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Content safety checks run automatically before publishing. Posts with medical claims, urgency manipulation, or pathologizing language will be blocked. Sensitive topics require crisis resource links.</span>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2" data-testid="text-recommendations-title">Publishing Recommendations</h2>
            <p className="text-sm text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))] dark:text-[var(--glp-sage)] mb-4">Analytics-driven insights from the last 7 days. No PII collected. All suggestions are manual — you decide what to act on.</p>
            {recsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg p-4 bg-green-50 dark:bg-green-950/30 text-center" data-testid="stat-subscribers">
                    <Users className="w-5 h-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{recs.newsletter?.totalSubscribers || 0}</div>
                    <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Total Subscribers</div>
                  </div>
                  <div className="rounded-lg p-4 bg-blue-50 dark:bg-blue-950/30 text-center" data-testid="stat-signup-attempts">
                    <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{recs.newsletter?.attemptsLast7d || 0}</div>
                    <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Signup Attempts (7d)</div>
                  </div>
                  <div className="rounded-lg p-4 bg-purple-50 dark:bg-purple-950/30 text-center" data-testid="stat-signup-success">
                    <CheckCircle className="w-5 h-5 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{recs.newsletter?.successesLast7d || 0}</div>
                    <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Successful Signups (7d)</div>
                  </div>
                </div>

                {(recs.topPages || []).length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2"><Eye className="w-4 h-4" /> Top Pages (7d)</h3>
                    <div className="space-y-1">
                      {(recs.topPages || []).map((p, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5 px-3 bg-[var(--glp-sage-10)] dark:bg-[var(--glp-charcoal)]/50 rounded">
                          <span className="text-sm font-mono">{p.path}</span>
                          <span className="text-sm font-medium">{p.views} views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(recs.topCTAs || []).length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Top CTAs (7d)</h3>
                    <div className="space-y-1">
                      {(recs.topCTAs || []).map((c, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5 px-3 bg-[var(--glp-sage-10)] dark:bg-[var(--glp-charcoal)]/50 rounded">
                          <span className="text-sm">{c.name}</span>
                          <span className="text-sm font-medium">{c.clicks} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(recs.suggestedTopics || []).length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Suggested Blog Topics</h3>
                    <p className="text-xs text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))] dark:text-[var(--glp-sage)] mb-2">Based on most-visited pages — write about what your audience is already exploring.</p>
                    <div className="space-y-2">
                      {(recs.suggestedTopics || []).map((t, i) => (
                        <div key={i} className="flex justify-between items-center py-2 px-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">{t.topic}</span>
                            <span className="text-xs text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))] ml-2">(from {t.path})</span>
                          </div>
                          <span className="text-xs bg-[color-mix(in_srgb,var(--glp-gold)_22%,var(--glp-ivory))] dark:bg-[var(--glp-deep-teal)] px-2 py-0.5 rounded">{t.views} views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(recs.topPages || []).length === 0 && (recs.suggestedTopics || []).length === 0 && (
                  <p className="text-center text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))] dark:text-[var(--glp-sage)] py-6">
                    Not enough analytics data yet. Recommendations will appear as visitors interact with the site over the next few days.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "registry" && (
          <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Publishing Registry ({registry.length} items)</h2>
            {regLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-registry">
                  <thead>
                    <tr className="border-b dark:border-[color-mix(in_srgb,var(--glp-sage)_35%,transparent)]">
                      <th className="text-left py-2 px-2">Type</th>
                      <th className="text-left py-2 px-2">Title</th>
                      <th className="text-left py-2 px-2">Pillar</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registry.map(item => (
                      <tr key={item.id} className="border-b dark:border-[color-mix(in_srgb,var(--glp-sage)_35%,transparent)]/50">
                        <td className="py-2 px-2"><span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30">{item.type}</span></td>
                        <td className="py-2 px-2 font-medium">{item.title}</td>
                        <td className="py-2 px-2 text-xs text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))]">{item.pillar}</td>
                        <td className="py-2 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            item.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            item.status === 'approved' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                            'bg-[var(--glp-sage-10)] dark:bg-[var(--glp-charcoal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]'
                          }`}>{item.status}</span>
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex gap-1">
                            {item.status === 'draft' && (
                              <button onClick={() => statusMutation.mutate({ id: item.id, status: 'approved' })} className="text-xs px-2 py-1 rounded bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:bg-[var(--glp-charcoal)]" data-testid={`button-approve-${item.id}`}>Approve</button>
                            )}
                            {item.status === 'approved' && (
                              <button onClick={() => statusMutation.mutate({ id: item.id, status: 'published' })} className="text-xs px-2 py-1 rounded bg-[var(--glp-sage)] text-[var(--glp-ivory)] hover:bg-[var(--glp-deep-teal)]" data-testid={`button-publish-${item.id}`}>Publish</button>
                            )}
                            {item.slug && <CopyButton text={`/blog/${item.slug}`} label="Copy URL" />}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "drafts" && (
          <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Newsletter Drafts ({drafts.length})</h2>
            {draftsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="space-y-4">
                {drafts.map(draft => (
                  <div key={draft.id} className="border dark:border-[color-mix(in_srgb,var(--glp-sage)_35%,transparent)] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{draft.title}</h3>
                        <p className="text-xs text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))]">{draft.pillar} · {draft.status}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${draft.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-[var(--glp-sage-10)] text-[var(--glp-deep-teal)]'}`}>{draft.status}</span>
                    </div>
                    <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-3">{draft.subject}</p>
                    <div className="flex gap-2">
                      <CopyButton text={draft.subject} label="Subject" />
                      <CopyButton text={draft.body_md} label="Body" />
                      {draft.cta_url && <CopyButton text={draft.cta_url} label="CTA URL" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Editorial Calendar ({calendar.length} entries)</h2>
            {calLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-calendar">
                  <thead>
                    <tr className="border-b dark:border-[color-mix(in_srgb,var(--glp-sage)_35%,transparent)]">
                      <th className="text-left py-2 px-2">Date</th>
                      <th className="text-left py-2 px-2">Channel</th>
                      <th className="text-left py-2 px-2">Pillar</th>
                      <th className="text-left py-2 px-2">Title</th>
                      <th className="text-left py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendar.map((item, i) => (
                      <tr key={i} className={`border-b dark:border-[color-mix(in_srgb,var(--glp-sage)_35%,transparent)]/50 ${item.date === today ? 'bg-amber-50 dark:bg-amber-950/20' : ''}`}>
                        <td className="py-2 px-2 font-mono text-xs">{item.date}</td>
                        <td className="py-2 px-2"><span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30">{item.channel}</span></td>
                        <td className="py-2 px-2 text-xs">{item.pillar}</td>
                        <td className="py-2 px-2">{item.title}</td>
                        <td className="py-2 px-2 text-xs">{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "signals" && (
          <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Publishing Signals (Last 7 Days)</h2>
            {sigLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">{signals.totalEvents || 0}</div>
                  <div className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Total Events</div>
                </div>

                {(signals.byEvent || []).length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Events by Type</h3>
                    <div className="space-y-1">
                      {(signals.byEvent || []).map(e => (
                        <div key={e.name} className="flex justify-between items-center py-1 px-2 bg-[var(--glp-sage-10)] dark:bg-[var(--glp-charcoal)]/50 rounded">
                          <span className="text-sm">{e.name}</span>
                          <span className="text-sm font-medium">{e.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(signals.byRoute || []).length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Top Routes</h3>
                    <div className="space-y-1">
                      {(signals.byRoute || []).map(r => (
                        <div key={r.route} className="flex justify-between items-center py-1 px-2 bg-[var(--glp-sage-10)] dark:bg-[var(--glp-charcoal)]/50 rounded">
                          <span className="text-sm font-mono">{r.route}</span>
                          <span className="text-sm font-medium">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(signals.totalEvents || 0) === 0 && (
                  <p className="text-center text-[color-mix(in_srgb,var(--glp-deep-teal)_72%,var(--glp-charcoal))] dark:text-[var(--glp-sage)] py-4">
                    No signal events recorded yet. Events will appear as users interact with blog, newsletter, and pricing pages.
                  </p>
                )}

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h3 className="font-medium mb-1">Recommendations</h3>
                  <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                    Once enough data accumulates, review which pillars drive the most engagement and adjust your editorial calendar accordingly. All changes are manual — the system suggests, you decide.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <SafetyFooter />
      </div>
    </div>
  );
}
