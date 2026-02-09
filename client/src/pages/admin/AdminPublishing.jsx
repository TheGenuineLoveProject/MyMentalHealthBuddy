import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft, FileText, Mail, Calendar, Copy, Check,
  ChevronDown, Loader2, BookOpen, Send, BarChart3
} from "lucide-react";
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/SafetyFooter";

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
      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors"
      data-testid={`button-copy-${label}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}

export default function AdminPublishing() {
  const [activeTab, setActiveTab] = useState("registry");
  const tabs = [
    { key: "registry", label: "Registry", icon: FileText },
    { key: "drafts", label: "Newsletter Drafts", icon: Mail },
    { key: "calendar", label: "Calendar", icon: Calendar },
    { key: "signals", label: "Signals", icon: BarChart3 },
  ];

  const { data: registryData, isLoading: regLoading } = useQuery({ queryKey: ["/api/admin/publishing/registry"] });
  const { data: draftsData, isLoading: draftsLoading } = useQuery({ queryKey: ["/api/admin/publishing/drafts"] });
  const { data: calendarData, isLoading: calLoading } = useQuery({ queryKey: ["/api/admin/publishing/calendar"] });
  const { data: signalsData, isLoading: sigLoading } = useQuery({ queryKey: ["/api/admin/publishing/signals/summary"] });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiRequest("PATCH", `/api/admin/publishing/registry/${id}`, { status });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/publishing/registry"] }),
  });

  const registry = registryData?.data || [];
  const drafts = draftsData?.data || [];
  const calendar = calendarData?.data || [];
  const signals = signalsData?.data || {};

  const today = new Date().toISOString().split("T")[0];
  const todayItems = calendar.filter(c => c.date === today);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:underline mb-6" data-testid="link-back-admin">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-publishing-title">
          Publishing Command Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Manual-first publishing. No auto-posting. Human decisions only.</p>

        {todayItems.length > 0 && (
          <div className="mb-6 p-4 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Today's Publishing ({today})</h3>
            {todayItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <span className="text-xs px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-800">{item.channel}</span>
                <span className="text-sm">{item.title}</span>
                <span className="text-xs text-gray-500">{item.pillar}</span>
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
                  ? "bg-amber-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-700"
              }`}
              data-testid={`tab-${tab.key}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "registry" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Publishing Registry ({registry.length} items)</h2>
            {regLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-registry">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-2 px-2">Type</th>
                      <th className="text-left py-2 px-2">Title</th>
                      <th className="text-left py-2 px-2">Pillar</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registry.map(item => (
                      <tr key={item.id} className="border-b dark:border-gray-700/50">
                        <td className="py-2 px-2"><span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30">{item.type}</span></td>
                        <td className="py-2 px-2 font-medium">{item.title}</td>
                        <td className="py-2 px-2 text-xs text-gray-500">{item.pillar}</td>
                        <td className="py-2 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            item.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            item.status === 'approved' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>{item.status}</span>
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex gap-1">
                            {item.status === 'draft' && (
                              <button onClick={() => statusMutation.mutate({ id: item.id, status: 'approved' })} className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600" data-testid={`button-approve-${item.id}`}>Approve</button>
                            )}
                            {item.status === 'approved' && (
                              <button onClick={() => statusMutation.mutate({ id: item.id, status: 'published' })} className="text-xs px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600" data-testid={`button-publish-${item.id}`}>Publish</button>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Newsletter Drafts ({drafts.length})</h2>
            {draftsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="space-y-4">
                {drafts.map(draft => (
                  <div key={draft.id} className="border dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{draft.title}</h3>
                        <p className="text-xs text-gray-500">{draft.pillar} · {draft.status}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${draft.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{draft.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{draft.subject}</p>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Editorial Calendar ({calendar.length} entries)</h2>
            {calLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-calendar">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-2 px-2">Date</th>
                      <th className="text-left py-2 px-2">Channel</th>
                      <th className="text-left py-2 px-2">Pillar</th>
                      <th className="text-left py-2 px-2">Title</th>
                      <th className="text-left py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendar.map((item, i) => (
                      <tr key={i} className={`border-b dark:border-gray-700/50 ${item.date === today ? 'bg-amber-50 dark:bg-amber-950/20' : ''}`}>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Publishing Signals (Last 7 Days)</h2>
            {sigLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">{signals.totalEvents || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
                </div>

                {(signals.byEvent || []).length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Events by Type</h3>
                    <div className="space-y-1">
                      {(signals.byEvent || []).map(e => (
                        <div key={e.name} className="flex justify-between items-center py-1 px-2 bg-gray-50 dark:bg-gray-700/50 rounded">
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
                        <div key={r.route} className="flex justify-between items-center py-1 px-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                          <span className="text-sm font-mono">{r.route}</span>
                          <span className="text-sm font-medium">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(signals.totalEvents || 0) === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No signal events recorded yet. Events will appear as users interact with blog, newsletter, and pricing pages.
                  </p>
                )}

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h3 className="font-medium mb-1">Recommendations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
