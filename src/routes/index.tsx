import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-photo.webp.asset.json";
import ctaImg from "@/assets/cta-photo.webp.asset.json";
import step1Img from "@/assets/step-1.webp.asset.json";
import step2Img from "@/assets/step-2.webp.asset.json";
import step3Img from "@/assets/step-3.webp.asset.json";
import step4Img from "@/assets/step-4.webp.asset.json";
import dypallLogo from "@/assets/DYPALL-logo.png.asset.json";
import bataljongLogo from "@/assets/Bataljong-logo.png.asset.json";
import fundacioLogo from "@/assets/Fundacio-logo.png.asset.json";
import nuvaLogo from "@/assets/Nuva-logo.png.asset.json";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Polygon } from "@/components/Polygon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IMPACT — Digital platform for Local Youth Councils" },
      {
        name: "description",
        content:
          "IMPACT helps Local Youth Councils measure their impact, identify opportunities for growth, and access practical guidance and resources.",
      },
      { property: "og:title", content: "IMPACT — Digital platform for Local Youth Councils" },
      {
        property: "og:description",
        content:
          "Assess, reflect and act. A comprehensive platform for Local Youth Councils to measure impact and plan next steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--impact-purple)" }}
    >
      {/* Floating polygons */}
      <Polygon size={78} rotate={-18} color="rgba(255,255,255,0.18)" style={{ top: 10, left: "52%" }} />
      <Polygon size={48} rotate={42} color="rgba(244,162,97,0.55)" style={{ top: 160, left: "66%" }} />
      <Polygon size={102} rotate={-12} color="rgba(255,255,255,0.12)" style={{ top: 42, left: "80%" }} />
      <Polygon size={57} rotate={-28} color="rgba(233,75,138,0.5)" style={{ top: 260, left: "90%" }} />
      <Polygon size={54} rotate={92} color="rgba(255,255,255,0.14)" style={{ top: 467, left: "76%" }} />
      <Polygon size={37} rotate={-45} color="rgba(244,162,97,0.6)" style={{ top: 80, right: 40 }} />
      <Polygon size={107} rotate={38} color="rgba(255,255,255,0.10)" style={{ top: 17, left: 35 }} />
      <Polygon size={36} rotate={-10} color="rgba(233,75,138,0.45)" style={{ top: 480, left: 70 }} />
      <Polygon size={44} rotate={-6} color="rgba(255,255,255,0.14)" style={{ top: 220, left: "32%" }} />
      <Polygon size={59} rotate={-50} color="rgba(244,162,97,0.5)" style={{ top: 37, left: "30%" }} />

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-24 lg:pl-[120px] lg:pr-0">
        <div className="relative z-10 max-w-[680px]">
          <h1 className="text-4xl leading-[1.1] text-white sm:text-5xl lg:text-[56px]">
            What is IMPACT digital platform?
          </h1>
          <p className="mt-5 max-w-[560px] text-[18px] leading-[1.6] text-white/80">
            A comprehensive platform for Local Youth Councils to measure their
            impact, identify opportunities for growth, and access practical
            guidance and resources.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href="/auth"
              className="inline-flex h-[52px] items-center justify-center rounded-full bg-[color:var(--impact-green)] px-[22px] text-[15px] font-bold text-white transition hover:brightness-110"
            >
              Start your assessment
            </a>
            <a
              href="#how"
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-[color:var(--impact-orange)] px-[22px] text-[15px] font-bold text-white transition hover:bg-white/10"
            >
              How to get started?
            </a>
          </div>
        </div>
        <div className="relative z-10 w-full max-w-[597px] lg:mr-0">
          <img
            src={heroImg.url}
            alt="Youth council members collaborating"
            width={1200}
            height={800}
            className="h-[280px] w-full rounded-l-2xl object-cover shadow-2xl sm:h-[360px] lg:h-[397px]"
          />
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    n: 1,
    title: "Create your account",
    body: "Register your Local Youth Council so results, action plans and reflections are stored securely in one place.",
    image: step1Img.url,
    color: "var(--impact-purple)",
  },
  {
    n: 2,
    title: "Pick a focus area",
    body: "Choose one of the IMPACT thematic areas to start with, or run the full self-assessment across all dimensions.",
    image: step2Img.url,
    color: "var(--impact-orange)",
  },
  {
    n: 3,
    title: "Answer the questionnaire",
    body: "Rate your council against each indicator. It takes 15–30 minutes and you can save your progress anytime.",
    image: step3Img.url,
    color: "var(--impact-green)",
  },
  {
    n: 4,
    title: "Review your results",
    body: "Get a visual scoreboard, reflection prompts and a tailored action plan you can share with your team.",
    image: step4Img.url,
    color: "var(--impact-pink)",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-[120px] lg:py-24">
        <div className="max-w-3xl">
          <h2 className="text-3xl text-[color:var(--impact-purple)] lg:text-[36px]">
            How to start assessing?
          </h2>
          <p className="mt-3 text-[16px] leading-[1.6] text-[color:var(--impact-ink-muted)]">
            Four simple steps to measure your Local Youth Council's impact,
            reflect together as a team, and turn results into concrete action.
          </p>
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <article
              key={s.n}
              className="flex flex-col overflow-hidden rounded-[20px] border border-[color:var(--impact-border)] bg-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.05)]"
            >
              <div className="relative h-[220px] w-full overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[rgba(17,24,39,0.15)]" />
              </div>
              <div className="flex flex-col gap-4 p-8">
                <div className="relative h-[52px] w-[56px]">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                    <path
                      d="M50,8 L90,80 L10,80 Z"
                      fill={s.color}
                      stroke={s.color}
                      strokeWidth="10"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center pt-1 text-[20px] font-bold text-white">
                    {s.n}
                  </span>
                </div>
                <h3 className="text-[20px] font-bold text-[color:var(--impact-ink)]">
                  {s.title}
                </h3>
                <p className="text-[14px] leading-[1.8] text-[color:var(--impact-ink-muted)]">
                  {s.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-11 flex justify-center">
          <a
            href="/auth"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[color:var(--impact-purple)] px-7 text-[15px] font-bold text-white transition hover:opacity-90"
          >
            Start your assessment
          </a>
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--impact-green)" }}
    >
      <Polygon size={146} rotate={-18} color="rgba(255,255,255,0.14)" style={{ top: 0, left: -68 }} />
      <Polygon size={92} rotate={53} color="rgba(244,162,97,0.35)" style={{ top: 63, left: 156 }} />
      <Polygon size={132} rotate={-40} color="rgba(255,255,255,0.10)" style={{ top: -55, left: "20%" }} />
      <Polygon size={101} rotate={58} color="rgba(80,33,129,0.28)" style={{ top: 60, right: "22%" }} />
      <Polygon size={95} rotate={22} color="rgba(255,255,255,0.14)" style={{ top: 148, right: 60 }} />
      <Polygon size={47} rotate={-10} color="rgba(244,162,97,0.5)" style={{ top: 161, left: 17 }} />
      <Polygon size={62} rotate={-30} color="rgba(255,255,255,0.15)" style={{ top: 176, left: "34%" }} />

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:py-[72px] lg:pl-[120px] lg:pr-0">
        <div className="relative z-10 max-w-[560px]">
          <h2 className="text-3xl text-white lg:text-[36px]">
            Ready to take action?
          </h2>
          <p className="mt-3 text-[16px] leading-[1.6] text-white/85">
            Your results become an actionable roadmap. Save assessments to your
            account, revisit past results, and track how your council grows
            year on year.
          </p>
          <a
            href="/auth"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-[color:var(--impact-purple)] px-7 text-[15px] font-bold text-white transition hover:opacity-90"
          >
            Start your assessment
          </a>
        </div>
        <div className="relative z-10 w-full max-w-[520px]">
          <img
            src={ctaImg.url}
            alt="Team planning action steps"
            width={1040}
            height={912}
            loading="lazy"
            className="h-[300px] w-full rounded-3xl object-cover shadow-2xl lg:h-[456px]"
          />
        </div>
      </div>
    </section>
  );
}

const partners = [
  { name: "DYPALL Network", logo: dypallLogo.url },
  { name: "Bataljong", logo: bataljongLogo.url },
  { name: "Fundació Ferrer i Guàrdia", logo: fundacioLogo.url },
  { name: "Nuva", logo: nuvaLogo.url },
];

function Consortium() {
  return (
    <section className="w-full bg-[color:var(--impact-surface-muted)]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-[120px] lg:py-24">
        <div className="max-w-4xl">
          <h2 className="text-3xl text-[color:var(--impact-purple)] lg:text-[36px]">
            Partner's consortium
          </h2>
          <p className="mt-3 text-[16px] leading-[1.6] text-[color:var(--impact-ink-muted)]">
            IMPACT is delivered by a European consortium of youth-focused
            organisations working together to strengthen Local Youth Councils.
          </p>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-6 md:grid-cols-4">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex h-[120px] items-center justify-center rounded-lg border border-[color:var(--impact-border)] bg-white px-6 shadow-[0_4px_6px_rgba(0,0,0,0.04)]"
            >
              <img
                src={p.logo}
                alt={`${p.name} logo`}
                className="max-h-[80px] max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <CtaBanner />
        <Consortium />
      </main>
      <Footer />
    </div>
  );
}
