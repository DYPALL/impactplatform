import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { Polygon } from "@/components/Polygon";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/resource-hub")({
  head: () => ({
    meta: [
      { title: "Resource Hub — IMPACT" },
      { name: "description", content: "Practical resources, publications, videos and templates for Local Youth Councils." },
      { property: "og:title", content: "Resource Hub — IMPACT" },
      { property: "og:description", content: "Practical resources, publications, videos and templates for Local Youth Councils." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourceHubPage,
});

type ResourceRow = {
  id: string;
  title: string;
  description: string;
  url: string | null;
  image_url: string | null;
  author: string | null;
  publication_date: string | null;

  resource_type: "publication" | "video" | "template" | "session_outline" | "document";
  area: "representativeness" | "governance" | "empowerment" | "results" | "general";
};

type AreaKey = "all" | ResourceRow["area"];
type TypeKey = "all" | ResourceRow["resource_type"];
type SortKey = "year_desc" | "year_asc" | "title_asc" | "title_desc";

const areaFilters: { key: AreaKey; label: string; color: string }[] = [
  { key: "all", label: "All", color: "#502181" },
  { key: "representativeness", label: "Representativeness and Inclusion", color: "#502181" },
  { key: "governance", label: "Governance and Transparency", color: "#f4a261" },
  { key: "empowerment", label: "Empowerment and Resources", color: "#e84393" },
  { key: "results", label: "Results and Impact", color: "#219c9e" },
];

const typeFilters: { key: TypeKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "publication", label: "Publications" },
  { key: "video", label: "Videos" },
  { key: "template", label: "Templates" },
  { key: "session_outline", label: "Session Outlines" },
  { key: "document", label: "Documents" },
];

const typeLabel: Record<ResourceRow["resource_type"], string> = {
  publication: "Publication",
  video: "Video",
  template: "Template",
  session_outline: "Session Outline",
  document: "Document",
};

const typeStyle: Record<
  ResourceRow["resource_type"],
  { bg: string; icon: "publication" | "video" | "file" }
> = {
  publication: { bg: "rgba(232,67,147,0.15)", icon: "publication" },
  video: { bg: "rgba(80,33,129,0.10)", icon: "video" },
  template: { bg: "rgba(244,162,97,0.15)", icon: "file" },
  session_outline: { bg: "rgba(80,33,129,0.10)", icon: "publication" },
  document: { bg: "rgba(33,156,158,0.10)", icon: "file" },
};

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 17.5L13.875 13.875" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="#502181" strokeWidth="1.8" />
      <path d="M10 9L15 12L10 15V9Z" fill="#502181" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#219c9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="#219c9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PublicationIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19.5C4 18.5717 4.36875 17.6815 5.02513 17.0251C5.6815 16.3687 6.57174 16 7.5 16H20" stroke="#e84393" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 16H20V4H7.5C6.57174 4 5.6815 4.36875 5.02513 5.02513C4.36875 5.6815 4 6.57174 4 7.5V19.5C4 18.5717 4.36875 17.6815 5.02513 17.0251C5.6815 16.3687 6.57174 16 7.5 16Z" stroke="#e84393" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight({ color = "#502181" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8H13" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4L13 8L9 12" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ResourceCard({ resource }: { resource: ResourceRow }) {
  const style = typeStyle[resource.resource_type];
  return (
    <article className="flex flex-col overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.05)]">
      <div className="relative flex min-h-[220px] w-full items-center justify-center overflow-hidden" style={{ backgroundColor: style.bg }}>
        {resource.image_url ? (
          <img src={resource.image_url} alt={resource.title} loading="lazy" className="mx-auto h-auto max-h-[280px] w-full object-contain" />
        ) : (
          <div className="flex h-[220px] items-center justify-center">
            {style.icon === "publication" && <PublicationIcon />}
            {style.icon === "video" && <VideoIcon />}
            {style.icon === "file" && <FileIcon />}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-[10px] p-[20px]">
        <span className="w-fit rounded-full border border-[#e5e7eb] bg-[#eee] px-[10px] py-[6px] text-[12px] font-bold text-[#444]">
          {typeLabel[resource.resource_type]}
        </span>
        <h3 className="text-[18px] font-bold text-[#111827]">{resource.title}</h3>
        <p className="flex-1 text-[14px] leading-[1.6] text-[#6b7280]">{resource.description}</p>
        {resource.url ? (
          <a href={resource.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5">
            <span className="text-[14px] font-bold text-[color:var(--impact-purple)] underline">View Resource</span>
            <ArrowRight />
          </a>
        ) : (
          <div className="mt-2 inline-flex items-center gap-1.5 opacity-60">
            <span className="text-[14px] font-bold text-[color:var(--impact-purple)] underline">View Resource</span>
            <ArrowRight />
          </div>
        )}
      </div>
    </article>
  );
}

function ResourceHubPage() {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState<AreaKey>("all");
  const [type, setType] = useState<TypeKey>("all");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id,title,description,url,image_url,resource_type,area")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ResourceRow[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((r) => {
      if (area !== "all" && r.area !== area) return false;
      if (type !== "all" && r.resource_type !== type) return false;
      if (q && !`${r.title} ${r.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [resources, search, area, type]);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero */}
        <section className="relative w-full overflow-hidden bg-[color:var(--impact-purple)]">
          <Polygon size={46} rotate={-22} color="rgba(244,162,97,0.75)" style={{ top: 104, right: 120 }} />
          <Polygon size={35} rotate={-18} color="rgba(233,75,138,0.6)" style={{ top: 111, left: "62%" }} />
          <Polygon size={23} rotate={10} color="rgba(255,255,255,0.6)" style={{ top: 133, left: "72%" }} />
          <Polygon size={77} rotate={-22} color="rgba(244,162,97,0.6)" style={{ top: 155, right: 220 }} />
          <Polygon size={57} rotate={10} color="rgba(233,75,138,0.55)" style={{ top: 184, left: "68%" }} />
          <Polygon size={44} rotate={12} color="rgba(255,255,255,0.5)" style={{ top: 210, left: "58%" }} />
          <Polygon size={29} rotate={14} color="rgba(33,156,158,0.7)" style={{ top: 260, right: 120 }} />
          <Polygon size={54} rotate={-8} color="rgba(255,255,255,0.4)" style={{ top: 292, right: 240 }} />
          <Polygon size={137} rotate={28} color="rgba(244,162,97,0.5)" style={{ top: 275, left: "65%" }} />

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-14 lg:px-[120px] lg:py-[56px]">
            <h1 className="text-4xl font-extrabold leading-[1.1] text-white lg:text-[48px]">Resource Hub</h1>
            <p className="mt-3 max-w-[760px] text-[18px] leading-[1.6] text-white/80">
              Explore publications, videos, templates and session outlines to support your Local Youth Council's work — filter by area of impact or by resource type.
            </p>
          </div>
        </section>

        {/* Search and filters */}
        <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[120px]">
          <div className="flex h-[56px] items-center gap-3 rounded-[16px] border border-[#e5e7eb] px-4">
            <SearchIcon />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword..."
              className="flex-1 bg-transparent text-[15px] text-[#111827] placeholder-[#9ca3af] outline-none"
            />
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[14px] font-bold text-[#111827]">Area</span>
              {areaFilters.map((f) => {
                const active = area === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setArea(f.key)}
                    className="rounded-full px-[14px] py-[10px] text-[14px] font-bold transition"
                    style={
                      active
                        ? { backgroundColor: f.color, color: "#ffffff", boxShadow: "0 0 0 3px rgba(0,0,0,0.08)" }
                        : { backgroundColor: `${f.color}22`, color: f.color }
                    }
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[14px] font-bold text-[#111827]">Type</span>
              {typeFilters.map((f) => {
                const active = type === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setType(f.key)}
                    className={
                      active
                        ? "rounded-full bg-[#502181] px-[14px] py-[10px] text-[14px] font-bold text-white transition"
                        : "rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-[14px] py-[10px] text-[14px] font-bold text-[#6b7280] transition hover:bg-[#e5e7eb]"
                    }
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Resources grid */}
        <section className="mx-auto max-w-[1440px] px-6 pb-16 lg:px-[120px]">
          {isLoading ? (
            <p className="text-center text-[15px] text-[#6b7280]">Loading resources…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-[#e5e7eb] p-12 text-center">
              <p className="text-[16px] font-bold text-[#111827]">No resources match your filters</p>
              <p className="mt-2 text-[14px] text-[#6b7280]">Try clearing your search or selecting a different area or type.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
