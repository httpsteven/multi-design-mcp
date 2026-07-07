# Multi-Design MCP

An MCP (Model Context Protocol) server that packages **agency-grade web design intelligence** so Claude — or any MCP client — can create premium websites and generate large batches of high-quality pages that stay visually coherent.

It encodes a premium web methodology as callable tools: curated art directions, complete design systems, narrative page blueprints, motion and copywriting standards, hard anti-pattern guards, and a pre-ship polish checklist. Instead of hoping the model "designs well," every build starts from an explicit design contract.

## What's inside

**18 curated design directions** (the "multi" in multi-design):

| Style | Best for |
|---|---|
| `editorial-luxury` | event venues, hotels, luxury real estate |
| `cinematic-noir` | photographers, film, nightlife, automotive |
| `swiss-minimal` | studios, architecture, consultancies |
| `brutalist-statement` | agencies, music, streetwear, campaigns |
| `organic-warm` | wellness, cafés, boutique hotels, retreats |
| `art-deco-opulent` | bars, ballrooms, jewelry, theaters |
| `tech-precision` | dev tools, hardware, fintech, AI products |
| `gallery-white` | artists, galleries, premium portfolios |
| `retro-editorial` | magazines, coffee, indie studios |
| `monochrome-fashion` | fashion, beauty, lookbooks |
| `craftsman-trust` | glass companies, contractors, roofing, local trades |
| `care-trust` | health clinics, dental, therapy, veterinary, senior care |
| `ivory-elegance` | light-mode venues, bridal, boutique hotels, spas |
| `appetite-bold` | restaurants, taquerías, food trucks, cafés, catering |
| `estate-serif` | real estate, developments, land, vacation rentals |
| `iron-grit` | gyms, martial arts, trainers, barbershops, tattoo |
| `counsel-classic` | law firms, accounting, insurance, advisors |
| `showroom-drive` | dealerships, detailing, mechanics, rentals |

Each style is a complete art direction: typography pairing (Google Fonts), palette with usage logic, motion character with exact easings, imagery direction, signature details, and style-specific prohibitions.

**18 page blueprints**: `home`, `about`, `services`, `gallery`, `contact`, `pricing`, `faq`, `blog-index`, `blog-post`, `product`, `case-study`, `team`, `locations`, `careers`, `landing-local-service`, `menu`, `landing-campaign`, `coming-soon` — each a narrative section structure with per-section copywriting guidance. Three are batch workhorses for mass generation: `landing-local-service` (repeat per city/service), `landing-campaign` (repeat per promo/package/season), and `menu` (restaurant menus as typography with one-tap ordering).

**Composition layer** — every style also defines its physical structure, not just its look:
- a **hero architecture** (immersive full-bleed / conversion split-form with quote card / editorial split-media / typographic / ceremonial framed / fashion campaign),
- a **gallery pattern** (asymmetric editorial grid / horizontal scroll strip / museum single-stack / masonry columns),
- a **content layout rotation** (text-media splits, offset narrow columns, full-bleed bands, index lists, sticky narrative splits) so adjacent sections never repeat,
- allowed **image crops and treatment CSS** (grading, masks, borders),
- **nav and footer structure** (overlay / solid bar / edge caps; column / mega-CTA / minimal line).

This spec appears in every build brief ("Layout & Composition") and is physically implemented by `scaffold_page`, which outputs a working page: real nav, the style's hero (including forms where the style is conversion-driven), 12-column grid layouts, gallery markup, `<details>` FAQ accordions, footer — with placeholder images (picsum.photos) marked `<!-- REEMPLAZAR -->` for curation.

**Variation engine** — no two sites from the same style share bones. Every style declares which hero architectures (now 10, including kinetic typography with an accessible static h1, bento with differentiated cells, and broken-grid collage), gallery patterns (now 6, including bento media grids and sticky stacked panels), and signature flourishes it can legitimately wear. A `variationSeed` (any positive integer, deterministic) picks an alternate combination and 2–3 flourishes from a 16-item library — grain overlay, marquee ticker, scroll progress, masked line reveals, custom cursor, magnetic buttons, image trail, text scramble, wordmark preloader, parallax, view transitions, pinned story scenes, WebGL accent, oversized footer wordmark, variable-font hover. Cheap flourishes are physically scaffolded; the rest ship as precise implementation specs inside the HTML. Alternates respect taste: a clinic can get a bento hero, never a collage or text scramble.

**Trend grounding** — `get_design_trends` returns a researched catalog (Awwwards SOTY patterns, post-hype 2026 retrospectives) with honest risk notes: kinetic type needs a static accessible h1; bento at saturation needs differentiation; 3D is one meaningful accent, never a theme park; pinned scenes must pin, not hijack.

