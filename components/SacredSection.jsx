// /components/SacredSection.jsx
import SacredButton from "./SacredButton";
import styles from "./SacredSection.module.css";

export default function SacredSection({ section, index }) {
  const variant = section?.variant || "plain";
  const hasCards = Array.isArray(section?.cards) && section.cards.length > 0;
  const hasBullets = Array.isArray(section?.bullets) && section.bullets.length > 0;

  return (
    <section
      className={`${styles.section} ${styles[variant] || ""}`}
      aria-label={section?.title || `Section ${index + 1}`}
      id={section?.id || undefined}
    >
      <div className={styles.container}>
        <div className={styles.head} data-aos="fade-up">
          {section?.eyebrow && <div className={styles.eyebrow}>{section.eyebrow}</div>}
          {section?.title && <h2 className="t-heading">{section.title}</h2>}
          {section?.subtitle && <p className="t-body">{section.subtitle}</p>}
        </div>

        {hasBullets && (
          <ul className={styles.bullets} data-aos="fade-up" data-aos-delay="70">
            {section.bullets.map((b, i) => (
              <li key={`${b}-${i}`}>{b}</li>
            ))}
          </ul>
        )}

        {hasCards && (
          <div className={styles.cards} data-aos="fade-up" data-aos-delay="90">
            {section.cards.map((c, i) => (
              <div className={styles.card} key={`${c.title}-${i}`}>
                <div className={styles.cardTitle}>{c.title}</div>
                <div className={styles.cardText}>{c.text}</div>
              </div>
            ))}
          </div>
        )}

        {section?.cta?.href && (
          <div className={styles.cta} data-aos="fade-up" data-aos-delay="120">
            <SacredButton href={section.cta.href} variant="primary">
              {section.cta.label}
            </SacredButton>
          </div>
        )}
      </div>
    </section>
  );
}