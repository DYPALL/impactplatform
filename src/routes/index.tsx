import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ResourcePreview } from "@/components/ResourcePreview";
import { HomeFAQ } from "@/components/HomeFAQ";
import impactLogo from "@/assets/logo_color_impact.png.asset.json";
import { AssessmentSteps } from "@/components/AssessmentSteps";
import ctaImg from "@/assets/cta-photo.webp.asset.json";
import dypallLogo from "@/assets/DYPALL-logo.png.asset.json";
import bataljongLogo from "@/assets/Bataljong-logo.png.asset.json";
import fundacioLogo from "@/assets/Fundacio-logo.png.asset.json";
import nuvaLogo from "@/assets/Nuva-logo.png.asset.json";
import { Footer } from "@/components/Footer";
import { FlowingPolygons } from "@/components/FlowingPolygons";
import { HowToGetStartedModal } from "@/components/HowToGetStartedModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IMPACT — European Platform for Local Youth Council Quality Development" },
      {
        name: "description",
        content:
          "IMPACT helps Local Youth Councils measure their impact, identify opportunities for growth, and access practical guidance and resources.",
      },
      { property: "og:title", content: "IMPACT — European Platform for Local Youth Council Quality Development" },
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
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--impact-purple)" }}
    >
      {/* Animated gradient wash */}
      <div className="hero-gradient" aria-hidden="true" />

      {/* Triangles travel and tumble across the whole hero. */}
      <FlowingPolygons variant="hero" />



      <div className="relative z-10 mx-auto flex max-w-[1040px] flex-col items-center px-6 py-20 text-center lg:py-28">
        <h1 className="text-[34px] leading-[1.12] text-white sm:text-5xl lg:text-[58px]">
          How much real{" "}
          <span className="hero-highlight">impact</span> is your Local Youth
          Council making?
        </h1>
        <p className="mt-6 max-w-[660px] text-[17px] leading-[1.6] text-white/80 sm:text-[18px]">
          A practical self-assessment and action-planning platform built for LYC
          members and support staff to turn youth voices into real local change
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="/start-assessing"
            className="inline-flex h-[52px] items-center justify-center rounded-full bg-[color:var(--impact-green)] px-[26px] text-[15px] font-bold text-white transition hover:brightness-110"
          >
            Start your free assessment
          </a>
          <button
            onClick={() => setGuideOpen(true)}
            className="inline-flex h-[52px] items-center justify-center rounded-full border border-[color:var(--impact-orange)] px-[22px] text-[15px] font-bold text-white transition hover:bg-white/10"
          >
            How to get started?
          </button>
          <HowToGetStartedModal open={guideOpen} onOpenChange={setGuideOpen} />
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
      <FlowingPolygons variant="cta" />

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:py-[72px] lg:pl-[120px] lg:pr-0">
        <div className="relative z-10 max-w-[560px]">
          <h2 className="section-title text-white">
            Curious where your council stands?
          </h2>
          <p className="mt-3 text-[16px] leading-[1.6] text-white/85 [text-wrap:pretty]">
            Try it on your own or reflect together as a team. Start with one focus area in 15–30 minutes and get an analysis of your strengths & gaps.
          </p>
          <a
            href="/start-assessing"
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
  { name: "DYPALL Network", logo: dypallLogo.url, url: "https://dypall.com/" },
  { name: "Bataljong", logo: bataljongLogo.url, url: "https://bataljong.be/" },
  { name: "Fundació Ferrer i Guàrdia", logo: fundacioLogo.url, url: "https://www.ferrerguardia.org/" },
  { name: "Nuva", logo: nuvaLogo.url, url: "https://nuva.fi/en/" },
];

function Consortium() {
  return (
    <section className="w-full bg-[color:var(--impact-surface-muted)]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-[120px] lg:py-24">
        <div className="max-w-4xl">
          <h2 className="section-title text-primary">
            Partner's consortium
          </h2>
          <p className="mt-3 text-[16px] leading-[1.6] text-[color:var(--impact-ink-muted)]">
            IMPACT is delivered by a European consortium of youth-focused
            organisations working together to strengthen Local Youth Councils.
          </p>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-6 md:grid-cols-4">
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${p.name} website`}
              className="flex h-[120px] items-center justify-center rounded-lg border border-[color:var(--impact-border)] bg-white px-6 shadow-[0_4px_6px_rgba(0,0,0,0.04)] transition hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:scale-[1.02]"
            >
              <img
                src={p.logo}
                alt={`${p.name} logo`}
                className="max-h-[80px] max-w-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <AssessmentSteps />
        <CtaBanner />
        <ResourcePreview />
        <Consortium />
        <section id="about-impact" className="bg-background">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-16 md:grid-cols-[minmax(0,1fr)_260px] lg:gap-16 lg:px-[120px]">
            <div>
              <h2 className="section-title text-primary">About the IMPACT project</h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">IMPACT is a European collaboration working to strengthen Local Youth Councils and meaningful youth participation. The platform brings together assessment, reflection, practical action planning and shared resources so councils and the people supporting them can identify opportunities for growth and take their next steps.</p>
            </div>
            <img src={impactLogo.url} alt="IMPACT project logo" loading="lazy" className="h-auto w-[260px] max-w-full justify-self-center" />
          </div>
        </section>
        <HomeFAQ />
      </main>
      <Footer />
    </div>
  );
}