**Modern stack intelligence** — [stacks.js](src/data/stacks.js) is a curated, verified-2026 library catalog with when-to-use and premium-restraint notes: GSAP (**100% free since April 2025 including SplitText/ScrambleText/DrawSVG/MorphSVG** — the briefs tell builders to stop hand-rolling these), Lenis momentum scroll (auto-wired into scaffolds via `gsap.ticker`, deliberately skipped for trust-sector styles where native scroll reads more honest), Motion, anime.js v4, OGL vs Three.js guidance, PhotoSwipe, Embla, native View Transitions API, Alpine for the EN/ES toggle, and Astro as the batch-generation upgrade path. Recipes cover the static-host realities: forms with no backend (WhatsApp deep link + Formspree), page transitions on MPA, 50-city-page generation. Every flourish now names its exact library. Briefs get a "Modern Stack" section automatically; `plan_site` adds batch advice at 5+ pages.

**Framer-feel motion without Framer Motion** — Framer's magic decomposed into five zero-Framer primitives, encoded as the `framer-feel-motion` recipe and baked into scaffolds: **springs** via `--ease-spring`, a real spring curve shipped in every design system as CSS `linear()` (browser-native physics, zero JS — scaffolded CTAs get spring tap feedback via `:active { scale }`); **layout animations** (Framer's `layout` prop) via GSAP Flip, free; **enter** via native `@starting-style`; **exit** (AnimatePresence) via the View Transitions API + `allow-discrete`; **gestures** via `:active`/`gsap.quickTo`/GSAP Draggable. Scaffold reveals use `clearProps` so GSAP's inline transforms never block CSS interaction states.

**Code economy (Ponytail / YAGNI)** — every brief carries a 10-rule minimal-code contract built on Ponytail's decision ladder, adapted for static web: does it need to exist → native HTML → native CSS → already-loaded library → few lines of vanilla → only then more. No single-use abstractions, no wrapper divs, no JS for CSS-expressible states, no dependencies beyond the recipes; the polish checklist audits for dead code and a ~120KB page-weight sanity cap. The same principle applies to the MCP's own output: `plan_site`/`bootstrap_website` emit one **Shared Site Contract** plus compact per-page briefs instead of repeating the full contract per page — measured **71% fewer tokens** on a 5-page plan. `quality_standards` gained a `code-economy` section.

