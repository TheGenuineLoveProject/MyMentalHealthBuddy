export const ERROR_MICROCOPY = {
  boundary: {
    title: "Something unexpected happened",
    message: "We ran into a small bump, but your progress is safe. Take a breath.",
    action: "Return Home",
    supportNote: "If this keeps happening, we're here to help."
  },
  notFound: {
    title: "This path leads somewhere new",
    message: "The page you were looking for isn't here—but that's okay. Sometimes we find ourselves in unexpected places.",
    action: "Return Home",
    suggestion: "Let's gently guide you somewhere helpful."
  },
  network: {
    title: "Connection taking a moment",
    message: "We're having a little trouble connecting. This happens sometimes.",
    action: "Try Again",
    tip: "Take a gentle breath. When you're ready, try again."
  },
  serverError: {
    title: "We need a moment",
    message: "Something on our end needs attention. We're working on it.",
    action: "Refresh",
    reassurance: "Your progress is safe. This is just temporary."
  },
  timeout: {
    title: "Taking longer than usual",
    message: "Things are moving slowly right now. You can wait, or come back in a moment.",
    action: "Retry",
    patience: "Sometimes the best things take time."
  },
  unauthorized: {
    title: "Welcome back",
    message: "Please sign in to continue your journey with us.",
    action: "Sign In",
    note: "Your wellness space is waiting for you."
  },
  forbidden: {
    title: "This space isn't quite ready",
    message: "This content is available with different access levels.",
    action: "Explore Options",
    upgrade: "There may be something perfect waiting for you."
  },
  validation: {
    title: "One small thing",
    message: "Let's take another look at the highlighted areas together.",
    action: "Review",
    help: "We're here to support you through this."
  },
  generic: {
    title: "Hmm...",
    message: "Something didn't quite work as expected. That's okay.",
    action: "Try Again",
    encouragement: "Every moment is a fresh start."
  }
} as const;

export type ErrorType = keyof typeof ERROR_MICROCOPY;

export function getErrorMicrocopy(type: ErrorType = 'generic') {
  return ERROR_MICROCOPY[type] || ERROR_MICROCOPY.generic;
}

export const CRISIS_FALLBACK = {
  message: "If you need support right now, please reach out. You're not alone.",
  usHotline: "988 Suicide & Crisis Lifeline",
  usNumber: "988",
  international: "Contact your local emergency services"
} as const;
