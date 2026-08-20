import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ResultsStep } from "@/components/questionnaire/ResultsStep";
import { AREAS, type QIndicator } from "@/components/questionnaire/content";
import { AreaThemeProvider, themeForArea, useAreaTheme } from "@/components/questionnaire/theme";

type ResourceArea = Database["public"]["Enums"]["resource_area"];

export const Route = createFileRoute("/_authenticated/questionnaire/$area")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: typeof search['id'] === "string" ? (search['id'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Questionnaire — IMPACT" },
      { name: "description", content: "Answer the IMPACT self-assessment questionnaire for your Local Youth Council." },
      { property: "og:title", content: "Questionnaire — IMPACT" },
      { property: "og:description", content: "Answer the IMPACT self-assessment questionnaire for your Local Youth Council." },
    ],
  }),
  component: QuestionnairePage,
});


type Answer = "yes" | "no" | "na";

const LEVEL_STYLE = [
  { color: "#E14B45", soft: "#FDECEB" },
  { color: "#E8913C", soft: "#FDF1E5" },
  { color: "#E5C13F", soft: "#FCF7E4" },
  { color: "#33A06A", soft: "#E9F6EF" },
];

type MatrixState = Record<number, Record<number, Answer>>;
type ScaleState = Record<number, { value: number; na: boolean; touched: boolean }>;

/** Old area-1 payloads used named keys — map them onto indicator indexes. */
function migrateLegacy(a: Record<string, unknown>): { matrix: MatrixState; scale: ScaleState } {
  if (a['answersByIndicator']) {
    const v = a['answersByIndicator'] as { matrix?: MatrixState; scale?: ScaleState };
    return { matrix: v.matrix ?? {}, scale: v.scale ?? {} };
  }
  const matrix: MatrixState = {};
  const scale: ScaleState = {};
  const legacyMatrix: Record<string, number> = { matrix: 0, matrix2: 1, matrix3: 4, matrix4: 5 };
  for (const [k, idx] of Object.entries(legacyMatrix)) {
    if (a[k]) matrix[idx] = a[k] as Record<number, Answer>;
  }
  if (a['scaleTouched'] !== undefined || a['scale'] !== undefined) {
    scale[2] = { value: (a['scale'] as number) ?? 0, na: Boolean(a['scaleNA']), touched: Boolean(a['scaleTouched']) };
  }
  if (a['scale14Touched'] !== undefined || a['scale14'] !== undefined) {
    scale[3] = { value: (a['scale14'] as number) ?? 0, na: Boolean(a['scale14NA']), touched: Boolean(a['scale14Touched']) };
  }
  return { matrix, scale };
}

