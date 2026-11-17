import type { User } from "@supabase/supabase-js";

const SOCIAL_PROVIDERS = new Set(["google", "apple"]);

// Accounts created through Google or Apple arrive with the address already
// verified, so they skip the confirm-your-email step. Signing in with one
// should land on a success screen with a Continue action instead of being
// carried straight into the app.
export function isSocialAccount(user: Pick<User, "app_metadata"> | null): boolean {
  const provider = (user?.app_metadata as { provider?: unknown } | undefined)?.provider;
  return typeof provider === "string" && SOCIAL_PROVIDERS.has(provider.toLowerCase());
}
