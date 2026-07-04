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

await check("tools/list exposes all 13 tools", async () => {
  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  const expected = [
    "compose_build_prompt", "create_design_system", "generate_variations",
    "get_design_style", "get_design_trends", "get_page_blueprint",
    "list_design_styles", "list_page_blueprints", "plan_site",
    "quality_standards", "recommend_stack", "recommend_style", "scaffold_page"
  ];
  for (const e of expected) if (!names.includes(e)) throw new Error(`missing tool ${e}`);
});

await check("list_design_styles returns 13 styles", async () => {
  const styles = parse(await client.callTool({ name: "list_design_styles", arguments: {} }));
  if (styles.length !== 13) throw new Error(`got ${styles.length}`);
  for (const id of ["craftsman-trust", "care-trust", "ivory-elegance"]) {
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

await check("list_page_blueprints returns 16 blueprints", async () => {
  const b = parse(await client.callTool({ name: "list_page_blueprints", arguments: {} }));
  if (b.length !== 16) throw new Error(`got ${b.length}`);
  for (const id of ["team", "locations", "careers", "landing-local-service"]) {
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
  for (const needle of ['class="nav-toggle" aria-expanded="false" aria-controls="nav-links"', "body.nav-open .nav-links { display: flex; }", "nav-toggle", "font-size: max(16px, 1em)"]) {
    if (!lux.html.includes(needle)) throw new Error(`scaffold missing '${needle}'`);
  }
  if (lux.html.includes("TODO(build): mobile menu")) throw new Error("dead-end mobile nav still present");
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
