import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import logoAsset from "@/assets/logo_color_impact.png.asset.json";
import cofundLogo from "@/assets/cofund-eu-white.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Log-in — IMPACT" },
      { name: "description", content: "Log-in or Sign-up to save your IMPACT youth council assessments." },
      { property: "og:title", content: "Log-in — IMPACT" },
      { property: "og:description", content: "Log-in or Sign-up to save your IMPACT youth council assessments." },
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

/* ---------- Header (mirrors landing) ---------- */
function Header() {
  return (
    <header className="w-full border-b border-[color:var(--impact-border)] bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-[120px]">
        <Link to="/" className="flex items-center">
          <img src={logoAsset.url} alt="IMPACT logo" className="h-8 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/" className="inline-flex items-center gap-2 text-[15px] font-bold text-[color:var(--impact-ink)]">
            <HomeIcon /> Home
          </Link>
          <a href="/#resources" className="inline-flex items-center gap-2 text-[15px] font-bold text-[color:var(--impact-ink)]">
            <HubIcon /> Resource Hub
          </a>
          <a href="/#contact" className="inline-flex items-center gap-2 text-[15px] font-bold text-[color:var(--impact-ink)]">
            <SendIcon /> Send us a message
          </a>
          <Link
            to="/auth"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[color:var(--impact-purple)] px-[18px] text-[14px] font-bold text-white transition hover:opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Log-in / Sign-up
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden>
      <path d="M0.872437 8.65795C0.872437 7.30418 0.872437 6.6273 1.14558 6.03216C1.41973 5.43702 1.93312 4.99739 2.96091 4.11615L3.9578 3.26182C5.81699 1.66979 6.74409 0.872284 7.85063 0.872284C8.95717 0.872284 9.88527 1.6688 11.7435 3.26082L12.7404 4.11515C13.7671 4.9964 14.2815 5.43602 14.5547 6.03116C14.8288 6.6263 14.8288 7.30319 14.8288 8.65696V12.8847C14.8288 14.7649 14.8288 15.7039 14.2446 16.2881C13.6605 16.8723 12.7214 16.8723 10.8413 16.8723H4.85998C2.97985 16.8723 2.04079 16.8723 1.45661 16.2881C0.872436 15.7039 0.872437 14.7649 0.872437 12.8847V8.65795Z" stroke="#502181" strokeWidth="1.74455"/>
      <path d="M10.3431 16.8723V11.8878C10.3431 11.6235 10.238 11.3699 10.0511 11.1829C9.86413 10.996 9.61057 10.891 9.34618 10.891H6.35553C6.09114 10.891 5.83758 10.996 5.65062 11.1829C5.46367 11.3699 5.35864 11.6235 5.35864 11.8878V16.8723" stroke="#502181" strokeWidth="1.74455" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function HubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M1.28932 4.08864C1.28932 2.85673 1.28932 2.24077 1.56691 1.788C1.7221 1.53441 1.93488 1.32163 2.18847 1.16644C2.64044 0.888855 3.25719 0.888855 4.48911 0.888855C5.72103 0.888855 6.33699 0.888855 6.78976 1.16644C7.04335 1.32163 7.25613 1.53441 7.41132 1.788C7.6889 2.23997 7.6889 2.85673 7.6889 4.08864C7.6889 5.32056 7.6889 5.93652 7.41132 6.38929C7.25613 6.64288 7.04335 6.85566 6.78976 7.01085C6.33779 7.28843 5.72103 7.28843 4.48911 7.28843C3.25719 7.28843 2.64124 7.28843 2.18847 7.01085C1.93507 6.8557 1.72206 6.64269 1.56691 6.38929C1.28932 5.93732 1.28932 5.32056 1.28932 4.08864ZM2.31486 11.1138C3.1524 10.2762 3.57077 9.85787 4.06674 9.73787C4.34437 9.67116 4.63386 9.67116 4.91149 9.73787C5.40745 9.85787 5.82583 10.2762 6.66337 11.1138C7.50092 11.9513 7.91929 12.3697 8.03928 12.8657C8.1048 13.1434 8.1048 13.4326 8.03928 13.7104C7.91929 14.2064 7.50092 14.6256 6.66337 15.4623C5.82583 16.299 5.40745 16.7182 4.91149 16.8382C4.63386 16.9049 4.34437 16.9049 4.06674 16.8382C3.57077 16.7182 3.1524 16.2998 2.31486 15.4623C1.47731 14.6248 1.05894 14.2064 0.938947 13.7104C0.872239 13.4328 0.872239 13.1433 0.938947 12.8657C1.05894 12.3697 1.47731 11.9505 2.31486 11.1138ZM10.4887 13.688C10.4887 12.4561 10.4887 11.8401 10.7663 11.3874C10.9215 11.1338 11.1343 10.921 11.3879 10.7658C11.8398 10.4882 12.4566 10.4882 13.6885 10.4882C14.9204 10.4882 15.5364 10.4882 15.99 10.7658C16.2427 10.921 16.4555 11.1338 16.6107 11.3874C16.8883 11.8393 16.8883 12.4561 16.8883 13.688C16.8883 14.9199 16.8883 15.5359 16.6107 15.9895C16.4555 16.2423 16.2428 16.455 15.99 16.6102C15.5364 16.8878 14.9204 16.8878 13.6885 16.8878C12.4566 16.8878 11.8406 16.8878 11.3879 16.6102C11.1346 16.4553 10.9216 16.2426 10.7663 15.9895C10.4887 15.5359 10.4887 14.9199 10.4887 13.688Z" stroke="#502181" strokeWidth="1.77773"/>
      <path d="M13.6892 0.888855V7.28843M16.889 4.08864H10.4894" stroke="#502181" strokeWidth="1.77773" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M14.6706 5.8511L3.47123 0.251401C3.02925 0.0314207 2.53017 -0.0468939 2.04205 0.027135C1.55393 0.101164 1.10052 0.323934 0.743641 0.665072C0.386758 1.00621 0.143771 1.44911 0.0478083 1.9334C-0.0481545 2.41768 0.00757734 2.91978 0.207405 3.37123L2.1273 7.667C2.17086 7.77086 2.1933 7.88236 2.1933 7.99498C2.1933 8.10761 2.17086 8.2191 2.1273 8.32296L0.207405 12.6187C0.0447743 12.9841 -0.0239775 13.3843 0.00739795 13.783C0.0387734 14.1816 0.169281 14.5662 0.387061 14.9016C0.604841 15.237 0.902988 15.5127 1.25441 15.7035C1.60583 15.8944 1.99937 15.9944 2.39929 15.9945C2.77385 15.9908 3.14284 15.9033 3.47923 15.7386L14.6786 10.1389C15.0759 9.93902 15.4098 9.63274 15.6431 9.25418C15.8764 8.87561 16 8.43967 16 7.99498C16 7.55029 15.8764 7.11435 15.6431 6.73579C15.4098 6.35723 15.0759 6.05094 14.6786 5.8511H14.6706ZM13.9587 8.70694L2.75927 14.3066C2.6122 14.3772 2.44707 14.4012 2.286 14.3753C2.12493 14.3494 1.97564 14.2749 1.85813 14.1617C1.74062 14.0486 1.66051 13.9022 1.62855 13.7422C1.59659 13.5822 1.61431 13.4163 1.67933 13.2667L3.59122 8.97093C3.61597 8.91356 3.63734 8.8548 3.65522 8.79494H9.16692C9.37908 8.79494 9.58255 8.71066 9.73257 8.56064C9.88259 8.41061 9.96687 8.20714 9.96687 7.99498C9.96687 7.78282 9.88259 7.57935 9.73257 7.42933C9.58255 7.27931 9.37908 7.19502 9.16692 7.19502H3.65522C3.63734 7.13516 3.61597 7.0764 3.59122 7.01903L1.67933 2.72327C1.61431 2.57365 1.59659 2.40772 1.62855 2.24775C1.66051 2.08777 1.74062 1.94139 1.85813 1.82823C1.97564 1.71508 2.12493 1.64055 2.286 1.61465C2.44707 1.58875 2.6122 1.61271 2.75927 1.68332L13.9587 7.28302C14.0897 7.35015 14.1997 7.45214 14.2764 7.57776C14.3532 7.70338 14.3939 7.84775 14.3939 7.99498C14.3939 8.14221 14.3532 8.28658 14.2764 8.4122C14.1997 8.53782 14.0897 8.63981 13.9587 8.70694Z" fill="#502181"/>
    </svg>
  );
}

