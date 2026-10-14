import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function CompleteCouncilProfile() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ council_name: "", council_role: "", country: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setOpen(false);
    if (!user) return;
    const providers = user.app_metadata?.providers;
    const social = (Array.isArray(providers) && providers.some((p: string) => p === "google" || p === "apple")) || user.identities?.some(identity => identity.provider === "google" || identity.provider === "apple");
    if (!social) return;
    supabase.from("profiles").select("council_name,council_role,country").eq("id", user.id).maybeSingle().then(({ data, error }) => {
      if (!active || error) return;
      const next = { council_name: data?.council_name ?? "", council_role: data?.council_role ?? "", country: data?.country ?? "" };
      setForm(next);
      setOpen(Object.values(next).some(value => !value.trim()));
    });
    return () => { active = false; };
  }, [user?.id]);
  return <Dialog open={open}><DialogContent className="max-w-lg [&>button]:hidden" onEscapeKeyDown={e => e.preventDefault()} onPointerDownOutside={e => e.preventDefault()}>
    <DialogTitle>Tell us about your Local Youth Council</DialogTitle><DialogDescription>Complete your Sign-up to keep your assessments and action plans together.</DialogDescription>
    <form className="space-y-4" onSubmit={async e => {
      e.preventDefault(); if (!user || Object.values(form).some(v => !v.trim())) return;
      setBusy(true); setError("");
      const { error } = await supabase.from("profiles").upsert({ id: user.id, ...Object.fromEntries(Object.entries(form).map(([k,v]) => [k,v.trim()])) });
      setBusy(false);
      if (error) { setError("Your details could not be saved. Please try again."); return; }
      setOpen(false);
    }}>
      {([ ["council_name", "Local Youth Council (LYC) name"], ["council_role", "Your role"], ["country", "Country"] ] as const).map(([key,label]) => <label key={key} className="block text-sm font-semibold">{label}<input required maxLength={120} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-foreground" /></label>)}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={busy} className="w-full">{busy ? "Saving…" : "Complete Sign-up"}</Button>
    </form>
  </DialogContent></Dialog>;
}