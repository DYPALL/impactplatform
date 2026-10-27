<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Tutorial media sources live in one browser-safe configuration module; all placements use the shared tutorial view so unavailable media never creates broken players.
- Social-account council details are collected in one root-level profile completion dialog using owner-scoped profile access; OAuth must return to a public origin.
- The Home resource carousel reads only published resource records and preserves original publisher links.
- Use Embla with its Auto Scroll plugin for continuous looping Home resources; pause over cards, during card focus, when hidden and for reduced motion so controls do not trap playback.
- Keep Home FAQ answer panels mounted and animate grid rows with hidden/inert closed content, so opening and closing remain smooth and accessible.
- Prebundle the carousel Auto Scroll plugin in Vite at startup to avoid late dependency optimization replacing React bundles in an open preview.
- Share FAQ copy between the FAQ page and Home accordion through a browser-safe data module to prevent divergent answers.
- Blank Action Plan exports are a static same-origin fillable, printable PDF, independent of a user's saved plan.
- Home's five assessment steps live in a dedicated browser-safe Embla view so card navigation and explanatory copy stay separate from the rest of Home.
- Publication cards share a browser-safe cover mockup view across Home and Resource Hub; presentation preserves original artwork and publisher links without modifying resource records.
- Non-video resource covers use the shared mockup; a browser-safe asset mapping swaps adapted covers without changing original downloads or catalogue metadata. Covers flagged landscape in src/lib/publication-covers.ts render as a horizontal book variant; all others render upright.
- A route file whose path is a prefix of another route (e.g. /resource-hub vs /resource-hub/$id) is a layout and must render <Outlet />; its own page content lives in a matching .index.tsx, otherwise the parent swallows nested pages and they never render.
- Resource cards show only a three-line clamped summary with no expand control; the full description lives on the resource detail page, whose cover uses the mockup's larger panel-free variant.
- Key page entrance transitions and shared navigation visibility to committed route matches, not the pending URL, and keep content visible throughout; this prevents the outgoing page flashing or shifting before its replacement is ready.
