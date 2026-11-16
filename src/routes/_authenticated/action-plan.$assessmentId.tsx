import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ListChecks,
  PenLine,
  Printer,
  Save,
  Target,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ActionPlanPrintSheet } from "@/components/ActionPlanPrintSheet";
import { downloadActionPlanPdf } from "@/lib/action-plan-pdf";
import { AREAS } from "@/components/questionnaire/content";
import { themeForArea } from "@/components/questionnaire/theme";
import {
  PROGRESS_OPTIONS,
  indicatorCode,
  indicatorName,

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
  { key: "indicators", label: "Indicators", icon: Target },
  { key: "steps", label: "Action Steps", icon: ListChecks },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function ActionPlanPage() {
  const { assessmentId } = Route.useParams();
  const [areaKey, setAreaKey] = useState("representativeness");
  const [tab, setTab] = useState<TabKey>("intro");
  const [steps, setSteps] = useState<ActionPlanStep[]>([]);
  
  const [loaded, setLoaded] = useState(false);
  const [assessmentName, setAssessmentName] = useState("Assessment");
  const [saving, setSaving] = useState(false);
  const skipSave = useRef(true);

  const theme = themeForArea(areaKey);
  const area = AREAS[areaKey] ?? AREAS["representativeness"];

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("assessments")
        .select("area, title, user_id")
        .eq("id", assessmentId)
        .maybeSingle();
      if (data?.area) {
        // Same default naming as My Assessments: "Assessment N" by position in the area list.
        const { data: siblings } = await supabase
          .from("assessments")
          .select("id")
          .eq("user_id", data.user_id)
          .eq("area", data.area)
          .order("updated_at", { ascending: false });
        const idx = (siblings ?? []).findIndex((r) => r.id === assessmentId);
        if (active) setAssessmentName(data.title?.trim() || `Assessment ${idx >= 0 ? idx + 1 : 1}`);
      }
      const plan = await loadActionPlan(assessmentId);
      if (!active) return;
      if (data?.area) setAreaKey(data.area as string);
      if (plan) {
        const mapped = plan.steps.map((s) => (s.what ? s : { ...s, what: s.action.slice(0, 120) }));
        setSteps(mapped);
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
      await saveActionPlan(assessmentId, areaKey, { steps });
      setSaving(false);
    }, 700);
    return () => clearTimeout(t);
  }, [steps, loaded, assessmentId, areaKey]);

  const grouped = useMemo(() => {
    const map = new Map<string, ActionPlanStep[]>();
    for (const s of steps) {
      const list = map.get(s.indicator) ?? [];
      list.push(s);
      map.set(s.indicator, list);
    }
    return [...map.entries()];
  }, [steps]);

  const groupedActive = grouped;

  const update = (id: string, patch: Partial<ActionPlanStep>) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const navigate = useNavigate();

  const saveAndLeave = async () => {
    setSaving(true);
    try {
      await saveActionPlan(assessmentId, areaKey, { steps });
    } finally {
      setSaving(false);
    }
    navigate({ to: "/dashboard" });
  };

  const tabIndex = TABS.findIndex((t) => t.key === tab);

  const Tabs = () => (
    <nav aria-label="Action plan stages" className="plan-stage-nav">
      {TABS.map((t, index) => {
        const Icon = t.icon;
        const on = t.key === tab;
        return (
          <Button
            key={t.key}
            variant="ghost"
            onClick={() => setTab(t.key)}
            aria-current={on ? "step" : undefined}
            className={`plan-stage ${on ? "plan-stage--active" : ""}`}
          >
            <span className="plan-stage-icon"><Icon size={18} /></span>
            <span className="min-w-0 text-left"><span className="plan-stage-number">Step 0{index + 1}</span><span className="block">{t.label}</span></span>
          </Button>
        );
      })}
    </nav>
  );

  const BackLink = () => (
    <Link
      to="/results/$id"
      params={{ id: assessmentId }}
      className="inline-flex items-center gap-2 text-[13px] font-bold text-foreground transition hover:opacity-70"
    >
      <ArrowLeft size={16} /> Back to Results
    </Link>
  );

  return (
    <>
      <div className="plan-workspace min-h-screen bg-muted/40 pb-24 screen-only">
      <div className="mx-auto max-w-[1080px] px-4 pt-6 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <BackLink />
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CheckCircle2 size={14} className="text-secondary" /> {saving ? "Saving…" : loaded ? "All changes saved" : "Loading…"}
          </span>
        </div>

        <div className="plan-shell mt-6 overflow-hidden rounded-3xl border border-border bg-card">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 md:px-8">
            <div><p className="text-xs font-semibold text-muted-foreground">{assessmentName}</p><h1 className="mt-1 text-2xl font-bold tracking-normal text-primary">Build your action plan</h1></div>
            <span className="rounded-full bg-secondary/10 px-4 py-2 text-xs font-semibold text-secondary">{area.name}</span>
          </header>
          <div className="p-4 md:p-8">
          <Tabs />

          <div className="mt-7">
            {tab === "intro" && <Introduction onStart={() => setTab("indicators")} />}

            {tab === "indicators" && (
              <IndicatorsAndSteps
                accent={theme.accent}
                soft={theme.soft}
                border={theme.border}
                areaName={area.name}
                grouped={grouped}
                update={update}
              />
            )}

            {tab === "steps" && (
              <ActionSteps
                accent={theme.accent}
                soft={theme.soft}
                border={theme.border}
                steps={steps}
                grouped={groupedActive}
                update={update}
                assessmentId={assessmentId}
                areaName={area.name}
                canExport={groupedActive.some(([, list]) => list.some((s) => s.included))}
                onExport={() => void downloadActionPlanPdf(area.name, assessmentName, steps, theme.accent)}
                saving={saving}
                onSaveLater={() => void saveAndLeave()}
              />
            )}
          </div>

          <footer className="mt-8 border-t border-border pt-5">
            <Tabs />
            <div className="mt-5 flex items-center justify-between gap-3">
              <Button variant="outline" disabled={tabIndex === 0} onClick={() => { const previous = TABS[tabIndex - 1]; if (previous) setTab(previous.key); }} className="rounded-full px-5 text-primary">
                <ChevronLeft size={16} /> Previous
              </Button>
              <span className="text-xs font-medium text-muted-foreground">{tabIndex + 1} / {TABS.length}</span>
              <Button disabled={tabIndex === TABS.length - 1} onClick={() => { const next = TABS[tabIndex + 1]; if (next) setTab(next.key); }} className="rounded-full px-6">
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </footer>
          </div>
        </div>

        <div className="mt-8">
          <BackLink />
        </div>
      </div>
      </div>

      <ActionPlanPrintSheet areaName={area.name} steps={steps} />
    </>
  );
}

