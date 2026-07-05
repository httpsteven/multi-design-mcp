/**
 * Curated premium design directions.
 * Each style is a complete art direction: typography, palette, motion
 * character, imagery direction, signature details, and what to avoid.
 * Fonts are Google Fonts so every scaffold works on a free static deploy.
 */

export const STYLES = [
  {
    id: "editorial-luxury",
    name: "Editorial Luxury",
    summary:
      "Refined, cinematic, magazine-grade. Photography as the star, generous whitespace, serif display type. The Apple/Porsche level of restraint and precision.",
    bestFor: ["event venues", "hotels", "luxury real estate", "weddings", "high-end services"],
    typography: {
      display: { family: "Cormorant Garamond", weights: [400, 500, 600], fallback: "Georgia, serif" },
      body: { family: "Inter", weights: [300, 400, 500], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(3rem, 8vw, 7rem)", h2: "clamp(2rem, 4vw, 3.5rem)", body: "1.0625rem", small: "0.8125rem" },
      details: "Tight display leading (0.95–1.05), generous body leading (1.7), letterspaced uppercase eyebrows (0.2em)."
    },
    palette: {
      background: "#0e0d0b",
      surface: "#171512",
      text: "#f5f1ea",
      textMuted: "#a89f92",
      accent: "#c9a86a",
      line: "rgba(245, 241, 234, 0.12)",
      notes: "Near-black warm charcoal, ivory text, muted champagne-gold accent used sparingly (rules, eyebrows, hover states). Never large gold blocks."
    },
    motion: {
      character: "Slow, confident, weighty. Nothing bounces.",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      duration: "0.9s–1.4s reveals, 0.3s hovers",
      signature: ["masked line-by-line text reveals", "slow image scale-in from 1.08 to 1", "subtle parallax on hero imagery", "sticky storytelling sections"]
    },
    imagery: "Full-bleed atmospheric photography, warm dim lighting, human moments at a distance. Duotone or slight warm grade for consistency.",
    signatureDetails: [
      "Hairline rules (1px) as section dividers",
      "Oversized section numerals (01, 02) in muted tone",
      "Uppercase letterspaced eyebrow labels above headings",
      "Asymmetric editorial image layouts, never symmetric card grids"
    ],
    avoid: ["bright saturated colors", "rounded pill buttons", "icon grids", "drop shadows on cards"]
  },
  {
    id: "cinematic-noir",
    name: "Cinematic Noir",
    summary:
      "Dark, dramatic, scroll-driven storytelling. Full-viewport scenes, high contrast, film-title typography. The site feels like a trailer.",
    bestFor: ["photographers", "film studios", "nightlife venues", "automotive", "fashion campaigns"],
    typography: {
      display: { family: "Bebas Neue", weights: [400], fallback: "Impact, sans-serif" },
      body: { family: "Manrope", weights: [300, 400, 600], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(4rem, 12vw, 11rem)", h2: "clamp(2.5rem, 6vw, 5rem)", body: "1rem", small: "0.75rem" },
      details: "Massive condensed display type, sometimes clipped by viewport edges intentionally. Body kept small and quiet."
    },
    palette: {
      background: "#050505",
      surface: "#101010",
      text: "#fafafa",
      textMuted: "#8a8a8a",
      accent: "#e63b2e",
      line: "rgba(250, 250, 250, 0.1)",
      notes: "True black, single hot accent (signal red or electric blue) used only for one or two moments per page."
    },
    motion: {
      character: "Bold and sequenced, like film cuts. Scenes replace each other.",
      easing: "cubic-bezier(0.83, 0, 0.17, 1)",
      duration: "0.6s–1s scene transitions, scrub-linked scroll animations",
      signature: ["pinned full-screen scenes with scrub", "giant type sliding horizontally on scroll", "image clip-path wipes", "counter/number tickers"]
    },
    imagery: "High-contrast black and white or deeply graded color. Motion blur and grain welcome. Faces and machines lit like film stills.",
    signatureDetails: [
      "Full-viewport pinned sections",
      "Horizontal scroll galleries",
      "Timecode-style metadata labels (00:01 / SCENE 02)",
      "Grain or noise texture overlay at 3–5% opacity"
    ],
    avoid: ["white backgrounds", "friendly rounded corners", "pastel anything", "dense paragraph copy"]
  },
  {
    id: "swiss-minimal",
    name: "Swiss Minimal",
    summary:
      "Grid-disciplined, typographic, objective. Content is the interface. Massive clarity, zero decoration that doesn't inform.",
    bestFor: ["design studios", "architecture firms", "consultancies", "portfolios", "publications"],
    typography: {
      display: { family: "Archivo", weights: [400, 500, 700], fallback: "Helvetica, Arial, sans-serif" },
      body: { family: "Archivo", weights: [400, 500], fallback: "Helvetica, Arial, sans-serif" },
      scale: { hero: "clamp(2.5rem, 6vw, 5.5rem)", h2: "clamp(1.75rem, 3vw, 2.75rem)", body: "1.0625rem", small: "0.8125rem" },
      details: "One family, weight and size do all the work. Flush-left, ragged right. Real typographic hierarchy, no fake bolding."
    },
    palette: {
      background: "#f4f3f0",
      surface: "#ffffff",
      text: "#111111",
      textMuted: "#6b6b6b",
      accent: "#1a3fd6",
      line: "rgba(17, 17, 17, 0.15)",
      notes: "Warm paper white, near-black ink, one international blue or signal red accent. Color is information, not decoration."
    },
    motion: {
      character: "Almost none. What moves, moves fast and precisely.",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      duration: "0.2s–0.45s. No slow reveals.",
      signature: ["instant-feeling fades", "underline draw-ins on hover", "grid items settling 40ms apart", "no parallax"]
    },
    imagery: "Documentary, unstyled, honest. Images sit inside the grid, never full-bleed hero walls.",
    signatureDetails: [
      "Visible 12-column grid discipline",
      "Index/table layouts for lists (numbered rows with hairlines)",
      "Metadata everywhere: dates, indices, categories in small caps",
      "Generous top whitespace before each section"
    ],
    avoid: ["decorative animation", "gradients", "shadowed cards", "centered layouts", "italic serifs"]
  },
  {
    id: "brutalist-statement",
    name: "Brutalist Statement",
    summary:
      "Raw, loud, confident. Oversized type, exposed structure, deliberate friction. Unforgettable rather than pretty.",
    bestFor: ["creative agencies", "music/events", "streetwear", "personal brands", "campaign microsites"],
    typography: {
      display: { family: "Space Grotesk", weights: [500, 700], fallback: "Arial Black, sans-serif" },
      body: { family: "Space Mono", weights: [400, 700], fallback: "monospace" },
      scale: { hero: "clamp(3.5rem, 14vw, 12rem)", h2: "clamp(2.5rem, 7vw, 6rem)", body: "1rem", small: "0.8125rem" },
      details: "Display type dominates the viewport. Monospace body reinforces the raw, systemic feel. Underlines are thick (3px+)."
    },
    palette: {
      background: "#ede9e3",
      surface: "#ffffff",
      text: "#0a0a0a",
      textMuted: "#4a4a4a",
      accent: "#ff4d00",
      line: "#0a0a0a",
      notes: "Bone white, hard black 2px borders, one violent accent (safety orange, acid green, or shock pink). Borders are visible and structural."
    },
    motion: {
      character: "Snappy and physical. Things collide, snap, and stamp.",
      easing: "cubic-bezier(0.87, 0, 0.13, 1)",
      duration: "0.3s–0.5s, occasionally instant on purpose",
      signature: ["marquee ticker strips", "hover states that invert colors block-wide", "type that stamps in word by word", "cursor-following elements"]
    },
    imagery: "Cutout images with hard edges, scanned textures, deliberately lo-fi treatments. Or no photography at all — type carries everything.",
    signatureDetails: [
      "2px solid black borders on everything structural",
      "Marquee/ticker text strips between sections",
      "Visible link underlines, thick",
      "Rotated or overlapping type blocks"
    ],
    avoid: ["subtlety", "soft shadows", "muted palettes", "small centered hero text", "polish that sands off the edge"]
  },
  {
    id: "organic-warm",
    name: "Organic Warm",
    summary:
      "Earthy, tactile, human. Soft natural palette, rounded but not childish, texture and breathing room. Feels like sunlight and linen.",
    bestFor: ["wellness brands", "cafés & restaurants", "boutique hotels", "sustainable products", "yoga/retreats"],
    typography: {
      display: { family: "Fraunces", weights: [400, 500, 600], fallback: "Georgia, serif" },
      body: { family: "Nunito Sans", weights: [400, 600], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(2.75rem, 6vw, 5rem)", h2: "clamp(1.875rem, 3.5vw, 3rem)", body: "1.0625rem", small: "0.875rem" },
      details: "Soft-serif display with slight optical warmth (Fraunces soft axis feel). Sentence-case headings — never all caps."
    },
    palette: {
      background: "#f7f2ea",
      surface: "#fffdf8",
      text: "#2d2a24",
      textMuted: "#7c7466",
      accent: "#8a9a5b",
      line: "rgba(45, 42, 36, 0.12)",
      notes: "Cream, clay, sage, terracotta. Accent is a natural tone (olive, ochre, terracotta), never a synthetic brand color."
    },
    motion: {
      character: "Gentle drift. Everything eases in like it's exhaling.",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      duration: "0.7s–1s reveals, soft 0.35s hovers",
      signature: ["soft fade-up reveals", "images with slow ken-burns drift", "organic blob/arch image masks", "gentle stagger on lists"]
    },
    imagery: "Natural light, real textures (linen, wood, ceramic, skin), imperfect and human. Warm editing, never clinical.",
    signatureDetails: [
      "Arched (border-radius top) image masks",
      "Hand-drawn or single-line icon accents used sparingly",
      "Generous section padding (10rem+ desktop)",
      "Subtle paper/grain texture on background"
    ],
    avoid: ["pure white backgrounds", "cold grays", "sharp black borders", "techy gradients", "all-caps shouting"]
  },
  {
    id: "art-deco-opulent",
    name: "Art Deco Opulent",
    summary:
      "Geometric glamour. Gold linework, symmetry, ornamental frames used with modern restraint. Gatsby refined for the web.",
    bestFor: ["cocktail bars", "ballrooms & event halls", "jewelry", "theaters", "premium spirits"],
    typography: {
      display: { family: "Marcellus", weights: [400], fallback: "Georgia, serif" },
      body: { family: "Jost", weights: [300, 400, 500], fallback: "Futura, sans-serif" },
      scale: { hero: "clamp(2.75rem, 7vw, 6rem)", h2: "clamp(2rem, 4vw, 3.25rem)", body: "1rem", small: "0.8125rem" },
      details: "Engraved-feeling display caps with wide letterspacing (0.05–0.15em). Geometric sans body echoing 1920s Futura."
    },
    palette: {
      background: "#101418",
      surface: "#181e24",
      text: "#f2ede3",
      textMuted: "#97917f",
      accent: "#d4af37",
      line: "rgba(212, 175, 55, 0.35)",
      notes: "Deep midnight blue-black, antique gold used as linework and fine ornament — never as fill for large areas."
    },
    motion: {
      character: "Ceremonial. Elements present themselves symmetrically.",
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      duration: "0.8s–1.2s reveals",
      signature: ["gold rule lines drawing outward from center", "symmetric paired reveals", "slow chandelier-like shimmer on dividers", "fan/sunburst SVG ornaments animating stroke-dashoffset"]
    },
    imagery: "Rich interiors, brass and velvet textures, dramatic symmetrical compositions, low warm light.",
    signatureDetails: [
      "Thin gold double-rule frames around key content",
      "Geometric SVG ornaments (sunbursts, fans, stepped forms)",
      "Centered symmetric layouts as the default rhythm",
      "Small-caps navigation with wide tracking"
    ],
    avoid: ["actual glitter/sparkle effects", "gold gradients on text blocks", "cluttered ornament", "asymmetric chaos"]
  },
  {
    id: "tech-precision",
    name: "Tech Precision",
    summary:
      "Engineered, dense with signal, quietly premium. For products that must feel inevitable and exact — not a startup template.",
    bestFor: ["developer tools", "hardware products", "fintech", "AI products", "B2B platforms"],
    typography: {
      display: { family: "Instrument Sans", weights: [500, 600, 700], fallback: "system-ui, sans-serif" },
      body: { family: "Instrument Sans", weights: [400, 500], fallback: "system-ui, sans-serif" },
      mono: { family: "JetBrains Mono", weights: [400, 500], fallback: "monospace" },
      scale: { hero: "clamp(2.5rem, 5.5vw, 4.5rem)", h2: "clamp(1.75rem, 3vw, 2.5rem)", body: "1rem", small: "0.8125rem" },
      details: "Tight display tracking (-0.02em). Monospace for data, specs, and labels. Numbers always tabular."
    },
    palette: {
      background: "#0a0c10",
      surface: "#12151b",
      text: "#e8eaed",
      textMuted: "#828a96",
      accent: "#4f7fff",
      line: "rgba(232, 234, 237, 0.08)",
      notes: "Cool graphite, one precise blue or green accent. Accent means 'interactive or important', nothing else."
    },
    motion: {
      character: "Instant and mechanical. Feedback, not theater.",
      easing: "cubic-bezier(0.2, 0, 0, 1)",
      duration: "0.15s–0.4s. Longer only for hero diagrams.",
      signature: ["animated diagrams/schematics drawing in", "number counters with tabular figures", "border glow on hover (1px, subtle)", "terminal/code blocks typing in"]
    },
    imagery: "Product UI screenshots in device-true frames, technical diagrams, macro hardware shots. No stock humans high-fiving.",
    signatureDetails: [
      "Monospace metadata labels (v2.4.1, 99.99%, <12ms)",
      "Hairline-bordered spec tables",
      "Subtle dot-grid or blueprint background patterns",
      "Diagram-first storytelling instead of icon triplets"
    ],
    avoid: ["three-card feature grids with icons in circles", "purple-to-blue gradients", "glassmorphism panels", "marketing superlatives without numbers"]
  },
  {
    id: "gallery-white",
    name: "Gallery White",
    summary:
      "Museum hang. Vast white space, small precise labels, art centered and unbothered. The interface disappears.",
    bestFor: ["artists", "galleries", "photographers", "furniture/objects", "premium portfolios"],
    typography: {
      display: { family: "EB Garamond", weights: [400, 500], fallback: "Georgia, serif" },
      body: { family: "Inter", weights: [400, 500], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(2rem, 4.5vw, 3.75rem)", h2: "clamp(1.5rem, 2.5vw, 2.25rem)", body: "1rem", small: "0.75rem" },
      details: "Modest display sizes — the work is the hero, not the type. Caption-style labels in small sizes with wide margins."
    },
    palette: {
      background: "#fcfcfa",
      surface: "#ffffff",
      text: "#1a1a18",
      textMuted: "#8f8f8a",
      accent: "#1a1a18",
      line: "rgba(26, 26, 24, 0.1)",
      notes: "Gallery white, ink text. No accent color at all — hierarchy through space and size only. Links underline."
    },
    motion: {
      character: "Barely there. Slow fades like lights coming up on a piece.",
      easing: "cubic-bezier(0.33, 1, 0.68, 1)",
      duration: "0.8s–1.2s fades, no movement on hover except opacity",
      signature: ["pure opacity fades (no translate)", "image crossfades in slideshows", "caption fade-ins after image settles", "smooth anchor scrolling"]
    },
    imagery: "The work itself, professionally shot, on neutral backgrounds, with true color. One image per viewport moment.",
    signatureDetails: [
      "One artwork/product per screen with museum-label caption",
      "Massive margins (20vw+ on wide screens)",
      "Numbered index navigation (works as a list)",
      "No decorative elements whatsoever"
    ],
    avoid: ["backgrounds behind images", "hover zoom effects on artwork", "grids that crop the work", "any color that competes"]
  },
  {
    id: "retro-editorial",
    name: "Retro Editorial",
    summary:
      "70s/90s magazine energy modernized. Expressive serif + grotesque clash, warm paper tones, playful but typeset with rigor.",
    bestFor: ["magazines & blogs", "coffee brands", "record shops", "indie studios", "cultural events"],
    typography: {
      display: { family: "DM Serif Display", weights: [400], fallback: "Georgia, serif" },
      body: { family: "DM Sans", weights: [400, 500, 700], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(3rem, 8vw, 6.5rem)", h2: "clamp(2rem, 4vw, 3.5rem)", body: "1.0625rem", small: "0.875rem" },
      details: "Serif display with occasional italic emphasis words. Pull quotes oversized. Drop caps welcome in long-form."
    },
    palette: {
      background: "#f5ecdf",
      surface: "#fdf8ef",
      text: "#221d16",
      textMuted: "#6f645c",
      accent: "#c8502e",
      line: "rgba(34, 29, 22, 0.2)",
      notes: "Aged paper, ink brown-black, burnt orange / mustard / forest accents. Feels printed, not lit."
    },
    motion: {
      character: "Playful but page-like. Things flip, slide, and settle like paper.",
      easing: "cubic-bezier(0.34, 1.3, 0.64, 1)",
      duration: "0.5s–0.8s, small overshoot allowed",
      signature: ["headline words sliding up with slight overshoot", "sticker/stamp elements rotating in", "image tilt correction on reveal (2deg to 0)", "underline squiggle draw-ins"]
    },
    imagery: "Warm film-look photography, halftone treatments, archival material mixed with new shots.",
    signatureDetails: [
      "Pull quotes at 2x body scale with oversized quotation marks",
      "Category tags styled as printed labels",
      "Column-based article layouts (2-col on desktop)",
      "Slight rotation (-1 to 2deg) on decorative elements only"
    ],
    avoid: ["neon colors", "dark mode", "corporate stock photos", "flat minimalism that kills the warmth"]
  },
  {
    id: "monochrome-fashion",
    name: "Monochrome Fashion",
    summary:
      "Stark black-and-white runway energy. Extreme type scale contrast, images treated as campaigns, navigation as styling.",
    bestFor: ["fashion labels", "models/agencies", "beauty brands", "luxury e-commerce", "lookbooks"],
    typography: {
      display: { family: "Playfair Display", weights: [400, 500, 700], fallback: "Didot, Georgia, serif" },
      body: { family: "Karla", weights: [300, 400, 500], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(3.5rem, 10vw, 9rem)", h2: "clamp(2.25rem, 5vw, 4.5rem)", body: "0.9375rem", small: "0.6875rem" },
      details: "High-contrast Didone display. Tiny letterspaced caps for everything functional (nav, buttons, labels)."
    },
    palette: {
      background: "#ffffff",
      surface: "#f6f6f6",
      text: "#000000",
      textMuted: "#767676",
      accent: "#000000",
      line: "#000000",
      notes: "Pure white, pure black. No accent color — contrast IS the color. Occasional single-image color moment for shock."
    },
    motion: {
      character: "Sharp entrances, editorial pacing. Like turning lookbook pages.",
      easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      duration: "0.6s–0.9s",
      signature: ["full-image page transitions (curtain wipes)", "letter-by-letter headline reveals", "hover swapping product/look images instantly", "vertical text elements"]
    },
    imagery: "Campaign photography with attitude. Full-bleed portrait crops, high contrast, lots of negative space around subjects.",
    signatureDetails: [
      "Vertical rotated text labels along viewport edges",
      "Image pairs: full-body + detail crop side by side",
      "Nav as tiny caps spread across the full top edge",
      "Black 1px page frame/border on desktop"
    ],
    avoid: ["color palettes", "rounded corners", "friendly copy", "busy layouts", "visible UI chrome"]
  },
  {
    id: "craftsman-trust",
    name: "Craftsman Trust",
    summary:
      "Light, credible, quietly refined — the local trades business elevated. Clean steel-blue neutrals, deep navy anchors, one metallic accent. Trust through cleanliness and proof of work.",
    bestFor: ["glass companies", "contractors & remodeling", "roofing & construction", "fabrication shops", "electricians & plumbers", "local trade services"],
    typography: {
      display: { family: "Cormorant Garamond", weights: [400, 500, 600], fallback: "Georgia, serif" },
      body: { family: "Inter", weights: [400, 500, 600], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(2.5rem, 6vw, 4.75rem)", h2: "clamp(1.875rem, 3.5vw, 3rem)", body: "1rem", small: "0.8125rem" },
      details: "Elegant serif display gives a family trade dignity — it reads 'established craft', not 'cheap flyer'. Body stays utilitarian and highly legible."
    },
    palette: {
      background: "#fafbfc",
      surface: "#f3f5f8",
      text: "#0f1626",
      textMuted: "#4a5568",
      accent: "#c19a3e",
      line: "#dde3ea",
      notes: "Cool light neutrals with a deep navy (#15264d) for heroes/footers and an aged-gold accent reserved for CTAs and key numbers. Feels like a clean workshop, not a corporate site."
    },
    motion: {
      character: "Modest and functional. Motion confirms quality; it never performs.",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      duration: "0.5s–0.8s reveals, 0.25s hovers",
      signature: ["simple fade-up reveals", "before/after image comparison sliders", "counters for years-in-business and projects completed", "gallery lightbox with smooth zoom"]
    },
    imagery: "Real project photography only: finished installations, before/after pairs, craftsmen at work, material close-ups (glass edges, welds, joinery). Stock is a last resort and must look documentary.",
    signatureDetails: [
      "Credential strip typeset with dignity: licensed · insured · years · service area",
      "Prominent request-a-quote form reachable within one scroll",
      "Persistent contact actions (call / WhatsApp float) styled to match, never garish",
      "Dark navy hero and footer bookending a light page",
      "Bilingual EN/ES toggle pattern when the market needs it"
    ],
    avoid: ["dark moody full-page palettes", "luxury aloofness that hides prices/contact", "stock handshake photos", "aggressive urgency banners", "icon-circle service grids"]
  },
  {
    id: "care-trust",
    name: "Care Trust",
    summary:
      "Warm clinical calm. White and soft teal, generous rounding, plain-spoken copy. Credible medicine that still feels human and unhurried.",
    bestFor: ["family health clinics", "dental practices", "therapy & counseling", "veterinary clinics", "pharmacies", "senior care", "wellness medical"],
    typography: {
      display: { family: "Merriweather", weights: [700, 900], fallback: "Georgia, serif" },
      body: { family: "Inter", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(2.25rem, 5vw, 4rem)", h2: "clamp(1.625rem, 3vw, 2.5rem)", body: "1.0625rem", small: "0.875rem" },
      details: "Sturdy serif display projects institutional credibility; Inter body at a generous size keeps everything readable for every age. Sentence case throughout."
    },
    palette: {
      background: "#ffffff",
      surface: "#f7fafa",
      text: "#1a2e2d",
      textMuted: "#4a6663",
      accent: "#0f6b5c",
      line: "#e0ecea",
      notes: "White with pale-teal surfaces and a deep teal accent for actions and headings. Soft radii (6–24px) and soft shadows are correct here — this style rounds where others sharpen. Red only for genuine emergencies."
    },
    motion: {
      character: "Gentle and brief. Nothing between the patient and the appointment button.",
      easing: "cubic-bezier(0.33, 1, 0.68, 1)",
      duration: "0.4s–0.6s fade-ups, instant functional feedback",
      signature: ["soft fade-up reveals", "accordion expansions for services/FAQs", "subtle count-ups for stats (patients served, years)", "sticky appointment CTA on mobile"]
    },
    imagery: "Real staff and facility photos in soft daylight; genuine, diverse patients and families. Never stethoscope-on-desk clichés or over-retouched stock smiles.",
    signatureDetails: [
      "Rounded cards with soft shadows — differentiated by content, never three identical",
      "Provider profiles with photo, credentials, languages spoken",
      "Transparent pricing/insurance/membership blocks",
      "Appointment CTA visible in every viewport (header + section-level)",
      "Hours, locations, and phone answered within one glance"
    ],
    avoid: ["dark mode", "edgy or condensed display type", "alarm-red anywhere non-emergency", "medical stock clichés", "small text or low contrast", "clever copy where clarity is needed"]
  },
  {
    id: "ivory-elegance",
    name: "Ivory Elegance",
    summary:
      "Light-mode luxury. Ivory and warm white, serif grace, champagne-gold hairlines. The bright, airy counterpart to Editorial Luxury — celebration in daylight.",
    bestFor: ["event venues (light/daytime)", "bridal & weddings", "boutique hotels", "salons & spas", "patisseries & fine dining", "florists"],
    typography: {
      display: { family: "Cormorant Garamond", weights: [300, 400, 500], fallback: "Georgia, serif" },
      body: { family: "Figtree", weights: [300, 400, 500], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(2.75rem, 7vw, 6rem)", h2: "clamp(2rem, 4vw, 3.25rem)", body: "1.0625rem", small: "0.8125rem" },
      details: "Light-weight serif display with occasional italics for emotional words. Airy letterspaced uppercase eyebrows. Everything breathes."
    },
    palette: {
      background: "#fdfcf9",
      surface: "#ffffff",
      text: "#2b2723",
      textMuted: "#8c8378",
      accent: "#b98a4e",
      line: "rgba(43, 39, 35, 0.14)",
      notes: "Warm ivory, soft white surfaces, champagne gold as hairlines and small accents only. Shadows nearly invisible; separation comes from tone and space."
    },
    motion: {
      character: "Weightless and graceful. Everything floats up softly, like daylight filling a room.",
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      duration: "0.8s–1.2s reveals, 0.3s hovers",
      signature: ["soft fade-up reveals with generous stagger", "slow ken-burns drift on photography", "gold hairline draw-ins under headings", "gentle crossfade galleries"]
    },
    imagery: "Bright, airy photography: daylight interiors, florals, table settings, candid celebration moments. Warm consistent grade; overexposed-light aesthetic welcome.",
    signatureDetails: [
      "Champagne-gold hairline rules and fine borders",
      "Italic serif accent words inside headlines",
      "Vast white space — sections feel like gallery rooms",
      "Direct booking actions (WhatsApp/reservation form) styled with restraint"
    ],
    avoid: ["dark backgrounds", "heavy shadows or bold borders", "saturated colors", "dense layouts", "corporate sans-serif coldness"]
  },
  {
    id: "appetite-bold",
    name: "Appetite Bold",
    summary:
      "Hunger-first design. Massive condensed dish names, chile-red heat, food photography shot close enough to smell. Menus as typography, ordering one tap away.",
    bestFor: ["restaurants", "taquerías & food trucks", "cafés & bakeries", "cantinas & bars", "catering", "ghost kitchens"],
    typography: {
      display: { family: "Anton", weights: [400], fallback: "Impact, sans-serif" },
      body: { family: "Hanken Grotesk", weights: [400, 500, 700], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(3rem, 9vw, 7.5rem)", h2: "clamp(2rem, 5vw, 4rem)", body: "1.0625rem", small: "0.875rem" },
      details: "Heavy condensed display in uppercase for dish names and section heads. Prices set honestly in tabular figures, never hidden or tiny."
    },
    palette: {
      background: "#fff8f0",
      surface: "#ffffff",
      text: "#221108",
      textMuted: "#7a6a58",
      accent: "#d62815",
      line: "rgba(34, 17, 8, 0.14)",
      notes: "Warm cream base so food photography carries the color; chile red reserved for CTAs, prices worth shouting, and one hot moment per viewport. Appetite lives in the photos, not in painted backgrounds."
    },
    motion: {
      character: "Snappy and appetizing — quick like service, never sluggish.",
      easing: "cubic-bezier(0.34, 1.2, 0.64, 1)",
      duration: "0.4s–0.6s reveals, 0.2s hovers",
      signature: ["dish images popping in with slight overshoot", "menu marquee strips (SPECIALS · TACOS · AL PASTOR)", "price counters ticking on reveal", "hover lifting dish photos with a warm shadow"]
    },
    imagery: "Extreme close-ups: steam, cheese pulls, char marks, hands assembling. Saturated warm grade, shallow depth. Never sterile stock food on white.",
    signatureDetails: [
      "Menu sections as typographic index lists — dish name huge, description one vivid line, price aligned right",
      "Marquee strip of specials or signature dishes between sections",
      "One-tap ordering: WhatsApp/phone/delivery links always in reach",
      "Hours and location answered within the first two viewports"
    ],
    avoid: ["desaturated moody grades on food", "tiny menu PDFs", "hidden prices", "stocky overhead flat-lays that look like ads", "elegant whispering type — food shouts"]
  },
  {
    id: "estate-serif",
    name: "Estate Serif",
    summary:
      "Grounded property confidence. Warm off-white, deep forest green, composed serif headlines over golden-hour photography. Specs typeset like a fine brochure.",
    bestFor: ["real estate agents", "property developments", "land sales", "vacation rentals", "property management", "architecture-led builders"],
    typography: {
      display: { family: "Lora", weights: [500, 600], fallback: "Georgia, serif" },
      body: { family: "Public Sans", weights: [400, 500], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(2.5rem, 6vw, 4.75rem)", h2: "clamp(1.875rem, 3.5vw, 3rem)", body: "1.0625rem", small: "0.8125rem" },
      details: "Composed serif display — assured, never flowery. Spec numbers (m², beds, price) in tabular figures at generous size; they ARE the copy."
    },
    palette: {
      background: "#f8f7f4",
      surface: "#ffffff",
      text: "#22261f",
      textMuted: "#6e7265",
      accent: "#37503d",
      line: "rgba(34, 38, 31, 0.13)",
      notes: "Warm paper white with deep forest green — land, growth, permanence. Green for CTAs and key figures only; photography supplies warmth (golden hour, wood, stone)."
    },
    motion: {
      character: "Composed and assured, like walking a property at ease.",
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      duration: "0.7s–1s reveals, 0.3s hovers",
      signature: ["slow ken-burns drift on property wides", "spec counters (m², acres, year) counting up on reveal", "listing cards lifting gently on hover", "map pins dropping in sequence"]
    },
    imagery: "Golden-hour exteriors, drone wides establishing the land, bright natural interiors. Consistent warm grade across every listing — mixed grades read as a cheap portal.",
    signatureDetails: [
      "Spec strips typeset finely: 3 bed · 2 bath · 240 m² · [price]",
      "Featured listing treated editorially at full width; secondary listings differentiated smaller",
      "Location/map blocks with real neighborhood context",
      "Financing/process explainer that removes first-timer fear"
    ],
    avoid: ["portal-style cramped listing grids", "watermarked photos", "red urgency banners", "gradient overlays on property photos", "generic skyline stock"]
  },
  {
    id: "iron-grit",
    name: "Iron Grit",
    summary:
      "Charcoal, chalk, and one high-vis accent. Condensed type that hits like a plate slam, honest pricing, schedules you can read mid-workout.",
    bestFor: ["gyms & crossfit boxes", "martial arts academies", "personal trainers", "barbershops", "tattoo studios", "boxing clubs"],
    typography: {
      display: { family: "Oswald", weights: [500, 700], fallback: "Arial Narrow, sans-serif" },
      body: { family: "Barlow", weights: [400, 500, 600], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(3rem, 10vw, 8.5rem)", h2: "clamp(2rem, 5vw, 4rem)", body: "1rem", small: "0.8125rem" },
      details: "Condensed uppercase display with tight tracking. Numbers oversized everywhere — class times, prices, PRs. Body copy short and direct."
    },
    palette: {
      background: "#0c0c0d",
      surface: "#151517",
      text: "#f2f2f0",
      textMuted: "#8f8f8a",
      accent: "#f5d90a",
      line: "rgba(242, 242, 240, 0.12)",
      notes: "Near-black charcoal with high-vis yellow — gym tape and barbell plates. Accent marks action and numbers only. Grain and grit welcome; polish is suspicious here."
    },
    motion: {
      character: "Aggressive and immediate. Elements stamp in; nothing floats.",
      easing: "cubic-bezier(0.87, 0, 0.13, 1)",
      duration: "0.3s–0.5s, hard stops",
      signature: ["stat counters slamming to their values (members, classes/week, years)", "marquee strips (NO EXCUSES · [discipline] · EST. [year])", "schedule rows highlighting on hover", "image reveals with hard clip-path wipes"]
    },
    imagery: "High-contrast training shots mid-effort: chalk clouds, straining faces, worn equipment. Gritty grade — desaturated with the accent color popping. Real members, never fitness stock models.",
    signatureDetails: [
      "Schedule tables readable at arm's length — big time slots, clear days",
      "Straight-talk pricing: monthly rate huge, no asterisk games",
      "Coach/staff profiles with real credentials and fight/comp records",
      "Free-trial or drop-in CTA persistent throughout"
    ],
    avoid: ["inspirational-quote overlays", "lens-flared stock athletes", "soft rounded friendliness", "hidden pricing", "cluttered supplement-store energy"]
  },
  {
    id: "counsel-classic",
    name: "Counsel Classic",
    summary:
      "Quiet authority. Navy ink on paper white, a single serif voice, credentials stated precisely. Design that feels like sound advice.",
    bestFor: ["law firms", "accounting & tax", "insurance agencies", "notaries", "financial advisors", "business consultants"],
    typography: {
      display: { family: "Source Serif 4", weights: [500, 600], fallback: "Georgia, serif" },
      body: { family: "Source Sans 3", weights: [400, 500, 600], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(2.25rem, 5vw, 4rem)", h2: "clamp(1.625rem, 3vw, 2.5rem)", body: "1.0625rem", small: "0.875rem" },
      details: "Serif display at restrained sizes — authority through precision, not scale. Sentence case. Generous body leading for dense subject matter."
    },
    palette: {
      background: "#fcfcfb",
      surface: "#f4f4f1",
      text: "#1c2530",
      textMuted: "#5a6472",
      accent: "#123a63",
      line: "#dfe2e6",
      notes: "Paper white and deep navy — the palette of contracts and letterhead. No second accent. Sharp corners (2px radius max); softness undermines the message."
    },
    motion: {
      character: "Nearly still. Fast, precise, functional — like a well-run office.",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      duration: "0.25s–0.45s, no theatrics",
      signature: ["instant-feeling fades", "underline draw-ins on practice-area links", "subtle count-ups for years/cases (only if real)", "accordion expansions for process/FAQ"]
    },
    imagery: "Real attorneys and offices in dignified daylight, city context, subtle document/desk details. Formal but human — clients hire people. Never gavel-and-scales clichés.",
    signatureDetails: [
      "Practice areas as a numbered index list, each with one plain-language sentence",
      "Attorney/partner profiles: photo, bar admissions, education, one human line",
      "Results stated carefully with substantiation or omitted ([TO CONFIRM] discipline is legal-critical)",
      "Consultation CTA with response-time promise; required disclaimers typeset cleanly in the footer"
    ],
    avoid: ["gavels, scales, marble columns", "aggressive win-rate claims", "stock handshakes", "dark power-suit drama", "urgency tactics — trust is the product"]
  },
  {
    id: "showroom-drive",
    name: "Showroom Drive",
    summary:
      "Dark showroom gloss with a headlight-orange accent. Condensed automotive type, spec strips like a dashboard, inventory that scrolls like a lot walk.",
    bestFor: ["car dealerships", "auto detailing", "mechanics & performance shops", "motorcycle dealers", "car rental", "tire & wheel shops"],
    typography: {
      display: { family: "Saira Condensed", weights: [600, 700], fallback: "Arial Narrow, sans-serif" },
      body: { family: "Saira", weights: [400, 500], fallback: "system-ui, sans-serif" },
      scale: { hero: "clamp(2.75rem, 8vw, 6.5rem)", h2: "clamp(2rem, 4.5vw, 3.5rem)", body: "1rem", small: "0.8125rem" },
      details: "Condensed display with slight forward lean allowed on labels. Specs and prices in tabular figures; model names uppercase."
    },
    palette: {
      background: "#0e1116",
      surface: "#171c23",
      text: "#eef1f4",
      textMuted: "#8a93a0",
      accent: "#ff6a2b",
      line: "rgba(238, 241, 244, 0.1)",
      notes: "Graphite showroom dark; signal orange for CTAs, prices, and availability badges. Gloss comes from photography reflections, not CSS shine effects."
    },
    motion: {
      character: "Torque-y: fast starts, smooth finishes. Horizontal energy.",
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      duration: "0.4s–0.7s",
      signature: ["inventory strips scrolling horizontally with snap", "spec counters (hp · km · year) ticking up", "before/after detailing comparison sliders", "vehicle cards sliding in from the side"]
    },
    imagery: "3/4-angle hero shots with clean reflections, detail macros (wheels, stitching, paint beads), honest garage action for service shops. One consistent dark grade — mixed lighting reads as a used-car aggregator.",
    signatureDetails: [
      "Spec strips per vehicle: year · km · transmission · price — scannable in one glance",
      "Before/after sliders for detailing/bodywork proof",
      "Financing/trade-in explainer removing purchase friction",
      "WhatsApp/call CTA on every vehicle card, not just the header"
    ],
    avoid: ["red SALE starbursts", "watermarked inventory photos", "chrome/carbon texture backgrounds", "lens-flare gloss effects", "cluttered badge walls"]
  }
];

export function getStyle(id) {
  return STYLES.find((s) => s.id === id) || null;
}

export function listStyles() {
  return STYLES.map(({ id, name, summary, bestFor }) => ({ id, name, summary, bestFor }));
}
