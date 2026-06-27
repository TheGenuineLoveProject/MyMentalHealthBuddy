// PHASE11760_SOCIAL_DASHBOARD_VISUAL_TOKEN_PATCH
// PHASE11762_SOCIAL_DASHBOARD_REMAINING_TOKEN_CLEANUP
import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Plus, Calendar, FileText, CheckCircle, Clock, Send, LayoutGrid, ListFilter, Sparkles, MessageCircle, AlertCircle, ExternalLink, Settings, Wifi, WifiOff, BarChart2, Activity, PieChart } from 'lucide-react';
import { SiInstagram, SiX, SiYoutube } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
const Instagram = SiInstagram;
const Twitter = SiX;
const Youtube = SiYoutube;
const Linkedin = FaLinkedin;
import { queryClient, apiRequest } from "../../lib/queryClient";
import { SEO } from "@/components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

const PLATFORMS = [
  { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000", handle: "@GenuineLoveProject", url: "https://youtube.com/@GenuineLoveProject", status: "verified" },
  { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "#000000", handle: "@genuineloveproject", url: "https://tiktok.com/@genuineloveproject", status: "live" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F", handle: "@thegenuineloveproject", url: "https://instagram.com/thegenuineloveproject", status: "active" },
  { id: "facebook", name: "Facebook", icon: MessageCircle, color: "#1877F2", handle: "Page", url: "https://facebook.com/profile.php?id=61583664864191", status: "live" },
  { id: "x", name: "X", icon: Twitter, color: "#000000", handle: "@GenuineLoveProj", url: "https://x.com/GenuineLoveProj", status: "active" },
  { id: "threads", name: "Threads", icon: MessageCircle, color: "#000000", handle: null, status: "pending" },
  { id: "pinterest", name: "Pinterest", icon: MessageCircle, color: "#E60023", handle: null, status: "pending" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0A66C2", handle: null, status: "pending" },
];

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-[rgba(143,191,159,0.16)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.10)] dark:text-[var(--glp-sage)]", icon: FileText },
  review: { label: "In Review", color: "bg-[rgba(212,175,55,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(212,175,55,0.14)] dark:text-[var(--glp-gold)]", icon: Clock },
  approved: { label: "Approved", color: "bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.14)] dark:text-[var(--glp-sage)]", icon: CheckCircle },
  scheduled: { label: "Scheduled", color: "bg-[rgba(143,191,159,0.18)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.12)] dark:text-[var(--glp-sage)]", icon: Calendar },
  exported: { label: "Exported", color: "bg-[rgba(244,199,195,0.26)] text-[var(--glp-deep-teal)] dark:bg-[rgba(244,199,195,0.12)] dark:text-[var(--glp-blossom)]", icon: Send },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function DraftCard({ draft, onApprove, onDelete, onPublish, bulkMode, isSelected, onToggleSelect }) {
  const platform = PLATFORMS.find(p => p.id === draft.platform) || PLATFORMS[0];
  const PlatformIcon = platform.icon;
  
  return (
    <div 
      className={`bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border p-4 hover:shadow-md transition-all ${
        isSelected ? "border-[var(--glp-sage)] ring-2 ring-[rgba(143,191,159,0.28)]" : "border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)]"
      }`}
      data-testid={`card-draft-${draft.id}`}
      onClick={() => bulkMode && onToggleSelect?.(draft.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {bulkMode && (
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              isSelected ? "bg-[var(--glp-deep-teal)] border-[var(--glp-deep-teal)]" : "border-[rgba(143,191,159,0.45)] dark:border-[rgba(143,191,159,0.28)]"
            }`}>
              {isSelected && <CheckCircle className="w-3 h-3 text-[var(--glp-ivory)]" />}
            </div>
          )}
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${platform.color}20` }}
          >
            <PlatformIcon className="w-4 h-4" style={{ color: platform.color }} />
          </div>
          <span className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
            {platform.name}
          </span>
        </div>
        <StatusBadge status={draft.status} />
      </div>
      
      {draft.hook && (
        <p className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2 line-clamp-2">
          {draft.hook}
        </p>
      )}
      
      {draft.caption && (
        <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] line-clamp-3 mb-3">
          {draft.caption}
        </p>
      )}
      
      {draft.theme && (
        <span className="inline-block px-2 py-0.5 bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)] rounded text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-3">
          {draft.theme}
        </span>
      )}
      
      <div className="flex items-center justify-between pt-3 border-t border-[rgba(143,191,159,0.24)] dark:border-[rgba(143,191,159,0.18)]">
        <span className="text-xs text-[var(--glp-deep-teal)]">
          {new Date(draft.createdAt).toLocaleDateString()}
        </span>
        {!bulkMode && (
          <div className="flex gap-2">
            {draft.status === "draft" && (
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(draft.id); }}
                className="text-xs px-2 py-1 bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)] rounded hover:bg-[rgba(143,191,159,0.32)] transition-colors"
                data-testid={`button-approve-${draft.id}`}
              >
                Approve
              </button>
            )}
            {draft.status === "approved" && (
              <button
                onClick={(e) => { e.stopPropagation(); onPublish?.(draft); }}
                className="text-xs px-2 py-1 bg-[rgba(244,199,195,0.26)] text-[var(--glp-deep-teal)] rounded hover:bg-[rgba(244,199,195,0.36)] transition-colors flex items-center gap-1"
                data-testid={`button-publish-${draft.id}`}
              >
                <Send className="w-3 h-3" />
                Publish
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(draft.id); }}
              className="text-xs px-2 py-1 bg-[rgba(244,199,195,0.30)] text-[var(--glp-charcoal)] rounded hover:bg-[rgba(244,199,195,0.42)] transition-colors"
              data-testid={`button-delete-${draft.id}`}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStats({ drafts }) {
  const stats = {
    total: drafts.length,
    drafts: drafts.filter(d => d.status === "draft").length,
    approved: drafts.filter(d => d.status === "approved").length,
    scheduled: drafts.filter(d => d.status === "scheduled").length,
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: "Total Drafts", value: stats.total, color: "bg-[rgba(143,191,159,0.16)] text-[var(--glp-deep-teal)]" },
        { label: "In Progress", value: stats.drafts, color: "bg-[rgba(212,175,55,0.22)] text-[var(--glp-deep-teal)]" },
        { label: "Approved", value: stats.approved, color: "bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)]" },
        { label: "Scheduled", value: stats.scheduled, color: "bg-[rgba(143,191,159,0.18)] text-[var(--glp-deep-teal)]" },
      ].map(stat => (
        <div key={stat.label} className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-4 border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)]" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
          <p className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{stat.value}</p>
          <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function PlatformConnections() {
  const { data: platformStatus = {}, isLoading } = useQuery({
    queryKey: ["/api/social-posting/platforms/status"],
  });
  
  if (isLoading) {
    return (
      <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] p-4 sm:p-6 mb-8">
        <div className="animate-pulse motion-reduce:animate-none flex items-center gap-3">
          <div className="w-5 h-5 bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.12)] rounded" />
          <div className="h-4 bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.12)] rounded w-40" />
        </div>
      </div>
    );
  }
  
  const platforms = platformStatus.platforms || [];
  const connectedCount = platforms.filter(p => p.connected).length;
  
  return (
    <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] p-4 sm:p-6 mb-8" data-testid="section-platform-connections">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-[var(--glp-deep-teal)]" />
          <h3 className="font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">Platform Connections</h3>
          <span className="text-xs px-2 py-1 bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)] rounded-full text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
            {connectedCount}/{platforms.length} connected
          </span>
        </div>
        <a 
          href="https://docs.replit.com/hosting/secrets" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-[var(--glp-sage)] hover:underline flex items-center gap-1"
          data-testid="link-secrets-help"
        >
          <ExternalLink className="w-3 h-3" />
          How to add API keys
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {PLATFORMS.map(platform => {
          const status = platforms.find(p => p.id === platform.id);
          const isConnected = status?.connected;
          const PlatformIcon = platform.icon;
          
          const hasHandle = platform.handle && platform.status !== 'pending';
          
          return (
            <a
              key={platform.id}
              href={platform.url || '#'}
              target={platform.url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`flex flex-col items-center p-3 rounded-lg border transition-all hover:shadow-sm ${
                hasHandle
                  ? "border-[rgba(143,191,159,0.42)] dark:border-[rgba(143,191,159,0.26)] bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)]" 
                  : "border-[rgba(143,191,159,0.30)] dark:border-[rgba(143,191,159,0.18)] bg-[rgba(143,191,159,0.08)] dark:bg-[rgba(143,191,159,0.06)] opacity-70"
              } ${platform.url ? 'cursor-pointer' : ''}`}
              data-testid={`platform-status-${platform.id}`}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: `${platform.color}15` }}
              >
                <PlatformIcon className="w-5 h-5" style={{ color: platform.color }} />
              </div>
              <span className="text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] text-center">
                {platform.name}
              </span>
              {platform.handle && (
                <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] truncate max-w-full">
                  {platform.handle}
                </span>
              )}
              <div className="flex items-center gap-1 mt-1">
                {hasHandle ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-[var(--glp-sage)]" />
                    <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] capitalize">{platform.status}</span>
                  </>
                ) : isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 text-[var(--glp-sage)]" />
                    <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">API Ready</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-[var(--glp-sage)]" />
                    <span className="text-xs text-[var(--glp-deep-teal)]">Pending</span>
                  </>
                )}
              </div>
            </a>
          );
        })}
      </div>
      
      {connectedCount === 0 && (
        <div className="mt-4 p-4 bg-[rgba(212,175,55,0.16)] dark:bg-[rgba(212,175,55,0.10)] rounded-lg border border-[rgba(212,175,55,0.35)] dark:border-[rgba(212,175,55,0.22)]">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--glp-gold)] dark:text-[var(--glp-gold)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-gold)]">
                No platforms connected yet
              </p>
              <p className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-gold)] mt-1">
                Add your social media API keys in Replit Secrets to enable automated posting. 
                Content will be generated for manual export until platforms are connected.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContentAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/admin/social/analytics"],
  });
  
  if (isLoading) {
    return (
      <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] p-4 sm:p-6 mb-8">
        <div className="animate-pulse motion-reduce:animate-none">
          <div className="h-5 bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.12)] rounded w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.12)] rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!analytics) return null;
  
  const { totals, contentHealth, platformBreakdown, weeklyActivity } = analytics;
  
  return (
    <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] p-4 sm:p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <BarChart2 className="w-5 h-5 text-[var(--glp-sage)]" />
        <h3 className="font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">Content Analytics</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)] rounded-lg border border-[rgba(143,191,159,0.20)]" data-testid="metric-total-drafts">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-[var(--glp-deep-teal)]" />
            <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Total Drafts</span>
          </div>
          <p className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{totals?.drafts || 0}</p>
        </div>
        <div className="p-4 bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)] rounded-lg border border-[rgba(143,191,159,0.25)]" data-testid="metric-ready-to-publish">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-[var(--glp-sage)]" />
            <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Ready to Publish</span>
          </div>
          <p className="text-2xl font-bold text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{contentHealth?.readyToPublish || 0}</p>
        </div>
        <div className="p-4 bg-[rgba(212,175,55,0.16)] dark:bg-[rgba(212,175,55,0.10)] rounded-lg border border-[rgba(212,175,55,0.25)]" data-testid="metric-pending-review">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[var(--glp-gold)]" />
            <span className="text-xs text-[var(--glp-gold)] dark:text-[var(--glp-gold)]">Pending Review</span>
          </div>
          <p className="text-2xl font-bold text-[var(--glp-deep-teal)] dark:text-[var(--glp-gold)]">{contentHealth?.pendingReview || 0}</p>
        </div>
        <div className="p-4 bg-[rgba(143,191,159,0.14)] dark:bg-[rgba(143,191,159,0.09)] rounded-lg border border-[rgba(143,191,159,0.24)]" data-testid="metric-scheduled">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[var(--glp-sage)]" />
            <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{totals?.upcoming || 0}</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Content by Platform
          </h4>
          <div className="space-y-2">
            {Object.entries(platformBreakdown || {}).map(([platform, count]) => {
              const platformInfo = PLATFORMS.find(p => p.id === platform);
              return (
                <div key={platform} className="flex items-center justify-between p-2 bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)] rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${platformInfo?.color || '#666'}20` }}
                    >
                      {platformInfo?.icon && <platformInfo.icon className="w-3 h-3" style={{ color: platformInfo.color }} />}
                    </div>
                    <span className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] capitalize">{platform}</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{count}</span>
                </div>
              );
            })}
            {Object.keys(platformBreakdown || {}).length === 0 && (
              <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] text-center py-4">
                No platform data yet
              </p>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Weekly Activity
          </h4>
          <div className="space-y-2">
            {(weeklyActivity || []).slice(-5).map(({ week, count }) => (
              <div key={week} className="flex items-center gap-3">
                <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] w-20">{week}</span>
                <div className="flex-1 h-3 bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--glp-sage)] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] w-8 text-right">{count}</span>
              </div>
            ))}
            {(weeklyActivity || []).length === 0 && (
              <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] text-center py-4">
                No activity data yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SocialDashboard() {
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishDraft, setPublishDraft] = useState(null);
  const [publishPlatforms, setPublishPlatforms] = useState([]);
  
  const { data: drafts = [], isLoading, error, refetch } = useQuery({
    queryKey: ["/api/admin/social/drafts"],
  });
  
  const approveMutation = useMutation({
    mutationFn: (id) => apiRequest("POST", `/api/admin/social/drafts/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/drafts"] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/admin/social/drafts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/drafts"] });
    },
  });
  
  const bulkApproveMutation = useMutation({
    mutationFn: (ids) => apiRequest("POST", "/api/admin/social/drafts/bulk/approve", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/drafts"] });
      setSelectedIds([]);
      setBulkMode(false);
    },
  });
  
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids) => apiRequest("POST", "/api/admin/social/drafts/bulk/delete", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/drafts"] });
      setSelectedIds([]);
      setBulkMode(false);
    },
  });
  
  const batchPublishMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/admin/social/publish/batch", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/drafts"] });
      setShowPublishModal(false);
      setPublishDraft(null);
      setPublishPlatforms([]);
    },
  });
  
  const handleOpenPublish = (draft) => {
    setPublishDraft(draft);
    setPublishPlatforms([draft.platform]);
    setShowPublishModal(true);
  };
  
  const togglePublishPlatform = (platformId) => {
    setPublishPlatforms(prev => 
      prev.includes(platformId) ? prev.filter(p => p !== platformId) : [...prev, platformId]
    );
  };
  
  const handleBatchPublish = () => {
    if (!publishDraft || publishPlatforms.length === 0) return;
    batchPublishMutation.mutate({
      draftId: publishDraft.id,
      platforms: publishPlatforms,
    });
  };
  
  const filteredDrafts = filter === "all" 
    ? drafts 
    : drafts.filter(d => d.status === filter);
  
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  
  const selectAll = () => {
    const allIds = filteredDrafts.map(d => d.id);
    setSelectedIds(prev => prev.length === allIds.length ? [] : allIds);
  };

  if (error) {
    return <AdminErrorBanner title="Unable to load social dashboard" onRetry={refetch} />;
  }
  
  return (
    <div className="min-h-screen bg-[var(--glp-ivory)] dark:bg-[var(--glp-charcoal)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '0.5rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} />
          Back to Command Center
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="text-page-title">
              Social Content Studio
            </h1>
            <p className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
              Create, approve, and schedule wellness content
            </p>
            <Link href="/admin/social/ops" className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-1 rounded bg-[var(--glp-deep-teal)] dark:bg-[var(--glp-sage)] text-[var(--glp-ivory)] dark:text-[var(--glp-deep-teal)] hover:bg-[var(--glp-charcoal)] dark:hover:bg-[var(--glp-gold)] transition-colors" data-testid="link-narrative-ops">
              Open Narrative Ops Console (Enterprise v3.0)
            </Link>
          </div>
        </div>
        
        <QuickStats drafts={drafts} />
        
        <ContentAnalytics />
        
        <PlatformConnections />
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Link 
              href="/admin/social/generate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] rounded-lg hover:bg-[var(--glp-charcoal)] transition-opacity"
              data-testid="link-create-draft"
            >
              <Plus className="w-4 h-4" />
              New Draft
            </Link>
            <Link 
              href="/admin/social/library"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.12)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] rounded-lg hover:bg-[rgba(143,191,159,0.26)] dark:hover:bg-[rgba(143,191,159,0.18)] transition-colors"
              data-testid="link-templates"
            >
              <LayoutGrid className="w-4 h-4" />
              Templates
            </Link>
            <Link 
              href="/admin/social/calendar"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.12)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] rounded-lg hover:bg-[rgba(143,191,159,0.26)] dark:hover:bg-[rgba(143,191,159,0.18)] transition-colors"
              data-testid="link-calendar"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </Link>
            <Link 
              href="/admin/social/analytics"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(143,191,159,0.18)] dark:bg-[rgba(143,191,159,0.12)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] rounded-lg hover:bg-[rgba(143,191,159,0.26)] dark:hover:bg-[rgba(143,191,159,0.18)] transition-colors"
              data-testid="link-analytics"
            >
              <BarChart2 className="w-4 h-4" />
              Analytics
            </Link>
            <button
              type="button"
              onClick={() => { setBulkMode(!bulkMode); setSelectedIds([]); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                bulkMode 
                  ? "bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)]" 
                  : "bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:bg-[rgba(143,191,159,0.26)] dark:hover:bg-[rgba(143,191,159,0.18)]"
              }`}
              data-testid="button-bulk-mode"
            >
              <Settings className="w-4 h-4" />
              {bulkMode ? "Exit Bulk Mode" : "Bulk Actions"}
            </button>
          </div>
          
          <div className="flex items-center gap-2 md:ml-auto">
            <ListFilter className="w-4 h-4 text-[var(--glp-deep-teal)]" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] text-sm"
              data-testid="select-filter-status"
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="review">In Review</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>
        
        {bulkMode && (
          <div className="flex items-center gap-4 p-4 mb-6 bg-[rgba(244,199,195,0.18)] dark:bg-[rgba(244,199,195,0.10)] rounded-xl border border-[rgba(244,199,195,0.35)] dark:border-[rgba(244,199,195,0.22)]">
            <button
              type="button"
              onClick={selectAll}
              className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-blossom)] hover:underline"
              data-testid="button-select-all"
            >
              {selectedIds.length === filteredDrafts.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-blossom)]">
              {selectedIds.length} selected
            </span>
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={() => bulkApproveMutation.mutate(selectedIds)}
                disabled={selectedIds.length === 0 || bulkApproveMutation.isPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] rounded-lg hover:bg-[var(--glp-charcoal)] disabled:opacity-50 transition-colors"
                data-testid="button-bulk-approve"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Selected
              </button>
              <button
                type="button"
                onClick={() => bulkDeleteMutation.mutate(selectedIds)}
                disabled={selectedIds.length === 0 || bulkDeleteMutation.isPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--glp-blossom)] text-[var(--glp-charcoal)] rounded-lg hover:bg-[var(--glp-gold)] disabled:opacity-50 transition-colors"
                data-testid="button-bulk-delete"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-16" data-testid="section-error">
            <AlertCircle className="w-12 h-12 text-[var(--glp-blossom)] mx-auto mb-4" />
            <p className="text-[var(--glp-charcoal)] dark:text-[var(--glp-blossom)] mb-4">Failed to load data</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] rounded-lg hover:bg-[var(--glp-charcoal)]" data-testid="button-retry">
              Retry
            </button>
          </div>
        )}
        
        {!error && isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin motion-reduce:animate-none w-8 h-8 border-4 border-[var(--glp-sage)] border-t-transparent rounded-full" />
          </div>
        ) : !error && filteredDrafts.length === 0 ? (
          <div className="text-center py-12 bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)]">
            <Sparkles className="w-12 h-12 mx-auto text-[var(--glp-sage)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">
              No content yet
            </h3>
            <p className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-4">
              Start creating wellness content for your audience
            </p>
            <Link 
              href="/admin/social/generate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] rounded-lg hover:bg-[var(--glp-charcoal)] transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Create Your First Draft
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrafts.map(draft => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onApprove={(id) => approveMutation.mutate(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
                onPublish={handleOpenPublish}
                bulkMode={bulkMode}
                isSelected={selectedIds.includes(draft.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        )}
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
      
      {showPublishModal && publishDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl shadow-xl w-full max-w-lg border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)]">
            <div className="flex items-center justify-between p-4 border-b border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)]">
              <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] flex items-center gap-2">
                <Send className="w-5 h-5 text-[var(--glp-blossom)]" />
                Publish to Platforms
              </h2>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-2 hover:bg-[rgba(143,191,159,0.16)] dark:hover:bg-[rgba(143,191,159,0.10)] rounded-lg transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5 text-[var(--glp-deep-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="p-3 bg-[rgba(244,199,195,0.18)] dark:bg-[rgba(244,199,195,0.10)] rounded-lg">
                <p className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-blossom)] mb-1">
                  {publishDraft.hook?.slice(0, 60) || "Draft Content"}
                </p>
                <p className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-blossom)]">
                  {publishDraft.caption?.slice(0, 100)}...
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-3">
                  Select platforms to publish:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.filter(p => p.status !== "pending").map(platform => {
                    const isSelected = publishPlatforms.includes(platform.id);
                    const PlatformIcon = platform.icon;
                    
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => togglePublishPlatform(platform.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          isSelected 
                            ? "border-[var(--glp-sage)] bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)]" 
                            : "border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] hover:bg-[rgba(143,191,159,0.14)] dark:hover:bg-[rgba(143,191,159,0.10)]"
                        }`}
                        data-testid={`toggle-platform-${platform.id}`}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${platform.color}15` }}
                        >
                          <PlatformIcon className="w-4 h-4" style={{ color: platform.color }} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{platform.name}</p>
                          {platform.handle && (
                            <p className="text-xs text-[var(--glp-deep-teal)]">{platform.handle}</p>
                          )}
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-[var(--glp-blossom)] ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-4 py-2 border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] rounded-lg text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:bg-[rgba(143,191,159,0.14)] dark:hover:bg-[rgba(143,191,159,0.10)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBatchPublish}
                  disabled={batchPublishMutation.isPending || publishPlatforms.length === 0}
                  className="flex-1 px-4 py-2 bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] rounded-lg hover:bg-[var(--glp-charcoal)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="button-confirm-publish"
                >
                  {batchPublishMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Publish to {publishPlatforms.length} Platform{publishPlatforms.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