function QuestionnairePage() {
  const { area } = Route.useParams();
  const { id: routeId } = Route.useSearch();
  const navigate = useNavigate();

  const areaContent = AREAS[area] ?? AREAS["representativeness"]!;
  const indicators = areaContent.indicators;
  const TOTAL_STEPS = indicators.length + 1;

  const theme = themeForArea(areaContent.key);

  const [step, setStep] = useState(1);
  const [matrix, setMatrix] = useState<MatrixState>({});
  const [scale, setScale] = useState<ScaleState>({});
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume a specific assessment (?id=) or the latest unfinished one for this area
  useEffect(() => {
    let active = true;
    const query = routeId
      ? supabase.from("assessments").select("id, current_step, answers, status").eq("id", routeId).maybeSingle()
      : supabase
          .from("assessments")
          .select("id, current_step, answers, status")
          .eq("area", area as ResourceArea)
          .eq("status", "in_progress")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

    query.then(({ data }) => {
      if (!active || !data) return;
      const a = (data.answers ?? {}) as Record<string, unknown>;
      const migrated = migrateLegacy(a);
      setAssessmentId(data.id);
      setIsEditing(data.status === "completed");
      setStep(
        data.status === "completed" ? 1 : Math.min(Math.max(data.current_step ?? 1, 1), TOTAL_STEPS - 1),
      );
      setMatrix(migrated.matrix);
      setScale(migrated.scale);
    });
    return () => {
      active = false;
    };
  }, [area, routeId, TOTAL_STEPS]);

  const percentages = useMemo(
    () =>
      indicators.map((ind, i) => {
        if (ind.type === "matrix") {
          const vals = Object.values(matrix[i] ?? {});
          const counted = vals.filter((v) => v !== "na").length;
          if (!counted) return 0;
          return (vals.filter((v) => v === "yes").length / counted) * 100;
        }
        const s = scale[i];
        if (!s || s.na) return 0;
        return (s.value / Math.max(ind.levels.length - 1, 1)) * 100;
      }),
    [indicators, matrix, scale],
  );

  const answersPayload = useMemo(() => ({ answersByIndicator: { matrix, scale } }), [matrix, scale]);

  const persist = async (opts: { step: number; completed?: boolean }) => {
    setSaving(true);
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user?.id;
    if (!userId) {
      setSaving(false);
      return null;
    }
    const done = opts.completed || isEditing;
    const payload = {
      user_id: userId,
      area: area as "representativeness" | "governance" | "empowerment" | "results" | "general",
      status: done ? "completed" : "in_progress",
      current_step: opts.step,
      answers: answersPayload,
      percentages,
      completed_at: done ? new Date().toISOString() : null,
    };

    let id = assessmentId;
    if (id) {
      await supabase.from("assessments").update(payload).eq("id", id);
    } else {
      const { data } = await supabase.from("assessments").insert(payload).select("id").maybeSingle();
      id = data?.id ?? null;
      setAssessmentId(id);
    }
    setSaving(false);
    return id;
  };

  const current: QIndicator | undefined = indicators[step - 1];

  // Slider questions default to "Not at all" (value 0) so the user can simply tap Next.
  useEffect(() => {
    if (current?.type === "slider" && scale[step - 1] === undefined) {
      setScale((prev) => ({ ...prev, [step - 1]: { value: 0, na: false, touched: true } }));
    }
  }, [current, step]);

  const canAdvance = () => {
    if (!current) return true;
    if (current.type === "matrix") return Object.keys(matrix[step - 1] ?? {}).length > 0;
    const s = scale[step - 1];
    // Slider questions default to value 0 ("Not at all"), so any numeric value is valid.
    return Boolean(s && (s.na || typeof s.value === "number"));
  };

  const handleNext = async () => {
    if (!canAdvance()) {
      setError(
        current?.type === "slider"
          ? "Please choose a level on the slider, or skip this question."
          : "Please answer at least one criterion before continuing.",
      );
      return;
    }
    setError(null);
    const next = step + 1;
    await persist({ step: next, completed: next === TOTAL_STEPS });
    setStep(next);
  };

  const handleSaveAndQuit = async () => {
    await persist({ step });
    navigate({ to: "/dashboard" });
  };

  const progress = step / TOTAL_STEPS;

  return (
    <AreaThemeProvider areaKey={areaContent.key}>
    <div className="min-h-screen bg-[#FAFAFB]">
      {/* Top bar */}
      <header className="sticky top-0 z-40" style={{ backgroundColor: theme.accent }}>
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-4 px-6 lg:px-10">
          <Link
            to="/dashboard"
            className="flex shrink-0 items-center gap-3 text-[15px] font-semibold text-white transition hover:opacity-80"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={handleSaveAndQuit}
            disabled={saving}
            className="shrink-0 rounded-full border border-white/70 px-4 py-1.5 text-[13px] font-bold text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save & Quit"}
          </button>

          <div className="ml-auto flex min-w-0 items-center gap-4">
            {isEditing && (
              <span className="hidden whitespace-nowrap rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold text-white md:inline">
                Editing completed assessment
              </span>
            )}
            <span className="hidden whitespace-nowrap text-[13px] text-white/85 sm:inline">
              {step < TOTAL_STEPS ? `Question ${step} of ${TOTAL_STEPS - 1}` : "Assessment Complete"}
            </span>

            <div className="h-[7px] w-[120px] overflow-hidden rounded-full bg-white/25 sm:w-[240px]">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 pb-20 pt-10 lg:px-10">
        {current && current.type === "matrix" && (
          <MatrixQuestion
            key={current.code}
            indicator={current}
            answers={matrix[step - 1] ?? {}}
            setAnswers={(fn) =>
              setMatrix((m) => ({ ...m, [step - 1]: fn(m[step - 1] ?? {}) }))
            }
          />
        )}
        {current && current.type === "slider" && (
          <SliderQuestion
            key={current.code}
            indicator={current}
            value={scale[step - 1]?.value ?? 0}
            na={Boolean(scale[step - 1]?.na)}
            onChange={(v) => {
              setScale((s) => ({ ...s, [step - 1]: { value: v, na: false, touched: true } }));
              setError(null);
            }}
            onSkip={async () => {
              setScale((s) => ({ ...s, [step - 1]: { value: 0, na: true, touched: false } }));
              setError(null);
              await persist({ step: step + 1 });
              setStep((s) => s + 1);
            }}
          />
        )}
        {step === TOTAL_STEPS && <ResultsStep percentages={percentages} areaKey={areaContent.key} />}

        {/* Nav */}
        {step < TOTAL_STEPS && (
          <div className="mt-10">
            {error && (
              <p className="mb-4 rounded-xl bg-[#FDECEB] px-4 py-3 text-[13px] font-semibold text-[#B3382F]">
                {error}
              </p>
            )}
            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep((s) => s - 1);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-[14px] font-bold transition "
                  style={{ borderColor: theme.accent, color: theme.accent, backgroundColor: "transparent" }}
                >
                  <ArrowLeft size={16} /> Previous
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: theme.accent }}
              >
                {step === TOTAL_STEPS - 1 ? "See results" : "Next"} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
    </AreaThemeProvider>
  );
}

