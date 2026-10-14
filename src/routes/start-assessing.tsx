import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AREAS } from "@/lib/areas";
import { useAuth } from "@/hooks/use-auth";

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
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[color:var(--impact-surface)]">
      <section className="mx-auto max-w-[1440px] px-6 pb-24 pt-16 lg:px-[120px] lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[color:var(--impact-purple)]/10 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wide text-[color:var(--impact-purple)]">
            Assessment Tool
          </span>
          <h1 className="mt-5 font-[Work_Sans] text-4xl font-bold leading-tight text-[color:var(--impact-ink)] lg:text-5xl">
            Start assessing your Local Youth Council
          </h1>
          <p className="mt-4 text-lg text-[color:var(--impact-ink-soft)]">
            Pick one of the four areas below to begin. You can complete them in any order,
            save your progress and come back anytime.
            {!user && (
              <>
                {" "}
                No account needed to start — you'll only be asked to Sign-up when you want
                to see your full results.
              </>
            )}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {AREAS.map((area) => (
            <Link
              key={area.key}
              to="/questionnaire/$area"
              params={{ area: area.key }}
              className="group flex flex-col rounded-3xl border border-[color:var(--impact-border)] bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                className="inline-flex w-fit rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wide"
                style={{ backgroundColor: area.softBg, color: area.softText }}
              >
                {area.badge}
              </span>
              <h2 className="mt-4 font-[Work_Sans] text-2xl font-bold text-[color:var(--impact-ink)]">
                {area.title}
              </h2>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[color:var(--impact-ink-soft)]">
                {area.description}
              </p>
              <span
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold text-white transition group-hover:gap-3"
                style={{ backgroundColor: area.color }}
              >
                Start this area
                <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
