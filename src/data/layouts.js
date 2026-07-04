/**
 * Composition layer: concrete layout structure per style.
 * Where tokens say what things look like, this says what the page IS —
 * hero architecture, image placement, gallery patterns, section layout
 * rotation, nav and footer structure.
 */

export const HERO_VARIANTS = {
  immersive: {
    name: "Immersive Media Hero",
    description:
      "Full-bleed media covering 100svh. A single photograph or video loop owns the viewport; a directional scrim protects legibility; the content block (eyebrow, headline ≤14ch, subline, CTA) is anchored at a corner — never dead center unless the style is ceremonial. Scroll cue at the bottom edge."
  },
  "split-form": {
    name: "Conversion Split Hero",
    description:
      "Two-column hero built to capture leads: left column is a solid dark panel with eyebrow, headline, one-line proof strip (years · rating · licensed); right column is a light quote/booking form card with at most 5 fields. On mobile the form drops below the text. The page's single most important image appears immediately after, full width."
  },
  "split-media": {
    name: "Editorial Split Hero",
    description:
      "Two-column hero: text column (headline, subline, primary + secondary CTA, small trust markers) beside a media column holding one treated image at 4:5 or 3:4. Ratio between 6/6 and 5/7. Media gets the style's mask/border treatment."
  },
  typographic: {
    name: "Typographic Hero",
    description:
      "No media. Display type IS the hero: an oversized headline occupying most of the viewport width, set on the background color, with a metadata row (location · discipline · year) pinned above a hairline at the hero's bottom edge."
  },
  "framed-center": {
    name: "Ceremonial Framed Hero",
    description:
      "Symmetric centered hero inside a fine double-rule frame inset from the viewport edges. Stack: small ornament, eyebrow, headline, subline, CTA — all centered. Optional dimmed full-bleed media behind the frame."
  },
  campaign: {
    name: "Campaign Hero",
    description:
      "Fashion-campaign structure: a full-height portrait image occupies the right half of the viewport; massive display type enters from the left and deliberately overlaps the image edge. A small vertical label runs along the viewport edge. Nav is part of the composition."
  },
  "kinetic-type": {
    name: "Kinetic Typography Hero",
    description:
      "Type IS the hero: 3–4 oversized display lines stacked to fill the viewport, alternating solid and outline (text-stroke) treatments, with one line running as a slow marquee. Presentational lines are aria-hidden; a real static visually-hidden h1 carries the accessible/SEO headline. Animate transform only — zero layout shift. Meta row pinned at the bottom hairline."
  },
  bento: {
    name: "Bento Hero",
    description:
      "Modular grid hero of unequal cells: one oversized anchor cell holds the headline + CTA; surrounding cells mix a tall image, a wide image, a big stat/proof number, and a small detail crop. Cells must be genuinely different from each other — never a grid of equal feature blurbs. Differentiated spans (e.g. 4×2 anchor, 2×2, 2×1) on a 6-column module."
  },
  collage: {
    name: "Collage Hero",
    description:
      "Broken-grid personality: 2–3 overlapping images at slight rotations occupy the viewport asymmetrically; the headline block overlaps the image stack (z-raised), with a caption escaping into the margin. Every overlap is deliberate — a disciplined base grid violated with intent, not scattered elements."
  }
};

