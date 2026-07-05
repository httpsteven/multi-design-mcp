/**
 * Variation engine: makes sure two sites built from the same style never
 * share the same bones. Each style declares which hero/gallery archetypes
 * it can legitimately wear and which signature flourishes suit it; a
 * deterministic seed picks one combination.
 */

import { COMPOSITIONS } from "./layouts.js";

/**
 * Signature flourishes — the interaction details that make award-level
 * sites feel authored. Each has implementation notes and honest cost.
 * `scaffolded: true` means scaffold_page physically implements it;
 * others are emitted as a precise build directive.
 */
export const FLOURISHES = {
  "grain-overlay": {
    name: "Film Grain Overlay",
    notes: "Fixed full-viewport SVG turbulence layer at 3–5% opacity, pointer-events none. Static (not animated) to stay free on the GPU. Makes flat color fields feel tactile.",
    cost: "negligible",
    lib: "Pure CSS (inline SVG feTurbulence data URI) — no library.",
    scaffolded: true
  },
  "marquee-ticker": {
    name: "Marquee Ticker Strip",
    notes: "A full-width strip of repeating brand statement/keywords scrolling horizontally (CSS keyframes on transform, duplicated track for seamless loop). Pauses under prefers-reduced-motion. Place between hero and first section, or as a section divider.",
    cost: "negligible",
    lib: "Pure CSS keyframes on transform — no library.",
    scaffolded: true
  },
  "scroll-progress": {
    name: "Scroll Progress Indicator",
    notes: "A 2px accent bar fixed at the viewport top whose width tracks scroll depth (vanilla onscroll + transform scaleX). Signals 'this page is a narrative'.",
    cost: "negligible",
    lib: "Native CSS scroll-driven animation (animation-timeline: scroll()) with a 5-line JS fallback — no library.",
    scaffolded: true
  },
  "split-text-mask": {
    name: "Masked Line Reveals",
    notes: "Headlines split into lines (SplitText or manual spans inside overflow:hidden wrappers) revealing with a translateY from 100% + generous stagger. The single highest-value premium motion detail. Real text stays in the DOM.",
    cost: "low",
    lib: "GSAP SplitText — FREE since 3.13 (Webflow acquisition): SplitText.create(el, { type: 'lines', mask: 'lines' }); accessible by default, no manual span-wrapping.",
    scaffolded: false
  },
  "custom-cursor": {
    name: "Custom Cursor",
    notes: "Small accent dot following the pointer (lerped), growing with a label ('View', 'Drag') over interactive elements. Desktop-only (pointer:fine media query), never hides the native cursor on form fields, no lag (rAF + lerp 0.15).",
    cost: "low",
    lib: "Vanilla + gsap.quickTo() for lag-free lerp — one tween updated per mousemove, never new tweens per event.",
    scaffolded: false
  },
  "magnetic-buttons": {
    name: "Magnetic Buttons",
    notes: "Primary CTAs translate up to ~8px toward the cursor within a proximity radius, spring back on leave (GSAP or lerp). Desktop-only. Apply ONLY to primary CTAs.",
    cost: "low",
    lib: "gsap.quickTo() on x/y with elastic.out return.",
    scaffolded: false
  },
  "image-trail": {
    name: "Cursor Image Trail",
    notes: "Moving the cursor across a designated section spawns a short trail of small brand images that fade out (~5 concurrent max, pooled elements). One section only — usually the gallery intro. Desktop-only.",
    cost: "medium",
    lib: "Vanilla pooled elements + gsap.quickTo(); ~40 lines, no dedicated library.",
    scaffolded: false
  },
  "text-scramble": {
    name: "Text Scramble/Decode",
    notes: "Metadata labels and nav items decode through glyphs on hover/reveal (custom scramble, ~400ms). Suits technical and noir aesthetics. Never on body copy.",
    cost: "low",
    lib: "GSAP ScrambleTextPlugin — now free; no hand-rolled scramblers.",
    scaffolded: false
  },
  "preloader-wordmark": {
    name: "Wordmark Preloader",
    notes: "A 0.8–1.2s entrance: brand wordmark on the background color, masked reveal, then a curtain lift into the hero (translateY, not display toggles). Runs once per session (sessionStorage). Must never gate an already-loaded page longer than the animation.",
    cost: "low",
    lib: "GSAP timeline + sessionStorage gate.",
    scaffolded: false
  },
  "parallax-layers": {
    name: "Depth Parallax Layers",
    notes: "Hero/band media moves at 0.85× scroll speed vs foreground (GSAP scrub on yPercent). Subtle — 10–15% displacement max. Disabled under reduced motion.",
    cost: "low",
    lib: "GSAP ScrollTrigger scrub on yPercent.",
    scaffolded: false
  },
  "view-transition-wipe": {
    name: "View Transition Wipes",
    notes: "Cross-page continuity via the View Transitions API (@view-transition in CSS for MPA): shared hero image/title morphs between listing and detail; 300ms fade-wipe elsewhere. Progressive enhancement — older browsers just navigate.",
    cost: "low",
    lib: "Native View Transitions API (@view-transition CSS, 0KB); @barba/core only for scripted choreography.",
    scaffolded: false
  },
  "sticky-scenes": {
    name: "Pinned Story Scenes",
    notes: "One or two full-viewport sections pinned while 2–3 content states advance with scroll (GSAP ScrollTrigger pin + scrub). Pin, never hijack: native scroll speed always preserved. The signature cinematic move — use for the experience/story section.",
    cost: "medium",
    lib: "GSAP ScrollTrigger pin + scrub — the standard behind award scroll narratives.",
    scaffolded: false
  },
  "three-accent": {
    name: "WebGL/3D Accent",
    notes: "ONE meaningful Three.js moment: a floating product/object in the hero or a shader-displaced image hover. Lazy-loaded after first paint, static poster fallback, prefers-reduced-motion honored, budget ≤300KB gzipped. Never a 3D theme park.",
    cost: "high",
    lib: "OGL (~30KB) for a single shader effect; full Three.js only for real 3D scenes, lazy-loaded with poster fallback.",
    scaffolded: false
  },
  "scrub-sequence": {
    name: "Scroll-Scrubbed Frame Sequence",
    notes: "The AirPods move: a pinned viewport where scrolling rotates/assembles the product frame by frame. Scaffolded with a procedural placeholder (canvas draws a rotating wireframe product driven by scroll progress) so the mechanic works before real frames exist; swap in pre-rendered frames via data-frames. Reserve for ONE section — the product/experience story.",
    cost: "medium",
    lib: "Canvas + sticky section + ~40 lines vanilla (no GSAP dependency). Real frames: ffmpeg -i product.mp4 -vf 'scale=1600:-2' frames/f_%04d.webp (60–120 frames), then set data-frames/data-frame-count on the canvas. 3D renders: export turntable frames from Blender/Spline.",
    scaffolded: true
  },
  "oversized-footer": {
    name: "Oversized Footer Wordmark",
    notes: "Brand wordmark at 15–25vw spanning the footer's full width, cropped by the viewport bottom edge. Utility columns stay clean above it. Free personality, zero UX cost.",
    cost: "negligible",
    lib: "Pure CSS — no library.",
    scaffolded: true
  },
  "variable-font-hover": {
    name: "Variable Font Weight Play",
    notes: "Nav links and index-list titles shift weight/width axis on hover (font-variation-settings transition ~250ms). Requires a variable font (Fraunces, Inter var). Quietly delightful.",
    cost: "negligible",
    lib: "Pure CSS font-variation-settings transition; requires a variable font (Fontsource variable packages or Google Fonts vf).",
    scaffolded: false
  }
};

