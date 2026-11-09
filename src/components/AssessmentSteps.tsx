import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowToGetStartedModal } from "@/components/HowToGetStartedModal";
import step1 from "@/assets/step-1.webp.asset.json";
import step2 from "@/assets/step-2.webp.asset.json";
import step3 from "@/assets/step-3.webp.asset.json";
import step4 from "@/assets/step-4.webp.asset.json";
import actionPhoto from "@/assets/cta-photo.webp.asset.json";

const steps = [
  { title: "Start assessing", body: "Start your assessment without an account. Sign up later, when you are ready to view your full results and save your assessment.", image: step1.url, tone: "steps-purple" },
  { title: "Pick a focus area", body: "Choose one of the four assessment areas to start with. You can always come back and complete the assessment for the other areas as well.", image: step2.url, tone: "steps-teal" },
  { title: "Answer the questionnaire", body: "Assess your Local Youth Council in the chosen area by answering a set of questions. It takes 15-30 minutes to complete one area and you can save your progress anytime.", image: step3.url, tone: "steps-orange" },
  { title: "Review your results", body: "See your visual scoreboard, then sign up or log in to unlock your full results, reflection questions and recommended action steps.", image: step4.url, tone: "steps-pink" },
  { title: "Create your action plan", body: "Select a number of actions that will help your youth council to grow.", image: actionPhoto.url, tone: "steps-plum" },
];

// How long a card sits still before the next one glides in.
const STEP_HOLD_MS = 3400;

export function AssessmentSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const [carouselRef, carousel] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1, duration: 40 });
  const [selected, setSelected] = useState(0);
  const [inView, setInView] = useState(1);
  const [guideStep, setGuideStep] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

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

  const paused = hovering || focused || reducedMotion || pageHidden || !onScreen;

  // Step one card at a time, then wait for the glide to finish before queueing
  // the next one, so the rotation never stacks up behind a manual click.
  useEffect(() => {
    if (!carousel || paused) return;
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => carousel.scrollNext(), STEP_HOLD_MS);
    };
    schedule();
    carousel.on("settle", schedule);
    return () => {
      window.clearTimeout(timer);
      carousel.off("settle", schedule);
    };
  }, [carousel, paused]);

  return (
    <section ref={sectionRef} id="how" className="w-full bg-background py-16 lg:py-24" aria-labelledby="assessment-steps-title">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <div className="max-w-2xl">
          <h2 id="assessment-steps-title" className="section-title text-primary">How to start assessing?</h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">Five simple steps to measure your Local Youth Council's impact, reflect together as a team, and turn results into concrete action.</p>
        </div>

        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}
        >
          <div ref={carouselRef} aria-label="Assessment steps" aria-roledescription="carousel" className="mt-10 overflow-hidden">
            <div className="flex touch-pan-y gap-5">
              {steps.map((step, index) => (
                <article key={step.title} className={`assessment-step-card ${step.tone} relative min-w-0 shrink-0 basis-full overflow-hidden rounded-[28px] p-5 sm:basis-[calc((100%_-_20px)/2.15)] lg:basis-[calc((100%_-_40px)/3.2)]`} aria-label={`Step ${index + 1}: ${step.title}`}>
                  <Button variant="ghost" className="absolute inset-0 z-10 h-full w-full rounded-[28px] hover:bg-transparent focus-visible:ring-inset" aria-label={`Open animated guide: ${step.title}`} onClick={() => { setGuideStep(index); setGuideOpen(true); }} />
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border border-current px-3 py-1 text-xs font-medium">Step {String(index + 1).padStart(2, "0")}</span>
                    <img src={step.image} alt={step.title} loading="lazy" className="h-[146px] w-[46%] rounded-2xl object-cover" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-[22px] font-semibold leading-tight tracking-normal">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-6">
          <p className="hidden shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:block">Step {selected + 1} of {steps.length}</p>
          <div className="flex flex-1 gap-1.5" aria-label="Assessment steps progress">
            {steps.map((step, index) => <span key={step.title} className={`h-1.5 flex-1 rounded-full ${((index - selected + steps.length) % steps.length) < inView ? "bg-secondary" : "bg-muted"}`} />)}
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="h-10 w-10 rounded-full" aria-label="Previous assessment steps" onClick={() => carousel?.scrollPrev()}><ArrowLeft /></Button>
            <Button size="icon" className="h-10 w-10 rounded-full" aria-label="Next assessment steps" onClick={() => carousel?.scrollNext()}><ArrowRight /></Button>
          </div>
        </div>
        <div className="mt-9 flex justify-center"><Button asChild size="lg" className="h-12 rounded-full px-8"><a href="/start-assessing">Start your assessment <ArrowUpRight /></a></Button></div>
        <HowToGetStartedModal open={guideOpen} onOpenChange={setGuideOpen} initialStep={guideStep} />
      </div>
    </section>
  );
}
