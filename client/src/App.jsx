// client/src/App.jsx
import { Route, Switch } from "wouter";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProtectedTest from "./pages/ProtectedTest";
import AnalyticsPage from "./pages/AnalyticsPage";
import AITestPage from "./pages/AITestPage";

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/protected-test" component={ProtectedTest} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route path="/ai-test" component={AITestPage} />
      </Switch>
    </Layout>
  );
}