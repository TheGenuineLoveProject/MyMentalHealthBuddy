import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BookOpen, Video, Headphones, FileText } from "lucide-react";
const RESOURCES = [
    {
        category: "Articles",
        icon: FileText,
        items: [
            { title: "Understanding Anxiety", description: "Learn about anxiety symptoms and coping strategies" },
            { title: "Depression Self-Help", description: "Evidence-based approaches for managing depression" },
            { title: "Building Resilience", description: "Develop skills to bounce back from challenges" },
        ]
    },
    {
        category: "Videos",
        icon: Video,
        items: [
            { title: "Mindfulness Meditation Guide", description: "10-minute guided meditation for beginners" },
            { title: "Breathing Exercises", description: "Techniques to reduce stress and anxiety" },
            { title: "Sleep Hygiene Tips", description: "Improve your sleep quality naturally" },
        ]
    },
    {
        category: "Podcasts",
        icon: Headphones,
        items: [
            { title: "Mental Health Matters", description: "Weekly discussions on mental wellness topics" },
            { title: "Therapy Talks", description: "Insights from licensed therapists" },
            { title: "Recovery Stories", description: "Inspiring journeys of mental health recovery" },
        ]
    },
    {
        category: "Exercises",
        icon: BookOpen,
        items: [
            { title: "Gratitude Journaling", description: "Daily practice to shift perspective" },
            { title: "Progressive Muscle Relaxation", description: "Release physical tension" },
            { title: "Cognitive Reframing", description: "Challenge negative thought patterns" },
        ]
    }
];
export function ResourcesPage() {
    return (_jsxs("div", { className: "max-w-6xl mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Mental Health Resources" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Explore our curated collection of articles, videos, exercises, and podcasts to support your mental health journey." }), _jsx("div", { className: "grid md:grid-cols-2 gap-6", children: RESOURCES.map(({ category, icon: Icon, items }) => (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Icon, { className: "text-blue-600", size: 24 }), _jsx("h2", { className: "text-xl font-semibold", children: category })] }), _jsx("div", { className: "space-y-3", children: items.map((item, i) => (_jsxs("div", { className: "p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer", "data-testid": `resource-${category.toLowerCase()}-${i}`, children: [_jsx("h3", { className: "font-medium text-gray-900", children: item.title }), _jsx("p", { className: "text-sm text-gray-600", children: item.description })] }, i))) })] }, category))) })] }));
}
