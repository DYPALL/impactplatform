/* =============================================================================
   HowToGetStartedModal.tsx
   -----------------------------------------------------------------------------
   A "How to get started" wizard modal for the IMPACT platform.

   • 4 steps. Each step shows a faithful, self-looping animation of the real
     screen (auth → dashboard → questionnaire → results) beside its instructions.
   • Each animation LOOPS forever until the user clicks "Next".
   • "Back" returns to the previous step; on the LAST step the primary button
     reads "Start your assessment" and navigates to /auth.

   HOW TO WIRE IT UP
   -----------------------------------------------------------------------------
   1. Save this file as src/components/HowToGetStartedModal.tsx
   2. In your Hero (src/routes/index.tsx) replace the existing
      "How to get started?" button with:

        import { HowToGetStartedModal } from "@/components/HowToGetStartedModal";
        // ...
        const [guideOpen, setGuideOpen] = useState(false);
        // ...
        <button onClick={() => setGuideOpen(true)} className="...your existing classes...">
          How to get started?
        </button>
        <HowToGetStartedModal open={guideOpen} onOpenChange={setGuideOpen} />

   3. (Optional) Pass the real hero photo:
        <HowToGetStartedModal open={...} onOpenChange={...} heroSrc={heroImg.url} />

   DEPENDENCIES (already in your repo)
   -----------------------------------------------------------------------------
   • @/components/ui/dialog   (shadcn/ui Dialog)
   • @tanstack/react-router   (useNavigate)
   • Tailwind + the --impact-* CSS variables in styles.css
   • Fonts: Work Sans (headings) + Inter (body) — already loaded in __root.tsx

   No other libraries required. All animation is CSS/SVG.
   ============================================================================ */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

/* -----------------------------------------------------------------------------
   Scoped styles + keyframes.
   Everything is prefixed with .h2g so it can't leak into the rest of the app.
   The 1440×810 "screen" is scaled to fit its column via a CSS variable --s
   set from JS (ResizeObserver).
   -------------------------------------------------------------------------- */
