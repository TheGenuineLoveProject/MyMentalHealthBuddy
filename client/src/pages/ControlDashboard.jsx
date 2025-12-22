import { Link } from "wouter";
import { Settings, Users, Database, Activity, Shield, Bell, BarChart3 } from "lucide-react";

export default function ControlDashboard() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-[hsl(var(--border))]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">The Genuine Love Project</p>
            <h1 className="text-2xl font-bold">Control Dashboard</h1>
          </div>
          <Link href="/dashboard" className="text-sm text-[hsl(var(--primary))] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ControlCard
            icon={<Users className="w-6 h-6" />}
            title="User Management"
            description="View and manage user accounts, permissions, and access levels."
          />
          <ControlCard
            icon={<Database className="w-6 h-6" />}
            title="Data & Storage"
            description="Monitor database usage, backups, and data integrity."
          />
          <ControlCard
            icon={<Activity className="w-6 h-6" />}
            title="System Health"
            description="Real-time monitoring of application performance and uptime."
          />
          <ControlCard
            icon={<Shield className="w-6 h-6" />}
            title="Security"
            description="Security settings, audit logs, and access controls."
          />
          <ControlCard
            icon={<Bell className="w-6 h-6" />}
            title="Notifications"
            description="Configure alerts, notifications, and communication preferences."
          />
          <ControlCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Analytics"
            description="Usage statistics, user engagement, and platform insights."
          />
        </div>
      </main>
    </div>
  );
}

function ControlCard({ icon, title, description }) {
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
        </div>
      </div>
    </div>
  );
}
