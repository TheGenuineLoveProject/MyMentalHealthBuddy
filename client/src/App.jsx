import React from "react";
import { Route, Link, Switch } from "wouter";
import ThemeProvider from "./components/ThemeProvider.jsx";
import Dashboard from "./pages/Dashboard.tsx";
import Home from "./pages/Home.jsx";
import MoodPage from "./pages/MoodPage.jsx";
import JournalPage from "./pages/JournalPage.jsx";
import AIChatPage from "./pages/AIChatPage.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
        <Link href="/">Home</Link> |{" "}
        <Link href="/dashboard">Dashboard</Link> |{" "}
        <Link href="/mood">Mood</Link> |{" "}
        <Link href="/journal">Journal</Link> |{" "}
        <Link href="/ai">AI Chat</Link>
      </nav>

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/mood" component={MoodPage} />
        <Route path="/journal" component={JournalPage} />
        <Route path="/ai" component={AIChatPage} />
        <Route>404 – Page Not Found</Route>
      </Switch>
    </ThemeProvider>
  );
}