import { useState } from "react";
import { Link } from "wouter";
import { 
  Settings, Users, Database, Activity, Shield, Bell, BarChart3, ArrowLeft, Cog,
  Server, Globe, Lock, Key, Palette, Mail, CreditCard, Zap, Download,
  Upload, RefreshCw, CheckCircle2, AlertTriangle, Info, Eye, EyeOff,
  Copy, ExternalLink, ChevronRight, Moon, Sun, Monitor, Smartphone,
  HardDrive, Cpu, Cloud, Wifi, AlertCircle, Clock, Calendar,
  FileText, Image, Video, Music, Archive, Trash2, Plus, Search,
  ToggleLeft, ToggleRight, Sliders, Volume2, VolumeX, Languages,
  MapPin, Building, Phone, MessageSquare, Heart, Star, Bookmark,
  Code, Terminal, Bug, Wrench, Layers, Box, Package
} from "lucide-react";
import SEO from "../components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useToast } from "@/hooks/use-toast";

const CONTROL_SECTIONS = [
  { id: "general", label: "General", icon: Settings },
  { id: "users", label: "Users", icon: Users },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Zap },
  { id: "storage", label: "Storage", icon: Database },
  { id: "developer", label: "Developer", icon: Code },
];

export default function ControlDashboard() {
  const [activeSection, setActiveSection] = useState("general");
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "The Genuine Love Project",
    siteDescription: "AI-powered mental wellness platform",
    maintenanceMode: false,
    allowSignups: true,
    requireEmailVerification: true,
    darkModeDefault: false,
    language: "en",
    timezone: "UTC",
    twoFactorRequired: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    webhooksEnabled: false,
    apiRateLimit: 100,
    debugMode: false,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
  <WellnessPageShell
    title="ControlDashboard"
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
        title="Control Center - The Genuine Love Project"
        description="Platform configuration, settings, and system controls."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sage-50/30 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-sage-200/40 to-teal-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 bg-gradient-to-tr from-gold-100/30 to-amber-50/20 rounded-full blur-3xl" />
        </div>
        
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Cog className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Admin</p>
                <h1 className="text-xl font-bold text-slate-800">Control Center</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toast({ title: "Settings synced", description: "All changes have been saved" })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium transition"
                data-testid="button-sync"
              >
                <RefreshCw className="w-4 h-4" />
                Sync
              </button>
              <Link 
                href="/admin" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto px-6 py-8 relative z-10">
          <div className="flex gap-8">
            <nav className="w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-28">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Settings</h2>
                <div className="space-y-1">
                  {CONTROL_SECTIONS.map(section => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                          isActive
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                        data-testid={`nav-${section.id}`}
                      >
                        <Icon className="w-5 h-5" />
                        {section.label}
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Status</h2>
                  <div className="space-y-3 px-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">API</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Database</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">AI Service</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <main className="flex-1 min-w-0">
              {activeSection === "general" && (
                <GeneralSection settings={settings} toggleSetting={toggleSetting} setSettings={setSettings} />
              )}
              {activeSection === "users" && (
                <UsersSection settings={settings} toggleSetting={toggleSetting} />
              )}
              {activeSection === "security" && (
                <SecuritySection settings={settings} toggleSetting={toggleSetting} setSettings={setSettings} />
              )}
              {activeSection === "notifications" && (
                <NotificationsSection settings={settings} toggleSetting={toggleSetting} />
              )}
              {activeSection === "integrations" && (
                <IntegrationsSection settings={settings} toggleSetting={toggleSetting} />
              )}
              {activeSection === "storage" && (
                <StorageSection />
              )}
              {activeSection === "developer" && (
                <DeveloperSection settings={settings} toggleSetting={toggleSetting} setSettings={setSettings} />
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      </div>
      <p className="text-slate-500">{description}</p>
    </div>
  );
}

function SettingCard({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
      {children}
    </div>
  );
}

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
        )}
        <div>
          <h3 className="font-medium text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ enabled, onChange, label = "Toggle" }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      data-testid={`toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-teal-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function GeneralSection({ settings, toggleSetting, setSettings }) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Settings} 
        title="General Settings" 
        description="Basic configuration for your platform"
      />

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Site Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition resize-none"
            />
          </div>
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Localization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Appearance</h3>
        <SettingRow 
          icon={Moon} 
          title="Dark Mode Default" 
          description="Set dark mode as the default theme for new users"
        >
          <Toggle enabled={settings.darkModeDefault} onChange={() => toggleSetting('darkModeDefault')} label="Dark Mode Default" />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Maintenance
        </h3>
        <SettingRow 
          icon={Wrench} 
          title="Maintenance Mode" 
          description="Temporarily disable access to the platform for non-admins"
        >
          <Toggle enabled={settings.maintenanceMode} onChange={() => toggleSetting('maintenanceMode')} label="Maintenance Mode" />
        </SettingRow>
      </SettingCard>
    </div>
  );
}

