/**
 * Smoke test: spawns the server over stdio with a real MCP client
 * and exercises every tool.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, "..", "src", "index.js");

const client = new Client({ name: "smoke-test", version: "1.0.0" });
await client.connect(new StdioClientTransport({ command: "node", args: [serverPath] }));

let failures = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log(`  ok  ${name}`);
  } catch (err) {
    failures++;
    console.error(`FAIL  ${name}: ${err.message}`);
  }
}

function parse(res) {
  if (res.isError) throw new Error(res.content[0]?.text || "tool returned error");
  return JSON.parse(res.content[0].text);
}

const biz = {
  name: "Casa Vesperalta",
  industry: "event venue",
  description: "A restored 1900s hacienda hosting weddings and corporate events.",
  differentiators: ["8m ceilings", "capacity 350", "on-site catering"],
  accentColor: "#b98a4e"
};

await check("tools/list exposes all 14 tools", async () => {
  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  const expected = [
    "bootstrap_website", "compose_build_prompt", "create_design_system", "generate_variations",
    "get_design_style", "get_design_trends", "get_page_blueprint",
    "list_design_styles", "list_page_blueprints", "plan_site",
    "quality_standards", "recommend_stack", "recommend_style", "scaffold_page", "scaffold_site"
  ];
  for (const e of expected) if (!names.includes(e)) throw new Error(`missing tool ${e}`);
});

await check("list_design_styles returns 18 styles", async () => {
  const styles = parse(await client.callTool({ name: "list_design_styles", arguments: {} }));
  if (styles.length !== 18) throw new Error(`got ${styles.length}`);
  for (const id of ["craftsman-trust", "care-trust", "ivory-elegance", "appetite-bold", "estate-serif", "iron-grit", "counsel-classic", "showroom-drive"]) {
    if (!styles.some((s) => s.id === id)) throw new Error(`missing style ${id}`);
  }
});

await check("get_design_style returns full spec incl. composition", async () => {
  const s = parse(await client.callTool({ name: "get_design_style", arguments: { styleId: "editorial-luxury" } }));
  if (!s.typography || !s.palette || !s.motion) throw new Error("incomplete spec");
  if (s.composition?.hero?.variant !== "immersive") throw new Error("missing composition/hero variant");
  if (!s.compositionBrief?.includes("Immersive Media Hero")) throw new Error("missing composition brief");
});

await check("every style has a complete composition", async () => {
  const styles = parse(await client.callTool({ name: "list_design_styles", arguments: {} }));
  for (const { id } of styles) {
    const s = parse(await client.callTool({ name: "get_design_style", arguments: { styleId: id } }));
    const c = s.composition;
    if (!c || !c.nav?.variant || !c.hero?.variant || !c.gallery?.variant || !c.contentRotation?.length || !c.footer?.variant) {
      throw new Error(`style ${id} has incomplete composition`);
    }
  }
});

await check("get_design_style rejects bad id gracefully", async () => {
  const s = parse(await client.callTool({ name: "get_design_style", arguments: { styleId: "nope" } }));
  if (!s.error || !s.available) throw new Error("expected error payload with available ids");
});

await check("list_page_blueprints returns 18 blueprints", async () => {
  const b = parse(await client.callTool({ name: "list_page_blueprints", arguments: {} }));
  if (b.length !== 18) throw new Error(`got ${b.length}`);
  for (const id of ["team", "locations", "careers", "landing-local-service", "menu", "landing-campaign"]) {
    if (!b.some((x) => x.id === id)) throw new Error(`missing blueprint ${id}`);
  }
});

await check("get_page_blueprint(home) has 10 sections", async () => {
  const b = parse(await client.callTool({ name: "get_page_blueprint", arguments: { pageType: "home" } }));
  if (b.sections.length !== 10) throw new Error(`got ${b.sections.length}`);
});

await check("create_design_system applies brand accent override", async () => {
  const ds = parse(await client.callTool({ name: "create_design_system", arguments: { styleId: "editorial-luxury", brand: biz } }));
  if (!ds.cssVariables.includes("--color-accent: #b98a4e")) throw new Error("accent override not applied");
  if (!ds.fontImport.startsWith("https://fonts.googleapis.com")) throw new Error("bad font import");
});

await check("compose_build_prompt embeds tokens, anti-patterns, business", async () => {
  const res = await client.callTool({ name: "compose_build_prompt", arguments: { styleId: "art-deco-opulent", pageType: "home", business: biz } });
  const prompt = res.content[0].text;
  for (const needle of ["Casa Vesperalta", "--color-bg", "Forbidden Anti-Patterns", "Definition of Done", "8m ceilings", "Layout & Composition", "Ceremonial Framed Hero"]) {
    if (!prompt.includes(needle)) throw new Error(`prompt missing '${needle}'`);
  }
});

await check("plan_site returns per-page briefs + consistency rules", async () => {
  const plan = parse(await client.callTool({
    name: "plan_site",
    arguments: {
      styleId: "editorial-luxury",
      business: biz,
      pages: [
        { pageType: "home" },
        { pageType: "gallery" },
        { pageType: "pricing", notes: "packages named after rooms" },
        { pageType: "contact" }
      ]
    }
  }));
  if (plan.pages.length !== 4) throw new Error("wrong page count");
  if (!plan.pages[2].buildPrompt.includes("packages named after rooms")) throw new Error("page notes not threaded into brief");
  if (!plan.sharedDesignSystem.cssVariables) throw new Error("no shared design system");
  if (plan.consistencyRules.length < 5) throw new Error("missing consistency rules");
  // Ponytail economy: contract emitted ONCE; page briefs are compact deltas
  for (const needle of ["Shared Site Contract", "Mobile Mandate", "Code Economy", "--color-bg", "Forbidden Anti-Patterns"]) {
    if (!plan.sharedContract.includes(needle)) throw new Error(`shared contract missing '${needle}'`);
  }
  for (const p of plan.pages) {
    if (!p.buildPrompt.includes("inherits the **Shared Site Contract**")) throw new Error("page brief not compact");
    if (p.buildPrompt.includes("Mobile Mandate")) throw new Error("contract duplicated into page brief");
    if (p.buildPrompt.length > 5000) throw new Error(`compact brief too long: ${p.buildPrompt.length} chars`);
  }
});

await check("scaffold_page produces structured HTML: nav, hero variant, gallery, footer", async () => {
  const out = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "cinematic-noir", pageType: "home", business: biz } }));
  for (const needle of ["<!doctype html>", "--color-bg: #050505", "prefers-reduced-motion", "ScrollTrigger", "Casa Vesperalta",
    "nav--transparent-overlay", "hero--immersive", "hscroll", "footer--minimal-line", "picsum.photos", "REEMPLAZAR", "grayscale(1)"]) {
    if (!out.html.includes(needle)) throw new Error(`html missing '${needle}'`);
  }
  if (out.file !== "index.html") throw new Error(`unexpected filename ${out.file}`);
  if (out.composition?.hero !== "immersive") throw new Error("composition summary missing");
});

await check("scaffold split-form hero has a quote form; faq uses <details>", async () => {
  const glass = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "craftsman-trust", pageType: "landing-local-service", business: { name: "Vitrelora Glass Co." } } }));
  for (const needle of ["hero--split-form", "hero-panel", "<form", "Request a quote", "index-list", "gallery-asym"]) {
    if (!glass.html.includes(needle)) throw new Error(`glass html missing '${needle}'`);
  }
  const faq = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "care-trust", pageType: "faq", business: biz } }));
  if (!faq.html.includes("<details class=\"faq-item\"")) throw new Error("faq missing details accordion");
});

await check("quality_standards sections filter works", async () => {
  const all = parse(await client.callTool({ name: "quality_standards", arguments: {} }));
  if (!all.antiPatterns || !all.polishChecklist) throw new Error("missing sections in 'all'");
  const onlyMotion = parse(await client.callTool({ name: "quality_standards", arguments: { section: "motion" } }));
  if (!onlyMotion.motionRules || onlyMotion.antiPatterns) throw new Error("section filter broken");
});

await check("recommend_style ranks venue → editorial/deco styles", async () => {
  const rec = parse(await client.callTool({ name: "recommend_style", arguments: { industry: "event venue", mood: ["elegant", "warm"] } }));
  if (!rec.recommendations?.length) throw new Error("no recommendations");
});

await check("bilingual language threads into brief + scaffold lang attribute", async () => {
  const glass = { name: "Vitrelora Glass Co.", industry: "glass company", language: "bilingual en/es" };
  const res = await client.callTool({ name: "compose_build_prompt", arguments: { styleId: "craftsman-trust", pageType: "landing-local-service", business: glass } });
  const prompt = res.content[0].text;
  for (const needle of ["## Language", "BILINGUAL", "I18N", "Quote Form", "Credentials & Guarantees"]) {
    if (!prompt.includes(needle)) throw new Error(`prompt missing '${needle}'`);
  }
  const es = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "ivory-elegance", pageType: "home", business: { name: "Terraza Alborela", language: "es" } } }));
  if (!es.html.includes('<html lang="es">')) throw new Error("lang attribute not set to es");
});

await check("recommend_style matches healthcare and trades industries", async () => {
  const health = parse(await client.callTool({ name: "recommend_style", arguments: { industry: "family health clinic" } }));
  if (health.recommendations[0]?.id !== "care-trust") throw new Error(`health got ${health.recommendations[0]?.id}`);
  const glass = parse(await client.callTool({ name: "recommend_style", arguments: { industry: "glass company" } }));
  if (glass.recommendations[0]?.id !== "craftsman-trust") throw new Error(`glass got ${glass.recommendations[0]?.id}`);
});

await check("recommend_style matches the 5 new business verticals", async () => {
  const cases = [
    ["food truck", "appetite-bold"],
    ["law firm", "counsel-classic"],
    ["gym", "iron-grit"],
    ["property management", "estate-serif"],
    ["car dealership", "showroom-drive"]
  ];
  for (const [industry, want] of cases) {
    const r = parse(await client.callTool({ name: "recommend_style", arguments: { industry } }));
    if (r.recommendations[0]?.id !== want) throw new Error(`${industry} got ${r.recommendations[0]?.id}, want ${want}`);
  }
});

await check("bootstrap_website: one call, deterministic, full plan", async () => {
  const args = { business: { name: "Vitrelora Glass Co.", industry: "glass company", language: "bilingual en/es" } };
  const a = parse(await client.callTool({ name: "bootstrap_website", arguments: args }));
  const b = parse(await client.callTool({ name: "bootstrap_website", arguments: args }));
  if (a.style.chosen !== "craftsman-trust") throw new Error(`chose ${a.style.chosen}`);
  if (a.variation.seed !== b.variation.seed) throw new Error("seed not deterministic");
  if (a.variation.seedSource !== "derived from business name (deterministic)") throw new Error("wrong seed source");
  if (a.sitePlan.pages.length !== 5) throw new Error(`default sitemap has ${a.sitePlan.pages.length} pages`);
  if (!a.sitePlan.sharedContract.includes("Mobile Mandate")) throw new Error("shared contract incomplete");
  if (!a.sitePlan.pages[0].buildPrompt.includes("Page Structure")) throw new Error("page briefs incomplete");
  if (!a.workflow?.length) throw new Error("workflow missing");
  const other = parse(await client.callTool({ name: "bootstrap_website", arguments: { business: { name: "Casa Vesperalta", industry: "event venue" } } }));
  if (other.variation.seed === a.variation.seed) throw new Error("different businesses share a seed");
  const menu = parse(await client.callTool({ name: "bootstrap_website", arguments: { business: { name: "Taquería Solmarela", industry: "food truck" }, pages: [{ pageType: "home" }, { pageType: "menu" }] } }));
  if (menu.style.chosen !== "appetite-bold") throw new Error(`taquería chose ${menu.style.chosen}`);
  if (!menu.sitePlan.pages[1].buildPrompt.includes("Menu Sections")) throw new Error("menu blueprint not in brief");
});

await check("generate_variations is deterministic and distinct", async () => {
  const a = parse(await client.callTool({ name: "generate_variations", arguments: { styleId: "editorial-luxury", count: 4 } }));
  const b = parse(await client.callTool({ name: "generate_variations", arguments: { styleId: "editorial-luxury", count: 4 } }));
  if (JSON.stringify(a.variations) !== JSON.stringify(b.variations)) throw new Error("not deterministic");
  if (a.variations.length !== 4) throw new Error(`got ${a.variations.length} variations`);
  const keys = a.variations.map((v) => `${v.hero}|${v.gallery}|${v.flourishes.map((f) => f.id).join(",")}`);
  if (new Set(keys).size !== keys.length) throw new Error("variations not distinct");
  for (const v of a.variations) {
    if (v.flourishes.length < 2 || v.flourishes.length > 3) throw new Error("flourish count out of range");
  }
});

await check("variationSeed changes scaffold bones and embeds flourishes", async () => {
  const def = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "cinematic-noir", pageType: "home", business: biz } }));
  let variant = null;
  for (let seed = 1; seed <= 12; seed++) {
    const v = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "cinematic-noir", pageType: "home", business: biz, variationSeed: seed } }));
    if (v.composition.hero !== def.composition.hero) { variant = v; break; }
  }
  if (!variant) throw new Error("no seed produced an alternate hero in 12 tries");
  if (!variant.html.includes(`hero--${variant.composition.hero}`)) throw new Error("alternate hero not in markup");
  if (variant.composition.hero === "kinetic-type" && !variant.html.includes("visually-hidden")) throw new Error("kinetic hero missing accessible h1");
  if (!variant.composition.flourishes.length) throw new Error("variation carries no flourishes");
});

await check("variation directive appears in briefs; trends tool returns catalog", async () => {
  const res = await client.callTool({ name: "compose_build_prompt", arguments: { styleId: "editorial-luxury", pageType: "home", business: biz, variationSeed: 3 } });
  const prompt = res.content[0].text;
  for (const needle of ["Variation Directive (seed 3)", "Signature flourishes"]) {
    if (!prompt.includes(needle)) throw new Error(`brief missing '${needle}'`);
  }
  const trends = parse(await client.callTool({ name: "get_design_trends", arguments: {} }));
  if (!trends.trends?.some((t) => t.id === "kinetic-typography")) throw new Error("trends missing kinetic-typography");
  if (!trends.flourishLibrary?.["grain-overlay"]) throw new Error("flourish library missing");
});

await check("briefs carry the modern stack; scaffolds wire Lenis (except trust styles)", async () => {
  const res = await client.callTool({ name: "compose_build_prompt", arguments: { styleId: "editorial-luxury", pageType: "home", business: biz, variationSeed: 3 } });
  const prompt = res.content[0].text;
  for (const needle of ["Modern Stack", "SplitText", "Lenis"]) {
    if (!prompt.includes(needle)) throw new Error(`brief missing '${needle}'`);
  }
  const lux = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "editorial-luxury", pageType: "home", business: biz } }));
  if (!lux.html.includes("lenis@1") || !lux.html.includes("lenis.raf")) throw new Error("editorial scaffold missing Lenis integration");
  const trust = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "care-trust", pageType: "home", business: biz } }));
  if (trust.html.includes("lenis")) throw new Error("care-trust scaffold should NOT include Lenis");
});

await check("recommend_stack returns catalog and per-need recipes", async () => {
  const all = parse(await client.callTool({ name: "recommend_stack", arguments: {} }));
  if (!all.libraries?.some((l) => l.id === "gsap") || !all.recipes?.["static-forms"]) throw new Error("catalog incomplete");
  const reveal = parse(await client.callTool({ name: "recommend_stack", arguments: { need: "text-reveals" } }));
  if (!reveal.recipe?.recipe.includes("SplitText")) throw new Error("text-reveals recipe missing SplitText");
  const forms = parse(await client.callTool({ name: "recommend_stack", arguments: { need: "static-forms" } }));
  if (!forms.recipe?.recipe.includes("wa.me")) throw new Error("static-forms recipe missing WhatsApp deep link");
});

await check("mobile: working menu, sticky action bar, 16px inputs, mandate in briefs", async () => {
  const lux = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "editorial-luxury", pageType: "home", business: biz } }));
  for (const needle of ['class="nav-toggle" aria-expanded="false" aria-controls="nav-links"', "body.nav-open .nav-links { display: flex; }", "nav-toggle", "font-size: max(16px, 1em)",
    "close:'Close'", "position: fixed; top: .75rem; right: var(--gutter); z-index: 35"]) {
    if (!lux.html.includes(needle)) throw new Error(`scaffold missing '${needle}'`);
  }
  if (lux.html.includes("TODO(build): mobile menu")) throw new Error("dead-end mobile nav still present");
  const es = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "ivory-elegance", pageType: "home", business: { name: "Terraza Alborela", language: "es" } } }));
  if (!es.html.includes(">Menú</button>") || !es.html.includes("close:'Cerrar'")) throw new Error("menu labels not localized for es");
  if (lux.html.includes("mobile-cta-bar\">")) throw new Error("editorial home should not carry the mobile bar");
  const glass = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "craftsman-trust", pageType: "landing-local-service", business: { name: "Vitrelora Glass Co." } } }));
  for (const needle of ["mobile-cta-bar", "wa.me", "tel:", "has-mobile-bar", "safe-area-inset-bottom"]) {
    if (!glass.html.includes(needle)) throw new Error(`glass scaffold missing '${needle}'`);
  }
  const res = await client.callTool({ name: "compose_build_prompt", arguments: { styleId: "care-trust", pageType: "home", business: biz } });
  if (!res.content[0].text.includes("Mobile Mandate")) throw new Error("brief missing Mobile Mandate");
  const q = parse(await client.callTool({ name: "quality_standards", arguments: { section: "mobile" } }));
  if (!q.mobileRules?.length) throw new Error("quality_standards mobile section missing");
});

await check("scaffold_site emits linked multi-page site with interior heroes", async () => {
  const site = parse(await client.callTool({
    name: "scaffold_site",
    arguments: {
      styleId: "showroom-drive",
      business: { name: "Alborvane Motorworks", industry: "auto detailing" },
      pages: [{ pageType: "home" }, { pageType: "services" }, { pageType: "gallery" }, { pageType: "contact" }]
    }
  }));
  if (site.files.length !== 4) throw new Error(`got ${site.files.length} files`);
  const home = site.files[0], services = site.files[1];
  if (home.file !== "index.html") throw new Error("home not index.html");
  for (const needle of ['href="services.html"', 'href="gallery.html"', 'href="contact.html"']) {
    if (!home.html.includes(needle)) throw new Error(`home nav missing ${needle}`);
  }
  if (!home.html.includes('href="index.html" aria-current="page"')) throw new Error("home missing aria-current");
  if (!services.html.includes('href="services.html" aria-current="page"')) throw new Error("services missing aria-current");
  if (home.html.includes('class="hero hero--interior')) throw new Error("home should NOT be interior");
  if (!services.html.includes('class="hero hero--interior')) throw new Error("interior page missing reduced hero");
  const homeTokens = home.html.match(/:root \{[\s\S]*?\}/)[0];
  const svcTokens = services.html.match(/:root \{[\s\S]*?\}/)[0];
  if (homeTokens !== svcTokens) throw new Error("token drift between pages");
});

await check("scrub-sequence flourish scaffolds the AirPods mechanic", async () => {
  let hit = null;
  for (let seed = 1; seed <= 30 && !hit; seed++) {
    const v = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "showroom-drive", pageType: "home", business: { name: "Alborvane Motorworks" }, variationSeed: seed } }));
    if (v.composition.flourishes.some((f) => f.startsWith("scrub-sequence"))) hit = v;
  }
  if (!hit) throw new Error("no seed produced scrub-sequence in 30 tries");
  for (const needle of ["pin-seq-track", "seq-canvas", "position: sticky", "ffmpeg -i product.mp4", "prefers-reduced-motion"]) {
    if (!hit.html.includes(needle)) throw new Error(`sequence scaffold missing '${needle}'`);
  }
  const stack = parse(await client.callTool({ name: "recommend_stack", arguments: { need: "scroll-sequence" } }));
  if (!stack.recipe?.recipe.includes("300vh")) throw new Error("scroll-sequence recipe missing");
});

await check("dolly-zoom hero: forced override scaffolds the push-in mechanic", async () => {
  const out = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "editorial-luxury", pageType: "home", business: biz, heroVariant: "dolly-zoom" } }));
  for (const needle of ["hero--dolly", "dolly-track", "position: sticky", "transform-origin", "scale('+(1+p*1.35)", "prefers-reduced-motion"]) {
    if (!out.html.includes(needle)) throw new Error(`dolly scaffold missing '${needle}'`);
  }
  if (out.composition.hero !== "dolly-zoom") throw new Error("composition not overridden");
  const brief = await client.callTool({ name: "compose_build_prompt", arguments: { styleId: "ivory-elegance", pageType: "home", business: biz, heroVariant: "dolly-zoom" } });
  if (!brief.content[0].text.includes("Hero Override") || !brief.content[0].text.includes("Dolly Push-In Hero")) throw new Error("brief missing hero override");
});

await check("semantic tokens: on-accent/error/ring derived and used", async () => {
  const light = parse(await client.callTool({ name: "create_design_system", arguments: { styleId: "craftsman-trust" } }));
  const dark = parse(await client.callTool({ name: "create_design_system", arguments: { styleId: "iron-grit" } }));
  if (!light.cssVariables.includes("--color-error: #b3261e")) throw new Error("light style error color wrong");
  if (!dark.cssVariables.includes("--color-error: #ff6b5e")) throw new Error("dark style error color wrong");
  if (dark.tokens.palette.onAccent !== "#111111") throw new Error("high-vis yellow accent should get dark on-accent");
  const scaffold = parse(await client.callTool({ name: "scaffold_page", arguments: { styleId: "craftsman-trust", pageType: "contact", business: biz } }));
  for (const needle of [":focus-visible { outline: 2px solid var(--color-ring)", ":user-invalid", "var(--color-on-accent)"]) {
    if (!scaffold.html.includes(needle)) throw new Error(`scaffold missing '${needle}'`);
  }
});

await check("form rules + CTA strategy thread into briefs and quality_standards", async () => {
  const lead = await client.callTool({ name: "compose_build_prompt", arguments: { styleId: "craftsman-trust", pageType: "landing-local-service", business: biz } });
  const leadText = lead.content[0].text;
  if (!leadText.includes("Form UX Rules")) throw new Error("lead-gen brief missing form rules");
  if (!leadText.includes("CTA strategy:")) throw new Error("lead-gen brief missing CTA strategy");
  const about = await client.callTool({ name: "compose_build_prompt", arguments: { styleId: "editorial-luxury", pageType: "about", business: biz } });
  if (about.content[0].text.includes("Form UX Rules")) throw new Error("non-form page should not carry form rules");
  const q = parse(await client.callTool({ name: "quality_standards", arguments: { section: "forms" } }));
  if (!q.formRules?.some((r) => r.includes("user-invalid"))) throw new Error("forms section missing");
});

await check("prompts/list exposes premium-website", async () => {
  const { prompts } = await client.listPrompts();
  if (!prompts.some((p) => p.name === "premium-website")) throw new Error("prompt missing");
});

await client.close();
if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll smoke checks passed.");
