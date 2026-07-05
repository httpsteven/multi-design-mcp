#!/usr/bin/env node
/**
 * Multi-Design MCP — premium web design intelligence server.
 *
 * Exposes curated design directions, page blueprints, design-system
 * composition, agency-grade build prompts, batch site plans (for
 * generating many pages consistently), HTML scaffolds, and quality
 * standards — all derived from a premium web methodology.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { listStyles, getStyle } from "./data/styles.js";
import { getComposition, describeComposition } from "./data/layouts.js";
import { listBlueprints, getBlueprint } from "./data/blueprints.js";
import {
  ANTI_PATTERNS,
  MOTION_RULES,
  COPY_RULES,
  MOBILE_RULES,
  POLISH_CHECKLIST,
  PRIORITY_HIERARCHY,
  WORK_PHASES
} from "./data/quality.js";
import {
  composeDesignSystem,
  composeBuildPrompt,
  composeSitePlan,
  scaffoldPage,
  scaffoldSite
} from "./generators.js";
import { buildVariation, VARIATION_SPACE, FLOURISHES } from "./data/variations.js";
import { getTrends } from "./data/trends.js";
import { LIBRARIES, RECIPES } from "./data/stacks.js";

const server = new McpServer({
  name: "multi-design",
  version: "1.0.0"
});

/* ------------------------------ shared schemas ------------------------------ */

const businessSchema = z
  .object({
    name: z.string().optional().describe("Business/brand name"),
    industry: z.string().optional().describe("Industry or category, e.g. 'event venue'"),
    description: z.string().optional().describe("What the business does, in a sentence or two"),
    audience: z.string().optional().describe("Target audience"),
    valueProposition: z.string().optional().describe("Core value proposition"),
    differentiators: z.array(z.string()).optional().describe("Concrete differentiators (capacities, awards, materials, years)"),
    tone: z.string().optional().describe("Desired voice/tone"),
    assets: z.string().optional().describe("Available assets: photo folders, logos, brand colors"),
    links: z.array(z.string()).optional().describe("Google Business, Instagram, existing site, etc."),
    accentColor: z.string().optional().describe("Brand accent color hex to override the style default"),
    language: z.string().optional().describe("Site language(s): 'en' (default), 'es', or bilingual like 'bilingual en/es' — bilingual sites get an EN/ES toggle with a shared I18N strings object"),
    notes: z.string().optional().describe("Anything else relevant")
  })
  .optional()
  .describe("Business context. Provide as much as known; unknowns must be marked [TO CONFIRM] in output, never invented.");

const styleIdSchema = z.string().describe("Design style id from list_design_styles, e.g. 'editorial-luxury'");
const pageTypeSchema = z.string().describe("Page type id from list_page_blueprints, e.g. 'home', 'gallery', 'pricing'");
const stackSchema = z.enum(["static", "react"]).optional().describe("Target stack. 'static' (default): HTML/CSS/JS + GSAP, GitHub-Pages ready. 'react': exportable React/Next.");
const variationSeedSchema = z
  .number()
  .int()
  .min(0)
  .optional()
  .describe("Variation seed (0/omitted = style default). Any positive integer deterministically picks an alternate hero architecture, gallery pattern, layout rotation, and 2-3 signature flourishes so sibling sites in the same style never share bones. Use generate_variations to preview options.");

const text = (data) => ({
  content: [{ type: "text", text: typeof data === "string" ? data : JSON.stringify(data, null, 2) }]
});