/* -------------------------------- Introduction ------------------------------- */

function Introduction({ onStart }: { onStart: () => void }) {
  return (
    <section className="plan-intro rounded-2xl p-6 md:p-9">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-secondary"><Lightbulb size={18} /> From reflection to action</span>

      <div className="mt-5 max-w-[760px] text-sm leading-relaxed text-foreground">
        <p>
          This is your <strong>ACTION PLAN</strong>, designed to help you move from assessment to implementation as you
          begin to strengthen youth engagement in your Local Youth Council.
        </p>
        <p className="mt-4">
          Based on your answers to the IMPACT self-assessment, you selected up to three recommended action steps per
          indicator. Those steps have been imported here automatically. Tick the ones you want to include in your plan.
        </p>
      </div>

      <div className="mt-6 max-w-[760px]">
        <p className="text-[13px] leading-relaxed text-foreground/80">Work through the guided steps below. Your answers are saved automatically as you type. At the end, export your prefilled plan with one action step per page, or save and continue later.</p>
        <Button onClick={onStart} className="mt-5 rounded-full"><PenLine size={14} /> Start filling in online</Button>
      </div>

      <div className="mt-7 max-w-[760px] space-y-4 text-sm leading-relaxed text-foreground/80">
        <p>
          The plan supports you in organising <strong>what</strong> needs to be done, <strong>who</strong>{" "}
          will be involved, <strong>when</strong> each step should happen, what <strong>resources</strong> you need, and
          how you will measure <strong>progress</strong>.
        </p>
        <p>
          We recommend involving all relevant stakeholders (young people, staff members, municipality representatives,
          etc.) in completing this plan.
        </p>
      </div>

      <div className="mt-7 border-t border-border pt-5">
        <span className="text-xs font-bold text-primary">
          GOOD LUCK WITH THE IMPLEMENTATION!
        </span>
      </div>
    </section>
  );
}

