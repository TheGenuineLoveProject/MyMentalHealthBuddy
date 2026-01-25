import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function LoginCallback() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      setLocation(`/login?error=${error}`);
      return;
    }

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        login(token, {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        });
        setLocation("/dashboard");
      } catch (err) {
        console.error("Token parse error:", err);
        setLocation("/login?error=invalid_token");
      }
    } else {
      setLocation("/login?error=no_token");
    }
  }, [search, login, setLocation]);

  return (
  <WellnessPageShell
    title="LoginCallback"
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

    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sage-600">Completing sign in...</p>
      </div>
    </div>
  </WellnessPageShell>
  );
}
