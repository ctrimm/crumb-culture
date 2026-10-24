/**
 * Site plumbing — do not edit for content.
 *
 * Everything a site owner changes lives in `site.config.ts` at the repo
 * root. This module imports that config, validates it (failing the build
 * with plain-language problems when something is wrong), and exposes the
 * processed values + small pure helpers the pages and tests use.
 */
import { config } from "../../site.config";

// ── Types ──────────────────────────────────────────────────────────────────

export interface BakeInput {
  slug?: string;
  title: string;
  category: string;
  price: string;
  bakeDays: string;
  image: string;
  imageAlt: string;
  summary: string;
  details: string[];
}

export interface Bake extends Required<BakeInput> {}

export interface FontPreset {
  serif: string;
  sans: string;
  mono: string;
  serifFile: string;
  sansFile: string;
  monoFile: string;
}

// ── Font presets ───────────────────────────────────────────────────────────

export const FONT_PRESETS: Record<string, FontPreset> = {
  bakehouse: {
    serif: '"Fraunces", "Didot", Georgia, serif',
    sans: '"Archivo", "Helvetica Neue", Arial, sans-serif',
    mono: '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
    serifFile: "/fonts/fraunces-normal.woff2",
    sansFile: "/fonts/archivo-normal.woff2",
    monoFile: "/fonts/ibm-plex-mono-400.woff2",
  },
};

export const DEFAULT_FONT_PRESET = "bakehouse";

export function getFontPreset(name: string | undefined): FontPreset {
  if (name && name in FONT_PRESETS) return FONT_PRESETS[name];
  return FONT_PRESETS[DEFAULT_FONT_PRESET];
}

/** Inline :root overrides generated from the theme config. */
export function themeCssVars(theme: typeof config.theme): string {
  const fonts = getFontPreset(theme.fonts);
  return [
    `:root {`,
    `  --bg: ${theme.background};`,
    `  --surface: ${theme.surface};`,
    `  --ink: ${theme.ink};`,
    `  --deep: ${theme.deep};`,
    `  --accent: ${theme.accent};`,
    `  --deep-ink: ${theme.deepInk ?? theme.deep};`,
    `  --deep-text: ${theme.deepText ?? theme.background};`,
    `  --serif: ${fonts.serif};`,
    `  --sans: ${fonts.sans};`,
    `  --mono: ${fonts.mono};`,
    `}`,
  ].join("\n");
}

// ── Slugs ──────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2018\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// ── Validation ─────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function isValidHexColor(value: string): boolean {
  return HEX_RE.test(value);
}

/**
 * Returns a list of plain-language problems with a config object.
 * An empty list means the config is good. Pure — safe to unit test.
 */
