import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function ResourcePreview() {
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
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
    if (!carousel || paused || interacting || reducedMotion || data.length < 2) return;
    const timer = window.setInterval(() => { if (!document.hidden) carousel.scrollNext(); }, 4000);
    return () => window.clearInterval(timer);
  }, [carousel, paused, interacting, reducedMotion, data.length]);
  return <section id="resources" className="bg-muted/40">
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-[120px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl"><h2 className="text-3xl text-primary">Resource Hub</h2><p className="mt-3 text-base leading-relaxed text-muted-foreground">Ideas and practical tools for everyone working with young people: youth councillors, youth workers, municipalities, educators and researchers.</p></div>
        <Button asChild><Link to="/resource-hub">Explore all resources <ArrowRight /></Link></Button>
      </div>
      <div onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }}>
      <div className="mt-7 flex justify-end gap-2">{!reducedMotion && <Button variant="outline" size="icon" title={paused ? "Play carousel" : "Pause carousel"} aria-label={paused ? "Play carousel" : "Pause carousel"} onClick={() => setPaused(value => !value)}>{paused ? <Play /> : <Pause />}</Button>}<Button variant="outline" size="icon" title="Previous resources" aria-label="Previous resources" onClick={() => carousel?.scrollPrev(reducedMotion)}><ArrowLeft /></Button><Button variant="outline" size="icon" title="Next resources" aria-label="Next resources" onClick={() => carousel?.scrollNext(reducedMotion)}><ArrowRight /></Button></div>
      <div ref={viewportRef} aria-label="Featured resources" aria-roledescription="carousel" className="mt-3 overflow-hidden">
      <div className="-ml-6 flex touch-pan-y">
        {data.map(r => <div key={r.id} className="min-w-0 shrink-0 grow-0 basis-[304px] pl-6 md:basis-[344px]"><article className="h-full overflow-hidden rounded-lg border border-border bg-card">
          {r.image_url ? <img src={r.image_url} alt={r.title} loading="lazy" className="h-[220px] w-full object-cover" /> : <div className="flex h-[220px] items-center justify-center bg-muted"><BookOpen className="h-12 w-12 text-secondary" /></div>}
          <div className="p-5"><p className="text-xs capitalize text-muted-foreground">{r.resource_type.replaceAll("_", " ")}</p><h3 className="mt-2 min-h-16 text-lg leading-snug text-foreground">{r.title}</h3>{r.url && <Button asChild variant="link" className="mt-3 px-0"><a href={r.url} target="_blank" rel="noopener noreferrer">Open resource <ArrowRight /></a></Button>}</div>
        </article></div>)}
      </div>
      </div>
      </div>
      {isError && <p className="text-sm text-muted-foreground">Resource previews are unavailable right now. Visit the Resource Hub to try again.</p>}
    </div>
  </section>;
}