import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import step1 from "@/assets/step-1.webp.asset.json";
import step2 from "@/assets/step-2.webp.asset.json";
import step3 from "@/assets/step-3.webp.asset.json";
import step4 from "@/assets/step-4.webp.asset.json";

type Step = {
  n: number;
  title: string;
  body: string;
  color: string;
  poster: string;
  /** Future: animated explainer video for this step. */
  videoUrl?: string;
};

const STEPS: Step[] = [
  {
    n: 1,
    title: "Create your account",
    body: "Your council's results, action plans and reflections are stored securely in one place.",
    color: "var(--impact-purple)",
    poster: step1.url,
  },
  {
    n: 2,
    title: "Pick a focus area",
    body: "Choose one of the IMPACT thematic areas to start with, or work through them all.",
    color: "var(--impact-orange)",
    poster: step2.url,
  },
  {
    n: 3,
    title: "Answer the questionnaire",
    body: "It takes 15–30 minutes and you can save your progress and quit at any point.",
    color: "var(--impact-pink)",
    poster: step3.url,
  },
  {
    n: 4,
    title: "Review your results",
    body: "Get a visual scoreboard and reflection prompts — edit your answers anytime to update them.",
    color: "var(--impact-green)",
    poster: step4.url,
  },
];

export default function OnboardingGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, STEPS.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const isLast = index === STEPS.length - 1;
  const step = STEPS[index];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="How to start assessing"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[900px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.25)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[26px] font-extrabold leading-tight text-[color:var(--impact-ink)] md:text-[30px]">
                How to start assessing?
              </h2>
              <p className="mt-1.5 text-[14px] text-[color:var(--impact-ink-muted)]">
                A short guided tour of the platform, step by step.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close guide"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-[color:var(--impact-ink-muted)] transition hover:bg-black/10"
            >
              <X size={17} />
            </button>
          </div>

          {/* Media / animated explainer */}
          <div className="mt-6 overflow-hidden rounded-2xl bg-[#F4F5F7]">
            {step.videoUrl ? (
              <video
                key={step.videoUrl}
                src={step.videoUrl}
                poster={step.poster}
                className="aspect-video w-full object-cover"
                controls
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="relative aspect-video w-full">
                <img
                  src={step.poster}
                  alt={step.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 text-center text-white">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-[1px]">
                    <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden>
                      <path d="M2 2 L18 11 L2 20 Z" fill="currentColor" />
                    </svg>
                  </span>
                  <p className="text-[13px] font-semibold tracking-wide">
                    Animated video coming soon
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="relative h-[44px] w-[48px] shrink-0">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <path
                  d="M50,8 L90,80 L10,80 Z"
                  fill={step.color}
                  stroke={step.color}
                  strokeWidth="10"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center pt-1.5 text-[15px] font-bold text-white">
                {step.n}
              </span>
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold leading-tight text-[color:var(--impact-ink)]">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[color:var(--impact-ink-muted)]">
                {step.body}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-black/5 px-6 py-5 md:px-9">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.n}
                type="button"
                aria-label={`Go to step ${s.n}`}
                onClick={() => setIndex(i)}
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: i === index ? 22 : 10,
                  backgroundColor:
                    i === index ? "var(--impact-purple)" : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2.5 text-[14px] font-bold text-[color:var(--impact-ink-muted)] transition hover:bg-black/5"
            >
              Skip guide
            </button>
            <button
              type="button"
              onClick={() => (isLast ? onClose() : setIndex((i) => i + 1))}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--impact-purple)] px-6 py-3 text-[14px] font-bold text-white transition hover:opacity-90"
            >
              {isLast ? "Get started" : "Next"}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
