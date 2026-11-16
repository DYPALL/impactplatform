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
import { Polygon } from "@/components/Polygon";
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

      {/* Floating polygons: clustered along the edges so the centred copy stays clear.
          Below the desktop breakpoint the column is narrow, so the edge shapes are hidden. */}
      <Polygon className="hidden lg:block" size={92} rotate={-12} depth={0.5} color="rgba(255,255,255,0.10)" style={{ top: "4%", left: "1%" }} />
      <Polygon className="hidden lg:block" size={44} rotate={38} depth={1.8} color="rgba(244,162,97,0.45)" style={{ top: "16%", left: "4%" }} />
      <Polygon className="hidden lg:block" size={72} rotate={55} depth={1.0} color="rgba(255,255,255,0.12)" style={{ top: "34%", left: "2%" }} />
      <Polygon className="hidden lg:block" size={36} rotate={-36} depth={2.0} color="rgba(244,162,97,0.55)" style={{ top: "52%", left: "5%" }} />
      <Polygon className="hidden lg:block" size={58} rotate={14} depth={1.2} color="rgba(233,75,138,0.50)" style={{ top: "68%", left: "3%" }} />
      <Polygon className="hidden lg:block" size={68} rotate={42} depth={0.9} color="rgba(244,162,97,0.40)" style={{ top: "86%", left: "5%" }} />
      <Polygon className="hidden lg:block" size={48} rotate={-10} depth={1.6} color="rgba(233,75,138,0.45)" style={{ top: "8%", left: "90%" }} />
      <Polygon className="hidden lg:block" size={54} rotate={22} depth={1.4} color="rgba(255,255,255,0.14)" style={{ top: "22%", left: "90%" }} />
      <Polygon className="hidden lg:block" size={60} rotate={66} depth={1.1} color="rgba(233,75,138,0.45)" style={{ top: "44%", left: "92%" }} />
      <Polygon className="hidden lg:block" size={42} rotate={-60} depth={1.7} color="rgba(255,255,255,0.15)" style={{ top: "62%", left: "86%" }} />
      <Polygon className="hidden lg:block" size={76} rotate={30} depth={0.8} color="rgba(255,255,255,0.13)" style={{ top: "78%", left: "91%" }} />
      <Polygon className="hidden lg:block" size={86} rotate={-6} depth={0.6} color="rgba(255,255,255,0.11)" style={{ top: "90%", left: "74%" }} />
      <Polygon className="hidden lg:block" size={64} rotate={-28} depth={1.3} color="rgba(233,75,138,0.40)" style={{ top: "2%", left: "34%" }} />
      <Polygon className="hidden lg:block" size={82} rotate={-48} depth={0.7} color="rgba(244,162,97,0.35)" style={{ top: "1%", left: "62%" }} />
      <Polygon className="hidden lg:block" size={50} rotate={-18} depth={1.5} color="rgba(233,75,138,0.40)" style={{ top: "92%", left: "40%" }} />
      <Polygon className="hidden lg:block" size={40} rotate={-44} depth={1.9} color="rgba(244,162,97,0.50)" style={{ top: "88%", left: "58%" }} />
      <Polygon className="hidden lg:block" size={38} rotate={72} depth={2.0} color="rgba(255,255,255,0.16)" style={{ top: "95%", left: "24%" }} />



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
      <Polygon size={146} rotate={-18} color="rgba(255,255,255,0.14)" style={{ top: 0, left: -68 }} />
      <Polygon size={92} rotate={53} color="rgba(244,162,97,0.35)" style={{ top: 63, left: 156 }} />
      <Polygon size={132} rotate={-40} color="rgba(255,255,255,0.10)" style={{ top: -55, left: "20%" }} />
      <Polygon size={101} rotate={58} color="rgba(80,33,129,0.28)" style={{ top: 60, right: "22%" }} />
      <Polygon size={95} rotate={22} color="rgba(255,255,255,0.14)" style={{ top: 148, right: 60 }} />
      <Polygon size={47} rotate={-10} color="rgba(244,162,97,0.5)" style={{ top: 161, left: 17 }} />
      <Polygon size={62} rotate={-30} color="rgba(255,255,255,0.15)" style={{ top: 176, left: "34%" }} />

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:py-[72px] lg:pl-[120px] lg:pr-0">
        <div className="relative z-10 max-w-[560px]">
          <h2 className="section-title text-white">
            Ready to take action?
          </h2>
          <p className="mt-3 text-[16px] leading-[1.6] text-white/85 [text-wrap:pretty]">
            Your results become an actionable plan. Save assessments to your account, revisit past results, and track how your council grows year on year.
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
