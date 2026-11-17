import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdminRole, requireDeletableAccount } from "./admin-accounts-policy";
import { userAccountAttributes } from "./admin-account-creation";

export const listAdminAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles, error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (roleError) throw new Error("Could not verify administrator access.");
    requireAdminRole(roles ?? []);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const accounts = [];
    for (let page = 1; ; page++) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error("Could not load accounts.");
      const ids = data.users.map(user => user.id);
      const { data: profiles, error: profileError } = ids.length ? await context.supabase.from("profiles").select("id, full_name, first_name, surname, country, council_name").in("id", ids) : { data: [], error: null };
      if (profileError) throw new Error("Could not load account profiles.");
      for (const user of data.users) {
        const profile = profiles?.find(row => row.id === user.id);
        accounts.push({ id: user.id, email: user.email ?? "", name: profile?.full_name || [profile?.first_name, profile?.surname].filter(Boolean).join(" ") || String(user.user_metadata?.full_name ?? ""), country: profile?.country || String(user.user_metadata?.country ?? ""), council: profile?.council_name ?? "", createdAt: user.created_at, lastSignIn: user.last_sign_in_at ?? null, confirmed: Boolean(user.email_confirmed_at), test: user.app_metadata?.impact_test_account === true });
      }
      if (data.users.length < 200) break;
    }
    return accounts;
  });

export const createUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ email: z.email().max(255), name: z.string().trim().min(1).max(100), country: z.string().trim().min(1).max(80), password: z.string().min(8).max(72) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: roles, error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (roleError) throw new Error("Could not verify administrator access.");
    requireAdminRole(roles ?? []);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.createUser(userAccountAttributes(data));
    if (error) {
      if (error.code === "weak_password") throw new Error(`Password rejected: ${error.message}`);
      if (error.code === "email_exists" || error.code === "user_already_exists") throw new Error("An account with this email already exists.");
      throw new Error("Could not create this account. Please try again or check the email address.");
    }
    return { success: true };
  });

export const resetAccountPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ id: z.uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: roles, error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (roleError) throw new Error("Could not verify administrator access.");
    requireAdminRole(roles ?? []);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: account, error } = await supabaseAdmin.auth.admin.getUserById(data.id);
    if (error || !account.user.email) throw new Error("This account has no available email address.");
    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(account.user.email, { redirectTo: "https://impactplatform.lovable.app/reset-password" });
    if (resetError) {
      console.error("Admin password reset failed", { code: resetError.code, status: resetError.status });
      throw new Error(resetError.code === "over_email_send_rate_limit" ? "The email sending limit has been reached. Please try again later." : "Password reset email could not be sent. Check that the account has a deliverable email address and try again.");
    }
    return { success: true };
  });

export const deleteUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ id: z.uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: roles, error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (roleError) throw new Error("Could not verify administrator access.");
    requireAdminRole(roles ?? []);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: account, error } = await supabaseAdmin.auth.admin.getUserById(data.id);
    if (error || !account.user) throw new Error("Account not found.");
    const { data: targetRoles, error: targetError } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", data.id);
    if (targetError) throw new Error("Could not verify this account.");
    requireDeletableAccount(account.user, context.userId, (targetRoles ?? []).some(row => row.role === "admin"));
    for (const table of ["action_plans", "assessments", "community_feedback"] as const) {
      const { error: cleanupError } = await supabaseAdmin.from(table).delete().eq("user_id", data.id);
      if (cleanupError) throw new Error("Could not remove this account's saved data. The account has not been deleted.");
    }
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (deleteError) throw new Error("Could not delete the account. Its saved data may need to be removed first.");
    return { success: true };
  });