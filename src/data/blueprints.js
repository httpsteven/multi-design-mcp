/**
 * Page blueprints: section-by-section narrative structures per page type.
 * Each section carries a purpose and copywriting guidance so generated
 * pages tell a story instead of stacking template blocks.
 */

export const BLUEPRINTS = {
  home: {
    ctaStrategy: "Three placements: nav CTA always visible; mid-page CTA after the strongest proof section; full emotional CTA at the bottom. One action repeated — never competing actions.",
    name: "Home / Landing",
    narrative: "Seduce, prove, invite. The visitor should feel the brand before reading a single feature.",
    sections: [
      { id: "hero", name: "Impactful Hero", purpose: "Instant emotional positioning. One idea, stated with total confidence.", copy: "One headline under 10 words that could belong to no other business. Optional 1-line subcopy. Single CTA." },
      { id: "presentation", name: "Aspirational Presentation", purpose: "Introduce who this is for and what it feels like — not a feature list.", copy: "2–3 short paragraphs of editorial voice. Write to one reader, not a market segment." },
      { id: "gallery", name: "Curated Gallery / Showcase", purpose: "Let the strongest visuals sell. Asymmetric editorial layout.", copy: "Minimal captions. Let images breathe; caption only what adds meaning." },
      { id: "offer", name: "What We Offer / Event Types / Services", purpose: "Concrete offerings, each treated as its own small story — never three equal cards.", copy: "Each offering gets a specific name, one vivid sentence, and a real detail that proves expertise." },
      { id: "differentiators", name: "Differentiators", purpose: "Why here and not anywhere else. Specifics beat adjectives.", copy: "Numbers, names, materials, capacities, awards. 'Ceilings of 8 meters' beats 'spacious'." },
      { id: "experience", name: "Experience & Atmosphere", purpose: "Sensory storytelling section, often sticky/scroll-driven.", copy: "Present tense, second person. Walk the reader through the moment." },
      { id: "proof", name: "Social Proof", purpose: "Substantiated reputation only — real quotes, real names/events, real ratings.", copy: "Short verbatim quotes. Never invent testimonials; omit the section if unproven." },
      { id: "faq", name: "FAQs", purpose: "Remove friction from the decision. Answer the real objections.", copy: "Direct questions in the customer's words, confident concise answers." },
      { id: "cta", name: "Main CTA / Booking", purpose: "The one action. Full emotional weight of the page lands here.", copy: "Invitation, not pressure. Restate the aspiration in one line, then the action." },
      { id: "footer", name: "Premium Footer", purpose: "Close with composure: contact, location, hours, social, legal.", copy: "Quiet, well-typeset utility. No marketing copy." }
    ]
  },
  about: {
    name: "About / Story",
    narrative: "Origin, conviction, people. Make the reader trust the humans behind the brand.",
    sections: [
      { id: "hero", name: "Statement Hero", purpose: "The brand's core belief as a headline.", copy: "A conviction, not a welcome message. 'We believe…' energy without the cliché phrasing." },
      { id: "story", name: "Origin Story", purpose: "How it started, told with specifics (year, place, first client, first mistake).", copy: "Narrative prose, 3–5 short paragraphs. Real details create trust." },
      { id: "values", name: "Principles", purpose: "How the team makes decisions — shown through examples, not value-words.", copy: "Each principle: short name + one sentence showing it in action." },
      { id: "team", name: "People", purpose: "Faces and roles of who the client will actually deal with.", copy: "Name, role, one human line each. Skip if no real photos exist." },
      { id: "cta", name: "Bridge CTA", purpose: "Route to contact or work.", copy: "One warm line + action." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  services: {
    name: "Services / Offerings",
    narrative: "Depth over breadth. Each service is a chapter with its own proof.",
    sections: [
      { id: "hero", name: "Category Hero", purpose: "Frame the full offering in one confident line.", copy: "Headline + one-line promise of outcome." },
      { id: "service-chapters", name: "Service Chapters", purpose: "One editorial block per service: image, story, deliverables, proof point. Alternating layouts.", copy: "Specific scope, real process detail, one differentiator per service." },
      { id: "process", name: "How It Works", purpose: "Reduce uncertainty with a clear, numbered process.", copy: "3–5 steps, each named like a phase, one sentence each." },
      { id: "proof", name: "Selected Results / Clients", purpose: "Evidence layer.", copy: "Real names or metrics only." },
      { id: "cta", name: "Engagement CTA", purpose: "Start the conversation.", copy: "Low-friction invite: 'Tell us about your event/project'." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  gallery: {
    name: "Gallery / Portfolio",
    narrative: "The work speaks; the interface whispers.",
    sections: [
      { id: "hero", name: "Minimal Header", purpose: "Title and framing line only — get out of the way fast.", copy: "2–6 words + optional one-liner." },
      { id: "collections", name: "Curated Collections", purpose: "Grouped by story (event type, project, season) rather than dumped in one grid.", copy: "Collection titles + one-line context. Individual captions only when they add meaning." },
      { id: "feature", name: "Featured Story", purpose: "One project/event told in depth: sequence of images with narrative.", copy: "Short present-tense narration between image groups." },
      { id: "cta", name: "Closing CTA", purpose: "Convert inspiration into inquiry.", copy: "'Imagine yours' energy, one action." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  contact: {
    name: "Contact / Booking",
    narrative: "Make reaching out feel easy, personal, and certain.",
    sections: [
      { id: "hero", name: "Warm Header", purpose: "Reassure: they'll talk to a person, quickly.", copy: "Headline + expected response time." },
      { id: "form", name: "Inquiry Form", purpose: "Minimum viable fields; every extra field costs conversions.", copy: "Labels in the brand voice. Event date/type selectors if relevant." },
      { id: "direct", name: "Direct Channels", purpose: "Phone, WhatsApp, email, social — some people will never fill a form.", copy: "Plain, immediate." },
      { id: "location", name: "Location & Visit", purpose: "Map, address, parking/transport notes, visiting hours.", copy: "Practical and precise." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  pricing: {
    ctaStrategy: "Per-package inquiry CTAs (equal visual weight — the packages differentiate, not the buttons) plus one bespoke-option CTA. Quote CTA repeats at the bottom after FAQs defuse objections.",
    name: "Pricing / Packages",
    narrative: "Clarity builds trust; framing preserves premium perception.",
    sections: [
      { id: "hero", name: "Value Framing Hero", purpose: "Anchor on what's included and the experience, before numbers.", copy: "One line on what every engagement includes." },
      { id: "packages", name: "Packages", purpose: "2–4 clearly differentiated tiers, described editorially — not a SaaS pricing table with checkmark rows.", copy: "Each package named evocatively, described in prose + short inclusion list." },
      { id: "custom", name: "Bespoke Option", purpose: "Signal flexibility for high-value clients.", copy: "'Every event is different' — invite conversation." },
      { id: "faq", name: "Pricing FAQs", purpose: "Deposits, minimums, seasons, cancellation.", copy: "Honest and direct." },
      { id: "cta", name: "Quote CTA", purpose: "Ask for the inquiry.", copy: "One action, low friction." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  faq: {
    name: "FAQ",
    narrative: "Every answer removes a reason not to book.",
    sections: [
      { id: "hero", name: "Simple Header", purpose: "Title + reassurance that unanswered questions are welcome.", copy: "Short." },
      { id: "groups", name: "Grouped Questions", purpose: "Cluster by theme (booking, logistics, catering, payments…). Accordion or index layout per style.", copy: "Questions phrased as customers ask them. Answers confident, specific, 2–4 sentences." },
      { id: "cta", name: "Still Have Questions CTA", purpose: "Human fallback.", copy: "Direct channel + response time." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  "blog-index": {
    name: "Blog / Journal Index",
    narrative: "An edited publication, not a content dump.",
    sections: [
      { id: "hero", name: "Publication Masthead", purpose: "Name the journal; set its editorial identity.", copy: "Journal name + one-line editorial mission." },
      { id: "featured", name: "Featured Story", purpose: "One lead story treated with magazine-cover prominence.", copy: "Full headline + standfirst." },
      { id: "stream", name: "Article Stream", purpose: "Editorial list/grid with strong typographic hierarchy, dates, categories.", copy: "Real headlines (specific, curiosity-driven), no 'Top 5 tips' filler." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  "blog-post": {
    name: "Blog / Article Page",
    narrative: "Long-form reading experience worth the reader's time.",
    sections: [
      { id: "header", name: "Article Header", purpose: "Headline, standfirst, byline, date, reading time, hero image.", copy: "Standfirst summarizes the payoff in one sentence." },
      { id: "body", name: "Article Body", purpose: "Measure-limited prose (~65ch), pull quotes, inline images with captions.", copy: "Subheads every 3–5 paragraphs. Concrete examples over abstractions." },
      { id: "related", name: "Related Reading", purpose: "Keep the reader in the publication.", copy: "2–3 hand-picked pieces." },
      { id: "cta", name: "Soft CTA", purpose: "Newsletter or contact, quiet.", copy: "One line, no popup energy." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  product: {
    name: "Product / Detail Page",
    narrative: "Desire first, specification second, confidence throughout.",
    sections: [
      { id: "hero", name: "Product Hero", purpose: "The product at its most desirable; name and one-line positioning.", copy: "Evocative but concrete. Price visible, not hidden." },
      { id: "story", name: "Design/Craft Story", purpose: "Why it exists and what makes it exceptional.", copy: "Materials, process, provenance — specifics." },
      { id: "details", name: "Details & Specs", purpose: "Complete practical information in a beautifully typeset table.", copy: "Dimensions, materials, care, delivery." },
      { id: "context", name: "In Context", purpose: "The product in use/space — lifestyle imagery.", copy: "Minimal caption support." },
      { id: "cta", name: "Purchase/Inquiry CTA", purpose: "Clear action + trust signals (shipping, returns, guarantee).", copy: "Direct." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  "case-study": {
    name: "Case Study",
    narrative: "Prove capability through one real story told with craft.",
    sections: [
      { id: "header", name: "Project Header", purpose: "Client, project, outcome-in-one-line, key metrics.", copy: "Result-first framing." },
      { id: "challenge", name: "The Brief / Challenge", purpose: "Stakes and constraints.", copy: "Honest about difficulty — it raises the win." },
      { id: "approach", name: "The Approach", purpose: "Decisions and craft, with visual evidence at each step.", copy: "Explain the why of 2–3 key decisions." },
      { id: "outcome", name: "The Outcome", purpose: "Results with numbers, quotes, or verifiable outcomes.", copy: "Client quote if real; metrics if measurable." },
      { id: "next", name: "Next Project / CTA", purpose: "Continue the journey.", copy: "Next case link + contact." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  team: {
    name: "Team / Providers / Staff",
    narrative: "People are the product. Make each person feel qualified, human, and approachable.",
    sections: [
      { id: "hero", name: "Team Framing Hero", purpose: "Why these people — one line on the shared standard or philosophy.", copy: "Headline about the team's craft/care standard, not 'Meet the team'." },
      { id: "directory", name: "Profiles Directory", purpose: "One profile block per person: photo, name, role, credentials, languages, one human detail. Layout differentiates seniority — never a uniform grid of equal cards.", copy: "Credentials stated precisely (titles, boards, years). One warm human line each. Real photos only — omit people without them." },
      { id: "approach", name: "How We Work", purpose: "The shared method or philosophy that makes the team more than individuals.", copy: "2–3 short paragraphs, concrete examples of the standard in action." },
      { id: "join", name: "Join / Careers Bridge", purpose: "Route talent to careers; signals a healthy team to clients too.", copy: "One line + link. Skip if not hiring." },
      { id: "cta", name: "Contact CTA", purpose: "Book/consult with the team.", copy: "Direct action referencing the people ('Talk to Dr. …'/'our team')." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  locations: {
    name: "Locations / Service Area",
    narrative: "Remove every practical doubt about where, when, and how to arrive or be served.",
    sections: [
      { id: "hero", name: "Coverage Hero", purpose: "Immediate answer: where we are / where we serve.", copy: "Headline naming the city/region. Subline with count of locations or service radius." },
      { id: "location-blocks", name: "Location Blocks", purpose: "One rich block per location: address, embedded map, hours, phone, parking/transport notes, photo of the actual place.", copy: "Precise and practical. Real photos of each location build enormous trust." },
      { id: "service-area", name: "Service Area", purpose: "For mobile/on-site businesses: list served cities/neighborhoods explicitly (also an SEO surface).", copy: "Named areas in natural prose or a typeset list — not a keyword dump." },
      { id: "visit", name: "Planning a Visit", purpose: "First-visit expectations: what to bring, where to check in, accessibility.", copy: "Warm, concrete, reassuring." },
      { id: "cta", name: "Directions / Contact CTA", purpose: "Get directions or call — one tap on mobile.", copy: "Action-first: 'Get directions', 'Call this location'." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  careers: {
    name: "Careers",
    narrative: "Sell the workplace with the same craft used to sell the product — honestly.",
    sections: [
      { id: "hero", name: "Why Work Here Hero", purpose: "The genuine reason someone good would choose this workplace.", copy: "Specific and honest — culture claims backed by real practices, not perk clichés." },
      { id: "culture", name: "Culture & Benefits", purpose: "How the place actually works: schedule, growth, benefits, values in action.", copy: "Concrete: real benefits, real numbers where possible. No ping-pong-table energy unless true." },
      { id: "roles", name: "Open Roles", purpose: "Current openings with title, location, type; graceful empty state when none.", copy: "Each role: one-line hook + link/apply action. Empty state invites spontaneous applications." },
      { id: "process", name: "Hiring Process", purpose: "Demystify: steps and timeline.", copy: "3–4 steps, expected duration, who they'll meet." },
      { id: "cta", name: "Apply CTA", purpose: "Frictionless application path.", copy: "Email or short form. State response time." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer.", copy: "Consistent with site." }
    ]
  },
  "landing-local-service": {
    ctaStrategy: "Capture in the hero (form/CTA above the fold), repeat after proof-of-work, close with the full-channel CTA. Mobile: sticky Call/WhatsApp bar carries the action everywhere.",
    name: "Local Service Landing (Lead-Gen)",
    narrative: "Prove capability fast, remove risk, capture the inquiry. Built to convert local searches into quotes/appointments — repeatable per city or per service for batch generation.",
    sections: [
      { id: "hero", name: "Offer Hero + Quote Form", purpose: "Service + area + credibility in one viewport, with the quote/booking form or CTA immediately present.", copy: "Headline: [service] in [area], stated with craft. Sub: one proof point (years/projects/rating). Form: minimum fields." },
      { id: "services", name: "Services Offered", purpose: "The concrete service list, each with a real detail proving expertise. Differentiated layout, not equal cards.", copy: "Named services with one vivid, specific line each (materials, methods, turnaround)." },
      { id: "proof-work", name: "Proof of Work", purpose: "Gallery/before-after of real projects — the conversion engine for trades.", copy: "Minimal captions: location, scope, timeframe." },
      { id: "credentials", name: "Credentials & Guarantees", purpose: "Risk removal: licensed, insured, warranty, guarantees, response time.", copy: "Facts typeset with dignity. Mark unverified items [TO CONFIRM]." },
      { id: "service-area", name: "Service Area", purpose: "Cities/neighborhoods served (trust + SEO).", copy: "Natural prose or clean list of named areas." },
      { id: "reviews", name: "Reviews", purpose: "Real review quotes with sources (Google, etc.). Omit if unverified.", copy: "Verbatim short quotes, reviewer first name, platform." },
      { id: "faq", name: "FAQs", purpose: "The 4–6 questions that precede every quote request.", copy: "Customer phrasing; confident, specific answers (pricing factors, timelines, process)." },
      { id: "cta", name: "Final Quote CTA", purpose: "Second capture point with all contact channels (form, call, WhatsApp).", copy: "Low friction, response-time promise." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer with full NAP (name, address, phone) for local SEO.", copy: "Consistent with site." }
    ]
  },
  menu: {
    ctaStrategy: "Order/reserve reachable from every scroll position: nav CTA, sticky mobile bar, and the dedicated order section. Hungry visitors do not hunt for buttons.",
    name: "Menu (Restaurant/Bar)",
    narrative: "The menu IS the marketing. Typography makes dishes desirable; ordering is never more than one tap away.",
    sections: [
      { id: "hero", name: "Compact Appetite Hero", purpose: "Signature dish or atmosphere shot with the menu immediately reachable — no long scroll to food.", copy: "Headline naming the house specialty or promise. Sub: hours open now / order channels." },
      { id: "menu-groups", name: "Menu Sections", purpose: "Grouped dishes (starters, mains, drinks…) as typographic index lists — dish name prominent, one vivid description line, honest price aligned right.", copy: "Descriptions sell with specifics (cut, preparation, origin), never adjective soup. Mark bestsellers/spicy/veg with restrained typographic markers, not icon clutter." },
      { id: "specials", name: "Specials / Signatures", purpose: "The 2–4 dishes that define the house, treated editorially with photography.", copy: "One short story line per dish — why it exists, what makes it theirs." },
      { id: "order", name: "Order / Reserve CTA", purpose: "Every ordering channel in one place: WhatsApp, phone, delivery platforms, reservation link.", copy: "Direct: 'Order for pickup', 'Reserve a table'. State wait/prep expectations if known." },
      { id: "practical", name: "Hours & Location", purpose: "Remove the two questions everyone has before coming.", copy: "Hours per day, address with map link, parking note." },
      { id: "footer", name: "Footer", purpose: "Standard premium footer with full NAP.", copy: "Consistent with site." }
    ]
  },
  "landing-campaign": {
    ctaStrategy: "Offer + action complete in the first viewport; single repeat at the capture section. Campaign pages get ONE action only — no nav distractions, no secondary CTAs.",
    name: "Campaign Landing (Single Offer)",
    narrative: "One offer, one audience, one action. Built for promos, packages, and seasonal pushes — repeatable per campaign for batch generation.",
    sections: [
      { id: "hero", name: "Offer Hero", purpose: "The offer stated completely in one viewport: what, for whom, until when, and the action.", copy: "Headline = the offer's payoff, not the business name. Real deadline/limit if one exists — never invent scarcity." },
      { id: "offer-details", name: "What's Included", purpose: "Exact contents of the package/promo, itemized with dignity — clarity sells premium offers.", copy: "Every inclusion concrete (hours, quantities, names). Price framing per the brand's positioning." },
      { id: "proof", name: "Proof", purpose: "Photos or quotes from previous instances of this exact offer (past quinceañeras, past details, past cohorts).", copy: "Minimal captions tying proof to the offer. Omit if unverified." },
      { id: "terms", name: "Terms & Fit", purpose: "Who it's for, dates, conditions — honest constraints build trust and filter fit.", copy: "Plain-language terms; mark unconfirmed details [TO CONFIRM]." },
      { id: "capture", name: "Claim / Booking Capture", purpose: "Minimum-friction capture: short form + WhatsApp deep link with the offer pre-filled.", copy: "Action names the offer ('Reserve the [package name]'). Response-time promise." },
      { id: "footer", name: "Minimal Footer", purpose: "Contact + legal only — campaign pages stay focused.", copy: "Tiny; link back to the main site." }
    ]
  },
  "coming-soon": {
    name: "Coming Soon / Teaser",
    narrative: "Scarcity and intrigue in a single viewport.",
    sections: [
      { id: "hero", name: "Teaser Statement", purpose: "Brand name, one intriguing line, launch timing.", copy: "Confident mystery — reveal little, promise much." },
      { id: "capture", name: "Early Access Capture", purpose: "Email capture with a reason to sign up.", copy: "What insiders get. One field, one button." },
      { id: "footer", name: "Minimal Footer", purpose: "Social + contact only.", copy: "Tiny." }
    ]
  }
};

export function getBlueprint(pageType) {
  return BLUEPRINTS[pageType] || null;
}

export function listBlueprints() {
  return Object.entries(BLUEPRINTS).map(([id, b]) => ({
    id,
    name: b.name,
    narrative: b.narrative,
    sectionCount: b.sections.length
  }));
}
