import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Settings, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoColor from "@/assets/logo_color_impact.png.asset.json";
import ctaImg from "@/assets/cta-photo.webp.asset.json";

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

type AreaDef = {
  key: "representativeness" | "governance" | "empowerment" | "results";
  badge: string;
  title: string;
  description: string;
  color: string;
  softBg: string;
  softText: string;
};

const AREAS: AreaDef[] = [
  {
    key: "representativeness",
    badge: "AREA 1",
    title: "Representativeness and Inclusion",
    description:
      "Who is part of the LYC, how representative it is of local youth, and how inclusive and accessible participation is for all.",
    color: "var(--impact-purple)",
    softBg: "#EDE4F6",
    softText: "var(--impact-purple)",
  },
  {
    key: "governance",
    badge: "AREA 2",
    title: "Governance and Transparency",
    description:
      "How the LYC is organised, how decisions are made, and how open and accountable it is to youth and the community.",
    color: "var(--impact-orange)",
    softBg: "#FDE6CE",
    softText: "#B85E10",
  },
  {
    key: "empowerment",
    badge: "AREA 3",
    title: "Empowerment and Resources",
    description:
      "The skills, support and resources available to members so they can act with confidence and continuity.",
    color: "var(--impact-pink)",
    softBg: "#FBD9E7",
    softText: "#B32565",
  },
  {
    key: "results",
    badge: "AREA 4",
    title: "Results and Impact",
    description:
      "What the LYC achieves, how it measures change, and the visible impact on young people and local policies.",
    color: "var(--impact-green)",
    softBg: "#D3EDEE",
    softText: "var(--impact-green)",
  },
];

function TopNav({ email, isAdmin, onSignOut }: { email?: string; isAdmin: boolean; onSignOut: () => void }) {
  const pillBase =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold transition";
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-12">
        <Link to="/" className="flex items-center">
          <img src={logoColor.url} alt="IMPACT" className="h-9 w-auto" />
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/_authenticated/dashboard" className={`${pillBase} bg-[color:var(--impact-purple)] text-white`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>
            Home
          </Link>
          <Link to="/resource-hub" className={`${pillBase} text-[color:var(--impact-ink)] hover:bg-[color:var(--impact-surface-muted)]`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Resource Hub
          </Link>
          <Link to="/send-us-a-message" className={`${pillBase} text-[color:var(--impact-ink)] hover:bg-[color:var(--impact-surface-muted)]`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            Send us a message
          </Link>
          {isAdmin && (
            <Link to="/admin" title="Admin" className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--impact-surface-muted)] text-[color:var(--impact-ink)] hover:bg-[color:var(--impact-purple)] hover:text-white">
              <Settings size={16} />
            </Link>
          )}
          <button
            onClick={onSignOut}
            title={email ?? "Sign out"}
            className="ml-1 inline-flex h-10 items-center rounded-full bg-[color:var(--impact-surface-muted)] px-3 text-[13px] font-semibold text-[color:var(--impact-ink)] hover:bg-[color:var(--impact-purple)] hover:text-white"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}

