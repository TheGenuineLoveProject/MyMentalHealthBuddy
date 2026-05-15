import { tokens } from "@/brand/tokens";
import { brandCopy } from "@/brand/copy";

export function Hero() {
  return (
    <section
      style={{
        background: tokens.colors.background,
        padding: tokens.spacing.xl,
        textAlign: "center",
      }}
    >
      <h1 style={{ color: tokens.colors.textPrimary, fontSize: "2.2rem" }}>
        Think clearly. Act gently. Live deliberately.
      </h1>

      <p
        style={{
          maxWidth: 640,
          margin: "16px auto",
          color: tokens.colors.textSecondary,
          fontSize: "1.05rem",
        }}
      >
        {brandCopy.productName} is a structured, non-therapy space for reflection,
        insight, and intentional daily action.
      </p>

      <p style={{ fontSize: "0.9rem", color: tokens.colors.textSecondary }}>
        Not therapy. Not advice. Just clarity.
      </p>

      <div style={{ marginTop: tokens.spacing.lg }}>
        <button style={{ padding: "12px 20px" }}>
          Begin today
        </button>
        <div style={{ marginTop: 8 }}>
          <a style={{ fontSize: "0.85rem" }}>How this works</a>
        </div>
      </div>
    </section>
  );
}