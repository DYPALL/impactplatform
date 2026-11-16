import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Reset Your Password — IMPACT" }, { name: "description", content: "Securely choose a new password for your IMPACT account." },
    { property: "og:title", content: "Reset Your Password — IMPACT" }, { property: "og:description", content: "Securely choose a new password for your IMPACT account." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: ResetPassword,
});

function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => { if (active) { setReady(Boolean(data.user)); setChecked(true); } });
    return () => { active = false; };
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password !== form.get("confirm")) { setError("Passwords do not match."); return; }
    setBusy(true);
    try { const { error } = await supabase.auth.updateUser({ password }); if (error) setError(error.message); else setDone(true); }
    catch { setError("Could not update your password. Please try again."); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto min-h-[65vh] max-w-lg px-6 py-16 text-foreground"><KeyRound className="mb-5 size-8 text-primary" /><h1 className="text-3xl font-extrabold text-primary">Reset your password</h1>
    {done ? <div className="mt-6 space-y-5"><p role="status">Your password has been updated.</p><Button asChild><Link to="/dashboard">My Assessments</Link></Button></div> : ready ? <form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm font-semibold">New password<Input type="password" name="password" autoComplete="new-password" required minLength={8} maxLength={72} className="mt-2" /></label><label className="block text-sm font-semibold">Confirm password<Input type="password" name="confirm" autoComplete="new-password" required minLength={8} maxLength={72} className="mt-2" /></label>{error && <p role="alert" className="text-destructive">{error}</p>}<Button type="submit" disabled={busy} className="rounded-full">{busy ? "Saving…" : "Update password"}</Button></form> : <p className="mt-6 text-muted-foreground">{checked ? "Open the link in your password reset email. If it has expired, request a new email from the platform administrator." : "Checking your reset link…"}</p>}
  </main>;
}