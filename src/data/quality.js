/**
 * Quality standards distilled from the premium web methodology:
 * forbidden anti-patterns, motion rules, copy rules, the polish
 * checklist, and the decision hierarchy.
 */

export const ANTI_PATTERNS = [
  { id: "equal-card-grids", rule: "No generic three-equal-card grids. Offerings get differentiated, editorial treatment (alternating layouts, varied scale, real imagery).", severity: "critical" },
  { id: "icon-circles", rule: "No icons in colored circles. If iconography is needed, use bespoke line SVGs sized and placed deliberately.", severity: "critical" },
  { id: "cliche-gradients", rule: "No cliché gradients (purple-to-blue SaaS washes, rainbow meshes). Color comes from the defined palette only.", severity: "critical" },
  { id: "saas-template", rule: "Nothing may read as a 'startup SaaS template': no centered-hero + logo-strip + three-cards + testimonial-carousel assembly line.", severity: "critical" },
  { id: "generic-ai-copy", rule: "No generic AI copy: no 'Elevate your…', 'Unlock…', 'Seamless…', 'Look no further', 'Nestled in the heart of'. Every headline must be specific to this business.", severity: "critical" },
  { id: "gratuitous-glass", rule: "No gratuitous glassmorphism, neon glows, or effect-stacking that detracts from elegance.", severity: "high" },
  { id: "clone-sections", rule: "No clone-like sections: consecutive sections must differ in layout, rhythm, or scale. The page needs visual tempo changes.", severity: "high" },
  { id: "stock-cheese", rule: "No cheesy stock photography (handshakes, pointing-at-laptop, fake meetings). Real assets or no image.", severity: "high" },
  { id: "all-images", rule: "Never use every available image. Curate strictly: composition, lighting, resolution, atmosphere, and brand consistency decide.", severity: "high" },
  { id: "invented-proof", rule: "Never invent testimonials, ratings, client names, or statistics. Unsubstantiated proof sections are omitted, not faked.", severity: "critical" },
  { id: "animation-noise", rule: "No gratuitous animation: nothing animates without a narrative or feedback purpose. Motion serves rhythm, not spectacle.", severity: "high" },
  { id: "layout-monotony", rule: "No fully centered symmetric layouts throughout (unless the chosen style demands it, e.g. Art Deco). Use asymmetry and editorial tension.", severity: "medium" }
];

export const MOTION_RULES = [
  "Animate primarily transform and opacity; never animate layout properties (width/height/top/left).",
  "Respect prefers-reduced-motion: all non-essential motion collapses to simple fades or nothing.",
  "Use GSAP + ScrollTrigger when scroll narrative provides real value; plain CSS/IntersectionObserver for simple reveals.",
  "Every animation has intentional easing and duration from the style's motion spec — no library defaults.",
  "Sequence with stagger and overlap; simultaneous everything reads as cheap.",
  "Hover states are crafted (0.2–0.4s) and never rely on color alone.",
  "60fps or it doesn't ship: test on mid-range hardware, use will-change sparingly.",
  "Scroll-linked (scrub) animations must feel physically attached to scroll position, never laggy or 'floaty'."
];

export const COPY_RULES = [
  "Premium, confident, sophisticated; emotional without being cheesy; commercial without being pushy.",
  "Every headline must feel written for this exact business — the 'competitor swap test': if a competitor's name fits, rewrite.",
  "Specifics over adjectives: capacities, materials, years, names, numbers.",
  "Short sentences carry weight. Cut every word that doesn't earn its place.",
  "Address one reader ('you'), present tense where possible.",
  "No exclamation points. Confidence doesn't shout.",
  "FAQs use the customer's actual phrasing of questions.",
  "Do not state unverified critical facts (capacity, prices, ratings) — mark as [TO CONFIRM] instead."
];

export const POLISH_CHECKLIST = [
  { area: "Composition", checks: ["Consistent spacing scale applied (no arbitrary margins)", "Visual rhythm varies between sections (tempo changes)", "Typographic hierarchy holds at every breakpoint", "Line lengths 45–75ch for body text", "No orphan words in display headlines where avoidable"] },
  { area: "Responsiveness", checks: ["Flawless at 360, 768, 1024, 1440, 1920px", "Touch targets ≥ 44px", "Display type scales fluidly (clamp), never truncates", "Images art-directed per breakpoint where crops matter", "No horizontal scroll leaks"] },
  { area: "Contrast & Accessibility", checks: ["Text contrast ≥ 4.5:1 (3:1 for large display type)", "Focus states visible and styled to match the design", "Semantic HTML: single h1, landmark elements, alt text with meaning", "Keyboard navigable including menus and accordions", "prefers-reduced-motion fully honored"] },
  { area: "Motion", checks: ["All animations use the style's easing/duration spec", "No jank: transform/opacity only, tested at 60fps", "Reveals trigger at natural scroll positions (no popping late/early)", "No animation replays annoyingly on scroll-up unless intentional"] },
  { area: "Copy", checks: ["Competitor swap test passed on every headline", "No forbidden generic phrases anywhere", "Consistent voice across all pages", "All facts real or marked [TO CONFIRM]"] },
  { area: "Performance", checks: ["Images: modern formats (webp/avif), responsive srcset, lazy-loaded below fold", "Fonts: preconnect + display=swap, subsets only", "LCP < 2.5s on 4G mid-range device", "No layout shift (CLS < 0.1) — dimensions on all media", "Total JS kept minimal; GSAP loaded once, no unused plugins"] },
  { area: "Template-Trace Removal", checks: ["No default library styles visible (button resets, focus rings)", "No placeholder text or lorem ipsum anywhere", "Favicon, og-image, meta description all real", "404 or dead links checked", "No console errors"] }
];

