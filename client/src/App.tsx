/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { Route, Switch, Redirect } from "wouter";
import Dashboard from "./pages/dashboard";
import ChatPage from "./pages/chat";
import MoodTracker from "./pages/mood-tracker";
import Resources from "./pages/resources";
import Journal from "./pages/journal";
import Subscription from "./pages/subscription";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Layout from "./components/Layout";
import { HealingButton } from "./components/HealingButton";

<HealingButton />

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => <Redirect to="/dashboard" />} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/mood" component={MoodTracker} />
        <Route path="/resources" component={Resources} />
        <Route path="/journal" component={Journal} />
        <Route path="/subscription" component={Subscription} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Layout>
  );
}