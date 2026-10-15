import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { Polygon } from "@/components/Polygon";
import { supabase } from "@/integrations/supabase/client";
import { PublicationMockup } from "@/components/PublicationMockup";

export const Route = createFileRoute("/resource-hub/$id")({
  head: () => ({
    meta: [
      { title: "Resource — IMPACT" },
      { name: "description", content: "Resource details from the IMPACT Resource Hub." },
      { property: "og:title", content: "Resource — IMPACT" },
      { property: "og:description", content: "Resource details from the IMPACT Resource Hub." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResourceDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
      <h1 className="text-2xl font-extrabold text-[#111827]">Resource not found</h1>
      <p className="text-[15px] text-[#6b7280]">This resource may have been removed or the link is incorrect.</p>
      <Link
        to="/resource-hub"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-[color:var(--impact-purple)] px-5 py-2.5 text-[14px] font-bold text-white transition hover:opacity-90"
      >
        Back to Resource Hub
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
      <h1 className="text-2xl font-extrabold text-[#111827]">Something went wrong</h1>
      <p className="text-[15px] text-[#6b7280]">{error instanceof Error ? error.message : String(error)}</p>
      <Link
        to="/resource-hub"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-[color:var(--impact-purple)] px-5 py-2.5 text-[14px] font-bold text-white transition hover:opacity-90"
      >
        Back to Resource Hub
      </Link>
    </div>
  ),
});

type ResourceRow = {
  id: string;
  title: string;
  description: string;
  url: string | null;
  image_url: string | null;
  author: string | null;
  publication_date: string | null;
  resource_type: "publication" | "video" | "guideline_manual";
  area: "representativeness" | "governance" | "empowerment" | "results" | "general";
};

const typeLabel: Record<string, string> = {
  publication: "Publication",
  video: "Video",
  guideline_manual: "Guideline / Manual",
};

const areaLabel: Record<string, { label: string; color: string }> = {
  representativeness: { label: "Representativeness and Inclusion", color: "#502181" },
  governance: { label: "Governance and Transparency", color: "#f4a261" },
  empowerment: { label: "Empowerment and Resources", color: "#e84393" },
  results: { label: "Results and Impact", color: "#219c9e" },
  general: { label: "General", color: "#502181" },
};

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M13 8H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4L3 8L7 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3H21V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ResourceDetailPage() {
  const { id } = Route.useParams();

  const { data: resource, isLoading, isError } = useQuery({
    queryKey: ["resource", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id,title,description,url,image_url,author,publication_date,resource_type,area")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as ResourceRow | null;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-[15px] text-[#6b7280]">Loading resource…</p>
      </div>
    );
  }

  if (isError) {
    throw new Error("Could not load this resource. Please try again.");
  }

  if (!resource) {
    throw notFound();
  }

  const year = resource.publication_date ? new Date(resource.publication_date).getFullYear() : null;
  const area = areaLabel[resource.area] ?? areaLabel.general;
  const metaParts = [resource.author, year ? `Published ${year}` : null].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero */}
        <section className="relative w-full overflow-hidden bg-[color:var(--impact-purple)]">
          <Polygon size={46} rotate={-22} color="rgba(244,162,97,0.75)" style={{ top: 40, right: 120 }} />
          <Polygon size={35} rotate={-18} color="rgba(233,75,138,0.6)" style={{ top: 60, left: "62%" }} />
          <Polygon size={23} rotate={10} color="rgba(255,255,255,0.6)" style={{ top: 90, left: "72%" }} />
          <Polygon size={77} rotate={-22} color="rgba(244,162,97,0.6)" style={{ top: 100, right: 220 }} />

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-10 lg:px-[120px]">
            <Link
              to="/resource-hub"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-white/85 transition hover:text-white"
            >
              <BackIcon />
              Back to Resource Hub
            </Link>
          </div>
        </section>

        {/* Detail */}
        <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[120px] lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
            <div
              className="flex h-fit items-center justify-center overflow-hidden rounded-[16px] py-10"
              style={{ backgroundColor: "rgba(80,33,129,0.06)" }}
            >
              {resource.image_url ? (
                <PublicationMockup key={resource.image_url} src={resource.image_url} title={resource.title} />
              ) : (
                <span className="text-[14px] font-semibold text-[#9ca3af]">No cover available</span>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-fit rounded-full border border-[#e5e7eb] bg-[#eee] px-[10px] py-[6px] text-[12px] font-bold text-[#444]">
                  {typeLabel[resource.resource_type] ?? resource.resource_type.replaceAll("_", " ")}
                </span>
                <span
                  className="w-fit rounded-full px-[10px] py-[6px] text-[12px] font-bold"
                  style={{ backgroundColor: `${area.color}22`, color: area.color }}
                >
                  {area.label}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold leading-[1.15] text-[#111827] lg:text-[40px]">
                {resource.title}
              </h1>

              {metaParts.length > 0 && (
                <p className="text-[15px] font-semibold text-[color:var(--impact-purple)]">
                  {metaParts.join(" · ")}
                </p>
              )}

              <p className="text-[16px] leading-[1.8] text-[#4b5563]">{resource.description}</p>

              <div className="mt-2">
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--impact-purple)] px-6 py-3 text-[15px] font-bold text-white shadow-[0_4px_12px_-4px_rgba(80,33,129,0.35)] transition hover:opacity-90"
                  >
                    Open original resource
                    <ExternalIcon />
                  </a>
                ) : (
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-6 py-3 text-[15px] font-bold text-[#9ca3af]">
                    No link available
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
