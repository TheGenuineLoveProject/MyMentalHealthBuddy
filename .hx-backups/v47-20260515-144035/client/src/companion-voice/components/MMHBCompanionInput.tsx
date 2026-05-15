/**
 * Phase 15 — Lightweight, opt-out-friendly text input for talking with Lumi.
 *
 * - Submission ALWAYS routes through the engine — no direct rendering of raw input.
 * - Never auto-focuses (would feel demanding).
 * - Pause / clear is one click away.
 */

import { useState } from "react";
import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";

export type MMHBCompanionInputProps = {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function MMHBCompanionInput({
  onSubmit,
  disabled,
  placeholder = "Whatever's on your mind — a word, a phrase, anything.",
}: MMHBCompanionInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    onSubmit(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="form-companion-input"
      style={{ display: "grid", gap: 10 }}
    >
      <label
        htmlFor="companion-input-textarea"
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 13,
          color: colors.semantic.fgMuted,
        }}
      >
        Share at your own pace — no pressure.
      </label>
      <textarea
        id="companion-input-textarea"
        data-testid="input-companion"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        disabled={disabled}
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 15,
          color: colors.semantic.fgBody,
          background: colors.semantic.bgCard,
          border: `1px solid ${colors.semantic.borderSubtle}`,
          borderRadius: 12,
          padding: "12px 14px",
          resize: "vertical",
          minHeight: 84,
        }}
      />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <MMHBButton
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => setText("")}
          disabled={disabled || text.length === 0}
          data-testid="button-companion-clear"
        >
          Clear
        </MMHBButton>
        <MMHBButton
          variant="primary"
          size="sm"
          type="submit"
          disabled={disabled}
          data-testid="button-companion-submit"
        >
          Share
        </MMHBButton>
      </div>
    </form>
  );
}
