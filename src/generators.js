import { getStyle } from "./data/styles.js";
import { getBlueprint } from "./data/blueprints.js";
import { getComposition, describeComposition, HERO_VARIANTS, GALLERY_VARIANTS, CONTENT_LAYOUTS } from "./data/layouts.js";
import { buildVariation } from "./data/variations.js";
import { RECIPES } from "./data/stacks.js";
import {
  ANTI_PATTERNS,
  MOTION_RULES,
  COPY_RULES,
  MOBILE_RULES,
  POLISH_CHECKLIST,
  PRIORITY_HIERARCHY,
  ROLE_FRAME,
  WORK_PHASES
} from "./data/quality.js";

/* ---------------------------------- helpers ---------------------------------- */

function fontImportUrl(style) {
  const fams = [];
  const t = style.typography;
  for (const key of ["display", "body", "mono"]) {
    const f = t[key];
    if (!f) continue;
    const fam = f.family.replace(/ /g, "+");
    const weights = (f.weights || [400]).join(";");
    fams.push(`family=${fam}:wght@${weights}`);
  }
  return `https://fonts.googleapis.com/css2?${[...new Set(fams)].join("&")}&display=swap`;
}

const SPACING_SCALE = {
  "space-2xs": "0.25rem",
  "space-xs": "0.5rem",
  "space-sm": "1rem",
  "space-md": "2rem",
  "space-lg": "4rem",
  "space-xl": "8rem",
  "space-section": "clamp(6rem, 12vw, 11rem)",
  "gutter": "clamp(1.25rem, 4vw, 4rem)",
  "measure": "65ch"
};

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "site";
}

/* Scrim gradient matched to the palette background so overridden immersive
   heroes stay legible on both dark and light styles. */
function scrimFromBg(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  const [r, g, b] = m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : [0, 0, 0];
  return `linear-gradient(to top, rgba(${r},${g},${b},0.94) 0%, rgba(${r},${g},${b},0.4) 42%, transparent 72%)`;
}

/* Apply a variation to a style's base composition. */
function effectiveComposition(styleId, style, variation) {
  const base = getComposition(styleId);
  if (!variation || variation.isDefault) return base;
  const comp = JSON.parse(JSON.stringify(base));
  if (variation.hero !== base.hero.variant) {
    comp.hero = {
      variant: variation.hero,
      scrim: scrimFromBg(style.palette.background),
      heroPanel: base.hero.heroPanel,
      contentPosition: "bottom-left",
      notes: `${HERO_VARIANTS[variation.hero].name} (variation seed ${variation.seed}). ${HERO_VARIANTS[variation.hero].description}`
    };
  }
  if (variation.gallery !== base.gallery.variant) {
    comp.gallery = {
      variant: variation.gallery,
      notes: `${GALLERY_VARIANTS[variation.gallery].name} (variation seed ${variation.seed}). ${GALLERY_VARIANTS[variation.gallery].description}`
    };
  }
  comp.contentRotation = variation.contentRotation;
  return comp;
}

function variationDirective(variation) {
  if (!variation || variation.isDefault) return "";
  return `
## Variation Directive (seed ${variation.seed})
Same style, different bones. Sibling sites share this style — these overrides are MANDATORY so no two builds repeat a composition:

- **Hero architecture (override):** ${HERO_VARIANTS[variation.hero].name} — ${HERO_VARIANTS[variation.hero].description}
- **Gallery pattern (override):** ${GALLERY_VARIANTS[variation.gallery].name} — ${GALLERY_VARIANTS[variation.gallery].description}
- **Content layout rotation (override order):** ${variation.contentRotation.map((id) => CONTENT_LAYOUTS[id].name).join(" → ")}
- **Signature flourishes (implement every one):**
${variation.flourishes.map((f, i) => `  ${i + 1}. **${f.name}** (${f.cost} cost) — ${f.notes}`).join("\n")}
`;
}

/* Modern stack section for briefs: core motion recipe + libraries demanded
   by the chosen flourishes + contextual recipes (galleries, forms, react). */
const NATIVE_SCROLL_STYLES = new Set(["craftsman-trust", "care-trust", "counsel-classic", "appetite-bold"]);

function stackSection({ styleId, blueprint, variation, stack }) {
  const lines = [`- **Core motion:** ${RECIPES["premium-motion-core"].recipe}`];
  if (NATIVE_SCROLL_STYLES.has(styleId)) {
    lines.push("- **Lenis exception:** skip smooth scroll for this style — native scroll feel reads more trustworthy for local-trust sectors. Keep GSAP for reveals.");
  }
  lines.push(`- **Text reveals:** ${RECIPES["text-reveals"].recipe}`);
  for (const f of variation?.flourishes || []) {
    if (f.lib && !f.lib.startsWith("Pure CSS")) lines.push(`- **${f.name}:** ${f.lib}`);
  }
  const sectionIds = new Set(blueprint.sections.map((s) => s.id));
  if (["gallery", "proof-work", "collections", "feature"].some((id) => sectionIds.has(id))) {
    lines.push(`- **Lightbox:** ${RECIPES["gallery-lightbox"].recipe}`);
  }
  if (["form", "capture"].some((id) => sectionIds.has(id)) || blueprint.name.includes("Lead-Gen")) {
    lines.push(`- **Forms without a backend:** ${RECIPES["static-forms"].recipe}`);
  }
  if (stack === "react") {
    lines.push("- **React stack:** Motion (motion.dev) for component springs; Tailwind v4 with tokens mapped to @theme variables; shadcn/ui only for app-like UI, restyled to the brand.");
  }
  lines.push("- **Page transitions (multi-page):** " + RECIPES["page-transitions"].recipe);
  return `
## Modern Stack (verified 2026 — use these instead of hand-rolling)
GSAP is 100% free since April 2025, INCLUDING formerly-paid plugins (SplitText, ScrambleText, DrawSVG, MorphSVG). Do not hand-roll what these solve.

${lines.join("\n")}

One motion engine per site. Every library gated behind prefers-reduced-motion where it moves things.
`;
}

/* ------------------------------- design system -------------------------------- */

export function composeDesignSystem({ styleId, brand = {} }) {
  const style = getStyle(styleId);
  if (!style) throw new Error(`Unknown style "${styleId}". Use list_design_styles to see available styles.`);

  const p = { ...style.palette };
  if (brand.accentColor) p.accent = brand.accentColor;

  const cssVars = [
    ":root {",
    `  /* ${style.name} — generated design tokens */`,
    `  --color-bg: ${p.background};`,
    `  --color-surface: ${p.surface};`,
    `  --color-text: ${p.text};`,
    `  --color-text-muted: ${p.textMuted};`,
    `  --color-accent: ${p.accent};`,
    `  --color-line: ${p.line};`,
    `  --font-display: '${style.typography.display.family}', ${style.typography.display.fallback};`,
    `  --font-body: '${style.typography.body.family}', ${style.typography.body.fallback};`,
    ...(style.typography.mono ? [`  --font-mono: '${style.typography.mono.family}', ${style.typography.mono.fallback};`] : []),
    `  --size-hero: ${style.typography.scale.hero};`,
    `  --size-h2: ${style.typography.scale.h2};`,
    `  --size-body: ${style.typography.scale.body};`,
    `  --size-small: ${style.typography.scale.small};`,
    `  --ease-brand: ${style.motion.easing};`,
    ...Object.entries(SPACING_SCALE).map(([k, v]) => `  --${k}: ${v};`),
    "}"
  ].join("\n");

  return {
    style: { id: style.id, name: style.name, summary: style.summary },
    brand,
    tokens: {
      palette: p,
      typography: style.typography,
      spacing: SPACING_SCALE,
      motion: style.motion
    },
    cssVariables: cssVars,
    fontImport: fontImportUrl(style),
    imagery: style.imagery,
    signatureDetails: style.signatureDetails,
    avoid: style.avoid,
    paletteNotes: p.notes,
    composition: getComposition(styleId)
  };
}

/* --------------------------------- language ----------------------------------- */

export function languageSpec(business = {}) {
  const raw = (business.language || "en").toLowerCase().trim();
  const codes = raw.match(/[a-z]{2}(?:-[a-z]{2})?/g) || ["en"];
  const bilingual = codes.length > 1 || raw.includes("biling");
  const primary = codes[0];
  const NAMES = { en: "English", es: "Spanish", fr: "French", pt: "Portuguese", de: "German", it: "Italian" };
  const nameOf = (c) => NAMES[c.slice(0, 2)] || c;
  let instruction;
  if (bilingual) {
    const list = codes.map(nameOf).join(" / ");
    instruction =
      `The site is BILINGUAL (${list}). Implement a language toggle: keep every string for all languages in a single I18N object ` +
      `(e.g. const I18N = { ${codes.map((c) => `${c.slice(0, 2)}: {...}`).join(", ")} }) with data-i18n attributes on elements, ` +
      `persist the choice (localStorage), and set <html lang> dynamically. Write BOTH languages with equal copywriting care — ` +
      `the secondary language must never read as a machine translation. All copy rules apply to every language.`;
  } else if (primary.slice(0, 2) !== "en") {
    instruction =
      `Write ALL copy in ${nameOf(primary)} (html lang="${primary}"). Apply every copy rule in that language — ` +
      `premium, specific, competitor-swap-proof. Do not mix English into headings, buttons, or form labels.`;
  } else {
    instruction = `All copy in English (html lang="en").`;
  }
  return { primary, codes, bilingual, instruction };
}

