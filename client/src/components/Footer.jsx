import { DISCLAIMERS_COPY } from "../copy/disclaimers";

export function Footer() {
  return (
    <footer className="text-center py-6 text-sm text-charcoal bg-ivory">
      © {new Date().getFullYear()} The Genuine Love Project · Live in Genuine Love
      <br />
      support@thegenuineloveproject.com
    </footer>
  );
}