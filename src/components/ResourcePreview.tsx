import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PublicationMockup } from "@/components/PublicationMockup";

type AutoScrollPlugin = ReturnType<typeof AutoScroll>;

// The auto-scroll plugin keeps its own reference to the carousel instance and throws
// when play()/stop() run before it has been attached, or after that instance is gone.
// Wrapping it keeps those calls inert outside the window where they are valid.
function useAutoScroll() {
  return useMemo(() => {
    const raw = AutoScroll({ speed: 0.8, startDelay: 800, playOnInit: false, stopOnInteraction: false });
    let attached = false;
    const init: AutoScrollPlugin["init"] = (emblaApi, optionsHandler) => {
      raw.init(emblaApi, optionsHandler);
      attached = true;
    };
    const destroy = () => {
      attached = false;
      raw.destroy();
    };
    const guard = (run: () => void) => () => {
      if (!attached) return;
      try {
        run();
      } catch {
        attached = false;
      }
    };
    return {
      plugin: { ...raw, init, destroy } as AutoScrollPlugin,
      play: guard(() => raw.play()),
      stop: guard(() => raw.stop()),
    };
  }, []);
}

export function ResourcePreview() {
  const autoScroll = useAutoScroll();
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1, duration: 36 }, [autoScroll.plugin]);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { data = [], isError } = useQuery({
    queryKey: ["home-resource-preview"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("id,title,image_url,url,resource_type").eq("published", true).order("created_at", { ascending: false }).limit(8);
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  // Resume auto-scroll only after an arrow-triggered scroll has settled, so the
  // manual glide finishes cleanly before the continuous scroll takes over again.
  const [resumeAfterSettle, setResumeAfterSettle] = useState(false);
  useEffect(() => {
    if (!carousel) return;
    const onSettle = () => {
      if (!resumeAfterSettle) return;
      setResumeAfterSettle(false);
      if (!hovering && !focused && !document.hidden && data.length >= 2) autoScroll.play();
    };
    carousel.on("settle", onSettle);
    return () => { carousel.off("settle", onSettle); };
  }, [carousel, resumeAfterSettle, hovering, focused, autoScroll, data.length]);
  useEffect(() => {
    if (!carousel) return;
    const sync = () => {
      if (hovering || focused || document.hidden || data.length < 2) autoScroll.stop();
      else autoScroll.play();
    };
    sync();
    carousel.on("reInit", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      carousel.off("reInit", sync);
      document.removeEventListener("visibilitychange", sync);
      autoScroll.stop();
    };
  }, [carousel, autoScroll, hovering, focused, reducedMotion, data.length]);
  const cards = data.map(r => <div key={r.id} className="min-w-0 shrink-0 grow-0 basis-[304px] pl-6 md:basis-[344px]"><article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
    {r.image_url ? <PublicationMockup key={r.image_url} src={r.image_url} title={r.title} /> : <div className="flex h-[220px] items-center justify-center bg-muted"><BookOpen className="h-12 w-12 text-secondary" /></div>}
    <div className="flex flex-1 flex-col p-5"><p className="text-xs capitalize text-muted-foreground">{r.resource_type === "guideline_manual" ? "Guideline / Manual" : r.resource_type.replaceAll("_", " ")}</p><h3 className="mt-2 min-h-16 text-lg leading-snug text-foreground">{r.title}</h3>{r.url && <Button asChild variant="outline" className="mt-auto w-fit rounded-full border-2 border-[color:var(--impact-purple)] bg-transparent px-5 py-2.5 text-[14px] font-bold text-[color:var(--impact-purple)] shadow-none hover:bg-[color:var(--impact-purple)] hover:text-white"><a href={r.url} target="_blank" rel="noopener noreferrer">Open resource <ArrowRight /></a></Button>}</div>
  </article></div>);
  const track = <div className="-ml-6 flex touch-pan-y">{cards}</div>;
  return <section id="resources" className="bg-muted/40">
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-[120px]">
      <div className="max-w-2xl"><h2 className="section-title text-primary">Explore the Resource Hub</h2><p className="mt-3 text-base leading-relaxed text-muted-foreground">Discover practical resources to strengthen Local Youth Councils and support meaningful youth participation. Find publications, guidelines, manuals and videos to help you put ideas into practice.</p></div>
      <div className="mt-7 flex justify-end gap-2"><Button variant="default" size="icon" className="h-10 w-10 rounded-full" title="Previous resources" aria-label="Previous resources" onClick={() => { if (!carousel) return; autoScroll.stop(); carousel.scrollPrev(); if (!hovering && !focused && !document.hidden && data.length >= 2) setResumeAfterSettle(true); }}><ArrowLeft /></Button><Button variant="default" size="icon" className="h-10 w-10 rounded-full" title="Next resources" aria-label="Next resources" onClick={() => { if (!carousel) return; autoScroll.stop(); carousel.scrollNext(); if (!hovering && !focused && !document.hidden && data.length >= 2) setResumeAfterSettle(true); }}><ArrowRight /></Button></div>
      <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
        {data.length > 1
          ? <div ref={viewportRef} aria-label="Featured resources" aria-roledescription="carousel" className="mt-3 overflow-hidden">{track}</div>
          : <div aria-label="Featured resources" className="mt-3 overflow-hidden">{track}</div>}
      </div>
      <div className="mt-9 flex justify-center"><Button asChild size="lg" className="rounded-full px-9"><Link to="/resource-hub">Explore all resources <ArrowRight /></Link></Button></div>
      {isError && <p className="text-sm text-muted-foreground">Resource previews are unavailable right now. Visit the Resource Hub to try again.</p>}
    </div>
  </section>;
}
