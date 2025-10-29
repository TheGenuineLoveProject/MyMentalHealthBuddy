import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "wouter";
import { MessageCircle, Heart, BookOpen, Info, Phone } from "lucide-react";
export function Navigation() {
    const [location] = useLocation();
    const links = [
        { path: "/", label: "Chat", icon: MessageCircle },
        { path: "/mood", label: "Mood", icon: Heart },
        { path: "/journal", label: "Journal", icon: BookOpen },
        { path: "/resources", label: "Resources", icon: Info },
        { path: "/crisis", label: "Crisis", icon: Phone },
    ];
    return (_jsx("nav", { className: "bg-blue-600 text-white shadow-lg", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsx("h1", { className: "text-xl font-bold", children: "MyMentalHealthBuddy" }), _jsx("div", { className: "flex gap-4", children: links.map(({ path, label, icon: Icon }) => (_jsx(Link, { href: path, "data-testid": `link-${label.toLowerCase()}`, children: _jsxs("span", { className: `flex items-center gap-2 px-4 py-2 rounded-lg transition ${location === path
                                    ? "bg-blue-700 font-semibold"
                                    : "hover:bg-blue-500"}`, children: [_jsx(Icon, { size: 18 }), label] }) }, path))) })] }) }) }));
}