/* ------------------------------- build prompt --------------------------------- */

function brandBlock(business = {}) {
  const lines = [];
  if (business.name) lines.push(`- Business name: ${business.name}`);
  if (business.language) lines.push(`- Language: ${business.language}`);
  if (business.industry) lines.push(`- Industry: ${business.industry}`);
  if (business.description) lines.push(`- Description: ${business.description}`);
  if (business.audience) lines.push(`- Target audience: ${business.audience}`);
  if (business.valueProposition) lines.push(`- Value proposition: ${business.valueProposition}`);
  if (business.differentiators) lines.push(`- Differentiators: ${[].concat(business.differentiators).join("; ")}`);
  if (business.tone) lines.push(`- Desired tone: ${business.tone}`);
  if (business.assets) lines.push(`- Available assets: ${business.assets}`);
  if (business.links) lines.push(`- Reference links: ${[].concat(business.links).join(", ")}`);
  if (business.notes) lines.push(`- Additional notes: ${business.notes}`);
  return lines.length ? lines.join("\n") : "- (No business details provided — request them or mark unknowns as [TO CONFIRM]. Do not invent critical facts.)";
}

export function composeBuildPrompt({ styleId, pageType = "home", business = {}, stack = "static", variationSeed = 0 }) {
  const style = getStyle(styleId);
  if (!style) throw new Error(`Unknown style "${styleId}".`);
  const blueprint = getBlueprint(pageType);
  if (!blueprint) throw new Error(`Unknown pageType "${pageType}". Use list_page_blueprints.`);
  const variation = buildVariation(styleId, variationSeed);

  const ds = composeDesignSystem({ styleId, brand: business });

  const sections = blueprint.sections
    .map((s, i) => `${i + 1}. **${s.name}** — ${s.purpose}\n   Copy guidance: ${s.copy}`)
    .join("\n");

  const stackNote =
    stack === "react"
      ? "Stack: exportable React/Next.js (static export compatible) + GSAP/Motion where it genuinely helps. Follow React best practices; do not add SSR-dependent features."
      : "Stack: premium static HTML/CSS/JS + GSAP + ScrollTrigger. No build step required; deployable to GitHub Pages or any static host as-is.";

  const lang = languageSpec(business);

  return `# Build Brief — ${blueprint.name} · ${style.name}

${ROLE_FRAME}

${stackNote}

## Business Context
${brandBlock(business)}

## Language
${lang.instruction}

## Art Direction: ${style.name}
${style.summary}

- Imagery direction: ${style.imagery}
- Signature details to include: ${style.signatureDetails.join("; ")}
- Style-specific prohibitions: ${style.avoid.join("; ")}
- Palette logic: ${ds.paletteNotes}

## Layout & Composition (mandatory structure)
This defines what the page physically IS — hero architecture, image placement, section layouts. Deviate only for a demonstrably superior composition, never to simplify.

${describeComposition(styleId)}
${variationDirective(variation)}
## Design Tokens (use exactly these)
\`\`\`css
${ds.cssVariables}
\`\`\`
Font import: ${ds.fontImport}

## Page Structure (narrative: ${blueprint.narrative})
${sections}

Map each section to a layout from the composition spec above: gallery-type sections use the gallery pattern; storytelling sections may use the sticky/band layouts; list-like content uses the index list; rotate the content layouts so no two adjacent sections share a layout. You may improve this structure only if you find a superior narrative — never to save effort.

## Motion Specification
Character: ${style.motion.character}
Easing: ${style.motion.easing} · Durations: ${style.motion.duration}
Signature moves: ${style.motion.signature.join("; ")}

Rules:
${MOTION_RULES.map((r) => `- ${r}`).join("\n")}
${stackSection({ styleId, blueprint, variation, stack })}
## Mobile Mandate (non-negotiable)
Every design ships mobile-usable, not just mobile-shrunk:
${MOBILE_RULES.map((r) => `- ${r}`).join("\n")}

## Copywriting Rules
${COPY_RULES.map((r) => `- ${r}`).join("\n")}

## Forbidden Anti-Patterns (hard constraints)
${ANTI_PATTERNS.map((a) => `- [${a.severity}] ${a.rule}`).join("\n")}

## Decision Hierarchy
${PRIORITY_HIERARCHY.join("\n")}

## Work Phases
${WORK_PHASES.map((w) => `**Phase ${w.phase} — ${w.name}:** ${w.tasks.join("; ")}`).join("\n")}

## Definition of Done
Run the polish checklist before declaring the page finished:
${POLISH_CHECKLIST.map((c) => `- **${c.area}:** ${c.checks.join("; ")}`).join("\n")}
`;
}

/* --------------------------------- site plan ---------------------------------- */

export function composeSitePlan({ styleId, business = {}, pages, stack = "static", variationSeed = 0 }) {
  const style = getStyle(styleId);
  if (!style) throw new Error(`Unknown style "${styleId}".`);
  if (!Array.isArray(pages) || pages.length === 0) throw new Error("Provide at least one page: [{ pageType, title?, slug?, notes? }]");

  const ds = composeDesignSystem({ styleId, brand: business });

  const planned = pages.map((pg, i) => {
    const bp = getBlueprint(pg.pageType);
    if (!bp) throw new Error(`Unknown pageType "${pg.pageType}" at index ${i}.`);
    const slug = pg.slug || (pg.pageType === "home" ? "index" : pg.pageType);
    return {
      order: i + 1,
      pageType: pg.pageType,
      title: pg.title || bp.name,
      file: `${slug}.html`,
      narrative: bp.narrative,
      sections: bp.sections.map((s) => s.name),
      notes: pg.notes || null,
      buildPrompt: composeBuildPrompt({ styleId, pageType: pg.pageType, business: { ...business, notes: [business.notes, pg.notes].filter(Boolean).join(" | ") || undefined }, stack, variationSeed })
    };
  });

  const siteVariation = buildVariation(styleId, variationSeed);

  return {
    site: {
      style: ds.style,
      business: business.name || "(unnamed)",
      stack,
      pageCount: planned.length,
      variationSeed,
      variation: siteVariation.isDefault
        ? "default composition"
        : `hero=${siteVariation.hero}, gallery=${siteVariation.gallery}, flourishes=[${siteVariation.flourishes.map((f) => f.id).join(", ")}] — applied site-wide for consistency`
    },
    sharedDesignSystem: ds,
    consistencyRules: [
      "All pages import the identical token block (cssVariables) — no per-page palette drift.",
      "Navigation and footer are byte-identical across pages (extract to a shared partial or copy exactly).",
      "The nav marks the current page (aria-current='page').",
      "Heading scale, spacing scale, and motion easings never vary between pages.",
      "The composition spec (hero variant, gallery pattern, layout rotation) applies to every page — only the home page uses the full-height hero; interior pages use a reduced-height version of the same hero architecture.",
      "Each page gets a unique, specific <title> and meta description in the brand voice.",
      "Image treatment (grading, crops, masks) follows the style's imagery direction on every page.",
      "Internal links use relative paths so the site works on GitHub Pages project URLs."
    ],
    buildOrder: "Build home first to lock the design language; every subsequent page inherits its nav, footer, and refined token usage.",
    stackAdvice: {
      core: RECIPES["premium-motion-core"].recipe,
      batchGeneration: pages.length >= 5 ? RECIPES["batch-page-generation"].recipe : null,
      pageTransitions: RECIPES["page-transitions"].recipe
    },
    pages: planned
  };
}

/* -------------------------------- html scaffold -------------------------------- */

const GALLERY_IDS = new Set(["gallery", "proof-work", "collections", "feature", "context", "location-blocks", "directory"]);
const FAQ_IDS = new Set(["faq", "groups"]);
const CTA_IDS = new Set(["cta", "join", "next", "order"]);
const FORM_IDS = new Set(["form", "capture"]);

