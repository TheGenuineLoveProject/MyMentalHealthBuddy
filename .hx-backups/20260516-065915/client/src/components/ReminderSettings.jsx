import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, BellOff, Clock, Calendar, Mail, Sparkles, Save, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const REMINDER_TIMES = [
  { value: "06:00", label: "6:00 AM - Early Morning" },
  { value: "08:00", label: "8:00 AM - Morning" },
  { value: "12:00", label: "12:00 PM - Midday" },
  { value: "18:00", label: "6:00 PM - Evening" },
  { value: "21:00", label: "9:00 PM - Night" }
];

const REMINDER_FREQUENCIES = [
  { value: "daily", label: "Daily", description: "Get a gentle reminder every day" },
  { value: "weekdays", label: "Weekdays Only", description: "Monday through Friday" },
  { value: "weekly", label: "Weekly", description: "Once a week on your chosen day" },
  { value: "none", label: "No Reminders", description: "I'll remember on my own" }
];

export default function ReminderSettings({ className = "", compact = false }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    frequency: "daily",
    time: "08:00",
    weeklyDay: "monday",
    emailEnabled: true,
    pushEnabled: false
  });
  const [hasChanges, setHasChanges] = useState(false);

  const settingsQuery = useQuery({
    queryKey: ["/api/user/settings"],
    enabled: !!user
  });

  useEffect(() => {
    if (settingsQuery.data?.reminders) {
      setSettings(prev => ({
        ...prev,
        ...settingsQuery.data.reminders
      }));
    }
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (newSettings) => {
      return apiRequest("PATCH", "/api/user/settings", { reminders: newSettings });
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your reminder preferences have been updated."
      });
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user/settings"] });
    },
    onError: () => {
      toast({
        title: "Couldn't save settings",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  if (compact) {
    return (
      <div className={`flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-black/20 border ${className}`} data-testid="reminder-settings-compact">
        <div className="flex items-center gap-3">
          {settings.frequency !== "none" ? (
            <Bell className="w-5 h-5 text-[#8fbf9f]" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {settings.frequency === "none" ? "Reminders Off" : `${settings.frequency} at ${settings.time}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {settings.emailEnabled ? "Email reminders enabled" : "Email reminders disabled"}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleChange("frequency", settings.frequency === "none" ? "daily" : "none")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            settings.frequency !== "none"
              ? 'bg-[#8fbf9f]/20 text-[#2f5d5d]'
              : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
          }`}
          data-testid="button-toggle-reminders"
        >
          {settings.frequency !== "none" ? "On" : "Off"}
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border bg-card/80 backdrop-blur-sm p-6 ${className}`} data-testid="reminder-settings">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-[#8fbf9f]/20">
          <Bell className="w-5 h-5 text-[#8fbf9f]" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-semibold text-foreground">Reminder Settings</h3>
          <p className="text-sm text-muted-foreground">Gentle nudges to support your healing journey</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            <Calendar className="w-4 h-4 inline mr-2" />
            Frequency
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REMINDER_FREQUENCIES.map((freq) => (
              <button
                key={freq.value}
                onClick={() => handleChange("frequency", freq.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  settings.frequency === freq.value
                    ? 'border-[#8fbf9f] bg-[#8fbf9f]/10 shadow-sm'
                    : 'border-border hover:border-[#8fbf9f]/50'
                }`}
                data-testid={`button-freq-${freq.value}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{freq.label}</span>
                  {settings.frequency === freq.value && (
                    <Check className="w-4 h-4 text-[#8fbf9f]" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{freq.description}</p>
              </button>
            ))}
          </div>
        </div>

        {settings.frequency !== "none" && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                <Clock className="w-4 h-4 inline mr-2" />
                Preferred Time
              </label>
              <select
                value={settings.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className="w-full p-3 rounded-xl border bg-white/50 dark:bg-black/20 text-foreground"
                data-testid="select-reminder-time"
              >
                {REMINDER_TIMES.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>

            {settings.frequency === "weekly" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Weekly Day
                </label>
                <select
                  value={settings.weeklyDay}
                  onChange={(e) => handleChange("weeklyDay", e.target.value)}
                  className="w-full p-3 rounded-xl border bg-white/50 dark:bg-black/20 text-foreground"
                  data-testid="select-weekly-day"
                >
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                    <option key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                <Mail className="w-4 h-4 inline mr-2" />
                Notification Methods
              </label>
              
              <div className="flex items-center justify-between p-4 rounded-xl border">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive reminders via email</p>
                </div>
                <button
                  onClick={() => handleChange("emailEnabled", !settings.emailEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.emailEnabled ? 'bg-[#8fbf9f]' : 'bg-gray-300'
                  }`}
                  data-testid="toggle-email"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.emailEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saveMutation.isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8fbf9f] to-[#2f5d5d] text-white font-medium transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            data-testid="button-save-reminders"
          >
            {saveMutation.isPending ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Preferences
              </>
            )}
          </button>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20">
          <Sparkles className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Consistent check-ins help build a sustainable wellness practice. 
            Even a quick mood log can make a difference!
          </p>
        </div>
      </div>
    </div>
  );
}