export const GALLERY_VARIANTS = {
  "editorial-asym": {
    name: "Asymmetric Editorial Grid",
    description:
      "12-column grid with deliberately unequal placements — e.g. a 7-col 3:2 image beside a 5-col 3:4 image offset downward, then an 8-col wide shot with a 4-col detail crop. No two rows repeat the same arrangement. Generous gaps from the spacing scale."
  },
  "horizontal-scroll": {
    name: "Horizontal Scroll Strip",
    description:
      "Full-bleed horizontally scrolling track with scroll-snap; mixed portrait and landscape frames at consistent height (~70vh); an index counter (01 / 07) and drag affordance. On touch it swipes; desktop scrolls or drags."
  },
  "single-stack": {
    name: "Museum Single Stack",
    description:
      "One image per viewport moment, centered with vast margins, museum-label caption beneath (title · context · dimensions/date). No cropping — object-fit: contain. Slow crossfade or simple scroll between works."
  },
  "masonry-columns": {
    name: "Masonry Columns",
    description:
      "2–3 CSS columns at natural aspect ratios, modest gaps. Feels collected rather than designed. Captions optional, small, under each image."
  },
  "bento-grid": {
    name: "Bento Media Grid",
    description:
      "Modular grid of unequal media cells (one 4-col anchor, mixed 2- and 3-col satellites) with tight consistent gaps. Cells may mix photography with a stat tile or quote tile. Needs at least three distinct cell sizes to avoid template feel."
  },
  "stacked-cards": {
    name: "Sticky Stacked Panels",
    description:
      "Full-width panels that stick beneath each other as you scroll — each new panel slides over the previous (position: sticky with incremental top offsets). One image + caption per panel. Cinematic pacing without scroll-jacking; degrades to simple stacking."
  }
};

export const CONTENT_LAYOUTS = {
  "split-5-7": {
    name: "Text 5 / Media 7",
    description: "Text column (heading, body ≤60ch) spanning 5 of 12 columns; media spanning 7. Text baseline-aligned to the media top."
  },
  "split-7-5": {
    name: "Media 7 / Text 5",
    description: "Media leads on the left at 7 columns, text follows at 5. Use when the image carries more information than the words."
  },
  "offset-narrow": {
    name: "Offset Narrow Column",
    description: "No media. Oversized section numeral (01, 02…) in columns 1–2, muted; heading + body in columns 3–9, body capped at 60ch. Whitespace does the work."
  },
  "full-band": {
    name: "Full-Bleed Media Band",
    description: "Full-width media band ~70vh tall with a scrim and an overlaid heading + one line, bottom-left. A breathing moment between denser sections."
  },
  "index-list": {
    name: "Index List",
    description: "Numbered rows separated by hairlines: numeral · item title · one-line description · meta/detail. Each row is a hover target. The anti-card-grid way to list services/offerings."
  },
  "sticky-split": {
    name: "Sticky Narrative Split",
    description: "Heading and running text stick in the left 5 columns while 2–3 media blocks scroll past in the right 7. For experience/story sections."
  },
  "centered-formal": {
    name: "Centered Formal Column",
    description: "Single centered column ≤65ch with an ornament or rule divider above the heading. Symmetric, ceremonial pacing."
  }
};

export const FOOTER_VARIANTS = {
  columns: {
    name: "Column Footer",
    description: "Four columns: brand statement · site navigation · contact + hours (full NAP for local businesses) · social links. Legal line below a hairline."
  },
  "mega-cta": {
    name: "Mega-CTA Footer",
    description: "A final full-width statement + CTA (the page's emotional close) sits above the utility columns; beneath, an oversized brand wordmark cropped by the viewport bottom."
  },
  "minimal-line": {
    name: "Minimal Line Footer",
    description: "A single hairline-topped row: brand · inline nav links · legal. Nothing else."
  }
};

export const NAV_VARIANTS = {
  "transparent-overlay": {
    name: "Transparent Overlay Nav",
    description: "Absolute-positioned over the hero, no background: wordmark left, letterspaced small-caps links right, optional bordered CTA. Gains a solid background only when sticky after scroll."
  },
  "solid-bar": {
    name: "Solid Bar Nav",
    description: "Fixed bar with the background color and a bottom hairline: wordmark left, links center/right, primary CTA button right (phone number visible for local businesses)."
  },
  "edge-caps": {
    name: "Edge Caps Nav",
    description: "Tiny letterspaced caps distributed across the full top edge — brand far left, links spread, CTA far right — reading as a typographic ruler line."
  }
};

/**
 * Per-style composition. `imageAspects` = the only crops this style uses.
 * `treatmentCss` is injected verbatim into scaffolds (media containers carry
 * class "media"). `scrim` is the hero overlay gradient where relevant.
 */