function UsersSection({ settings, toggleSetting }) {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Users} 
        title="User Management" 
        description="Control user registration and account settings"
      />

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Registration</h3>
        <div className="space-y-0">
          <SettingRow 
            icon={Users} 
            title="Allow New Signups" 
            description="Enable or disable new user registrations"
          >
            <Toggle enabled={settings.allowSignups} onChange={() => toggleSetting('allowSignups')} label="Allow Signups" />
          </SettingRow>
          <SettingRow 
            icon={Mail} 
            title="Require Email Verification" 
            description="Users must verify their email before accessing features"
          >
            <Toggle enabled={settings.requireEmailVerification} onChange={() => toggleSetting('requireEmailVerification')} label="Email Verification" />
          </SettingRow>
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">User Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-teal-50">
            <div className="text-2xl font-bold text-teal-700">1,234</div>
            <div className="text-sm text-teal-600">Total Users</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50">
            <div className="text-2xl font-bold text-emerald-700">892</div>
            <div className="text-sm text-emerald-600">Active</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50">
            <div className="text-2xl font-bold text-amber-700">156</div>
            <div className="text-sm text-amber-600">This Week</div>
          </div>
          <div className="p-4 rounded-xl bg-violet-50">
            <div className="text-2xl font-bold text-violet-700">45</div>
            <div className="text-sm text-violet-600">Premium</div>
          </div>
        </div>
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => toast({ title: "User Management", description: "Opening user list view..." })}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition"
            data-testid="button-view-users"
          >
            <Users className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">View All Users</span>
          </button>
          <button 
            onClick={() => toast({ title: "Export Started", description: "User data export will be emailed to admin" })}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition"
            data-testid="button-export-users"
          >
            <Download className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Export Users</span>
          </button>
          <button 
            onClick={() => toast({ title: "Email Composer", description: "Opening mass email composer..." })}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition"
            data-testid="button-mass-email"
          >
            <Mail className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Mass Email</span>
          </button>
          <button 
            onClick={() => toast({ title: "Role Management", description: "Opening role management panel..." })}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition"
            data-testid="button-manage-roles"
          >
            <Shield className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Manage Roles</span>
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

function SecuritySection({ settings, toggleSetting, setSettings }) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Shield} 
        title="Security Settings" 
        description="Protect your platform and user data"
      />

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Authentication</h3>
        <div className="space-y-0">
          <SettingRow 
            icon={Lock} 
            title="Require Two-Factor Authentication" 
            description="Enforce 2FA for all user accounts"
          >
            <Toggle enabled={settings.twoFactorRequired} onChange={() => toggleSetting('twoFactorRequired')} label="Two Factor Auth" />
          </SettingRow>
          <SettingRow 
            icon={Clock} 
            title="Session Timeout (hours)" 
            description="Automatically log out inactive users"
          >
            <select
              value={settings.sessionTimeout}
              onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
            >
              <option value={1}>1 hour</option>
              <option value={4}>4 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={72}>3 days</option>
            </select>
          </SettingRow>
          <SettingRow 
            icon={AlertTriangle} 
            title="Max Login Attempts" 
            description="Lock account after failed attempts"
          >
            <select
              value={settings.maxLoginAttempts}
              onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
            >
              <option value={3}>3 attempts</option>
              <option value={5}>5 attempts</option>
              <option value={10}>10 attempts</option>
            </select>
          </SettingRow>
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Security Status</h3>
        <div className="space-y-3">
          {[
            { label: "SSL Certificate", status: "Valid", color: "emerald" },
            { label: "CORS Protection", status: "Enabled", color: "emerald" },
            { label: "Rate Limiting", status: "Active", color: "emerald" },
            { label: "XSS Protection", status: "Enabled", color: "emerald" },
            { label: "SQL Injection Prevention", status: "Active", color: "emerald" },
            { label: "CSRF Tokens", status: "Enabled", color: "emerald" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <span className={`flex items-center gap-1.5 text-xs font-medium text-${item.color}-600 bg-${item.color}-100 px-2.5 py-1 rounded-full`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

function NotificationsSection({ settings, toggleSetting }) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Bell} 
        title="Notification Settings" 
        description="Configure how you receive updates and alerts"
      />

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Email Notifications</h3>
        <div className="space-y-0">
          <SettingRow 
            icon={Mail} 
            title="Email Notifications" 
            description="Receive important updates via email"
          >
            <Toggle enabled={settings.emailNotifications} onChange={() => toggleSetting('emailNotifications')} label="Email Notifications" />
          </SettingRow>
          <SettingRow 
            icon={Bell} 
            title="Push Notifications" 
            description="Browser push notifications for real-time alerts"
          >
            <Toggle enabled={settings.pushNotifications} onChange={() => toggleSetting('pushNotifications')} label="Push Notifications" />
          </SettingRow>
          <SettingRow 
            icon={MessageSquare} 
            title="Marketing Emails" 
            description="Receive newsletters and promotional content"
          >
            <Toggle enabled={settings.marketingEmails} onChange={() => toggleSetting('marketingEmails')} label="Marketing Emails" />
          </SettingRow>
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Alert Types</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Users, label: "New User Signups", enabled: true },
            { icon: CreditCard, label: "Payment Events", enabled: true },
            { icon: AlertTriangle, label: "Security Alerts", enabled: true },
            { icon: Server, label: "System Health", enabled: false },
            { icon: Bug, label: "Error Reports", enabled: true },
            { icon: Star, label: "User Feedback", enabled: false },
          ].map((alert, i) => {
            const Icon = alert.icon;
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">{alert.label}</span>
                </div>
                <Toggle enabled={alert.enabled} onChange={() => {}} label={alert.label} />
              </div>
            );
          })}
        </div>
      </SettingCard>
    </div>
  );
}

