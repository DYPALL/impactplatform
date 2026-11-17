import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowToGetStartedModal } from "@/components/HowToGetStartedModal";
import { useEmblaAutoScroll } from "@/hooks/use-embla-auto-scroll";
import { useAuth } from "@/hooks/use-auth";
import step1 from "@/assets/step-1.webp.asset.json";
import step2 from "@/assets/step-2.webp.asset.json";
import step3 from "@/assets/step-3.webp.asset.json";
import step4 from "@/assets/step-4.webp.asset.json";
import actionPhoto from "@/assets/cta-photo.webp.asset.json";

type Step = { title: string; body: string; bodySignedIn?: string; image: string; tone: string };

const steps: Step[] = [
  { title: "Get started", body: "Jump right in with no account needed. Create a free profile later to save your progress and unlock your full analysis.", image: step1.url, tone: "steps-purple" },
  { title: "Select a focus area", body: "Choose one of the four assessment areas to begin. You can always come back to complete the other three later.", image: step2.url, tone: "steps-teal" },
  { title: "Complete the questionnaire", body: "Reflect through guided questions. It takes 15-30 minutes per area, and you can pause and save anytime.", image: step3.url, tone: "steps-orange" },
  { title: "Check your analysis", body: "View your instant visual scoreboard, then log in or sign up to unlock reflection prompts and tailored recommendations.", bodySignedIn: "View your instant visual scoreboard, reflection prompts and tailored recommendations.", image: step4.url, tone: "steps-pink" },
  { title: "Build your action plan", body: "Pick up to three concrete steps per indicator, assign owners and deadlines, and build a plan your council can follow.", image: actionPhoto.url, tone: "steps-blue" },
];

// The cards glide continuously, so the set is repeated to give the track enough
// length to wrap from the last card back to the first without a visible jump.
const LOOP_REPEAT = 3;
const loopedSteps = Array.from({ length: LOOP_REPEAT }, (_, copy) =>
  steps.map((step, index) => ({ ...step, key: `${copy}-${step.title}`, number: index + 1 })),
).flat();

export function AssessmentSteps() {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const autoScroll = useEmblaAutoScroll(0.8);
  const [carouselRef, carousel] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1, duration: 36 }, [autoScroll.plugin]);
  const [selected, setSelected] = useState(0);
  const [inView, setInView] = useState(1);
  const [guideStep, setGuideStep] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [resumeAfterSettle, setResumeAfterSettle] = useState(false);

  // Count the cards that sit fully inside the viewport. The next card is
  // deliberately left peeking at the edge, so Embla's own partial-aware
  // count would over-report; measuring the rendered boxes is exact.
  const slidesVisible = useCallback(() => {
    if (!carousel) return 1;
    const container = carousel.containerNode();
    const slide = carousel.slideNodes()[0];
    if (!container || !slide) return 1;
    const style = getComputedStyle(container);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    const card = slide.getBoundingClientRect().width;
    const view = container.getBoundingClientRect().width;
    if (!card) return 1;
    return Math.max(1, Math.min(steps.length, Math.floor((view + gap) / (card + gap))));
  }, [carousel]);

  const sync = useCallback(() => {
    if (!carousel) return;
    setSelected(carousel.selectedScrollSnap());
    setInView(slidesVisible());
  }, [carousel, slidesVisible]);

  useEffect(() => {
    if (!carousel) return;
    sync();
    carousel.on("select", sync).on("reInit", sync);
    return () => { carousel.off("select", sync).off("reInit", sync); };
  }, [carousel, sync]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setPageHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // Only turn the cards while the section is actually being looked at.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => setOnScreen(entries.some((entry) => entry.isIntersecting)), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const paused = hovering || focused || reducedMotion || pageHidden || !onScreen || guideOpen;

  // Continuous glide, held still whenever the reader is looking at a card
  // closely, tabbing through it, or has asked for less motion.
  useEffect(() => {
    if (!carousel) return;
    if (paused) autoScroll.stop();
    else autoScroll.play();
    return () => autoScroll.stop();
  }, [carousel, autoScroll, paused]);

  // Resume the glide only after an arrow-triggered scroll has settled, so the
  // manual move finishes cleanly before the continuous scroll takes over.
  useEffect(() => {
    if (!carousel) return;
    const onSettle = () => {
      if (!resumeAfterSettle) return;
      setResumeAfterSettle(false);
      if (!paused) autoScroll.play();
    };
    carousel.on("settle", onSettle);
    return () => { carousel.off("settle", onSettle); };
  }, [carousel, autoScroll, resumeAfterSettle, paused]);

  const nudge = (direction: "prev" | "next") => {
    if (!carousel) return;
    autoScroll.stop();
    if (direction === "prev") carousel.scrollPrev();
    else carousel.scrollNext();
    setResumeAfterSettle(true);
  };

  const current = selected % steps.length;

  return (
    <section ref={sectionRef} id="how" className="w-full bg-background pt-12 pb-16 lg:pt-14 lg:pb-24" aria-labelledby="assessment-steps-title">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <div className="max-w-2xl">
          <h2 id="assessment-steps-title" className="section-title text-primary">How it works?</h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">From self-assessment to action in 5 steps</p>
        </div>

        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}
        >
          <div ref={carouselRef} aria-label="Assessment steps" aria-roledescription="carousel" className="mt-6 overflow-hidden">
            <div className="flex touch-pan-y gap-5">
              {loopedSteps.map((step) => (
                <article key={step.key} className={`assessment-step-card ${step.tone} relative min-w-0 shrink-0 basis-full overflow-hidden rounded-[28px] p-5 sm:basis-[calc((100%_-_20px)/2.15)] lg:basis-[calc((100%_-_40px)/3.2)]`} aria-label={`Step ${step.number}: ${step.title}`}>
                  <Button variant="ghost" className="absolute inset-0 z-10 h-full w-full rounded-[28px] hover:bg-transparent focus-visible:ring-inset" aria-label={`Open animated guide: ${step.title}`} onClick={() => { setGuideStep(step.number - 1); setGuideOpen(true); }} />
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border border-current px-3 py-1 text-xs font-medium">Step {String(step.number).padStart(2, "0")}</span>
                    <img src={step.image} alt={step.title} loading="lazy" className="h-[146px] w-[46%] rounded-2xl object-cover" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-[22px] font-semibold leading-tight tracking-normal">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed">{user ? step.bodySignedIn ?? step.body : step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-6">
          <p className="hidden shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:block">Step {current + 1} of {steps.length}</p>
          <div className="flex flex-1 gap-1.5" aria-label="Assessment steps progress">
            {steps.map((step, index) => <span key={step.title} className={`h-1.5 flex-1 rounded-full ${((index - current + steps.length) % steps.length) < inView ? "bg-secondary" : "bg-muted"}`} />)}
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="h-10 w-10 rounded-full" aria-label="Previous assessment steps" onClick={() => nudge("prev")}><ArrowLeft /></Button>
            <Button size="icon" className="h-10 w-10 rounded-full" aria-label="Next assessment steps" onClick={() => nudge("next")}><ArrowRight /></Button>
          </div>
        </div>
        <div className="mt-9 flex justify-center"><Button asChild size="lg" className="h-12 rounded-full px-8"><a href="/start-assessing">Start your assessment <ArrowUpRight /></a></Button></div>
        <HowToGetStartedModal open={guideOpen} onOpenChange={setGuideOpen} initialStep={guideStep} />
      </div>
    </section>
  );
}
