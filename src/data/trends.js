/**
 * State-of-the-art catalog (researched July 2026): what award-winning and
 * current-generation sites actually do, with premium-application guidance
 * and honest risk notes. Sources: Awwwards winners (Lando Norris by
 * OFF+BRAND — SOTY 2025; Messenger WebGL planet; Bruno Simon 2025),
 * 2026 trend retrospectives (Studio Meyer, Figma, Envato, Fireart).
 */

export const TRENDS = [
  {
    id: "kinetic-typography",
    name: "Kinetic Typography",
    whatItIs: "Type that moves — revealing, morphing, or responding to scroll and cursor. The headline becomes the visual hero instead of a static label.",
    whyNow: "One of the primary tools for brands that want personality without heavy imagery; everywhere on Awwwards.",
    premiumApplication: "Oversized display lines with masked reveals, a marquee line, outline/solid alternation, scroll-scrubbed weight or position shifts. Keep it to the hero and one or two moments.",
    risks: "Animated text fights screen readers, crawlers, and Core Web Vitals. ALWAYS keep a real, static, visually-hidden h1 for accessibility/SEO; animate presentational copies (aria-hidden); avoid layout shift by animating transform only."
  },
  {
    id: "bento-grids",
    name: "Bento Grids",
    whatItIs: "Modular card systems of varying cell sizes aligned to a clean grid (Apple-popularized).",
    whyNow: "Spread from keynotes to SaaS, portfolios, dashboards, landing pages — now at saturation.",
    premiumApplication: "Only with strong differentiation: mixed media cells (image, stat, kinetic type, live data), asymmetric spans, one oversized anchor cell. Cell contents must be genuinely different from each other.",
    risks: "The new three-card grid: a bento of equal generic cells reads as template. If every cell is a feature blurb with an icon, it's the anti-pattern wearing a trend."
  },
  {
    id: "anti-design",
    name: "Anti-Design / Neo-Brutalist Counter-Trend",
    whatItIs: "Deliberately broken layouts, raw HTML aesthetics, brutalist type, monospace-everything — reaction to bento sameness (The Browser Company, v0.dev, indie SaaS).",
    whyNow: "As polished patterns became ubiquitous, rawness started signaling confidence and craft.",
    premiumApplication: "Controlled rawness: exposed grids, visible borders, system/mono type, intentional collisions — but typeset with rigor. The 'broken' parts are precisely placed.",
    risks: "Without typographic discipline it just looks broken. Wrong for trust-critical sectors (health, finance) and most local businesses."
  },
  {
    id: "immersive-3d",
    name: "3D / WebGL Immersion",
    whatItIs: "Three.js-driven scenes, particle systems, shaders, 3D product objects. What was agency showpiece is now mainstream (SOTY winners: rotating 3D helmet, playable WebGL planet).",
    whyNow: "Tooling matured (Three.js, R3F, Rive, Spline); devices caught up.",
    premiumApplication: "One meaningful 3D accent — a product object, a spatial hero, a shader-distorted image — not a 3D theme park. Lazy-load; static poster fallback; keep the rest of the page fast and HTML-real.",
    risks: "Heavy payloads, battery drain, motion sickness. Must degrade gracefully (static render) and respect prefers-reduced-motion. Never gate content behind it."
  },
  {
    id: "scroll-storytelling",
    name: "Cinematic Scroll Storytelling",
    whatItIs: "Scroll as narrative device: pinned scenes, scrubbed sequences, chaptered progress. GSAP ScrollTrigger is the industry standard.",
    whyNow: "The defining pattern of recent award winners; scroll-driven CSS animations now also viable natively.",
    premiumApplication: "2–4 pinned 'scenes' max on a page, each advancing the story (the venue tour, the product assembly). Scrub must feel physically attached to scroll.",
    risks: "Scroll-jacking that fights the user is the fastest way to feel dated. Never alter scroll speed; pin, don't hijack."
  },
  {
    id: "tactile-texture",
    name: "Tactile Texture & Grain",
    whatItIs: "Film grain overlays, paper/noise textures, tone-on-tone materials, soft shaders — screens that feel touchable.",
    whyNow: "Reaction against flat AI-generated sameness; analog warmth signals human craft.",
    premiumApplication: "A 3–5% opacity grain layer, textured backgrounds behind editorial sections, material photography. Subtle — felt, not seen.",
    risks: "Heavy textures kill contrast and readability; animated grain costs GPU. Keep static or very slow."
  },
  {
    id: "custom-cursors",
    name: "Custom Cursors & Pointer Effects",
    whatItIs: "Cursor as instrument: labels ('Drag', 'View'), magnetic pulls, image trails, shader distortion on hover.",
    whyNow: "Award-winning portfolios use the cursor to reveal depth and reward exploration.",
    premiumApplication: "A small dot/label cursor that grows over interactive elements; magnetic buttons; an image-trail moment in one gallery. Desktop-only, layered on top of the native cursor semantics.",
    risks: "Must never hide or lag the real pointer, break text selection, or exist on touch. Progressive enhancement only."
  },
  {
    id: "broken-grids",
    name: "Broken Grids & Visual Personality",
    whatItIs: "Elements that overlap, rotate, and escape their columns — collage energy over template symmetry.",
    whyNow: "2026's answer to 'every site looks the same': layouts with a hand-made point of view.",
    premiumApplication: "A disciplined base grid with deliberate violations: one image crossing a section boundary, a headline overlapping a photo, captions in the margin.",
    risks: "Randomness ≠ personality. Every violation needs a compositional reason; test at all breakpoints."
  },
  {
    id: "view-transitions",
    name: "Seamless Page Transitions",
    whatItIs: "Element-level continuity between pages (View Transitions API / FLIP techniques) — the site feels like one continuous space.",
    whyNow: "Native browser support made what required heavy JS frameworks nearly free.",
    premiumApplication: "Persist the hero image or title from listing to detail page; quick fade-wipe elsewhere. Works with static multi-page sites.",
    risks: "Keep under 400ms; never block navigation on animation."
  },
  {
    id: "expressive-footers",
    name: "Oversized Expressive Footers",
    whatItIs: "The footer as a destination: massive wordmarks cropped by the viewport, giant contact CTAs, easter eggs.",
    whyNow: "The last viewport became prime brand real estate on award sites.",
    premiumApplication: "Full-width wordmark at 15–25vw clipped at the bottom edge, above clean utility columns. Free personality, zero UX cost.",
    risks: "Almost none — just keep the utility content usable."
  }
];

export function getTrends() {
  return TRENDS;
}
