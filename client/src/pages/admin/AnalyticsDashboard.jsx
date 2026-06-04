import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Eye, MousePointer, ShoppingCart, Mail, TrendingUp, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState("7d");

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['/api/analytics/admin/summary'],
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-testid="analytics-loading">
        <Loader2 className="w-8 h-8 animate-spin motion-reduce:animate-none text-[var(--glp-sage)]" />
        <span className="ml-3 text-muted-foreground">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return <AdminErrorBanner title="Unable to load analytics dashboard" onRetry={refetch} />;
  }

  return (
    <>
      <SEO title="Analytics Dashboard | Admin" description="Product analytics overview" />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8" data-testid="page-analytics-dashboard">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>
        <div className="flex items-center justify-between" data-testid="panel-header">
          <div>
            <h1 className="text-2xl font-semibold font-sacred text-[var(--glp-sage-deep)]" data-testid="text-analytics-title">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-[var(--glp-ink-60)] mt-1" data-testid="text-total-events">
              Aggregated product signals — {data?.totalEvents || 0} total events recorded
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching} data-testid="button-refresh">
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefetching ? 'animate-spin motion-reduce:animate-none' : ''}`} /> Refresh
            </Button>
            {["24h", "7d"].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${timeframe === t ? "bg-[var(--glp-sage)] text-white" : "bg-[var(--glp-sage)]/10 text-[var(--glp-sage-deep)]"}`}
                data-testid={`button-timeframe-${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[var(--glp-sage-15)] bg-white dark:bg-gray-900 p-6 space-y-4" data-testid="card-top-pages">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[var(--glp-sage)]" />
              <h2 className="font-semibold text-[var(--glp-sage-deep)]">Top Pages (24h)</h2>
            </div>
            {data?.topPages24h?.length > 0 ? (
              <div className="space-y-2">
                {data.topPages24h.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-[var(--glp-sage-10)] last:border-0" data-testid={`row-page-${i}`}>
                    <span className="text-sm text-[var(--glp-ink)] truncate max-w-[200px]" data-testid={`text-page-path-${i}`}>{p.path || "(unknown)"}</span>
                    <span className="text-sm font-medium text-[var(--glp-sage-deep)]" data-testid={`text-page-views-${i}`}>{p.views}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--glp-ink-40)] italic" data-testid="text-no-pages">No page views recorded yet</p>
            )}
          </div>

          <div className="rounded-xl border border-[var(--glp-sage-15)] bg-white dark:bg-gray-900 p-6 space-y-4" data-testid="card-top-ctas">
            <div className="flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-[var(--glp-sage)]" />
              <h2 className="font-semibold text-[var(--glp-sage-deep)]">Top CTAs (7d)</h2>
            </div>
            {data?.topCTAs7d?.length > 0 ? (
              <div className="space-y-2">
                {data.topCTAs7d.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-[var(--glp-sage-10)] last:border-0" data-testid={`row-cta-${i}`}>
                    <span className="text-sm text-[var(--glp-ink)]" data-testid={`text-cta-name-${i}`}>{c.eventName}</span>
                    <span className="text-sm font-medium text-[var(--glp-sage-deep)]" data-testid={`text-cta-clicks-${i}`}>{c.clicks}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--glp-ink-40)] italic" data-testid="text-no-ctas">No CTA clicks recorded yet</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[var(--glp-sage-15)] bg-white dark:bg-gray-900 p-6 space-y-4" data-testid="card-checkout-funnel">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[var(--glp-sage)]" />
              <h2 className="font-semibold text-[var(--glp-sage-deep)]">Checkout Funnel (7d)</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(data?.checkoutFunnel || {}).map(([step, total]) => {
                const labels = { pricing_view: "Viewed Pricing", checkout_start: "Started Checkout", checkout_success: "Completed", checkout_cancel: "Cancelled" };
                return (
                  <div key={step} className="flex items-center justify-between" data-testid={`row-funnel-${step}`}>
                    <span className="text-sm text-[var(--glp-ink)]">{labels[step] || step}</span>
                    <span className="text-lg font-semibold text-[var(--glp-sage-deep)]" data-testid={`text-funnel-${step}`}>{total}</span>
                  </div>
                );
              })}
              {Object.keys(data?.checkoutFunnel || {}).length === 0 && (
                <p className="text-sm text-[var(--glp-ink-40)] italic" data-testid="text-no-checkout">No checkout events recorded</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--glp-sage-15)] bg-white dark:bg-gray-900 p-6 space-y-4" data-testid="card-newsletter-funnel">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[var(--glp-sage)]" />
              <h2 className="font-semibold text-[var(--glp-sage-deep)]">Newsletter Funnel (7d)</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(data?.newsletterFunnel || {}).map(([step, total]) => {
                const labels = { newsletter_view: "Viewed Page", signup_attempt: "Started Signup", signup_success: "Signed Up" };
                return (
                  <div key={step} className="flex items-center justify-between" data-testid={`row-newsletter-${step}`}>
                    <span className="text-sm text-[var(--glp-ink)]">{labels[step] || step}</span>
                    <span className="text-lg font-semibold text-[var(--glp-sage-deep)]" data-testid={`text-newsletter-${step}`}>{total}</span>
                  </div>
                );
              })}
              {Object.keys(data?.newsletterFunnel || {}).length === 0 && (
                <p className="text-sm text-[var(--glp-ink-40)] italic" data-testid="text-no-newsletter">No newsletter events recorded</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--glp-sage-10)] bg-[var(--glp-sage)]/5 p-4 text-xs text-[var(--glp-ink-60)]" data-testid="text-privacy-notice">
          <TrendingUp className="w-4 h-4 inline mr-1 text-[var(--glp-sage)]" />
          <strong>Privacy-first analytics:</strong> No PII, no fingerprinting, no session replay. Users can opt out via localStorage.
          Signals are aggregated and minimal. See <code>docs/PRIVACY_SIGNALS.md</code> for full details.
        </div>
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </>
  );
}
