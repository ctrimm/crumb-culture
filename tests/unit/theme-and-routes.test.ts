import { describe, it, expect } from "vitest";
import {
  getFontPreset,
  themeCssVars,
  FONT_PRESETS,
  DEFAULT_FONT_PRESET,
  bakes,
  bakeRoutes,
  nextBake,
  mailto,
  imgSrcset,
} from "../../src/data/site";
import { config } from "../../site.config";

describe("font presets", () => {
  it("returns the default preset for undefined", () => {
    expect(getFontPreset(undefined)).toBe(FONT_PRESETS[DEFAULT_FONT_PRESET]);
  });
  it("returns the default preset for an unknown name", () => {
    expect(getFontPreset("nope")).toBe(FONT_PRESETS[DEFAULT_FONT_PRESET]);
  });
  it("returns each named preset", () => {
    for (const name of Object.keys(FONT_PRESETS)) {
      expect(getFontPreset(name)).toBe(FONT_PRESETS[name]);
    }
  });
  it("every preset has serif/sans/mono stacks and self-hosted font files", () => {
    for (const preset of Object.values(FONT_PRESETS)) {
      expect(preset.serif).toMatch(/serif/);
      expect(preset.sans).toMatch(/sans-serif/);
      expect(preset.mono).toMatch(/monospace/);
      expect(preset.serifFile).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
      expect(preset.sansFile).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
      expect(preset.monoFile).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
    }
  });
});

describe("themeCssVars", () => {
  const css = themeCssVars(config.theme);
  it("emits the configured colors", () => {
    expect(css).toContain(`--bg: ${config.theme.background};`);
    expect(css).toContain(`--surface: ${config.theme.surface};`);
    expect(css).toContain(`--ink: ${config.theme.ink};`);
    expect(css).toContain(`--deep: ${config.theme.deep};`);
    expect(css).toContain(`--accent: ${config.theme.accent};`);
    expect(css).toContain(`--deep-ink: ${config.theme.deepInk};`);
    expect(css).toContain(`--deep-text: ${config.theme.deepText};`);
  });
  it("emits the configured font stacks", () => {
    const preset = getFontPreset(config.theme.fonts);
    expect(css).toContain(`--serif: ${preset.serif};`);
    expect(css).toContain(`--sans: ${preset.sans};`);
    expect(css).toContain(`--mono: ${preset.mono};`);
  });
  it("is a single :root block", () => {
    expect(css.startsWith(":root {")).toBe(true);
    expect(css.trimEnd().endsWith("}")).toBe(true);
  });
});

describe("palette contrast (WCAG AA, computed from the shipped config)", () => {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  it("body ink on the cream ground passes AA for normal text", () => {
    expect(ratio(config.theme.ink, config.theme.background)).toBeGreaterThanOrEqual(4.5);
  });
  it("accent (prices, labels) on the cream ground passes AA", () => {
    expect(ratio(config.theme.accent, config.theme.background)).toBeGreaterThanOrEqual(4.5);
  });
  it("deep ink on the wheat surface passes AA", () => {
    expect(ratio(config.theme.deepInk, config.theme.surface)).toBeGreaterThanOrEqual(4.5);
  });
  it("light text on the dark roast bands and footer passes AA", () => {
    expect(ratio(config.theme.deepText, config.theme.deep)).toBeGreaterThanOrEqual(4.5);
  });
  it("the wheat surface text on the dark roast passes AA", () => {
    expect(ratio(config.theme.surface, config.theme.deep)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("bake routes", () => {
  it("generates one route per bake, in config order", () => {
    const routes = bakeRoutes();
    expect(routes).toHaveLength(config.bakes.length);
    expect(routes.map((r) => r.params.slug)).toEqual(bakes.map((p) => p.slug));
  });
  it("every route's next bake wraps around", () => {
    const routes = bakeRoutes();
    routes.forEach((r, i) => {
      expect(r.props.bake).toBe(bakes[i]);
      expect(r.props.next).toBe(bakes[(i + 1) % bakes.length]);
    });
    expect(routes[routes.length - 1].props.next).toBe(bakes[0]);
  });
  it("all slugs are unique", () => {
    expect(new Set(bakes.map((p) => p.slug)).size).toBe(bakes.length);
  });
  it("no bake slug collides with a fixed page route", () => {
    const fixed = ["menu", "story", "visit"];
    for (const p of bakes) expect(fixed).not.toContain(p.slug);
  });
});

describe("nextBake", () => {
  it("returns the following bake", () => {
    expect(nextBake(bakes[0].slug)).toBe(bakes[1]);
  });
  it("wraps from last to first", () => {
    expect(nextBake(bakes[bakes.length - 1].slug)).toBe(bakes[0]);
  });
  it("throws for an unknown slug", () => {
    expect(() => nextBake("no-such-bake")).toThrow(/Unknown bake slug/);
  });
});

describe("mailto", () => {
  it("prefixes an email address", () => {
    expect(mailto("a@b.co")).toBe("mailto:a@b.co");
  });
});

describe("imgSrcset", () => {
  it("includes existing hero variants plus the original, sorted by width", () => {
    const srcset = imgSrcset("/images/hero-left.jpg", [480, 960], 1120);
    expect(srcset).toBe(
      "/images/hero-left-480.jpg 480w, /images/hero-left-960.jpg 960w, /images/hero-left.jpg 1120w"
    );
  });
  it("includes bake variants at their real widths", () => {
    const srcset = imgSrcset("/images/bake-sourdough.jpg", [480, 960], 752);
    expect(srcset).toBe(
      "/images/bake-sourdough-480.jpg 480w, /images/bake-sourdough.jpg 752w, /images/bake-sourdough-960.jpg 960w"
    );
  });
  it("skips variants that don't exist on disk", () => {
    expect(imgSrcset("/images/hero-left.jpg", [123], 1120)).toBeUndefined();
  });
  it("returns undefined for an image with no variants at all", () => {
    expect(imgSrcset("/images/story.jpg", [999], 1280)).toBeUndefined();
  });
});
