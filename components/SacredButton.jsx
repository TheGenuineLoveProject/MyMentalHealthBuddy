// /components/SacredButton.jsx
import Link from "next/link";
// /components/SacredButton.jsx
import styles from "./SacredButton.module.css";

export default function SacredButton({ href, variant = "primary", children }) {
  const className = `${styles.btn} ${styles[variant] || ""}`;
  return (
    <a className={className} href={href} aria-label={typeof children === "string" ? children : "Call to action"}>
      {children}
    </a>
  );
}