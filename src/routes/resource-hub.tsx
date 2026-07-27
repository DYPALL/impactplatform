import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Polygon } from "@/components/Polygon";

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

const areaFilters = [
  { label: "All", color: "#502181" },
  { label: "Representativeness and Inclusion", color: "#502181" },
  { label: "Governance and Transparency", color: "#f4a261" },
  { label: "Empowerment and Resources", color: "#e84393" },
  { label: "Results and Impact", color: "#219c9e" },
];

const typeFilters = [
  { label: "All", active: true },
  { label: "Publications", active: false },
  { label: "Videos", active: false },
  { label: "Templates", active: false },
  { label: "Session Outlines", active: false },
];

const resources = [
  {
    id: 1,
    type: "Publication",
    title: "Lorem ipsum dolor sit amet",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    bg: "rgba(232,67,147,0.15)",
    icon: "publication",
  },
  {
    id: 2,
    type: "Video",
    title: "Lorem ipsum dolor sit amet",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    bg: "rgba(80,33,129,0.1)",
    icon: "video",
  },
  {
    id: 3,
    type: "Document",
    title: "Lorem ipsum dolor sit amet",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    bg: "rgba(33,156,158,0.1)",
    icon: "file",
  },
  {
    id: 4,
    type: "Publication",
    title: "Lorem ipsum dolor sit amet",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    bg: "rgba(232,67,147,0.15)",
    icon: "publication",
  },
  {
    id: 5,
    type: "Video",
    title: "Lorem ipsum dolor sit amet",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    bg: "rgba(80,33,129,0.1)",
    icon: "video",
  },
  {
    id: 6,
    type: "Document",
    title: "Lorem ipsum dolor sit amet",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    bg: "rgba(33,156,158,0.1)",
    icon: "file",
  },
];

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
        stroke="#9ca3af"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 17.5L13.875 13.875"
        stroke="#9ca3af"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="#219c9e"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke="#219c9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 18V12" stroke="#219c9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15H15" stroke="#219c9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PublicationIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19.5C4 18.5717 4.36875 17.6815 5.02513 17.0251C5.6815 16.3687 6.57174 16 7.5 16H20"
        stroke="#e84393"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 16H20V4H7.5C6.57174 4 5.6815 4.36875 5.02513 5.02513C4.36875 5.6815 4 6.57174 4 7.5V19.5C4 18.5717 4.36875 17.6815 5.02513 17.0251C5.6815 16.3687 6.57174 16 7.5 16Z"
        stroke="#e84393"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8H13" stroke="#502181" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4L13 8L9 12" stroke="#502181" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M13 8H3" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4L3 8L7 12" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ResourceCard({ resource }: { resource: typeof resources[0] }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.05)]">
      <div
        className="relative flex h-[340px] w-full items-center justify-center overflow-hidden"
        style={{ backgroundColor: resource.bg }}
      >
        {resource.icon === "publication" && <PublicationIcon />}
        {resource.icon === "video" && <VideoIcon />}
        {resource.icon === "file" && <FileIcon />}
      </div>
      <div className="flex flex-col gap-[10px] p-[20px]">
        <span className="w-fit rounded-full border border-[#e5e7eb] bg-[#eee] px-[10px] py-[6px] text-[12px] font-bold text-[#444]">
          {resource.type}
        </span>
        <h3 className="text-[18px] font-bold text-[#111827]">{resource.title}</h3>
        <p className="text-[14px] leading-[1.6] text-[#6b7280]">{resource.body}</p>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[14px] font-bold text-[color:var(--impact-purple)] underline">
            View Resource
          </span>
          <ArrowRight />
        </div>
      </div>
    </article>
  );
}

function ResourceHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

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
            <h1 className="text-4xl font-extrabold leading-[1.1] text-white lg:text-[48px]">
              Resource Hub
            </h1>
            <p className="mt-3 max-w-[760px] text-[18px] leading-[1.6] text-white/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </section>

        {/* Search and filters */}
        <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[120px]">
          <div className="flex h-[56px] items-center gap-3 rounded-[16px] border border-[#e5e7eb] px-4">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by keyword..."
              className="flex-1 bg-transparent text-[15px] text-[#111827] placeholder-[#9ca3af] outline-none"
            />
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[14px] font-bold text-[#111827]">Area</span>
              {areaFilters.map((f) => (
                <button
                  key={f.label}
                  className="rounded-full px-[14px] py-[10px] text-[14px] font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: f.color }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[14px] font-bold text-[#111827]">Type</span>
              {typeFilters.map((f) =>
                f.active ? (
                  <button
                    key={f.label}
                    className="rounded-full bg-[#502181] px-[14px] py-[10px] text-[14px] font-bold text-white transition hover:opacity-90"
                  >
                    {f.label}
                  </button>
                ) : (
                  <button
                    key={f.label}
                    className="rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-[14px] py-[10px] text-[14px] font-bold text-[#6b7280] transition hover:bg-[#e5e7eb]"
                  >
                    {f.label}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* Resources grid */}
        <section className="mx-auto max-w-[1440px] px-6 pb-16 lg:px-[120px]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2.5">
            <button className="flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white px-[14px] py-[10px] text-[14px] font-bold text-[#6b7280] transition hover:bg-[#f3f4f6]">
              <ArrowLeft />
              Previous
            </button>
            <button className="rounded-full bg-[#502181] px-[16px] py-[10px] text-[14px] font-bold text-white">
              1
            </button>
            <button className="rounded-full border border-[#e5e7eb] bg-white px-[16px] py-[10px] text-[14px] font-bold text-[#6b7280] transition hover:bg-[#f3f4f6]">
              2
            </button>
            <button className="rounded-full border border-[#e5e7eb] bg-white px-[16px] py-[10px] text-[14px] font-bold text-[#6b7280] transition hover:bg-[#f3f4f6]">
              3
            </button>
            <button className="rounded-full border border-[#e5e7eb] bg-white px-[14px] py-[10px] text-[14px] font-bold text-[#6b7280] transition hover:bg-[#f3f4f6]">
              ...
            </button>
            <button className="flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white px-[14px] py-[10px] text-[14px] font-bold text-[#6b7280] transition hover:bg-[#f3f4f6]">
              Next
              <ArrowRight />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
