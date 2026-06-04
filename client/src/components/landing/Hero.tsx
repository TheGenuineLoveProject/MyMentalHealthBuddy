import { tokens } from "@/design-system";

export default function Hero() {
  return (
    <section
      style={{
        background: tokens.colors.semantic.bgPage,
        padding: tokens.spacing.xl,
      }}
    >
      <h1
        style={{
          color: tokens.colors.semantic.fgHeading,
          fontSize: "2.2rem",
        }}
      >
        MyMentalHealthBuddy
      </h1>

      <p
        style={{
          color: tokens.colors.semantic.fgMuted,
          marginTop: tokens.spacing.md,
        }}
      >
        Live in Genuine Love
      </p>

      <div style={{ marginTop: tokens.spacing.lg }}>
        <p
          style={{
            fontSize: "0.9rem",
            color: tokens.colors.semantic.fgMuted,
          }}
        >
          Healing Resources • Reflection • Emotional Support
        </p>
      </div>
    </section>
  );
}
