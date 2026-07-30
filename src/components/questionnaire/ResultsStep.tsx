import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronDown, CircleHelp, Info, ListChecks, RefreshCw } from "lucide-react";
import ctaImg from "@/assets/cta-photo.webp.asset.json";
import { INDICATOR_CONTENT, LEVELS, levelFromPct, type IndicatorContent, type LevelKey } from "./results-data";

const PURPLE = "#502181";

export type IndicatorResult = { pct: number; level: LevelKey };

/* ---------------------------------- Battery --------------------------------- */

function Battery({ level }: { level: LevelKey }) {
  const color = LEVELS[level].color;
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="flex h-[22px] w-[86px] items-center gap-[3px] rounded-[5px] border-2 bg-white p-[3px]"
        style={{ borderColor: color }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-full flex-1 rounded-[2px] transition-colors"
            style={{ backgroundColor: i <= level ? color : "transparent" }}
          />
        ))}
      </span>
      <span className="h-[9px] w-[3px] rounded-r-sm" style={{ backgroundColor: color }} />
    </span>
  );
}

function LevelPill({ level }: { level: LevelKey }) {
  const l = LEVELS[level];
  return (
    <span
      className="rounded-full px-3 py-1 text-[11px] font-bold"
      style={{ backgroundColor: l.soft, color: l.color }}
    >
      {l.label}
    </span>
  );
}

/* --------------------------------- Rose chart -------------------------------- */

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function sectorPath(cx: number, cy: number, r: number, from: number, to: number) {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
}

const LABEL_POS: { style: React.CSSProperties }[] = [
  { style: { top: "2%", left: "53%" } },
  { style: { top: "42%", left: "62%" } },
  { style: { top: "78%", left: "53%" } },
  { style: { top: "78%", right: "53%" } },
  { style: { top: "42%", right: "62%" } },
  { style: { top: "2%", right: "53%" } },
];

