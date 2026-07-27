import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import logoAsset from "@/assets/logo_color_impact.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — IMPACT" },
      { name: "description", content: "Sign in or create an IMPACT account to save your youth council assessments." },
      { property: "og:title", content: "Sign in — IMPACT" },
      { property: "og:description", content: "Sign in or create an IMPACT account to save your youth council assessments." },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  full_name: z.string().trim().min(1, "Required").max(100),
  council_name: z.string().trim().min(1, "Required").max(120),
  country: z.string().trim().min(1, "Required").max(80),
  city: z.string().trim().min(1, "Required").max(80),
  council_role: z.string().trim().min(1, "Required").max(80),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const router = useRouter();

  // If already signed in, bounce to dashboard.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    setBusy(true);
    try {
      if (mode === "signin") {
        const parsed = signInSchema.safeParse(raw);
        if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) { setError(error.message); return; }
      } else {
        const parsed = signUpSchema.safeParse(raw);
        if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
        const { email, password, ...meta } = parsed.data;
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: meta,
          },
        });
        if (error) { setError(error.message); return; }
      }
      router.invalidate();
      navigate({ to: "/dashboard", replace: true });
    } finally {
      setBusy(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    setError(null);
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError(result.error.message || `${provider} sign-in failed`);
        return;
      }
      if (result.redirected) return;
      router.invalidate();
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[color:var(--impact-cream,#faf6ef)] flex flex-col">
      <header className="mx-auto w-full max-w-[1440px] px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <img src={logoAsset.url} alt="IMPACT" className="h-10" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[460px] rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5">
          <h1 className="text-2xl font-extrabold text-[color:var(--impact-ink)]">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-[color:var(--impact-ink)]/70">
            {mode === "signin"
              ? "Sign in to access your assessments."
              : "Register your Local Youth Council to save results and action plans."}
          </p>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--impact-ink)] hover:bg-black/5 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 34.9 26.7 36 24 36c-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41.4 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--impact-ink)] hover:bg-black/5 disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.46 2.23-1.21 3.04-.79.85-2.09 1.51-3.15 1.43-.13-1.1.42-2.24 1.15-3.03.82-.9 2.22-1.55 3.21-1.44zM20.5 17.05c-.55 1.28-.82 1.85-1.53 2.98-.99 1.58-2.39 3.55-4.12 3.56-1.54.02-1.94-1-4.03-1-2.09.02-2.52 1.02-4.07 1.01-1.73-.01-3.06-1.79-4.05-3.37-2.77-4.42-3.06-9.6-1.35-12.36 1.21-1.95 3.13-3.09 4.93-3.09 1.84 0 2.99 1.01 4.51 1.01 1.48 0 2.38-1.01 4.51-1.01 1.61 0 3.31.88 4.52 2.4-3.98 2.18-3.33 7.87.68 9.87z"/></svg>
              Apple
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-black/40">
            <span className="h-px flex-1 bg-black/10" /> or with email <span className="h-px flex-1 bg-black/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <>
                <Field name="full_name" label="Full name" />
                <Field name="council_name" label="Local Youth Council" />
                <div className="grid grid-cols-2 gap-3">
                  <Field name="country" label="Country" />
                  <Field name="city" label="City" />
                </div>
                <Field name="council_role" label="Role in council" placeholder="Member, coordinator…" />
              </>
            )}
            <Field name="email" type="email" label="Email" autoComplete="email" />
            <Field
              name="password"
              type="password"
              label="Password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 w-full rounded-full bg-[color:var(--impact-purple)] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[color:var(--impact-ink)]/70">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setError(null); setMode(mode === "signin" ? "signup" : "signin"); }}
              className="font-semibold text-[color:var(--impact-purple)] hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({
  name, label, type = "text", placeholder, autoComplete,
}: { name: string; label: string; type?: string; placeholder?: string; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[color:var(--impact-ink)]/80">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--impact-ink)] outline-none focus:border-[color:var(--impact-purple)] focus:ring-2 focus:ring-[color:var(--impact-purple)]/20"
      />
    </label>
  );
}
