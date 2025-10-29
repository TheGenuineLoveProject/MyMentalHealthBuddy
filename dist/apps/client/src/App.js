import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Switch } from "wouter";
import { Navigation } from "./components/Navigation";
import { ChatPage } from "./pages/ChatPage";
import { MoodPage } from "./pages/MoodPage";
import { JournalPage } from "./pages/JournalPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { CrisisPage } from "./pages/CrisisPage";
export default function App() {
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navigation, {}), _jsx("main", { children: _jsxs(Switch, { children: [_jsx(Route, { path: "/", component: ChatPage }), _jsx(Route, { path: "/mood", component: MoodPage }), _jsx(Route, { path: "/journal", component: JournalPage }), _jsx(Route, { path: "/resources", component: ResourcesPage }), _jsx(Route, { path: "/crisis", component: CrisisPage }), _jsx(Route, { children: _jsxs("div", { className: "text-center mt-8", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Page Not Found" }), _jsx("p", { className: "text-gray-600", children: "The page you're looking for doesn't exist." })] }) })] }) })] }));
}