function IndicatorHeader({
  code,
  title,
  about,
  question,
  action,
}: {
  code: string;
  title: string;
  about: string;
  question: string;
  action?: React.ReactNode;
}) {
  const theme = useAreaTheme();
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[22px] font-extrabold leading-tight sm:text-[30px]" style={{ color: theme.accent }}>
          {code} {title}
        </h1>
        {action}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5 sm:mt-6 sm:p-6">
        <div className="flex items-start gap-3">
          <Info size={18} className="mt-[3px] shrink-0" style={{ color: theme.accent }} />
          <div className="min-w-0">
            <h2 className="text-[15px] font-extrabold text-[#111827] sm:text-[16px]">About This Indicator</h2>
            <p className="mt-2 text-[13px] leading-[1.6] text-[#111827] sm:text-[14px] sm:leading-[1.65]">
              {about}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 border-b border-black/10 pb-4 text-[18px] font-bold text-[#111827] sm:mt-7 sm:pb-5 sm:text-[22px]">{question}</p>
    </>
  );
}

function MatrixQuestion({
  indicator,
  answers,
  setAnswers,
}: {
  indicator: QIndicator;
  answers: Record<number, Answer>;
  setAnswers: (fn: (m: Record<number, Answer>) => Record<number, Answer>) => void;
}) {
  const theme = useAreaTheme();
  return (
    <section>
      <IndicatorHeader
        code={indicator.code}
        title={indicator.title}
        about={indicator.about}
        question={indicator.question}
      />

      <p className="mt-5 text-[11px] font-bold uppercase tracking-wide sm:mt-6 sm:text-[12px]" style={{ color: theme.accent }}>
        Select those that are included in your LYC
      </p>

      {/* Desktop table */}
      <div className="mt-3 hidden overflow-hidden rounded-xl ring-1 ring-black/5 sm:block">
        {/* Head */}
        <div
          className="grid grid-cols-[minmax(0,1fr)_100px_100px_100px] items-center gap-2 px-6 py-3"
          style={{ backgroundColor: theme.accent }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-white">Criteria</span>
          {["Yes", "No", "N/A"].map((h) => (
            <span key={h} className="text-center text-[11px] font-bold uppercase tracking-wider text-white">
              {h}
            </span>
          ))}
        </div>

        {indicator.criteria.map((c, i) => (
          <div
            key={c}
            className="grid grid-cols-[minmax(0,1fr)_100px_100px_100px] items-center gap-2 px-6 py-3.5"
            style={{ backgroundColor: i % 2 === 0 ? theme.row : "#FFFFFF" }}
          >
            <span className="text-[14px] leading-snug text-[#1f2937]">{c}</span>
            {(["yes", "no", "na"] as Answer[]).map((v) => {
              const checked = answers[i] === v;
              return (
                <span key={v} className="flex justify-center">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    aria-label={`${c} — ${v}`}
                    onClick={() => setAnswers((m) => ({ ...m, [i]: v }))}
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 transition"
                    style={{ borderColor: checked ? theme.accent : "#C9CDD4" }}
                  >
                    {checked && (
                      <span className="h-[10px] w-[10px] rounded-full" style={{ backgroundColor: theme.accent }} />
                    )}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile stacked cards with circular radios */}
      <div className="mt-3 space-y-3 sm:hidden">
        {indicator.criteria.map((c, i) => (
          <div
            key={c}
            className="rounded-xl bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5"
            style={{ backgroundColor: i % 2 === 0 ? theme.row : "#FFFFFF" }}
          >
            <p className="text-[13px] font-semibold leading-snug text-[#1f2937]">{c}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {([
                { key: "yes", label: "Yes" },
                { key: "no", label: "No" },
                { key: "na", label: "N/A" },
              ] as { key: Answer; label: string }[]).map(({ key, label }) => {
                const checked = answers[i] === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    aria-label={`${c} — ${label}`}
                    onClick={() => setAnswers((m) => ({ ...m, [i]: key }))}
                    className="flex flex-col items-center gap-1.5 rounded-lg py-2 transition"
                    style={{
                      backgroundColor: checked ? `${theme.accent}15` : "transparent",
                      border: `2px solid ${checked ? theme.accent : "#e5e7eb"}`,
                    }}
                  >
                    <span
                      className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 transition"
                      style={{ borderColor: checked ? theme.accent : "#C9CDD4" }}
                    >
                      {checked && (
                        <span className="h-[10px] w-[10px] rounded-full" style={{ backgroundColor: theme.accent }} />
                      )}
                    </span>
                    <span
                      className="text-[11px] font-bold uppercase tracking-wide"
                      style={{ color: checked ? theme.accent : "#6b7280" }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SliderQuestion({
  indicator,
  value,
  onChange,
  na,
  onSkip,
}: {
  indicator: QIndicator;
  value: number;
  onChange: (v: number) => void;
  na: boolean;
  onSkip: () => void;
}) {
  const theme = useAreaTheme();
  const levels = indicator.levels;
  const last = levels.length - 1;
  const level = levels[Math.min(value, last)]!;
  const style = LEVEL_STYLE[Math.min(value, LEVEL_STYLE.length - 1)]!;

  return (
    <section>
      <IndicatorHeader
        code={indicator.code}
        title={indicator.title}
        about={indicator.about}
        question={indicator.question}
      />

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex items-center gap-2 rounded-full border border-[#d1d5db] bg-white px-4 py-2 text-[13px] font-semibold text-[#6b7280] transition hover:opacity-80"
        >
          Skip this question
        </button>
      </div>

      <p className="mt-8 text-[12px] font-bold uppercase tracking-wide" style={{ color: theme.accent }}>
        Use the slider to choose what fits best for your case
      </p>

      <div className={`mt-14 ${na ? "pointer-events-none opacity-40" : ""}`}>
        <div className="relative h-[44px]">
          {/* Visible coloured track segments — each is a large drop target */}
          <div className="absolute left-0 right-0 top-1/2 flex h-[14px] w-full -translate-y-1/2 overflow-hidden rounded-full">
            {levels.map((l, i) => (
              <button
                key={l.label}
                type="button"
                aria-label={`Select level: ${l.label}`}
                onClick={() => onChange(i)}
                className="group relative flex-1 cursor-pointer transition focus:outline-none"
                style={{ backgroundColor: LEVEL_STYLE[i]?.color ?? "#ccc" }}
              >
                <span className="absolute inset-x-0 -top-[15px] -bottom-[15px] block" />
              </button>
            ))}
          </div>

          {/* Thumb */}
          <div
            className="pointer-events-none absolute top-1/2 flex h-[40px] w-[32px] -translate-x-1/2 -translate-y-1/2 items-start justify-center drop-shadow-xl transition-all duration-300 ease-out"
            style={{ left: `${((value + 0.5) / levels.length) * 100}%` }}
          >
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="28" height="28" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
              <path d="M9 13L16 23L23 13Z" fill={theme.accent} />
            </svg>
          </div>

          <input
            type="range"
            min={0}
            max={last}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={`Level for ${indicator.title}`}
            className="absolute inset-0 w-full cursor-pointer opacity-0"
          />
        </div>

        <div className="mt-6 flex">
          {levels.map((l, i) => (
            <button
              key={l.label}
              type="button"
              onClick={() => onChange(i)}
              className="flex-1 text-center text-[14px] font-semibold transition"
              style={{ color: i === value ? LEVEL_STYLE[i]?.color : "#9ca3af" }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div
          className="mt-10 rounded-2xl border p-6 transition-colors duration-300"
          style={{ backgroundColor: style.soft, borderColor: style.color }}
        >
          <p className="text-[12px] font-bold uppercase tracking-wide" style={{ color: style.color }}>
            Selected level: {level.label}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#1f2937]">{level.text}</p>
        </div>
      </div>
    </section>
  );
}
