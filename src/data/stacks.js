/**
 * Modern library intelligence (verified July 2026): the curated npm/CDN
 * stack for premium static-first websites. Every entry answers: what is
 * it, when do you reach for it, and how do you keep it premium.
 *
 * Key landscape facts baked in:
 * - GSAP is 100% FREE since April 2025 (Webflow acquisition), INCLUDING
 *   formerly-paid plugins: SplitText (rewritten 2025: 50% smaller, native
 *   screen-reader accessibility, built-in masking), MorphSVG, DrawSVG,
 *   ScrambleText, ScrollSmoother.
 * - Lenis is the industry standard for momentum smooth scroll.
 * - Motion (motion.dev) ~8-12KB owns the React/lightweight end.
 * - anime.js v4 (2025 rewrite) is the modular vanilla alternative.
 */

export const LIBRARIES = [
  {
    id: "gsap",
    name: "GSAP + ScrollTrigger",
    npm: "gsap",
    cdn: "https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js + /dist/ScrollTrigger.min.js",
    size: "~70KB core+ScrollTrigger (gzipped ~27KB)",
    staticFriendly: true,
    what: "The animation platform behind most award-winning sites: timelines, scroll-driven scenes, pinning, scrubbing.",
    whenToUse: "Default motion engine for every premium static build. Scroll storytelling, reveals, pinned scenes.",
    premiumNotes: "100% free since April 2025 — including ALL formerly-paid plugins. Use SplitText for masked line reveals (2025 rewrite is screen-reader accessible with built-in masking — no more manual span-wrapping), ScrambleText for decode effects, DrawSVG for line-art draw-ins, MorphSVG for shape transitions. Stop hand-rolling these.",
    pairsWith: ["lenis"]
  },
  {
    id: "lenis",
    name: "Lenis",
    npm: "lenis",
    cdn: "https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js",
    size: "~4KB",
    staticFriendly: true,
    what: "Momentum smooth scrolling — the single biggest 'feels expensive' upgrade per KB. Industry standard.",
    whenToUse: "Every cinematic/editorial site. Skip only for utility-first sites (health, trades) where native scroll feel is more trustworthy.",
    premiumNotes: "Integrate with ScrollTrigger via gsap.ticker (lenis.raf) and lenis.on('scroll', ScrollTrigger.update). Disable under prefers-reduced-motion. Package is 'lenis' now — @studio-freight/lenis is deprecated.",
    pairsWith: ["gsap"]
  },
  {
    id: "motion",
    name: "Motion (motion.dev)",
    npm: "motion",
    size: "~8-12KB",
    staticFriendly: true,
    what: "Hardware-accelerated springs and gestures; the former Framer Motion, now framework-agnostic.",
    whenToUse: "React/Next builds, or vanilla sites where GSAP is overkill and you want spring physics on micro-interactions.",
    premiumNotes: "Choose ONE motion engine per site — Motion or GSAP, never both. GSAP wins for scroll narrative; Motion wins for component-level spring feel in React.",
    pairsWith: []
  },
  {
    id: "animejs",
    name: "anime.js v4",
    npm: "animejs",
    size: "modular, ~10KB typical",
    staticFriendly: true,
    what: "2025 modular rewrite: timeline, spring physics, SVG, stagger grids for vanilla JS.",
    whenToUse: "Lightweight alternative when a site needs a handful of micro-interactions and GSAP feels heavy.",
    premiumNotes: "The stagger-grid helpers make bento cell entrances trivial. Same rule: one engine per site.",
    pairsWith: []
  },
  {
    id: "three",
    name: "Three.js",
    npm: "three",
    size: "~150KB+ gzipped",
    staticFriendly: true,
    what: "Full WebGL 3D: scenes, shaders, particles. Behind most Awwwards SOTY winners.",
    whenToUse: "Only when the concept genuinely needs a 3D object/environment (product hero, spatial storytelling).",
    premiumNotes: "Lazy-load after first paint with a static poster fallback; budget the whole 3D moment ≤300KB. React: use React Three Fiber.",
    pairsWith: ["gsap"]
  },
  {
    id: "ogl",
    name: "OGL",
    npm: "ogl",
    size: "~30KB",
    staticFriendly: true,
    what: "Minimal WebGL library — shader-driven image distortion, hover displacement, gradient meshes at a fraction of Three's weight.",
    whenToUse: "The 'three-accent' flourish when all you need is one shader effect (image ripple, flowmap hover) — not a full scene graph.",
    premiumNotes: "The premium-restraint choice for WebGL: one effect, tiny payload.",
    pairsWith: ["gsap"]
  },
  {
    id: "photoswipe",
    name: "PhotoSwipe",
    npm: "photoswipe",
    size: "~20KB",
    staticFriendly: true,
    what: "The modern gallery lightbox: pinch-zoom, swipe, keyboard, deep-linking.",
    whenToUse: "Any gallery-heavy page (venues, trades proof-of-work, portfolios) where images deserve tap-to-expand.",
    premiumNotes: "Style the UI chrome to the design tokens — default skin screams plugin. Respect reduced motion on zoom transitions.",
    pairsWith: []
  },
  {
    id: "embla",
    name: "Embla Carousel",
    npm: "embla-carousel",
    size: "~7KB",
    staticFriendly: true,
    what: "Unopinionated, physics-feeling carousel engine with zero styling imposed.",
    whenToUse: "When a carousel is genuinely needed (testimonials, look-to-look). Lighter and less template-flavored than Swiper.",
    premiumNotes: "Swiper (~40KB) only if you need its full feature matrix (thumbs, parallax, virtual slides). Never autoplay without pause-on-hover.",
    pairsWith: []
  },
  {
    id: "barba",
    name: "Barba.js / View Transitions API",
    npm: "@barba/core",
    size: "~7KB (or 0 — VT API is native)",
    staticFriendly: true,
    what: "Seamless page-to-page transitions for multi-page static sites.",
    whenToUse: "Multi-page premium sites where continuity sells (portfolio → case study).",
    premiumNotes: "Reach for the NATIVE View Transitions API first (@view-transition CSS rule works for MPAs, zero JS); Barba only when you need scripted choreography. Keep under 400ms, never block navigation.",
    pairsWith: ["gsap"]
  },
  {
    id: "rive",
    name: "Rive / Lottie",
    npm: "@rive-app/canvas | lottie-web",
    size: "Rive runtime ~45KB; Lottie ~60KB",
    staticFriendly: true,
    what: "Designer-authored vector motion: animated logos, icons, interactive mascots. Rive powered the SOTY Lando Norris site's motion design.",
    whenToUse: "When brand motion assets exist or are worth commissioning (animated wordmark, icon states).",
    premiumNotes: "Rive for interactive/state-machine motion; Lottie for AfterEffects exports. Never for content that could be text.",
    pairsWith: []
  },
  {
    id: "alpine",
    name: "Alpine.js",
    npm: "alpinejs",
    size: "~15KB",
    staticFriendly: true,
    what: "Declarative sprinkle-interactivity (toggles, tabs, menus) without a framework or build step.",
    whenToUse: "Static sites needing stateful UI: language toggles (your EN/ES pattern), mobile menus, filterable galleries.",
    premiumNotes: "Cleaner than hand-rolled listeners once a page has 3+ interactive widgets; below that, vanilla JS.",
    pairsWith: []
  },
  {
    id: "astro",
    name: "Astro",
    npm: "astro",
    size: "0KB JS by default",
    staticFriendly: true,
    what: "The modern static-site framework: component authoring, content collections, zero JS unless opted in ('islands').",
    whenToUse: "THE upgrade path for batch page generation — 50 city landing pages from one layout + a data file, still deploying static to GitHub Pages. Replaces hand-copying nav/footer across pages.",
    premiumNotes: "Your plan_site consistency rules become literal shared components. View Transitions built in. Vite-based, so it matches your existing workflow.",
    pairsWith: ["gsap", "lenis"]
  },
  {
    id: "tailwind-shadcn",
    name: "Tailwind CSS v4 + shadcn/ui",
    npm: "tailwindcss | shadcn",
    size: "CSS only (purged)",
    staticFriendly: true,
    what: "Utility CSS engine + copy-in accessible React components (Radix-based).",
    whenToUse: "React/Next stack only. shadcn for app-like UI (dashboards, booking flows); marketing pages still deserve bespoke CSS.",
    premiumNotes: "Map the MCP design tokens to @theme CSS variables so utilities speak the brand's language. Restyle shadcn components — defaults are recognizable.",
    pairsWith: ["motion"]
  },
  {
    id: "fontsource",
    name: "Fontsource",
    npm: "@fontsource-variable/*",
    size: "fonts self-hosted",
    staticFriendly: true,
    what: "Self-hosted font packages — removes the Google Fonts request chain and GDPR wrinkle.",
    whenToUse: "Production builds with a bundler (Vite/Astro). Keep the Google Fonts CDN for quick scaffolds.",
    premiumNotes: "Prefer variable font packages (@fontsource-variable/fraunces) — one file, every weight, enables the variable-font-hover flourish.",
    pairsWith: []
  },
  {
    id: "css-scroll-animations",
    name: "Native CSS Scroll-Driven Animations",
    npm: "(none — platform feature)",
    size: "0KB",
    staticFriendly: true,
    what: "animation-timeline: view()/scroll() — reveals and progress bars with zero JavaScript.",
    whenToUse: "Simple reveals and scroll-progress on content pages; JS-free baseline everywhere.",
    premiumNotes: "Progressive enhancement: wrap in @supports (animation-timeline: view()) with the GSAP path as the full experience. Firefox support landed 2025.",
    pairsWith: []
  }
];