export const COMPOSITIONS = {
  "editorial-luxury": {
    nav: { variant: "transparent-overlay", notes: "Light text over the dark hero; CTA is a hairline-bordered 'Reserve' button." },
    hero: { variant: "immersive", contentPosition: "bottom-left", scrim: "linear-gradient(to top, rgba(14,13,11,0.92) 0%, rgba(14,13,11,0.35) 45%, transparent 75%)", notes: "One atmospheric wide shot, warm-graded. Headline bottom-left at the gutter, eyebrow above, CTA below." },
    gallery: { variant: "editorial-asym", notes: "Mix 3:2 wides with 3:4 verticals; offset verticals downward for rhythm." },
    contentRotation: ["offset-narrow", "split-5-7", "sticky-split", "index-list"],
    imageAspects: ["3:2 (wide scenes)", "3:4 (verticals/details)"],
    treatmentCss: ".media img { filter: saturate(0.92) sepia(0.06); }",
    footer: { variant: "mega-cta", notes: "Final line invites the booking; oversized wordmark below." }
  },
  "cinematic-noir": {
    nav: { variant: "transparent-overlay", notes: "Barely-there: wordmark + menu word. The film should start immediately." },
    hero: { variant: "immersive", contentPosition: "bottom-center", scrim: "linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 40%, rgba(5,5,5,0.2) 100%)", notes: "Giant condensed headline near the bottom, possibly clipped by the viewport edge. Timecode label top-right." },
    gallery: { variant: "horizontal-scroll", notes: "Consistent 70vh height, scene-to-scene like a contact sheet." },
    contentRotation: ["full-band", "split-7-5", "sticky-split"],
    imageAspects: ["16:9 (scenes)", "2:3 (portraits)"],
    treatmentCss: ".media img { filter: grayscale(1) contrast(1.15); }",
    footer: { variant: "minimal-line", notes: "Credits-style: quiet, small, done." }
  },
  "swiss-minimal": {
    nav: { variant: "solid-bar", notes: "Flush-left wordmark, right-aligned links, no CTA button — a link is enough." },
    hero: { variant: "typographic", notes: "Headline fills the width flush-left; meta row (city · discipline · est.) above the bottom hairline." },
    gallery: { variant: "editorial-asym", notes: "Asymmetric but grid-disciplined: spans follow the 12-col grid visibly, images never bleed." },
    contentRotation: ["index-list", "offset-narrow", "split-5-7"],
    imageAspects: ["3:2 only — one ratio, absolute consistency"],
    treatmentCss: "",
    footer: { variant: "minimal-line", notes: "One row. Everything else is already on the page." }
  },
  "brutalist-statement": {
    nav: { variant: "solid-bar", notes: "2px bottom border; links in mono caps; CTA is a black block that inverts on hover." },
    hero: { variant: "typographic", notes: "Headline at 12–14vw crashing into the edges; a marquee ticker strip runs directly beneath the hero." },
    gallery: { variant: "masonry-columns", notes: "Hard-edged cutouts, 2px borders, no radius, tight gaps." },
    contentRotation: ["index-list", "split-7-5", "full-band"],
    imageAspects: ["free — irregularity is the point"],
    treatmentCss: ".media { border: 2px solid var(--color-line); }",
    footer: { variant: "columns", notes: "Columns divided by hard 2px rules; oversized brand block." }
  },
  "organic-warm": {
    nav: { variant: "solid-bar", notes: "Soft: background color, no border, sentence-case links, rounded CTA." },
    hero: { variant: "split-media", mediaMask: "arch", notes: "Text left, arched image right. Headline sentence case; CTA rounded." },
    gallery: { variant: "masonry-columns", notes: "Natural aspects, occasional arch mask on one image per group." },
    contentRotation: ["split-5-7", "offset-narrow", "full-band"],
    imageAspects: ["4:5 (arched)", "3:2 (scenes)"],
    treatmentCss: ".media { border-radius: 12px; overflow: hidden; } .media--arch { border-radius: 999px 999px 12px 12px; }",
    footer: { variant: "columns", notes: "Warm sign-off line above the columns; generous padding." }
  },
  "art-deco-opulent": {
    nav: { variant: "edge-caps", notes: "Small-caps with wide tracking; thin gold rule beneath the whole bar." },
    hero: { variant: "framed-center", scrim: "linear-gradient(rgba(16,20,24,0.55), rgba(16,20,24,0.75))", notes: "Double gold rule frame inset ~24px; sunburst ornament above the eyebrow; everything symmetric." },
    gallery: { variant: "editorial-asym", notes: "Asymmetric spans but mirrored across rows to keep ceremonial balance." },
    contentRotation: ["centered-formal", "split-5-7", "full-band"],
    imageAspects: ["4:5 (portraits of the space)", "16:9 (wide moments)"],
    treatmentCss: ".media { border: 1px solid var(--color-line); padding: 8px; } .media img { border: 1px solid var(--color-line); }",
    footer: { variant: "columns", notes: "Centered brand + gold ornament above symmetric columns." }
  },
  "tech-precision": {
    nav: { variant: "solid-bar", notes: "Dense: wordmark, product links, docs, mono version tag, solid CTA." },
    hero: { variant: "split-media", notes: "Headline + sub + dual CTA left; product UI screenshot or animated diagram right in a 1px-bordered frame. Mono metrics strip beneath (latency · uptime · SOC2)." },
    gallery: { variant: "editorial-asym", notes: "Screenshots and diagrams in bordered frames, never raw." },
    contentRotation: ["split-7-5", "index-list", "offset-narrow"],
    imageAspects: ["16:10 (UI)", "1:1 (diagrams)"],
    treatmentCss: ".media { border: 1px solid var(--color-line); border-radius: 8px; overflow: hidden; }",
    footer: { variant: "columns", notes: "Product / company / resources / legal — plus status line with a mono uptime badge." }
  },
  "gallery-white": {
    nav: { variant: "solid-bar", notes: "Nearly invisible: name left, two links right, no CTA." },
    hero: { variant: "typographic", notes: "Modest: name + one framing line, generous top margin. The first artwork appears within the first scroll." },
    gallery: { variant: "single-stack", notes: "One work per moment; object-fit contain; museum captions." },
    contentRotation: ["offset-narrow", "split-5-7"],
    imageAspects: ["native — never crop the work"],
    treatmentCss: ".media img { object-fit: contain; background: var(--color-surface); }",
    footer: { variant: "minimal-line", notes: "Name, contact, year. Gallery hours if physical." }
  },
  "retro-editorial": {
    nav: { variant: "solid-bar", notes: "Masthead energy: serif wordmark center or left, category links, issue-date meta." },
    hero: { variant: "split-media", notes: "Serif headline with an italic accent word left; image right with slight tilt correcting to straight on reveal. Category tag styled as a printed label." },
    gallery: { variant: "masonry-columns", notes: "Mixed archival + new photos, thin borders, occasional printed-label caption." },
    contentRotation: ["split-5-7", "offset-narrow", "index-list"],
    imageAspects: ["3:2 and 4:5, film-like"],
    treatmentCss: ".media { border: 1px solid var(--color-line); } .media--tilt { transform: rotate(-1deg); }",
    footer: { variant: "columns", notes: "Colophon-style: publication info, sections, subscribe line." }
  },
  "monochrome-fashion": {
    nav: { variant: "edge-caps", notes: "Tiny caps across the full top edge inside the 1px page frame." },
    hero: { variant: "campaign", notes: "Full-height portrait right; massive Didone type overlapping from the left; vertical season label on the edge." },
    gallery: { variant: "horizontal-scroll", notes: "Look-to-look swipe; consistent portrait frames; look numbers (LOOK 01)." },
    contentRotation: ["split-7-5", "full-band", "offset-narrow"],
    imageAspects: ["2:3 (looks)", "3:4 (details)"],
    treatmentCss: ".media img { filter: grayscale(1); }",
    footer: { variant: "minimal-line", notes: "Inside the page frame; caps; nothing warm." }
  },
  "craftsman-trust": {
    nav: { variant: "solid-bar", notes: "Wordmark + services links + phone number visible + gold 'Free Quote' CTA. EN/ES toggle when bilingual." },
    hero: { variant: "split-form", heroPanel: "#15264d", notes: "Navy left panel: eyebrow, headline, proof strip (years · licensed & insured · rating). Right: light quote form card (name, phone, service, message). Full-width project photo immediately after." },
    gallery: { variant: "editorial-asym", notes: "Finished work + before/after pairs side by side; captions with location and scope." },
    contentRotation: ["index-list", "split-5-7", "full-band"],
    imageAspects: ["4:3 (installations)", "1:1 (before/after pairs)"],
    treatmentCss: ".media { border: 1px solid var(--color-line); border-radius: 4px; overflow: hidden; }",
    footer: { variant: "columns", notes: "Full NAP (name, address, phone) + hours + service area list — local SEO surface." }
  },
  "care-trust": {
    nav: { variant: "solid-bar", notes: "Logo, services, providers, locations + teal 'Book Appointment' button and visible phone. Sticky on mobile." },
    hero: { variant: "split-media", mediaMask: "rounded", notes: "Left: headline, reassurance subline, dual CTA (book + call), trust markers (same-day · bilingual · insurance). Right: rounded-mask photo of real staff/facility." },
    gallery: { variant: "editorial-asym", notes: "Facility and team photos with generous rounding; used sparingly — this style is content-led." },
    contentRotation: ["split-5-7", "index-list", "offset-narrow"],
    imageAspects: ["4:3 (facility)", "1:1 (providers)"],
    treatmentCss: ".media { border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); }",
    footer: { variant: "columns", notes: "Locations with hours per column; emergency/after-hours line clearly visible." }
  },
  "ivory-elegance": {
    nav: { variant: "transparent-overlay", notes: "Dark serif wordmark over the bright hero; hairline gold CTA border." },
    hero: { variant: "immersive", contentPosition: "bottom-left", scrim: "linear-gradient(to top, rgba(253,252,249,0.96) 0%, rgba(253,252,249,0.45) 40%, transparent 70%)", notes: "Bright airy full-bleed photo; ivory gradient rises from the bottom so dark text sits on light. Italic accent word in the headline." },
    gallery: { variant: "editorial-asym", notes: "Daylight photography, verticals offset downward, one hairline-gold-framed image per group." },
    contentRotation: ["split-5-7", "centered-formal", "sticky-split"],
    imageAspects: ["3:4 (details/florals)", "3:2 (spaces)"],
    treatmentCss: ".media { border: 1px solid var(--color-line); }",
    footer: { variant: "mega-cta", notes: "Final invitation line + reservation CTA; serene columns beneath." }
  }
};

