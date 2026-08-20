import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, LogOut, Settings, Trash2, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import logoWhite from "@/assets/IMPACT_Logo_white.png.asset.json";
import OnboardingGuideModal from "@/components/OnboardingGuideModal";

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
  avatar_url: string | null;
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
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    supabase
      .from("profiles")
      .select("full_name, council_name, country, city, council_role, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));

    supabase
      .from("assessments")
      .select("id, area, status, current_step, completed_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => setAssessments((data as AssessmentRow[]) ?? []));

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => setIsAdmin((data ?? []).some((r) => r.role === "admin")));
  }, [user.id]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this assessment? This cannot be undone.")) return;
    const { error } = await supabase.from("assessments").delete().eq("id", id);
    if (!error) setAssessments((rows) => rows.filter((r) => r.id !== id));
  };

  const firstName = (profile?.full_name || user.email || "there").split(" ")[0];
  const completed = assessments.filter((a) => a.status === "completed");
  const inProgress = assessments.filter((a) => a.status !== "completed");

  const openGuide = () => setGuideModalOpen(true);

  return (
    <div className="min-h-screen bg-[#F4F5F7] lg:flex">
      {/* Sidebar */}
      <aside className="shrink-0 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[320px] lg:overflow-y-auto lg:border-r lg:border-black/5">
        {/* Purple block */}
        <div className="bg-[color:var(--impact-purple)] px-7 pb-8 pt-7 lg:rounded-none">
          <div className="flex items-center justify-between">
            <img src={logoWhite.url} alt="IMPACT" className="h-7 w-auto" />
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                aria-label="Manage profile"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <Settings size={17} />
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                aria-label="Sign out"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 lg:hidden"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>

          <div className="mt-7 flex flex-col items-center text-center lg:mt-8">
            <div className="flex h-[86px] w-[86px] items-center justify-center overflow-hidden rounded-full bg-[#E6DCF2] text-[color:var(--impact-purple)]">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile picture" className="h-full w-full object-cover" />
              ) : (
                <User size={38} strokeWidth={1.6} />
              )}
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
          <nav className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-2">
            <QuickLink to="/" label="Home" tint="#EDE4F6" dot="var(--impact-purple)" icon="home" />
            <QuickLink to="/resource-hub" label="Resource Hub" tint="#DCEFEF" dot="var(--impact-green)" icon="resource-hub" />
            <QuickLink to="/send-us-a-message" label="Send us a message" tint="#FCE7F0" dot="var(--impact-pink)" icon="message" />
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

        <div className="hidden border-t border-black/5 px-7 py-6 lg:block">
          {isAdmin && (
            <Link
              to="/admin"
              className="mb-2 flex items-center gap-2 rounded-2xl px-3 py-3 text-[14px] font-bold text-[color:var(--impact-ink)] transition hover:bg-black/5"
            >
              <Settings size={16} />
              Admin panel
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-[14px] font-bold text-[color:var(--impact-ink-muted)] transition hover:bg-black/5 hover:text-[color:var(--impact-purple)]"
          >
            <LogOut size={16} />
            Sign out
          </button>
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

          <OnboardingGuideModal
            open={guideModalOpen}
            onClose={() => setGuideModalOpen(false)}
          />


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
  icon,
}: {
  to: string;
  label: string;
  tint: string;
  dot: string;
  icon: "home" | "resource-hub" | "message";
}) {
  const active = typeof window !== "undefined" && window.location.pathname === to;
  const stroke = "#ffffff";

  const iconSvg = {
    home: (
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden>
        <path
          d="M0.872437 8.65795C0.872437 7.30418 0.872437 6.6273 1.14558 6.03216C1.41973 5.43702 1.93312 4.99739 2.96091 4.11615L3.9578 3.26182C5.81699 1.66979 6.74409 0.872284 7.85063 0.872284C8.95717 0.872284 9.88527 1.6688 11.7435 3.26082L12.7404 4.11515C13.7671 4.9964 14.2815 5.43602 14.5547 6.03116C14.8288 6.6263 14.8288 7.30319 14.8288 8.65696V12.8847C14.8288 14.7649 14.8288 15.7039 14.2446 16.2881C13.6605 16.8723 12.7214 16.8723 10.8413 16.8723H4.85998C2.97985 16.8723 2.04079 16.8723 1.45661 16.2881C0.872436 15.7039 0.872437 14.7649 0.872437 12.8847V8.65795Z"
          stroke={stroke}
          strokeWidth="1.74455"
        />
        <path
          d="M10.3431 16.8723V11.8878C10.3431 11.6235 10.238 11.3699 10.0511 11.1829C9.86413 10.996 9.61057 10.891 9.34618 10.891H6.35553C6.09114 10.891 5.83758 10.996 5.65062 11.1829C5.46367 11.3699 5.35864 11.6235 5.35864 11.8878V16.8723"
          stroke={stroke}
          strokeWidth="1.74455"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "resource-hub": (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M1.28932 4.08864C1.28932 2.85673 1.28932 2.24077 1.56691 1.788C1.7221 1.53441 1.93488 1.32163 2.18847 1.16644C2.64044 0.888855 3.25719 0.888855 4.48911 0.888855C5.72103 0.888855 6.33699 0.888855 6.78976 1.16644C7.04335 1.32163 7.25613 1.53441 7.41132 1.788C7.6889 2.23997 7.6889 2.85673 7.6889 4.08864C7.6889 5.32056 7.6889 5.93652 7.41132 6.38929C7.25613 6.64288 7.04335 6.85566 6.78976 7.01085C6.33779 7.28843 5.72103 7.28843 4.48911 7.28843C3.25719 7.28843 2.64124 7.28843 2.18847 7.01085C1.93507 6.8557 1.72206 6.64269 1.56691 6.38929C1.28932 5.93732 1.28932 5.32056 1.28932 4.08864ZM2.31486 11.1138C3.1524 10.2762 3.57077 9.85787 4.06674 9.73787C4.34437 9.67116 4.63386 9.67116 4.91149 9.73787C5.40745 9.85787 5.82583 10.2762 6.66337 11.1138C7.50092 11.9513 7.91929 12.3697 8.03928 12.8657C8.1048 13.1434 8.1048 13.4326 8.03928 13.7104C7.91929 14.2064 7.50092 14.6256 6.66337 15.4623C5.82583 16.299 5.40745 16.7182 4.91149 16.8382C4.63386 16.9049 4.34437 16.9049 4.06674 16.8382C3.57077 16.7182 3.1524 16.2998 2.31486 15.4623C1.47731 14.6248 1.05894 14.2064 0.938947 13.7104C0.872239 13.4328 0.872239 13.1433 0.938947 12.8657C1.05894 12.3697 1.47731 11.9505 2.31486 11.1138ZM10.4887 13.688C10.4887 12.4561 10.4887 11.8401 10.7663 11.3874C10.9215 11.1338 11.1343 10.921 11.3879 10.7658C11.8398 10.4882 12.4566 10.4882 13.6885 10.4882C14.9204 10.4882 15.5364 10.4882 15.99 10.7658C16.2427 10.921 16.4555 11.1338 16.6107 11.3874C16.8883 11.8393 16.8883 12.4561 16.8883 13.688C16.8883 14.9199 16.8883 15.5359 16.6107 15.9895C16.4555 16.2423 16.2428 16.455 15.99 16.6102C15.5364 16.8878 14.9204 16.8878 13.6885 16.8878C12.4566 16.8878 11.8406 16.8878 11.3879 16.6102C11.1346 16.4553 10.9216 16.2426 10.7663 15.9895C10.4887 15.5359 10.4887 14.9199 10.4887 13.688Z"
          stroke={stroke}
          strokeWidth="1.77773"
        />
        <path
          d="M13.6892 0.888855V7.28843M16.889 4.08864H10.4894"
          stroke={stroke}
          strokeWidth="1.77773"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    message: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M14.6706 5.8511L3.47123 0.251401C3.02925 0.0314207 2.53017 -0.0468939 2.04205 0.027135C1.55393 0.101164 1.10052 0.323934 0.743641 0.665072C0.386758 1.00621 0.143771 1.44911 0.0478083 1.9334C-0.0481545 2.41768 0.00757734 2.91978 0.207405 3.37123L2.1273 7.667C2.17086 7.77086 2.1933 7.88236 2.1933 7.99498C2.1933 8.10761 2.17086 8.2191 2.1273 8.32296L0.207405 12.6187C0.0447743 12.9841 -0.0239775 13.3843 0.00739795 13.783C0.0387734 14.1816 0.169281 14.5662 0.387061 14.9016C0.604841 15.237 0.902988 15.5127 1.25441 15.7035C1.60583 15.8944 1.99937 15.9944 2.39929 15.9945C2.77385 15.9908 3.14284 15.9033 3.47923 15.7386L14.6786 10.1389C15.0759 9.93902 15.4098 9.63274 15.6431 9.25418C15.8764 8.87561 16 8.43967 16 7.99498C16 7.55029 15.8764 7.11435 15.6431 6.73579C15.4098 6.35723 15.0759 6.05094 14.6786 5.8511H14.6706ZM13.9587 8.70694L2.75927 14.3066C2.6122 14.3772 2.44707 14.4012 2.286 14.3753C2.12493 14.3494 1.97564 14.2749 1.85813 14.1617C1.74062 14.0486 1.66051 13.9022 1.62855 13.7422C1.59659 13.5822 1.61431 13.4163 1.67933 13.2667L3.59122 8.97093C3.61597 8.91356 3.63734 8.8548 3.65522 8.79494H9.16692C9.37908 8.79494 9.58255 8.71066 9.73257 8.56064C9.88259 8.41061 9.96687 8.20714 9.96687 7.99498C9.96687 7.78282 9.88259 7.57935 9.73257 7.42933C9.58255 7.27931 9.37908 7.19502 9.16692 7.19502H3.65522C3.63734 7.13516 3.61597 7.0764 3.59122 7.01903L1.67933 2.72327C1.61431 2.57365 1.59659 2.40772 1.62855 2.24775C1.66051 2.08777 1.74062 1.94139 1.85813 1.82823C1.97564 1.71508 2.12493 1.64055 2.286 1.61465C2.44707 1.58875 2.6122 1.61271 2.75927 1.68332L13.9587 7.28302C14.0897 7.35015 14.1997 7.45214 14.2764 7.57776C14.3532 7.70338 14.3939 7.84775 14.3939 7.99498C14.3939 8.14221 14.3532 8.28658 14.2764 8.4122C14.1997 8.53782 14.0897 8.63981 13.9587 8.70694Z"
          fill={stroke}
        />
      </svg>
    ),
  };

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
        {iconSvg[icon]}
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
