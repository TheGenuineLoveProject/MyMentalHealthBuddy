// /components/AuthTemplate.jsx
import SacredLayout from "./Layout";
import SacredSection from "./SacredSection";
import SacredButton from "./SacredButton";
import styles from "./AuthTemplate.module.css";

function Field({ id, label, type = "text", autoComplete, placeholder }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        className={styles.input}
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function AuthTemplate({ config }) {
  const { title, description, heroTitle, heroCopy, primaryCta, secondaryCta, form } = config;

  const onSubmit = (e) => {
    e.preventDefault();
    // Placeholder only — replace with your auth logic (NextAuth, Clerk, custom, etc.)
    // Must compile and run with no TODOs.
    alert("Form submitted (placeholder). Wire this to your auth provider.");
  };

  return (
    <SacredLayout title={title} description={description}>
      <SacredSection
        eyebrow="Account"
        title={heroTitle}
        subtitle={heroCopy}
        variant="glow"
        aos="fade-up"
      >
        <div className={styles.wrap}>
          <div className={styles.card} role="region" aria-label="Authentication form container">
            {form?.type === "callback" ? (
              <div className={styles.callback} aria-live="polite">
                <div className={styles.spinner} aria-hidden="true" />
                <p className={styles.callbackTitle}>Completing sign-in…</p>
                <p className={styles.callbackText}>
                  If this takes longer than expected, you can return and try again.
                </p>
                <div className={styles.row} aria-label="Callback actions">
                  <SacredButton href={primaryCta?.href} ariaLabel={primaryCta?.label}>
                    {primaryCta?.label}
                  </SacredButton>
                  <SacredButton href={secondaryCta?.href} variant="ghost" ariaLabel={secondaryCta?.label}>
                    {secondaryCta?.label}
                  </SacredButton>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className={styles.form} aria-label="Auth form">
                {form?.type === "register" ? (
                  <>
                    <Field
                      id="name"
                      label="Name"
                      autoComplete="name"
                      placeholder="Your name"
                    />
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                    <Field
                      id="password"
                      label="Password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create a secure password"
                    />
                  </>
                ) : null}

                {form?.type === "login" ? (
                  <>
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                    <Field
                      id="password"
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Your password"
                    />
                  </>
                ) : null}

                {form?.type === "forgot" ? (
                  <>
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                    <p className={styles.helper}>
                      We’ll send a reset link to your email. If you don’t see it, check spam.
                    </p>
                  </>
                ) : null}

                {form?.type === "reset" ? (
                  <>
                    <Field
                      id="newPassword"
                      label="New password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="New password"
                    />
                    <Field
                      id="confirmPassword"
                      label="Confirm password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm password"
                    />
                    <p className={styles.helper}>
                      Tip: Use a passphrase you can remember—secure and kind to your future self.
                    </p>
                  </>
                ) : null}

                {form?.type === "onboarding" ? (
                  <>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="focus">
                        What do you want support with first?
                      </label>
                      <select className={styles.select} id="focus" name="focus" defaultValue="regulation">
                        <option value="regulation">Stress + nervous system regulation</option>
                        <option value="journaling">Journaling + self-understanding</option>
                        <option value="sleep">Sleep + rest</option>
                        <option value="habits">Gentle routines + behavior change</option>
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="pace">
                        Your preferred pace
                      </label>
                      <select className={styles.select} id="pace" name="pace" defaultValue="gentle">
                        <option value="gentle">Gentle (small steps, low intensity)</option>
                        <option value="steady">Steady (consistent daily practice)</option>
                        <option value="focused">Focused (deeper sessions when ready)</option>
                      </select>
                    </div>

                    <div className={styles.checkboxRow}>
                      <input id="emailUpdates" name="emailUpdates" type="checkbox" className={styles.checkbox} />
                      <label htmlFor="emailUpdates" className={styles.checkboxLabel}>
                        Send me occasional supportive updates (optional)
                      </label>
                    </div>
                  </>
                ) : null}

                <div className={styles.row} aria-label="Form actions">
                  <SacredButton ariaLabel="Submit form">{buttonLabel(form?.type)}</SacredButton>
                  {secondaryCta?.href ? (
                    <SacredButton href={secondaryCta.href} variant="ghost" ariaLabel={secondaryCta.label}>
                      {secondaryCta.label}
                    </SacredButton>
                  ) : null}
                </div>

                {primaryCta?.href ? (
                  <p className={styles.bottomLink}>
                    <a href={primaryCta.href}>{primaryCta.label}</a>
                  </p>
                ) : null}
              </form>
            )}
          </div>

          <p className={styles.note}>
            We keep this space calm on purpose: no urgency tactics, no shame language, no overwhelm.
          </p>
        </div>
      </SacredSection>
    </SacredLayout>
  );
}

function buttonLabel(type) {
  switch (type) {
    case "login":
      return "Log in";
    case "register":
      return "Create account";
    case "forgot":
      return "Send reset link";
    case "reset":
      return "Update password";
    case "onboarding":
      return "Save & continue";
    default:
      return "Continue";
  }
}