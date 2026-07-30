import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Info, Pencil, Play, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/questionnaire/$area")({
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
const TEAL = "#219c9e";
const ORANGE = "#f4a261";

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

const TOTAL_STEPS = 4;

function QuestionnairePage() {
  const { area } = Route.useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [matrix, setMatrix] = useState<Record<number, Answer>>({});
  const [matrix2, setMatrix2] = useState<Record<number, Answer>>({});
  const [scale, setScale] = useState(0);
  const [scaleNA, setScaleNA] = useState(false);

  const score = useMemo(() => {
    const yes = Object.values(matrix).filter((v) => v === "yes").length;
    const counted = Object.values(matrix).filter((v) => v !== "na").length || 1;
    const base = (yes / counted) * 100;
    const yes2 = Object.values(matrix2).filter((v) => v === "yes").length;
    const counted2 = Object.values(matrix2).filter((v) => v !== "na").length || 1;
    const base2 = (yes2 / counted2) * 100;
    const base3 = scaleNA ? null : (scale / (SCALE_LEVELS.length - 1)) * 100;
    const parts = base3 === null ? [base, base2] : [base, base2, base3];
    return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
  }, [matrix, matrix2, scale, scaleNA]);

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
          <Link
            to="/dashboard"
            className="shrink-0 rounded-full border border-white/70 px-4 py-1.5 text-[13px] font-bold text-white transition hover:bg-white/10"
          >
            Save &amp; Quit
          </Link>

          <div className="ml-auto flex min-w-0 items-center gap-4">
            <span className="hidden whitespace-nowrap text-[13px] text-white/85 sm:inline">
              {step < TOTAL_STEPS ? `Question ${step} of ${TOTAL_STEPS - 1}` : "Results"}
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
          <SliderQuestion value={scale} onChange={setScale} na={scaleNA} onToggleNa={() => setScaleNA((v) => !v)} />
        )}
        {step === 4 && <ResultsStep score={score} area={area} />}

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-[14px] font-bold transition hover:bg-[#502181]/5"
              style={{ borderColor: PURPLE, color: PURPLE }}
            >
              <ArrowLeft size={16} /> Previous
            </button>
          ) : (
            <span />
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              {step === TOTAL_STEPS - 1 ? "See results" : "Next"} <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard" })}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              Back to my assessments <ArrowRight size={16} />
            </button>
          )}
        </div>
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

function SliderQuestion({
  value,
  onChange,
  na,
  onToggleNa,
}: {
  value: number;
  onChange: (v: number) => void;
  na: boolean;
  onToggleNa: () => void;
}) {
  const last = SCALE_LEVELS.length - 1;
  const level = SCALE_LEVELS[value];

  return (
    <section>
      <IndicatorHeader
        code="1.3"
        title="Outreach and Consultation"
        about="The LYC actively engages young people beyond its membership by seeking input, perspectives, and feedback from a wider group of young people. Effective outreach involves understanding which groups are not currently engaged and creating opportunities for them to contribute. This can include working with schools, community organizations, informal youth groups, and other local networks. The LYC establishes clear and accessible ways for young people to share their views, contribute to discussions, and influence priorities, ensuring that its work reflects the broader needs and experiences of young people in the community."
        question="To what extent does your LYC engage and consult young people beyond its membership?"
        action={
          <button
            type="button"
            onClick={onToggleNa}
            aria-pressed={na}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-[13px] font-bold transition"
            style={{
              borderColor: PURPLE,
              color: na ? "#FFFFFF" : PURPLE,
              backgroundColor: na ? PURPLE : "transparent",
            }}
          >
            <Pencil size={14} /> Not Applicable
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
            {SCALE_LEVELS.map((l, i) => {
              const selected = value === i;
              return (
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
                  {/* Selection outline */}
                  <span
                    className="pointer-events-none absolute inset-y-0 left-0 right-0 ring-2 ring-white/0 transition"
                    style={{ right: i === last ? 0 : -1, boxShadow: selected ? `inset 0 0 0 2px rgba(255,255,255,0.55)` : "none" }}
                  />
                </button>
              );
            })}
          </div>

          {/* Thumb */}
          <div
            className="pointer-events-none absolute top-1/2 grid h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-white shadow-[0_3px_12px_rgba(0,0,0,0.22)] transition-all duration-300 ease-out"
            style={{ left: `${((value + 0.5) / SCALE_LEVELS.length) * 100}%`, color: level.color }}
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
          {SCALE_LEVELS.map((l, i) => (
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


function ResultsStep({ score, area }: { score: number; area: string }) {
  const level = score >= 75 ? "Advanced" : score >= 45 ? "Developing" : "Emerging";
  const tint = score >= 75 ? TEAL : score >= 45 ? ORANGE : PURPLE;

  return (
    <section>
      <h1 className="text-[30px] font-extrabold leading-tight" style={{ color: PURPLE }}>
        Your results — Area 1
      </h1>
      <p className="mt-2 text-[15px] text-[#6b7280]">
        Mock scoring preview for the <span className="font-semibold">{area.replace(/-/g, " ")}</span> area. The final score
        matrix will replace these values.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
          <div
            className="mx-auto grid h-[168px] w-[168px] place-items-center rounded-full"
            style={{ background: `conic-gradient(${tint} ${score * 3.6}deg, #ECECF1 0deg)` }}
          >
            <div className="grid h-[132px] w-[132px] place-items-center rounded-full bg-white">
              <div>
                <p className="text-[40px] font-extrabold leading-none" style={{ color: tint }}>
                  {score}
                </p>
                <p className="text-[12px] text-[#6b7280]">out of 100</p>
              </div>
            </div>
          </div>
          <p className="mt-5 text-[12px] font-bold uppercase tracking-wide text-[#6b7280]">Maturity level</p>
          <p className="text-[22px] font-extrabold" style={{ color: tint }}>
            {level}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
            <h2 className="text-[17px] font-extrabold text-[#111827]">Indicator breakdown</h2>
            <ul className="mt-4 space-y-4">
              {[
                { label: "1.1 Diversity of Membership", value: Math.round(score * 0.9) },
                { label: "1.2 Representation of youth groups and interests", value: Math.min(100, Math.round(score * 1.1)) },
                { label: "1.3 Outreach and Consultation", value: Math.min(100, Math.round(score * 0.95)) },
              ].map((r) => (
                <li key={r.label}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[#1f2937]">{r.label}</span>
                    <span className="font-bold" style={{ color: PURPLE }}>
                      {r.value}%
                    </span>
                  </div>
                  <div className="mt-2 h-[8px] overflow-hidden rounded-full bg-[#ECECF1]">
                    <div className="h-full rounded-full" style={{ width: `${r.value}%`, backgroundColor: PURPLE }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
            <h2 className="text-[17px] font-extrabold text-[#111827]">Suggested next steps</h2>
            <ul className="mt-4 space-y-3">
              {[
                "Map which youth groups are currently missing from your council.",
                "Partner with at least one organisation working with underrepresented youth.",
                "Set a simple outreach plan for the next recruitment round.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[14px] text-[#374151]">
                  <Check size={16} className="mt-[3px] shrink-0" style={{ color: TEAL }} />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-center gap-2 text-[12px] text-[#9ca3af]">
              <RotateCcw size={13} /> Results are not saved yet — scoring logic comes with the score matrix.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
