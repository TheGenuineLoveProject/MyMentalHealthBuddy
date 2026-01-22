import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Calendar, Bell, Users, TrendingUp, Heart, Clock, 
  CheckCircle, Star, MessageCircle, Activity, Target,
  ChevronRight, User, Settings, Home, BookOpen
} from 'lucide-react';

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('overview');

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
    { label: 'Current Streak', value: '7 days', icon: Activity, color: 'text-[#eac33b]' },
    { label: 'Mood Trend', value: '+15%', icon: TrendingUp, color: 'text-[#8fbf9f]' },
    { label: 'Sessions', value: '23', icon: Heart, color: 'text-[#f4c7c3]' },
    { label: 'XP Earned', value: '1,250', icon: Star, color: 'text-[#2f5d5d]' },
  ];

  const quickActions = [
    { label: 'Start Meditation', icon: Heart, href: '/breathing' },
    { label: 'Write Journal', icon: BookOpen, href: '/journal' },
    { label: 'Check Mood', icon: Activity, href: '/mood' },
    { label: 'View Progress', icon: TrendingUp, href: '/progress' },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]" data-testid="crm-page">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2" data-testid="link-home">
                <img src="/brand/logo-mark.png" alt="TGLP" className="h-8 w-8" />
                <span className="font-semibold text-[#2f5d5d]">Dashboard</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Overview</Link>
                <Link href="/journal" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Journal</Link>
                <Link href="/mood" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Mood</Link>
                <Link href="/tools" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Tools</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-[#3a3a3a] hover:text-[#2f5d5d]" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-[#3a3a3a] hover:text-[#2f5d5d]" data-testid="button-settings">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-[#8fbf9f] flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2f5d5d] mb-2">Welcome Back</h1>
          <p className="text-[#3a3a3a] opacity-70">Your personal wellness dashboard</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-sm text-[#3a3a3a] opacity-70">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-[#2f5d5d]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2f5d5d] flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </h2>
                <Link 
                  href="/calendar" 
                  className="text-sm text-[#8fbf9f] hover:underline flex items-center gap-1"
                  data-testid="link-calendar"
                >
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <ul className="space-y-3" data-testid="event-list">
                {upcomingEvents.map((event) => (
                  <li 
                    key={event.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-l-3 ${
                      event.type === 'practice' 
                        ? 'border-l-[#eac33b] bg-[#eac33b]/10' 
                        : event.type === 'community'
                        ? 'border-l-[#f4c7c3] bg-[#f4c7c3]/20'
                        : 'border-l-[#8fbf9f] bg-[#8fbf9f]/10'
                    }`}
                    data-testid={`event-${event.id}`}
                  >
                    <Clock className="h-4 w-4 text-[#3a3a3a] opacity-50" />
                    <span className="text-sm text-[#3a3a3a] opacity-60 w-20">{event.time}</span>
                    <span className="font-medium text-[#2f5d5d] flex-1">{event.title}</span>
                    {event.badge && (
                      <span className="px-2 py-1 bg-[#eac33b] text-[#2f5d5d] text-xs font-semibold rounded-full">
                        {event.badge}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-[#2f5d5d] mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 p-4 rounded-lg bg-[#faf9f7] hover:bg-[#8fbf9f]/10 transition-colors border border-gray-100"
                    data-testid={`action-${action.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <action.icon className="h-5 w-5 text-[#8fbf9f]" />
                    <span className="font-medium text-[#2f5d5d]">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2f5d5d] flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </h2>
                <span className="px-2 py-1 bg-[#f4c7c3] text-[#2f5d5d] text-xs font-semibold rounded-full">
                  {notifications.filter(n => !n.read).length} new
                </span>
              </div>
              <ul className="space-y-3" data-testid="notification-list">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id}
                    className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.read ? 'bg-gray-300' : 'bg-[#eac33b]'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-[#3a3a3a]">{notification.text}</p>
                      <span className="text-xs text-[#3a3a3a] opacity-50">{notification.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#2f5d5d] to-[#1a3a3a] rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-[#eac33b]" />
                <span className="font-semibold">Daily Wisdom</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                "The journey of a thousand miles begins with a single step. Today, take that step with intention and love."
              </p>
              <div className="text-xs text-white/60">— Lao Tzu</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-[#2f5d5d] mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-[#8fbf9f] border-2 border-white flex items-center justify-center"
                    >
                      <User className="h-4 w-4 text-white" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-[#3a3a3a]">+128 online</span>
              </div>
              <Link 
                href="/community"
                className="block w-full py-2 text-center bg-[#8fbf9f]/10 text-[#2f5d5d] rounded-lg font-medium hover:bg-[#8fbf9f]/20 transition-colors"
                data-testid="link-community"
              >
                Join Circle
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#3a3a3a] opacity-60">
            <Link href="/" data-testid="link-footer-home">Home</Link>
            <Link href="/content-index" data-testid="link-footer-content">Content</Link>
            <Link href="/qa" data-testid="link-footer-qa">Q&A</Link>
            <Link href="/privacy" data-testid="link-footer-privacy">Privacy</Link>
            <Link href="/terms" data-testid="link-footer-terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
