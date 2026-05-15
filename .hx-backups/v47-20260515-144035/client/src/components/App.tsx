import BrandHero from "./BrandHero";

export default function App() {
  return (
    <div>
      <BrandHero />
      <div className="container" style={{ paddingBottom: 70 }}>
        <div className="glass" style={{ padding: 22 }}>
          <h2 style={{ marginTop: 0 }}>Features designed for your wellbeing</h2>
          <p style={{ opacity: 0.85, marginTop: 6 }}>
            Everything you need to understand, track, and improve your mental health in one beautiful app.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 16 }}>
            <div className="glass" style={{ padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>Mood Tracking</h3>
              <p style={{ opacity: 0.85 }}>Understand patterns over time with simple daily check-ins.</p>
            </div>
            <div className="glass" style={{ padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>Personal Journal</h3>
              <p style={{ opacity: 0.85 }}>Private journaling with prompts that support reflection and growth.</p>
            </div>
            <div className="glass" style={{ padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>AI Companion</h3>
              <p style={{ opacity: 0.85 }}>Supportive conversation, grounded boundaries, and gentle guidance.</p>
            </div>
            <div className="glass" style={{ padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>Safety</h3>
              <p style={{ opacity: 0.85 }}>Clear crisis pathways and protective UX patterns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}