const STYLES = `
.h2g{
  --a1-accent:#502181; --a1-soft:#F7F4FC; --a1-border:#E3DBF0; --a1-row:#F3EDF9;
  --a2-accent:#D97A2B; --a2-soft:#FDF4EC;
  --lvl0:#E14B45; --lvl1:#E8913C; --lvl2:#E5C13F; --lvl3:#33A06A;
  --font-heading:"Work Sans", ui-sans-serif, system-ui, sans-serif;
  --font-body:"Inter", ui-sans-serif, system-ui, sans-serif;
  font-family:var(--font-body); color:var(--impact-ink);
}
.h2g-body{display:grid; grid-template-columns:minmax(0,1fr) 320px; min-height:0;}
@media (max-width:860px){ .h2g-body{grid-template-columns:1fr;} }

/* LEFT — screen pane */
.h2g-pane{
  min-width:0; min-height:0; background:#F6F4FA;
  padding:20px; display:flex; align-items:center; justify-content:center;
}
.h2g-stage{
  position:relative; width:100%; aspect-ratio:16/9;
  border-radius:12px; overflow:hidden; background:#fff;
  border:1px solid rgba(17,24,39,.07);
  box-shadow:0 14px 32px -14px rgba(59,24,97,.35);
}
.h2g-screens{position:absolute; top:0; left:0; width:1440px; height:810px; transform-origin:top left;}
.h2g-screen{position:absolute; inset:0; width:1440px; height:810px; overflow:hidden; background:#fff;}
.h2g h1,.h2g h2,.h2g h3,.h2g h4{font-family:var(--font-heading); font-weight:800; letter-spacing:-.01em; margin:0;}

/* RIGHT — steps pane */
.h2g-steps{
  border-left:1px solid var(--impact-border); background:#fff;
  padding:22px 22px 20px; display:flex; flex-direction:column; min-height:0;
}
@media (max-width:860px){ .h2g-steps{border-left:0; border-top:1px solid var(--impact-border);} }
.h2g-kicker{font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; margin:0 0 6px;}
.h2g-steps h3{font-size:24px; line-height:1.12; color:var(--impact-purple);}
.h2g-desc{margin:12px 0 0; font-size:14px; line-height:1.6; color:var(--impact-ink-muted);}
.h2g-desc b{color:var(--impact-ink); font-weight:700;}
.h2g-dots{display:flex; gap:8px; margin-top:20px;}
.h2g-dot{height:6px; flex:1; border-radius:99px; background:var(--impact-border); overflow:hidden;}
.h2g-dot.done{background:var(--impact-green);}
.h2g-dot.active i{display:block; height:100%; background:var(--impact-green); border-radius:99px; animation:h2g-fill 6s linear infinite;}
@keyframes h2g-fill{from{width:0} to{width:100%}}
.h2g-spacer{flex:1; min-height:14px;}
.h2g-nav{display:flex; gap:10px; align-items:center;}
.h2g-back{
  height:46px; padding:0 18px; border-radius:9999px; cursor:pointer;
  border:1px solid var(--impact-border); background:#fff;
  font-size:14px; font-weight:700; color:var(--impact-ink); font-family:var(--font-body);
  transition:background .16s ease;
}
.h2g-back:hover{background:#F3F1F7;}
.h2g-back:disabled{opacity:.4; cursor:default;}
.h2g-next{
  flex:1; height:46px; border:0; border-radius:9999px; cursor:pointer;
  background:var(--impact-green); color:#fff;
  font-size:14.5px; font-weight:700; font-family:var(--font-body);
  transition:filter .16s ease;
}
.h2g-next:hover{filter:brightness(1.1);}
.h2g-skip{margin:12px 0 0; text-align:center;}
.h2g-skip button{background:none; border:0; cursor:pointer; font-size:12.5px; color:var(--impact-ink-muted); text-decoration:underline; font-family:var(--font-body);}

/* ============================ shared bits ============================ */
.h2g-header{border-bottom:1px solid var(--impact-border); background:#fff;}
.h2g-header .inner{display:flex; align-items:center; justify-content:space-between; padding:20px 60px;}
.h2g-logo{display:flex; align-items:center; gap:9px;}
.h2g-logo .mk{position:relative; width:26px; height:22px;}
.h2g-logo .mk span{position:absolute; width:0; height:0; border-style:solid;}
.h2g-logo .mk .t1{border-width:0 0 13px 13px; border-color:transparent transparent var(--impact-purple) transparent; left:0; top:9px;}
.h2g-logo .mk .t2{border-width:13px 13px 0 0; border-color:var(--impact-pink) transparent transparent transparent; left:8px; top:0;}
.h2g-logo .mk .t3{border-width:0 9px 9px 0; border-color:transparent var(--impact-green) transparent transparent; left:15px; top:12px;}
.h2g-logo .wd{font-family:var(--font-heading); font-weight:800; font-size:22px; color:var(--impact-purple);}
.h2g-nav-links{display:flex; align-items:center; gap:26px;}
.h2g-nav-links a{font-size:15px; font-weight:700; color:var(--impact-ink); text-decoration:none;}
.h2g-nav-links .pill{height:44px; padding:0 18px; border-radius:9999px; background:var(--impact-purple); color:#fff; font-size:14px; font-weight:700; display:inline-flex; align-items:center;}

/* animated cursor (shared) */
.h2g-cursor{position:absolute; width:30px; height:30px; z-index:40; pointer-events:none;}
.h2g-cursor svg{display:block; width:100%; height:100%; filter:drop-shadow(0 4px 8px rgba(17,24,39,.35));}
.h2g-ripple{position:absolute; width:18px; height:18px; margin:-9px 0 0 -9px; border-radius:50%; border:2px solid var(--impact-purple); z-index:39;}

/* ===== STEP 1 — auth ===== */
.h2g-auth{display:flex; height:calc(810px - 85px);}
.h2g-auth-l{position:relative; overflow:hidden; width:45%; background:var(--impact-purple); color:#fff; padding:60px 72px;}
.h2g-poly{position:absolute;} .h2g-poly svg{display:block; width:100%; height:100%;}
.h2g-auth-l h1{font-size:50px; line-height:1.05;}
.h2g-auth-l p{margin-top:18px; max-width:400px; font-size:15px; line-height:1.6; color:rgba(255,255,255,.85);}
.h2g-auth-r{flex:1; display:flex; align-items:center; justify-content:center; padding:40px 60px;}
.h2g-form{width:100%; max-width:440px;}
.h2g-tabs{display:grid; grid-template-columns:1fr 1fr; background:#f2f2f5; border-radius:9999px; padding:4px;}
.h2g-tabs span{border-radius:9999px; padding:10px 0; text-align:center; font-size:14px; font-weight:600; color:rgba(17,24,39,.6);}
.h2g-tabs span.on{background:var(--impact-purple); color:#fff;}
.h2g-fld{margin-top:16px;}
.h2g-fld label{display:block; margin-bottom:6px; font-size:13px; font-weight:700;}
.h2g-fld .box{width:100%; min-height:42px; border:1px solid rgba(0,0,0,.15); border-radius:8px; background:#fff; padding:10px 14px; font-size:14px; display:flex; align-items:center; overflow:hidden; white-space:nowrap;}
.h2g-fld .box.ph{color:rgba(17,24,39,.32);}
.h2g-grid2{display:grid; grid-template-columns:1fr 1fr; gap:12px;}
.h2g-submit{margin-top:20px; width:100%; border-radius:9999px; background:var(--impact-purple); color:#fff; padding:12px 0; text-align:center; font-size:14px; font-weight:700;}
.h2g-cap{width:12ch; overflow:hidden; display:inline-block; border-right:2px solid transparent; white-space:nowrap; animation-fill-mode:both;}

/* ===== STEP 2 — dashboard ===== */
.h2g-dash{display:flex; height:810px; background:#F4F5F7;}
.h2g-dash aside{flex:none; width:320px; background:#fff; padding:18px; overflow:hidden;}
.h2g-dash .pp{background:var(--impact-purple); border-radius:26px; padding:22px 24px; height:100%; display:flex; flex-direction:column;}
.h2g-dash .av{margin:6px auto 0; width:74px; height:74px; border-radius:50%; background:#E6DCF2; display:flex; align-items:center; justify-content:center; color:var(--impact-purple);}
.h2g-dash .wc{margin-top:13px; text-align:center;} .h2g-dash .wc h4{font-size:20px; color:#fff;} .h2g-dash .wc p{margin:4px 0 0; font-size:13px; color:rgba(255,255,255,.7);}
.h2g-dash .st{margin-top:16px; display:grid; grid-template-columns:1fr 1fr; gap:12px;}
.h2g-dash .st div{background:var(--impact-green); border-radius:16px; padding:13px 12px; text-align:center; color:#fff;}
.h2g-dash .st b{display:block; font-family:var(--font-heading); font-weight:800; font-size:24px;}
.h2g-dash .st span{display:block; margin-top:5px; font-size:11px; color:rgba(255,255,255,.85);}
.h2g-dash .ql{margin-top:22px;}
.h2g-dash .ql h5{font-size:13px; font-weight:800; color:#fff; letter-spacing:.02em;}
.h2g-dash .ql a{margin-top:10px; display:flex; align-items:center; gap:10px; border-radius:9999px; background:rgba(255,255,255,.14); color:#fff; padding:11px 16px; font-size:13px; font-weight:700; text-decoration:none;}
.h2g-dash main{flex:1; min-width:0; padding:34px 42px; overflow:hidden;}
.h2g-dash main h2{font-size:32px; color:var(--impact-purple);}
.h2g-dash main .lede{margin:6px 0 0; max-width:720px; font-size:14px; color:var(--impact-ink-muted);}
.h2g-card{border-radius:22px; padding:16px 22px; margin-top:14px; position:relative; display:flex; align-items:center; gap:18px;}
.h2g-card .tx{min-width:0; flex:1;}
.h2g-card .bd{display:inline-block; border-radius:9999px; padding:3px 10px; font-size:10px; font-weight:700;}
.h2g-card h3{margin-top:7px; font-size:18px; color:var(--impact-ink);}
.h2g-card p{margin:5px 0 0; max-width:560px; font-size:12.5px; line-height:1.5; color:var(--impact-ink-muted); overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;}
.h2g-card .go{flex:none; display:inline-flex; align-items:center; justify-content:center; border-radius:9999px; padding:11px 22px; font-size:13.5px; font-weight:700; color:#fff; white-space:nowrap;}

/* ===== STEP 3 — questionnaire ===== */
.h2g-q{height:810px; background:#FAFAFB; display:flex; flex-direction:column;}
.h2g-q .top{background:var(--a1-accent); height:72px; display:flex; align-items:center; gap:16px; padding:0 40px; color:#fff;}
.h2g-q .top .sq{border:1px solid rgba(255,255,255,.7); border-radius:9999px; padding:6px 16px; font-size:13px; font-weight:700;}
.h2g-q .top .rt{margin-left:auto; display:flex; align-items:center; gap:16px;}
.h2g-q .top .ct{position:relative; font-size:13px; color:rgba(255,255,255,.9); min-width:104px; height:18px;}
.h2g-q .top .ct span{position:absolute; inset:0; white-space:nowrap;}
.h2g-q .top .bar{width:240px; height:7px; border-radius:9999px; background:rgba(255,255,255,.25); overflow:hidden;}
.h2g-q .top .bar i{display:block; height:100%; background:#fff; border-radius:9999px; animation:h2g-qbar 10s linear infinite;}
@keyframes h2g-qbar{0%,45%{width:17%} 50%,100%{width:50%}}
.h2g-q .mn{max-width:1240px; width:100%; margin:0 auto; padding:30px 40px; flex:1;}
.h2g-q .stage{position:relative; min-height:600px;}
.h2g-q .pane{position:absolute; inset:0;}
.h2g-fade1{animation:h2g-fade1 10s step-end infinite;}
.h2g-fade2{animation:h2g-fade2 10s step-end infinite;}
@keyframes h2g-fade1{0%,47%,100%{opacity:1; visibility:visible} 48%,99%{opacity:0; visibility:hidden}}
@keyframes h2g-fade2{0%,47%,98%,100%{opacity:0; visibility:hidden} 48%,97%{opacity:1; visibility:visible}}
.h2g-q .mn h1{font-size:28px; color:var(--a1-accent);}
.h2g-q .about{margin-top:16px; background:#fff; border-radius:16px; padding:20px; border:1px solid rgba(0,0,0,.05); box-shadow:0 1px 3px rgba(0,0,0,.05);}
.h2g-q .about h2{font-size:16px;} .h2g-q .about p{margin:8px 0 0; font-size:14px; line-height:1.6;}
.h2g-q .qq{margin-top:20px; padding-bottom:16px; border-bottom:1px solid rgba(0,0,0,.1); font-size:21px; font-weight:700;}
.h2g-q .tbl{position:relative; margin-top:20px; border-radius:12px; overflow:visible; border:1px solid rgba(0,0,0,.05);}
.h2g-q .th,.h2g-q .tr{display:grid; grid-template-columns:minmax(0,1fr) 100px 100px 100px; align-items:center; gap:8px; padding:12px 24px;}
.h2g-q .th{background:var(--a1-accent); color:#fff; font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; text-align:center; border-radius:12px 12px 0 0;}
.h2g-q .th span:first-child{text-align:left;}
.h2g-q .tr span.c{font-size:14px;} .h2g-q .tr .cell{display:flex; justify-content:center;}
.h2g-rad{width:22px; height:22px; border-radius:50%; border:2px solid #C9CDD4; display:flex; align-items:center; justify-content:center;}
.h2g-rad.on{border-color:var(--a1-accent);} .h2g-rad.on::after{content:''; width:10px; height:10px; border-radius:50%; background:var(--a1-accent);}
/* Only the inner dot + ring colour animate in — the circle outline is always visible. */
.h2g-r1,.h2g-r2,.h2g-r3,.h2g-r4{border-color:#C9CDD4;}
.h2g-r1{animation:h2g-ring 10s step-end infinite;}
.h2g-r2{animation:h2g-ring2 10s step-end infinite;}
.h2g-r3{animation:h2g-ring3 10s step-end infinite;}
.h2g-r4{animation:h2g-ring4 10s step-end infinite;}
.h2g-r1::after{animation:h2g-dot 10s step-end infinite;}
.h2g-r2::after{animation:h2g-dot2 10s step-end infinite;}
.h2g-r3::after{animation:h2g-dot3 10s step-end infinite;}
.h2g-r4::after{animation:h2g-dot4 10s step-end infinite;}
@keyframes h2g-ring{0%,9%{border-color:#C9CDD4} 10%,100%{border-color:var(--a1-accent)}}
@keyframes h2g-ring2{0%,18%{border-color:#C9CDD4} 19%,100%{border-color:var(--a1-accent)}}
@keyframes h2g-ring3{0%,27%{border-color:#C9CDD4} 28%,100%{border-color:var(--a1-accent)}}
@keyframes h2g-ring4{0%,36%{border-color:#C9CDD4} 37%,100%{border-color:var(--a1-accent)}}
@keyframes h2g-dot{0%,9%{opacity:0} 10%,100%{opacity:1}}
@keyframes h2g-dot2{0%,18%{opacity:0} 19%,100%{opacity:1}}
@keyframes h2g-dot3{0%,27%{opacity:0} 28%,100%{opacity:1}}
@keyframes h2g-dot4{0%,36%{opacity:0} 37%,100%{opacity:1}}

/* step 3 — slider question */
.h2g-q .hint{margin-top:26px; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.05em; color:var(--a1-accent);}
.h2g-slider{position:relative; margin-top:42px; height:44px;}
.h2g-slider .trk{position:absolute; left:0; right:0; top:50%; transform:translateY(-50%); display:flex; height:14px; border-radius:9999px; overflow:hidden;}
.h2g-slider .trk i{flex:1;}
.h2g-slider .thumb{
  position:absolute; top:50%; width:28px; height:28px; margin-left:-14px; margin-top:-14px;
  border-radius:8px; background:#fff; border:1px solid #E5E7EB; box-shadow:0 6px 14px rgba(0,0,0,.16);
  display:flex; align-items:center; justify-content:center;
  animation:h2g-thumb 10s linear infinite;
}
@keyframes h2g-thumb{
  0%,49%,58%{left:12.5%}
  62%,68%{left:37.5%}
  72%,78%{left:62.5%}
  82%,100%{left:87.5%}
}
.h2g-slabels{display:flex; margin-top:22px;}
.h2g-slabels span{flex:1; text-align:center; font-size:14px; font-weight:700; color:#9ca3af; transform:translateY(0);}
.h2g-sl1{animation:h2g-sl1 10s linear infinite;}
.h2g-sl2{animation:h2g-sl2 10s linear infinite;}
.h2g-sl3{animation:h2g-sl3 10s linear infinite;}
.h2g-sl4{animation:h2g-sl4 10s linear infinite;}
@keyframes h2g-sl1{0%,49%,59%,100%{color:#9ca3af; transform:translateY(0)} 50%,58%{color:#E14B45; transform:translateY(-2px)}}
@keyframes h2g-sl2{0%,61%,69%,100%{color:#9ca3af; transform:translateY(0)} 62%,68%{color:#E8913C; transform:translateY(-2px)}}
@keyframes h2g-sl3{0%,71%,79%,100%{color:#9ca3af; transform:translateY(0)} 72%,78%{color:#E5C13F; transform:translateY(-2px)}}
@keyframes h2g-sl4{0%,81%,97%,100%{color:#9ca3af; transform:translateY(0)} 82%,96%{color:#33A06A; transform:translateY(-2px)}}
.h2g-feedback{margin-top:34px; border-radius:16px; border:1px solid var(--a1-border); background:var(--a1-soft); padding:20px 22px;}
.h2g-feedback b{display:flex; align-items:center; gap:6px; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.05em; color:var(--a1-accent);}
.h2g-feedback .val{position:relative; display:inline-block; min-width:78px; height:15px;}
.h2g-feedback .val i{position:absolute; left:0; top:0; font-style:normal; opacity:0; transform:translateY(4px); white-space:nowrap;}
.h2g-ltxt1{animation:h2g-ltxt1 10s linear infinite; color:#E14B45;}
.h2g-ltxt2{animation:h2g-ltxt2 10s linear infinite; color:#E8913C;}
.h2g-ltxt3{animation:h2g-ltxt3 10s linear infinite; color:#B99112;}
.h2g-ltxt4{animation:h2g-ltxt4 10s linear infinite; color:#33A06A;}
@keyframes h2g-ltxt1{0%,49%,59%,100%{opacity:0; transform:translateY(4px)} 50%,58%{opacity:1; transform:translateY(0)}}
@keyframes h2g-ltxt2{0%,61%,69%,100%{opacity:0; transform:translateY(4px)} 62%,68%{opacity:1; transform:translateY(0)}}
@keyframes h2g-ltxt3{0%,71%,79%,100%{opacity:0; transform:translateY(4px)} 72%,78%{opacity:1; transform:translateY(0)}}
@keyframes h2g-ltxt4{0%,81%,97%,100%{opacity:0; transform:translateY(4px)} 82%,96%{opacity:1; transform:translateY(0)}}
.h2g-feedback p{margin:8px 0 0; font-size:15px; line-height:1.6; color:#1f2937;}

/* step 3 — animated pointer paths */
.h2g-qcursor{animation:h2g-qcursor 10s cubic-bezier(.3,.8,.3,1) infinite;}
@keyframes h2g-qcursor{
  0%{transform:translate(-216px,-46px); opacity:0}
  4%{transform:translate(-216px,-10px); opacity:1}
  8%{transform:translate(-216px,0)}
  10%{transform:translate(-216px,4px)}
  13%,15%{transform:translate(-216px,0)}
  17%{transform:translate(-216px,46px)}
  19%{transform:translate(-216px,50px)}
  22%,23%{transform:translate(-216px,46px)}
  26%{transform:translate(-108px,92px)}
  28%{transform:translate(-108px,96px)}
  31%,32%{transform:translate(-108px,92px)}
  35%{transform:translate(-108px,138px)}
  37%{transform:translate(-108px,142px)}
  40%{transform:translate(-108px,138px); opacity:1}
  46%,100%{transform:translate(-108px,138px); opacity:0}
}
.h2g-scursor{animation:h2g-scursor 10s linear infinite;}
@keyframes h2g-scursor{
  0%,48%{left:12.5%; opacity:0}
  50%,58%{left:12.5%; opacity:1}
  62%,68%{left:37.5%; opacity:1}
  72%,78%{left:62.5%; opacity:1}
  82%,96%{left:87.5%; opacity:1}
  98%,100%{left:87.5%; opacity:0}
}


/* ===== STEP 4 — results ===== */
.h2g-res{height:810px; background:#FAFAFB; display:flex; flex-direction:column;}
.h2g-res .top{background:var(--a1-accent); height:72px; display:flex; align-items:center; justify-content:space-between; padding:0 40px; color:#fff; font-size:15px; font-weight:600;}
.h2g-res .mn{max-width:1240px; width:100%; margin:0 auto; padding:30px 40px;}
.h2g-res .intro{border-radius:16px; border:1px solid var(--a1-border); background:var(--a1-soft); padding:22px 26px;}
.h2g-res .intro .bd{display:inline-block; border-radius:9999px; padding:4px 12px; font-size:10px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#fff; background:var(--a1-accent);}
.h2g-res .intro h1{margin-top:10px; font-size:26px; color:var(--a1-accent);}
.h2g-res .intro p{margin:8px 0 0; max-width:880px; font-size:13px; line-height:1.6; color:#4b5563;}
.h2g-res .ov{margin-top:18px; border-radius:16px; border:1px solid var(--a1-border); background:var(--a1-soft); padding:22px 26px;}
.h2g-res .ov h2{font-size:17px;} .h2g-res .ov .sub{margin:4px 0 0; font-size:12px; color:var(--impact-ink-muted);}
.h2g-res .chart{margin-top:18px; border-radius:12px; background:#fff; padding:16px; border:1px solid rgba(0,0,0,.05); display:grid; grid-template-columns:minmax(0,300px) minmax(0,1fr); gap:28px; align-items:center;}
.h2g-lg{display:grid; grid-template-columns:1fr 1fr; gap:8px;}
.h2g-lg .it{display:flex; align-items:center; gap:10px; border:1px solid rgba(0,0,0,.05); border-radius:10px; padding:8px 10px;}
.h2g-lg .sw{width:12px; height:12px; border-radius:3px; flex:none;}
.h2g-lg b{display:block; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.h2g-lg small{font-size:11px; color:var(--impact-ink-muted);}
.h2g-wedge{opacity:0; animation:h2g-wedge 6s ease-in-out infinite;}
@keyframes h2g-wedge{0%,8%{opacity:0} 30%,92%{opacity:.62} 100%{opacity:0}}

/* Scrolling viewport for the results page */
.h2g-res .port{flex:1; overflow:hidden; position:relative;}
.h2g-res .port .mn{animation:h2g-pagescroll 14s ease-in-out infinite;}
@keyframes h2g-pagescroll{
  0%,12%{transform:translateY(0)}
  38%,46%{transform:translateY(-430px)}
  70%,78%{transform:translateY(-900px)}
  94%,100%{transform:translateY(0)}
}
.h2g-res .sec{margin-top:18px; border-radius:16px; border:1px solid var(--a1-border); background:#fff; padding:22px 26px;}
.h2g-res .sec h2{font-size:17px;} .h2g-res .sec .sub{margin:4px 0 0; font-size:12px; color:var(--impact-ink-muted);}
.h2g-flip{margin-top:16px; display:grid; grid-template-columns:repeat(3,1fr); gap:14px;}
.h2g-flip .card{border-radius:14px; padding:18px; min-height:120px; background:var(--a1-soft); border:1px solid var(--a1-border); font-size:13px; line-height:1.6; color:#374151;}
.h2g-flip .card b{display:block; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--a1-accent); margin-bottom:8px;}
.h2g-steps{margin-top:16px; display:flex; flex-direction:column; gap:10px;}
.h2g-steps .st{display:flex; align-items:center; gap:12px; border:1px solid var(--a1-border); border-radius:12px; padding:12px 14px; font-size:13px; color:#374151; background:#fff;}
.h2g-steps .bx{width:20px; height:20px; border-radius:6px; border:2px solid #C9CDD4; flex:none;}
.h2g-steps .st.on .bx{border-color:var(--a1-accent); background:var(--a1-accent);}
.h2g-cta{margin-top:18px; border-radius:16px; background:var(--a1-soft); border:1px solid var(--a1-border); padding:24px 26px; display:flex; align-items:center; justify-content:space-between; gap:20px;}
.h2g-cta h3{font-size:18px; color:var(--a1-accent);}
.h2g-cta p{margin:6px 0 0; font-size:13px; color:#4b5563; max-width:520px;}
.h2g-cta .btn{background:var(--a1-accent); color:#fff; border-radius:9999px; padding:12px 22px; font-size:14px; font-weight:700; white-space:nowrap;}

/* Note: the looping demos ARE the content of this guide, so we keep them
   running even with reduced-motion; we only slow them down a little. */
@media (prefers-reduced-motion: reduce){
  .h2g *, .h2g *::before, .h2g *::after{animation-duration:9s;}
}
`;

