import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AREAS } from "@/lib/areas";
import { useAuth } from "@/hooks/use-auth";
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

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke="#502181" strokeWidth="1.6" />
      <path d="M10 9V14" stroke="#502181" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="6.4" r="1" fill="#502181" />
    </svg>
  );
}

function AreaCard({ area }: { area: (typeof AREAS)[number] }) {
  const number = area.badge.replace(/\D/g, "");

  return (
    <Link
      to="/questionnaire/$area"
      params={{ area: area.key }}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.12)]"
    >
      <div
        className="relative flex h-[132px] items-center justify-center overflow-hidden"
        style={{ backgroundColor: area.softBg }}
      >
        <span
          className="font-[Work_Sans] text-[68px] font-extrabold leading-none opacity-90"
          style={{ color: area.color }}
        >
          {number}
        </span>
        <span
          className="absolute bottom-0 left-0 h-[6px] w-full"
          style={{ backgroundColor: area.color }}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span
          className="inline-block w-fit rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: area.softBg, color: area.softText }}
        >
          {area.badge}
        </span>
        <h2 className="mt-3 font-[Work_Sans] text-[22px] font-bold leading-snug text-[#111827]">
          {area.title}
        </h2>
        <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-[#6b7280]">
          {area.description}
        </p>
        <span
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-[10px] text-[14px] font-bold text-white transition group-hover:gap-3"
          style={{ backgroundColor: area.color }}
        >
          Start this area
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

function StartAssessing() {
  const { user } = useAuth();

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

        {/* Note bar */}
        <section className="mx-auto max-w-[1440px] px-4 pt-8 sm:px-6 sm:pt-12 lg:px-[120px]">
          <div className="flex h-[48px] items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:h-[56px] sm:rounded-[16px] sm:px-4">
            <InfoIcon />
            <p className="text-[14px] text-[#374151] sm:text-[15px]">
              {user
                ? "Your results are saved to your account as you go."
                : "No account needed to start — you'll only be asked to Sign-up when you want to see your full results."}
            </p>
          </div>
        </section>

        {/* Area cards */}
        <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-[120px]">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
            <span className="text-[13px] font-bold text-[#111827] sm:text-[14px]">
              Assessment areas
            </span>
            <span className="text-[13px] font-semibold text-[#6b7280]">
              {AREAS.length} areas available
            </span>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {AREAS.map((area) => (
              <AreaCard key={area.key} area={area} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
