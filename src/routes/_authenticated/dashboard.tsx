import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo_color_impact.png.asset.json";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — IMPACT" },
      { name: "description", content: "Your IMPACT dashboard: assessments, results and action plans for your Local Youth Council." },
      { property: "og:title", content: "Dashboard — IMPACT" },
      { property: "og:description", content: "Your IMPACT dashboard: assessments, results and action plans for your Local Youth Council." },
    ],
  }),
  component: Dashboard,
});

type Profile = {
  full_name: string | null;
  council_name: string | null;
  country: string | null;
  city: string | null;
  council_role: string | null;
};

function Dashboard() {
  const { user } = Route.useRouteContext() as { user: { id: string; email?: string } };
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("profiles")
      .select("full_name, council_name, country, city, council_role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => setIsAdmin((data ?? []).some((r) => r.role === "admin")));
  }, [user.id]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  const displayName = profile?.full_name || user.email || "there";

  return (
    <div className="min-h-screen bg-[color:var(--impact-cream,#faf6ef)]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={logoAsset.url} alt="IMPACT" className="h-10" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[color:var(--impact-ink)]/70 sm:inline">
              {user.email}
            </span>
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex h-10 items-center rounded-full bg-[color:var(--impact-purple)] px-4 text-sm font-semibold text-white hover:opacity-90"
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="inline-flex h-10 items-center rounded-full border border-black/10 px-4 text-sm font-semibold text-[color:var(--impact-ink)] hover:bg-black/5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="rounded-3xl bg-[color:var(--impact-purple)] px-8 py-10 text-white">
          <p className="text-sm opacity-80">Welcome</p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Hi {displayName} 👋</h1>
          {profile?.council_name && (
            <p className="mt-2 text-white/85">
              {profile.council_name}
              {profile.city ? ` · ${profile.city}` : ""}
              {profile.country ? `, ${profile.country}` : ""}
            </p>
          )}
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-[color:var(--impact-ink)]">Your assessments</h2>
          <div className="mt-4 rounded-2xl border border-dashed border-black/15 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--impact-teal)]/15 text-[color:var(--impact-teal)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3 8-8" /><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[color:var(--impact-ink)]">No assessments yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[color:var(--impact-ink)]/70">
              The self-assessment questionnaire is on its way. Once available, your results and action plans will appear here for you to revisit and share.
            </p>
            <button
              disabled
              className="mt-6 inline-flex items-center rounded-full bg-[color:var(--impact-purple)]/40 px-5 py-2.5 text-sm font-bold text-white"
            >
              Start assessment — coming soon
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