/* -----------------------------------------------------------------------------
   Small helper: typewriter caption that types on a loop.
   We animate width via steps() so it works purely in CSS.
   -------------------------------------------------------------------------- */
function Typed({
  text,
  delay = 0,
  chars,
}: {
  text: string;
  delay?: number;
  chars: number;
}) {
  return (
    <span
      className="h2g-cap"
      style={{
        width: `${chars}ch`,
        animation: `h2g-type-${chars} 6s steps(${chars}) infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {text}
    </span>
  );
}

/* Build the per-length typing keyframes once (each field has a fixed char count). */
function useTypingKeyframes(lengths: number[]) {
  return useMemo(() => {
    const uniq = Array.from(new Set(lengths));
    return uniq
      .map(
        (n) => `@keyframes h2g-type-${n}{
          0%{width:0} 22%{width:${n}ch} 100%{width:${n}ch}
        }`
      )
      .join("\n");
  }, [lengths]);
}

/* =============================================================================
   The rose chart (results) — same geometry as ResultsStep.tsx
   ============================================================================ */
function RoseChart() {
  const cx = 160,
    cy = 160,
    inner = 26,
    maxR = 116,
    n = 6;
  const levels = [3, 2, 3, 1, 2, 0];
  const colors = ["var(--lvl0)", "var(--lvl1)", "var(--lvl2)", "var(--lvl3)"];
  const step = 360 / n,
    bandCount = 4,
    bandGap = 6,
    gapPx = 9;
  const available = maxR - inner - (bandCount - 1) * bandGap;
  const thick = available / bandCount;
  const P = (r: number, deg: number): [number, number] => {
    const a = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const wedges: React.JSX.Element[] = [];
  const labels: React.JSX.Element[] = [];
  let key = 0;
  for (let i = 0; i < n; i++) {
    const base = -90 + i * step;
    const filled = levels[i] + 1;
    const color = colors[levels[i]];
    for (let b = 0; b < bandCount; b++) {
      if (b >= filled) continue;
      const r0 = inner + b * (thick + bandGap);
      const r1 = r0 + thick;
      const hgI = ((gapPx / 2 / r0) * 180) / Math.PI;
      const hgO = ((gapPx / 2 / r1) * 180) / Math.PI;
      const [x1, y1] = P(r0, base + hgI);
      const [x2, y2] = P(r1, base + hgO);
      const [x3, y3] = P(r1, base + step - hgO);
      const [x4, y4] = P(r0, base + step - hgI);
      wedges.push(
        <path
          key={key++}
          className="h2g-wedge"
          style={{ animationDelay: `${i * 0.18 + b * 0.05}s` }}
          d={`M ${x1} ${y1} L ${x2} ${y2} A ${r1} ${r1} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r0} ${r0} 0 0 0 ${x1} ${y1} Z`}
          fill={color}
        />
      );
    }
    const [tx, ty] = P(maxR + 30, -90 + step / 2 + i * step);
    labels.push(
      <text
        key={`t${i}`}
        x={tx}
        y={ty + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="800"
        fill="#111827"
        fontFamily="Inter, sans-serif"
      >
        {`1.${i + 1}`}
      </text>
    );
  }
  return (
    <svg viewBox="-24 -24 368 368" width="300" height="300" style={{ overflow: "visible" }}>
      {[48.5, 71, 93.5, 116].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--a1-border)" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      {wedges}
      {labels}
      <circle cx={cx} cy={cy} r="22" fill="#fff" />
    </svg>
  );
}

/* Polished macOS-style pointer used by the looping demos. */
function Pointer({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`h2g-cursor ${className}`} style={style}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5.2 2.4 L18.6 13.1 L12.1 13.6 L15.4 20.4 L12.5 21.7 L9.2 15 L5.2 19.1 Z"
          fill="#111827"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/* =============================================================================
   The four screens
   ============================================================================ */
const PublicHeader = () => (
  <header className="h2g-header">
    <div className="inner" style={{ justifyContent: "flex-end" }}>
      <nav className="h2g-nav-links">
        <a href="#">Home</a>
        <a href="#">Resource Hub</a>
        <a href="#">Send us a message</a>
        <span className="pill">Log-in / Sign-up</span>
      </nav>
    </div>
  </header>
);

/* ---- STEP 1: create account ---- */
function ScreenAuth() {
  return (
    <div className="h2g-screen">
      <PublicHeader />
      <div className="h2g-auth">
        <aside className="h2g-auth-l">
          <div className="h2g-poly" style={{ width: 120, height: 120, top: -30, right: -20, transform: "rotate(-18deg)" }}>
            <svg viewBox="0 0 100 100"><polygon points="50,5 95,80 5,80" fill="rgba(255,255,255,0.08)" /></svg>
          </div>
          <div className="h2g-poly" style={{ width: 70, height: 70, top: 60, right: 90, transform: "rotate(35deg)" }}>
            <svg viewBox="0 0 100 100"><polygon points="50,5 95,80 5,80" fill="rgba(244,162,97,0.5)" /></svg>
          </div>
          <div className="h2g-poly" style={{ width: 90, height: 90, top: "40%", left: -30, transform: "rotate(210deg)" }}>
            <svg viewBox="0 0 100 100"><polygon points="50,5 95,80 5,80" fill="rgba(233,75,138,0.35)" /></svg>
          </div>
          <h1>Sign-up your council</h1>
          <p>Sign-up your Local Youth Council to save assessments and revisit results anytime.</p>
        </aside>
        <section className="h2g-auth-r">
          <div className="h2g-form">
            <div className="h2g-tabs">
              <span>Log-in</span>
              <span className="on">Sign-up</span>
            </div>
            <div className="h2g-fld">
              <label>Full name *</label>
              <div className="box"><Typed text="António Boto" chars={12} delay={0.2} /></div>
            </div>
            <div className="h2g-fld">
              <label>Local Youth Council</label>
              <div className="box"><Typed text="Riverside Youth Council" chars={23} delay={1.1} /></div>
            </div>
            <div className="h2g-grid2">
              <div className="h2g-fld">
                <label>Country *</label>
                <div className="box"><Typed text="Portugal" chars={8} delay={2.0} /></div>
              </div>
              <div className="h2g-fld">
                <label>City *</label>
                <div className="box"><Typed text="Lisbon" chars={6} delay={2.5} /></div>
              </div>
            </div>
            <div className="h2g-fld">
              <label>Email address</label>
              <div className="box"><Typed text="antonio.boto@dypall.com" chars={23} delay={3.0} /></div>
            </div>
            <div className="h2g-submit">Sign-up</div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---- STEP 2: pick focus area ---- */
function ScreenDashboard() {
  const areas = [
    {
      n: 1,
      title: "Representativeness and Inclusion",
      desc: "Who is part of the LYC, how representative it is of local youth, and how inclusive participation is for all.",
      bg: "#F4F1F7",
      badgeBg: "#EDE4F6",
      badgeFg: "#502181",
      go: "var(--impact-purple)",
    },
    {
      n: 2,
      title: "Governance and Transparency",
      desc: "How the LYC is organised, how decisions are made, and how open and accountable it is to youth and the community.",
      bg: "#FBF3EA",
      badgeBg: "#FDE6CE",
      badgeFg: "#B85E10",
      go: "var(--impact-orange)",
    },
    {
      n: 3,
      title: "Influence and Impact",
      desc: "How much the LYC shapes local decisions and creates real change for young people in the community.",
      bg: "#FCF0F5",
      badgeBg: "#FBDCE9",
      badgeFg: "#B02063",
      go: "var(--impact-pink)",
    },
    {
      n: 4,
      title: "Capacity and Sustainability",
      desc: "The resources, skills, support and continuity that keep the LYC running effectively over time.",
      bg: "#EDF7F7",
      badgeBg: "#D3EDED",
      badgeFg: "#12706F",
      go: "var(--impact-green)",
    },
  ];

  return (
    <div className="h2g-screen">
      <div className="h2g-dash">
        <aside>
          <div className="pp">
            <div className="av">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <div className="wc"><h4>Welcome back, António!</h4><p>How do you feel today?</p></div>
            <div className="st">
              <div><b>8</b><span>Questionnaires done</span></div>
              <div><b>2</b><span>In progress</span></div>
            </div>
            <div className="ql">
              <h5>Quick Links</h5>
              <a href="#">Home</a>
              <a href="#">Resource Hub</a>
              <a href="#">Send us a message</a>
            </div>
          </div>
        </aside>
        <main>
          <h2>Start Your Assessment</h2>
          <p className="lede">Choose a thematic area to launch a self-assessment. You can pause anytime, revisit past questionnaires and build action plans as you go.</p>

          {areas.map((a) => (
            <article
              key={a.n}
              className="h2g-card"
              style={{
                background: a.bg,
                boxShadow: a.n === 1 ? "0 0 0 3px rgba(80,33,129,.28)" : undefined,
              }}
            >
              <div className="tx">
                <span className="bd" style={{ background: a.badgeBg, color: a.badgeFg }}>AREA {a.n}</span>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
              <div className="go" style={{ background: a.go }}>Start a new assessment</div>
              {a.n === 1 && (
                /* looping cursor tap on the AREA 1 button */
                <Pointer
                  style={{ right: 60, top: 44, animation: "h2g-tap2 3.4s cubic-bezier(.3,.8,.3,1) infinite" }}
                />
              )}
            </article>
          ))}
        </main>
      </div>
      <style>{`
        @keyframes h2g-tap2{
          0%{transform:translate(130px,-70px); opacity:0}
          18%{opacity:1}
          42%{transform:translate(0,0); opacity:1}
          50%{transform:translate(0,5px)}
          58%,74%{transform:translate(0,0); opacity:1}
          92%,100%{transform:translate(0,0); opacity:0}
        }
      `}</style>

    </div>
  );
}

/* ---- STEP 3: questionnaire (two question types, looping) ---- */
function ScreenQuestionnaire() {
  return (
    <div className="h2g-screen">
      <div className="h2g-q">
        <div className="top">
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7M19 12H5" /></svg>
            Back to Dashboard
          </span>
          <span className="sq">Save &amp; Quit</span>
          <div className="rt">
            <span className="ct">
              <span className="h2g-fade1">Question 1 of 6</span>
              <span className="h2g-fade2">Question 3 of 6</span>
            </span>
            <span className="bar"><i /></span>
          </div>
        </div>
        <div className="mn">
          <div className="stage">
            {/* ---- Question type A: Yes / No / N/A matrix ---- */}
            <div className="pane h2g-fade1">
              <h1>1.1 Diversity of Membership</h1>
              <div className="about">
                <h2>About This Indicator</h2>
                <p>The LYC strives to reflect the demographic composition of the local youth population by including members of different ages, genders, backgrounds and abilities.</p>
              </div>
              <p className="qq">Does your LYC reflect the demographic composition of the local youth population?</p>
              <div className="tbl">
                <div className="th"><span>Criteria</span><span>Yes</span><span>No</span><span>N/A</span></div>
                <div className="tr" style={{ background: "var(--a1-row)" }}>
                  <span className="c">Young people of different age ranges</span>
                  <span className="cell"><span className="h2g-rad on h2g-r1" /></span>
                  <span className="cell"><span className="h2g-rad" /></span>
                  <span className="cell"><span className="h2g-rad" /></span>
                </div>
                <div className="tr" style={{ background: "#fff" }}>
                  <span className="c">Young people of different genders</span>
                  <span className="cell"><span className="h2g-rad on h2g-r2" /></span>
                  <span className="cell"><span className="h2g-rad" /></span>
                  <span className="cell"><span className="h2g-rad" /></span>
                </div>
                <div className="tr" style={{ background: "var(--a1-row)" }}>
                  <span className="c">Young people from different cultural and ethnic backgrounds</span>
                  <span className="cell"><span className="h2g-rad" /></span>
                  <span className="cell"><span className="h2g-rad on h2g-r3" /></span>
                  <span className="cell"><span className="h2g-rad" /></span>
                </div>
                <div className="tr" style={{ background: "#fff" }}>
                  <span className="c">Young people with disabilities</span>
                  <span className="cell"><span className="h2g-rad" /></span>
                  <span className="cell"><span className="h2g-rad on h2g-r4" /></span>
                  <span className="cell"><span className="h2g-rad" /></span>
                </div>
                <Pointer className="h2g-qcursor" style={{ right: 74, top: 61 }} />
              </div>
            </div>

            {/* ---- Question type B: slider scale ---- */}
            <div className="pane h2g-fade2">
              <h1>1.3 Outreach and Consultation</h1>
              <div className="about">
                <h2>About This Indicator</h2>
                <p>The LYC actively reaches out to young people who are not yet involved and consults them before taking positions or decisions.</p>
              </div>
              <p className="qq">How regularly does your LYC consult young people beyond its own members?</p>
              <p className="hint">Use the slider to choose what fits best for your case</p>
              <div className="h2g-slider">
                <div className="trk">
                  <i style={{ background: "#E14B45" }} />
                  <i style={{ background: "#E8913C" }} />
                  <i style={{ background: "#E5C13F" }} />
                  <i style={{ background: "#33A06A" }} />
                </div>
                <div className="thumb">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                    <path d="M0 0L16 0L8 10Z" fill="var(--a1-accent)" />
                  </svg>
                </div>
                <Pointer className="h2g-scursor" style={{ top: 26, marginLeft: -4 }} />
              </div>
              <div className="h2g-slabels">
                <span className="h2g-sl1">Not at all</span>
                <span className="h2g-sl2">Partially</span>
                <span className="h2g-sl3">Mostly</span>
                <span className="h2g-sl4">Fully</span>
              </div>
              <div className="h2g-feedback">
                <b>
                  Selected level:
                  <span className="val" aria-hidden="true">
                    <i className="h2g-ltxt1">Not at all</i>
                    <i className="h2g-ltxt2">Partially</i>
                    <i className="h2g-ltxt3">Mostly</i>
                    <i className="h2g-ltxt4">Fully</i>
                  </span>
                </b>
                <p>The LYC consults young people regularly through open and accessible channels, and feeds what it hears back into its positions and decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---- STEP 4: review results ---- */
function ScreenResults() {
  const legend = [
    ["var(--lvl3)", "1.1 Diversity of Membership", "Fully"],
    ["var(--lvl2)", "1.2 Representation of groups", "Mostly"],
    ["var(--lvl3)", "1.3 Outreach and consultation", "Fully"],
    ["var(--lvl1)", "1.4 Legitimacy", "Partially"],
    ["var(--lvl2)", "1.5 Equality and non-discrimination", "Mostly"],
    ["var(--lvl0)", "1.6 Accessibility", "Not at all"],
  ] as const;
  return (
    <div className="h2g-screen">
      <div className="h2g-res">
        <div className="top">
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7M19 12H5" /></svg>
            Back to Dashboard
          </span>
          <span style={{ fontSize: 13, opacity: 0.85 }}>Saved results</span>
        </div>
        <div className="port">
        <div className="mn">
          <div className="intro">
            <span className="bd">Area 1</span>
            <h1>Representativeness and Inclusion</h1>
            <p>Who is part of the LYC, how representative it is of local youth, and how inclusive and accessible participation is for all. Below you'll find detailed feedback, reflection questions, and recommended action steps.</p>
          </div>
          <div className="ov">
            <h2>Results Overview</h2>
            <p className="sub">A quick snapshot of your performance across all indicators</p>
            <div className="chart">
              <RoseChart />
              <div className="h2g-lg">
                {legend.map(([c, t, s], i) => (
                  <div className="it" key={i}>
                    <span className="sw" style={{ background: c }} />
                    <span><b>{t}</b><small>{s}</small></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sec">
            <h2>Reflection questions</h2>
            <p className="sub">Tap a card to reveal a prompt to discuss with your team</p>
            <div className="h2g-flip">
              <div className="card"><b>Reflect</b>Which groups of young people are still missing from your council, and why?</div>
              <div className="card"><b>Reflect</b>How do you know your members represent the local youth population?</div>
              <div className="card"><b>Reflect</b>What barriers make it harder for some young people to take part?</div>
            </div>
          </div>

          <div className="sec">
            <h2>Recommended action steps</h2>
            <p className="sub">Pick up to three steps to include in your action plan</p>
            <div className="h2g-steps">
              <div className="st on"><span className="bx" />Map the demographics of local youth and compare them with your membership.</div>
              <div className="st on"><span className="bx" />Run open call-outs in schools, youth clubs and online spaces you don't usually reach.</div>
              <div className="st"><span className="bx" />Review meeting times, venues and formats for accessibility.</div>
              <div className="st"><span className="bx" />Set a yearly target for the diversity of new members.</div>
            </div>
          </div>

          <div className="h2g-cta">
            <div>
              <h3>Ready to take action?</h3>
              <p>Build your personalised Action Plan from the steps you selected and share it with your council.</p>
            </div>
            <span className="btn">Build your action plan</span>
          </div>
        </div>
        </div>

      </div>
    </div>
  );
}

/* =============================================================================
   Step metadata + main component
   ============================================================================ */
const SCREENS = [ScreenAuth, ScreenDashboard, ScreenQuestionnaire, ScreenResults];

const STEP_META = [
  {
    kicker: "Step one",
    title: "Create your account",
    color: "var(--impact-purple)",
    desc: (
      <>
        Register your Local Youth Council so results, action plans and reflections
        are stored securely in one place.
      </>
    ),
  },
  {
    kicker: "Step two",
    title: "Pick a focus area",
    color: "var(--impact-orange)",
    desc: (
      <>
        Choose one of the four IMPACT thematic areas —{" "}
        <b>Representativeness, Governance, Empowerment or Results</b> — and launch
        a self-assessment.
      </>
    ),
  },
  {
    kicker: "Step three",
    title: "Answer the questionnaire",
    color: "var(--impact-pink)",
    desc: (
      <>
        Rate your council against each indicator. It takes 15–30 minutes and you
        can save your progress at any point.
      </>
    ),
  },
  {
    kicker: "Step four",
    title: "Review your results",
    color: "var(--impact-green)",
    desc: (
      <>
        Get a visual scoreboard, reflection prompts and recommended action steps
        that become your council's action plan.
      </>
    ),
  },
];

export function HowToGetStartedModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const screensRef = React.useRef<HTMLDivElement>(null);
  const isLast = step === SCREENS.length - 1;
  const Screen = SCREENS[step];
  const meta = STEP_META[step];

  const typingKeyframes = useTypingKeyframes([12, 23, 8, 6]);

  // reset to step 1 each time the modal opens
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // scale the 1440×810 canvas to fit its stage (width AND height)
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    let ro: ResizeObserver | undefined;

    const fit = () => {
      const stage = stageRef.current;
      const screens = screensRef.current;
      if (!stage || !screens) return;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      const s = Math.min(w / 1440, h / 810);
      screens.style.transform = `scale(${s})`;
    };

    const attach = () => {
      const stage = stageRef.current;
      if (!stage) {
        raf = requestAnimationFrame(attach);
        return;
      }
      ro = new ResizeObserver(fit);
      ro.observe(stage);
      fit();
    };
    attach();

    window.addEventListener("resize", fit);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [open, step]);

  const handleNext = () => {
    if (isLast) {
      onOpenChange(false);
      navigate({ to: "/auth" });
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h2g p-0 overflow-hidden gap-0 border-0"
        style={{
          width: "calc(100vw - 40px)",
          maxWidth: 1340,
          maxHeight: "calc(100vh - 40px)",
        }}
      >
        <style>{STYLES + typingKeyframes}</style>

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 24px", borderBottom: "1px solid var(--impact-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 9999, background: "#EDE4F6", color: "var(--impact-purple)", padding: "4px 12px", fontSize: 11, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase" }}>
              Guia
            </span>
            <DialogTitle style={{ fontSize: 19, fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              How to get started
            </DialogTitle>
          </div>
        </div>

        {/* body */}
        <div className="h2g-body">
          {/* LEFT: looping screen */}
          <div className="h2g-pane">
            <div className="h2g-stage" ref={stageRef}>
              <div className="h2g-screens" ref={screensRef}>
                {/* keyed by step so the animation restarts cleanly each time */}
                <Screen key={step} />
              </div>
            </div>
          </div>

          {/* RIGHT: instructions */}
          <aside className="h2g-steps">
            <p className="h2g-kicker" style={{ color: meta.color }}>
              {meta.kicker}
            </p>
            <h3>{meta.title}</h3>
            <p className="h2g-desc">{meta.desc}</p>

            <div className="h2g-dots">
              {SCREENS.map((_, i) => (
                <span
                  key={i}
                  className={`h2g-dot ${i < step ? "done" : ""} ${i === step ? "active" : ""}`}
                >
                  {i === step ? <i /> : null}
                </span>
              ))}
            </div>

            <div className="h2g-spacer" />

            <div className="h2g-nav">
              <button className="h2g-back" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
                Back
              </button>
              <button className="h2g-next" onClick={handleNext}>
                {isLast ? "Start your assessment" : "Next"}
              </button>
            </div>

            <div className="h2g-skip">
              <button onClick={() => onOpenChange(false)}>Skip for now</button>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HowToGetStartedModal;