function RoseChart({ results }: { results: IndicatorResult[] }) {
  const cx = 200;
  const cy = 150;
  const inner = 22;
  const maxR = 112;

  return (
    <div className="relative mx-auto w-full max-w-[820px] py-2">
      <svg viewBox="0 0 400 300" className="mx-auto block w-full max-w-[420px]" role="img" aria-label="Indicator breakdown chart">
        {[0.35, 0.6, 0.85, 1].map((f) => (
          <circle key={f} cx={cx} cy={cy} r={maxR * f} fill="none" stroke="#E9E6F0" strokeWidth="1" />
        ))}
        {INDICATOR_CONTENT.map((ind, i) => {
          const level = results[i]?.level ?? 0;
          const r = inner + ((level + 1) / 4) * (maxR - inner);
          const from = -90 + i * 60 + 1.5;
          const to = -30 + i * 60 - 1.5;
          return (
            <path
              key={ind.code}
              d={sectorPath(cx, cy, r, from, to)}
              fill={LEVELS[level].color}
              opacity={0.9}
            />
          );
        })}
        <circle cx={cx} cy={cy} r="7" fill="#fff" stroke="#D8D3E4" strokeWidth="1.5" />
      </svg>

      {INDICATOR_CONTENT.map((ind, i) => {
        const level = results[i]?.level ?? 0;
        return (
          <div
            key={ind.code}
            className="absolute hidden w-[168px] rounded-lg border bg-white px-2.5 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:block"
            style={{ ...LABEL_POS[i].style, borderColor: LEVELS[level].color }}
          >
            <p className="text-[10px] font-extrabold leading-tight text-[#111827]">
              {ind.code} {ind.title}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[9px] font-semibold" style={{ color: LEVELS[level].color }}>
              <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: LEVELS[level].color }} />
              {level + 1}/4 · {LEVELS[level].label}
            </p>
          </div>
        );
      })}

      <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
        {INDICATOR_CONTENT.map((ind, i) => {
          const level = results[i]?.level ?? 0;
          return (
            <div
              key={ind.code}
              className="rounded-lg border bg-white px-2.5 py-1.5"
              style={{ borderColor: LEVELS[level].color }}
            >
              <p className="text-[10px] font-extrabold leading-tight text-[#111827]">
                {ind.code} {ind.title}
              </p>
              <p className="mt-0.5 text-[9px] font-semibold" style={{ color: LEVELS[level].color }}>
                {level + 1}/4 · {LEVELS[level].label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------- Flip card --------------------------------- */

function FlipCard({ index, text }: { index: number; text: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label={`Reveal reflection question ${index + 1}`}
      className="h-[104px] w-full text-left [perspective:1000px]"
    >
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-xl p-4 text-white"
          style={{ backfaceVisibility: "hidden", backgroundColor: PURPLE }}
        >
          <p className="text-[15px] font-extrabold uppercase tracking-wide">Question {index + 1}</p>
          <p className="flex items-center gap-2 text-[10px] font-semibold text-white/80">
            Tap to reveal question... <RefreshCw size={11} />
          </p>
        </div>
        <div
          className="absolute inset-0 flex items-center rounded-xl border-2 bg-white p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderColor: PURPLE }}
        >
          <p className="text-[12px] leading-snug text-[#1f2937]">{text}</p>
        </div>
      </div>
    </button>
  );
}

/* ----------------------------- Indicator card -------------------------------- */

function IndicatorCard({
  content,
  result,
  defaultOpen,
}: {
  content: IndicatorContent;
  result: IndicatorResult;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  return (
    <article className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            {content.code} {content.title}
          </h3>
          <p className="mt-1 text-[12px] text-[#6b7280]">{content.question}</p>
        </div>
        <div className="flex items-center gap-3">
          <LevelPill level={result.level} />
          <Battery level={result.level} />
        </div>
      </div>

      <div className="mt-5 border-t border-black/5 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: PURPLE }}>
          Assessment feedback
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#374151]">{content.feedback[result.level]}</p>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition hover:bg-[#502181]/5"
        style={{ borderColor: "#D8D3E4", color: PURPLE }}
      >
        Read more about this indicator
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-6 space-y-7">
          <div>
            <p className="flex items-center gap-2 text-[13px] font-extrabold text-[#111827]">
              <Info size={15} style={{ color: PURPLE }} /> About This Indicator
            </p>
            <div className="mt-3 rounded-xl bg-[#F6F3FB] p-5">
              <p className="text-[12px] leading-relaxed" style={{ color: PURPLE }}>
                {content.about}
              </p>
            </div>
          </div>

          <div>
            <p className="flex items-center gap-2 text-[13px] font-extrabold text-[#111827]">
              <CircleHelp size={15} style={{ color: PURPLE }} /> Reflection Questions
            </p>
            <div className="mt-3 rounded-xl bg-[#F6F3FB] p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                {content.reflection.map((q, i) => (
                  <FlipCard key={q} index={i} text={q} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="flex items-center gap-2 text-[13px] font-extrabold text-[#111827]">
              <ListChecks size={15} style={{ color: PURPLE }} /> Recommended Action Steps
            </p>
            <div className="mt-3 rounded-xl bg-[#F6F3FB] p-5">
              <ul className="space-y-1">
                {content.actions.map((a, i) => (
                  <li key={a}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition hover:bg-white">
                      <input
                        type="checkbox"
                        checked={!!checked[i]}
                        onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                        className="mt-[2px] h-[15px] w-[15px] shrink-0 cursor-pointer rounded-[3px] border-2 border-[#C9CDD4] accent-[#502181]"
                      />
                      <span
                        className={`text-[12px] leading-snug ${checked[i] ? "text-[#9ca3af] line-through" : "text-[#374151]"}`}
                      >
                        {a}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

/* --------------------------------- Results ---------------------------------- */

export function ResultsStep({ percentages }: { percentages: number[] }) {
  const results: IndicatorResult[] = INDICATOR_CONTENT.map((_, i) => {
    const pct = percentages[i] ?? 0;
    return { pct, level: levelFromPct(pct) };
  });

  const sorted = [...results.map((r, i) => ({ ...r, i }))].sort((a, b) => a.pct - b.pct);
  const best = INDICATOR_CONTENT[sorted[sorted.length - 1].i].title;
  const weakest = sorted.slice(0, 3).map((r) => INDICATOR_CONTENT[r.i].title);

  return (
    <section>
      {/* Area intro */}
      <div className="rounded-2xl border border-[#E3DBF0] bg-[#F7F4FC] p-7">
        <span
          className="inline-block rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white"
          style={{ backgroundColor: PURPLE }}
        >
          Area 1
        </span>
        <h1 className="mt-3 text-[26px] font-extrabold leading-tight" style={{ color: PURPLE }}>
          Representativeness and Inclusion
        </h1>
        <p className="mt-2 max-w-[900px] text-[13px] leading-relaxed text-[#4b5563]">
          Who is part of the LYC, how representative it is of local youth, and how inclusive and accessible participation
          is for all. Below you will find detailed feedback, interactive reflection questions, and recommended immediate
          action steps to support your local council's growth.
        </p>
      </div>

      {/* Results overview */}
      <div className="mt-7 rounded-2xl border border-[#E3DBF0] bg-[#F7F4FC] p-7">
        <h2 className="text-[17px] font-extrabold text-[#111827]">Results Overview</h2>
        <p className="mt-1 text-[12px] text-[#6b7280]">A quick snapshot of your performance across all indicators</p>

        <div className="mt-5 rounded-xl bg-white p-4 ring-1 ring-black/5">
          <RoseChart results={results} />
        </div>

        <div className="mt-6 rounded-xl p-6" style={{ backgroundColor: PURPLE }}>
          <p className="text-[14px] font-extrabold text-white">Where to focus next</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-white/80">
            You're performing well in {best}, but should prioritize improving {weakest.join(", ")}.
          </p>
        </div>
      </div>

      {/* Indicator cards */}
      <div className="mt-10">
        <h2 className="text-[20px] font-extrabold text-[#111827]">Your Results</h2>
        <p className="mt-1 text-[12px] text-[#6b7280]">
          Review your scores and expand the accordions to access tailored improvement tools.
        </p>

        <div className="mt-5 space-y-5">
          {INDICATOR_CONTENT.map((c, i) => (
            <IndicatorCard key={c.code} content={c} result={results[i]} defaultOpen={i === 0} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="mt-10 grid items-center gap-6 overflow-hidden rounded-2xl p-8 md:grid-cols-[minmax(0,1fr)_320px]"
        style={{ backgroundColor: PURPLE }}
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="min-w-[200px]">
            <p className="text-[24px] font-extrabold leading-tight text-white">Ready to take action?</p>
            <p className="mt-2 max-w-[240px] text-[12px] leading-relaxed text-white/75">
              Build your personalized Action Plan based on your assessment results and start improving your LYC.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12px] font-bold transition hover:opacity-90"
            style={{ color: PURPLE }}
          >
            Build your action plan <ArrowRight size={14} />
          </Link>
        </div>
        <img
          src={ctaImg.url}
          alt="Young people collaborating in a local youth council workshop"
          loading="lazy"
          className="h-[170px] w-full rounded-xl object-cover"
        />
      </div>

      <div className="mt-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-[12px] font-bold transition hover:bg-[#502181]/5"
          style={{ borderColor: PURPLE, color: PURPLE }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>
    </section>
  );
}
