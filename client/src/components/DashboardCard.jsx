import React from "react";

export default function DashboardCard({ title, children, footer }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="muted">{children}</div>
      {footer && <div className="hr" />}
      {footer && <div>{footer}</div>}
    </section>
  );
}