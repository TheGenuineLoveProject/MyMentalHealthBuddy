import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, RefreshCw, Calendar, Copy, Check, Loader2, Star, Send, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { SEO } from "../../components/SEO";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "x", label: "X / Twitter" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtubeShorts", label: "YouTube Shorts" },
];

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      data-testid={`copy-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className="text-xs"
    >
      {copied ? <Check className="w-3 h-3 mr-1 text-green-600" /> : <Copy className="w-3 h-3 mr-1" />}
      {copied ? "Copied!" : `Copy ${label}`}
    </Button>
  );
}

export default function AdminPublishingToday() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const today = new Date().toISOString().split("T")[0];

  const { data: draftsData, isLoading: draftsLoading, error: draftsError, refetch: refetchDrafts } = useQuery({
    queryKey: ['/api/admin/publishing/draft-packs'],
    queryFn: async () => {
      const res = await fetch("/api/admin/publishing/draft-packs", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load drafts");
      return res.json();
    },
    retry: 2,
    retryDelay: 1000,
  });

  const { data: featuredData, refetch: refetchFeatured } = useQuery({
    queryKey: ['/api/admin/publishing/featured'],
    queryFn: async () => {
      const res = await fetch("/api/admin/publishing/featured", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load featured");
      return res.json();
    },
    retry: 2,
    retryDelay: 1000,
  });

  const setFeaturedMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/admin/publishing/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date: today, glpId: id }),
      });
      if (!res.ok) throw new Error("Failed to set featured");
      return res.json();
    },
    onSuccess: () => {
      refetchFeatured();
      refetchDrafts();
    },
  });

  const markPostedMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/publishing/mark-posted/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark posted");
      return res.json();
    },
    onSuccess: () => {
      refetchDrafts();
      refetchFeatured();
    },
  });

  const drafts = draftsData?.ok ? (draftsData.data || []) : [];
  const featured = featuredData?.ok ? (featuredData.data?.[today] || null) : null;

  const readyDrafts = drafts.filter((d) => d.status === "draft" || d.status === "approved");
  const postedDrafts = drafts.filter((d) => d.status === "posted");
  const filtered = filter === "all" ? readyDrafts : readyDrafts.filter((d) => d.type === filter);
  const featuredDraft = featured ? drafts.find((d) => d.id === featured.glpId) : null;

  const handleRefresh = () => {
    refetchDrafts();
    refetchFeatured();
  };

  if (draftsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-testid="loading-publishing">
        <Loader2 className="w-8 h-8 animate-spin motion-reduce:animate-none text-primary" />
        <span className="ml-3 text-muted-foreground">Loading publishing dashboard...</span>
      </div>
    );
  }

  if (draftsError) {
    return <AdminErrorBanner title="Unable to load publishing today" onRetry={refetchDrafts} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6" data-testid="page-publishing-today">
      <SEO title="Publishing Today — Admin" noindex />
      <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
        <ArrowLeft size={16} /> Back to Command Center
      </Link>

      <div className="flex items-center justify-between" data-testid="panel-header">
        <div>
          <h1 className="text-2xl font-semibold text-foreground" data-testid="heading-todays-pick">
            Today's Publishing Pick
          </h1>
          <p className="text-sm text-muted-foreground mt-1" data-testid="text-summary">
            {today} &middot; {readyDrafts.length} drafts ready &middot; {postedDrafts.length} posted
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} data-testid="button-refresh">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="panel-stats">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold" data-testid="stat-total">{drafts.length}</p>
            <p className="text-xs text-muted-foreground">Total Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600" data-testid="stat-ready">{readyDrafts.length}</p>
            <p className="text-xs text-muted-foreground">Ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600" data-testid="stat-posted">{postedDrafts.length}</p>
            <p className="text-xs text-muted-foreground">Posted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600" data-testid="stat-featured">{featuredDraft ? "1" : "0"}</p>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
      </div>

      {featuredDraft && (
        <Card className="border-2 border-green-300 bg-green-50/50 dark:bg-green-950/20" data-testid="featured-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wider flex items-center gap-1" data-testid="text-featured-label">
                <Star className="w-3 h-3" /> Today's Featured
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700" data-testid="text-featured-pillar">
                {featuredDraft.pillar}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2" data-testid="text-featured-title">{featuredDraft.title}</h3>
            <p className="text-sm text-muted-foreground mb-4" data-testid="text-featured-meta">
              Type: {featuredDraft.type} &middot; CTA: {featuredDraft.primaryCta}
            </p>
            <div className="flex gap-2 flex-wrap mb-3">
              {PLATFORMS.map((p) => (
                <CopyButton key={p.key} text={featuredDraft.captions?.[p.key] || ""} label={p.label} />
              ))}
            </div>
            {featuredDraft.status !== "posted" ? (
              <Button
                onClick={() => markPostedMutation.mutate(featuredDraft.id)}
                disabled={markPostedMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-mark-posted-featured"
              >
                <Send className="w-4 h-4 mr-2" />
                {markPostedMutation.isPending ? "Marking..." : "Mark as Posted"}
              </Button>
            ) : (
              <span className="text-green-600 font-semibold text-sm flex items-center gap-1" data-testid="text-featured-posted">
                <Check className="w-4 h-4" /> Posted
              </span>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 flex-wrap" data-testid="panel-filters">
        {["all", "social", "blog", "newsletter"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            data-testid={`filter-${f}`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} (
            {f === "all" ? readyDrafts.length : readyDrafts.filter((d) => d.type === f).length})
          </Button>
        ))}
      </div>

      <div className="space-y-3" data-testid="panel-drafts-list">
        {filtered.length === 0 && (
          <Card data-testid="text-empty-drafts">
            <CardContent className="py-12 text-center text-muted-foreground">
              No drafts available for this filter.
            </CardContent>
          </Card>
        )}
        {filtered.map((draft) => (
          <Card
            key={draft.id}
            className={featured?.glpId === draft.id ? "border-green-300 bg-green-50/30 dark:bg-green-950/10" : ""}
            data-testid={`draft-card-${draft.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 className="font-semibold text-sm" data-testid={`text-draft-title-${draft.id}`}>{draft.title}</h4>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" data-testid={`badge-type-${draft.id}`}>
                      {draft.type}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" data-testid={`badge-pillar-${draft.id}`}>
                      {draft.pillar}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" data-testid={`badge-cta-${draft.id}`}>
                      {draft.primaryCta}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFeaturedMutation.mutate(draft.id)}
                    disabled={setFeaturedMutation.isPending || featured?.glpId === draft.id}
                    data-testid={`button-feature-${draft.id}`}
                    className="text-xs"
                  >
                    {featured?.glpId === draft.id ? (
                      <><Star className="w-3 h-3 mr-1 text-green-600" /> Featured</>
                    ) : setFeaturedMutation.isPending ? (
                      "Setting..."
                    ) : (
                      <><Star className="w-3 h-3 mr-1" /> Set Pick</>
                    )}
                  </Button>
                  {draft.status !== "posted" && (
                    <Button
                      size="sm"
                      onClick={() => markPostedMutation.mutate(draft.id)}
                      disabled={markPostedMutation.isPending}
                      data-testid={`button-mark-posted-${draft.id}`}
                      className="text-xs"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {markPostedMutation.isPending ? "..." : "Posted"}
                    </Button>
                  )}
                </div>
              </div>

              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid={`toggle-captions-${draft.id}`}>
                  View captions &amp; copy
                </summary>
                <div className="mt-3 space-y-2">
                  {PLATFORMS.map((p) => (
                    <div key={p.key} className="bg-muted/50 rounded-lg p-3" data-testid={`caption-${p.key}-${draft.id}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold">{p.label}</span>
                        <CopyButton text={draft.captions?.[p.key] || ""} label={p.label} />
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {draft.captions?.[p.key] || "No caption"}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
