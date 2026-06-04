export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  xxl: "32px",
} as const;

export const section = {
  paddingY: spacing.xl,
  paddingX: spacing.lg,
  gap: spacing.xl,
} as const;

export const card = {
  padding: spacing.md,
  gap: spacing.sm,
  radius: 24,
} as const;

export const buttonPadding = {
  sm: "8px 14px",
  md: "12px 18px",
  lg: "16px 24px",
} as const;