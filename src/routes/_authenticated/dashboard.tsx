import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Settings, Trash2, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import logoWhite from "@/assets/IMPACT_Logo_white.png.asset.json";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Assessments — IMPACT" },
      { name: "description", content: "Your IMPACT assessments: results, progress and action plans for your Local Youth Council." },
      { property: "og:title", content: "My Assessments — IMPACT" },
      { property: "og:description", content: "Your IMPACT assessments: results, progress and action plans for your Local Youth Council." },
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
  panelBg: string;
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
    panelBg: "#F4F1F7",
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
    panelBg: "#FBF3EA",
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
    panelBg: "#FCEFF4",
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
    panelBg: "#EDF5F5",
  },
];

const GUIDE_STEPS: { n: number; title: string; body: string; color: string }[] = [
  {
    n: 1,
    title: "Create your account",
    body: "Your council's results, action plans and reflections are stored securely in one place.",
    color: "var(--impact-purple)",
  },
  {
    n: 2,
    title: "Pick a focus area",
    body: "Choose one of the IMPACT thematic areas below to start with, or work through them all.",
    color: "var(--impact-orange)",
  },
  {
    n: 3,
    title: "Answer the questionnaire",
    body: "It takes 15–30 minutes and you can save your progress and quit at any point.",
    color: "var(--impact-green)",
  },
  {
    n: 4,
    title: "Review your results",
    body: "Get a visual scoreboard and reflection prompts — edit your answers anytime to update them.",
    color: "var(--impact-pink)",
  },
];

type AssessmentRow = {
  id: string;
  area: AreaDef["key"];
  status: string;
  current_step: number;
  completed_at: string | null;
  updated_at: string;
};