export function validateConfig(cfg: typeof config): string[] {
  const problems: string[] = [];
  const need = (ok: boolean, msg: string) => {
    if (!ok) problems.push(msg);
  };

  need(!!cfg.identity?.name?.trim(), "identity.name is empty — add the bakehouse name.");
  need(
    isValidEmail(cfg.identity?.email ?? ""),
    `identity.email "${cfg.identity?.email}" doesn't look like an email address.`
  );
  need(!!cfg.identity?.role?.trim(), "identity.role is empty — add what the bakehouse does.");
  need(!!cfg.identity?.location?.trim(), "identity.location is empty — add where the bakehouse is.");

  for (const key of ["background", "surface", "ink", "deep", "accent", "deepInk", "deepText"] as const) {
    if ((key === "deepInk" || key === "deepText") && !cfg.theme?.[key]) continue;
    need(
      isValidHexColor(cfg.theme?.[key] ?? ""),
      `theme.${key} "${cfg.theme?.[key]}" is not a hex color like "#faf5ec".`
    );
  }
  need(
    !cfg.theme?.fonts || cfg.theme.fonts in FONT_PRESETS,
    `theme.fonts "${cfg.theme?.fonts}" is not one of: ${Object.keys(FONT_PRESETS).join(", ")}.`
  );

  need(
    !!cfg.home?.heroLeft?.startsWith("/images/"),
    'home.heroLeft should be a path like "/images/hero-left.jpg".'
  );
  need(!!cfg.home?.heroLeftAlt?.trim(), "home.heroLeftAlt is empty — describe the left hero photo for screen readers.");
  need(
    !!cfg.home?.heroRight?.startsWith("/images/"),
    'home.heroRight should be a path like "/images/hero-right.jpg".'
  );
  need(!!cfg.home?.heroRightAlt?.trim(), "home.heroRightAlt is empty — describe the right hero photo for screen readers.");
  need(!!cfg.home?.cardTitle?.trim(), "home.cardTitle is empty — add the headline on the hero card.");
  need(!!cfg.home?.cardText?.trim(), "home.cardText is empty — add the text on the hero card.");
  need(!!cfg.home?.cardCtaLabel?.trim(), "home.cardCtaLabel is empty — add the hero card's button text.");
  need((cfg.home?.manifesto?.length ?? 0) > 0, "home.manifesto needs at least one paragraph.");
  (cfg.home?.stats ?? []).forEach((s, i) => {
    need(!!s.value?.trim(), `home.stats #${i + 1}: value is empty.`);
    need(!!s.label?.trim(), `home.stats #${i + 1}: label is empty.`);
  });

  need((cfg.services?.length ?? 0) > 0, "services is empty — add at least one entry.");
  (cfg.services ?? []).forEach((s, i) => {
    const label = s.title ? `service "${s.title}"` : `service #${i + 1}`;
    need(!!s.title?.trim(), `${label}: title is empty.`);
    need(!!s.summary?.trim(), `${label}: summary is empty.`);
    need((s.items?.length ?? 0) > 0, `${label}: add at least one item it includes.`);
  });

  (cfg.process ?? []).forEach((p, i) => {
    need(!!p.step?.trim(), `process #${i + 1}: step is empty (e.g. "06:30").`);
    need(!!p.title?.trim(), `process #${i + 1}: title is empty.`);
    need(!!p.text?.trim(), `process #${i + 1}: text is empty.`);
  });

  need(
    !!cfg.story?.image?.startsWith("/images/"),
    'story.image should be a path like "/images/story.jpg".'
  );
  need((cfg.story?.paragraphs?.length ?? 0) > 0, "story.paragraphs needs at least one paragraph.");
  (cfg.story?.principles ?? []).forEach((p, i) => {
    need(!!p.title?.trim(), `story.principles #${i + 1}: title is empty.`);
    need(!!p.text?.trim(), `story.principles #${i + 1}: text is empty.`);
  });

  need(Array.isArray(cfg.bakes) && cfg.bakes.length > 0, "bakes is empty — add at least one bake.");
  const seenSlugs = new Map<string, string>();
  (cfg.bakes ?? []).forEach((p, i) => {
    const label = p.title ? `bake "${p.title}"` : `bake #${i + 1}`;
    need(!!p.title?.trim(), `${label}: title is empty.`);
    need(!!p.category?.trim(), `${label}: category is empty.`);
    need(!!p.price?.trim(), `${label}: price is empty (e.g. "$11").`);
    need(!!p.bakeDays?.trim(), `${label}: bakeDays is empty (e.g. "Every day").`);
    need(!!p.summary?.trim(), `${label}: summary is empty.`);
    need(!!p.imageAlt?.trim(), `${label}: imageAlt is empty — describe the photo for screen readers.`);
    need((p.details?.length ?? 0) > 0, `${label}: details needs at least one item.`);
    need(
      !!p.image?.startsWith("/images/"),
      `${label}: image should be a path like "/images/bake.jpg".`
    );
    const slug = p.slug ?? (p.title ? slugify(p.title) : "");
    need(isValidSlug(slug), `${label}: slug "${slug}" must be lowercase letters, numbers and dashes only.`);
    if (seenSlugs.has(slug)) {
      problems.push(
        `${label}: slug "${slug}" is already used by "${seenSlugs.get(slug)}" — slugs must be unique.`
      );
    } else {
      seenSlugs.set(slug, p.title);
    }
  });

  (cfg.commissions ?? []).forEach((c, i) => {
    need(!!c.year?.trim(), `commissions #${i + 1}: year is empty.`);
    need(!!c.name?.trim(), `commissions #${i + 1}: name is empty.`);
    need(!!c.location?.trim(), `commissions #${i + 1}: location is empty.`);
  });

  (cfg.socials ?? []).forEach((s, i) => {
    need(!!s.label?.trim(), `socials #${i + 1}: label is empty.`);
    need(!!s.href?.trim(), `socials #${i + 1} ("${s.label}"): href is empty.`);
  });

  need(!!cfg.visit?.heading?.trim(), "visit.heading is empty.");
  need(!!cfg.visit?.text?.trim(), "visit.text is empty.");
  need(
    !!cfg.visit?.image?.startsWith("/images/"),
    'visit.image should be a path like "/images/visit.jpg".'
  );
  need((cfg.visit?.hours?.length ?? 0) > 0, "visit.hours needs at least one entry.");
  (cfg.visit?.hours ?? []).forEach((h, i) => {
    need(!!h.days?.trim(), `visit.hours #${i + 1}: days is empty.`);
    need(!!h.time?.trim(), `visit.hours #${i + 1}: time is empty.`);
  });

  return problems;
}

const problems = validateConfig(config);
if (problems.length > 0) {
  throw new Error(
    "Your site.config.ts has problems:\n" + problems.map((p) => `  • ${p}`).join("\n")
  );
}

// ── Processed exports used by the pages ────────────────────────────────────

