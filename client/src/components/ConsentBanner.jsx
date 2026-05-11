import { useState, useEffect } from "react";
import { Cookie, X, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

const CONSENT_KEY = "glp_cookie_consent";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (type) => {
    const consentData = {
      timestamp: new Date().toISOString(),
      type,
      preferences: type === "all" 
        ? { essential: true, analytics: true, marketing: true }
        : type === "essential"
        ? { essential: true, analytics: false, marketing: false }
        : preferences
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background border-t shadow-lg"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="container mx-auto max-w-4xl">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground">
                  We use cookies to improve your experience and analyze site usage. 
                  Essential cookies are always active.{" "}
                  <a href="/privacy" className="text-primary hover:underline" aria-label="Learn more about our privacy and cookie practices">Learn more about our privacy practices</a>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="min-h-[44px] px-4 rounded-lg"
                data-testid="button-cookie-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveConsent("essential")}
                className="min-h-[44px] px-4 rounded-lg"
                data-testid="button-essential-only"
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                onClick={() => saveConsent("all")}
                className="min-h-[44px] px-4 rounded-lg"
                data-testid="button-accept-all"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Cookie Preferences</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="min-h-[44px] min-w-[44px] p-2 rounded-lg"
                data-testid="button-close-settings"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">Essential</span>
                  <p className="text-sm text-muted-foreground">Required for the site to function</p>
                </div>
                <input type="checkbox" checked disabled className="h-5 w-5" />
              </label>
              
              <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <div>
                  <span className="font-medium">Analytics</span>
                  <p className="text-sm text-muted-foreground">Help us improve with usage data</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                  className="h-5 w-5"
                  data-testid="checkbox-analytics"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <div>
                  <span className="font-medium">Marketing</span>
                  <p className="text-sm text-muted-foreground">Personalized recommendations</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                  className="h-5 w-5"
                  data-testid="checkbox-marketing"
                />
              </label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => saveConsent("essential")}
                className="min-h-[44px] px-4 rounded-lg"
                data-testid="button-reject-optional"
              >
                Essential Only
              </Button>
              <Button
                onClick={() => saveConsent("custom")}
                className="min-h-[44px] px-4 rounded-lg"
                data-testid="button-save-preferences"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
