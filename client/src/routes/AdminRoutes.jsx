import React from "react";
import { Route } from "wouter";

export default function AdminRoutes({
  AdminGuard,
  RolesPermissions,
  FeatureFlags,
  SystemAlerts,
  FeedbackAggregator,
  NarrativeDrafts,
  EngagementDashboard,
  AnalyticsDashboard,
  AdminUsers,
  AdminTools,
}) {
  return (
    <>
      <Route path="/admin/roles">{() => <AdminGuard><RolesPermissions /></AdminGuard>}</Route>
      <Route path="/admin/feature-flags">{() => <AdminGuard><FeatureFlags /></AdminGuard>}</Route>
      <Route path="/admin/alerts">{() => <AdminGuard><SystemAlerts /></AdminGuard>}</Route>
      <Route path="/admin/feedback">{() => <AdminGuard><FeedbackAggregator /></AdminGuard>}</Route>
      <Route path="/admin/narrative">{() => <AdminGuard><NarrativeDrafts /></AdminGuard>}</Route>
      <Route path="/admin/engagement">{() => <AdminGuard><EngagementDashboard /></AdminGuard>}</Route>
      <Route path="/admin/analytics">{() => <AdminGuard><AnalyticsDashboard /></AdminGuard>}</Route>
      <Route path="/admin/users">{() => <AdminGuard><AdminUsers /></AdminGuard>}</Route>
      <Route path="/admin/tools">{() => <AdminGuard><AdminTools /></AdminGuard>}</Route>
    </>
  );
}
