import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Settings, Trash2, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import ctaImg from "@/assets/cta-photo.webp.asset.json";

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
  const totals = { done: completed.length, plans: 0 };
  const perArea: Record<AreaDef["key"], number> = {
    representativeness: 0,
    governance: 0,
    empowerment: 0,
    results: 0,
  };
  for (const a of completed) {
    if (a.area in perArea) perArea[a.area] += 1;
  }


  return (
    <div className="min-h-screen bg-[color:var(--impact-surface-muted,#f4f7f7)] px-6 pb-16 pt-8 lg:px-12">
      <div className="mx-auto max-w-[1280px] space-y-8">
        {/* Hero pill */}
        <section className="overflow-hidden rounded-[40px] bg-[color:var(--impact-purple)] p-8 lg:p-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            {/* Greeting */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/25 text-white">
                <User size={38} strokeWidth={1.5} />
              </div>
              <h1 className="mt-5 text-[26px] font-extrabold leading-tight text-white">
                Hi, {firstName} 👋
              </h1>
              <p className="mt-1 text-[14px] text-white/75">How do you feel today?</p>
              <Link
                to="/profile"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-white/30"
              >
                <Settings size={16} />
                Manage profile
              </Link>
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
        <section className="max-w-[1280px]">
          <div className="flex flex-col items-center gap-6 overflow-hidden rounded-[40px] bg-[color:var(--impact-purple)] p-8 text-white shadow-xl md:flex-row md:p-12">
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
        <section className="py-6">
          <h2 className="text-[32px] font-extrabold text-[color:var(--impact-purple)]">Start Your Assessment</h2>
          <p className="mt-2 max-w-2xl text-[14px] text-[color:var(--impact-ink-muted)]">
            Choose a thematic area to launch a self-assessment. You can revisit past questionnaires and build action plans as you go.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
        </section>
      </div>
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

      <Link
        to="/questionnaire/$area"
        params={{ area: area.key }}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-[14px] font-bold text-white transition hover:opacity-90"
        style={{ backgroundColor: area.color }}
      >
        Start a new assessment
      </Link>


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
        <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-black/5">
          <div
            className="flex items-center justify-between gap-3 px-4 py-3"
            style={{ backgroundColor: area.softBg }}
          >
            <span
              className="inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-bold"
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
                <li
                  key={it.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
                >
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
                          className="rounded-full border-2 px-4 py-2 text-[12px] font-bold transition hover:opacity-80"
                          style={{ borderColor: area.color, color: area.color }}
                        >
                          See results
                        </Link>
                        <button
                          type="button"
                          className="rounded-full px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90"
                          style={{ backgroundColor: area.color }}
                        >
                          + New action plan
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/questionnaire/$area"
                        params={{ area: area.key }}
                        className="rounded-full border-2 px-4 py-2 text-[12px] font-bold transition"
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
