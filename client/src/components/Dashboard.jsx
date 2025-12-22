import React from "react";
import DashboardCard from "./DashboardCard.jsx";
import Sparkline from "./Sparkline.jsx";

export default function Dashboard() {
  return (
    <div className="dash">
      <div className="dash-hero">
        <div>
          <h2 className="dash-title">Your calm dashboard</h2>
          <p className="muted">
            A gentle place to notice patterns, reflect, and take one small step.
          </p>
        </div>

        <div className="dash-trend">
          <div className="dash-trend-label">
            <div className="dash-trend-title">Mood trend</div>
            <div className="muted" style={{ fontSize: 12 }}>last 7 check-ins</div>
          </div>
          <Sparkline />
        </div>
      </div>

      <div className="dash-grid">
        <DashboardCard
          title="Today’s 60-second Check-In"
          footer={<button className="btn btn-primary">Start</button>}
        >
          What emotion is most present right now — and what do you need most next?
        </DashboardCard>

        <DashboardCard
          title="Mood Snapshot"
          footer={<button className="btn">Log Mood</button>}
        >
          Track gently over time. You’re not “behind.” You’re building awareness.
        </DashboardCard>

        <DashboardCard
          title="Journal"
          footer={<button className="btn">Write</button>}
        >
          A private space to name what’s true, reframe with compassion, and release.
        </DashboardCard>

        <DashboardCard
          title="Small Next Step"
          footer={<button className="btn">Choose One</button>}
        >
          Pick one tiny action that supports you today — even 2 minutes counts.
        </DashboardCard>
      </div>
    </div>
  );
}