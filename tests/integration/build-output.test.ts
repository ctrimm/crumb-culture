import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "../../site.config";
import { bakes } from "../../src/data/site";

const DIST = join(process.cwd(), "dist");
const read = (p: string) => readFileSync(join(DIST, p), "utf-8");
const PAGES = [
  "index.html",
  "menu/index.html",
  "story/index.html",
  "visit/index.html",
];

// This suite runs a real production build once, then inspects dist/.
// It is the "does the whole machine fit together" layer.
beforeAll(() => {
  execSync("npm run build", { stdio: "pipe", timeout: 180_000 });
}, 200_000);

describe("build output: pages", () => {
  it("builds home, menu, story and visit", () => {
    for (const p of PAGES) {
      expect(existsSync(join(DIST, p)), p).toBe(true);
    }
  });
  it.each(bakes.map((p) => [p.title, p.slug] as const))(
    "builds a page for bake %s",
    (_title, slug) => {
      expect(existsSync(join(DIST, slug, "index.html"))).toBe(true);
    }
  );
  it("builds llms.txt, sitemap.xml and serves robots.txt", () => {
    expect(existsSync(join(DIST, "llms.txt"))).toBe(true);
    expect(existsSync(join(DIST, "sitemap.xml"))).toBe(true);
    expect(existsSync(join(DIST, "robots.txt"))).toBe(true);
  });
});

describe("build output: home page content", () => {
  const html = () => read("index.html");
  const plain = () => html().replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  it("shows the configured bakehouse name, role and email", () => {
    expect(html()).toContain(config.identity.name);
    expect(html()).toContain(config.identity.role);
    expect(html()).toContain(`mailto:${config.identity.email}`);
  });
  it("renders the hero card copy and the CTA to the menu", () => {
    expect(plain()).toContain(config.home.cardTitle);
    expect(plain()).toContain(config.home.cardText.slice(0, 40));
    expect(html()).toContain('href="/menu"');
  });
  it("renders the manifesto and every stat", () => {
    for (const p of config.home.manifesto) {
      expect(plain()).toContain(p.slice(0, 40));
    }
    for (const s of config.home.stats) {
      expect(html()).toContain(s.value);
      expect(plain()).toContain(s.label);
    }
  });
  it("renders every service title", () => {
    for (const s of config.services) {
      expect(plain()).toContain(s.title);
    }
  });
  it("features the first four bakes with prices and links", () => {
    for (const p of bakes.slice(0, 4)) {
      expect(html()).toContain(p.title);
      expect(plain()).toContain(p.price);
      expect(html()).toContain(`href="/${p.slug}"`);
    }
  });
  it("renders the full stockist list", () => {
    for (const c of config.commissions) {
      expect(html()).toContain(c.name);
      expect(html()).toContain(c.location);
    }
  });
  it("injects the configured theme as CSS variables", () => {
    expect(html()).toContain(`--accent: ${config.theme.accent};`);
    expect(html()).toContain(`--bg: ${config.theme.background};`);
  });
  it("has exactly one h1", () => {
    expect(html().match(/<h1[\s>]/g)).toHaveLength(1);
  });
});

describe("build output: other pages", () => {
  it("menu page renders every bake with its price", () => {
    const text = read("menu/index.html").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    for (const p of bakes) {
      expect(text).toContain(p.title);
      expect(text).toContain(p.price);
      expect(text).toContain(`href="/${p.slug}"`);
    }
  });
  it("menu page renders every service with its items", () => {
    const text = read("menu/index.html").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    for (const s of config.services) {
      expect(text).toContain(s.title);
      for (const item of s.items) expect(text).toContain(item);
    }
  });
  it("story page renders the principles and availability", () => {
    const text = read("story/index.html").replace(/&#39;/g, "'");
    for (const pr of config.story.principles) expect(text).toContain(pr.title);
    expect(text).toContain(config.story.availability.slice(0, 30));
  });
  it("visit page carries the email, hours and notes", () => {
    const text = read("visit/index.html").replace(/&#39;/g, "'");
    expect(text).toContain(`mailto:${config.identity.email}`);
    for (const h of config.visit.hours) {
      expect(text).toContain(h.days);
      expect(text).toContain(h.time);
    }
    for (const n of config.visit.notes) expect(text).toContain(n);
  });
  it("bake pages link onward to the next bake", () => {
    bakes.forEach((p, i) => {
      const next = bakes[(i + 1) % bakes.length];
      expect(read(`${p.slug}/index.html`)).toContain(`href="/${next.slug}"`);
    });
  });
});

describe("build output: structured data for AI agents and search", () => {
  it("includes parseable JSON-LD naming the business as a Bakery", () => {
    const m = read("index.html").match(
      /<script type="application\/ld\+json">(.+?)<\/script>/s
    );
    expect(m, "JSON-LD block should exist").toBeTruthy();
    const data = JSON.parse(m![1]);
    expect(data["@type"]).toBe("Bakery");
    expect(data.name).toBe(config.identity.name);
    expect(data.email).toBe(config.identity.email);
  });
  it("llms.txt summarises the bakehouse, services, bakes and contact email", () => {
    const txt = read("llms.txt");
    expect(txt).toContain(`# ${config.identity.name}`);
    expect(txt).toContain(config.identity.email);
    for (const s of config.services) expect(txt).toContain(s.title);
    for (const p of bakes) expect(txt).toContain(p.title);
  });
  it("sitemap lists every page and bake", () => {
    const xml = read("sitemap.xml");
    for (const path of ["/", "/menu", "/story", "/visit", ...bakes.map((p) => `/${p.slug}`)]) {
      expect(xml).toContain(`${path}</loc>`);
    }
  });
  it("every page carries a meta description", () => {
    for (const p of PAGES) {
      expect(read(p)).toMatch(/<meta name="description" content="[^"]{20,}"/);
    }
  });
});

describe("build output: no placeholder content ships", () => {
  const allHtml = () => PAGES.map(read).join("\n");
  it("contains no lorem ipsum, TODO or example-domain filler", () => {
    expect(allHtml()).not.toMatch(/lorem|TODO|example\.(com|org|net)/i);
  });
  it("loads every image locally — no hotlinked or CDN placeholder photos", () => {
    expect(allHtml()).not.toMatch(/<img[^>]+src="https?:/);
  });
});
