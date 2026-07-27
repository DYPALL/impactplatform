import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-youth.jpg";
import ctaImg from "@/assets/cta-action.jpg";
import logoAsset from "@/assets/logo_color_impact.png.asset.json";

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
          <img
            src={logoAsset.url}
            alt="IMPACT logo"
            className="h-8 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <a href="#" className="inline-flex items-center gap-2 text-[15px] font-bold text-[color:var(--impact-ink)]">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden>
              <path d="M0.872437 8.65795C0.872437 7.30418 0.872437 6.6273 1.14558 6.03216C1.41973 5.43702 1.93312 4.99739 2.96091 4.11615L3.9578 3.26182C5.81699 1.66979 6.74409 0.872284 7.85063 0.872284C8.95717 0.872284 9.88527 1.6688 11.7435 3.26082L12.7404 4.11515C13.7671 4.9964 14.2815 5.43602 14.5547 6.03116C14.8288 6.6263 14.8288 7.30319 14.8288 8.65696V12.8847C14.8288 14.7649 14.8288 15.7039 14.2446 16.2881C13.6605 16.8723 12.7214 16.8723 10.8413 16.8723H4.85998C2.97985 16.8723 2.04079 16.8723 1.45661 16.2881C0.872436 15.7039 0.872437 14.7649 0.872437 12.8847V8.65795Z" stroke="#502181" strokeWidth="1.74455"/>
              <path d="M10.3431 16.8723V11.8878C10.3431 11.6235 10.238 11.3699 10.0511 11.1829C9.86413 10.996 9.61057 10.891 9.34618 10.891H6.35553C6.09114 10.891 5.83758 10.996 5.65062 11.1829C5.46367 11.3699 5.35864 11.6235 5.35864 11.8878V16.8723" stroke="#502181" strokeWidth="1.74455" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Home
          </a>
          <a href="#" className="inline-flex items-center gap-2 text-[15px] font-bold text-[color:var(--impact-ink)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M1.28932 4.08864C1.28932 2.85673 1.28932 2.24077 1.56691 1.788C1.7221 1.53441 1.93488 1.32163 2.18847 1.16644C2.64044 0.888855 3.25719 0.888855 4.48911 0.888855C5.72103 0.888855 6.33699 0.888855 6.78976 1.16644C7.04335 1.32163 7.25613 1.53441 7.41132 1.788C7.6889 2.23997 7.6889 2.85673 7.6889 4.08864C7.6889 5.32056 7.6889 5.93652 7.41132 6.38929C7.25613 6.64288 7.04335 6.85566 6.78976 7.01085C6.33779 7.28843 5.72103 7.28843 4.48911 7.28843C3.25719 7.28843 2.64124 7.28843 2.18847 7.01085C1.93507 6.8557 1.72206 6.64269 1.56691 6.38929C1.28932 5.93732 1.28932 5.32056 1.28932 4.08864ZM2.31486 11.1138C3.1524 10.2762 3.57077 9.85787 4.06674 9.73787C4.34437 9.67116 4.63386 9.67116 4.91149 9.73787C5.40745 9.85787 5.82583 10.2762 6.66337 11.1138C7.50092 11.9513 7.91929 12.3697 8.03928 12.8657C8.1048 13.1434 8.1048 13.4326 8.03928 13.7104C7.91929 14.2064 7.50092 14.6256 6.66337 15.4623C5.82583 16.299 5.40745 16.7182 4.91149 16.8382C4.63386 16.9049 4.34437 16.9049 4.06674 16.8382C3.57077 16.7182 3.1524 16.2998 2.31486 15.4623C1.47731 14.6248 1.05894 14.2064 0.938947 13.7104C0.872239 13.4328 0.872239 13.1433 0.938947 12.8657C1.05894 12.3697 1.47731 11.9505 2.31486 11.1138ZM10.4887 13.688C10.4887 12.4561 10.4887 11.8401 10.7663 11.3874C10.9215 11.1338 11.1343 10.921 11.3879 10.7658C11.8398 10.4882 12.4566 10.4882 13.6885 10.4882C14.9204 10.4882 15.5364 10.4882 15.99 10.7658C16.2427 10.921 16.4555 11.1338 16.6107 11.3874C16.8883 11.8393 16.8883 12.4561 16.8883 13.688C16.8883 14.9199 16.8883 15.5359 16.6107 15.9895C16.4555 16.2423 16.2428 16.455 15.99 16.6102C15.5364 16.8878 14.9204 16.8878 13.6885 16.8878C12.4566 16.8878 11.8406 16.8878 11.3879 16.6102C11.1346 16.4553 10.9216 16.2426 10.7663 15.9895C10.4887 15.5359 10.4887 14.9199 10.4887 13.688Z" stroke="#502181" strokeWidth="1.77773"/>
              <path d="M13.6892 0.888855V7.28843M16.889 4.08864H10.4894" stroke="#502181" strokeWidth="1.77773" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Resource Hub
          </a>
          <a href="#" className="inline-flex items-center gap-2 text-[15px] font-bold text-[color:var(--impact-ink)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M14.6706 5.8511L3.47123 0.251401C3.02925 0.0314207 2.53017 -0.0468939 2.04205 0.027135C1.55393 0.101164 1.10052 0.323934 0.743641 0.665072C0.386758 1.00621 0.143771 1.44911 0.0478083 1.9334C-0.0481545 2.41768 0.00757734 2.91978 0.207405 3.37123L2.1273 7.667C2.17086 7.77086 2.1933 7.88236 2.1933 7.99498C2.1933 8.10761 2.17086 8.2191 2.1273 8.32296L0.207405 12.6187C0.0447743 12.9841 -0.0239775 13.3843 0.00739795 13.783C0.0387734 14.1816 0.169281 14.5662 0.387061 14.9016C0.604841 15.237 0.902988 15.5127 1.25441 15.7035C1.60583 15.8944 1.99937 15.9944 2.39929 15.9945C2.77385 15.9908 3.14284 15.9033 3.47923 15.7386L14.6786 10.1389C15.0759 9.93902 15.4098 9.63274 15.6431 9.25418C15.8764 8.87561 16 8.43967 16 7.99498C16 7.55029 15.8764 7.11435 15.6431 6.73579C15.4098 6.35723 15.0759 6.05094 14.6786 5.8511H14.6706ZM13.9587 8.70694L2.75927 14.3066C2.6122 14.3772 2.44707 14.4012 2.286 14.3753C2.12493 14.3494 1.97564 14.2749 1.85813 14.1617C1.74062 14.0486 1.66051 13.9022 1.62855 13.7422C1.59659 13.5822 1.61431 13.4163 1.67933 13.2667L3.59122 8.97093C3.61597 8.91356 3.63734 8.8548 3.65522 8.79494H9.16692C9.37908 8.79494 9.58255 8.71066 9.73257 8.56064C9.88259 8.41061 9.96687 8.20714 9.96687 7.99498C9.96687 7.78282 9.88259 7.57935 9.73257 7.42933C9.58255 7.27931 9.37908 7.19502 9.16692 7.19502H3.65522C3.63734 7.13516 3.61597 7.0764 3.59122 7.01903L1.67933 2.72327C1.61431 2.57365 1.59659 2.40772 1.62855 2.24775C1.66051 2.08777 1.74062 1.94139 1.85813 1.82823C1.97564 1.71508 2.12493 1.64055 2.286 1.61465C2.44707 1.58875 2.6122 1.61271 2.75927 1.68332L13.9587 7.28302C14.0897 7.35015 14.1997 7.45214 14.2764 7.57776C14.3532 7.70338 14.3939 7.84775 14.3939 7.99498C14.3939 8.14221 14.3532 8.28658 14.2764 8.4122C14.1997 8.53782 14.0897 8.63981 13.9587 8.70694Z" fill="#502181"/>
            </svg>
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
