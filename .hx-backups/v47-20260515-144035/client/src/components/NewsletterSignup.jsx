import { useState, useEffect } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";
import { trackEvent } from "../hooks/useAnalytics.mjs";

function getStoredUtmParams() {
  try {
    const stored = localStorage.getItem("glp_utm");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function storeUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const utmData = {};
  
  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) utmData[key] = value;
  });
  
  if (Object.keys(utmData).length > 0) {
    utmData.timestamp = Date.now();
    localStorage.setItem("glp_utm", JSON.stringify(utmData));
  }
}

export default function NewsletterSignup({ variant = "footer", source = "newsletter" }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    storeUtmParams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !consent) {
      setStatus("error");
      setMessage("Please enter your email and agree to receive updates.");
      return;
    }

    setStatus("loading");
    trackEvent("newsletter_signup_attempt", "newsletter", { source });
    
    const utm = getStoredUtmParams();

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          source,
          utmSource: utm.utm_source,
          utmMedium: utm.utm_medium,
          utmCampaign: utm.utm_campaign,
          utmContent: utm.utm_content,
          utmTerm: utm.utm_term,
          utmTimestamp: utm.timestamp,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing!");
        setEmail("");
        setConsent(false);
        trackEvent("newsletter_signup_success", "newsletter", { source });
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={`rounded-xl p-4 bg-[var(--sage-100)] border border-[var(--sage-300)] ${variant === "inline" ? "" : "max-w-md"}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[var(--sage-200)]">
            <Check className="w-5 h-5 text-[var(--sage-700)]" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-[var(--sage-800)]">You're subscribed!</p>
            <p className="text-sm text-[var(--sage-600)]">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={variant === "footer" ? "max-w-md" : ""} data-testid="form-newsletter">
      <div className="mb-3">
        <label htmlFor="newsletter-email" className="block text-sm font-medium text-[var(--text-1)] mb-1">
          Stay Updated
        </label>
        <p className="text-sm text-[var(--text-2)] mb-3">
          Wellness tips and new features delivered to your inbox. No spam, unsubscribe anytime.
          {" "}
          <a href="/blog/welcome-to-genuine-love" className="underline text-[var(--glp-primary)] hover:text-[var(--glp-sage-deep)]" data-testid="link-newsletter-trust">
            Learn more about us
          </a>.
        </p>
      </div>
      
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" aria-hidden="true" />
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--glp-primary)] focus:border-transparent"
            data-testid="input-newsletter-email"
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2.5 rounded-lg bg-[var(--glp-primary)] text-white font-medium hover:bg-[var(--glp-sage-deep)] transition disabled:opacity-50"
          data-testid="button-newsletter-submit"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 rounded border-[var(--border)] text-[var(--glp-primary)] focus:ring-[var(--glp-primary)]"
          data-testid="checkbox-newsletter-consent"
          aria-required="true"
        />
        <span className="text-xs text-[var(--text-2)]">
          I agree to receive wellness updates. You can unsubscribe at any time.
        </span>
      </label>

      {status === "error" && message && (
        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--blush-600)]" role="alert">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {message}
        </div>
      )}
    </form>
  );
}
