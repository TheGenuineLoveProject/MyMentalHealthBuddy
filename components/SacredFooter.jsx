// /components/SacredFooter.jsx
import styles from "./SacredFooter.module.css";
import SacredButton from "./SacredButton";


export default function SacredFooter() {
  return (
    <section className={styles.wrap} aria-label="Trust footer" data-aos="fade-up">
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.title}>A gentle note</div>
          <div className={styles.text}>
            This platform supports wellbeing and self-reflection. If you’re in immediate danger or considering self-harm,
            please use local emergency services or visit <a href="/crisis">Crisis Resources</a>.
          </div>
        </div>
      </div>
    </section>
  );
}