/**
 * Recipes: the proven pairings for common needs, with the static-form
 * reality of GitHub Pages (no backend) handled honestly.
 */
export const RECIPES = {
  "premium-motion-core": {
    need: "The default premium motion setup for a static site",
    recipe: "GSAP + ScrollTrigger + Lenis. Init Lenis, feed it to gsap.ticker (gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)), wire lenis.on('scroll', ScrollTrigger.update). Use SplitText (free) for masked line reveals. Gate everything behind a prefers-reduced-motion check."
  },
  "text-reveals": {
    need: "Award-grade headline reveals",
    recipe: "GSAP SplitText (free since 3.13, accessible by default, built-in masking: SplitText.create('.h1', { type: 'lines', mask: 'lines' })) → tween lines yPercent: 100 → 0 with stagger 0.08-0.12 and the style's easing. No manual span-wrapping, no SplitType needed anymore."
  },
  "page-transitions": {
    need: "Seamless navigation on a multi-page static site",
    recipe: "Native View Transitions API first: @view-transition { navigation: auto; } in CSS + view-transition-name on the persisting hero/title. Barba.js only if the choreography needs scripting. Astro ships this built-in."
  },
  "gallery-lightbox": {
    need: "Tap-to-expand galleries (venues, proof-of-work, portfolios)",
    recipe: "PhotoSwipe, restyled to design tokens (chrome colors, caption typography). Feed real width/height to avoid layout jumps; lazy-load offscreen slides."
  },
  "webgl-accent": {
    need: "One shader/3D moment without wrecking the performance budget",
    recipe: "OGL for a single effect (hover displacement, flowmap ripple, gradient mesh) at ~30KB. Full Three.js only for genuine 3D objects/scenes — lazy-loaded, poster fallback, ≤300KB total."
  },
  "static-forms": {
    need: "Quote/booking forms with no backend (GitHub Pages)",
    recipe: "Primary: WhatsApp deep link (https://wa.me/<number>?text=<prefilled from form fields>) — the highest-converting channel in WhatsApp-first markets (LatAm, US local services). Parallel: Formspree/Web3Forms POST endpoint for email capture. Always include tel: and mailto: as visible fallbacks."
  },
  "batch-page-generation": {
    need: "Dozens of coherent pages (city landings, service pages) without hand-copying",
    recipe: "Astro: one layout component holding nav/footer/tokens, a content collection (JSON/MD) of page data, getStaticPaths() to emit every page. plan_site briefs map 1:1 to collection entries. Still pure static output for GitHub Pages."
  },
  "scroll-sequence": {
    need: "Apple-AirPods-style product rotation/assembly driven by scroll",
    recipe: "Sticky section (parent 300vh, inner position:sticky 100svh) + <canvas> drawing pre-rendered frames indexed by scroll progress — no scroll hijacking, works with Lenis. Frames: ffmpeg -i product.mp4 -vf 'scale=1600:-2' -quality 80 frames/f_%04d.webp (60–120 frames, ≤4MB total), or turntable renders from Blender/Spline. Preload the first frame + nearest neighbors; draw with requestAnimationFrame throttling. prefers-reduced-motion: show one static frame. The scaffold ships this mechanic with a procedural placeholder so it demos before frames exist."
  },
  "micro-interactions": {
    need: "Hover states, magnetic buttons, cursor effects",
    recipe: "gsap.quickTo() for cursor-following/magnetic elements (one tween, updated per mousemove — never new tweens per event). Desktop-only via matchMedia('(pointer: fine)')."
  },
  "bilingual-toggle": {
    need: "EN/ES toggle on a static site",
    recipe: "Vanilla or Alpine.js: single I18N object, data-i18n attributes, localStorage persistence, <html lang> swap. Alpine earns its 15KB once the page also has menus/accordions/filters."
  }
};

export function getStack() {
  return { libraries: LIBRARIES, recipes: RECIPES };
}
