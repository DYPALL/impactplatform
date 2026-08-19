import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ResultsStep } from "@/components/questionnaire/ResultsStep";

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


const PURPLE = "#502181";

type Answer = "yes" | "no" | "na";

const MATRIX_CRITERIA = [
  "Different age groups",
  "Gender diversity",
  "Cultural and ethnic diversity, including religion, language, or migration background",
  "A range of socioeconomic backgrounds",
  "Sexual diversity, inclusion of LGBTQ+ youth",
  "Young people with disabilities or specific access needs",
  "Different geographical areas of the municipality",
  "Young people in different life situations (e.g., studying, working, seeking employment, or with family responsibilities)",
  "Youth from marginalized or underrepresented groups",
];

const MATRIX_CRITERIA_2 = [
  "a) Youth NGOs or associations",
  "b) Student councils or school/university associations",
  "c) Youth wings of political parties or youth branches of unions",
  "d) Informal or grassroots youth groups (e.g. volunteer collectives, neighborhood initiatives)",
  "e) Environmental and climate-action movements",
  "f) Sports, arts, and cultural youth groups",
  "g) Faith-based or community-based youth organizations",
  "h) Youth networks representing marginalized or minority groups (e.g. LGBTQ+, ethnic minorities, migrants)",
  "i) Other relevant groups of local interest",
];


const SCALE_LEVELS = [
  {
    label: "Not at all",
    color: "#E14B45",
    soft: "#FDECEB",
    text: "No systematic outreach or consultation with young people outside the LYC.",
  },
  {
    label: "Partially",
    color: "#E8913C",
    soft: "#FDF1E5",
    text: "Some young people are consulted occasionally, but engagement is irregular.",
  },
  {
    label: "Mostly",
    color: "#E5C13F",
    soft: "#FCF7E4",
    text: "Outreach and consultation take place regularly, but some groups remain less involved or feedback is not consistently used.",
  },
  {
    label: "Fully",
    color: "#33A06A",
    soft: "#E9F6EF",
    text: "A broad range of young people are regularly consulted, and their input informs priorities, decisions, and activities.",
  },
];

const SCALE_LEVELS_14 = [
  {
    label: "Not at all",
    color: "#E14B45",
    soft: "#FDECEB",
    text: "The LYC is largely unknown to young people or not perceived as representing them.",
  },
  {
    label: "Partially",
    color: "#E8913C",
    soft: "#FDF1E5",
    text: "Some young people are aware of the LYC or recognize certain members, but this is limited to specific groups or contexts.",
  },
  {
    label: "Mostly",
    color: "#E5C13F",
    soft: "#FCF7E4",
    text: "The LYC is generally known and recognized by young people as a relevant platform, although this recognition is not consistent across all groups.",
  },
  {
    label: "Fully",
    color: "#33A06A",
    soft: "#E9F6EF",
    text: "The LYC is widely recognized by young people as a credible and relevant platform that represents their views and interests.",
  },
];

const MATRIX_CRITERIA_3 = [
  "a) The LYC has agreed principles or guidelines on equality and non-discrimination",
  "b) Information about how to join or apply is shared in a clear and accessible way",
  "c) No young person is discouraged or excluded from participation due to identity, background, or personal circumstances",
  "d) Access to membership is based on fair and transparent criteria",
  "e) First contact with the LYC is respectful and welcoming",
  "f) Members are treated equally in roles, responsibilities, and participation",
  "g) The LYC reflects regularly on whether its practices create hidden barriers",
  "h) The LYC responds appropriately when discrimination or unequal treatment occurs",
];

const MATRIX_CRITERIA_4 = [
  "a) Meeting spaces are physically accessible, including for young people with disabilities",
  "b) Online or hybrid participation options are available when needed",
  "c) Support is provided to reduce transport or financial barriers where possible",
  "d) Meeting times and formats consider young people’s school, work, and personal responsibilities",
  "e) Communication uses clear and youth-friendly language",
  "f) Information and documents are shared in advance and in accessible formats",
  "g) Adjustments or support are provided for participants with specific needs",
  "h) Digital tools used are accessible and easy to use",
  "i) Accessibility conditions are reviewed and adapted based on feedback",
];

const EQUALITY_ABOUT =
  "The LYC adopts and applies principles and practices that promote equality and non-discrimination, ensuring that all young people have fair opportunities to participate, regardless of their background, identity, or personal circumstances. This includes both formal aspects, such as clear and fair rules for access and participation, and informal aspects, such as the culture, behaviours, and dynamics within the LYC. The LYC aims to create an environment where diversity is respected, participation is encouraged, and all members feel safe, valued, and able to contribute without fear of exclusion, bias, or discrimination.";

