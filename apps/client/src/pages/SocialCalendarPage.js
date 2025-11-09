import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { CalendarView } from "@/components/CalendarView";
import { useToast } from "@/hooks";
import { Calendar as CalendarIcon, Instagram, Twitter, Facebook, Linkedin, Clock, CheckCircle2, List } from "lucide-react";
import { SiTiktok } from "react-icons/si";
/**
 * Social Calendar - Schedule and manage social media posts
 */
export default function SocialCalendarPage() {
    const [viewMode, setViewMode] = useState('list');
    const toast = useToast();
    const scheduledPosts = [
        {
            id: 1,
            content: "5 simple mindfulness exercises you can do in 5 minutes 🧘‍♀️",
            platforms: ["instagram", "twitter", "facebook"],
            scheduledFor: "Today, 2:00 PM",
            status: "scheduled",
            engagement: { likes: 0, shares: 0 }
        },
        {
            id: 2,
            content: "New blog post: Understanding anxiety and how to manage it 💙",
            platforms: ["linkedin", "twitter"],
            scheduledFor: "Tomorrow, 10:00 AM",
            status: "scheduled",
            engagement: { likes: 0, shares: 0 }
        },
        {
            id: 3,
            content: "Weekly check-in: How are you feeling today? 💭",
            platforms: ["instagram", "twitter", "tiktok"],
            scheduledFor: "Dec 30, 6:00 PM",
            status: "approved",
            engagement: { likes: 0, shares: 0 }
        }
    ];
    const getPlatformIcon = (platform) => {
        const icons = {
            instagram: Instagram,
            twitter: Twitter,
            facebook: Facebook,
            linkedin: Linkedin,
            tiktok: SiTiktok
        };
        return icons[platform] || CalendarIcon;
    };
    const getStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-500",
            approved: "bg-green-500",
            scheduled: "bg-blue-500",
            published: "bg-purple-500"
        };
        return colors[status] || "bg-gray-500";
    };
    return (_jsxs("div", { className: "container mx-auto p-6 max-w-7xl", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", "data-testid": "text-page-title", children: "Social Calendar" }), _jsx("p", { className: "text-muted-foreground text-lg", children: "Schedule and manage your social media presence across all platforms" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Scheduled Posts" }), _jsx("div", { className: "text-3xl font-bold", "data-testid": "text-stats-scheduled", children: "12" })] }), _jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Published Today" }), _jsx("div", { className: "text-3xl font-bold", "data-testid": "text-stats-published", children: "3" })] }), _jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Total Engagement" }), _jsx("div", { className: "text-3xl font-bold", "data-testid": "text-stats-engagement", children: "1.2k" })] }), _jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Pending Approval" }), _jsx("div", { className: "text-3xl font-bold", "data-testid": "text-stats-pending", children: "5" })] })] }), _jsxs("div", { className: "flex gap-3 mb-6", children: [_jsxs(Button, { onClick: () => toast.info("New Post", "Opening post composer..."), "data-testid": "button-new-post", children: [_jsx(CalendarIcon, { className: "h-4 w-4 mr-2" }), "Schedule New Post"] }), _jsxs(Button, { variant: viewMode === 'calendar' ? 'primary' : 'secondary', onClick: () => setViewMode('calendar'), "data-testid": "button-view-calendar", children: [_jsx(CalendarIcon, { className: "h-4 w-4 mr-2" }), "Calendar View"] }), _jsxs(Button, { variant: viewMode === 'list' ? 'primary' : 'secondary', onClick: () => setViewMode('list'), "data-testid": "button-view-list", children: [_jsx(List, { className: "h-4 w-4 mr-2" }), "List View"] })] }), _jsxs(Card, { className: "p-6 mb-8", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Connected Platforms" }), _jsxs("div", { className: "flex gap-3 flex-wrap", children: [_jsxs(Badge, { variant: "primary", className: "flex items-center gap-2 py-2 px-3", "data-testid": "badge-platform-instagram", children: [_jsx(Instagram, { className: "h-4 w-4" }), "Instagram", _jsx(CheckCircle2, { className: "h-3 w-3 text-green-400" })] }), _jsxs(Badge, { variant: "primary", className: "flex items-center gap-2 py-2 px-3", "data-testid": "badge-platform-twitter", children: [_jsx(Twitter, { className: "h-4 w-4" }), "Twitter/X", _jsx(CheckCircle2, { className: "h-3 w-3 text-green-400" })] }), _jsxs(Badge, { variant: "primary", className: "flex items-center gap-2 py-2 px-3", "data-testid": "badge-platform-facebook", children: [_jsx(Facebook, { className: "h-4 w-4" }), "Facebook", _jsx(CheckCircle2, { className: "h-3 w-3 text-green-400" })] }), _jsxs(Badge, { variant: "primary", className: "flex items-center gap-2 py-2 px-3", "data-testid": "badge-platform-linkedin", children: [_jsx(Linkedin, { className: "h-4 w-4" }), "LinkedIn", _jsx(CheckCircle2, { className: "h-3 w-3 text-green-400" })] }), _jsxs(Badge, { variant: "gray", className: "flex items-center gap-2 py-2 px-3", "data-testid": "badge-platform-tiktok", children: [_jsx(SiTiktok, { className: "h-4 w-4" }), "TikTok", _jsx("span", { className: "text-xs text-muted-foreground", children: "Not connected" })] })] })] }), viewMode === 'calendar' ? (_jsx(CalendarView, { posts: scheduledPosts.map(post => {
                    // Helper to format date in local timezone as YYYY-MM-DD
                    const formatLocalDate = (date) => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    };
                    // Parse relative and absolute dates to local ISO format
                    let isoDate;
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    if (post.scheduledFor.startsWith('Today')) {
                        isoDate = formatLocalDate(today);
                    }
                    else if (post.scheduledFor.startsWith('Tomorrow')) {
                        isoDate = formatLocalDate(tomorrow);
                    }
                    else if (post.scheduledFor.startsWith('Dec 30')) {
                        const dec30 = new Date(today.getFullYear(), 11, 30); // Month is 0-indexed
                        isoDate = formatLocalDate(dec30);
                    }
                    else {
                        // Default to tomorrow if format unknown
                        isoDate = formatLocalDate(tomorrow);
                    }
                    // Extract time from scheduledFor string
                    const timeMatch = post.scheduledFor.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    const time = timeMatch ? timeMatch[0] : '12:00 PM';
                    return {
                        id: post.id,
                        date: isoDate,
                        content: post.content,
                        platforms: post.platforms,
                        time: time
                    };
                }), onDateClick: (date) => toast.info("Date Selected", `Selected: ${date.toLocaleDateString()}`) })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Upcoming Posts" }), scheduledPosts.map((post) => (_jsxs(Card, { className: "p-6 hover:shadow-lg transition-shadow", "data-testid": `card-post-${post.id}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("div", { className: `h-2 w-2 rounded-full ${getStatusColor(post.status)}` }), _jsx(Badge, { variant: "gray", "data-testid": `badge-status-${post.id}`, children: post.status }), _jsxs("div", { className: "flex items-center text-sm text-muted-foreground", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), post.scheduledFor] })] }), _jsx("p", { className: "text-lg mb-3", "data-testid": `text-content-${post.id}`, children: post.content }), _jsx("div", { className: "flex gap-2", children: post.platforms.map((platform) => {
                                                    const Icon = getPlatformIcon(platform);
                                                    return (_jsxs(Badge, { variant: "gray", className: "flex items-center gap-1", "data-testid": `badge-platform-${post.id}-${platform}`, children: [_jsx(Icon, { className: "h-3 w-3" }), platform] }, platform));
                                                }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "secondary", size: "sm", "data-testid": `button-edit-${post.id}`, children: "Edit" }), _jsx(Button, { variant: "secondary", size: "sm", "data-testid": `button-preview-${post.id}`, children: "Preview" })] })] }), post.status === "published" && (_jsxs("div", { className: "pt-4 border-t flex gap-6 text-sm text-muted-foreground", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: post.engagement.likes }), " Likes"] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: post.engagement.shares }), " Shares"] })] }))] }, post.id)))] })), _jsxs(Card, { className: "mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "\uD83D\uDCCA Best Times to Post" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-blue-600 dark:text-blue-400", children: "Weekdays" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "10:00 AM - 2:00 PM" })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-purple-600 dark:text-purple-400", children: "Evenings" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "6:00 PM - 9:00 PM" })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-green-600 dark:text-green-400", children: "Weekends" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "12:00 PM - 4:00 PM" })] })] })] })] }));
}