export const MOBILE_RULES = [
  "Design mobile-first: for local businesses 60-75% of traffic is phones. The mobile experience IS the product; desktop is the enhancement.",
  "Navigation must WORK on mobile: a hamburger toggle with aria-expanded, full-screen or panel menu in the brand's design language, closes on link tap and Escape. Never hide nav links without a functioning menu.",
  "The open menu must keep a visible close control: the toggle stays fixed above the panel (higher z-index, solid background), relabels Menu → Close (localized: Menú → Cerrar), and focus moves to the first menu link on open and back to the toggle on close.",
  "Touch targets ≥ 44px; primary CTA reachable in the thumb zone (bottom half of viewport).",
  "Conversion sites (trades, clinics, venues taking bookings) get a sticky bottom action bar on mobile — Call + WhatsApp/Book — padded with env(safe-area-inset-bottom).",
  "Form inputs at 16px+ font size (prevents iOS auto-zoom on focus); labels always visible, never placeholder-only.",
  "Nothing depends on hover: every hover-revealed detail has a visible or tap equivalent. Pointer flourishes (custom cursor, magnetic buttons, image trails) load only behind matchMedia('(pointer: fine)').",
  "Use svh/dvh units for full-height heroes so mobile browser chrome doesn't cause jumps.",
  "Zero horizontal overflow at 360px. Test 360 / 390 / 430 / 768 widths explicitly; oversized kinetic type clips inside overflow-hidden containers, never the body.",
  "Galleries on touch: horizontal strips become native swipe with scroll-snap; hover zooms become tap-to-lightbox.",
  "Performance is mobile UX: heavy flourishes (WebGL, image trails, parallax stacks) are reduced or skipped on mobile; LCP budget holds on mid-range 4G hardware.",
  "Sticky/pinned scroll scenes must be re-tested on touch — if a pin fights momentum scrolling, replace it with a simple stacked layout on mobile."
];

export const PRIORITY_HIERARCHY = [
  "1. Premium perception",
  "2. Art direction",
  "3. Visual curation (photography/assets)",
  "4. Motion design",
  "5. Static-deploy compatibility (GitHub Pages / any static host)",
  "6. Zero or near-zero cost",
  "7. Performance",
  "8. Accessibility (still mandatory — this ranks effort, not whether it's done)"
];

export const ROLE_FRAME =
  "Act as a senior creative director, staff frontend engineer, motion designer for premium websites, and luxury digital experience architect. " +
  "The result must feel like it came from a top-tier agency — a $10,000+ project finish. It must NOT look like a generic AI landing page, a SaaS template, or merely 'correct'. " +
  "It must feel premium, refined, editorial, and deliberate. When torn between a simple solution and a more premium one, choose premium — unless it breaks static deployment, complicates maintenance, or seriously degrades performance.";

export const WORK_PHASES = [
  { phase: 1, name: "Research & Inputs", tasks: ["Audit provided assets (photos, links, business data)", "Extract value proposition, audiences, offerings, differentiators, tone, proof, FAQs, CTAs", "Never invent unconfirmed critical data"] },
  { phase: 2, name: "Creative Direction", tasks: ["Lock the design style and justify it", "Define concept + text moodboard", "Apply the design system tokens (type, color, spacing, motion, surfaces)"] },
  { phase: 3, name: "Visual Curation", tasks: ["Strictly select only images that elevate premium perception", "Assign image groups to sections with rationale", "Generate supporting SVG/pattern assets if secondary visuals are missing"] },
  { phase: 4, name: "Build", tasks: ["Implement with the blueprint's narrative structure", "Craft motion per the style's motion spec", "Write copy per the copy rules"] },
  { phase: 5, name: "Intensive Polish", tasks: ["Run the full polish checklist", "Remove every trace of template/generic-AI output", "Verify responsive, contrast, motion, and performance"] },
  { phase: 6, name: "Delivery", tasks: ["Static-host ready (GitHub Pages compatible paths, no server dependencies)", "README with publish instructions", "Notes for future upgrades"] }
];
