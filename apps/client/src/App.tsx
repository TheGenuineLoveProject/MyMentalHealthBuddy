import { Route, Switch } from "wouter";
import { Navigation } from "./components/Navigation";
import { DashboardPage } from "./pages/DashboardPage";
import { ChatPage } from "./pages/ChatPage";
import { MoodPage } from "./pages/MoodPage";
import { JournalPage } from "./pages/JournalPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { CrisisPage } from "./pages/CrisisPage";
import BillingPage from "./pages/BillingPage";
import AccountPage from "./pages/AccountPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/mood" component={MoodPage} />
          <Route path="/journal" component={JournalPage} />
          <Route path="/resources" component={ResourcesPage} />
          <Route path="/crisis" component={CrisisPage} />
          <Route path="/billing" component={BillingPage} />
          <Route path="/account" component={AccountPage} />
          <Route>
            <div className="text-center mt-8">
              <h1 className="text-2xl font-bold">Page Not Found</h1>
              <p className="text-gray-600">The page you're looking for doesn't exist.</p>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