/* ---------------------------- Indicators & Steps ----------------------------- */

function IndicatorsAndSteps({
  accent,
  soft,
  border,
  areaName,
  grouped,
  update,
}: {
  accent: string;
  soft: string;
  border: string;
  areaName: string;
  grouped: [string, ActionPlanStep[]][];
  update: (id: string, patch: Partial<ActionPlanStep>) => void;
}) {

  return (
    <section>
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Area of assessment</p>
      <p className="mt-1 text-[15px] font-extrabold" style={{ color: "var(--primary)" }}>
        {areaName}
      </p>

      <div className="mt-5 border-t border-border pt-6">
        <p className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wide" style={{ color: "var(--primary)" }}>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground">
            <ListChecks size={15} />
          </span>
          Select action steps
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          These are the indicators you chose to work on, with the action steps you pre-selected in your results. Tick
          the steps you want in your plan. You can change this anytime.
        </p>
        {grouped.length === 0 ? (
          <p className="mt-4 text-[13px] text-muted-foreground">
            You have not selected any action steps yet. Go back to your results and tick up to 3 recommended steps per
            indicator. They will appear here automatically.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {grouped.map(([indicator, list]) => {
              const code = indicatorCode(indicator);
              const name = indicatorName(indicator);
              return (
                <div key={indicator} className="rounded-lg border border-border bg-card p-5">
                  <p className="text-[13px] leading-snug">
                    <span className="font-extrabold" style={{ color: "var(--primary)" }}>
                      Indicator {code}
                    </span>
                    {name !== code && <span className="font-semibold text-foreground"> {name}</span>}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {list.map((s) => (
                      <li key={s.id} className="flex items-start gap-2.5 text-[12px] leading-snug">
                        <input
                          type="checkbox"
                          checked={s.included}
                          onChange={(e) => update(s.id, { included: e.target.checked })}
                          style={{ accentColor: "var(--primary)" }}
                          className="mt-[1px] h-[15px] w-[15px] shrink-0 cursor-pointer"
                          aria-label={`Include "${s.action}" in my plan`}
                        />
                        <span
                          className={
                            s.included
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground line-through decoration-border"
                          }
                        >
                          {s.action}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
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
    <div className="border-t border-border pt-5">
      <p className="text-[12px] font-extrabold uppercase tracking-wide" style={{ color: "var(--primary)" }}>
        {label}
      </p>
      {hint && <p className="mt-1 text-[12px] font-semibold text-foreground">{hint}</p>}
      <div className="mt-2">{children}</div>
      {count && (
        <p className="mt-1 text-right text-[11px] font-semibold" style={{ color: "var(--primary)" }}>
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
  grouped,
  update,
  assessmentId,
  areaName,
  canExport,
  onExport,
  saving,
  onSaveLater,
}: {
  accent: string;
  soft: string;
  border: string;
  steps: ActionPlanStep[];
  grouped: [string, ActionPlanStep[]][];
  update: (id: string, patch: Partial<ActionPlanStep>) => void;
  assessmentId: string;
  areaName: string;
  canExport: boolean;
  onExport: () => void;
  saving: boolean;
  onSaveLater: () => void;
}) {
  const [indicator, setIndicator] = useState<string>("");
  const [stepId, setStepId] = useState<string>("");

  const activeIndicator = grouped.find(([k]) => k === indicator) ?? grouped[0];
  const indicatorSteps = activeIndicator?.[1] ?? [];
  const current = indicatorSteps.find((s) => s.id === stepId) ?? indicatorSteps[0];

  const inputCls =
    "w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/25 focus:border-primary transition-colors";

  if (steps.length === 0) {
    return (
      <section className="rounded-2xl p-8 text-center" style={{ backgroundColor: "var(--plan-soft)" }}>
        <p className="text-[14px] font-bold text-foreground">No action steps yet</p>
        <p className="mx-auto mt-2 max-w-[420px] text-[13px] text-muted-foreground">
          Select up to 3 recommended action steps per indicator on your results page and they will be imported here.
        </p>
        <Link
          to="/results/$id"
          params={{ id: assessmentId }}
          className="mt-5 inline-flex rounded-full px-5 py-2.5 text-[12px] font-bold text-primary-foreground"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Go to my results
        </Link>
      </section>
    );
  }

  return (
    <section>
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Area of assessment</p>
      <p className="mt-1 text-[15px] font-extrabold" style={{ color: "var(--primary)" }}>{areaName}</p>

      {/* Indicator selector bar */}
      <p className="mt-5 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Indicator</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {grouped.map(([key]) => {
          const on = key === (activeIndicator?.[0] ?? "");
          return (
            <Button
              key={key}
              type="button"
              onClick={() => {
                setIndicator(key);
                setStepId("");
              }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition"
              style={
                on
                  ? { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }
                  : { backgroundColor: "var(--plan-soft)", color: "var(--primary)", border: "1px solid var(--border)" }
              }
            >
              Indicator {key}
            </Button>
          );
        })}
      </div>

      {/* Step selector bar */}
      <p className="mt-5 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Action step</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {indicatorSteps.map((s, i) => {
          const on = s.id === current?.id;
          return (
            <Button
              key={s.id}
              type="button"
              onClick={() => setStepId(s.id)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition"
              style={
                on
                  ? { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }
                  : { backgroundColor: "var(--plan-soft)", color: "var(--primary)", border: "1px solid var(--border)", opacity: s.included ? 1 : 0.5 }
              }
            >
              <span
                className="grid h-4 w-4 place-items-center rounded-full border"
                style={{ borderColor: on ? "var(--primary-foreground)" : "var(--primary)", backgroundColor: s.included ? (on ? "var(--primary-foreground)" : "var(--primary)") : "transparent" }}
              >
                {s.included && <Check size={10} color={on ? "var(--primary)" : "var(--primary-foreground)"} />}
              </span>
              Action step {i + 1}
            </Button>
          );
        })}
      </div>

      {current && (
        <>
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4" style={{ backgroundColor: "var(--plan-soft)" }}>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                Indicator {current.indicator}
              </p>
              <p className="mt-1 text-[13px] font-bold text-foreground">{current.action}</p>
            </div>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[12px] font-semibold text-foreground">
              <input
                type="checkbox"
                checked={current.included}
                onChange={(e) => update(current.id, { included: e.target.checked })}
                style={{ accentColor: "var(--primary)" }}
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
                  <p className="mb-1 text-[12px] font-semibold text-foreground">Date to begin</p>
                  <input
                    type="date"
                    value={current.start}
                    onChange={(e) => update(current.id, { start: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold text-foreground">Due date</p>
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
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-[12px] font-semibold text-foreground">
            Choose what to do next. Export your plan to download it as a PDF you can print or share with your team, or
            save your progress and come back to it later.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              onClick={onExport}
              disabled={!canExport}
              className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[12px] font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Printer size={14} /> Export your plan
            </Button>
            <Button
              type="button"
              onClick={onSaveLater}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-6 py-2.5 text-[12px] font-bold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              style={{ borderColor: accent, color: "var(--primary)" }}
            >
              <Save size={14} /> {saving ? "Saving…" : "Save and continue later"}
            </Button>
          </div>
        </div>
        </>
      )}
    </section>
  );
}
