// Sign-in failures that mean "this account exists but its email address has
// not been confirmed yet". Those must route the visitor to the
// confirm-your-email screen instead of a bare failure message.
export function isUnconfirmedEmailError(message: string | undefined): boolean {
  const m = (message ?? "").toLowerCase();
  return m.includes("email not confirmed") || m.includes("email_not_confirmed") || m.includes("not verified");
}

// The backend only allows one confirmation email per minute.
export function isConfirmationRateLimit(message: string | undefined, status?: number): boolean {
  return status === 429 || /security purposes/i.test(message ?? "");
}
