# Plan: Replicate IMPACT Figma design in Lovable

## What I found in your Figma file

The file contains a complete IMPACT digital platform for Local Youth Councils (LYCs). The key screens identified are:

- **IMPACT - Home** (landing page) — frame `9:10`
- **IMPACT - Dashboard** — frame `44:833`
- **Assessment results page** — frame `135:6`
- Hero style variants and color-palette reference frames

Design tokens (from the landing page and palette frames):
- Primary purple: `#502181`
- Primary green: `#219c9e`
- Accent orange: `#f4a261`
- Heading font: Work Sans ExtraBold
- Body font: Inter Regular / Bold
- Surface white, light gray `#f5f5f5`, body text `#111827`, muted text `#6b7280`

## Approach

Because you want frontend **and backend features** (auth, assessment data, action plans), this project needs a database and authentication. I will enable **Lovable Cloud** first, then build the landing page as a public route, and add the remaining screens and backend features in phases.

---

## Phase 1 — Landing page (pixel-perfect public route)

Goal: Replicate the `IMPACT - Home` screen at `/`.

1. **Enable Lovable Cloud**
   - Provision the managed PostgreSQL + auth backend so later phases can store users, assessments, and action plans.

2. **Design tokens**
   - Update `src/styles.css` with IMPACT colors, load Inter and Work Sans via `<link>` in `src/routes/__root.tsx`, and map the custom purple/green/orange palette to semantic tokens.

3. **Assets**
   - Download the Figma-exportable images (logo, hero photo, step photos, CTA photo, partner logos) from the local MCP output into `src/assets/`. Replace any `localhost:3845` URLs with project-local assets.

4. **Page structure**
   - Rewrite `src/routes/index.tsx` with the full landing page:
     - Header with logo, nav (Home, Resource Hub, Send us a message), and a purple "Log in / Sign up" pill.
     - Hero section with the purple background, floating polygon shapes, headline, subtitle, and two CTAs.
     - "How to start assessing?" 4-step card grid.
     - Teal CTA banner with floating polygons and action button.
     - Partner consortium section.
     - Footer.
   - Define route-specific `head()` metadata (title, description, OG, Twitter).

5. **Components**
   - Create small reusable components in `src/components/` only where they are reused across multiple routes (e.g., `PolygonShape`, `StepCard`, `PartnerLogo`, `ImpactButton`). Keep the landing page mostly self-contained to preserve the Figma composition.

6. **Validation**
   - Run the build and compare the rendered page with the Figma screenshot, checking spacing, colors, typography, and asset placement.

---

## Phase 2 — Authentication + protected app shell

1. **Auth flow**
   - Create `/auth` route for sign-in/sign-up.
   - Use the Lovable Cloud (Supabase) auth client.
   - Add the managed `_authenticated/` layout for protected routes.
   - Wire `src/start.ts` function middleware to attach the bearer token for authenticated server functions.

2. **Protected routes**
   - Move Dashboard and Assessment results under `/_authenticated/dashboard` and `/_authenticated/assessment-results` (or similar paths).

---

## Phase 3 — Remaining public and app pages

1. **Resource Hub** and **Contact** public routes.
2. **Dashboard** — sidebar, progress stats, quick links, recent activity, questionnaire cards.
3. **Assessment results** — score cards, battery visualizations, accordions, reflection questions, action steps, action-plan banner.
4. **Assessment flow** — questionnaire pages if the Figma file contains them.

---

## Phase 4 — Backend schema and data

1. **Database tables** (with RLS + GRANTs):
   - `profiles` (user metadata, org name)
   - `assessments` (questionnaire responses, area, score, status)
   - `indicators` / `areas` (question taxonomy)
   - `action_steps` and `action_plans` (per-user checklists)

2. **Server functions**
   - Public read-only functions for marketing content.
   - Authenticated functions for saving assessments, listing results, building action plans, toggling action steps.

3. **Integrations**
   - Route CTAs to the assessment flow and dashboard.

---

## What I will build first

If you approve, I will start with **Phase 1** only: enable Lovable Cloud and replicate the landing page at `/` as a pixel-perfect public route. Once you review it, we will move to auth and the remaining screens.

## Open question

Do you want me to keep the original Figma placeholder copy ("Lorem ipsum" in step cards and footer) or replace it with real IMPACT content? If you have copy, paste it here; otherwise I will replicate the Figma text exactly.