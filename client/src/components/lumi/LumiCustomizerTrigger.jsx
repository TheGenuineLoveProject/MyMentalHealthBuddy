import { useState } from "react";
import { Palette } from "lucide-react";
import { LumiCustomizer } from "./LumiCustomizer";

/**
 * LumiCustomizerTrigger
 * ----------------------
 * Small circular palette button that opens the LumiCustomizer modal.
 * Designed to sit beside <LumiMascot /> in the header or chat.
 *
 * Props:
 *   - className (string)   passthrough
 *   - size      (number)   pixel size of the button (default 36)
 *
 * Renders the modal in the same tree as the trigger so consumers don't
 * have to wire up state themselves.
 */
export function LumiCustomizerTrigger({ className = "", size = 36 }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`lumi-btn-icon lumi-btn-ghost ${className}`.trim()}
        title="Customize your Lumi"
        aria-label="Customize your Lumi"
        onClick={() => setOpen(true)}
        style={{
          width: size,
          height: size,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          padding: 0,
          background: "transparent",
          border: "1px solid var(--lumi-stone-200, #e0ddd5)",
          color: "var(--lumi-sage-700, #2f5443)",
          cursor: "pointer",
          transition: "background 160ms ease-out, border-color 160ms ease-out",
        }}
        data-testid="button-open-lumi-customizer"
      >
        <Palette size={20} aria-hidden="true" />
      </button>
      <LumiCustomizer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default LumiCustomizerTrigger;

// Example usage:
// <LumiCustomizerTrigger /> placed next to <LumiMascot />
