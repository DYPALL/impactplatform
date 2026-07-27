import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-youth.jpg";
import ctaImg from "@/assets/cta-action.jpg";

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

/* ---------- Reusable primitives ---------- */

function ImpactLogo({ className = "" }: { className?: string }) {
  // Four triangles pinwheel + IMPACT wordmark
  return (
    <svg
      viewBox="0 0 720 170"
      className={className}
      role="img"
      aria-label="IMPACT logo"
    >
      <g>
        <polygon points="10,10 130,10 70,110" fill="#f4a261" />
        <polygon points="140,10 260,10 200,110" fill="#502181" />
        <polygon points="10,120 130,120 70,20" fill="#219c9e" transform="translate(0,40)" />
        <polygon points="140,120 260,120 200,20" fill="#e94b8a" transform="translate(0,40)" />
      </g>
      <text
        x="290"
        y="130"
        fontFamily="Work Sans, sans-serif"
        fontWeight="800"
        fontSize="140"
        fill="#502181"
        letterSpacing="-4"
      >
        IMPACT
      </text>
    </svg>
  );
}

function Polygon({
  size = 60,
  color = "rgba(255,255,255,0.15)",
  rotate = 0,
  style,
}: {
  size?: number;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points="50,5 95,80 5,80" fill={color} />
      </svg>
    </div>
  );
}

/* ---------- Sections ---------- */

function Header() {
  return (
    <header className="w-full border-b border-[color:var(--impact-border)] bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-[120px]">
        <Link to="/" className="flex items-center">
          <ImpactLogo className="h-8 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <a href="#" className="text-[15px] font-bold text-[color:var(--impact-ink)]">
            Home
          </a>
          <a href="#" className="text-[15px] font-bold text-[color:var(--impact-ink)]">
            Resource Hub
          </a>
          <a href="#" className="text-[15px] font-bold text-[color:var(--impact-ink)]">
            Send us a message
          </a>
          <a
            href="#"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[color:var(--impact-purple)] px-[18px] text-[14px] font-bold text-white transition hover:opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Log in / Sign up
          </a>
        </nav>
      </div>
    </header>
  );
}

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
              href="#"
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
            src={heroImg}
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
    tint: "from-[#502181] to-[#7a3fbf]",
  },
  {
    n: 2,
    title: "Pick a focus area",
    body: "Choose one of the IMPACT thematic areas to start with, or run the full self-assessment across all dimensions.",
    tint: "from-[#219c9e] to-[#3ac9cb]",
  },
  {
    n: 3,
    title: "Answer the questionnaire",
    body: "Rate your council against each indicator. It takes 15–30 minutes and you can save your progress anytime.",
    tint: "from-[#f4a261] to-[#f6b98a]",
  },
  {
    n: 4,
    title: "Review your results",
    body: "Get a visual scoreboard, reflection prompts and a tailored action plan you can share with your team.",
    tint: "from-[#e94b8a] to-[#f28aae]",
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
              <div
                className={`relative h-[180px] w-full bg-gradient-to-br ${s.tint}`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <Polygon size={90} rotate={20} color="rgba(255,255,255,0.25)" style={{ top: 20, left: 30 }} />
                <Polygon size={50} rotate={-30} color="rgba(255,255,255,0.2)" style={{ bottom: 20, right: 30 }} />
              </div>
              <div className="flex flex-col gap-4 p-8">
                <div className="relative h-[52px] w-[56px]">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                    <polygon points="50,5 95,80 5,80" fill="var(--impact-purple)" />
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
            href="#"
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
            href="#"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-[color:var(--impact-purple)] px-7 text-[15px] font-bold text-white transition hover:opacity-90"
          >
            Start your assessment
          </a>
        </div>
        <div className="relative z-10 w-full max-w-[520px]">
          <img
            src={ctaImg}
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

const partners = ["DYPALL Network", "Bataljong", "Fundació Ferrer i Guàrdia", "Nuva"];

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
              key={p}
              className="flex h-[120px] items-center justify-center rounded-lg border border-[color:var(--impact-border)] bg-white px-6 text-center shadow-[0_4px_6px_rgba(0,0,0,0.04)]"
            >
              <span className="text-[15px] font-bold text-[color:var(--impact-purple)]">
                {p}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-[color:var(--impact-purple-dark)] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:grid-cols-3 lg:px-[120px]">
        <div>
          <ImpactLogo className="h-8 w-auto brightness-0 invert" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            A digital platform helping Local Youth Councils across Europe
            measure impact and plan action.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white/80">
            Platform
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><a href="#">Home</a></li>
            <li><a href="#">Resource Hub</a></li>
            <li><a href="#">Start assessment</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white/80">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Send us a message</li>
            <li>Privacy policy</li>
            <li>© {new Date().getFullYear()} IMPACT Consortium</li>
          </ul>
        </div>
      </div>
    </footer>
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
