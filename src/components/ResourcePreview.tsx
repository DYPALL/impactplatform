import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function ResourcePreview() {
  const autoScroll = useMemo(() => AutoScroll({ speed: 0.8, startDelay: 800, playOnInit: false, stopOnInteraction: false }), []);
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 }, [autoScroll]);
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
  return <section id="resources" className="bg-muted/40">
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-[120px]">
      <div className="max-w-2xl"><h2 className="text-3xl text-primary">Resource Hub</h2><p className="mt-3 text-base leading-relaxed text-muted-foreground">Ideas and practical tools for everyone working with young people: youth councillors, youth workers, municipalities, educators and researchers.</p></div>
      <div className="mt-7 flex justify-end gap-2"><Button variant="default" size="icon" className="h-10 w-10 rounded-full" title="Previous resources" aria-label="Previous resources" onClick={() => { autoScroll.stop(); carousel?.scrollPrev(reducedMotion); if (!hovering && !focused) autoScroll.play(); }}><ArrowLeft /></Button><Button variant="default" size="icon" className="h-10 w-10 rounded-full" title="Next resources" aria-label="Next resources" onClick={() => { autoScroll.stop(); carousel?.scrollNext(reducedMotion); if (!hovering && !focused) autoScroll.play(); }}><ArrowRight /></Button></div>
      <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
      <div ref={viewportRef} aria-label="Featured resources" aria-roledescription="carousel" className="mt-3 overflow-hidden">
      <div className="-ml-6 flex touch-pan-y">
        {data.map(r => <div key={r.id} className="min-w-0 shrink-0 grow-0 basis-[304px] pl-6 md:basis-[344px]"><article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
          {r.image_url ? <img src={r.image_url} alt={r.title} loading="lazy" className="h-[220px] w-full object-cover" /> : <div className="flex h-[220px] items-center justify-center bg-muted"><BookOpen className="h-12 w-12 text-secondary" /></div>}
          <div className="flex flex-1 flex-col p-5"><p className="text-xs capitalize text-muted-foreground">{r.resource_type.replaceAll("_", " ")}</p><h3 className="mt-2 min-h-16 text-lg leading-snug text-foreground">{r.title}</h3>{r.url && <Button asChild variant="link" className="mt-auto px-0 pt-3"><a href={r.url} target="_blank" rel="noopener noreferrer">Open resource <ArrowRight /></a></Button>}</div>
        </article></div>)}
      </div>
      </div>
      </div>
      <div className="mt-9 flex justify-center"><Button asChild size="lg" className="rounded-full px-9"><Link to="/resource-hub">Explore all resources <ArrowRight /></Link></Button></div>
      {isError && <p className="text-sm text-muted-foreground">Resource previews are unavailable right now. Visit the Resource Hub to try again.</p>}
    </div>
  </section>;
}
