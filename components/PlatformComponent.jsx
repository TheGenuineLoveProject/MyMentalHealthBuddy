// /components/PlatformComponent.jsx
import Image from "next/image";
import styles from "./PlatformComponent.module.css";

export default function PlatformComponent({ item, index }) {
  return (
    <article className={styles.card} data-aos="fade-up" data-aos-delay={index * 60}>
      <div className={styles.iconWrap} aria-hidden="true">
        <div className={styles.iconScale}>
          <Image src={item.icon} alt="" width={44} height={44} loading="lazy" />
        </div>
      </div>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.text}>{item.text}</p>
    </article>
  );
}