function Dashboard() {
  const { user } = Route.useRouteContext() as { user: { id: string; email?: string } };
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
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

  const firstName = (profile?.full_name || user.email || "there").split(" ")[0];

  // Real data — none until questionnaire feature ships.
  const totals = { done: 0, plans: 0 };
  const perArea: Record<AreaDef["key"], number> = {
    representativeness: 0,
    governance: 0,
    empowerment: 0,
    results: 0,
  };

  return (
    <div className="min-h-screen bg-[color:var(--impact-surface-muted,#f4f7f7)]">
      <TopNav email={user.email} isAdmin={isAdmin} onSignOut={handleSignOut} />

      {/* Hero band */}
      <section className="bg-[color:var(--impact-purple)] pb-16 pt-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-6 lg:grid-cols-[260px_1fr] lg:px-12">
          {/* Greeting */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/25 text-white">
              <User size={38} strokeWidth={1.5} />
            </div>
            <h1 className="mt-5 text-[26px] font-extrabold leading-tight text-white">
              Hi, {firstName} 👋
            </h1>
            <p className="mt-1 text-[14px] text-white/75">How do you feel today?</p>
          </div>

          {/* Progress summary card */}
          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
            <p className="mb-4 text-center text-[15px] font-semibold text-white">My Progress Summary</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1.6fr]">
              <StatTile value={totals.done} label="Questionnaires done" />
              <StatTile value={totals.plans} label="Action plans built" />
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="mb-3 text-center text-[13px] font-semibold text-white">Questionnaires per Area</p>
                <div className="grid grid-cols-2 gap-2">
                  {AREAS.map((a) => (
                    <div
                      key={a.key}
                      className="rounded-xl px-3 py-2 text-center"
                      style={{ backgroundColor: a.softBg }}
                    >
                      <p className="text-[11px] font-semibold leading-tight" style={{ color: a.softText }}>
                        {a.title}
                      </p>
                      <p className="mt-1 text-[22px] font-extrabold" style={{ color: a.softText }}>
                        {perArea[a.key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA guide banner */}
      <section className="mx-auto -mt-8 mb-10 max-w-[1280px] px-6 lg:px-12">
        <div className="flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-[color:var(--impact-purple)] p-8 text-white shadow-xl md:flex-row md:p-12">
          <div className="flex-1">
            <h2 className="text-[24px] font-extrabold">How to start assessing?</h2>
            <p className="mt-2 max-w-xl text-[14px] text-white/80">
              Follow our step-by-step guide to complete your first assessment and get personalized recommendations.
            </p>
          </div>
          <a
            href="/#how"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[14px] font-bold text-[color:var(--impact-purple)] transition hover:bg-white/90"
          >
            Start the guide →
          </a>
          <img
            src={ctaImg.url}
            alt=""
            className="hidden h-[130px] w-[220px] rounded-2xl object-cover md:block"
          />
        </div>
      </section>

      {/* Assessments */}
      <section className="mx-auto max-w-[1280px] px-6 py-14 lg:px-12">
        <h2 className="text-[32px] font-extrabold text-[color:var(--impact-purple)]">Start Your Assessment</h2>
        <p className="mt-2 max-w-2xl text-[14px] text-[color:var(--impact-ink-muted)]">
          Choose a thematic area to launch a self-assessment. You can revisit past questionnaires and build action plans as you go.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {AREAS.map((a) => (
            <AreaCard
              key={a.key}
              area={a}
              expanded={!!expanded[a.key]}
              onToggle={() => setExpanded((e) => ({ ...e, [a.key]: !e[a.key] }))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col justify-center rounded-2xl bg-white/15 p-4 text-center">
      <p className="text-[44px] font-extrabold leading-none text-white">{value}</p>
      <p className="mt-2 text-[13px] text-white/80">{label}</p>
    </div>
  );
}

function AreaCard({
  area,
  expanded,
  onToggle,
}: {
  area: AreaDef;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-3xl bg-white p-7 shadow-[0_2px_10px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide"
        style={{ backgroundColor: area.softBg, color: area.softText }}
      >
        {area.badge}
      </span>
      <h3 className="mt-4 text-[20px] font-bold text-[color:var(--impact-ink)]">{area.title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--impact-ink-muted)]">
        {area.description}
      </p>

      <button
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-[14px] font-bold text-white transition hover:opacity-90"
        style={{ backgroundColor: area.color }}
      >
        Start a New Questionnaire
      </button>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="mt-4 flex w-full items-center justify-center text-[color:var(--impact-ink-muted)] hover:text-[color:var(--impact-purple)]"
      >
        <ChevronDown
          size={20}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="mt-3 rounded-2xl border border-dashed border-black/10 bg-[color:var(--impact-surface-muted,#f4f7f7)] p-5 text-center text-[13px] text-[color:var(--impact-ink-muted)]">
          There are no questionnaires done on this area yet.
        </div>
      )}
    </article>
  );
}