/**
 * Per-style variation space. `heroes`/`galleries` list every archetype the
 * style can wear (first = default); `flourishes` is the compatible pool.
 * Alternates were chosen so every option still obeys the style's taste —
 * a care-trust clinic never gets a collage hero or text scramble.
 */
export const VARIATION_SPACE = {
  "editorial-luxury": {
    heroes: ["immersive", "split-media", "collage", "dolly-zoom"],
    galleries: ["editorial-asym", "horizontal-scroll", "stacked-cards"],
    flourishes: ["split-text-mask", "preloader-wordmark", "grain-overlay", "parallax-layers", "oversized-footer", "image-trail", "custom-cursor", "sticky-scenes", "scrub-sequence"]
  },
  "cinematic-noir": {
    heroes: ["immersive", "kinetic-type", "campaign", "dolly-zoom"],
    galleries: ["horizontal-scroll", "stacked-cards", "single-stack"],
    flourishes: ["sticky-scenes", "grain-overlay", "custom-cursor", "text-scramble", "preloader-wordmark", "scroll-progress", "three-accent", "split-text-mask", "scrub-sequence"]
  },
  "swiss-minimal": {
    heroes: ["typographic", "bento"],
    galleries: ["editorial-asym", "bento-grid"],
    flourishes: ["scroll-progress", "view-transition-wipe", "variable-font-hover", "oversized-footer"]
  },
  "brutalist-statement": {
    heroes: ["typographic", "kinetic-type", "collage"],
    galleries: ["masonry-columns", "bento-grid"],
    flourishes: ["marquee-ticker", "text-scramble", "custom-cursor", "magnetic-buttons", "grain-overlay", "oversized-footer"]
  },
  "organic-warm": {
    heroes: ["split-media", "collage", "immersive"],
    galleries: ["masonry-columns", "stacked-cards"],
    flourishes: ["grain-overlay", "parallax-layers", "split-text-mask", "image-trail", "oversized-footer"]
  },
  "art-deco-opulent": {
    heroes: ["framed-center", "immersive"],
    galleries: ["editorial-asym", "single-stack"],
    flourishes: ["preloader-wordmark", "split-text-mask", "parallax-layers", "oversized-footer", "grain-overlay"]
  },
  "tech-precision": {
    heroes: ["split-media", "bento", "typographic"],
    galleries: ["bento-grid", "editorial-asym"],
    flourishes: ["scroll-progress", "magnetic-buttons", "text-scramble", "view-transition-wipe", "three-accent", "variable-font-hover", "scrub-sequence"]
  },
  "gallery-white": {
    heroes: ["typographic", "immersive"],
    galleries: ["single-stack", "editorial-asym"],
    flourishes: ["view-transition-wipe", "split-text-mask", "oversized-footer"]
  },
  "retro-editorial": {
    heroes: ["split-media", "collage", "kinetic-type"],
    galleries: ["masonry-columns", "bento-grid"],
    flourishes: ["marquee-ticker", "image-trail", "grain-overlay", "variable-font-hover", "oversized-footer"]
  },
  "monochrome-fashion": {
    heroes: ["campaign", "kinetic-type", "immersive", "dolly-zoom"],
    galleries: ["horizontal-scroll", "single-stack"],
    flourishes: ["custom-cursor", "image-trail", "split-text-mask", "view-transition-wipe", "oversized-footer", "preloader-wordmark", "scrub-sequence"]
  },
  "craftsman-trust": {
    heroes: ["split-form", "split-media"],
    galleries: ["editorial-asym", "bento-grid"],
    flourishes: ["scroll-progress", "magnetic-buttons", "grain-overlay"]
  },
  "care-trust": {
    heroes: ["split-media", "bento"],
    galleries: ["editorial-asym", "bento-grid"],
    flourishes: ["scroll-progress", "magnetic-buttons", "view-transition-wipe"]
  },
  "ivory-elegance": {
    heroes: ["immersive", "split-media", "collage", "dolly-zoom"],
    galleries: ["editorial-asym", "stacked-cards"],
    flourishes: ["preloader-wordmark", "split-text-mask", "parallax-layers", "grain-overlay", "oversized-footer"]
  },
  "appetite-bold": {
    heroes: ["split-media", "immersive", "collage"],
    galleries: ["masonry-columns", "editorial-asym", "horizontal-scroll"],
    flourishes: ["marquee-ticker", "grain-overlay", "image-trail", "magnetic-buttons", "oversized-footer", "scroll-progress"]
  },
  "estate-serif": {
    heroes: ["immersive", "split-media", "bento", "dolly-zoom"],
    galleries: ["editorial-asym", "bento-grid", "stacked-cards"],
    flourishes: ["parallax-layers", "scroll-progress", "split-text-mask", "view-transition-wipe", "oversized-footer", "magnetic-buttons"]
  },
  "iron-grit": {
    heroes: ["immersive", "typographic", "kinetic-type"],
    galleries: ["masonry-columns", "horizontal-scroll", "bento-grid"],
    flourishes: ["marquee-ticker", "grain-overlay", "text-scramble", "scroll-progress", "magnetic-buttons", "oversized-footer", "scrub-sequence"]
  },
  "counsel-classic": {
    heroes: ["split-media", "typographic", "immersive"],
    galleries: ["editorial-asym", "bento-grid"],
    flourishes: ["scroll-progress", "view-transition-wipe", "variable-font-hover"]
  },
  "showroom-drive": {
    heroes: ["immersive", "campaign", "split-media", "dolly-zoom"],
    galleries: ["horizontal-scroll", "bento-grid", "editorial-asym"],
    flourishes: ["scroll-progress", "custom-cursor", "marquee-ticker", "magnetic-buttons", "grain-overlay", "three-accent", "scrub-sequence"]
  }
};

