export const ERROR_MICROCOPY = {
  boundary: {
    title: "Something unexpected happened",
    message: "We encountered an issue loading this page. Your progress is safe.",
    action: "Return to Home",
    supportNote: "If this keeps happening, please let us know."
  },
  notFound: {
    title: "Page not found",
    message: "The page you're looking for doesn't exist or has been moved.",
    action: "Go Home",
    suggestion: "Try checking the URL or return to the homepage."
  },
  network: {
    title: "Connection issue",
    message: "We're having trouble connecting. Please check your internet connection.",
    action: "Try Again",
    tip: "This might be temporary. Take a breath and try again in a moment."
  },
  serverError: {
    title: "Server hiccup",
    message: "Something went wrong on our end. We're working to fix it.",
    action: "Refresh",
    reassurance: "Your data is safe. This is temporary."
  },
  timeout: {
    title: "Taking longer than expected",
    message: "The request is taking a while. You can wait or try again.",
    action: "Retry",
    patience: "Sometimes things just need a moment."
  },
  unauthorized: {
    title: "Access restricted",
    message: "You need to sign in to view this content.",
    action: "Sign In",
    note: "Your wellness journey awaits."
  },
  forbidden: {
    title: "Not available",
    message: "This content isn't available with your current access level.",
    action: "Learn More",
    upgrade: "Consider exploring our membership options."
  },
  validation: {
    title: "Something needs attention",
    message: "Please check the highlighted fields and try again.",
    action: "Review",
    help: "We're here to help you get it right."
  },
  generic: {
    title: "Oops",
    message: "Something didn't work as expected.",
    action: "Try Again",
    encouragement: "Every setback is a setup for a comeback."
  }
} as const;

export type ErrorType = keyof typeof ERROR_MICROCOPY;

export function getErrorMicrocopy(type: ErrorType = 'generic') {
  return ERROR_MICROCOPY[type] || ERROR_MICROCOPY.generic;
}

export const CRISIS_FALLBACK = {
  message: "If you're in crisis, please reach out for support.",
  usHotline: "988 Suicide & Crisis Lifeline",
  usNumber: "988",
  international: "Contact your local emergency services"
} as const;
