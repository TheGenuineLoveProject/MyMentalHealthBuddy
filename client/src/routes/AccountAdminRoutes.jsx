import { Route } from "wouter";

export default function AccountAdminRoutes({
  ProtectedRoute,
  AdminGuard,
  ConfigRoute,
  AccountProfile,
  AccountBilling,
  NotificationPreferences,
  SafetyPreferences,
  ContentAdminDashboard,
  CRMPage,
}) {
  return (
    <>
      <Route path="/account/profile">
        <ProtectedRoute><AccountProfile /></ProtectedRoute>
      </Route>
      <Route path="/account/billing">
        <ProtectedRoute><AccountBilling /></ProtectedRoute>
      </Route>
      <Route path="/preferences/notifications">
        <ProtectedRoute><NotificationPreferences /></ProtectedRoute>
      </Route>
      <Route path="/preferences/safety">
        <ProtectedRoute><SafetyPreferences /></ProtectedRoute>
      </Route>

      <Route path="/content-admin">
        <AdminGuard><ContentAdminDashboard /></AdminGuard>
      </Route>
      <Route path="/crm">
        <AdminGuard><CRMPage /></AdminGuard>
      </Route>

      <Route path="/control">{() => <ConfigRoute route="/control" />}</Route>
      <Route path="/health">{() => <ConfigRoute route="/health" />}</Route>
      <Route path="/publishing">{() => <ConfigRoute route="/publishing" />}</Route>
      <Route path="/qa">{() => <ConfigRoute route="/qa" />}</Route>
    </>
  );
}
