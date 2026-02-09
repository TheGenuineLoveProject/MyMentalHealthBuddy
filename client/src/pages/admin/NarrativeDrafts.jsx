import { useState, useEffect, useCallback } from "react";
import {
  FileText, Copy, Check, Loader2, Eye, Edit,
  MessageSquare, Send, ChevronDown, ChevronUp,
  Instagram, Globe, Filter
} from "lucide-react";
import { SiInstagram, SiX, SiTiktok, SiYoutube } from "react-icons/si";
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  review: { label: "Review", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  posted: { label: "Posted", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
};

const PLATFORM_ICONS = {
  instagram_caption: { icon: SiInstagram, label: "Instagram" },
  tiktok_caption: { icon: SiTiktok, label: "TikTok" },
  youtube_shorts_description: { icon: SiYoutube, label: "YouTube Shorts" },
  x_post: { icon: SiX, label: "X / Twitter" },
};

const STATUS_ORDER = ["draft", "review", "approved", "posted"];

export default function NarrativeDrafts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(null);
  const [copied, setCopied] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const token = localStorage.getItem("glp_admin_token");

  const loadPosts = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch("/api/narrative-drafts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setPosts(data.posts);
    } catch {
      toast({ title: "Could not load narrative posts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const updateStatus = async (postId, newStatus) => {
    setSaving(postId);
    try {
      const res = await fetch(`/api/narrative-drafts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, draft: { ...p.draft, status: newStatus } } : p
          )
        );
        toast({ title: "Status updated", description: `${postId} → ${newStatus}` });
      }
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  const saveEdit = async (postId) => {
    setSaving(postId);
    try {
      const post = posts.find((p) => p.id === postId);
      const res = await fetch(`/api/narrative-drafts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: post?.draft?.status || "draft",
          editedCaption: editCaption || null,
          notes: editNotes || null,
        }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, draft: { ...p.draft, editedCaption: editCaption, notes: editNotes } }
              : p
          )
        );
        setEditingPost(null);
        toast({ title: "Saved" });
      }
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = statusFilter === "all" ? posts : posts.filter((p) => (p.draft?.status || "draft") === statusFilter);
  const counts = posts.reduce((acc, p) => {
    const s = p.draft?.status || "draft";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  if (!token) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Narrative Drafts - Admin" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-narrative-title">
            <FileText className="w-6 h-6" />
            Narrative Drafts ({posts.length})
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manual posting workflow: draft → review → approved → posted
          </p>
        </div>

        <div className="flex gap-2 flex-wrap" data-testid="narrative-status-filters">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            data-testid="button-filter-all"
          >
            All ({posts.length})
          </Button>
          {STATUS_ORDER.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              data-testid={`button-filter-${s}`}
            >
              {STATUS_CONFIG[s].label} ({counts[s] || 0})
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No posts match this filter.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((post, idx) => {
              const status = post.draft?.status || "draft";
              const isExpanded = expandedPost === post.id;
              const isEditing = editingPost === post.id;

              return (
                <Card key={post.id} data-testid={`card-narrative-${post.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{post.id}</span>
                          <Badge className={`text-xs ${STATUS_CONFIG[status].color}`}>
                            {STATUS_CONFIG[status].label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {post.theme}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed line-clamp-2">
                          {post.draft?.editedCaption || post.instagram_caption?.slice(0, 120)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <select
                          value={status}
                          onChange={(e) => updateStatus(post.id, e.target.value)}
                          disabled={saving === post.id}
                          className="text-xs border rounded px-2 py-1 bg-background min-h-[32px]"
                          data-testid={`select-status-${post.id}`}
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                          ))}
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                          className="min-h-[32px] p-2"
                          data-testid={`button-expand-${post.id}`}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0 space-y-4">
                      <div className="border-t pt-4">
                        {post.hook && (
                          <div className="text-sm font-medium text-foreground mb-3 italic">
                            "{post.hook}"
                          </div>
                        )}
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Platform Variants
                        </h4>
                        <div className="grid gap-3">
                          {Object.entries(PLATFORM_ICONS).map(([platform, pConfig]) => {
                            const text = post[platform];
                            if (!text) return null;
                            const Icon = pConfig.icon;
                            const copyKey = `${post.id}-${platform}`;
                            return (
                              <div key={platform} className="border rounded-lg p-3 bg-muted/30">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    <span className="text-xs font-medium">{pConfig.label}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(text, copyKey)}
                                    className="min-h-[32px] px-2"
                                    data-testid={`button-copy-${copyKey}`}
                                  >
                                    {copied === copyKey ? (
                                      <Check className="w-3 h-3 text-green-500" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                                <p className="text-xs leading-relaxed whitespace-pre-wrap">{text}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {post.gentle_cta_url && (
                        <div className="text-xs text-muted-foreground border-l-2 border-amber-300 pl-3">
                          <span className="font-medium">CTA URL:</span> {post.gentle_cta_url}
                        </div>
                      )}

                      {post.safety_note && (
                        <div className="text-xs text-red-600 dark:text-red-400 border-l-2 border-red-300 pl-3">
                          <span className="font-medium">Safety note:</span> {post.safety_note}
                        </div>
                      )}

                      {post.draft?.notes && !isEditing && (
                        <div className="text-xs text-muted-foreground border-l-2 border-blue-300 pl-3">
                          <span className="font-medium">Notes:</span> {post.draft.notes}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t">
                        {!isEditing ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingPost(post.id);
                              setEditCaption(post.draft?.editedCaption || "");
                              setEditNotes(post.draft?.notes || "");
                            }}
                            data-testid={`button-edit-${post.id}`}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit Draft
                          </Button>
                        ) : (
                          <div className="w-full space-y-3">
                            <div>
                              <label className="text-xs font-medium mb-1 block">Edited Caption</label>
                              <Textarea
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                                placeholder="Edit caption (leave empty to use original)..."
                                rows={4}
                                className="text-sm"
                                data-testid={`textarea-caption-${post.id}`}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium mb-1 block">Notes</label>
                              <Textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder="Internal notes (not published)..."
                                rows={2}
                                className="text-sm"
                                data-testid={`textarea-notes-${post.id}`}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(post.id)}
                                disabled={saving === post.id}
                                data-testid={`button-save-${post.id}`}
                              >
                                {saving === post.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                ) : (
                                  <Check className="w-3 h-3 mr-1" />
                                )}
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingPost(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
