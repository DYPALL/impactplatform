import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ResourcePreview } from "@/components/ResourcePreview";
import { HomeFAQ } from "@/components/HomeFAQ";
import impactLogo from "@/assets/logo_color_impact.png.asset.json";
import { AssessmentSteps } from "@/components/AssessmentSteps";
import heroImg from "@/assets/hero-photo.webp.asset.json";
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
      { property: "og:image", content: heroImg.url },
      { name: "twitter:image", content: heroImg.url },
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

      {/* Floating polygons */}
      <Polygon size={92} rotate={-12} depth={0.5} color="rgba(255,255,255,0.10)" style={{ top: "4%", left: "6%" }} />
      <Polygon size={44} rotate={38} depth={1.8} color="rgba(244,162,97,0.45)" style={{ top: "14%", left: "18%" }} />
      <Polygon size={64} rotate={-28} depth={1.3} color="rgba(233,75,138,0.40)" style={{ top: "8%", left: "34%" }} />
      <Polygon size={38} rotate={72} depth={2.0} color="rgba(255,255,255,0.16)" style={{ top: "22%", left: "46%" }} />
      <Polygon size={82} rotate={-48} depth={0.7} color="rgba(244,162,97,0.35)" style={{ top: "6%", left: "62%" }} />
      <Polygon size={54} rotate={22} depth={1.4} color="rgba(255,255,255,0.14)" style={{ top: "18%", left: "78%" }} />
      <Polygon size={48} rotate={-10} depth={1.6} color="rgba(233,75,138,0.45)" style={{ top: "10%", left: "90%" }} />
      <Polygon size={72} rotate={55} depth={1.0} color="rgba(255,255,255,0.12)" style={{ top: "40%", left: "4%" }} />
      <Polygon size={36} rotate={-36} depth={2.0} color="rgba(244,162,97,0.55)" style={{ top: "46%", left: "26%" }} />
      <Polygon size={58} rotate={14} depth={1.2} color="rgba(233,75,138,0.50)" style={{ top: "56%", left: "14%" }} />
      <Polygon size={42} rotate={-60} depth={1.7} color="rgba(255,255,255,0.15)" style={{ top: "62%", left: "38%" }} />
      <Polygon size={68} rotate={42} depth={0.9} color="rgba(244,162,97,0.40)" style={{ top: "72%", left: "8%" }} />
      <Polygon size={50} rotate={-18} depth={1.5} color="rgba(233,75,138,0.40)" style={{ top: "74%", left: "56%" }} />
      <Polygon size={76} rotate={30} depth={0.8} color="rgba(255,255,255,0.13)" style={{ top: "58%", left: "70%" }} />
      <Polygon size={40} rotate={-44} depth={1.9} color="rgba(244,162,97,0.50)" style={{ top: "78%", left: "84%" }} />
      <Polygon size={60} rotate={66} depth={1.1} color="rgba(233,75,138,0.45)" style={{ top: "52%", left: "92%" }} />
      <Polygon size={86} rotate={-6} depth={0.6} color="rgba(255,255,255,0.11)" style={{ top: "86%", left: "68%" }} />



      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-24 lg:pl-[120px] lg:pr-0">
        <div className="relative z-10 max-w-[680px]">
          <h1 className="text-4xl leading-[1.1] text-white sm:text-5xl lg:text-[56px]">
            What is IMPACT digital platform?
          </h1>
          <p className="mt-5 max-w-[560px] text-[18px] leading-[1.6] text-white/80">
            For Local Youth Councils and the people supporting them: assess your council, reflect on your results and build a practical action plan. Our public Resource Hub also welcomes youth workers, municipalities, educators and anyone interested in meaningful youth participation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href="/start-assessing"
              className="inline-flex h-[52px] items-center justify-center rounded-full bg-[color:var(--impact-green)] px-[22px] text-[15px] font-bold text-white transition hover:brightness-110"
            >
              Start your assessment
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
            Keep your progress in one place?
          </h2>
          <p className="mt-3 text-[16px] leading-[1.6] text-white/85">
            Sign-up to unlock your full assessment feedback, save results automatically, revisit previous questionnaires and turn selected steps into an action plan.
          </p>
          <a
            href="/auth"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-[color:var(--impact-purple)] px-7 text-[15px] font-bold text-white transition hover:opacity-90"
          >
            Sign-up
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
