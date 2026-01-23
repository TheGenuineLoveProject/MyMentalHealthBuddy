import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, Plus, Calendar, FileText, CheckCircle, Clock, 
  Send, LayoutGrid, ListFilter, Sparkles, Instagram, 
  Twitter, Youtube, MessageCircle
} from "lucide-react";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/SafetyFooter";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F" },
  { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "#000000" },
  { id: "threads", name: "Threads/X", icon: Twitter, color: "#1DA1F2" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000" },
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

function DraftCard({ draft, onApprove, onDelete }) {
  const platform = PLATFORMS.find(p => p.id === draft.platform) || PLATFORMS[0];
  const PlatformIcon = platform.icon;
  
  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow"
      data-testid={`card-draft-${draft.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
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
        <div className="flex gap-2">
          {draft.status === "draft" && (
            <button
              onClick={() => onApprove(draft.id)}
              className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
              data-testid={`button-approve-${draft.id}`}
            >
              Approve
            </button>
          )}
          <button
            onClick={() => onDelete(draft.id)}
            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            data-testid={`button-delete-${draft.id}`}
          >
            Delete
          </button>
        </div>
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

export default function SocialDashboard() {
  const [filter, setFilter] = useState("all");
  
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
  
  const filteredDrafts = filter === "all" 
    ? drafts 
    : drafts.filter(d => d.status === filter);
  
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
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
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
              />
            ))}
          </div>
        )}
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