function IntegrationsSection({ settings, toggleSetting }) {
  const { toast } = useToast();
  const integrations = [
    { name: "OpenAI", description: "AI wellness companion and content generation", status: "connected", icon: "🤖" },
    { name: "Stripe", description: "Payment processing and subscriptions", status: "connected", icon: "💳" },
    { name: "GitHub", description: "OAuth authentication", status: "connected", icon: "🐙" },
    { name: "SendGrid", description: "Email delivery service", status: "available", icon: "📧" },
    { name: "Sentry", description: "Error tracking and monitoring", status: "available", icon: "🐛" },
    { name: "Google Analytics", description: "Website analytics", status: "available", icon: "📊" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Zap} 
        title="Integrations" 
        description="Connect third-party services to extend functionality"
      />

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Connected Services</h3>
          <button 
            onClick={() => toast({ title: "Add Integration", description: "Opening integration marketplace..." })}
            className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
            data-testid="button-add-integration"
          >
            <Plus className="w-4 h-4" />
            Add Integration
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                {integration.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-slate-800">{integration.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    integration.status === 'connected' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {integration.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{integration.description}</p>
              </div>
              <button 
                onClick={() => toast({ 
                  title: integration.status === 'connected' ? 'Configure Integration' : 'Connect Integration', 
                  description: `Opening ${integration.name} settings...` 
                })}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                data-testid={`button-integration-${integration.name.toLowerCase()}`}
              >
                {integration.status === 'connected' ? 'Configure' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Webhooks</h3>
        <SettingRow 
          icon={Globe} 
          title="Enable Webhooks" 
          description="Send event notifications to external URLs"
        >
          <Toggle enabled={settings.webhooksEnabled} onChange={() => toggleSetting('webhooksEnabled')} label="Webhooks" />
        </SettingRow>
        {settings.webhooksEnabled && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50">
            <p className="text-sm text-slate-600 mb-3">Webhook endpoints will receive POST requests for configured events.</p>
            <button 
              onClick={() => toast({ title: "Add Webhook", description: "Opening webhook configuration..." })}
              className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
              data-testid="button-add-webhook"
            >
              <Plus className="w-4 h-4" />
              Add Webhook Endpoint
            </button>
          </div>
        )}
      </SettingCard>
    </div>
  );
}

function StorageSection() {
  const { toast } = useToast();
  const storageStats = {
    used: 4.5,
    total: 10,
    breakdown: [
      { type: "Images", size: 2.1, icon: Image, color: "teal" },
      { type: "Documents", size: 1.2, icon: FileText, color: "violet" },
      { type: "Videos", size: 0.8, icon: Video, color: "amber" },
      { type: "Backups", size: 0.4, icon: Archive, color: "slate" },
    ]
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Database} 
        title="Storage & Data" 
        description="Manage files, backups, and data storage"
      />

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Storage Usage</h3>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Used Storage</span>
            <span className="text-sm font-medium text-slate-800">{storageStats.used} GB / {storageStats.total} GB</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
              style={{ width: `${(storageStats.used / storageStats.total) * 100}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {storageStats.breakdown.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-4 rounded-xl bg-slate-50">
                <Icon className="w-5 h-5 text-slate-600 mb-2" />
                <div className="text-lg font-bold text-slate-800">{item.size} GB</div>
                <div className="text-sm text-slate-500">{item.type}</div>
              </div>
            );
          })}
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Backups</h3>
        <div className="space-y-3">
          {[
            { date: "Jan 22, 2026 - 3:00 AM", size: "245 MB", status: "Completed" },
            { date: "Jan 21, 2026 - 3:00 AM", size: "243 MB", status: "Completed" },
            { date: "Jan 20, 2026 - 3:00 AM", size: "241 MB", status: "Completed" },
          ].map((backup, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-4">
                <Archive className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-700">{backup.date}</p>
                  <p className="text-sm text-slate-500">{backup.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">{backup.status}</span>
                <button 
                  onClick={() => toast({ title: "Download Started", description: `Downloading backup from ${backup.date}` })}
                  className="p-2 rounded-lg hover:bg-slate-200 transition"
                  data-testid={`button-download-backup-${i}`}
                >
                  <Download className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <button 
            onClick={() => toast({ title: "Backup Started", description: "Creating manual backup, this may take a few minutes..." })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition"
            data-testid="button-create-backup"
          >
            <RefreshCw className="w-4 h-4" />
            Create Backup Now
          </button>
          <button 
            onClick={() => toast({ title: "Schedule Backups", description: "Opening backup schedule configuration..." })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
            data-testid="button-schedule-backups"
          >
            <Calendar className="w-4 h-4" />
            Schedule Backups
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

function DeveloperSection({ settings, toggleSetting, setSettings }) {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Code} 
        title="Developer Settings" 
        description="API keys, webhooks, and debugging tools"
      />

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">API Configuration</h3>
        <SettingRow 
          icon={Zap} 
          title="Rate Limit (requests/minute)" 
          description="Maximum API requests per minute per user"
        >
          <select
            value={settings.apiRateLimit}
            onChange={(e) => setSettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) }))}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
          >
            <option value={50}>50 req/min</option>
            <option value={100}>100 req/min</option>
            <option value={200}>200 req/min</option>
            <option value={500}>500 req/min</option>
          </select>
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">API Keys</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Production API Key</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toast({ title: "API Key", description: "Production key revealed temporarily" })}
                  className="p-1.5 rounded-lg hover:bg-slate-200 transition"
                  data-testid="button-view-prod-key"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                </button>
                <button 
                  onClick={() => { navigator.clipboard?.writeText("glp_prod_****"); toast({ title: "Copied", description: "Production API key copied to clipboard" }); }}
                  className="p-1.5 rounded-lg hover:bg-slate-200 transition"
                  data-testid="button-copy-prod-key"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
            <code className="text-sm font-mono text-slate-600">glp_prod_****************************</code>
          </div>
          <div className="p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Development API Key</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toast({ title: "API Key", description: "Development key revealed temporarily" })}
                  className="p-1.5 rounded-lg hover:bg-slate-200 transition"
                  data-testid="button-view-dev-key"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                </button>
                <button 
                  onClick={() => { navigator.clipboard?.writeText("glp_dev_****"); toast({ title: "Copied", description: "Development API key copied to clipboard" }); }}
                  className="p-1.5 rounded-lg hover:bg-slate-200 transition"
                  data-testid="button-copy-dev-key"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
            <code className="text-sm font-mono text-slate-600">glp_dev_****************************</code>
          </div>
        </div>
        <button 
          onClick={() => toast({ title: "Regenerate Keys", description: "Are you sure? This will invalidate existing keys.", variant: "destructive" })}
          className="mt-4 inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
          data-testid="button-regenerate-keys"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate Keys
        </button>
      </SettingCard>

      <SettingCard>
        <h3 className="font-semibold text-slate-800 mb-4">Debugging</h3>
        <SettingRow 
          icon={Bug} 
          title="Debug Mode" 
          description="Enable verbose logging and error details (not recommended for production)"
        >
          <Toggle enabled={settings.debugMode} onChange={() => toggleSetting('debugMode')} label="Debug Mode" />
        </SettingRow>
        <div className="mt-4 flex gap-3">
          <button 
            onClick={() => toast({ title: "View Logs", description: "Opening log viewer..." })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
            data-testid="button-view-logs"
          >
            <Terminal className="w-4 h-4" />
            View Logs
          </button>
          <button 
            onClick={() => toast({ title: "Export Logs", description: "Log export will be emailed to admin" })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
            data-testid="button-export-logs"
          >
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>
      </SettingCard>
    </div>
  </WellnessPageShell>
  );
}