function Triangle({
  size, rotate, color, style,
}: { size: number; rotate: number; color: string; style: React.CSSProperties }) {
  return (
    <div aria-hidden style={{ position: "absolute", width: size, height: size, transform: `rotate(${rotate}deg)`, ...style }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points="50,5 95,80 5,80" fill={color} />
      </svg>
    </div>
  );
}

/* ---------- Page ---------- */

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
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

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) { setError(result.error.message || "Google sign-in failed"); return; }
      if (result.redirected) return;
      router.invalidate();
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Log-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left purple panel */}
        <aside className="relative overflow-hidden bg-[color:var(--impact-purple)] px-8 py-14 text-white lg:w-[45%] lg:px-[80px] lg:py-16 xl:px-[120px]">
          {/* Decorative triangle cluster — spread across the whole panel */}
          <Triangle size={120} rotate={-18} color="rgba(255,255,255,0.08)" style={{ top: -30, right: -20 }} />
          <Triangle size={70} rotate={35} color="rgba(244,162,97,0.55)" style={{ top: 60, right: 90 }} />
          <Triangle size={40} rotate={-40} color="rgba(33,156,158,0.75)" style={{ top: 40, right: 200 }} />

          <Triangle size={90} rotate={210} color="rgba(233,75,138,0.35)" style={{ top: "38%", left: -30 }} />
          <Triangle size={54} rotate={15} color="rgba(255,255,255,0.18)" style={{ top: "46%", left: 70 }} />

          <Triangle size={64} rotate={165} color="rgba(244,162,97,0.35)" style={{ top: "58%", right: 40 }} />
          <Triangle size={32} rotate={-25} color="rgba(255,255,255,0.28)" style={{ top: "62%", right: 130 }} />

          <Triangle size={140} rotate={200} color="rgba(0,0,0,0.18)" style={{ bottom: -40, right: -30 }} />
          <Triangle size={48} rotate={-10} color="rgba(33,156,158,0.5)" style={{ bottom: 180, left: "45%" }} />

          <div className="relative z-10 max-w-[420px]">
            <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-tight lg:text-[52px]">
              {mode === "signin" ? "Log-in to continue" : "Sign-up your council"}
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-white/85">
              {mode === "signin"
                ? "If you don't have an account, you must sign-up before proceeding."
                : "Sign-up your Local Youth Council to save assessments and revisit results anytime."}
            </p>
          </div>

          <div className="absolute bottom-8 left-8 right-8 hidden lg:left-[80px] lg:right-[80px] lg:block xl:left-[120px] xl:right-[120px]">
            <img src={cofundLogo.url} alt="Co-funded by the European Union" className="h-10 w-auto" />
            <p className="mt-4 max-w-[440px] text-[11px] leading-relaxed text-white/70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </aside>

        {/* Right form panel */}
        <section className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-[440px]">
            {/* Tab switcher */}
            <div className="grid grid-cols-2 rounded-full bg-[#f2f2f5] p-1">
              <button
                type="button"
                onClick={() => { setError(null); setMode("signin"); }}
                className={`rounded-full py-2.5 text-sm font-semibold transition ${
                  mode === "signin"
                    ? "bg-[color:var(--impact-purple)] text-white shadow-sm"
                    : "text-[color:var(--impact-ink)]/60 hover:text-[color:var(--impact-ink)]"
                }`}
              >
                Log-in
              </button>
              <button
                type="button"
                onClick={() => { setError(null); setMode("signup"); }}
                className={`rounded-full py-2.5 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-[color:var(--impact-purple)] text-white shadow-sm"
                    : "text-[color:var(--impact-ink)]/60 hover:text-[color:var(--impact-ink)]"
                }`}
              >
                Sign-up
              </button>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-black/15 bg-white py-3 text-[14px] font-bold text-[color:var(--impact-ink)] transition hover:bg-black/5 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 34.9 26.7 36 24 36c-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41.4 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
              </svg>
              Log-in with Google
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-[12px] text-[color:var(--impact-ink)]/50">or continue with email</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Field
                name="email"
                type="email"
                label="Email address"
                autoComplete="email"
                placeholder="antonio.boto@dypall.com"
              />

              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-[color:var(--impact-ink)]">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 pr-10 text-[14px] text-[color:var(--impact-ink)] outline-none placeholder:text-[color:var(--impact-ink)]/30 focus:border-[color:var(--impact-purple)] focus:ring-2 focus:ring-[color:var(--impact-purple)]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[color:var(--impact-ink)]/50 hover:text-[color:var(--impact-ink)]"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.79 19.79 0 0 1 5.06-5.94"/><path d="M1 1l22 22"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.85 19.85 0 0 1-3.17 4.19"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {mode === "signin" && (
                <div className="flex justify-end">
                  <a href="#" className="text-[13px] font-bold text-[color:var(--impact-teal,#219c9e)] hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="mt-2 w-full rounded-full bg-[color:var(--impact-purple)] py-3 text-[14px] font-bold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Please wait…" : mode === "signin" ? "Log-in" : "Sign-up"}
              </button>

              <p className="pt-1 text-center text-[13px] text-[color:var(--impact-ink)]/70">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => { setError(null); setMode(mode === "signin" ? "signup" : "signin"); }}
                  className="font-bold text-[color:var(--impact-teal,#219c9e)] hover:underline"
                >
                  {mode === "signin" ? "Sign-up" : "Log-in"}
                </button>
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  name, label, type = "text", placeholder, autoComplete,
}: { name: string; label: string; type?: string; placeholder?: string; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold text-[color:var(--impact-ink)]">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-[14px] text-[color:var(--impact-ink)] outline-none placeholder:text-[color:var(--impact-ink)]/30 focus:border-[color:var(--impact-purple)] focus:ring-2 focus:ring-[color:var(--impact-purple)]/20"
      />
    </label>
  );
}
