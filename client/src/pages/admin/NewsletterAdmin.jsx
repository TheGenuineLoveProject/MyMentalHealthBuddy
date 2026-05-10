import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Users, FileText, Send, Loader2, Calendar, Eye, AlertTriangle, CheckCircle, BarChart3, AlertCircle } from 'lucide-react';
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { SEO } from "../../components/SEO";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

export default function NewsletterAdmin() {
  const [confirmSendId, setConfirmSendId] = useState(null);

  const { data: statsData, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/blog/admin/stats"],
  });

  const testSendMutation = useMutation({
    mutationFn: async (draftId) => {
      const res = await apiRequest("POST", "/api/blog/admin/test-send", { draftId });
      return res.json();
    },
    onSuccess: (data) => {
      setConfirmSendId(null);
    },
  });

  const stats = statsData?.data;
  const drafts = stats?.drafts || [];
  const signupsByDay = stats?.signupsByDay || [];
  const totalSignups = stats?.newsletterSignups || 0;

  if (error) return <AdminErrorBanner title="Unable to load newsletter data" message="The newsletter service may be temporarily unavailable." onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <SEO title="Newsletter Admin — Admin" noindex />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '0.5rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} />
          Back to Command Center
        </Link>
        <Link href="/admin/social-studio" className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:underline mb-6" data-testid="link-back-studio">
          <ArrowLeft className="w-4 h-4" />
          Back to Publishing Studio
        </Link>

        <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2" data-testid="text-newsletter-title">
          Newsletter Admin
        </h1>
        <p className="text-amber-700 dark:text-amber-300 mb-8">
          Internal view of newsletter health. No bulk sends — human trigger only.
        </p>

        {error && (
          <div className="text-center py-16" data-testid="section-error">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 mb-4">Failed to load data</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-[var(--glp-sage)] text-white rounded-lg hover:opacity-90" data-testid="button-retry">
              Retry
            </button>
          </div>
        )}
        
        {!error && isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : !error ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-gray-700" data-testid="card-total-subscribers">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-700 dark:text-amber-300">Total Subscribers</span>
                </div>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{totalSignups}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-gray-700" data-testid="card-drafts-count">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-700 dark:text-amber-300">Newsletter Drafts</span>
                </div>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {drafts.filter(d => d.contentType === "newsletter").length}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-gray-700" data-testid="card-recent-signups">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-700 dark:text-amber-300">Last 7 Days</span>
                </div>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {signupsByDay.slice(0, 7).reduce((sum, d) => sum + (d.count || 0), 0)}
                </p>
              </div>
            </div>

            {signupsByDay.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-gray-700 mb-8" data-testid="section-signups-by-day">
                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Signups by Day (Last 30 Days)
                </h2>
                <div className="space-y-2">
                  {signupsByDay.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-amber-50 dark:border-gray-700 last:border-0" data-testid={`row-signup-${i}`}>
                      <span className="text-sm text-amber-700 dark:text-amber-300">
                        {entry.day ? new Date(entry.day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown"}
                      </span>
                      <span className="text-sm font-medium text-amber-900 dark:text-amber-100">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-gray-700 mb-8" data-testid="section-drafts">
              <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Newsletter Drafts
              </h2>

              {drafts.filter(d => d.contentType === "newsletter").length === 0 ? (
                <p className="text-amber-600 dark:text-amber-400 text-sm">
                  No newsletter drafts yet. Create one from the blog admin with content type "newsletter."
                </p>
              ) : (
                <div className="space-y-4">
                  {drafts.filter(d => d.contentType === "newsletter").map((draft) => (
                    <div key={draft.id} className="p-4 rounded-lg bg-amber-50 dark:bg-gray-700 border border-amber-100 dark:border-gray-600" data-testid={`draft-${draft.id}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-amber-900 dark:text-amber-100">{draft.title}</h3>
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            Last updated: {new Date(draft.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href="/admin/social-studio" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-amber-100 dark:bg-gray-600 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-gray-500 transition-colors" data-testid={`button-view-draft-${draft.id}`}>
                            <Eye className="w-3 h-3" />
                            View in Studio
                          </Link>

                          {confirmSendId === draft.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => testSendMutation.mutate(draft.id)}
                                disabled={testSendMutation.isPending}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 transition-colors"
                                data-testid={`button-confirm-send-${draft.id}`}
                              >
                                {testSendMutation.isPending ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmSendId(null)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                                data-testid={`button-cancel-send-${draft.id}`}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmSendId(draft.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                              data-testid={`button-test-send-${draft.id}`}
                            >
                              <Send className="w-3 h-3" />
                              Test Send to Me
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {testSendMutation.isSuccess && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-8" data-testid="text-send-result">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-800 dark:text-green-200">
                    {testSendMutation.data?.data?.message || "Test send completed."}
                  </p>
                </div>
              </div>
            )}

            {testSendMutation.isError && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Test send failed. The email provider may not be configured.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-amber-100/50 dark:bg-gray-700/50 rounded-xl p-4 border border-amber-200 dark:border-gray-600" data-testid="section-safety-note">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium mb-1">Manual-only sending</p>
                  <p>
                    No bulk email sends are configured. The "Test Send" button sends only to
                    your admin email address. To send to subscribers, use your email provider's
                    dashboard directly with exported subscriber data.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-12">
          <SafetyFooter />
        </div>
      </div>
    </div>
  );
}