export function scaffoldPage({ styleId, pageType = "home", business = {}, includeGsap = true, variationSeed = 0, siteNav = null, slug = null }) {
  const style = getStyle(styleId);
  if (!style) throw new Error(`Unknown style "${styleId}".`);
  const blueprint = getBlueprint(pageType);
  if (!blueprint) throw new Error(`Unknown pageType "${pageType}".`);
  const variation = buildVariation(styleId, variationSeed);
  const comp = effectiveComposition(styleId, style, variation);
  const flourishIds = new Set(variation.flourishes.map((f) => f.id));
  const useLenis = includeGsap && !NATIVE_SCROLL_STYLES.has(styleId);

  const ds = composeDesignSystem({ styleId, brand: business });
  const lang = languageSpec(business);
  const name = business.name || "Brand Name";
  const desc = business.description || `${blueprint.name} page for ${name}.`;
  const seedBase = slugify(name);
  let seedN = 0;

  const media = (label, w, h, cls = "") =>
    `<figure class="media${cls ? " " + cls : ""}"><!-- REEMPLAZAR: ${label} -->
        <img src="https://picsum.photos/seed/${seedBase}-${++seedN}/${w}/${h}" alt="[describe: ${label}]" loading="lazy" width="${w}" height="${h}" />
      </figure>`;

  const headBlock = (s, tag = "h2") => `<p class="eyebrow" data-reveal>[${s.name} label]</p>
        <${tag} data-reveal>[${s.name} headline — specific to ${name}]</${tag}>`;

  /* ------- hero ------- */
  const heroContent = `<p class="eyebrow" data-reveal>${(business.industry || "eyebrow label").toUpperCase()}</p>
        <!-- Headline rules: under 10 words, competitor-swap-proof, written only for ${name} -->
        <h1 class="hero-title" data-reveal>[Headline for ${name}]</h1>
        <p class="hero-sub" data-reveal>[One supporting line. Optional.]</p>
        <a class="cta" href="#cta" data-reveal>[Primary action]</a>`;

  function heroHtml() {
    const v = comp.hero.variant;
    if (v === "immersive" || v === "framed-center") {
      const inner =
        v === "framed-center"
          ? `<div class="hero-frame"><div class="hero-content hero-content--center" data-reveal-group>
        <span class="ornament" aria-hidden="true">◆</span>
        ${heroContent}
      </div></div>`
          : `<div class="hero-content hero-content--${comp.hero.contentPosition || "bottom-left"}" data-reveal-group>
        ${heroContent}
      </div>`;
      return `    <!-- Hero (${v}): ${comp.hero.notes} -->
    <header class="hero hero--${v}" id="top">
      ${media("hero — the single strongest image/video frame", 1600, 1000, "hero-media")}
      <div class="hero-scrim" aria-hidden="true"></div>
      ${inner}
      <span class="scroll-cue" aria-hidden="true">&darr;</span>
    </header>`;
    }
    if (v === "split-form") {
      return `    <!-- Hero (split-form): ${comp.hero.notes} -->
    <header class="hero hero--split-form" id="top">
      <div class="hero-panel" data-reveal-group>
        ${heroContent}
        <p class="proof-strip" data-reveal>[years in business] · [licensed &amp; insured] · [rating ★] <em>[TO CONFIRM]</em></p>
      </div>
      <div class="hero-form">
        <form action="#" method="post"><!-- REEMPLAZAR: wire to backend/WhatsApp/email -->
          <h2 class="form-title">[Request a quote]</h2>
          <label>[Name]<input type="text" name="name" required /></label>
          <label>[Phone]<input type="tel" name="phone" required /></label>
          <label>[Service]<select name="service"><option>[Service A]</option><option>[Service B]</option></select></label>
          <label>[Message]<textarea name="message" rows="3"></textarea></label>
          <button class="cta" type="submit">[Get my free quote]</button>
        </form>
      </div>
    </header>
    ${media("full-width signature project photo directly after hero", 1600, 900, "media--full")}`;
    }
    if (v === "split-media") {
      const mask = comp.hero.mediaMask === "arch" ? "media--arch" : "";
      return `    <!-- Hero (split-media): ${comp.hero.notes} -->
    <header class="hero hero--split-media" id="top">
      <div class="hero-copy" data-reveal-group>
        ${heroContent}
        <p class="trust-markers" data-reveal>[trust marker] · [trust marker] · [trust marker]</p>
      </div>
      ${media("hero image — 4:5, treated per style", 800, 1000, mask)}
    </header>`;
    }
    if (v === "campaign") {
      return `    <!-- Hero (campaign): ${comp.hero.notes} -->
    <header class="hero hero--campaign" id="top">
      <div class="hero-copy" data-reveal-group>
        <h1 class="hero-title" data-reveal>[HEADLINE OVERLAPPING THE IMAGE]</h1>
        <p class="hero-sub" data-reveal>[One line. Attitude.]</p>
        <a class="cta" href="#cta" data-reveal>[Action]</a>
      </div>
      ${media("full-height campaign portrait", 800, 1200, "hero-media")}
      <span class="vertical-label" aria-hidden="true">[SEASON / EDITION LABEL]</span>
    </header>`;
    }
    if (v === "kinetic-type") {
      return `    <!-- Hero (kinetic-type): ${comp.hero.notes}
         Accessibility rule: the moving lines are presentational (aria-hidden); the real h1 stays static and visually hidden. -->
    <header class="hero hero--kinetic-type" id="top">
      <h1 class="visually-hidden">[Real headline for ${name} — static, for screen readers and SEO]</h1>
      <div class="kinetic-stack" aria-hidden="true">
        <span class="k-line k-solid" data-reveal>[BRAND STATEMENT]</span>
        <span class="k-line k-outline" data-reveal>[BRAND STATEMENT]</span>
        <div class="k-marquee"><span class="k-track">[STATEMENT] — [STATEMENT] — [STATEMENT] — [STATEMENT] — [STATEMENT] — [STATEMENT] — </span></div>
        <span class="k-line k-solid" data-reveal>[BRAND STATEMENT]</span>
      </div>
      <div class="hero-meta" data-reveal>
        <span>[location]</span><span>[discipline]</span><span>[est. year]</span>
      </div>
    </header>`;
    }
    if (v === "bento") {
      return `    <!-- Hero (bento): ${comp.hero.notes}
         Bento rule: cells must be genuinely different — never equal feature blurbs. -->
    <header class="hero hero--bento" id="top">
      <div class="bento">
        <div class="bento-cell bento-anchor" data-reveal-group>
        ${heroContent}
        </div>
        ${media("tall image cell — 3:4", 600, 800, "bento-cell b-tall")}
        ${media("wide image cell", 900, 500, "bento-cell b-wide")}
        <div class="bento-cell b-stat" data-reveal>
          <span class="stat-num">[No.]</span>
          <span class="stat-label">[real proof stat — mark [TO CONFIRM] if unverified]</span>
        </div>
        ${media("detail crop cell — 1:1", 600, 600, "bento-cell b-small")}
      </div>
    </header>`;
    }
    if (v === "collage") {
      return `    <!-- Hero (collage): ${comp.hero.notes}
         Broken-grid rule: every overlap is deliberate; test all breakpoints. -->
    <header class="hero hero--collage" id="top">
      <div class="collage">
        ${media("primary collage image — largest", 900, 1100, "c-img c-1")}
        ${media("secondary overlapping image", 700, 500, "c-img c-2")}
        ${media("small accent image — crosses the stack", 500, 600, "c-img c-3")}
      </div>
      <div class="hero-content hero-content--collage" data-reveal-group>
        ${heroContent}
      </div>
      <p class="margin-caption" data-reveal>[caption escaping into the margin]</p>
    </header>`;
    }
    /* typographic */
    return `    <!-- Hero (typographic): ${comp.hero.notes} -->
    <header class="hero hero--typographic" id="top">
      <h1 class="hero-title" data-reveal>[Display headline that owns the viewport — for ${name}]</h1>
      <div class="hero-meta" data-reveal>
        <span>[location]</span><span>[discipline]</span><span>[est. year]</span>
      </div>
    </header>`;
  }

  /* ------- galleries ------- */
  function galleryHtml(s) {
    const v = comp.gallery.variant;
    if (v === "horizontal-scroll") {
      return `<div class="hscroll" data-reveal>
        ${media("scene 01", 1080, 720)}
        ${media("scene 02", 540, 720)}
        ${media("scene 03", 1080, 720)}
        ${media("scene 04", 540, 720)}
        <span class="hscroll-index">01 / 04</span>
      </div>`;
    }
    if (v === "single-stack") {
      return `<div class="single-stack">
        <figure class="media work" data-reveal><!-- REEMPLAZAR: work 01 -->
          <img src="https://picsum.photos/seed/${seedBase}-${++seedN}/1200/900" alt="[work title]" loading="lazy" width="1200" height="900" />
          <figcaption>[Title] · [context] · [year]</figcaption>
        </figure>
        <figure class="media work" data-reveal><!-- REEMPLAZAR: work 02 -->
          <img src="https://picsum.photos/seed/${seedBase}-${++seedN}/900/1200" alt="[work title]" loading="lazy" width="900" height="1200" />
          <figcaption>[Title] · [context] · [year]</figcaption>
        </figure>
      </div>`;
    }
    if (v === "masonry-columns") {
      return `<div class="masonry" data-reveal>
        ${media("collected image 01", 800, 1000)}
        ${media("collected image 02", 800, 600)}
        ${media("collected image 03", 800, 1100)}
        ${media("collected image 04", 800, 700)}
      </div>`;
    }
    if (v === "bento-grid") {
      return `<div class="bento-media" data-reveal>
        ${media("anchor image — largest cell", 1200, 700, "bm-a")}
        ${media("vertical cell", 600, 700, "bm-b")}
        <div class="media bm-c bm-quote"><blockquote>"[Short real quote or stat — omit if unverified]"</blockquote></div>
        ${media("wide cell", 900, 550, "bm-d")}
        ${media("detail cell", 900, 550, "bm-e")}
      </div>`;
    }
    if (v === "stacked-cards") {
      const panel = (i, label) => `<article class="stack-panel" style="--stack-i:${i}">
          ${media(label, 1400, 700)}
          <p class="stack-caption">[Panel ${i + 1} caption — location, scope, moment]</p>
        </article>`;
      return `<div class="stack">
        ${panel(0, "stacked panel image 01")}
        ${panel(1, "stacked panel image 02")}
        ${panel(2, "stacked panel image 03")}
      </div>`;
    }
    /* editorial-asym */
    return `<div class="grid-12 gallery-asym" data-reveal>
        ${media("wide establishing shot — 3:2", 900, 600, "g-7")}
        ${media("vertical detail — 3:4, offset down", 600, 800, "g-5 g-offset")}
        ${media("wide scene — panoramic", 1200, 675, "g-8")}
        ${media("intimate detail crop", 600, 600, "g-4")}
      </div>`;
  }

  /* ------- content layouts ------- */
  function contentHtml(s, layoutId, num) {
    const nn = String(num).padStart(2, "0");
    const guidance = `<!-- ${s.name}: ${s.purpose}\n         Copy guidance: ${s.copy}\n         Layout: ${layoutId} -->`;
    if (layoutId === "split-5-7" || layoutId === "split-7-5") {
      const m = media(`${s.name} image`, layoutId === "split-5-7" ? 900 : 1000, layoutId === "split-5-7" ? 700 : 750, "g-media");
      const t = `<div class="g-text" data-reveal-group>
        ${headBlock(s)}
        <div class="section-body" data-reveal>[Content per guidance above]</div>
      </div>`;
      return `${guidance}
      <div class="grid-12 layout-split${layoutId === "split-7-5" ? " layout-split--rev" : ""}">
        ${layoutId === "split-7-5" ? m + "\n        " + t : t + "\n        " + m}
      </div>`;
    }
    if (layoutId === "full-band") {
      return `${guidance}
      <figure class="band media"><!-- REEMPLAZAR: full-bleed band image -->
        <img src="https://picsum.photos/seed/${seedBase}-${++seedN}/1600/900" alt="" loading="lazy" width="1600" height="900" />
        <figcaption class="band-caption" data-reveal-group>
          <h2 data-reveal>[${s.name} headline]</h2>
          <p data-reveal>[One line only.]</p>
        </figcaption>
      </figure>`;
    }
    if (layoutId === "index-list") {
      const row = (i, label) => `<li class="index-row" data-reveal>
          <span class="index-num">${String(i).padStart(2, "0")}</span>
          <h3 class="index-title">[${label} name]</h3>
          <p class="index-desc">[One vivid, specific line — real detail that proves expertise]</p>
          <span class="index-meta">[meta]</span>
        </li>`;
      return `${guidance}
      <div data-reveal-group>
        ${headBlock(s)}
        <ol class="index-list">
          ${row(1, "Item")}
          ${row(2, "Item")}
          ${row(3, "Item")}
        </ol>
      </div>`;
    }
    if (layoutId === "sticky-split") {
      return `${guidance}
      <div class="grid-12 layout-sticky">
        <div class="sticky-col" data-reveal-group>
          ${headBlock(s)}
          <div class="section-body" data-reveal>[Running narrative — present tense, second person]</div>
        </div>
        <div class="media-stack">
          ${media(`${s.name} moment 01`, 800, 1000)}
          ${media(`${s.name} moment 02`, 800, 600)}
        </div>
      </div>`;
    }
    if (layoutId === "centered-formal") {
      return `${guidance}
      <div class="layout-centered" data-reveal-group>
        <hr class="ornament-rule" aria-hidden="true" />
        ${headBlock(s)}
        <div class="section-body" data-reveal>[Content per guidance above]</div>
      </div>`;
    }
    /* offset-narrow */
    return `${guidance}
      <div class="grid-12 layout-offset">
        <span class="section-numeral" aria-hidden="true">${nn}</span>
        <div class="g-offset-content" data-reveal-group>
          ${headBlock(s)}
          <div class="section-body" data-reveal>[Content per guidance above]</div>
        </div>
      </div>`;
  }

  function faqHtml(s) {
    const item = (i) => `<details class="faq-item" data-reveal>
          <summary>[Question ${i} — in the customer's words]</summary>
          <p>[Confident, specific answer. 2–4 sentences.]</p>
        </details>`;
    return `<!-- ${s.name}: ${s.purpose} -->
      <div data-reveal-group>
        ${headBlock(s)}
        <div class="faq-list">
          ${item(1)}
          ${item(2)}
          ${item(3)}
        </div>
      </div>`;
  }

  function ctaHtml(s) {
    return `<!-- ${s.name}: ${s.purpose} — Copy: ${s.copy} -->
      <div class="cta-band" data-reveal-group>
        <h2 data-reveal>[${s.name} — restate the aspiration in one line]</h2>
        <p data-reveal>[Supporting line: response time, direct channels]</p>
        <a class="cta" href="#" data-reveal>[The one action]</a>
      </div>`;
  }

  function formHtml(s) {
    return `<!-- ${s.name}: ${s.purpose} -->
      <div class="grid-12 layout-split">
        <div class="g-text" data-reveal-group>
          ${headBlock(s)}
          <div class="section-body" data-reveal>[Reassurance + direct channels: phone, WhatsApp, email]</div>
        </div>
        <form class="g-media inquiry-form" action="#" method="post" data-reveal><!-- REEMPLAZAR: wire to backend/WhatsApp/email -->
          <label>[Name]<input type="text" name="name" required /></label>
          <label>[Email or phone]<input type="text" name="contact" required /></label>
          <label>[Message]<textarea name="message" rows="4"></textarea></label>
          <button class="cta" type="submit">[Send]</button>
        </form>
      </div>`;
  }

  /* ------- scroll-scrubbed sequence (Apple AirPods mechanic) ------- */
  const SEQUENCE_TARGETS = new Set(["experience", "story", "presentation", "approach", "feature", "context"]);
  let sequenceUsed = false;
  function sequenceHtml(s) {
    sequenceUsed = true;
    return `<!-- ${s.name} as a scroll-scrubbed sequence (Apple AirPods mechanic).
      REEMPLAZAR: real frames — ffmpeg -i product.mp4 -vf "scale=1600:-2" frames/f_%04d.webp (60–120 frames),
      then set data-frames="frames/f_%04d.webp" data-frame-count="90" on the canvas below.
      Until then, a procedural placeholder (rotating wireframe) demonstrates the mechanic. -->
      <div class="pin-seq-track">
        <div class="pin-seq">
          <canvas class="seq-canvas" width="1600" height="900" aria-hidden="true"></canvas>
          <div class="seq-copy">
            <p class="eyebrow">[${s.name} label]</p>
            <h2>[The story told in rotation — one line per scroll phase]</h2>
          </div>
        </div>
      </div>`;
  }
  const seqCss = flourishIds.has("scrub-sequence")
    ? `\n    /* Scroll-scrub sequence: parent gives scroll room, inner viewport sticks */
    .section--sequence { padding: 0; }
    .pin-seq-track { height: 300vh; }
    .pin-seq { position: sticky; top: 0; height: 100svh; display: grid; place-items: center; overflow: hidden; }
    .seq-canvas { width: min(90vw, 1100px); height: auto; aspect-ratio: 16/9; }
    .seq-copy { position: absolute; left: var(--gutter); bottom: var(--space-lg); max-width: 34rem; }`
    : "";
  const seqJs = flourishIds.has("scrub-sequence")
    ? `\n  <script>(function(){var c=document.querySelector('.seq-canvas');if(!c)return;var ctx=c.getContext('2d');var track=c.closest('.pin-seq-track');var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;var frames=null,count=0;if(c.dataset.frames){count=parseInt(c.dataset.frameCount||'0',10);frames=[];for(var i=1;i<=count;i++){var im=new Image();im.src=c.dataset.frames.replace('%04d',String(i).padStart(4,'0'));frames.push(im);}}
function draw(p){var w=c.width,h=c.height;ctx.clearRect(0,0,w,h);if(frames&&count){var f=frames[Math.min(count-1,Math.floor(p*count))];if(f&&f.complete&&f.naturalWidth){ctx.drawImage(f,0,0,w,h);return;}}
/* Procedural placeholder: wireframe product rotating with scroll */var a=p*Math.PI*2,cx=w/2,cy=h/2,s=h*0.3;ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--color-accent')||'#fff';ctx.lineWidth=2;var pts=[];for(var v=0;v<8;v++){var x=(v&1?1:-1)*s,y=(v&2?1:-1)*s*0.6,z=(v&4?1:-1)*s*0.6;var rx=x*Math.cos(a)-z*Math.sin(a),rz=x*Math.sin(a)+z*Math.cos(a);var d=1+rz/(s*4);pts.push([cx+rx*d,cy+y*d]);}
[[0,1],[1,3],[3,2],[2,0],[4,5],[5,7],[7,6],[6,4],[0,4],[1,5],[2,6],[3,7]].forEach(function(e){ctx.beginPath();ctx.moveTo(pts[e[0]][0],pts[e[0]][1]);ctx.lineTo(pts[e[1]][0],pts[e[1]][1]);ctx.stroke();});}
if(reduced){draw(0.35);return;}var tick=false;function onScroll(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;var r=track.getBoundingClientRect();var p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));draw(p);});}addEventListener('scroll',onScroll,{passive:true});draw(0);})();</script>`
    : "";

  /* ------- assemble sections ------- */
  const bodySections = [];
  let contentIdx = 0;
  for (const s of blueprint.sections) {
    if (s.id === "hero" || s.id === "header" || s.id === "footer") continue;
    let inner;
    if (flourishIds.has("scrub-sequence") && !sequenceUsed && SEQUENCE_TARGETS.has(s.id)) {
      bodySections.push(`    <section class="section section--sequence" id="${s.id}">
      ${sequenceHtml(s)}
    </section>`);
      continue;
    }
    if (GALLERY_IDS.has(s.id)) {
      inner = `<!-- ${s.name}: ${s.purpose} — gallery pattern: ${comp.gallery.variant}. ${comp.gallery.notes} -->
      <div data-reveal-group>
        ${headBlock(s)}
      </div>
      ${galleryHtml(s)}`;
    } else if (FAQ_IDS.has(s.id)) {
      inner = faqHtml(s);
    } else if (CTA_IDS.has(s.id)) {
      inner = ctaHtml(s);
    } else if (FORM_IDS.has(s.id)) {
      inner = formHtml(s);
    } else {
      const layoutId = comp.contentRotation[contentIdx % comp.contentRotation.length];
      contentIdx++;
      inner = contentHtml(s, layoutId, contentIdx);
    }
    bodySections.push(`    <section class="section section--${s.id}" id="${s.id}">
      ${inner}
    </section>`);
  }

  /* ------- nav (anchor links solo; real page links when part of a site) ------- */
  const isInterior = Array.isArray(siteNav) && siteNav.some((n) => n.current && n.file !== "index.html");
  const navLinks = Array.isArray(siteNav)
    ? siteNav
        .map((n) => `<a href="${n.file}"${n.current ? ' aria-current="page"' : ""}>${n.title}</a>`)
        .join("\n        ")
    : blueprint.sections
        .filter((s) => !["hero", "header", "footer", "cta"].includes(s.id))
        .slice(0, 4)
        .map((s) => `<a href="#${s.id}">[${s.name}]</a>`)
        .join("\n        ");
  const navHtml = `    <!-- Nav (${comp.nav.variant}): ${comp.nav.notes} -->
    <nav class="nav nav--${comp.nav.variant}" aria-label="Main">
      <a class="nav-brand" href="#top">${name}</a>
      <div class="nav-links" id="nav-links">
        ${navLinks}
      </div>
      <a class="cta cta--nav" href="#cta">[Nav CTA]</a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links">${lang.primary.startsWith("es") ? "Menú" : "Menu"}</button>
    </nav>`;

  /* Sticky mobile action bar for conversion contexts (trades/clinics/lead-gen). */
  const wantsMobileBar =
    ["craftsman-trust", "care-trust"].includes(styleId) ||
    ["landing-local-service", "contact", "pricing"].includes(pageType);
  const mobileBarHtml = wantsMobileBar
    ? `\n    <!-- Mobile sticky action bar: the thumb-zone conversion surface. Wire real numbers. -->
    <div class="mobile-cta-bar">
      <a class="mcb-btn" href="tel:+10000000000"><!-- REEMPLAZAR: real phone -->[Call]</a>
      <a class="mcb-btn mcb-btn--primary" href="https://wa.me/10000000000"><!-- REEMPLAZAR: real WhatsApp -->[WhatsApp]</a>
    </div>`
    : "";

  /* ------- footer ------- */
  const fv = comp.footer.variant;
  let footerHtml;
  if (fv === "minimal-line") {
    footerHtml = `    <!-- Footer (minimal-line): ${comp.footer.notes} -->
    <footer class="site-footer footer--minimal-line">
      <span>${name}</span>
      <nav aria-label="Footer">[inline links]</nav>
      <span>© ${new Date().getFullYear()}</span>
    </footer>`;
  } else {
    const mega =
      fv === "mega-cta"
        ? `<div class="footer-mega" data-reveal-group>
        <h2 data-reveal>[Final emotional close — one line]</h2>
        <a class="cta" href="#cta" data-reveal>[Closing action]</a>
      </div>\n      `
        : "";
    footerHtml = `    <!-- Footer (${fv}): ${comp.footer.notes} -->
    <footer class="site-footer footer--${fv}">
      ${mega}<div class="footer-grid">
        <div><p class="footer-brand">${name}</p><p>[one-line brand statement]</p></div>
        <nav aria-label="Footer">[site links]</nav>
        <div>[address · phone · hours — full NAP if local]</div>
        <div>[social links]</div>
      </div>
      <p class="footer-legal">© ${new Date().getFullYear()} ${name}. [legal links]</p>
    </footer>`;
  }

  /* ------- flourishes (scaffolded ones are physically implemented) ------- */
  const grainDiv = flourishIds.has("grain-overlay") ? `\n  <div class="grain" aria-hidden="true"></div>` : "";
  const progressDiv = flourishIds.has("scroll-progress") ? `\n  <div class="scroll-progress" aria-hidden="true"></div>` : "";
  const tickerHtml = flourishIds.has("marquee-ticker")
    ? `\n\n    <div class="ticker" aria-hidden="true"><span class="ticker-track">[keyword] · [keyword] · [keyword] · [keyword] · [keyword] · [keyword] · [keyword] · [keyword] · </span></div>`
    : "";
  const progressJs = flourishIds.has("scroll-progress")
    ? `\n  <script>(function(){var sp=document.querySelector('.scroll-progress');if(!sp)return;var d=document.documentElement;addEventListener('scroll',function(){sp.style.transform='scaleX('+(d.scrollTop/((d.scrollHeight-d.clientHeight)||1))+')';},{passive:true});})();</script>`
    : "";
  /* Mobile menu toggle: framework-free, always shipped.
     Guarantees: toggle is always reachable (fixed on mobile, above the panel),
     relabels Menu <-> Close, moves focus into the menu on open and back on close. */
  const menuLabels = lang.primary.startsWith("es") ? { open: "Menú", close: "Cerrar" } : { open: "Menu", close: "Close" };
  const navJs = `\n  <script>(function(){var t=document.querySelector('.nav-toggle'),l=document.getElementById('nav-links');if(!t||!l)return;var LBL={open:'${menuLabels.open}',close:'${menuLabels.close}'};function set(o){t.setAttribute('aria-expanded',String(o));t.textContent=o?LBL.close:LBL.open;document.body.classList.toggle('nav-open',o);if(o){var f=l.querySelector('a');if(f)f.focus();}else{t.focus();}}t.addEventListener('click',function(){set(t.getAttribute('aria-expanded')!=='true');});l.addEventListener('click',function(e){if(e.target.closest('a'))set(false);});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&t.getAttribute('aria-expanded')==='true')set(false);});})();</script>`;

  const pendingFlourishes = variation.flourishes.filter((f) => !f.scaffolded);
  const flourishTodo = pendingFlourishes.length
    ? `\n  <!-- VARIATION FLOURISHES TO IMPLEMENT (seed ${variation.seed}) — precise specs:\n${pendingFlourishes.map((f) => `       [${f.id}] ${f.name}: ${f.notes}`).join("\n")}\n  -->`
    : "";
  const flourishCssParts = [];
  if (flourishIds.has("grain-overlay")) {
    flourishCssParts.push(`.grain { position: fixed; inset: 0; z-index: 2147483000; pointer-events: none; opacity: .05; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>"); }`);
  }
  if (flourishIds.has("marquee-ticker")) {
    flourishCssParts.push(`.ticker { overflow: hidden; border-top: 1px solid var(--color-line); border-bottom: 1px solid var(--color-line); padding: .6em 0; }
    .ticker-track { display: inline-block; white-space: nowrap; font-size: var(--size-small); letter-spacing: .25em; text-transform: uppercase; animation: tk-scroll 25s linear infinite; }
    @keyframes tk-scroll { to { transform: translateX(-50%); } }
    @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }`);
  }
  if (flourishIds.has("scroll-progress")) {
    flourishCssParts.push(`.scroll-progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; background: var(--color-accent); transform: scaleX(0); transform-origin: left; z-index: 2147483001; }`);
  }
  if (flourishIds.has("oversized-footer")) {
    flourishCssParts.push(`.footer-wordmark { font-family: var(--font-display); font-size: clamp(4rem, 16vw, 18rem); line-height: .78; white-space: nowrap; color: var(--color-text); margin: var(--space-md) 0 -0.24em; flex-basis: 100%; }
    .site-footer { overflow: hidden; }`);
  }
  const flourishCss = flourishCssParts.length ? `\n    /* Variation flourishes (seed ${variation.seed}) */\n    ${flourishCssParts.join("\n    ")}` : "";
  if (flourishIds.has("oversized-footer")) {
    const wordmark = `<p class="footer-wordmark" aria-hidden="true">${name}</p>`;
    footerHtml = footerHtml.includes('<p class="footer-legal"')
      ? footerHtml.replace('<p class="footer-legal"', `${wordmark}\n      <p class="footer-legal"`)
      : footerHtml.replace("</footer>", `  ${wordmark}\n    </footer>`);
  }

  /* ------- css ------- */
  const heroCss = {
    immersive: `.hero--immersive { position: relative; min-height: 100svh; display: flex; }
    .hero--immersive .hero-media { position: absolute; inset: 0; margin: 0; }
    .hero--immersive .hero-media img, .hero--framed-center .hero-media img { width: 100%; height: 100%; object-fit: cover; }
    .hero-scrim { position: absolute; inset: 0; background: ${comp.hero.scrim || "linear-gradient(to top, rgba(0,0,0,.8), transparent 70%)"}; pointer-events: none; }
    .hero-content { position: relative; z-index: 1; padding: var(--space-lg) var(--gutter); align-self: flex-end; max-width: 44rem; }
    .hero-content--bottom-center { margin-inline: auto; text-align: center; }
    .scroll-cue { position: absolute; bottom: var(--space-sm); left: 50%; z-index: 1; color: var(--color-text-muted); }`,
    "framed-center": `.hero--framed-center { position: relative; min-height: 100svh; display: flex; align-items: center; justify-content: center; }
    .hero--framed-center .hero-media { position: absolute; inset: 0; margin: 0; }
    .hero-scrim { position: absolute; inset: 0; background: ${comp.hero.scrim || "rgba(0,0,0,.6)"}; }
    .hero-frame { position: relative; z-index: 1; margin: 24px; padding: var(--space-xl) var(--space-lg); border: 1px solid var(--color-accent); box-shadow: 0 0 0 4px var(--color-bg) inset, 0 0 0 5px var(--color-accent) inset; text-align: center; }
    .hero-content--center .ornament { color: var(--color-accent); display: block; margin-bottom: var(--space-sm); }`,
    "split-form": `.hero--split-form { display: grid; grid-template-columns: 7fr 5fr; min-height: 80svh; }
    .hero-panel { background: ${comp.hero.heroPanel || "var(--color-text)"}; color: var(--color-bg); padding: var(--space-xl) var(--gutter); display: flex; flex-direction: column; justify-content: center; }
    .hero-panel .eyebrow { color: var(--color-accent); }
    .proof-strip { margin-top: var(--space-md); font-size: var(--size-small); opacity: .85; }
    .hero-form { display: flex; align-items: center; padding: var(--space-lg) var(--gutter); background: var(--color-surface); }
    .hero-form form { width: 100%; display: grid; gap: var(--space-sm); }
    .form-title { font-size: 1.5rem; }
    .media--full { margin: 0; } .media--full img { width: 100%; height: auto; }`,
    "split-media": `.hero--split-media { display: grid; grid-template-columns: 6fr 6fr; gap: var(--gutter); align-items: center; min-height: 88svh; padding: var(--space-xl) var(--gutter) var(--space-lg); }
    .trust-markers { margin-top: var(--space-md); font-size: var(--size-small); color: var(--color-text-muted); }`,
    typographic: `.hero--typographic { min-height: 88svh; display: flex; flex-direction: column; justify-content: flex-end; padding: var(--space-xl) var(--gutter) 0; }
    .hero--typographic .hero-title { max-width: none; }
    .hero-meta { display: flex; gap: var(--space-md); font-size: var(--size-small); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: .15em; border-top: 1px solid var(--color-line); margin-top: var(--space-lg); padding: var(--space-sm) 0; }`,
    campaign: `.hero--campaign { display: grid; grid-template-columns: 1fr 1fr; min-height: 100svh; position: relative; align-items: center; }
    .hero--campaign .hero-media { margin: 0; height: 100svh; } .hero--campaign .hero-media img { width: 100%; height: 100%; object-fit: cover; }
    .hero--campaign .hero-copy { padding: 0 0 0 var(--gutter); position: relative; z-index: 1; margin-right: -18%; }
    .vertical-label { position: absolute; right: var(--space-sm); top: 50%; writing-mode: vertical-rl; font-size: var(--size-small); letter-spacing: .3em; }`,
    "kinetic-type": `.hero--kinetic-type { min-height: 100svh; display: flex; flex-direction: column; justify-content: center; overflow: hidden; padding: var(--space-lg) 0; }
    .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    .k-line, .k-track { font-family: var(--font-display); font-size: clamp(3rem, 11vw, 10rem); line-height: .95; text-transform: uppercase; white-space: nowrap; }
    .k-line { display: block; padding: 0 var(--gutter); }
    .k-outline { color: transparent; -webkit-text-stroke: 1px var(--color-text); }
    .k-marquee { overflow: hidden; } .k-track { display: inline-block; color: var(--color-accent); animation: k-scroll 20s linear infinite; }
    @keyframes k-scroll { to { transform: translateX(-50%); } }
    @media (prefers-reduced-motion: reduce) { .k-track { animation: none; } }
    .hero--kinetic-type .hero-meta { display: flex; gap: var(--space-md); font-size: var(--size-small); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: .15em; border-top: 1px solid var(--color-line); margin: var(--space-lg) var(--gutter) 0; padding: var(--space-sm) 0; }`,
    bento: `.hero--bento { min-height: 100svh; display: flex; align-items: center; padding: calc(var(--space-lg) + 4rem) var(--gutter) var(--space-lg); }
    .bento { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: minmax(9rem, auto); gap: var(--space-sm); width: 100%; }
    .bento-cell { background: var(--color-surface); border: 1px solid var(--color-line); border-radius: 14px; overflow: hidden; margin: 0; }
    .bento-anchor { grid-column: span 4; grid-row: span 2; padding: var(--space-md); display: flex; flex-direction: column; justify-content: center; }
    .b-tall { grid-column: span 2; grid-row: span 2; } .b-wide { grid-column: span 3; } .b-stat { grid-column: span 2; padding: var(--space-md); display: flex; flex-direction: column; justify-content: center; } .b-small { grid-column: span 1; }
    .bento-cell img { width: 100%; height: 100%; object-fit: cover; }
    .stat-num { font-family: var(--font-display); font-size: var(--size-h2); } .stat-label { color: var(--color-text-muted); font-size: var(--size-small); }`,
    collage: `.hero--collage { position: relative; min-height: 100svh; padding: calc(var(--space-lg) + 3rem) var(--gutter) var(--space-lg); }
    .collage { position: relative; height: 68vh; }
    .c-img { position: absolute; margin: 0; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
    .c-1 { width: 42%; left: 5%; top: 0; transform: rotate(-2deg); }
    .c-2 { width: 34%; right: 8%; top: 12%; transform: rotate(1.5deg); }
    .c-3 { width: 22%; left: 41%; bottom: -8%; transform: rotate(-1deg); z-index: 2; }
    .hero-content--collage { position: relative; z-index: 3; margin-top: -16vh; max-width: 44rem; }
    .margin-caption { position: absolute; right: var(--space-sm); bottom: var(--space-lg); writing-mode: vertical-rl; font-size: var(--size-small); color: var(--color-text-muted); }`
  }[comp.hero.variant];

  const galleryCss = {
    "editorial-asym": `.gallery-asym { row-gap: var(--space-lg); }
    .g-7 { grid-column: span 7; } .g-5 { grid-column: span 5; } .g-8 { grid-column: 3 / span 8; } .g-4 { grid-column: span 4; }
    .g-offset { margin-top: var(--space-xl); }`,
    "horizontal-scroll": `.hscroll { display: flex; gap: var(--space-md); overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: var(--space-sm); position: relative; margin: 0 calc(-1 * var(--gutter)); padding-inline: var(--gutter); }
    .hscroll .media { flex: 0 0 auto; height: 60vh; margin: 0; scroll-snap-align: start; }
    .hscroll .media img { height: 100%; width: auto; }
    .hscroll-index { font-size: var(--size-small); color: var(--color-text-muted); align-self: flex-end; }`,
    "single-stack": `.single-stack .work { margin: 0 auto var(--space-xl); max-width: 70vw; text-align: center; }
    .single-stack img { max-height: 80vh; width: auto; max-width: 100%; margin: 0 auto; }
    .single-stack figcaption { margin-top: var(--space-sm); font-size: var(--size-small); color: var(--color-text-muted); }`,
    "masonry-columns": `.masonry { columns: 2; column-gap: var(--space-md); }
    .masonry .media { break-inside: avoid; margin: 0 0 var(--space-md); }`,
    "bento-grid": `.bento-media { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: minmax(10rem, auto); gap: var(--space-sm); margin-top: var(--space-lg); }
    .bento-media .media { margin: 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--color-line); }
    .bento-media .media img { width: 100%; height: 100%; object-fit: cover; }
    .bm-a { grid-column: span 4; grid-row: span 2; } .bm-b { grid-column: span 2; grid-row: span 2; } .bm-c { grid-column: span 2; } .bm-d { grid-column: span 2; } .bm-e { grid-column: span 2; }
    .bm-quote { display: flex; align-items: center; padding: var(--space-md); background: var(--color-surface); font-family: var(--font-display); font-size: 1.25rem; }`,
    "stacked-cards": `.stack { margin-top: var(--space-lg); }
    .stack-panel { position: sticky; top: calc(9vh + var(--stack-i, 0) * 2.75rem); background: var(--color-surface); border: 1px solid var(--color-line); padding: var(--space-sm); margin-bottom: var(--space-lg); }
    .stack-panel img { width: 100%; height: 56vh; object-fit: cover; }
    .stack-caption { padding-top: var(--space-xs); font-size: var(--size-small); color: var(--color-text-muted); }`
  }[comp.gallery.variant];

  const html = `<!doctype html>
<html lang="${lang.primary}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name} — ${blueprint.name}</title>
  <meta name="description" content="${desc}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${ds.fontImport}" rel="stylesheet" />
  <style>
${ds.cssVariables.split("\n").map((l) => "    " + l).join("\n")}

    /* Base — ${style.name}. Palette logic: ${ds.paletteNotes} */
    *, *::before, *::after { box-sizing: border-box; margin: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); font-size: var(--size-body); line-height: 1.7; -webkit-font-smoothing: antialiased; }
    h1, h2, h3 { font-family: var(--font-display); line-height: 1.05; font-weight: 500; }
    h1 { font-size: var(--size-hero); }
    h2 { font-size: var(--size-h2); }
    a { color: inherit; }
    img { max-width: 100%; height: auto; display: block; }
    figure { margin: 0; }
    .eyebrow { font-size: var(--size-small); letter-spacing: .2em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: var(--space-sm); }
    .hero-title { max-width: 14ch; }
    .hero-sub { max-width: 44ch; color: var(--color-text-muted); margin-top: var(--space-sm); }
    .cta { display: inline-block; margin-top: var(--space-md); padding: .9em 2.2em; border: 1px solid var(--color-accent); color: var(--color-accent); text-decoration: none; font-size: var(--size-small); letter-spacing: .15em; text-transform: uppercase; transition: background .3s var(--ease-brand), color .3s var(--ease-brand); }
    .cta:hover, .cta:focus-visible { background: var(--color-accent); color: var(--color-bg); }
    button.cta { font-family: inherit; cursor: pointer; background: var(--color-accent); color: var(--color-bg); border: none; }
    .section { padding: var(--space-section) var(--gutter); border-top: 1px solid var(--color-line); }
    .section-body { max-width: var(--measure); margin-top: var(--space-md); }

    /* 12-col grid + content layouts */
    .grid-12 { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--space-md); align-items: start; }
    .layout-split .g-text { grid-column: span 5; }
    .layout-split .g-media, .layout-split .inquiry-form { grid-column: span 7; }
    .layout-split--rev .g-media { grid-column: span 7; } .layout-split--rev .g-text { grid-column: span 5; }
    .layout-offset .section-numeral { grid-column: span 2; font-family: var(--font-display); font-size: var(--size-h2); color: var(--color-text-muted); opacity: .5; }
    .layout-offset .g-offset-content { grid-column: 3 / span 7; }
    .band { position: relative; margin: 0 calc(-1 * var(--gutter)); }
    .band img { width: 100%; height: 70vh; object-fit: cover; }
    .band-caption { position: absolute; inset: auto 0 0 0; padding: var(--space-lg) var(--gutter); background: linear-gradient(to top, rgba(0,0,0,.75), transparent); color: #fff; }
    .index-list { list-style: none; padding: 0; margin-top: var(--space-lg); }
    .index-row { display: grid; grid-template-columns: 3rem 1fr 2fr auto; gap: var(--space-md); align-items: baseline; padding: var(--space-md) 0; border-top: 1px solid var(--color-line); }
    .index-num { font-size: var(--size-small); color: var(--color-text-muted); }
    .index-title { font-size: 1.375rem; }
    .index-desc, .index-meta { color: var(--color-text-muted); }
    .layout-sticky .sticky-col { grid-column: span 5; position: sticky; top: 15vh; align-self: start; }
    .layout-sticky .media-stack { grid-column: 7 / span 6; display: grid; gap: var(--space-lg); }
    .layout-centered { max-width: var(--measure); margin: 0 auto; text-align: center; }
    .ornament-rule { width: 4rem; margin: 0 auto var(--space-md); border: 0; border-top: 1px solid var(--color-accent); }

    /* FAQ + CTA + forms */
    .faq-list { margin-top: var(--space-lg); max-width: var(--measure); }
    .faq-item { border-top: 1px solid var(--color-line); padding: var(--space-sm) 0; }
    .faq-item summary { cursor: pointer; font-weight: 500; padding: var(--space-xs) 0; }
    .faq-item p { color: var(--color-text-muted); padding: var(--space-xs) 0 var(--space-sm); max-width: var(--measure); }
    .cta-band { text-align: center; max-width: 44rem; margin: 0 auto; }
    label { display: grid; gap: .35rem; font-size: var(--size-small); }
    /* 16px floor prevents iOS auto-zoom on focus */
    input, select, textarea { font: inherit; font-size: max(16px, 1em); color: inherit; background: transparent; border: 1px solid var(--color-line); padding: .8em; width: 100%; }
    .inquiry-form { display: grid; gap: var(--space-sm); }

    /* Nav */
    .nav { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm) var(--gutter); font-size: var(--size-small); }
    .nav-toggle { display: none; background: none; border: 1px solid var(--color-line); color: inherit; font: inherit; font-size: var(--size-small); letter-spacing: .12em; text-transform: uppercase; padding: .5em 1em; min-height: 44px; cursor: pointer; }
    .nav-brand { font-family: var(--font-display); font-size: 1.25rem; text-decoration: none; }
    .nav-links { display: flex; gap: var(--space-md); margin-left: auto; }
    .nav-links a { text-decoration: none; letter-spacing: .12em; text-transform: uppercase; }
    .cta--nav { margin: 0; padding: .6em 1.4em; }
    .nav--transparent-overlay { position: absolute; inset: 0 0 auto 0; z-index: 2; }
    .nav--solid-bar { position: sticky; top: 0; z-index: 10; background: var(--color-bg); border-bottom: 1px solid var(--color-line); }
    .nav--edge-caps { justify-content: space-between; text-transform: uppercase; letter-spacing: .2em; border-bottom: 1px solid var(--color-line); }
    .nav--edge-caps .nav-links { margin-left: 0; }

    /* Hero (${comp.hero.variant}) */
    ${heroCss}

    /* Gallery (${comp.gallery.variant}) */
    ${galleryCss}

    /* Image treatment — ${style.name} */
    ${comp.treatmentCss || "/* none — images run untreated */"}
${flourishCss}${seqCss}

    /* Interior pages (multi-page sites): reduced hero, same architecture */
    .hero.hero--interior { min-height: 58svh; }

    /* Mobile sticky action bar (conversion contexts) */
    .mobile-cta-bar { display: none; }
    @media (max-width: 900px) {
      .mobile-cta-bar { display: flex; position: fixed; inset: auto 0 0 0; z-index: 40; border-top: 1px solid var(--color-line); background: var(--color-bg); padding-bottom: env(safe-area-inset-bottom); }
      .mcb-btn { flex: 1; min-height: 52px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: var(--size-small); letter-spacing: .12em; text-transform: uppercase; }
      .mcb-btn--primary { background: var(--color-accent); color: var(--color-bg); }
      body.has-mobile-bar { padding-bottom: calc(52px + env(safe-area-inset-bottom)); }
    }

    /* Footer (${fv}) */
    .site-footer { padding: var(--space-lg) var(--gutter); border-top: 1px solid var(--color-line); color: var(--color-text-muted); font-size: var(--size-small); }
    .footer--minimal-line { display: flex; justify-content: space-between; gap: var(--space-md); }
    .footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md); margin-bottom: var(--space-md); }
    .footer-brand { font-family: var(--font-display); font-size: 1.25rem; color: var(--color-text); }
    .footer-mega { text-align: center; padding: var(--space-xl) 0; }
    .footer-legal { border-top: 1px solid var(--color-line); padding-top: var(--space-sm); }

    /* Reveal + reduced motion */
    [data-reveal] { opacity: 0; visibility: hidden; }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      [data-reveal] { opacity: 1; visibility: visible; }
    }

    /* Responsive collapse */
    @media (max-width: 900px) {
      .grid-12 { grid-template-columns: 1fr; }
      .layout-split .g-text, .layout-split .g-media, .layout-split .inquiry-form,
      .layout-offset .g-offset-content, .layout-sticky .sticky-col, .layout-sticky .media-stack,
      .g-7, .g-5, .g-8, .g-4 { grid-column: auto; }
      .g-offset { margin-top: 0; }
      .layout-sticky .sticky-col { position: static; }
      .section-numeral { display: none; }
      .hero--split-form, .hero--split-media, .hero--campaign { grid-template-columns: 1fr; min-height: 0; }
      .hero--campaign .hero-copy { margin-right: 0; padding: var(--space-lg) var(--gutter); }
      .hero--campaign .hero-media { height: 70vh; }
      .index-row { grid-template-columns: 2.5rem 1fr; }
      .index-desc { grid-column: 2; } .index-meta { grid-column: 2; }
      .masonry { columns: 1; }
      .single-stack .work { max-width: 100%; }
      .footer-grid { grid-template-columns: 1fr 1fr; }
      /* Mobile menu: hamburger + full-screen panel in the brand's language.
         The toggle is FIXED so it can never scroll away (overlay navs) or be
         covered by the open panel — closing is always one visible tap. */
      .nav-toggle { display: inline-flex; align-items: center; justify-content: center; position: fixed; top: .75rem; right: var(--gutter); z-index: 35; background: var(--color-bg); }
      .cta--nav { display: none; }
      .nav-links { display: none; position: fixed; inset: 0; z-index: 25; background: var(--color-bg); flex-direction: column; justify-content: center; gap: var(--space-md); padding: var(--space-lg) var(--gutter); margin-left: 0; font-size: 1.5rem; }
      body.nav-open .nav-links { display: flex; }
      body.nav-open { overflow: hidden; }
      .nav-links a { min-height: 44px; display: inline-flex; align-items: center; }
      .faq-item summary { min-height: 44px; display: flex; align-items: center; }
      .band img { height: 55vh; }
      .hscroll .media { height: 45vh; }
      .k-line, .k-track { font-size: clamp(2.4rem, 13vw, 4.5rem); }
      .bento, .bento-media { grid-template-columns: 1fr 1fr; }
      .bento-anchor, .b-tall, .b-wide, .b-stat, .bm-a, .bm-b, .bm-c, .bm-d, .bm-e { grid-column: span 2; grid-row: auto; }
      .b-small { grid-column: span 1; }
      .collage { height: auto; }
      .c-img { position: static; width: 100%; transform: none; margin-bottom: var(--space-sm); }
      .hero-content--collage { margin-top: 0; }
      .margin-caption { display: none; }
      .stack-panel img { height: 40vh; }
    }

    /* TODO(build): scaffold gives the structural skeleton — apply the style's
       signature details before shipping:
${style.signatureDetails.map((d) => "       - " + d).join("\n")} */
  </style>
</head>
<body${wantsMobileBar ? ' class="has-mobile-bar"' : ""}>
  <a href="#main" style="position:absolute;left:-999px" onfocus="this.style.left='1rem'" onblur="this.style.left='-999px'">Skip to content</a>${grainDiv}${progressDiv}

${navHtml}

  <main id="main">
${isInterior ? heroHtml().replace('class="hero ', 'class="hero hero--interior ') : heroHtml()}${tickerHtml}

${bodySections.join("\n\n")}
  </main>

${footerHtml}${mobileBarHtml}
${navJs}
${includeGsap ? `  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>${useLenis ? `\n  <script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>` : ""}
  <script>
    // ${style.name} motion: ${style.motion.character}
    // GSAP is 100% free incl. SplitText/ScrambleText/DrawSVG — load what the build needs.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced && window.gsap) {
      gsap.registerPlugin(ScrollTrigger);${useLenis ? `
      if (window.Lenis) {
        // Lenis momentum scroll — the 'feels expensive' upgrade, wired into ScrollTrigger.
        document.documentElement.style.scrollBehavior = 'auto';
        const lenis = new Lenis();
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }` : ""}
      document.querySelectorAll('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal]');
        if (!items.length) return;
        gsap.fromTo(items,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 1.0, ease: 'expo.out', /* tune to brand easing: ${style.motion.easing} */ stagger: 0.12,
            scrollTrigger: { trigger: group, start: 'top 78%' } }
        );
      });
      document.querySelectorAll('[data-reveal]:not([data-reveal-group] [data-reveal])').forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 82%' } });
      });
    } else {
      document.querySelectorAll('[data-reveal]').forEach((el) => { el.style.opacity = 1; el.style.visibility = 'visible'; });
    }
  </script>` : ""}${seqJs}${progressJs}${flourishTodo}
</body>
</html>
`;

  return {
    file: `${slug || (pageType === "home" ? "index" : pageType)}.html`,
    html,
    composition: {
      nav: comp.nav.variant,
      hero: comp.hero.variant,
      gallery: comp.gallery.variant,
      contentRotation: comp.contentRotation,
      footer: comp.footer.variant,
      variationSeed: variation.seed,
      flourishes: variation.flourishes.map((f) => `${f.id}${f.scaffolded ? " (scaffolded)" : " (spec in HTML comment)"}`)
    },
    reminders: [
      ...(sequenceUsed
        ? ["Scroll-scrub sequence included with a procedural placeholder — replace with real frames (ffmpeg command in the section comment) before shipping."]
        : []),
      ...(variation.isDefault
        ? []
        : [`Variation seed ${variation.seed} applied: hero=${variation.hero}, gallery=${variation.gallery}. Flourishes marked (scaffolded) are already implemented; the rest are specced in a VARIATION FLOURISHES comment before </body> and must be built.`]),
      "This scaffold now carries real structure (nav, hero architecture, layout grid, gallery pattern, footer) with placeholder images from picsum.photos — every <!-- REEMPLAZAR --> marks an image to replace with a real curated asset.",
      lang.instruction,
      `Style prohibitions: ${style.avoid.join("; ")}`,
      "Replace every [bracketed placeholder]; run the polish checklist (quality_standards tool) before shipping."
    ]
  };
}

