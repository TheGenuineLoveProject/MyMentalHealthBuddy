import { Route, Switch } from "wouter";
import Layout from "@/components/layout/Layout";

import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import AIPage from "@/pages/AIPage";
import AnalyticsPage from "@/pages/AnalyticsPage";

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/ai" component={AIPage} />
        <Route path="/analytics" component={AnalyticsPage} />
      </Switch>
    </Layout>
  );
}