const TOTAL_STEPS = 7;

function QuestionnairePage() {
  const { area } = Route.useParams();
  const { id: routeId } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [matrix, setMatrix] = useState<Record<number, Answer>>({});
  const [matrix2, setMatrix2] = useState<Record<number, Answer>>({});
  const [matrix3, setMatrix3] = useState<Record<number, Answer>>({});
  const [matrix4, setMatrix4] = useState<Record<number, Answer>>({});
  const [scale, setScale] = useState(0);
  const [scaleNA, setScaleNA] = useState(false);
  const [scaleTouched, setScaleTouched] = useState(false);
  const [scale14, setScale14] = useState(0);
  const [scale14NA, setScale14NA] = useState(false);
  const [scale14Touched, setScale14Touched] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume a specific assessment (?id=) or the latest unfinished one for this area
  useEffect(() => {
    let active = true;
    const query = routeId
      ? supabase
          .from("assessments")
          .select("id, current_step, answers, status")
          .eq("id", routeId)
          .maybeSingle()
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
      setAssessmentId(data.id);
      setIsEditing(data.status === "completed");
      setStep(
        data.status === "completed"
          ? 1
          : Math.min(Math.max(data.current_step ?? 1, 1), TOTAL_STEPS - 1),
      );
      setMatrix((a.matrix as Record<number, Answer>) ?? {});
      setMatrix2((a.matrix2 as Record<number, Answer>) ?? {});
      setMatrix3((a.matrix3 as Record<number, Answer>) ?? {});
      setMatrix4((a.matrix4 as Record<number, Answer>) ?? {});
      setScale((a.scale as number) ?? 0);
      setScaleNA(Boolean(a.scaleNA));
      setScaleTouched(Boolean(a.scaleTouched));
      setScale14((a.scale14 as number) ?? 0);
      setScale14NA(Boolean(a.scale14NA));
      setScale14Touched(Boolean(a.scale14Touched));
    });
    return () => {
      active = false;
    };
  }, [area, routeId]);


  const percentages = useMemo(() => {
    const ratio = (m: Record<number, Answer>) => {
      const vals = Object.values(m);
      const counted = vals.filter((v) => v !== "na").length;
      if (!counted) return 0;
      return (vals.filter((v) => v === "yes").length / counted) * 100;
    };
    return [
      ratio(matrix),
      ratio(matrix2),
      scaleNA ? 0 : (scale / (SCALE_LEVELS.length - 1)) * 100,
      scale14NA ? 0 : (scale14 / (SCALE_LEVELS_14.length - 1)) * 100,
      ratio(matrix3),
      ratio(matrix4),
    ];
  }, [matrix, matrix2, matrix3, matrix4, scale, scaleNA, scale14, scale14NA]);

  const answersPayload = useMemo(
    () => ({
      matrix,
      matrix2,
      matrix3,
      matrix4,
      scale,
      scaleNA,
      scaleTouched,
      scale14,
      scale14NA,
      scale14Touched,
    }),
    [matrix, matrix2, matrix3, matrix4, scale, scaleNA, scaleTouched, scale14, scale14NA, scale14Touched],
  );

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

  const answeredCount = (m: Record<number, Answer>) => Object.keys(m).length;

  const canAdvance = () => {
    switch (step) {
      case 1:
        return answeredCount(matrix) > 0;
      case 2:
        return answeredCount(matrix2) > 0;
      case 3:
        return scaleNA || scaleTouched;
      case 4:
        return scale14NA || scale14Touched;
      case 5:
        return answeredCount(matrix3) > 0;
      case 6:
        return answeredCount(matrix4) > 0;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!canAdvance()) {
      setError(
        step === 3 || step === 4
          ? "Please choose a level on the slider, or mark this indicator as Not Applicable."
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
    <div className="min-h-screen bg-[#FAFAFB]">
      {/* Top bar */}
      <header className="sticky top-0 z-40" style={{ backgroundColor: PURPLE }}>
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
        {step === 1 && (
          <MatrixQuestion matrix={matrix} setMatrix={setMatrix} />
        )}
        {step === 2 && (
          <MatrixQuestion
            matrix={matrix2}
            setMatrix={setMatrix2}
            criteria={MATRIX_CRITERIA_2}
            code="1.2"
            title="Representation of youth groups and interests"
            about="The LYC brings together representatives from diverse youth organizations, movements, and communities of interest, ensuring that different forms of youth participation are present as well as different thematic areas. These can include NGOs, student councils, informal collectives, arts, sports, environmental groups, faith based organizations, and independent voices. The LYC aims to reflect the range of youth groups and interests that exist in its local context, recognising that the diversity of organizations and movements may vary depending on the municipality. This ensures that the council is connected to the full range of youth activities, interests, and causes in the community, not only the identities of its members."
            question="Does your LYC reflect the range of youth groups and interests present in your community?"
          />
        )}
        {step === 3 && (
          <SliderQuestion
            value={scale}
            onChange={(v) => {
              setScale(v);
              setScaleTouched(true);
              setScaleNA(false);
              setError(null);
            }}
            na={scaleNA}
            onSkip={async () => {
              setScaleNA(true);
              setError(null);
              await persist({ step: step + 1 });
              setStep((s) => s + 1);
            }}
          />
        )}
        {step === 4 && (
          <SliderQuestion
            value={scale14}
            onChange={(v) => {
              setScale14(v);
              setScale14Touched(true);
              setScale14NA(false);
              setError(null);
            }}
            na={scale14NA}
            onSkip={async () => {
              setScale14NA(true);
              setError(null);
              await persist({ step: step + 1 });
              setStep((s) => s + 1);
            }}
            levels={SCALE_LEVELS_14}
            code="1.4"
            title="Legitimacy"
            about={EQUALITY_ABOUT}
            question="To what extent is your LYC recognized by young people as a legitimate platform for representing their views and interests?"
          />
        )}
        {step === 5 && (
          <MatrixQuestion
            matrix={matrix3}
            setMatrix={setMatrix3}
            criteria={MATRIX_CRITERIA_3}
            code="1.5"
            title="Equality and non-discrimination"
            about={EQUALITY_ABOUT}
            question="Does your LYC ensure fair and non-discriminatory access to participation and membership?"
          />
        )}
        {step === 6 && (
          <MatrixQuestion
            matrix={matrix4}
            setMatrix={setMatrix4}
            criteria={MATRIX_CRITERIA_4}
            code="1.6"
            title="Accessibility and participation conditions"
            about="The LYC provides practical conditions that enable all young people to participate effectively in its activities. This includes ensuring that meetings, communication, and participation formats are accessible in terms of physical space, timing, language, and digital tools. The LYC aims to reduce practical barriers to participation by adapting formats and providing support where needed, so that young people can engage in ways that fit their circumstances."
            question="Does your LYC provide accessible conditions that enable all young people to participate?"
          />
        )}
        {step === TOTAL_STEPS && <ResultsStep percentages={percentages} />}

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
                  className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-[14px] font-bold transition hover:bg-[#502181]/5"
                  style={{ borderColor: PURPLE, color: PURPLE }}
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
                style={{ backgroundColor: PURPLE }}
              >
                {step === TOTAL_STEPS - 1 ? "See results" : "Next"} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
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
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[30px] font-extrabold leading-tight" style={{ color: PURPLE }}>
          {code} {title}
        </h1>
        {action}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
        <div className="flex items-start gap-3">
          <Info size={18} className="mt-[3px] shrink-0" style={{ color: PURPLE }} />
          <div className="min-w-0">
            <h2 className="text-[16px] font-extrabold text-[#111827]">About This Indicator</h2>
            <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: PURPLE }}>
              {about}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-7 border-b border-black/10 pb-5 text-[17px] text-[#6b7280]">{question}</p>
    </>
  );
}

function MatrixQuestion({
  matrix,
  setMatrix,
  criteria = MATRIX_CRITERIA,
  code = "1.1",
  title = "Diversity of Membership",
  about = "The LYC strives to reflect the demographic composition of the local youth population by including members representing: a diverse LYC brings together young people of different ages, genders, cultural and ethnic backgrounds, socioeconomic conditions, abilities, and geographical areas. Particular attention is given to reaching young people from underrepresented groups.",
  question = "Does your LYC reflect the demographic composition of the local youth population?",
}: {
  matrix: Record<number, Answer>;
  setMatrix: (fn: (m: Record<number, Answer>) => Record<number, Answer>) => void;
  criteria?: string[];
  code?: string;
  title?: string;
  about?: string;
  question?: string;
}) {
  return (
    <section>
      <IndicatorHeader code={code} title={title} about={about} question={question} />

      <p className="mt-6 text-[12px] font-bold uppercase tracking-wide" style={{ color: PURPLE }}>
        Select those that are included in your LYC
      </p>

      <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-black/5">
        {/* Head */}
        <div
          className="grid grid-cols-[minmax(0,1fr)_64px_64px_64px] items-center gap-2 px-6 py-3 sm:grid-cols-[minmax(0,1fr)_100px_100px_100px]"
          style={{ backgroundColor: PURPLE }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-white">Criteria</span>
          {["Yes", "No", "N/A"].map((h) => (
            <span key={h} className="text-center text-[11px] font-bold uppercase tracking-wider text-white">
              {h}
            </span>
          ))}
        </div>

        {criteria.map((c, i) => (
          <div
            key={c}
            className="grid grid-cols-[minmax(0,1fr)_64px_64px_64px] items-center gap-2 px-6 py-3.5 sm:grid-cols-[minmax(0,1fr)_100px_100px_100px]"
            style={{ backgroundColor: i % 2 === 0 ? "#F3EDF9" : "#FFFFFF" }}
          >
            <span className="text-[14px] leading-snug text-[#1f2937]">{c}</span>
            {(["yes", "no", "na"] as Answer[]).map((v) => {
              const checked = matrix[i] === v;
              return (
                <span key={v} className="flex justify-center">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    aria-label={`${c} — ${v}`}
                    onClick={() => setMatrix((m) => ({ ...m, [i]: v }))}
                    className="grid h-[18px] w-[18px] place-items-center rounded-full border-2 transition"
                    style={{ borderColor: checked ? PURPLE : "#C9CDD4" }}
                  >
                    {checked && (
                      <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: PURPLE }} />
                    )}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function NaIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className={className} fill="none">
      <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <text x="7" y="9.25" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="currentColor">
        N/A
      </text>
    </svg>
  );
}

function SliderQuestion({
  value,
  onChange,
  na,
  onSkip,
  levels = SCALE_LEVELS,
  code = "1.3",
  title = "Outreach and Consultation",
  about = "The LYC actively engages young people beyond its membership by seeking input, perspectives, and feedback from a wider group of young people. Effective outreach involves understanding which groups are not currently engaged and creating opportunities for them to contribute. This can include working with schools, community organizations, informal youth groups, and other local networks. The LYC establishes clear and accessible ways for young people to share their views, contribute to discussions, and influence priorities, ensuring that its work reflects the broader needs and experiences of young people in the community.",
  question = "To what extent does your LYC engage and consult young people beyond its membership?",
}: {
  value: number;
  onChange: (v: number) => void;
  na: boolean;
  onSkip: () => void;
  levels?: typeof SCALE_LEVELS;
  code?: string;
  title?: string;
  about?: string;
  question?: string;
}) {
  const last = levels.length - 1;
  const level = levels[value];

  return (
    <section>
      <IndicatorHeader
        code={code}
        title={title}
        about={about}
        question={question}
        action={
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-[13px] font-bold transition"
            style={{
              borderColor: PURPLE,
              color: PURPLE,
            }}
          >
            <NaIcon size={14} /> Not Applicable
          </button>
        }
      />

      <p className="mt-8 text-[12px] font-bold uppercase tracking-wide" style={{ color: PURPLE }}>
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
                  style={{ backgroundColor: l.color }}
                >
                  {/* Larger invisible click area */}
                  <span className="absolute inset-x-0 -top-[15px] -bottom-[15px] block" />
                </button>
              ))}
          </div>

          {/* Thumb */}
          <div
            className="pointer-events-none absolute top-1/2 grid h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-white shadow-[0_3px_12px_rgba(0,0,0,0.22)] transition-all duration-300 ease-out"
            style={{ left: `${((value + 0.5) / levels.length) * 100}%`, color: level.color }}
          >
            <Play size={13} fill="currentColor" strokeWidth={0} />
          </div>

          <input
            type="range"
            min={0}
            max={last}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Level of outreach and consultation"
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
              style={{ color: i === value ? l.color : "#9ca3af" }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div
          className="mt-10 rounded-2xl border p-6 transition-colors duration-300"
          style={{ backgroundColor: level.soft, borderColor: level.color }}
        >
          <p className="text-[12px] font-bold uppercase tracking-wide" style={{ color: level.color }}>
            Selected level: {level.label}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#1f2937]">{level.text}</p>
        </div>
      </div>
    </section>
  );
}