/* Deterministic PRNG (mulberry32) so a seed always yields the same variation. */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN(rng, arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  return out;
}

function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a deterministic variation for a style. Seed 0 (or omitted) means
 * "the style's default composition, no flourishes forced".
 */
export function buildVariation(styleId, seed) {
  const space = VARIATION_SPACE[styleId];
  const base = COMPOSITIONS[styleId];
  if (!space || !base) throw new Error(`No variation space for style "${styleId}".`);
  if (!seed || seed <= 0) {
    return {
      seed: 0,
      styleId,
      hero: base.hero.variant,
      gallery: base.gallery.variant,
      contentRotation: base.contentRotation,
      flourishes: [],
      isDefault: true
    };
  }
  const rng = mulberry32(seed * 2654435761);
  const hero = pick(rng, space.heroes);
  const gallery = pick(rng, space.galleries);
  const contentRotation = shuffle(rng, base.contentRotation);
  const flourishCount = 2 + Math.floor(rng() * 2); // 2–3
  const flourishIds = pickN(rng, space.flourishes, flourishCount);
  return {
    seed,
    styleId,
    hero,
    gallery,
    contentRotation,
    flourishes: flourishIds.map((id) => ({ id, ...FLOURISHES[id] })),
    isDefault: false
  };
}
