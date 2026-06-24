import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Users, FileText, Send, Loader2, Calendar, Eye, AlertTriangle, CheckCircle, BarChart3, AlertCircle } from 'lucide-react';
import { queryClient, apiRequest } from "../../lib/queryClient";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { SEO } from "../../components/SEO";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

// PHASE11667B_NEWSLETTER_ADMIN_VISUAL_TOKEN_PATCH_SAFE

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
    <div className="min-h-screen bg-[var(--glp-ivory)] dark:bg-[var(--glp-charcoal)]">
      <SEO title="Newsletter Admin — Admin" noindex />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '0.5rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} />
          Back to Command Center
        </Link>
        <Link href="/admin/social-studio" className="inline-flex items-center gap-2 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:underline mb-6" data-testid="link-back-studio">
          <ArrowLeft className="w-4 h-4" />
          Back to Publishing Studio
        </Link>

        <h1 className="text-3xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2" data-testid="text-newsletter-title">
          Newsletter Admin
        </h1>
        <p className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-8">
          Internal view of newsletter health. No bulk sends — human trigger only.
        </p>

        {error && (
          <div className="text-center py-16" data-testid="section-error">
            <AlertCircle className="w-12 h-12 text-[var(--glp-blossom)] mx-auto mb-4" />
            <p className="text-[var(--glp-blossom)] dark:text-[var(--glp-blossom)] mb-4">Failed to load data</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-[var(--glp-sage)] text-[var(--glp-ivory)] rounded-lg hover:opacity-90" data-testid="button-retry">
              Retry
            </button>
          </div>
        )}
        
        {!error && isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--glp-deep-teal)]" />
          </div>
        ) : !error ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm border border-[var(--glp-sage)] dark:border-[var(--glp-sage)]" data-testid="card-total-subscribers">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" />
                  <span className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Total Subscribers</span>
                </div>
                <p className="text-3xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{totalSignups}</p>
              </div>

              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm border border-[var(--glp-sage)] dark:border-[var(--glp-sage)]" data-testid="card-drafts-count">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" />
                  <span className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Newsletter Drafts</span>
                </div>
                <p className="text-3xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                  {drafts.filter(d => d.contentType === "newsletter").length}
                </p>
              </div>

              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm border border-[var(--glp-sage)] dark:border-[var(--glp-sage)]" data-testid="card-recent-signups">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" />
                  <span className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Last 7 Days</span>
                </div>
                <p className="text-3xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                  {signupsByDay.slice(0, 7).reduce((sum, d) => sum + (d.count || 0), 0)}
                </p>
              </div>
            </div>

            {signupsByDay.length > 0 && (
              <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] mb-8" data-testid="section-signups-by-day">
                <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Signups by Day (Last 30 Days)
                </h2>
                <div className="space-y-2">
                  {signupsByDay.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-[var(--glp-sage-10)] dark:border-[var(--glp-sage)] last:border-0" data-testid={`row-signup-${i}`}>
                      <span className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                        {entry.day ? new Date(entry.day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown"}
                      </span>
                      <span className="text-sm font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] mb-8" data-testid="section-drafts">
              <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Newsletter Drafts
              </h2>

              {drafts.filter(d => d.contentType === "newsletter").length === 0 ? (
                <p className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] text-sm">
                  No newsletter drafts yet. Create one from the blog admin with content type "newsletter."
                </p>
              ) : (
                <div className="space-y-4">
                  {drafts.filter(d => d.contentType === "newsletter").map((draft) => (
                    <div key={draft.id} className="p-4 rounded-lg bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] border border-[var(--glp-sage)] dark:border-[var(--glp-sage)]" data-testid={`draft-${draft.id}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{draft.title}</h3>
                          <p className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-1">
                            Last updated: {new Date(draft.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href="/admin/social-studio" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] hover:bg-[var(--glp-sage-20)] dark:hover:bg-[var(--glp-charcoal)] transition-colors" data-testid={`button-view-draft-${draft.id}`}>
                            <Eye className="w-3 h-3" />
                            View in Studio
                          </Link>

                          {confirmSendId === draft.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => testSendMutation.mutate(draft.id)}
                                disabled={testSendMutation.isPending}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] hover:bg-[var(--glp-sage-20)] transition-colors"
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
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-ivory)] hover:bg-[var(--glp-sage-10)] transition-colors"
                                data-testid={`button-cancel-send-${draft.id}`}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmSendId(draft.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] text-[var(--glp-deep-teal)] dark:text-[var(--glp-ivory)] hover:bg-[var(--glp-sage-20)] dark:hover:bg-[var(--glp-charcoal)] transition-colors"
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
              <div className="bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] border border-[var(--glp-sage)] dark:border-[var(--glp-sage)] rounded-xl p-4 mb-8" data-testid="text-send-result">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--glp-sage)] dark:text-[var(--glp-sage)]" />
                  <p className="text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                    {testSendMutation.data?.data?.message || "Test send completed."}
                  </p>
                </div>
              </div>
            )}

            {testSendMutation.isError && (
              <div className="bg-[rgba(244,199,195,0.22)] dark:bg-[var(--glp-deep-teal)] border border-[var(--glp-blossom)] dark:border-[var(--glp-blossom)] rounded-xl p-4 mb-8">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[var(--glp-blossom)] dark:text-[var(--glp-blossom)]" />
                  <p className="text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                    Test send failed. The email provider may not be configured.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-[var(--glp-sage-10)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-4 border border-[var(--glp-sage)] dark:border-[var(--glp-sage)]" data-testid="section-safety-note">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
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
