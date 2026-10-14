import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorialSlot } from "@/components/TutorialSlot";
import step1 from "@/assets/step-1.webp.asset.json";
import step2 from "@/assets/step-2.webp.asset.json";
import step3 from "@/assets/step-3.webp.asset.json";
import step4 from "@/assets/step-4.webp.asset.json";
import actionPhoto from "@/assets/cta-photo.webp.asset.json";

const steps = [
  { title: "Start assessing", body: "Take a fresh look at your Local Youth Council. Start with where you are today.", image: step1.url, tone: "steps-mint" },
  { title: "Choose your focus", body: "Pick one thematic area, or explore all four to see the bigger picture.", image: step2.url, tone: "steps-peach" },
  { title: "Share your answers", body: "Reflect together and rate each indicator. Allow 15–30 minutes for your questionnaire.", image: step3.url, tone: "steps-blue" },
  { title: "Discover your results", body: "See your scoreboard. Sign-up to unlock detailed feedback and reflection questions.", image: step4.url, tone: "steps-rose" },
  { title: "Plan your next steps", body: "Choose actions, set a goal and agree who will do what, when and with which resources.", image: actionPhoto.url, tone: "steps-lilac" },
];

export function AssessmentSteps() {
  const [carouselRef, carousel] = useEmblaCarousel({ align: "start", duration: 40, containScroll: "trimSnaps" });
  const [selected, setSelected] = useState(0);
  const [canNext, setCanNext] = useState(true);
  const sync = useCallback(() => {
    if (!carousel) return;
    setSelected(carousel.selectedScrollSnap());
    setCanNext(carousel.canScrollNext());
  }, [carousel]);
  useEffect(() => {
    if (!carousel) return;
    sync();
    carousel.on("select", sync).on("reInit", sync);
    return () => { carousel.off("select", sync).off("reInit", sync); };
  }, [carousel, sync]);

  return (
    <section id="how" className="w-full bg-background py-16 lg:py-24" aria-labelledby="assessment-steps-title">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <div className="grid items-end gap-6 md:grid-cols-[1fr_1.3fr] md:gap-16">
          <div className="max-w-[340px]">
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground" aria-hidden="true"><ArrowUpRight size={20} /></span>
            <p className="text-sm leading-relaxed text-muted-foreground">From your first answers to your next actions. Five steps to reflect together and strengthen your Local Youth Council.</p>
          </div>
          <h2 id="assessment-steps-title" className="text-4xl leading-[1.1] tracking-normal text-foreground lg:text-5xl">Your impact,<br />step by step.</h2>
        </div>

        <div ref={carouselRef} className="mt-10 overflow-hidden">
          <div className="flex touch-pan-y gap-5">
            {steps.map((step, index) => (
              <article key={step.title} className={`assessment-step-card ${step.tone} relative min-w-0 shrink-0 basis-full overflow-hidden rounded-[28px] p-5 sm:basis-[calc((100%-20px)/2)] xl:basis-[calc((100%-40px)/3)]`} aria-label={`Step ${index + 1}: ${step.title}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-current px-3 py-1 text-xs font-medium">Step {String(index + 1).padStart(2, "0")}</span>
                  <img src={step.image} alt={step.title} loading="lazy" className="h-[146px] w-[46%] rounded-2xl object-cover" />
                </div>
                <div className="mt-4">
                  <h3 className="text-[22px] font-semibold leading-tight tracking-normal">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
                </div>
                {index === 4 && <TutorialSlot tutorial="actionPlan" />}
              </article>
            ))}
          </div>
        </div>

        <div className="mt-7 flex items-center gap-6">
          <div className="flex flex-1 gap-1.5" aria-label="Assessment steps progress">
            {steps.map((step, index) => <span key={step.title} className={`h-1.5 flex-1 rounded-full ${index >= selected && index < selected + (carousel?.slidesInView().length || 1) ? "bg-secondary" : "bg-muted"}`} />)}
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="h-10 w-10 rounded-full" aria-label="Previous assessment steps" disabled={selected === 0} onClick={() => carousel?.scrollPrev()}><ArrowLeft /></Button>
            <Button size="icon" className="h-10 w-10 rounded-full" aria-label="Next assessment steps" disabled={!canNext} onClick={() => carousel?.scrollNext()}><ArrowRight /></Button>
          </div>
        </div>
        <div className="mt-9 flex justify-center"><Button asChild size="lg" className="h-12 rounded-full px-8"><a href="/start-assessing">Start your assessment <ArrowUpRight /></a></Button></div>
      </div>
    </section>
  );
}