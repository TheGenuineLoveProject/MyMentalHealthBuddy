import { useState, useEffect } from "react";
import { Bell, Clock, Volume2, Check, X, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const REMINDER_TONES = [
  { id: "gentle-chime", name: "Gentle Chime", icon: "🔔" },
  { id: "soft-bell", name: "Soft Bell", icon: "🛎️" },
  { id: "singing-bowl", name: "Singing Bowl", icon: "🎵" },
  { id: "wind-chimes", name: "Wind Chimes", icon: "🌬️" },
  { id: "nature-sounds", name: "Nature Sounds", icon: "🌿" },
  { id: "silent", name: "Silent (Visual Only)", icon: "🔇" }
];

const DEFAULT_SETTINGS = {
  enabled: false,
  time: "09:00",
  tone: "gentle-chime",
  frequency: "daily",
  message: "Would you like to check in with your emotions today?"
};

export default function ReminderScheduler() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    try {
      const stored = localStorage.getItem("glp-reminder-settings");
      if (stored) {
        setSettings(JSON.parse(stored));
      }
      
      if (user) {
        const response = await fetch("/api/user/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.preferences?.reminderSettings) {
            setSettings(data.preferences.reminderSettings);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load reminder settings:", err);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("glp-reminder-settings", JSON.stringify(settings));
      
      if (user) {
        await fetch("/api/user/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences: { reminderSettings: settings } })
        });
      }

      if (settings.enabled && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          scheduleNotification();
        }
      }

      toast({
        title: "Settings saved",
        description: "Your reminder preferences have been updated."
      });
      setHasChanges(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const scheduleNotification = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: "SCHEDULE_REMINDER",
          settings
        });
      });
    }
    
    localStorage.setItem("glp-scheduled-reminder", JSON.stringify({
      scheduledTime: getNextReminderTime(settings.time),
      settings
    }));
  };
  
  const getNextReminderTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    let next = new Date();
    next.setHours(hours, minutes, 0, 0);
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    return next.getTime();
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const selectedTone = REMINDER_TONES.find(t => t.id === settings.tone) || REMINDER_TONES[0];

  return (
    <div className="max-w-2xl mx-auto p-6" data-testid="reminder-scheduler">
      <div className="rounded-3xl p-8 shadow-lg" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-gold-30), var(--glp-gold-50))' }}>
            <Bell className="w-7 h-7" style={{ color: 'var(--glp-gold)' }} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--glp-ink)' }}>
              Healing Reminders
            </h2>
            <p style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
              Gentle nudges to check in with yourself
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>
              Reminders appear when the app is open at the scheduled time
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--glp-sage-10)' }}>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" style={{ color: 'var(--glp-sage)' }} />
              <span className="font-medium" style={{ color: 'var(--glp-ink)' }}>Enable Daily Reminders</span>
            </div>
            <button
              onClick={() => updateSetting("enabled", !settings.enabled)}
              className={`w-14 h-8 rounded-full transition-all relative ${settings.enabled ? 'bg-gradient-to-r from-[var(--glp-sage)] to-[var(--glp-sage-deep)]' : 'bg-gray-300'}`}
              data-testid="toggle-reminders"
              aria-label={settings.enabled ? "Disable reminders" : "Enable reminders"}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${settings.enabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className={`space-y-5 transition-opacity ${settings.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium" style={{ color: 'var(--glp-ink)' }}>
                <Clock className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} />
                Check-in Time
              </label>
              <input
                type="time"
                value={settings.time}
                onChange={(e) => updateSetting("time", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: 'var(--glp-sage-20)', background: 'var(--glp-paper)' }}
                data-testid="input-reminder-time"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-medium" style={{ color: 'var(--glp-ink)' }}>
                <Volume2 className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} />
                Reminder Tone
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowToneDropdown(!showToneDropdown)}
                  className="w-full px-4 py-3 rounded-xl border-2 flex items-center justify-between text-left"
                  style={{ borderColor: 'var(--glp-sage-20)', background: 'var(--glp-paper)' }}
                  data-testid="select-reminder-tone"
                >
                  <span className="flex items-center gap-2">
                    <span>{selectedTone.icon}</span>
                    <span style={{ color: 'var(--glp-ink)' }}>{selectedTone.name}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showToneDropdown ? 'rotate-180' : ''}`} style={{ color: 'var(--glp-sage)' }} />
                </button>
                
                {showToneDropdown && (
                  <div className="absolute z-10 w-full mt-2 rounded-xl shadow-lg overflow-hidden" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
                    {REMINDER_TONES.map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => {
                          updateSetting("tone", tone.id);
                          setShowToneDropdown(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--glp-sage-10)] transition-colors text-left"
                        data-testid={`tone-option-${tone.id}`}
                      >
                        <span>{tone.icon}</span>
                        <span style={{ color: 'var(--glp-ink)' }}>{tone.name}</span>
                        {settings.tone === tone.id && (
                          <Check className="w-4 h-4 ml-auto" style={{ color: 'var(--glp-sage)' }} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--glp-ink)' }}>
                Custom Message
              </label>
              <textarea
                value={settings.message}
                onChange={(e) => updateSetting("message", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 resize-none"
                style={{ borderColor: 'var(--glp-sage-20)', background: 'var(--glp-paper)' }}
                placeholder="Your gentle reminder message..."
                data-testid="input-reminder-message"
              />
            </div>
          </div>

          {hasChanges && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
                data-testid="button-save-reminders"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
              <button
                onClick={() => {
                  loadSettings();
                  setHasChanges(false);
                }}
                className="px-6 py-3 rounded-xl font-medium transition-colors"
                style={{ color: 'var(--glp-ink)', background: 'var(--glp-sage-10)' }}
                data-testid="button-cancel-reminders"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 rounded-xl" style={{ background: 'var(--glp-gold-20)' }}>
          <p className="text-sm text-center" style={{ color: 'var(--glp-gold-dark)' }}>
            <em>"Consistency is the gentle path to transformation. Small moments of awareness, repeated with love, create lasting change."</em>
          </p>
        </div>
      </div>
    </div>
  );
}
