/**
 * Design Token CSS Generator
 * Converts TypeScript tokens to CSS custom properties
 * Enables consumption by Tailwind, vanilla CSS, and styled components
 */

import { foundational, semantic, component } from '../../../shared/design-system/tokens';

/**
 * Generate CSS custom properties from design tokens
 */
export function generateTokenCSS(): string {
  let css = `/**
 * Auto-generated Design Token CSS Variables
 * Source: apps/shared/design-system/tokens.ts
 * Do not edit manually - regenerate using generateTokenCSS()
 */

:root {
  /* ===== FOUNDATIONAL TOKENS ===== */
  
  /* Colors - Blue */
`;

  // Generate color variables
  Object.entries(foundational.color.blue).forEach(([key, value]) => {
    css += `  --color-blue-${key}: ${value};\n`;
  });

  css += `\n  /* Colors - Green */\n`;
  Object.entries(foundational.color.green).forEach(([key, value]) => {
    css += `  --color-green-${key}: ${value};\n`;
  });

  css += `\n  /* Colors - Coral */\n`;
  Object.entries(foundational.color.coral).forEach(([key, value]) => {
    css += `  --color-coral-${key}: ${value};\n`;
  });

  css += `\n  /* Colors - Violet */\n`;
  Object.entries(foundational.color.violet).forEach(([key, value]) => {
    css += `  --color-violet-${key}: ${value};\n`;
  });

  css += `\n  /* Colors - Neutral */\n`;
  Object.entries(foundational.color.neutral).forEach(([key, value]) => {
    css += `  --color-neutral-${key}: ${value};\n`;
  });

  css += `\n  /* Colors - Mood */\n`;
  Object.entries(foundational.color.mood).forEach(([key, value]) => {
    css += `  --color-mood-${key}: ${value};\n`;
  });

  css += `\n  /* Colors - Semantic */\n`;
  css += `  --color-success: ${foundational.color.success};\n`;
  css += `  --color-warning: ${foundational.color.warning};\n`;
  css += `  --color-error: ${foundational.color.error};\n`;
  css += `  --color-info: ${foundational.color.info};\n`;

  // Spacing
  css += `\n  /* Spacing */\n`;
  Object.entries(foundational.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });

  // Typography
  css += `\n  /* Typography - Font Size */\n`;
  Object.entries(foundational.typography.fontSize).forEach(([key, value]) => {
    css += `  --font-size-${key}: ${value};\n`;
  });

  css += `\n  /* Typography - Font Weight */\n`;
  Object.entries(foundational.typography.fontWeight).forEach(([key, value]) => {
    css += `  --font-weight-${key}: ${value};\n`;
  });

  css += `\n  /* Typography - Line Height */\n`;
  Object.entries(foundational.typography.lineHeight).forEach(([key, value]) => {
    css += `  --line-height-${key}: ${value};\n`;
  });

  // Border Radius
  css += `\n  /* Border Radius */\n`;
  Object.entries(foundational.borderRadius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });

  // Shadows
  css += `\n  /* Shadows */\n`;
  Object.entries(foundational.shadow).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`;
  });

  // Motion
  css += `\n  /* Motion - Duration */\n`;
  Object.entries(foundational.motion.duration).forEach(([key, value]) => {
    css += `  --duration-${key}: ${value};\n`;
  });

  css += `\n  /* Motion - Easing */\n`;
  Object.entries(foundational.motion.easing).forEach(([key, value]) => {
    css += `  --easing-${key}: ${value};\n`;
  });

  // Z-Index
  css += `\n  /* Z-Index */\n`;
  Object.entries(foundational.zIndex).forEach(([key, value]) => {
    css += `  --z-${key}: ${value};\n`;
  });

  // Semantic Tokens
  css += `\n  /* ===== SEMANTIC TOKENS ===== */\n`;
  
  // Therapeutic Modes
  css += `\n  /* Serenity Mode */\n`;
  css += `  --mode-serenity-primary: ${semantic.modes.serenity.primary};\n`;
  css += `  --mode-serenity-surface: ${semantic.modes.serenity.surface};\n`;
  css += `  --mode-serenity-border: ${semantic.modes.serenity.border};\n`;
  css += `  --mode-serenity-text: ${semantic.modes.serenity.text};\n`;
  css += `  --mode-serenity-accent: ${semantic.modes.serenity.accent};\n`;

  css += `\n  /* Empowerment Mode */\n`;
  css += `  --mode-empowerment-primary: ${semantic.modes.empowerment.primary};\n`;
  css += `  --mode-empowerment-surface: ${semantic.modes.empowerment.surface};\n`;
  css += `  --mode-empowerment-border: ${semantic.modes.empowerment.border};\n`;
  css += `  --mode-empowerment-text: ${semantic.modes.empowerment.text};\n`;
  css += `  --mode-empowerment-accent: ${semantic.modes.empowerment.accent};\n`;

  css += `\n  /* Focus Mode */\n`;
  css += `  --mode-focus-primary: ${semantic.modes.focus.primary};\n`;
  css += `  --mode-focus-surface: ${semantic.modes.focus.surface};\n`;
  css += `  --mode-focus-border: ${semantic.modes.focus.border};\n`;
  css += `  --mode-focus-text: ${semantic.modes.focus.text};\n`;
  css += `  --mode-focus-accent: ${semantic.modes.focus.accent};\n`;

  css += `\n  /* Recovery Mode */\n`;
  css += `  --mode-recovery-primary: ${semantic.modes.recovery.primary};\n`;
  css += `  --mode-recovery-surface: ${semantic.modes.recovery.surface};\n`;
  css += `  --mode-recovery-border: ${semantic.modes.recovery.border};\n`;
  css += `  --mode-recovery-text: ${semantic.modes.recovery.text};\n`;
  css += `  --mode-recovery-accent: ${semantic.modes.recovery.accent};\n`;

  // Component Tokens
  css += `\n  /* ===== COMPONENT TOKENS ===== */\n`;
  
  css += `\n  /* Button - Primary */\n`;
  css += `  --button-primary-bg: ${component.button.primary.background};\n`;
  css += `  --button-primary-hover: ${component.button.primary.hover};\n`;
  css += `  --button-primary-active: ${component.button.primary.active};\n`;
  css += `  --button-primary-text: ${component.button.primary.text};\n`;
  css += `  --button-primary-shadow: ${component.button.primary.shadow};\n`;
  css += `  --button-primary-radius: ${component.button.primary.borderRadius};\n`;

  css += `\n  /* Card */\n`;
  css += `  --card-bg: ${component.card.background};\n`;
  css += `  --card-border: ${component.card.border};\n`;
  css += `  --card-shadow: ${component.card.shadow};\n`;
  css += `  --card-shadow-hover: ${component.card.shadowHover};\n`;
  css += `  --card-radius: ${component.card.borderRadius};\n`;
  css += `  --card-padding: ${component.card.padding};\n`;

  css += `\n  /* Input */\n`;
  css += `  --input-bg: ${component.input.background};\n`;
  css += `  --input-border: ${component.input.border};\n`;
  css += `  --input-border-focus: ${component.input.borderFocus};\n`;
  css += `  --input-text: ${component.input.text};\n`;
  css += `  --input-placeholder: ${component.input.placeholder};\n`;
  css += `  --input-shadow: ${component.input.shadow};\n`;
  css += `  --input-shadow-focus: ${component.input.shadowFocus};\n`;
  css += `  --input-radius: ${component.input.borderRadius};\n`;

  css += `}\n`;

  return css;
}

// Helper to write CSS file
export function writeTokenCSSFile(): void {
  const css = generateTokenCSS();
  console.log(css);
  // In production, this would write to apps/client/src/design-system/tokens.css
}