/* Shared style-ranking used by recommend_style and bootstrap_website. */
function rankStyles(industry, mood = []) {
  const q = (industry || "").toLowerCase();
  const moods = mood.map((m) => m.toLowerCase());
  const scored = listStyles().map((s) => {
    const full = getStyle(s.id);
    let score = 0;
    const reasons = [];
    for (const b of full.bestFor) {
      const words = b.toLowerCase().split(/[^a-zà-ú]+/).filter((w) => w.length > 3);
      if (b.toLowerCase().includes(q) || q.includes(b.toLowerCase()) || words.some((w) => q.includes(w))) {
        score += 3;
        reasons.push(`listed best-for: '${b}'`);
        break;
      }
    }
    const styleText = `${full.summary} ${full.motion.character} ${full.imagery}`.toLowerCase();
    for (const m of moods) {
      if (styleText.includes(m)) {
        score += 1;
        reasons.push(`matches mood '${m}'`);
      }
    }
    return { id: s.id, name: s.name, score, reasons, summary: s.summary };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/* Deterministic seed from the business name: different businesses never
   share bones by default, and re-running for the same business is stable. */
function seedFromName(name) {
  return (String(name || "site").split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % 97) + 1;
}

/* ---------------------------------- tools ----------------------------------- */

server.tool(
  "list_design_styles",
  "List the curated premium design directions (id, name, summary, best-for). Start here to pick or recommend an art direction for a website.",
  {},
  async () => text(listStyles())
);

server.tool(
  "get_design_style",
  "Get the full specification of one design style: typography pairing, palette with usage notes, motion character and signature moves, imagery direction, signature details, style-specific prohibitions, AND the composition spec — hero architecture, gallery pattern, content layout rotation, image crops/treatment, nav and footer structure.",
  { styleId: styleIdSchema },
  async ({ styleId }) => {
    const s = getStyle(styleId);
    if (!s) return text({ error: `Unknown style '${styleId}'`, available: listStyles().map((x) => x.id) });
    return text({ ...s, composition: getComposition(styleId), compositionBrief: describeComposition(styleId) });
  }
);

server.tool(
  "list_page_blueprints",
  "List available page blueprints (home, about, services, gallery, contact, pricing, faq, blog-index, blog-post, product, case-study, coming-soon) with their narrative arc.",
  {},
  async () => text(listBlueprints())
);

server.tool(
  "get_page_blueprint",
  "Get the section-by-section structure for a page type: each section's purpose and copywriting guidance, so the page tells a story instead of stacking template blocks.",
  { pageType: pageTypeSchema },
  async ({ pageType }) => {
    const b = getBlueprint(pageType);
    if (!b) return text({ error: `Unknown pageType '${pageType}'`, available: listBlueprints().map((x) => x.id) });
    return text(b);
  }
);

server.tool(
  "create_design_system",
  "Compose a complete, ready-to-use design system for a style + brand: CSS custom-property token block, Google Fonts import URL, palette with usage logic, spacing scale, motion spec, imagery direction, and signature details. Use this once per site and share it across all pages.",
  { styleId: styleIdSchema, brand: businessSchema },
  async ({ styleId, brand }) => text(composeDesignSystem({ styleId, brand: brand || {} }))
);

server.tool(
  "compose_build_prompt",
  "Generate a complete agency-grade build brief for ONE page: role framing, business context, art direction, exact design tokens, narrative section structure with copy guidance, motion spec, copywriting rules, forbidden anti-patterns, decision hierarchy, work phases, and definition of done. Feed this brief to the builder (yourself or another agent) to produce a premium page.",
  { styleId: styleIdSchema, pageType: pageTypeSchema, business: businessSchema, stack: stackSchema, variationSeed: variationSeedSchema },
  async ({ styleId, pageType, business, stack, variationSeed }) =>
    text(composeBuildPrompt({ styleId, pageType, business: business || {}, stack: stack || "static", variationSeed: variationSeed || 0 }))
);

server.tool(
  "plan_site",
  "Plan a whole multi-page site (or a large batch of pages) at once: returns the shared design system, cross-page consistency rules, build order, and a ready-to-execute build brief for EVERY page. This is the tool for generating many high-quality pages that stay coherent — execute the page briefs one by one.",
  {
    styleId: styleIdSchema,
    business: businessSchema,
    stack: stackSchema,
    pages: z
      .array(
        z.object({
          pageType: pageTypeSchema,
          title: z.string().optional().describe("Page title override"),
          slug: z.string().optional().describe("Output filename slug (without .html)"),
          notes: z.string().optional().describe("Page-specific requirements")
        })
      )
      .min(1)
      .describe("Pages to generate, in build order. Same pageType may repeat with different slugs/notes (e.g. many landing pages)."),
    variationSeed: variationSeedSchema
  },
  async ({ styleId, business, pages, stack, variationSeed }) =>
    text(composeSitePlan({ styleId, business: business || {}, pages, stack: stack || "static", variationSeed: variationSeed || 0 }))
);

server.tool(
  "scaffold_page",
  "Generate an actual starter HTML file for a page: real design tokens in :root, font loading, semantic blueprint sections with embedded copy guidance, GSAP + ScrollTrigger reveal system, and prefers-reduced-motion support. A working structural base to craft the premium finish on top of — not a finished page.",
  {
    styleId: styleIdSchema,
    pageType: pageTypeSchema,
    business: businessSchema,
    includeGsap: z.boolean().optional().describe("Include GSAP/ScrollTrigger reveal script (default true)"),
    variationSeed: variationSeedSchema
  },
  async ({ styleId, pageType, business, includeGsap, variationSeed }) =>
    text(scaffoldPage({ styleId, pageType, business: business || {}, includeGsap: includeGsap !== false, variationSeed: variationSeed || 0 }))
);

server.tool(
  "scaffold_site",
  "Generate a complete LINKED multi-page site in one call: every page shares identical design tokens, a real cross-page nav (relative hrefs, aria-current on the active page), and footer; interior pages automatically get the reduced-height version of the same hero architecture. Returns one {file, html} entry per page, ready to write to disk and deploy to GitHub Pages. Use after bootstrap_website/plan_site to materialize the whole site's structural bones with one variationSeed.",
  {
    styleId: styleIdSchema,
    business: businessSchema,
    pages: z
      .array(
        z.object({
          pageType: pageTypeSchema,
          title: z.string().optional().describe("Nav label override"),
          slug: z.string().optional().describe("Output filename (without .html); required when a pageType repeats")
        })
      )
      .min(1)
      .describe("Pages in nav order; first is usually home"),
    variationSeed: variationSeedSchema,
    includeGsap: z.boolean().optional()
  },
  async ({ styleId, business, pages, variationSeed, includeGsap }) =>
    text(scaffoldSite({ styleId, business: business || {}, pages, variationSeed: variationSeed || 0, includeGsap: includeGsap !== false }))
);

server.tool(
  "generate_variations",
  "Preview N distinct variations of a style before building: each seed deterministically combines an alternate hero architecture, gallery pattern, shuffled layout rotation, and 2-3 signature flourishes (grain, marquee, custom cursor, pinned scenes, WebGL accent...). Pick a seed, then pass it as variationSeed to compose_build_prompt / plan_site / scaffold_page. This is how sibling sites in the same style get different bones.",
  {
    styleId: styleIdSchema,
    count: z.number().int().min(1).max(12).optional().describe("How many variations to preview (default 4)")
  },
  async ({ styleId, count }) => {
    if (!VARIATION_SPACE[styleId]) return text({ error: `Unknown style '${styleId}'`, available: Object.keys(VARIATION_SPACE) });
    const n = count || 4;
    const seen = new Set();
    const variations = [];
    for (let seed = 1; variations.length < n && seed <= n * 6; seed++) {
      const v = buildVariation(styleId, seed);
      const key = `${v.hero}|${v.gallery}|${v.flourishes.map((f) => f.id).sort().join(",")}`;
      if (seen.has(key)) continue;
      seen.add(key);
      variations.push({
        seed: v.seed,
        hero: v.hero,
        gallery: v.gallery,
        contentRotation: v.contentRotation,
        flourishes: v.flourishes.map((f) => ({ id: f.id, name: f.name, cost: f.cost }))
      });
    }
    return text({
      styleId,
      variationSpace: VARIATION_SPACE[styleId],
      variations,
      usage: "Pass the chosen seed as variationSeed to compose_build_prompt, plan_site, or scaffold_page. Same seed = same variation, always."
    });
  }
);

server.tool(
  "bootstrap_website",
  "THE ENTRY POINT for building a website — one call that forces the full methodology, no skippable steps: ranks the best style for the business, derives a deterministic variation seed from the business name (different businesses never share bones; same business always gets the same result), and returns the complete package — style choice with reasoning, applied variation, shared design system, cross-page consistency rules, a ready-to-execute build brief for EVERY page, and the workflow order. Execute the returned briefs one by one; audit each page with quality_standards before shipping.",
  {
    business: businessSchema,
    pages: z
      .array(
        z.object({
          pageType: pageTypeSchema,
          title: z.string().optional(),
          slug: z.string().optional(),
          notes: z.string().optional()
        })
      )
      .optional()
      .describe("Pages to build. Omit for the default local-business sitemap (home, services, gallery, faq, contact)."),
    styleId: z.string().optional().describe("Force a specific style instead of the ranked recommendation"),
    variationSeed: variationSeedSchema,
    mood: z.array(z.string()).optional().describe("Mood words to bias style ranking, e.g. ['dark','dramatic']"),
    stack: stackSchema
  },
  async ({ business, pages, styleId, variationSeed, mood, stack }) => {
    const biz = business || {};
    const ranked = rankStyles(biz.industry || "", mood || []);
    const chosen = styleId && getStyle(styleId) ? styleId : ranked[0].id;
    const seed = variationSeed && variationSeed > 0 ? variationSeed : seedFromName(biz.name);
    const pageList = pages && pages.length ? pages : [
      { pageType: "home" },
      { pageType: "services" },
      { pageType: "gallery" },
      { pageType: "faq" },
      { pageType: "contact" }
    ];
    const plan = composeSitePlan({ styleId: chosen, business: biz, pages: pageList, stack: stack || "static", variationSeed: seed });
    const variation = buildVariation(chosen, seed);
    return text({
      style: {
        chosen,
        reasoning: styleId ? ["forced by caller"] : ranked[0].reasons,
        runnersUp: ranked.slice(1, 3).filter((s) => s.score > 0).map(({ id, name, reasons }) => ({ id, name, reasons }))
      },
      variation: {
        seed,
        seedSource: variationSeed && variationSeed > 0 ? "caller" : "derived from business name (deterministic)",
        hero: variation.hero,
        gallery: variation.gallery,
        flourishes: variation.flourishes.map((f) => f.id)
      },
      workflow: [
        "1. Confirm the style choice with the human if their brand has an existing direction.",
        "2. Build pages in the plan's order — home first locks the design language.",
        "3. Each page: follow its buildPrompt exactly (tokens, composition, variation directive, mobile mandate are all inside). Optionally start from scaffold_page with the same styleId + variationSeed.",
        "4. Keep nav/footer byte-identical across pages per the consistency rules.",
        "5. Before shipping each page: audit against quality_standards (anti-patterns, mobile, polish checklist).",
        "6. Never invent business facts — [TO CONFIRM] markers stay until the client confirms."
      ],
      sitePlan: plan
    });
  }
);

server.tool(
  "recommend_stack",
  "Curated modern library intelligence (verified July 2026) for premium static-first sites: GSAP (100% free since April 2025 INCLUDING SplitText/ScrambleText/DrawSVG/MorphSVG), Lenis momentum scroll, Motion, anime.js v4, OGL/Three.js, PhotoSwipe, Embla, View Transitions API, Alpine, Astro for batch static generation, and more — each with when-to-use and premium-restraint notes. Optionally pass a need to get the exact recipe (e.g. 'text-reveals', 'static-forms', 'batch-page-generation').",
  {
    need: z
      .enum(["premium-motion-core", "text-reveals", "page-transitions", "gallery-lightbox", "webgl-accent", "scroll-sequence", "static-forms", "batch-page-generation", "micro-interactions", "bilingual-toggle"])
      .optional()
      .describe("A specific need — returns that recipe plus the full catalog context")
  },
  async ({ need }) => {
    if (need) return text({ need, recipe: RECIPES[need], libraries: LIBRARIES.filter((l) => RECIPES[need].recipe.toLowerCase().includes(l.id) || RECIPES[need].recipe.includes(l.name.split(" ")[0])) });
    return text({ libraries: LIBRARIES, recipes: RECIPES });
  }
);

server.tool(
  "get_design_trends",
  "State-of-the-art web design catalog (researched July 2026, grounded in Awwwards winners and post-hype retrospectives): kinetic typography, bento saturation, anti-design counter-trend, 3D/WebGL mainstreaming, scroll storytelling, tactile grain, custom cursors, broken grids, view transitions, expressive footers. Each entry includes premium-application guidance and honest risk notes (accessibility, Core Web Vitals). Also lists the full flourish library with implementation specs.",
  {},
  async () => text({ trends: getTrends(), flourishLibrary: FLOURISHES })
);

server.tool(
  "quality_standards",
  "Get the quality contract: forbidden anti-patterns, motion rules, copywriting rules, the full pre-ship polish checklist, decision hierarchy, and work phases. Use it as the definition of done and to audit any generated page.",
  {
    section: z
      .enum(["all", "anti-patterns", "motion", "copy", "mobile", "polish-checklist", "priorities", "phases"])
      .optional()
      .describe("Which standard to return (default all)")
  },
  async ({ section }) => {
    const all = {
      antiPatterns: ANTI_PATTERNS,
      motionRules: MOTION_RULES,
      copyRules: COPY_RULES,
      mobileRules: MOBILE_RULES,
      polishChecklist: POLISH_CHECKLIST,
      priorityHierarchy: PRIORITY_HIERARCHY,
      workPhases: WORK_PHASES
    };
    const map = {
      "anti-patterns": { antiPatterns: ANTI_PATTERNS },
      motion: { motionRules: MOTION_RULES },
      copy: { copyRules: COPY_RULES },
      mobile: { mobileRules: MOBILE_RULES },
      "polish-checklist": { polishChecklist: POLISH_CHECKLIST },
      priorities: { priorityHierarchy: PRIORITY_HIERARCHY },
      phases: { workPhases: WORK_PHASES }
    };
    return text(!section || section === "all" ? all : map[section]);
  }
);

server.tool(
  "recommend_style",
  "Recommend the best design style(s) for a business. Returns ranked matches with reasoning based on industry fit, plus the runner-up so a human can choose.",
  {
    industry: z.string().describe("Business industry/category, e.g. 'event venue', 'developer tool', 'café'"),
    mood: z.array(z.string()).optional().describe("Desired mood words, e.g. ['dramatic','dark'] or ['warm','natural']")
  },
  async ({ industry, mood }) => {
    const scored = rankStyles(industry, mood || []);
    const top = scored.filter((s) => s.score > 0).slice(0, 3);
    return text({
      recommendations: top.length ? top : [{ note: "No strong keyword match — review these defaults", fallbacks: [scored[0], ...scored.slice(1, 3)] }],
      advice: "Present the top choice with reasoning, but confirm art direction with the client before building. Use get_design_style for the full spec."
    });
  }
);

/* --------------------------------- prompts ----------------------------------- */

server.prompt(
  "premium-website",
  "End-to-end premium website workflow: pick a style, plan the site, build every page to the quality contract.",
  {
    businessName: z.string().describe("Business name"),
    industry: z.string().describe("Industry, e.g. 'event venue'"),
    details: z.string().optional().describe("Everything known: description, audience, assets, links, tone")
  },
  ({ businessName, industry, details }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Build a premium website for "${businessName}" (${industry}).${details ? `\n\nContext:\n${details}` : ""}

Start with ONE call: bootstrap_website with the business info (and a custom page list if the default sitemap doesn't fit). It returns the chosen style with reasoning, a deterministic variation, the shared design system, and a ready build brief for every page. Then:
1. Confirm the style direction with me if my brand already has one.
2. Execute each page's buildPrompt in order (home first); optionally start from scaffold_page with the same styleId + variationSeed.
3. Audit every page against quality_standards (anti-patterns, mobile, polish checklist) before declaring it done.

Never invent unconfirmed business facts — mark them [TO CONFIRM]. The result must be static-host ready (GitHub Pages).`
        }
      }
    ]
  })
);

/* ----------------------------------- boot ------------------------------------ */

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("multi-design MCP server running on stdio");
