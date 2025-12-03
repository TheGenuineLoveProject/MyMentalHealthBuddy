import { Link } from "wouter";
import { Heart, BookOpen, MessageCircle, Sparkles, Wind, Target, Moon, AlertCircle } from "lucide-react";

const QUICK_ACTIONS = [
  {
    id: "mood",
    name: "Track Mood",
    description: "Log how you're feeling",
    icon: Heart,
    href: "/mood",
    color: "from-pink-400 to-rose-500",
    bgLight: "from-pink-50 to-rose-50",
    bgDark: "from-pink-900/20 to-rose-900/20",
  },
  {
    id: "journal",
    name: "Write Journal",
    description: "Reflect on your day",
    icon: BookOpen,
    href: "/journal",
    color: "from-purple-400 to-indigo-500",
    bgLight: "from-purple-50 to-indigo-50",
    bgDark: "from-purple-900/20 to-indigo-900/20",
  },
  {
    id: "chat",
    name: "AI Chat",
    description: "Talk with your buddy",
    icon: MessageCircle,
    href: "/chat",
    color: "from-teal-400 to-cyan-500",
    bgLight: "from-teal-50 to-cyan-50",
    bgDark: "from-teal-900/20 to-cyan-900/20",
  },
  {
    id: "wellness",
    name: "Wellness Tools",
    description: "Breathing & meditation",
    icon: Sparkles,
    href: "/wellness",
    color: "from-amber-400 to-orange-500",
    bgLight: "from-amber-50 to-orange-50",
    bgDark: "from-amber-900/20 to-orange-900/20",
  },
  {
    id: "breathing",
    name: "Breathe",
    description: "Quick calming exercise",
    icon: Wind,
    href: "/wellness#breathing",
    color: "from-cyan-400 to-blue-500",
    bgLight: "from-cyan-50 to-blue-50",
    bgDark: "from-cyan-900/20 to-blue-900/20",
  },
  {
    id: "habits",
    name: "Daily Habits",
    description: "Track your progress",
    icon: Target,
    href: "/wellness#habits",
    color: "from-emerald-400 to-teal-500",
    bgLight: "from-emerald-50 to-teal-50",
    bgDark: "from-emerald-900/20 to-teal-900/20",
  },
  {
    id: "meditate",
    name: "Meditate",
    description: "Find your calm",
    icon: Moon,
    href: "/wellness#meditation",
    color: "from-indigo-400 to-purple-500",
    bgLight: "from-indigo-50 to-purple-50",
    bgDark: "from-indigo-900/20 to-purple-900/20",
  },
  {
    id: "crisis",
    name: "Crisis Help",
    description: "Get immediate support",
    icon: AlertCircle,
    href: "/crisis",
    color: "from-red-400 to-rose-500",
    bgLight: "from-red-50 to-rose-50",
    bgDark: "from-red-900/20 to-rose-900/20",
  },
];

export default function QuickActions({ limit = 4, columns = 4, showAll = false }) {
  const displayActions = showAll ? QUICK_ACTIONS : QUICK_ACTIONS.slice(0, limit);

  return (
    <div 
      className={`grid gap-4 ${
        columns === 2 ? "grid-cols-2" : 
        columns === 3 ? "grid-cols-2 md:grid-cols-3" : 
        "grid-cols-2 md:grid-cols-4"
      }`}
      data-testid="quick-actions"
    >
      {displayActions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.id}
            href={action.href}
            className={`group p-5 rounded-2xl bg-gradient-to-br ${action.bgLight} dark:${action.bgDark} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
            data-testid={`quick-action-${action.id}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h4 className="font-display font-bold text-[var(--text)] mb-1 group-hover:text-[var(--primary)] transition-colors">
              {action.name}
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              {action.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
