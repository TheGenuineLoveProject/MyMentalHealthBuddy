import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Calendar, Bell, Users, TrendingUp, Heart, Clock, 
  CheckCircle, Star, MessageCircle, Activity, Target,
  ChevronRight, User, Settings, Home, BookOpen
} from 'lucide-react';
import SEO from '../components/SEO';
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import LumiMascot from "../components/lumi/LumiMascot.jsx";
import { pickBenefits } from "@/lib/benefits";
import { useToast } from "@/hooks/use-toast";

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const upcomingEvents = [
    { id: 1, time: '9:00 AM', title: 'Morning Meditation', type: 'practice', badge: '+10 XP' },
    { id: 2, time: '12:00 PM', title: 'Mindful Lunch Break', type: 'reminder' },
    { id: 3, time: '3:00 PM', title: 'Community Circle Call', type: 'community', badge: 'Live' },
    { id: 4, time: '7:00 PM', title: 'Evening Journaling', type: 'practice', badge: '+15 XP' },
  ];

  const notifications = [
    { id: 1, text: 'Your 7-day streak is going strong!', time: '2h ago', read: false },
    { id: 2, text: 'New healing journey available: Inner Peace', time: '5h ago', read: false },
    { id: 3, text: 'Sarah commented on your reflection', time: '1d ago', read: true },
    { id: 4, text: 'Weekly progress report is ready', time: '2d ago', read: true },
  ];

  const stats = [
    { label: 'Current Streak', value: '7 days', icon: Activity, colorVar: '--glp-gold' },
    { label: 'Mood Trend', value: '+15%', icon: TrendingUp, colorVar: '--glp-sage' },
    { label: 'Sessions', value: '23', icon: Heart, colorVar: '--glp-blush' },
    { label: 'XP Earned', value: '1,250', icon: Star, colorVar: '--glp-sage-deep' },
  ];

  const quickActions = [
    { label: 'Start Meditation', icon: Heart, href: '/breathing' },
    { label: 'Write Journal', icon: BookOpen, href: '/journal' },
    { label: 'Check Mood', icon: Activity, href: '/mood' },
    { label: 'View Progress', icon: TrendingUp, href: '/progress' },
  ];

  return (
  <WellnessPageShell
    title="CRMPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <>
      <SEO 
        title="Wellness Dashboard - The Genuine Love Project"
        description="Your personal wellness command center. Track progress, manage your healing journey, and access all wellness tools."
      />
      <div className="min-h-screen" style={{ background: 'var(--glp-paper)' }} data-testid="crm-page">
        <nav className="border-b sticky top-0 z-50 backdrop-blur-lg" style={{ background: 'var(--glp-paper-98)', borderColor: 'var(--glp-sage-20)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-3" data-testid="link-home">
                  <span aria-hidden="true" className="h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)', boxShadow: '0 2px 10px var(--glp-sage-deep-12)' }}>
                    <LumiMascot emotion="neutral" size={40} />
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Dashboard</span>
                </Link>
                <div className="hidden md:flex items-center gap-1">
                  <Link href="/dashboard" className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-ink)' }}>Overview</Link>
                  <Link href="/journal" className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-ink)' }}>Journal</Link>
                  <Link href="/mood" className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-ink)' }}>Mood</Link>
                  <Link href="/tools" className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-ink)' }}>Tools</Link>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toast({ title: "Notifications", description: "You have 2 unread notifications" })}
                  className="p-2.5 rounded-lg transition-colors hover:bg-[var(--glp-sage-10)]" 
                  style={{ color: 'var(--glp-ink)' }} 
                  data-testid="button-notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setLocation('/settings')}
                  className="p-2.5 rounded-lg transition-colors hover:bg-[var(--glp-sage-10)]" 
                  style={{ color: 'var(--glp-ink)' }} 
                  data-testid="button-settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ background: 'var(--glp-sage)' }}>
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-10">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Welcome Back</h1>
            <p style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>Your personal wellness dashboard</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-10">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)', boxShadow: '0 2px 8px var(--glp-sage-10)' }}
                data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <stat.icon className="h-5 w-5" style={{ color: `var(${stat.colorVar})` }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>{stat.label}</span>
                </div>
                <p className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--glp-sage-deep)' }}>{stat.value}</p>
              </div>
            ))}
          </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl p-6" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)', boxShadow: '0 2px 8px var(--glp-sage-10)' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </h2>
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--glp-sage)' }}
                  data-testid="link-calendar"
                >
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <ul className="space-y-3" data-testid="event-list">
                {upcomingEvents.map((event) => (
                  <li 
                    key={event.id}
                    className="flex items-center gap-3 p-4 rounded-xl border-l-4 transition-all hover:shadow-sm"
                    style={{
                      borderLeftColor: event.type === 'practice' ? 'var(--glp-gold)' : event.type === 'community' ? 'var(--glp-blush)' : 'var(--glp-sage)',
                      background: event.type === 'practice' ? 'var(--glp-gold-10)' : event.type === 'community' ? 'var(--glp-rose-15)' : 'var(--glp-sage-10)'
                    }}
                    data-testid={`event-${event.id}`}
                  >
                    <Clock className="h-4 w-4" style={{ color: 'var(--glp-ink)', opacity: 0.5 }} />
                    <span className="text-sm w-20" style={{ color: 'var(--glp-ink)', opacity: 0.6 }}>{event.time}</span>
                    <span className="font-medium flex-1" style={{ color: 'var(--glp-sage-deep)' }}>{event.title}</span>
                    {event.badge && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ background: 'var(--glp-gold)', color: 'var(--glp-sage-deep)' }}>
                        {event.badge}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)', boxShadow: '0 2px 8px var(--glp-sage-10)' }}>
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--glp-sage-deep)' }}>
                <Target className="h-5 w-5" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg"
                    style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-15)' }}
                    data-testid={`action-${action.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <action.icon className="h-5 w-5" style={{ color: 'var(--glp-sage)' }} />
                    <span className="font-medium" style={{ color: 'var(--glp-sage-deep)' }}>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)', boxShadow: '0 2px 8px var(--glp-sage-10)' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  <Bell className="h-5 w-5" />
                  Notifications
                </h2>
                <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ background: 'var(--glp-blush)', color: 'var(--glp-sage-deep)' }}>
                  {notifications.filter(n => !n.read).length} new
                </span>
              </div>
              <ul className="space-y-3" data-testid="notification-list">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id}
                    className="flex items-start gap-3 py-3 border-b last:border-0"
                    style={{ borderColor: 'var(--glp-sage-10)' }}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ background: notification.read ? 'var(--glp-sage-20)' : 'var(--glp-gold)' }}
                    />
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: 'var(--glp-ink)' }}>{notification.text}</p>
                      <span className="text-xs" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>{notification.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-teal-800))' }}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5" style={{ color: 'var(--glp-gold)' }} />
                <span className="font-semibold">Daily Wisdom</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                "The journey of a thousand miles begins with a single step. Today, take that step with intention and love."
              </p>
              <div className="text-xs text-white/60">— Lao Tzu</div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)', boxShadow: '0 2px 8px var(--glp-sage-10)' }}>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--glp-sage-deep)' }}>
                <Users className="h-5 w-5" />
                Community
              </h2>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center shadow-sm"
                      style={{ background: 'var(--glp-sage)' }}
                    >
                      <User className="h-4 w-4 text-white" />
                    </div>
                  ))}
                </div>
                <span className="text-sm" style={{ color: 'var(--glp-ink)' }}>+128 online</span>
              </div>
              <Link 
                href="/community"
                className="block w-full py-3 text-center rounded-xl font-medium transition-all hover:shadow-md"
                style={{ background: 'var(--glp-sage-10)', color: 'var(--glp-sage-deep)' }}
                data-testid="link-community"
              >
                Join Circle
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-12 py-8" style={{ borderColor: 'var(--glp-sage-15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.6 }}>
            <Link href="/" className="hover:opacity-80 transition-opacity" data-testid="link-footer-home">Home</Link>
            <Link href="/content-index" className="hover:opacity-80 transition-opacity" data-testid="link-footer-content">Content</Link>
            <Link href="/qa" className="hover:opacity-80 transition-opacity" data-testid="link-footer-qa">Q&A</Link>
            <Link href="/privacy" className="hover:opacity-80 transition-opacity" data-testid="link-footer-privacy">Privacy</Link>
            <Link href="/terms" className="hover:opacity-80 transition-opacity" data-testid="link-footer-terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
    </>
  </WellnessPageShell>
  );
}
