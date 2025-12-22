import { useState } from "react";

export default function DesignDashboard() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(243, 247, 246, 0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "18px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>The Genuine Love Project</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>
              Design Dashboard
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button style={btnSecondary} onClick={() => setTab("dashboard")}>Dashboard</button>
            <button style={btnPrimary} onClick={() => setTab("design")}>Design Tools</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 42px" }}>
        <section style={hero}>
          <div>
            <div style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>Today's intention</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>
              Slow down. Feel safe. Return to genuine love.
            </div>
            <div style={{ marginTop: 10, color: "hsl(var(--muted-foreground))" }}>
              Your tools are organized below — quick actions, progress, and calm focus.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button style={pill}>Mood Check-in</button>
            <button style={pill}>Breathing</button>
            <button style={pill}>Grounding</button>
            <button style={pill}>Affirmation</button>
          </div>
        </section>

        <section style={grid}>
          <Card title="Mood Tracker" subtitle="Quick check-in + trend">
            <div style={metricRow}>
              <Metric label="Current" value="Calm" />
              <Metric label="Energy" value="Medium" />
              <Metric label="Stress" value="Low" />
            </div>
            <div style={divider} />
            <button style={btnSecondaryFull}>Open Mood Tracker</button>
          </Card>

          <Card title="Journal" subtitle="Write, reflect, and release">
            <div style={{ color: "hsl(var(--muted-foreground))" }}>
              A safe place to express thoughts, gratitude, and growth.
            </div>
            <div style={divider} />
            <button style={btnPrimaryFull}>Write Now</button>
          </Card>

          <Card title="Healing Tools" subtitle="Small steps that work">
            <ul style={list}>
              <li>2-minute breath reset</li>
              <li>5-4-3-2-1 grounding</li>
              <li>Compassion reframe</li>
              <li>Body scan calm-down</li>
            </ul>
            <div style={divider} />
            <button style={btnSecondaryFull}>Open Tools</button>
          </Card>

          <Card title="Progress" subtitle="Keep it gentle and consistent">
            <div style={{ color: "hsl(var(--muted-foreground))" }}>
              Streaks are optional — consistency without pressure.
            </div>
            <div style={divider} />
            <div style={metricRow}>
              <Metric label="This week" value="4 sessions" />
              <Metric label="Streak" value="2 days" />
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{subtitle}</div>
        </div>
        <div style={badge}>TGLP</div>
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ flex: 1, background: "hsl(var(--muted))", borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}

const hero = {
  background: "linear-gradient(135deg, hsl(var(--muted)), hsl(var(--background)))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
  marginTop: 14,
};

const card = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 18,
  padding: 16,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

const badge = {
  background: "hsl(var(--muted))",
  border: "1px solid hsl(var(--border))",
  color: "hsl(var(--primary))",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 800,
  height: 28,
};

const divider = {
  height: 1,
  background: "hsl(var(--border))",
  margin: "14px 0",
};

const list = {
  margin: 0,
  paddingLeft: 18,
  color: "hsl(var(--muted-foreground))",
  display: "grid",
  gap: 6,
};

const metricRow = { display: "flex", gap: 10, flexWrap: "wrap" };

const btnPrimary = {
  background: "hsl(var(--primary))",
  border: "1px solid hsl(var(--primary))",
  color: "hsl(var(--primary-foreground))",
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const btnSecondary = {
  background: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  color: "hsl(var(--foreground))",
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const btnPrimaryFull = { ...btnPrimary, width: "100%" };
const btnSecondaryFull = { ...btnSecondary, width: "100%" };

const pill = {
  background: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  color: "hsl(var(--foreground))",
  padding: "10px 12px",
  borderRadius: 999,
  fontWeight: 800,
  cursor: "pointer",
};
