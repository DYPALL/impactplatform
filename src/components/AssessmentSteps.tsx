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
  { title: "Start assessing", body: "Choose your starting point. Create an account when you are ready to unlock your full results and save your progress.", image: step1.url, tone: "steps-purple" },
  { title: "Pick a focus area", body: "Choose one of the IMPACT thematic areas to start with, or run the full self-assessment across all dimensions.", image: step2.url, tone: "steps-teal" },
  { title: "Answer the questionnaire", body: "Rate your council against each indicator. It takes 15–30 minutes and you can save your progress anytime.", image: step3.url, tone: "steps-orange" },
  { title: "Review your results", body: "Explore your visual scoreboard, then Sign-up for detailed feedback and reflection questions saved to your account.", image: step4.url, tone: "steps-pink" },
  { title: "Build your action plan", body: "Select your next steps, set a goal and organise who will do what, when and with which resources.", image: actionPhoto.url, tone: "steps-plum" },
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
            <p className="text-sm leading-relaxed text-muted-foreground">Five simple steps to measure your Local Youth Council's impact, reflect together as a team, and turn results into concrete action.</p>
          </div>
          <h2 id="assessment-steps-title" className="text-4xl leading-[1.1] tracking-normal text-[color:var(--impact-purple)] lg:text-5xl">How to start assessing?</h2>
        </div>

        <div ref={carouselRef} className="mt-10 overflow-hidden">
          <div className="flex touch-pan-y gap-5">
            {steps.map((step, index) => (
              <article key={step.title} className={`assessment-step-card ${step.tone} relative min-w-0 shrink-0 basis-full overflow-hidden rounded-[28px] p-5 sm:basis-[calc((100%_-_20px)/2)] lg:basis-[calc((100%_-_40px)/3)]`} aria-label={`Step ${index + 1}: ${step.title}`}>
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