/* ------------------------------- site scaffold --------------------------------
   Emits a complete linked multi-page site: every page shares identical tokens,
   nav (real hrefs + aria-current), and footer; interior pages get reduced heroes. */

export function scaffoldSite({ styleId, business = {}, pages, variationSeed = 0, includeGsap = true }) {
  const style = getStyle(styleId);
  if (!style) throw new Error(`Unknown style "${styleId}".`);
  if (!Array.isArray(pages) || pages.length === 0) throw new Error("Provide at least one page: [{ pageType, title?, slug? }]");

  const navEntries = pages.map((pg) => {
    const bp = getBlueprint(pg.pageType);
    if (!bp) throw new Error(`Unknown pageType "${pg.pageType}".`);
    const slugName = pg.slug || (pg.pageType === "home" ? "index" : pg.pageType);
    return { title: pg.title || (pg.pageType === "home" ? business.name || "Home" : bp.name.split(" (")[0].split(" / ")[0]), file: `${slugName}.html`, slug: slugName, pageType: pg.pageType };
  });
  const seen = new Set();
  for (const n of navEntries) {
    if (seen.has(n.file)) throw new Error(`Duplicate output file '${n.file}' — give repeated pageTypes distinct slugs.`);
    seen.add(n.file);
  }

  const variation = buildVariation(styleId, variationSeed);
  const files = navEntries.map((entry) => {
    const out = scaffoldPage({
      styleId,
      pageType: entry.pageType,
      business,
      includeGsap,
      variationSeed,
      slug: entry.slug,
      siteNav: navEntries.map((n) => ({ title: n.title, file: n.file, current: n.file === entry.file }))
    });
    return { file: out.file, html: out.html, composition: out.composition };
  });

  return {
    site: {
      style: style.id,
      business: business.name || "(unnamed)",
      pageCount: files.length,
      variationSeed: variation.seed,
      variation: variation.isDefault ? "default composition" : `hero=${variation.hero}, gallery=${variation.gallery}, flourishes=[${variation.flourishes.map((f) => f.id).join(", ")}]`
    },
    consistency: [
      "All pages share identical :root tokens, nav (real links, aria-current on the current page), and footer.",
      "Interior pages use the reduced-height version of the same hero architecture (hero--interior).",
      "Relative links only — deployable to GitHub Pages project URLs as-is.",
      "Craft each page to its build brief (compose_build_prompt with the same styleId + variationSeed) — these scaffolds are the structural bones."
    ],
    files
  };
}
