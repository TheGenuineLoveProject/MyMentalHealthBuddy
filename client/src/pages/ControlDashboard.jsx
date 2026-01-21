import { Link } from "wouter";
import { Settings, Users, Database, Activity, Shield, Bell, BarChart3, ArrowLeft, Cog } from "lucide-react";
import SEO from "../components/SEO";

const CONTROL_CARDS = [
  {
    icon: Users,
    title: "User Management",
    description: "View and manage user accounts, permissions, and access levels.",
    color: "icon-soft-teal"
  },
  {
    icon: Database,
    title: "Data & Storage",
    description: "Monitor database usage, backups, and data integrity.",
    color: "icon-soft-sage"
  },
  {
    icon: Activity,
    title: "System Health",
    description: "Real-time monitoring of application performance and uptime.",
    color: "icon-soft-gold"
  },
  {
    icon: Shield,
    title: "Security",
    description: "Security settings, audit logs, and access controls.",
    color: "icon-soft-blush"
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure alerts, notifications, and communication preferences.",
    color: "icon-soft-teal"
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Usage statistics, user engagement, and platform insights.",
    color: "icon-soft-sage"
  }
];

export default function ControlDashboard() {
  return (
    <>
      <SEO 
        title="Control Dashboard - The Genuine Love Project"
        description="Platform administration and management controls."
      />
      <div className="min-h-screen hero-premium relative overflow-hidden">
        <div className="decorative-orb decorative-orb-sage w-[500px] h-[500px] -top-40 -left-40 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-gold w-[350px] h-[350px] bottom-32 -right-32 absolute" aria-hidden="true" />
        
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-[var(--sage-200)]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="icon-container icon-lg icon-gradient-teal">
                <Cog className="w-6 h-6" />
              </div>
              <div>
                <p className="text-caption text-[var(--sage-500)]">The Genuine Love Project</p>
                <h1 className="text-heading-lg text-teal">Control Dashboard</h1>
              </div>
            </div>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CONTROL_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <div 
                  key={index}
                  className="card-premium hover-lift cursor-pointer p-6"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`icon-container icon-lg ${card.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-heading-sm text-teal">{card.title}</h3>
                      <p className="mt-1 text-body-sm">{card.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