function Dashboard() {
  const { user } = Route.useRouteContext() as { user: { id: string; email?: string } };
  const [profile, setProfile] = useState<Profile | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [guideOpen, setGuideOpen] = useState(false);
  const guideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("full_name, council_name, country, city, council_role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));

    supabase
      .from("assessments")
      .select("id, area, status, current_step, completed_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => setAssessments((data as AssessmentRow[]) ?? []));
  }, [user.id]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this assessment? This cannot be undone.")) return;
    const { error } = await supabase.from("assessments").delete().eq("id", id);
    if (!error) setAssessments((rows) => rows.filter((r) => r.id !== id));
  };

  const firstName = (profile?.full_name || user.email || "there").split(" ")[0];
  const completed = assessments.filter((a) => a.status === "completed");
  const inProgress = assessments.filter((a) => a.status !== "completed");

  const openGuide = () => {
    setGuideOpen(true);
    requestAnimationFrame(() =>
      guideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] lg:flex">
      {/* Sidebar */}
      <aside className="shrink-0 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[320px] lg:overflow-y-auto lg:border-r lg:border-black/5">
        {/* Purple block */}
        <div className="bg-[color:var(--impact-purple)] px-7 pb-8 pt-7 lg:rounded-none">
          <div className="flex items-center justify-between">
            <img src={logoWhite.url} alt="IMPACT" className="h-7 w-auto" />
            <Link
              to="/profile"
              aria-label="Manage profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <Settings size={17} />
            </Link>
          </div>

          <div className="mt-7 flex flex-col items-center text-center lg:mt-8">
            <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#E6DCF2] text-[color:var(--impact-purple)]">
              <User size={38} strokeWidth={1.6} />
            </div>
            <h1 className="mt-4 text-[20px] font-extrabold leading-tight text-white">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-1 text-[13px] text-white/70">How do you feel today?</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[color:var(--impact-green)] px-3 py-4 text-center text-white">
              <p className="text-[24px] font-extrabold leading-none">{completed.length}</p>
              <p className="mt-1.5 text-[11px] leading-tight text-white/85">Questionnaires done</p>
            </div>
            <div className="rounded-2xl bg-[color:var(--impact-green)] px-3 py-4 text-center text-white">
              <p className="text-[24px] font-extrabold leading-none">{inProgress.length}</p>
              <p className="mt-1.5 text-[11px] leading-tight text-white/85">In progress</p>
            </div>
          </div>
        </div>

        {/* White block */}
        <div className="border-b border-black/5 px-7 py-7">
          <button
            type="button"
            onClick={openGuide}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[color:var(--impact-green)] px-5 py-4 text-[15px] font-bold text-white transition hover:opacity-90"
          >
            <svg width="20" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            How to start assessing?
          </button>

          <h2 className="mt-8 text-[16px] font-extrabold text-[color:var(--impact-ink)]">
            Quick Links
          </h2>
          <nav className="mt-4 space-y-2">
            <QuickLink to="/" label="Home" tint="#EDE4F6" dot="var(--impact-purple)" />
            <QuickLink to="/resource-hub" label="Resource Hub" tint="#DCEFEF" dot="var(--impact-green)" />
            <QuickLink to="/send-us-a-message" label="Send us a message" tint="#FCE7F0" dot="var(--impact-pink)" />
          </nav>
        </div>

        <div className="px-7 py-7">
          <h2 className="text-[16px] font-extrabold text-[color:var(--impact-ink)]">
            Recent Activity
          </h2>
          {assessments.length === 0 ? (
            <p className="mt-3 text-[13px] text-[color:var(--impact-ink-muted)]">
              No activity yet — start your first questionnaire.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {assessments.slice(0, 4).map((it) => {
                const a = AREAS.find((x) => x.key === it.area);
                return (
                  <li key={it.id} className="flex gap-3">
                    <span
                      className="mt-[7px] h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: a?.color ?? "var(--impact-purple)" }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-[color:var(--impact-ink)]">
                        {a?.title ?? it.area}
                      </p>
                      <p className="text-[12px] text-[color:var(--impact-ink-muted)]">
                        {it.status === "completed" ? "Completed" : "In progress"} ·{" "}
                        {new Date(it.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 px-5 pb-24 pt-8 lg:px-12 lg:pb-16 lg:pt-10">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="text-[30px] font-extrabold leading-tight text-[color:var(--impact-purple)] lg:text-[38px]">
            Start Your Assessment
          </h2>
          <p className="mt-2 max-w-3xl text-[15px] text-[color:var(--impact-ink-muted)]">
            Choose a thematic area to launch a self-assessment. You can pause anytime, revisit past
            questionnaires and build action plans as you go.
          </p>

          {/* Beginner guide */}
          <div ref={guideRef} className="scroll-mt-6">
            {guideOpen && (
              <section className="mt-8 rounded-[32px] bg-white p-6 shadow-[0_2px_14px_rgba(0,0,0,0.05)] ring-1 ring-black/5 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-[#EDE4F6] px-3 py-1 text-[11px] font-bold tracking-wide text-[color:var(--impact-purple)]">
                      BEGINNER GUIDE
                    </span>
                    <h3 className="mt-3 text-[24px] font-extrabold leading-tight text-[color:var(--impact-purple)]">
                      How to start assessing?
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuideOpen(false)}
                    className="rounded-full px-3 py-1 text-[13px] font-bold text-[color:var(--impact-ink-muted)] hover:bg-black/5"
                  >
                    Hide
                  </button>
                </div>

                <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {GUIDE_STEPS.map((s) => (
                    <li key={s.n} className="rounded-3xl bg-[#F4F5F7] p-5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-[40px] w-[44px] shrink-0">
                          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                            <path
                              d="M50,8 L90,80 L10,80 Z"
                              fill={s.color}
                              stroke={s.color}
                              strokeWidth="10"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center pt-1 text-[15px] font-bold text-white">
                            {s.n}
                          </span>
                        </div>
                        <h4 className="text-[15px] font-bold leading-tight text-[color:var(--impact-ink)]">
                          {s.title}
                        </h4>
                      </div>
                      <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--impact-ink-muted)]">
                        {s.body}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          <div className="mt-8 space-y-6">
            {AREAS.map((a) => (
              <AreaCard
                key={a.key}
                area={a}
                items={assessments.filter((x) => x.area === a.key)}
                expanded={!!expanded[a.key]}
                onToggle={() => setExpanded((e) => ({ ...e, [a.key]: !e[a.key] }))}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickLink({
  to,
  label,
  tint,
  dot,
}: {
  to: string;
  label: string;
  tint: string;
  dot: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[14px] font-bold text-[color:var(--impact-ink)] transition hover:brightness-95"
      style={{ backgroundColor: tint }}
    >
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: dot }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
      {label}
    </Link>
  );
}

function AreaCard({
  area,
  items,
  expanded,
  onToggle,
  onDelete,
}: {
  area: AreaDef;
  items: AssessmentRow[];
  expanded: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article
      className="rounded-[32px] p-6 md:p-8"
      style={{ backgroundColor: area.panelBg }}
    >
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide"
        style={{ backgroundColor: area.softBg, color: area.softText }}
      >
        {area.badge}
      </span>
      <h3 className="mt-4 text-[22px] font-extrabold text-[color:var(--impact-ink)]">
        {area.title}
      </h3>
      <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[color:var(--impact-ink-muted)]">
        {area.description}
      </p>

      <Link
        to="/questionnaire/$area"
        params={{ area: area.key }}
        className="mt-5 inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[15px] font-bold text-white transition hover:opacity-90"
        style={{ backgroundColor: area.color }}
      >
        Start a new assessment
      </Link>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="mt-5 flex w-full items-center justify-center text-[color:var(--impact-ink-muted)] hover:text-[color:var(--impact-purple)]"
      >
        <ChevronDown size={20} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="mt-3 overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
          <div
            className="flex items-center justify-between gap-3 px-4 py-3"
            style={{ backgroundColor: area.softBg }}
          >
            <span
              className="inline-flex items-center rounded-full border bg-white/60 px-3 py-1 text-[12px] font-bold"
              style={{ borderColor: area.softText, color: area.softText }}
            >
              Completed questionnaires ({items.filter((i) => i.status === "completed").length})
            </span>
          </div>

          {items.length === 0 ? (
            <p className="bg-white p-4 text-center text-[13px] text-[color:var(--impact-ink-muted)]">
              There are no questionnaires done on this area yet.
            </p>
          ) : (
            <ul className="divide-y divide-black/5 bg-white">
              {items.map((it, idx) => (
                <li key={it.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                  <div className="min-w-0">
                    <p className="text-[15px] font-extrabold text-[color:var(--impact-ink)]">
                      Assessment {idx + 1}
                    </p>
                    <p className="text-[12px] text-[color:var(--impact-ink-muted)]">
                      Last updated:{" "}
                      {new Date(it.completed_at ?? it.updated_at).toLocaleString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {it.status === "completed" ? (
                      <>
                        <Link
                          to="/results/$id"
                          params={{ id: it.id }}
                          className="rounded-full border-2 bg-white px-4 py-2 text-[12px] font-bold transition hover:opacity-80"
                          style={{ borderColor: area.color, color: area.color }}
                        >
                          See results
                        </Link>
                        <Link
                          to="/questionnaire/$area"
                          params={{ area: area.key }}
                          search={{ id: it.id }}
                          className="rounded-full px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90"
                          style={{ backgroundColor: area.color }}
                        >
                          Edit answers
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/questionnaire/$area"
                        params={{ area: area.key }}
                        search={{ id: it.id }}
                        className="rounded-full border-2 bg-white px-4 py-2 text-[12px] font-bold transition"
                        style={{ borderColor: area.color, color: area.color }}
                      >
                        Continue
                      </Link>
                    )}

                    <button
                      type="button"
                      aria-label={`Delete assessment ${idx + 1}`}
                      onClick={() => onDelete(it.id)}
                      className="rounded-full p-2 text-[color:var(--impact-ink-muted)] transition hover:bg-black/5 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
