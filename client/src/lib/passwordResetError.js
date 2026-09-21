export function passwordResetErrorMessage(error) {
  if (error?.code === "RESET_TOKEN_INVALID") {
    return "This reset link has expired or is invalid. Please request a new one.";
  }
  if (error?.code === "RESET_PASSWORD_INVALID") {
    return "Password must be at least 8 characters.";
  }
  if (error?.status === 429) {
    return "Too many requests. Please wait and try again.";
  }
  return "Something went wrong. Please try again.";
}