import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronDown, CircleHelp, Info, ListChecks, RefreshCw } from "lucide-react";
import ctaImg from "@/assets/cta-photo.webp.asset.json";
import { INDICATOR_CONTENT, LEVELS, levelFromPct, type IndicatorContent, type LevelKey } from "./results-data";
import { ScoreMeter } from "./ScoreMeter";

const PURPLE = "#502181";

export type IndicatorResult = { pct: number; level: LevelKey };

/* ------------------------------- Score meter ------------------------------- */

function Battery({ level, className }: { level: LevelKey; className?: string }) {
  return <ScoreMeter level={level} className={className} />;
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

function annularSectorPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  from: number,
  to: number
) {
  const [x1, y1] = polar(cx, cy, rInner, from);
  const [x2, y2] = polar(cx, cy, rOuter, from);
  const [x3, y3] = polar(cx, cy, rOuter, to);
  const [x4, y4] = polar(cx, cy, rInner, to);
  const largeArc = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${x1} ${y1} L ${x2} ${y2} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x1} ${y1} Z`;
}

function RoseChart({ results }: { results: IndicatorResult[] }) {
  const cx = 160;
  const cy = 160;
  const inner = 26;
  const maxR = 116;
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const active = selected ?? hovered;

  return (
    <div className="grid items-center gap-6 md:gap-8 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      {/* Chart */}
      <div className="mx-auto w-full max-w-[260px] sm:max-w-[320px]">
        <svg
          viewBox="-24 -24 368 368"
          className="block w-full overflow-visible"
          role="img"
          aria-label="Indicator breakdown chart"
          onMouseLeave={() => setHovered(null)}
        >
          {/* rings */}
          {[1, 2, 3, 4].map((step) => (
            <circle
              key={step}
              cx={cx}
              cy={cy}
              r={inner + (step / 4) * (maxR - inner)}
              fill="none"
              stroke="#E3DBF0"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}
          {/* spokes */}
          {INDICATOR_CONTENT.map((ind, i) => {
            const [x, y] = polar(cx, cy, maxR, -90 + i * 60);
            return (
              <line
                key={ind.code}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="#E3DBF0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}
          {/* wifi-signal sectors: even angular gaps + radial white space between bands */}
          {INDICATOR_CONTENT.map((ind, i) => {
            const level = results[i]?.level ?? 0;
            const isActive = active === i;
            const isDimmed = active !== null && active !== i;
            const gap = 10; // even degrees of white space between sectors
            const from = -90 + i * 60 + gap / 2;
            const to = -30 + i * 60 - gap / 2;
            const color = LEVELS[level].color;
            const [tx, ty] = polar(cx, cy, maxR + 30, -60 + i * 60);

            const bandCount = 4;
            const bandGap = 5;
            const available = maxR - inner - (bandCount - 1) * bandGap;
            const bandThickness = available / bandCount;
            const activeBoost = isActive ? 5 : 0;
            const bands = Array.from({ length: bandCount }, (_, b) => {
              const r0 = inner + b * (bandThickness + bandGap);
              const r1 = r0 + bandThickness + activeBoost;
              return { r0, r1 };
            });
            const filledBands = level + 1; // 1..4

            return (
              <g
                key={ind.code}
                className="cursor-pointer transition-opacity duration-200"
                onMouseEnter={() => setHovered(i)}
                onClick={() => setSelected((s) => (s === i ? null : i))}
                style={{ opacity: isDimmed ? 0.35 : 1 }}
              >
                {bands.map(({ r0, r1 }, b) => (
                  <path
                    key={b}
                    d={annularSectorPath(cx, cy, r0, b < filledBands ? r1 : r0, from, to)}
                    fill={b < filledBands ? color : "transparent"}
                    opacity={b < filledBands ? (isActive ? 0.95 : 0.6) : 0}
                  />
                ))}
                {isActive && (
                  <path
                    d={annularSectorPath(
                      cx,
                      cy,
                      bands[filledBands - 1].r0,
                      bands[filledBands - 1].r1,
                      from,
                      to
                    )}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}
                {/* code label without triangle badge */}
                <text
                  x={tx}
                  y={ty + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[#502181] text-[11px] font-extrabold"
                >
                  {ind.code}
                </text>
              </g>
            );
          })}
          {/* center */}
          <circle cx={cx} cy={cy} r={inner - 4} fill="#fff" />
        </svg>
      </div>

      {/* Legend */}
      <div className="grid gap-2 sm:grid-cols-2">
        {INDICATOR_CONTENT.map((ind, i) => {
          const level = results[i]?.level ?? 0;
          const c = LEVELS[level].color;
          const isActive = active === i;
          return (
            <button
              key={ind.code}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected((s) => (s === i ? null : i))}
              className={`flex items-center gap-2.5 rounded-xl border bg-white px-2.5 py-2 text-left transition-all duration-200 cursor-pointer sm:gap-3 sm:px-3 sm:py-2.5 ${
                isActive ? "border-[#502181] ring-1 ring-[#502181]" : "border-[#EDEAF3] hover:bg-[#F7F4FC]"
              }`}
            >
              <Battery level={level} className="h-[18px] sm:h-[22px]" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold leading-tight text-[#111827] line-clamp-2">
                  {ind.code} {ind.title}
                </p>
                <span className="text-[10px] font-bold" style={{ color: c }}>
                  {LEVELS[level].label}
                </span>
              </div>
            </button>
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
    <article className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-extrabold text-[#111827] sm:text-[16px]">
            {content.code} {content.title}
          </h3>
          <p className="mt-1 text-[12px] text-[#6b7280]">{content.question}</p>
        </div>
        <div className="flex items-center gap-3">
          <LevelPill level={result.level} />
          <Battery level={result.level} className="h-[28px] sm:h-[38px]" />
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-[13px] font-extrabold text-[#111827]">
                <ListChecks size={15} style={{ color: PURPLE }} /> Recommended Action Steps
              </p>
              <span className="text-[11px] font-semibold" style={{ color: PURPLE }}>
                {Object.values(checked).filter(Boolean).length}/3 selected
              </span>
            </div>
            <p className="mt-1.5 text-[12px] text-[#6b7280]">
              Selected steps will form your custom Action Plan.
            </p>
            <div className="mt-3 rounded-xl bg-[#F6F3FB] p-5">
              <ul className="space-y-1">
                {content.actions.map((a, i) => {
                  const selectedCount = Object.values(checked).filter(Boolean).length;
                  const atLimit = !checked[i] && selectedCount >= 3;
                  return (
                    <li key={a}>
                      <label
                        className={`flex items-start gap-3 rounded-lg px-2 py-2 transition ${atLimit ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-white"}`}
                      >
                        <input
                          type="checkbox"
                          checked={!!checked[i]}
                          disabled={atLimit}
                          onChange={() =>
                            setChecked((c) => {
                              if (c[i]) return { ...c, [i]: false };
                              const count = Object.values(c).filter(Boolean).length;
                              if (count >= 3) return c;
                              return { ...c, [i]: true };
                            })
                          }
                          className="mt-[2px] h-[15px] w-[15px] shrink-0 cursor-pointer rounded-[3px] border-2 border-[#C9CDD4] accent-[#502181] disabled:cursor-not-allowed"
                        />
                        <span
                          className={`text-[12px] leading-snug ${checked[i] ? "text-[#9ca3af] line-through" : "text-[#374151]"}`}
                        >
                          {a}
                        </span>
                      </label>
                    </li>
                  );
                })}
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
      <div className="mt-7 rounded-2xl border border-[#E3DBF0] bg-[#F7F4FC] p-4 sm:p-7">
        <h2 className="text-[17px] font-extrabold text-[#111827]">Results Overview</h2>
        <p className="mt-1 text-[12px] text-[#6b7280]">A quick snapshot of your performance across all indicators</p>

        <div className="mt-5 rounded-xl bg-white p-3 ring-1 ring-black/5 sm:p-4">
          <RoseChart results={results} />
        </div>

        <div className="mt-6 rounded-xl p-5 sm:p-6" style={{ backgroundColor: PURPLE }}>
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
