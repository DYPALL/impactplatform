import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Info, RotateCcw } from "lucide-react";

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

const SINGLE_OPTIONS = [
  {
    value: "always",
    label: "Always — outreach is planned for every recruitment round",
    detail: "Targeted actions towards underrepresented groups are part of every call for members.",
  },
  {
    value: "often",
    label: "Often — outreach happens in most recruitment rounds",
    detail: "There is a habit of reaching out, but it is not formalised.",
  },
  {
    value: "sometimes",
    label: "Sometimes — outreach happens occasionally",
    detail: "Actions depend on the availability of members or partners.",
  },
  {
    value: "never",
    label: "Never — there is no specific outreach",
    detail: "Recruitment relies only on open calls and word of mouth.",
  },
];

const TOTAL_STEPS = 3;

function QuestionnairePage() {
  const { area } = Route.useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [matrix, setMatrix] = useState<Record<number, Answer>>({});
  const [single, setSingle] = useState<string | null>(null);

  const score = useMemo(() => {
    const yes = Object.values(matrix).filter((v) => v === "yes").length;
    const counted = Object.values(matrix).filter((v) => v !== "na").length || 1;
    const base = (yes / counted) * 100;
    const bonus = single === "always" ? 15 : single === "often" ? 10 : single === "sometimes" ? 5 : 0;
    return Math.min(100, Math.round(base * 0.85 + bonus));
  }, [matrix, single]);

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
        {step === 2 && <SingleQuestion value={single} onChange={setSingle} />}
        {step === 3 && <ResultsStep score={score} area={area} />}

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
}: {
  code: string;
  title: string;
  about: string;
  question: string;
}) {
  return (
    <>
      <h1 className="text-[30px] font-extrabold leading-tight" style={{ color: PURPLE }}>
        {code} {title}
      </h1>

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
}: {
  matrix: Record<number, Answer>;
  setMatrix: (fn: (m: Record<number, Answer>) => Record<number, Answer>) => void;
}) {
  return (
    <section>
      <IndicatorHeader
        code="1.1"
        title="Diversity of Membership"
        about="The LYC strives to reflect the demographic composition of the local youth population by including members representing: a diverse LYC brings together young people of different ages, genders, cultural and ethnic backgrounds, socioeconomic conditions, abilities, and geographical areas. Particular attention is given to reaching young people from underrepresented groups."
        question="Does your LYC reflect the demographic composition of the local youth population?"
      />

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

        {MATRIX_CRITERIA.map((c, i) => (
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

function SingleQuestion({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  return (
    <section>
      <IndicatorHeader
        code="1.2"
        title="Outreach to Underrepresented Youth"
        about="Beyond who is currently a member, the LYC actively reaches out to young people who are less likely to participate. Outreach can include partnerships with schools, social services, migrant or disability organisations, and informal youth groups."
        question="How often does your LYC run targeted outreach towards underrepresented young people?"
      />

      <p className="mt-6 text-[12px] font-bold uppercase tracking-wide" style={{ color: PURPLE }}>
        Select one answer
      </p>

      <div className="mt-3 space-y-3">
        {SINGLE_OPTIONS.map((o) => {
          const checked = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(o.value)}
              className="flex w-full items-start gap-4 rounded-xl bg-white p-5 text-left ring-1 transition"
              style={{
                boxShadow: checked ? `0 0 0 2px ${PURPLE}` : undefined,
                backgroundColor: checked ? "#F3EDF9" : "#FFFFFF",
                // @ts-expect-error css var for ring color
                "--tw-ring-color": "rgba(0,0,0,0.06)",
              }}
            >
              <span
                className="mt-[3px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2"
                style={{ borderColor: checked ? PURPLE : "#C9CDD4" }}
              >
                {checked && <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: PURPLE }} />}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-[#1f2937]">{o.label}</span>
                <span className="mt-1 block text-[13px] text-[#6b7280]">{o.detail}</span>
              </span>
            </button>
          );
        })}
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
                { label: "1.2 Outreach to Underrepresented Youth", value: Math.min(100, Math.round(score * 1.1)) },
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
