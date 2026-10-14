import { createFileRoute, Link } from "@tanstack/react-router";
import { AREAS } from "@/lib/areas";
import { Footer } from "@/components/Footer";
import { Polygon } from "@/components/Polygon";

export const Route = createFileRoute("/start-assessing")({
  head: () => ({
    meta: [
      { title: "Start Assessing — IMPACT" },
      {
        name: "description",
        content:
          "Choose one of the four IMPACT assessment areas and start evaluating your Local Youth Council.",
      },
      { property: "og:title", content: "Start Assessing — IMPACT" },
      {
        property: "og:description",
        content:
          "Choose one of the four IMPACT assessment areas and start evaluating your Local Youth Council.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StartAssessing,
});

function StartAssessing() {
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
            <h1 className="text-4xl font-extrabold leading-[1.1] text-white lg:text-[48px]">
              Start Assessing
            </h1>
            <p className="mt-3 max-w-[760px] text-[18px] leading-[1.6] text-white/80">
              Pick one of the four areas below to begin. You can complete them in any order,
              save your progress and come back anytime.
            </p>
          </div>
        </section>

        {/* Area panels: two columns, two rows on desktop */}
        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-[120px]">
          <div className="mx-auto grid max-w-[1180px] gap-6 md:grid-cols-2">
            {AREAS.map((area) => (
              <article
                key={area.key}
                className="flex h-full flex-col rounded-[32px] p-6 md:p-8"
                style={{ backgroundColor: area.panelBg }}
              >
                <span
                  className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide"
                  style={{ backgroundColor: area.softBg, color: area.softText }}
                >
                  {area.badge}
                </span>
                <h2 className="mt-3 text-[22px] font-extrabold leading-snug text-[color:var(--impact-ink)]">
                  {area.title}
                </h2>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[color:var(--impact-ink-muted)]">
                  {area.description}
                </p>
                <Link
                  to="/questionnaire/$area"
                  params={{ area: area.key }}
                  replace
                  className="mt-6 inline-flex w-fit items-center justify-center rounded-full px-7 py-3.5 text-[14px] font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: area.color }}
                >
                  Start this area
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
