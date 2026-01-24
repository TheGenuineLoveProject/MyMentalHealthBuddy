import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, Plus, Calendar, FileText, CheckCircle, Clock, 
  Send, LayoutGrid, ListFilter, Sparkles, Instagram, 
  Twitter, Youtube, MessageCircle, Linkedin, AlertCircle,
  ExternalLink, Settings, Wifi, WifiOff, TrendingUp, BarChart2,
  Activity, PieChart
} from "lucide-react";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/SafetyFooter";

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
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700", icon: FileText },
  review: { label: "In Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-700", icon: Calendar },
  exported: { label: "Exported", color: "bg-purple-100 text-purple-700", icon: Send },
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

function DraftCard({ draft, onApprove, onDelete, bulkMode, isSelected, onToggleSelect }) {
  const platform = PLATFORMS.find(p => p.id === draft.platform) || PLATFORMS[0];
  const PlatformIcon = platform.icon;
  
  return (
    <div 
      className={`bg-white dark:bg-slate-800 rounded-xl border p-4 hover:shadow-md transition-all ${
        isSelected ? "border-purple-500 ring-2 ring-purple-200" : "border-slate-200 dark:border-slate-700"
      }`}
      data-testid={`card-draft-${draft.id}`}
      onClick={() => bulkMode && onToggleSelect?.(draft.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {bulkMode && (
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              isSelected ? "bg-purple-600 border-purple-600" : "border-slate-300 dark:border-slate-600"
            }`}>
              {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
          )}
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${platform.color}20` }}
          >
            <PlatformIcon className="w-4 h-4" style={{ color: platform.color }} />
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {platform.name}
          </span>
        </div>
        <StatusBadge status={draft.status} />
      </div>
      
      {draft.hook && (
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {draft.hook}
        </p>
      )}
      
      {draft.caption && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
          {draft.caption}
        </p>
      )}
      
      {draft.theme && (
        <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400 mb-3">
          {draft.theme}
        </span>
      )}
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        <span className="text-xs text-slate-500">
          {new Date(draft.createdAt).toLocaleDateString()}
        </span>
        {!bulkMode && (
          <div className="flex gap-2">
            {draft.status === "draft" && (
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(draft.id); }}
                className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                data-testid={`button-approve-${draft.id}`}
              >
                Approve
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(draft.id); }}
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
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
        { label: "Total Drafts", value: stats.total, color: "bg-slate-100 text-slate-700" },
        { label: "In Progress", value: stats.drafts, color: "bg-amber-100 text-amber-700" },
        { label: "Approved", value: stats.approved, color: "bg-emerald-100 text-emerald-700" },
        { label: "Scheduled", value: stats.scheduled, color: "bg-blue-100 text-blue-700" },
      ].map(stat => (
        <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
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
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40" />
        </div>
      </div>
    );
  }
  
  const platforms = platformStatus.platforms || [];
  const connectedCount = platforms.filter(p => p.connected).length;
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-slate-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Platform Connections</h3>
          <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400">
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
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20" 
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-60"
              } ${platform.url ? 'cursor-pointer' : ''}`}
              data-testid={`platform-status-${platform.id}`}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: `${platform.color}15` }}
              >
                <PlatformIcon className="w-5 h-5" style={{ color: platform.color }} />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                {platform.name}
              </span>
              {platform.handle && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-full">
                  {platform.handle}
                </span>
              )}
              <div className="flex items-center gap-1 mt-1">
                {hasHandle ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 capitalize">{platform.status}</span>
                  </>
                ) : isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">API Ready</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">Pending</span>
                  </>
                )}
              </div>
            </a>
          );
        })}
      </div>
      
      {connectedCount === 0 && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                No platforms connected yet
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
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
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!analytics) return null;
  
  const { totals, contentHealth, platformBreakdown, weeklyActivity } = analytics;
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <BarChart2 className="w-5 h-5 text-[var(--glp-sage)]" />
        <h3 className="font-semibold text-slate-900 dark:text-white">Content Analytics</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Drafts</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totals?.drafts || 0}</p>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400">Ready to Publish</span>
          </div>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{contentHealth?.readyToPublish || 0}</p>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-amber-600 dark:text-amber-400">Pending Review</span>
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{contentHealth?.pendingReview || 0}</p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-blue-600 dark:text-blue-400">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totals?.upcoming || 0}</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Content by Platform
          </h4>
          <div className="space-y-2">
            {Object.entries(platformBreakdown || {}).map(([platform, count]) => {
              const platformInfo = PLATFORMS.find(p => p.id === platform);
              return (
                <div key={platform} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${platformInfo?.color || '#666'}20` }}
                    >
                      {platformInfo?.icon && <platformInfo.icon className="w-3 h-3" style={{ color: platformInfo.color }} />}
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{platform}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{count}</span>
                </div>
              );
            })}
            {Object.keys(platformBreakdown || {}).length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                No platform data yet
              </p>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Weekly Activity
          </h4>
          <div className="space-y-2">
            {(weeklyActivity || []).slice(-5).map(({ week, count }) => (
              <div key={week} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 w-20">{week}</span>
                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--glp-sage)] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-8 text-right">{count}</span>
              </div>
            ))}
            {(weeklyActivity || []).length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
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
  
  const { data: drafts = [], isLoading } = useQuery({
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
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Social Content Studio
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create, approve, and schedule wellness content
            </p>
          </div>
        </div>
        
        <QuickStats drafts={drafts} />
        
        <ContentAnalytics />
        
        <PlatformConnections />
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Link 
              href="/admin/social/generate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--glp-sage)] text-white rounded-lg hover:opacity-90 transition-opacity"
              data-testid="link-create-draft"
            >
              <Plus className="w-4 h-4" />
              New Draft
            </Link>
            <Link 
              href="/admin/social/library"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              data-testid="link-templates"
            >
              <LayoutGrid className="w-4 h-4" />
              Templates
            </Link>
            <Link 
              href="/admin/social/calendar"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              data-testid="link-calendar"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </Link>
            <button
              type="button"
              onClick={() => { setBulkMode(!bulkMode); setSelectedIds([]); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                bulkMode 
                  ? "bg-purple-600 text-white" 
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
              data-testid="button-bulk-mode"
            >
              <Settings className="w-4 h-4" />
              {bulkMode ? "Exit Bulk Mode" : "Bulk Actions"}
            </button>
          </div>
          
          <div className="flex items-center gap-2 md:ml-auto">
            <ListFilter className="w-4 h-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm"
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
          <div className="flex items-center gap-4 p-4 mb-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <button
              type="button"
              onClick={selectAll}
              className="text-sm text-purple-700 dark:text-purple-300 hover:underline"
              data-testid="button-select-all"
            >
              {selectedIds.length === filteredDrafts.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm text-purple-600 dark:text-purple-400">
              {selectedIds.length} selected
            </span>
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={() => bulkApproveMutation.mutate(selectedIds)}
                disabled={selectedIds.length === 0 || bulkApproveMutation.isPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                data-testid="button-bulk-approve"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Selected
              </button>
              <button
                type="button"
                onClick={() => bulkDeleteMutation.mutate(selectedIds)}
                disabled={selectedIds.length === 0 || bulkDeleteMutation.isPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                data-testid="button-bulk-delete"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--glp-sage)] border-t-transparent rounded-full" />
          </div>
        ) : filteredDrafts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <Sparkles className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No content yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Start creating wellness content for your audience
            </p>
            <Link 
              href="/admin/social/generate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--glp-sage)] text-white rounded-lg hover:opacity-90 transition-opacity"
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
                bulkMode={bulkMode}
                isSelected={selectedIds.includes(draft.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        )}
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
