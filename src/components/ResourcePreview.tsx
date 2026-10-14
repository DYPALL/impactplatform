import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TutorialSlot } from "@/components/TutorialSlot";

export function ResourcePreview() {
  const track = useRef<HTMLDivElement>(null);
  const { data = [], isError } = useQuery({
    queryKey: ["home-resource-preview"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("id,title,image_url,url,resource_type").eq("published", true).order("created_at", { ascending: false }).limit(8);
      if (error) throw error;
      return data;
    },
  });
  const scroll = (direction: number) => track.current?.scrollBy({ left: direction * (track.current.clientWidth || 600), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return <section id="resources" className="bg-muted/40">
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-[120px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl"><h2 className="text-3xl text-primary">Resource Hub</h2><p className="mt-3 text-base leading-relaxed text-muted-foreground">Ideas and practical tools for everyone working with young people: youth councillors, youth workers, municipalities, educators and researchers.</p></div>
        <Button asChild><Link to="/resource-hub">Explore all resources <ArrowRight /></Link></Button>
      </div>
      <div className="mt-7 flex justify-end gap-2"><Button variant="outline" size="icon" title="Previous resources" aria-label="Previous resources" onClick={() => scroll(-1)}><ArrowLeft /></Button><Button variant="outline" size="icon" title="Next resources" aria-label="Next resources" onClick={() => scroll(1)}><ArrowRight /></Button></div>
      <div ref={track} aria-label="Featured resources" className="mt-3 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
        {data.map(r => <article key={r.id} className="w-[280px] shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-card md:w-[320px]">
          {r.image_url ? <img src={r.image_url} alt={r.title} loading="lazy" className="h-[220px] w-full object-cover" /> : <div className="flex h-[220px] items-center justify-center bg-muted"><BookOpen className="h-12 w-12 text-secondary" /></div>}
          <div className="p-5"><p className="text-xs capitalize text-muted-foreground">{r.resource_type.replaceAll("_", " ")}</p><h3 className="mt-2 min-h-16 text-lg leading-snug text-foreground">{r.title}</h3>{r.url && <Button asChild variant="link" className="mt-3 px-0"><a href={r.url} target="_blank" rel="noopener noreferrer">Open resource <ArrowRight /></a></Button>}</div>
        </article>)}
      </div>
      {isError && <p className="text-sm text-muted-foreground">Resource previews are unavailable right now. Visit the Resource Hub to try again.</p>}
      <TutorialSlot tutorial="resources" />
    </div>
  </section>;
}