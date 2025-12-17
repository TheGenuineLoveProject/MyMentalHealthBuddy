import { DISCLAIMERS_COPY } from "../copy/disclaimers";
import { BRAND } from "@shared/brand";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-[var(--gl-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm opacity-75">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong>{BRAND.name}</strong> — {BRAND.mission}
          </div>
          <div className="flex gap-3">
            <a className="hover:underline" href="/legal/privacy">Privacy</a>
            <a className="hover:underline" href="/legal/terms">Terms</a>
            <a className="hover:underline" href="/legal/disclaimer">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}