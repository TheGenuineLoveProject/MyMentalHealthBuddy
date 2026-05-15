import { 
  Home, User, MessageSquare, BookOpen, BarChart3, 
  Settings, Heart, Sparkles, Shield, FileText,
  Brain, Compass, Target, Lightbulb, Users
} from "lucide-react";

export const NAV_ITEMS = {
  main: [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/chat", label: "AI Chat", icon: MessageSquare },
    { path: "/journal", label: "Journal", icon: BookOpen },
  ],
  
  tools: [
    { path: "/tools", label: "All Tools", icon: Compass },
    { path: "/tools/wisdom", label: "Wisdom Tools", icon: Lightbulb },
    { path: "/tools/advanced", label: "Advanced Tools", icon: Brain },
    { path: "/tools/mastery", label: "Mastery Tools", icon: Target },
  ],
  
  wellness: [
    { path: "/wellness", label: "Wellness Hub", icon: Heart },
    { path: "/mood", label: "Mood Tracker", icon: BarChart3 },
    { path: "/state", label: "State Check", icon: User },
    { path: "/crisis", label: "Crisis Resources", icon: Shield },
  ],
  
  account: [
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/premium", label: "Premium", icon: Sparkles },
    { path: "/pricing", label: "Pricing", icon: FileText },
  ],
  
  legal: [
    { path: "/terms", label: "Terms of Service" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/disclaimer", label: "Disclaimer" },
    { path: "/ethics", label: "Ethics" },
  ],
  
  social: [
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/community", label: "Community", icon: Users },
  ],
};

export const PUBLIC_PATHS = [
  "/",
  "/home",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/blog",
  "/blog/:slug",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/ethics",
  "/legal",
  "/landing",
  "/pricing",
  "/health",
  "/crisis",
];

export const PROTECTED_PATHS = [
  "/dashboard",
  "/chat",
  "/journal",
  "/mood",
  "/state",
  "/wellness",
  "/tools",
  "/tools/wisdom",
  "/tools/advanced",
  "/tools/mastery",
  "/settings",
  "/premium",
  "/upgrade",
  "/onboarding",
  "/mirror",
  "/today",
  "/daily",
  "/analytics",
  "/community",
];

export const ADMIN_PATHS = [
  "/admin",
  "/publishing",
  "/social",
  "/control",
  "/blog/editor",
  "/blog/editor/:id",
];
