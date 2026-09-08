import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Box,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Target,
  Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AREAS } from "@/components/questionnaire/content";
import { themeForArea } from "@/components/questionnaire/theme";
import {
  PROGRESS_OPTIONS,
  loadActionPlan,
  saveActionPlan,
  type ActionPlanStep,
} from "@/lib/action-plan";

export const Route = createFileRoute("/_authenticated/action-plan/$assessmentId")({
  head: () => ({
    meta: [
      { title: "Action Plan builder — IMPACT" },
      {
        name: "description",
        content:
          "Turn the action steps selected in your IMPACT assessment into a structured action plan for your Local Youth Council.",
      },
      { property: "og:title", content: "Action Plan builder — IMPACT" },
      {
        property: "og:description",
        content:
          "Turn the action steps selected in your IMPACT assessment into a structured action plan for your Local Youth Council.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActionPlanPage,
});

const TABS = [
  { key: "intro", label: "Introduction", icon: Lightbulb },
  { key: "model", label: "Goal & Steps", icon: Target },
  { key: "steps", label: "Action Steps", icon: ListChecks },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function ActionPlanPage() {
  const { assessmentId } = Route.useParams();
  const [areaKey, setAreaKey] = useState("representativeness");
  const [tab, setTab] = useState<TabKey>("intro");
  const [goal, setGoal] = useState("");
  const [steps, setSteps] = useState<ActionPlanStep[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const skipSave = useRef(true);

  const theme = themeForArea(areaKey);
  const area = AREAS[areaKey] ?? AREAS["representativeness"]!;

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("assessments")
        .select("area")
        .eq("id", assessmentId)
        .maybeSingle();
      const plan = await loadActionPlan(assessmentId);
      if (!active) return;
      if (data?.area) setAreaKey(data.area as string);
      if (plan) {
        setModel(plan.model);
        setGoal(plan.goal);
        setSteps(plan.steps);
      }
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [assessmentId]);

  // Autosave
  useEffect(() => {
    if (!loaded) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    setSaving(true);
    const t = setTimeout(async () => {
      await saveActionPlan(assessmentId, areaKey, { model, goal, steps });
      setSaving(false);
    }, 700);
    return () => clearTimeout(t);
  }, [model, goal, steps, loaded, assessmentId, areaKey]);

  const grouped = useMemo(() => {
    const map = new Map<string, ActionPlanStep[]>();
    for (const s of steps) {
      const list = map.get(s.indicator) ?? [];
      list.push(s);
      map.set(s.indicator, list);
    }
    return [...map.entries()];
  }, [steps]);

  const update = (id: string, patch: Partial<ActionPlanStep>) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const tabIndex = TABS.findIndex((t) => t.key === tab);
  const current = steps[activeStep];

  const Tabs = () => (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {TABS.map((t) => {
        const Icon = t.icon;
        const on = t.key === tab;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition"
            style={
              on
                ? { backgroundColor: theme.accent, color: "#fff" }
                : { backgroundColor: "#fff", color: theme.accent, border: `1px solid ${theme.border}` }
            }
          >
            <Icon size={14} /> {t.label}
          </button>
        );
      })}
    </div>
  );

  const BackLink = () => (
    <Link
      to="/results/$id"
      params={{ id: assessmentId }}
      className="inline-flex items-center gap-2 text-[13px] font-bold text-[#374151] transition hover:opacity-70"
    >
      <ArrowLeft size={16} /> Back to Results
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFB] pb-24">
      <div className="mx-auto max-w-[1080px] px-4 pt-6 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <BackLink />
          <span className="text-[11px] font-semibold text-[#9ca3af]">
            {saving ? "Saving…" : loaded ? "All changes saved" : "Loading…"}
          </span>
        </div>

        <div className="mt-6">
          <Tabs />
        </div>

        <div className="mt-6">
          {tab === "intro" && <Introduction accent={theme.accent} />}

          {tab === "model" && (
            <ModelAndGoal
              accent={theme.accent}
              soft={theme.soft}
              border={theme.border}
              areaName={area.name}
              model={model}
              setModel={setModel}
              goal={goal}
              setGoal={setGoal}
              grouped={grouped}
            />
          )}

          {tab === "steps" && (
            <ActionSteps
              accent={theme.accent}
              soft={theme.soft}
              border={theme.border}
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              current={current}
              update={update}
              assessmentId={assessmentId}
            />
          )}
        </div>

        <div className="mt-6">
          <Tabs />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            disabled={tabIndex === 0}
            onClick={() => setTab(TABS[Math.max(0, tabIndex - 1)]!.key)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[12px] font-semibold text-[#374151] transition hover:bg-[#F6F6F8] disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-[12px] text-[#6b7280]">{tabIndex + 1} / {TABS.length}</span>
          <button
            type="button"
            disabled={tabIndex === TABS.length - 1}
            onClick={() => setTab(TABS[Math.min(TABS.length - 1, tabIndex + 1)]!.key)}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: theme.accent }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>

        <div className="mt-8">
          <BackLink />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Introduction ------------------------------- */

function Introduction({ accent }: { accent: string }) {
  return (
    <section className="rounded-3xl p-8 md:p-12" style={{ backgroundColor: accent }}>
      <h1 className="text-center text-[30px] font-extrabold tracking-tight text-[#f4a261]">ACTION PLAN</h1>
      <div className="mx-auto mt-6 max-w-[720px] space-y-4 rounded-2xl bg-white/10 p-6 text-[13px] leading-relaxed text-white md:p-8">
        <p>
          This is a template for an <strong>ACTION PLAN</strong>, designed to help you move from assessment to
          implementation as you begin to strengthen youth engagement in your Local Youth Council.
        </p>
        <p>
          Based on your answers to the IMPACT self-assessment, you selected up to three recommended action steps per
          indicator. Those steps have been imported here automatically.
        </p>
        <p>
          This template supports you in planning concrete steps. It helps you organise <strong>what</strong> needs to be
          done, <strong>who</strong> will be involved, <strong>when</strong> each step should happen, what{" "}
          <strong>resources</strong> you need, and how you will measure <strong>progress</strong>.
        </p>
        <p>
          We recommend involving all relevant stakeholders (young people, staff members, municipality representatives,
          etc.) in completing this plan.
        </p>
      </div>
      <div className="mt-8 flex justify-center">
        <span className="rounded-xl bg-[#f4a261] px-6 py-3 text-[13px] font-extrabold text-[#1f2937]">
          GOOD LUCK WITH THE IMPLEMENTATION!
        </span>
      </div>
    </section>
  );
}

/* ------------------------------- Model & Goal -------------------------------- */

function ModelAndGoal({
  accent,
  soft,
  border,
  areaName,
  model,
  setModel,
  goal,
  setGoal,
  grouped,
}: {
  accent: string;
  soft: string;
  border: string;
  areaName: string;
  model: string;
  setModel: (v: string) => void;
  goal: string;
  setGoal: (v: string) => void;
  grouped: [string, ActionPlanStep[]][];
}) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5 md:p-8">
      <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: accent }}>
        {areaName}
      </p>

      <div className="mt-5 rounded-2xl p-5 md:p-6" style={{ backgroundColor: soft, border: `1px solid ${border}` }}>
        <p className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wide" style={{ color: accent }}>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f4a261] text-[#1f2937]">
            <Target size={15} />
          </span>
          Model of youth engagement
        </p>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-4 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[14px] font-bold text-[#111827]"
        >
          <option value="">Select a model…</option>
          {ENGAGEMENT_MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 rounded-2xl p-5 md:p-6" style={{ backgroundColor: soft, border: `1px solid ${border}` }}>
        <p className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wide" style={{ color: accent }}>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f4a261] text-[#1f2937]">
            <Lightbulb size={15} />
          </span>
          Goal
        </p>
        <textarea
          value={goal}
          maxLength={300}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="A clear statement of the overall objective the action plan aims to achieve."
          className="mt-4 h-28 w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[13px] text-[#111827] placeholder:italic placeholder:text-[#9ca3af]"
        />
        <p className="mt-1 text-right text-[11px] font-semibold" style={{ color: accent }}>
          {goal.length}/300
        </p>
        <p className="mt-2 text-[12px] italic text-[#6b7280]">
          E.g. To establish a Youth Advisory Board within my municipality by the end of 2026
        </p>
      </div>

      <div className="mt-5 rounded-2xl p-5 md:p-6" style={{ backgroundColor: soft, border: `1px solid ${border}` }}>
        <p className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wide" style={{ color: accent }}>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f4a261] text-[#1f2937]">
            <ListChecks size={15} />
          </span>
          Indicators & selected action steps
        </p>
        {grouped.length === 0 ? (
          <p className="mt-4 text-[13px] text-[#6b7280]">
            You have not selected any action steps yet. Go back to your results and tick up to 3 recommended steps per
            indicator — they will appear here automatically.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {grouped.map(([indicator, list]) => (
              <div key={indicator} className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                <p className="text-[13px] font-extrabold" style={{ color: accent }}>
                  {indicator}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {list.map((s) => (
                    <li key={s.id} className="flex items-start gap-2 text-[12px] leading-snug text-[#374151]">
                      <Check size={14} className="mt-[2px] shrink-0" style={{ color: accent }} />
                      <span className={s.included ? "font-semibold text-[#111827]" : "text-[#9ca3af]"}>{s.action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------- Action Steps -------------------------------- */

function Field({
  label,
  hint,
  accent,
  children,
  count,
}: {
  label: string;
  hint?: string;
  accent: string;
  children: React.ReactNode;
  count?: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F6F6F8] p-4 md:p-5">
      <p className="text-[12px] font-extrabold uppercase tracking-wide" style={{ color: accent }}>
        {label}
      </p>
      {hint && <p className="mt-1 text-[12px] font-semibold text-[#374151]">{hint}</p>}
      <div className="mt-2">{children}</div>
      {count && (
        <p className="mt-1 text-right text-[11px] font-semibold" style={{ color: accent }}>
          {count}
        </p>
      )}
    </div>
  );
}

function ActionSteps({
  accent,
  soft,
  border,
  steps,
  activeStep,
  setActiveStep,
  current,
  update,
  assessmentId,
}: {
  accent: string;
  soft: string;
  border: string;
  steps: ActionPlanStep[];
  activeStep: number;
  setActiveStep: (i: number) => void;
  current?: ActionPlanStep;
  update: (id: string, patch: Partial<ActionPlanStep>) => void;
  assessmentId: string;
}) {
  const inputCls =
    "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[13px] text-[#111827] placeholder:italic placeholder:text-[#9ca3af]";

  if (steps.length === 0) {
    return (
      <section className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
        <p className="text-[14px] font-bold text-[#111827]">No action steps yet</p>
        <p className="mx-auto mt-2 max-w-[420px] text-[13px] text-[#6b7280]">
          Select up to 3 recommended action steps per indicator on your results page and they will be imported here.
        </p>
        <Link
          to="/results/$id"
          params={{ id: assessmentId }}
          className="mt-5 inline-flex rounded-full px-5 py-2.5 text-[12px] font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          Go to my results
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5 md:p-8">
      {/* Step selector bar */}
      <div className="flex flex-wrap gap-2">
        {steps.map((s, i) => {
          const on = i === activeStep;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(i)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition"
              style={
                on
                  ? { backgroundColor: accent, color: "#fff" }
                  : { backgroundColor: soft, color: accent, border: `1px solid ${border}`, opacity: s.included ? 1 : 0.5 }
              }
            >
              <span
                className="grid h-4 w-4 place-items-center rounded-full border"
                style={{ borderColor: on ? "#fff" : accent, backgroundColor: s.included ? (on ? "#fff" : accent) : "transparent" }}
              >
                {s.included && <Check size={10} color={on ? accent : "#fff"} />}
              </span>
              Action step {i + 1}
            </button>
          );
        })}
      </div>

      {current && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4" style={{ backgroundColor: soft }}>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: accent }}>
                {current.indicator}
              </p>
              <p className="mt-1 text-[13px] font-bold text-[#111827]">{current.action}</p>
            </div>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[12px] font-semibold text-[#374151]">
              <input
                type="checkbox"
                checked={current.included}
                onChange={(e) => update(current.id, { included: e.target.checked })}
                style={{ accentColor: accent }}
                className="h-[15px] w-[15px]"
              />
              Include in my plan
            </label>
          </div>

          <Field label="What?" hint="Action step" accent={accent} count={`${current.what.length}/120`}>
            <textarea
              value={current.what}
              maxLength={120}
              onChange={(e) => update(current.id, { what: e.target.value })}
              placeholder="E.g. Identify goals and objectives of the Youth Advisory Board"
              className={`${inputCls} h-20 resize-none`}
            />
          </Field>

          <Field label="How?" hint="Description of the action" accent={accent} count={`${current.how.length}/250`}>
            <textarea
              value={current.how}
              maxLength={250}
              onChange={(e) => update(current.id, { how: e.target.value })}
              placeholder="Conduct internal meetings with the staff team to define purpose, scope, and responsibilities"
              className={`${inputCls} h-20 resize-none`}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="When?" accent={accent}>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-[12px] font-semibold text-[#374151]">Date to begin</p>
                  <input
                    type="date"
                    value={current.start}
                    onChange={(e) => update(current.id, { start: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold text-[#374151]">Due date</p>
                  <input
                    type="date"
                    value={current.due}
                    onChange={(e) => update(current.id, { due: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
            </Field>

            <Field label="Who?" hint="Responsible person" accent={accent} count={`${current.who.length}/80`}>
              <input
                value={current.who}
                maxLength={80}
                onChange={(e) => update(current.id, { who: e.target.value })}
                placeholder="Maria L."
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Resources needed" accent={accent} count={`${current.resources.length}/150`}>
              <input
                value={current.resources}
                maxLength={150}
                onChange={(e) => update(current.id, { resources: e.target.value })}
                placeholder="Meeting space, facilitation tools"
                className={inputCls}
              />
            </Field>
            <Field label="Potential risk" accent={accent} count={`${current.risk.length}/150`}>
              <input
                value={current.risk}
                maxLength={150}
                onChange={(e) => update(current.id, { risk: e.target.value })}
                placeholder="Lack of clarity or consensus"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Progress tracking" accent={accent}>
              <select
                value={current.progress}
                onChange={(e) => update(current.id, { progress: e.target.value })}
                className={inputCls}
              >
                {PROGRESS_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Notes" accent={accent} count={`${current.notes.length}/250`}>
              <textarea
                value={current.notes}
                maxLength={250}
                onChange={(e) => update(current.id, { notes: e.target.value })}
                placeholder="Additional comments or observations"
                className={`${inputCls} h-20 resize-none`}
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-semibold text-[#9ca3af]">
            <span className="inline-flex items-center gap-1.5">
              <Box size={13} /> Resources
            </span>
            <span className="inline-flex items-center gap-1.5">
              <AlertTriangle size={13} /> Risks
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 size={13} /> Progress
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageSquare size={13} /> Notes
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