export function getComposition(styleId) {
  return COMPOSITIONS[styleId] || null;
}

export function describeComposition(styleId) {
  const c = COMPOSITIONS[styleId];
  if (!c) return null;
  const hero = HERO_VARIANTS[c.hero.variant];
  const gallery = GALLERY_VARIANTS[c.gallery.variant];
  const nav = NAV_VARIANTS[c.nav.variant];
  const footer = FOOTER_VARIANTS[c.footer.variant];
  return [
    `**Navigation — ${nav.name}:** ${nav.description} ${c.nav.notes}`,
    `**Hero — ${hero.name}:** ${hero.description} Style notes: ${c.hero.notes}`,
    `**Gallery/media — ${gallery.name}:** ${gallery.description} Style notes: ${c.gallery.notes}`,
    `**Content section rotation (cycle in order, never two identical layouts adjacent):**\n${c.contentRotation.map((id, i) => `  ${i + 1}. ${CONTENT_LAYOUTS[id].name} — ${CONTENT_LAYOUTS[id].description}`).join("\n")}`,
    `**Image crops allowed:** ${c.imageAspects.join(" · ")}`,
    c.treatmentCss ? `**Image treatment CSS:** \`${c.treatmentCss}\`` : "**Image treatment:** none — images run untreated.",
    `**Footer — ${footer.name}:** ${footer.description} ${c.footer.notes}`
  ].join("\n\n");
}
