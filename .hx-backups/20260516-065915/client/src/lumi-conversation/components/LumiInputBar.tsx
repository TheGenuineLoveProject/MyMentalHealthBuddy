/**
 * Phase 15 (spec-aligned) — Lumi input bar with auto-resize textarea.
 *
 * Submits on Cmd/Ctrl+Enter. Plain Enter inserts a newline. The opt-out is
 * always one tap away — there is no "session locked" state.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { MMHBButton } from "@/design-system";
import { colors, typography, radius, spacing } from "@/design-system";

export type LumiInputBarProps = {
  onSubmit: (text: string) => void;
  onLeave: () => void;
  disabled?: boolean;
  /** Optional placeholder override (rare — defaults are calm and inviting). */
  placeholder?: string;
};

const wrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const taStyle: CSSProperties = {
  width: "100%",
  resize: "none",
  fontFamily: typography.fonts.body,
  fontSize: 16,
  lineHeight: 1.5,
  color: colors.semantic.fgBody,
  background: colors.semantic.bgCard,
  border: `1px solid ${colors.semantic.borderSubtle}`,
  borderRadius: radius.lg,
  padding: `${spacing.xs}px ${spacing.sm}px`,
  outline: "none",
  transition: "border-color 200ms ease, box-shadow 200ms ease",
  minHeight: 56,
  maxHeight: 220,
};

const rowStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
};

const helperStyle: CSSProperties = {
  fontFamily: typography.fonts.body,
  fontSize: 12,
  color: colors.semantic.fgMuted,
};

export function LumiInputBar({
  onSubmit,
  onLeave,
  disabled = false,
  placeholder = "Type whatever feels honest. There's no required length.",
}: LumiInputBarProps) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const autoresize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, []);

  useEffect(() => {
    autoresize();
  }, [value, autoresize]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSubmit(text);
    setValue("");
  };

  return (
    <div style={wrapperStyle} data-testid="lumi-input-bar">
      <textarea
        ref={taRef}
        rows={2}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKey}
        style={taStyle}
        data-testid="lumi-input-textarea"
        aria-label="Message Lumi"
      />
      <div style={rowStyle}>
        <span style={helperStyle}>
          Cmd/Ctrl + Enter to send. You can leave at any time.
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <MMHBButton
            variant="tertiary"
            size="sm"
            onClick={onLeave}
            data-testid="button-lumi-leave"
            aria-label="Leave the conversation"
          >
            Leave gently
          </MMHBButton>
          <MMHBButton
            variant="primary"
            size="sm"
            onClick={submit}
            disabled={disabled || value.trim().length === 0}
            data-testid="button-lumi-send"
          >
            Send
          </MMHBButton>
        </div>
      </div>
    </div>
  );
}