export const site = {
  name: config.identity.name,
  shortName: config.identity.shortName,
  siteUrl: config.identity.siteUrl.replace(/\/+$/, ""),
  role: config.identity.role,
  email: config.identity.email,
  credit: config.identity.credit,
  location: config.identity.location,
  founded: config.identity.founded,
  socials: config.socials,
  theme: config.theme,
  fonts: getFontPreset(config.theme.fonts),
  home: config.home,
  services: config.services,
  process: config.process,
  story: config.story,
  visit: config.visit,
};

export const bakes: Bake[] = config.bakes.map((p) => ({
  ...p,
  slug: p.slug ?? slugify(p.title),
}));

export const commissions = config.commissions;

/** Astro getStaticPaths payload for the [slug] bake pages. */
export function bakeRoutes() {
  return bakes.map((bake, i) => ({
    params: { slug: bake.slug },
    props: { bake, next: bakes[(i + 1) % bakes.length] },
  }));
}

export function nextBake(slug: string): Bake {
  const i = bakes.findIndex((p) => p.slug === slug);
  if (i === -1) throw new Error(`Unknown bake slug: ${slug}`);
  return bakes[(i + 1) % bakes.length];
}

export function mailto(email: string): string {
  return `mailto:${email}`;
}

/**
 * Splits a headline line into plain and italic segments: words wrapped in
 * *asterisks* in the config come back flagged italic.
 * "still *warm*" → [{t:"still "},{t:"warm",italic:true}]
 */
export function headlineParts(line: string): Array<{ text: string; italic: boolean }> {
  return line
    .split(/(\*[^*]+\*)/g)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith("*") && part.endsWith("*")
        ? { text: part.slice(1, -1), italic: true }
        : { text: part, italic: false }
    );
}

// ── Base path (GitHub Pages subpath support) ───────────────────────────────

/**
 * The site is normally served from a domain root (SST/CloudFront), but the
 * GitHub Pages preview lives under a subpath (/crumb-culture). Astro
 * exposes that as import.meta.env.BASE_URL; url() prefixes internal paths
 * with it. In root mode BASE_URL is "/" and url() returns paths unchanged.
 */
export const BASE_PATH = (import.meta.env?.BASE_URL ?? "/").replace(/\/+$/, "");

export function url(path: string): string {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return BASE_PATH + (path.startsWith("/") ? path : `/${path}`);
}

// ── Self-hosted font faces ─────────────────────────────────────────────────

const FONT_FACES: Array<[family: string, file: string, weight: string, style: string]> = [
  ["Fraunces", "fraunces-normal", "400 900", "normal"],
  ["Fraunces", "fraunces-italic", "400 900", "italic"],
  ["Archivo", "archivo-normal", "100 900", "normal"],
  ["Archivo", "archivo-italic", "100 900", "italic"],
  ["IBM Plex Mono", "ibm-plex-mono-400", "400", "normal"],
  ["IBM Plex Mono", "ibm-plex-mono-500", "500", "normal"],
  ["IBM Plex Mono", "ibm-plex-mono-600", "600", "normal"],
];

/** @font-face rules with base-aware URLs — generated into the page head
 *  because the inlined stylesheet can't know the deployment subpath. */
export function fontFaceCss(): string {
  return FONT_FACES.map(
    ([family, file, weight, style]) =>
      `@font-face { font-family: "${family}"; src: url("${url(`/fonts/${file}.woff2`)}") format("woff2"); font-weight: ${weight}; font-style: ${style}; font-display: swap; }`
  ).join("\n");
}

// ── Responsive images ──────────────────────────────────────────────────────

import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Astro/Vite bundling moves this module at build time, so import.meta.url
// does not point at the source tree — resolve public/ from the project
// root (where builds and tests run), with the source-relative path as a
// fallback for unbundled execution.
import { join } from "node:path";
const PUBLIC_DIR = [
  join(process.cwd(), "public") + "/",
  fileURLToPath(new URL("../../public/", import.meta.url)),
].find((dir) => existsSync(dir))!;

/**
 * Builds a srcset for an image from the resized variants sitting next to
 * it in public/ (e.g. bake.jpg + bake-480.jpg + bake-960.jpg).
 * `variantWidths` are widths to look for as `-<width>` files; `fullWidth`
 * is the original file's own width. Variants that don't exist are skipped,
 * and if none exist the result is undefined — a swapped-in photo without
 * generated variants simply serves the original, never a broken link.
 * (Regenerate variants with: python3 scripts/optimize-images.py)
 */
export function imgSrcset(
  src: string,
  variantWidths: number[],
  fullWidth: number
): string | undefined {
  const parts: Array<[number, string]> = [[fullWidth, src]];
  for (const w of variantWidths) {
    const variant = src.replace(/(\.[a-z0-9]+)$/i, `-${w}$1`);
    if (existsSync(PUBLIC_DIR + variant.replace(/^\//, ""))) {
      parts.push([w, variant]);
    }
  }
  if (parts.length === 1) return undefined;
  return parts
    .sort((a, b) => a[0] - b[0])
    .map(([w, p]) => `${url(p)} ${w}w`)
    .join(", ");
}
