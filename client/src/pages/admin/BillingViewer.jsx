/**
 * Admin Billing Viewer (P128)
 * Read-only billing information for admins
 */

import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Users, TrendingUp, AlertCircle, CheckCircle, Clock, ArrowLeft, RefreshCw } from 'lucide-react';

function formatCurrency(cents) {
  if (!cents && cents !== 0) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100);
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function StatusBadge({ status }) {
  const variants = {
    active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    trialing: { color: 'bg-blue-100 text-blue-800', icon: Clock },
    past_due: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    canceled: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    incomplete: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
  };
  
  const v = variants[status] || variants.incomplete;
  const Icon = v.icon;
  
  return (
    <Badge className={`${v.color} gap-1`} data-testid={`badge-status-${status}`}>
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse motion-reduce:animate-none bg-gray-200 dark:bg-gray-700 rounded h-8 w-16" />
  );
}

export default function BillingViewerPage() {
  const { data: billingData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/admin/billing/overview'],
  });

  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ['/api/admin/billing/subscriptions'],
  });

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="animate-pulse motion-reduce:animate-none bg-gray-200 dark:bg-gray-700 rounded h-4 w-24" />
              </CardHeader>
              <CardContent>
                <LoadingSkeleton />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-16" data-testid="section-error">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load data</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-[var(--glp-sage)] text-white rounded-lg hover:opacity-90" data-testid="button-retry">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = billingData || {
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    mrr: 0,
    churnRate: 0,
  };

  const subsList = subscriptions?.subscriptions || [];

  return (
    <div className="container py-8 space-y-8">
      <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
        <ArrowLeft size={16} /> Back to Command Center
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Billing Overview</h1>
        <p className="text-muted-foreground">Read-only view of subscription data</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4" data-testid="section-stats">
        <Card data-testid="card-total-subscriptions">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-subs">
              {stats.totalSubscriptions}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-active-subscriptions">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="stat-active-subs">
              {stats.activeSubscriptions}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-mrr">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-mrr">
              {formatCurrency(stats.mrr)}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-churn-rate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-churn">
              {stats.churnRate?.toFixed(1) || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card data-testid="card-recent-subscriptions">
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>Last 50 subscription records (read-only)</CardDescription>
        </CardHeader>
        <CardContent>
          {subsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse motion-reduce:animate-none bg-gray-200 dark:bg-gray-700 rounded h-12 w-full" />
              ))}
            </div>
          ) : subsList.length === 0 ? (
            <p className="text-center text-muted-foreground py-8" data-testid="text-empty-subscriptions">
              No subscription data available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="subscriptions-table">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-2 font-medium">User</th>
                    <th className="text-left py-3 px-2 font-medium">Plan</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                    <th className="text-left py-3 px-2 font-medium">Created</th>
                    <th className="text-left py-3 px-2 font-medium">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {subsList.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800" data-testid={`sub-row-${sub.id}`}>
                      <td className="py-3 px-2 font-medium">
                        {sub.userEmail || sub.userId}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline">{sub.tier || sub.plan}</Badge>
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="py-3 px-2">{formatDate(sub.createdAt)}</td>
                      <td className="py-3 px-2">{formatDate(sub.currentPeriodEnd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