**Semantic tokens & form UX (cross-checked with ui-ux-pro-max's WCAG-adjusted token system)** — every design system now derives `--color-on-accent` (luminance-computed readable text on the accent), `--color-error` (tuned per light/dark background), and `--color-ring` (focus). Scaffolds use them: visible `:focus-visible` rings, correct CTA hover contrast, `:user-invalid` error borders (validate on blur, never keystroke). A 12-point Form UX rulebook (visible labels, semantic input types, autocomplete, aria-live errors, focus-first-invalid, 3–5 field maximum) auto-attaches to any brief whose page captures leads, and `quality_standards` gained a `forms` audit section. Conversion blueprints also carry an explicit **CTA strategy** (placement plan: nav + after-proof + bottom; campaign pages get exactly one action).

**Dolly push-in hero (`dolly-zoom`)** — scrolling moves you INTO the scene: sticky viewport, image scaling 1→~2.3 with scroll progress while the headline fades and rises. Available as a variation alternate in six styles, or force it anywhere with the `heroVariant` parameter on `scaffold_page`/`compose_build_prompt`. Reduced-motion shows the static image.

**Interactive scroll (the AirPods mechanic)** — the `scrub-sequence` flourish scaffolds a real scroll-scrubbed sequence: a 300vh track with a sticky viewport and a canvas whose drawing is driven by scroll progress. It ships with a **procedural placeholder** (a rotating wireframe product in the brand's accent color) so the mechanic works before any assets exist; swap in real frames via `data-frames`/`data-frame-count` (ffmpeg extraction command is in the section comment — 60–120 webp frames from a product video or Blender turntable). Sticky-based, so scroll is never hijacked; static frame under `prefers-reduced-motion`. Available in the variation pools of the product/story-driven styles (noir, tech, showroom, fashion, iron, editorial).

**Real Node projects, not loose HTML** — `scaffold_project` emits a complete Vite project as a file manifest (package.json, vite.config.js with multi-page inputs and base `"./"`, .gitignore, GitHub Pages deploy workflow, src/js/config.js for contact details, README) alongside the pages — matching the studio convention where Vite is the only dependency and output stays plain static. Verified: a generated 3-page project runs `npm install` and `npm run build` clean, producing gzipped ~7-8KB pages. Every build brief now carries a **Project Structure Mandate** forcing this — no agent ships a folder of guessed `.html` files.

**Multi-page sites** — `plan_site`/`bootstrap_website` produce per-page briefs with consistency rules, and `scaffold_site` materializes the whole thing: every page shares byte-identical tokens/nav/footer, nav links are real relative hrefs with `aria-current` on the active page, and interior pages automatically use a reduced-height version of the same hero architecture.

**Mobile-usable by contract** — every layer enforces it. Briefs carry a "Mobile Mandate" (mobile-first for local businesses, 44px touch targets, thumb-zone CTAs, no hover-dependent info, svh units, zero overflow at 360px, pointer flourishes gated behind `(pointer: fine)`). `quality_standards` has a `mobile` section for audits. Scaffolds ship a **working hamburger menu** — the toggle is fixed on mobile so it can never scroll away or be covered by the open panel, relabels Menu ↔ Close (localized Menú ↔ Cerrar), manages focus (into the menu on open, back to the toggle on close), closes on link tap/Escape, and scroll-locks the body — plus a **sticky Call/WhatsApp action bar** on conversion contexts (trades/clinic styles + lead-gen/contact/pricing pages, safe-area-inset padded), and 16px-floor form inputs so iOS never auto-zooms.

**Language support**: set `business.language` to `'en'`, `'es'`, or `'bilingual en/es'`. Single-language briefs enforce all copy rules in that language; bilingual briefs mandate a language toggle with a shared I18N strings object, both languages written with equal care. Scaffolds set `<html lang>` accordingly.

## Tools

| Tool | Purpose |
|---|---|
| `bootstrap_website` | **The entry point** — one call: ranked style + name-derived deterministic variation + full site plan with every build brief + workflow |
| `list_design_styles` / `get_design_style` | Browse and inspect art directions |
| `recommend_style` | Ranked style recommendation for an industry + mood |
| `list_page_blueprints` / `get_page_blueprint` | Browse page narrative structures |
| `create_design_system` | Full token set: CSS variables, font imports, spacing, motion spec |
| `compose_build_prompt` | Complete agency-grade build brief for one page |
| `plan_site` | **Batch generation**: shared design system + consistency rules + a ready build brief for every page |
| `scaffold_page` | Actual starter HTML: tokens, semantic sections, GSAP reveals, reduced-motion support |
| `scaffold_site` | A complete **linked multi-page site** in one call: shared tokens, real cross-page nav with aria-current, reduced interior heroes |
| `scaffold_project` | A complete **Vite Node project** (not loose HTML): pages + package.json, vite.config.js, .gitignore, deploy workflow, config.js, README — `npm install`-ready |
| `quality_standards` | Anti-patterns, motion/copy rules, polish checklist, decision hierarchy |
| `generate_variations` | Preview seeded variations of a style: alternate hero + gallery + layout order + flourishes |
| `get_design_trends` | SOTA catalog (July 2026): trends with premium-use guidance + the full flourish library |
| `recommend_stack` | Modern library catalog + recipes: GSAP (fully free incl. SplitText), Lenis, Motion, OGL, PhotoSwipe, Astro… |

Plus an MCP prompt, `premium-website`, that runs the full workflow end to end.

## Install

```bash
cd multi-design-mcp
npm install
```

Register with Claude Code:

```bash
claude mcp add multi-design -s user -- node /Users/stevencarrillo/Desktop/PROJECTS/web-template/multi-design-mcp/src/index.js
```

Or add to any MCP client config:

```json
{
  "mcpServers": {
    "multi-design": {
      "command": "node",
      "args": ["/Users/stevencarrillo/Desktop/PROJECTS/web-template/multi-design-mcp/src/index.js"]
    }
  }
}
```

## Usage patterns

**One premium site** — "Build a website for my event venue Casa Vesperalta":
1. `recommend_style` → pick the direction
2. `plan_site` → sitemap + shared design system + per-page briefs
3. Execute each page's `buildPrompt` (optionally starting from `scaffold_page`)
4. Audit against `quality_standards` before shipping

**Mass page generation** — many landing pages, city pages, service pages:
call `plan_site` once with repeated page types and different `slug`/`notes`. Every generated brief shares the exact same token block and consistency rules, so 5 or 50 pages stay coherent.

**Design QA** — run `quality_standards` against any existing page as an audit contract.

## Test

```bash
npm test   # spins up the server over stdio and exercises every tool
```

## Notes

- Scaffolds are deliberately spare structural bases with real tokens — the premium finish (signature details, curated imagery, final copy, refined motion) is crafted by the model on top, guided by the build brief.
- Everything targets static hosting (GitHub Pages ready); the `react` stack option produces briefs for exportable React/Next instead.
- The server never invents business facts — briefs instruct the builder to mark unknowns `[TO CONFIRM]`.
- `examples/` contains generated scaffolds across styles and variation seeds you can open in a browser.
- All brand names in examples, tests, and docs (Casa Vesperalta, Vitrelora Glass Co., Miravalen Family Health, Quorvane Systems, Terraza Alborela, Taquería Solmarela, Alborvane Motorworks, Terravalen Properties, Forjaline Athletics, Lexovane Legal) are **coined fictional names** verified against the web for zero collision with real businesses. Any resemblance is coincidental — replace with the real client's name at build time.
