import { test, expect } from "@playwright/test";
import { config } from "../../site.config";

const bakes = config.bakes.map((p) => ({
  ...p,
  slug: p.slug!, // shipped config sets every slug explicitly
}));
const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("title is the bakehouse name in caps", async ({ page }) => {
    await expect(page).toHaveTitle(config.identity.name.toUpperCase());
  });

  test("hero shows the card headline, text and eyebrow", async ({ page }) => {
    const h1 = page.locator(".hero-card h1");
    await expect(h1).toHaveText(config.home.cardTitle);
    await expect(page.locator(".hero-card")).toContainText(config.home.cardText.slice(0, 30));
    await expect(page.locator(".hero-eyebrow")).toHaveText(config.home.eyebrow);
  });

  test("both halves of the split hero load", async ({ page }) => {
    const imgs = page.locator(".hero-split img");
    await expect(imgs).toHaveCount(2);
    for (const img of await imgs.all()) {
      const ok = await img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0
      );
      expect(ok).toBe(true);
    }
  });

  test("hero card button reaches the menu", async ({ page }) => {
    await page.locator(".hero-card .pill-link").click();
    await expect(page).toHaveURL(/\/menu\/?$/);
  });

  test("theme colors from the config are applied", async ({ page }) => {
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(hexToRgb(config.theme.background));
    const ink = await page.evaluate(() => getComputedStyle(document.body).color);
    expect(ink).toBe(hexToRgb(config.theme.ink));
    const footerBg = await page
      .locator(".site-footer")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(footerBg).toBe(hexToRgb(config.theme.deep));
    const label = await page
      .locator(".hero-eyebrow")
      .evaluate((el) => getComputedStyle(el).color);
    expect(label).toBe(hexToRgb(config.theme.accent));
  });

  test("manifesto renders in the serif with the config copy", async ({ page }) => {
    for (const p of config.home.manifesto) {
      await expect(page.locator(".manifesto")).toContainText(p.slice(0, 30));
    }
    const family = await page
      .locator(".manifesto p")
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Fraunces|serif/);
  });

  test("stats render every configured value and label", async ({ page }) => {
    await expect(page.locator(".stat")).toHaveCount(config.home.stats.length);
    for (const s of config.home.stats) {
      await expect(page.locator(".stats")).toContainText(s.value);
      await expect(page.locator(".stats")).toContainText(s.label);
    }
  });

  test("services index lists every service", async ({ page }) => {
    await expect(page.locator(".service-rows li")).toHaveCount(config.services.length);
    for (const s of config.services) {
      await expect(page.locator(".services-index")).toContainText(s.title);
    }
  });

  test("featured bakes show the first four bakes with prices", async ({ page }) => {
    await expect(page.locator(".feature-row")).toHaveCount(4);
    for (const p of bakes.slice(0, 4)) {
      await expect(page.locator(".featured")).toContainText(p.title);
      await expect(page.locator(".featured")).toContainText(p.price);
    }
  });

  test("bake day band renders every step", async ({ page }) => {
    await expect(page.locator(".process-step")).toHaveCount(config.process.length);
    for (const p of config.process) {
      await expect(page.locator(".band")).toContainText(p.title);
      await expect(page.locator(".band")).toContainText(p.step);
    }
  });

  test("stockist list renders every configured row", async ({ page }) => {
    await expect(page.locator(".commission-row")).toHaveCount(config.commissions.length);
    for (const c of config.commissions) {
      await expect(page.locator(".commissions")).toContainText(c.name);
    }
  });

  test("every image on the page loads (after scrolling them into view)", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const broken = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => !(img as HTMLImageElement).naturalWidth)
        .map((img) => img.getAttribute("src"))
    );
    expect(broken).toEqual([]);
  });

  test("every image has non-empty alt text", async ({ page }) => {
    const missing = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => !img.getAttribute("alt")?.trim())
        .map((img) => img.getAttribute("src"))
    );
    expect(missing).toEqual([]);
  });

  test("exactly one h1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });
});

test.describe("navigation", () => {
  test("header links reach every page, with active state", async ({ page }) => {
    await page.goto("/");
    for (const [label, path] of [
      ["Menu", "/menu"],
      ["Story", "/story"],
      ["Visit", "/visit"],
    ] as const) {
      await page.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}/?$`));
      const navLink = page.locator(`.site-nav a[href="${path}"]`);
      await expect(navLink).toHaveClass(/active/);
      await expect(navLink).toHaveAttribute("aria-current", "page");
    }
  });

  test("site title links back home", async ({ page }) => {
    await page.goto("/story");
    await page.locator(".site-title").click();
    await expect(page).toHaveURL(/127\.0\.0\.1:4173\/?$/);
  });

  test("footer shows the email as a mailto link and all socials", async ({ page }) => {
    await page.goto("/");
    const email = page.locator(".footer-email");
    await expect(email).toHaveAttribute("href", `mailto:${config.identity.email}`);
    await expect(email).toHaveText(config.identity.email);
    for (const s of config.socials) {
      await expect(page.locator(".footer-socials")).toContainText(s.label);
    }
  });
});

test.describe("menu page", () => {
  test("renders every bake as a card with its price", async ({ page }) => {
    await page.goto("/menu");
    await expect(page.locator(".bake-card")).toHaveCount(bakes.length);
    for (const b of bakes) {
      await expect(page.locator("main")).toContainText(b.title);
      await expect(page.locator("main")).toContainText(b.price);
    }
  });

  test("renders the bake schedule and every service detail", async ({ page }) => {
    await page.goto("/menu");
    await expect(page.locator(".schedule-row")).toHaveCount(bakes.length);
    await expect(page.locator(".service-detail")).toHaveCount(config.services.length);
    for (const s of config.services) {
      for (const item of s.items) {
        await expect(page.locator("main")).toContainText(item);
      }
    }
  });

  test("clicking a bake opens its page with details and a next link", async ({ page }) => {
    await page.goto("/menu");
    const first = bakes[0];
    await page
      .locator(".bake-card .text-link", { hasText: first.title })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${first.slug}/?$`));
    await expect(page.locator("h1")).toHaveText(first.title);
    for (const item of first.details) {
      await expect(page.locator(".chip-list")).toContainText(item);
    }
    await expect(page.locator(".bake-next a")).toHaveText(bakes[1].title);
  });

  test("next-bake wraps from the last bake back to the first", async ({ page }) => {
    const last = bakes[bakes.length - 1];
    await page.goto(`/${last.slug}`);
    await expect(page.locator(".bake-next a")).toHaveText(bakes[0].title);
    await expect(page.locator(".bake-next a")).toHaveAttribute("href", `/${bakes[0].slug}`);
  });
});

test.describe("story and visit pages", () => {
  test("story renders heading, principles and a loading image", async ({ page }) => {
    await page.goto("/story");
    await expect(page.locator("h1")).toContainText(config.story.heading.slice(0, 20));
    await expect(page.locator(".principle")).toHaveCount(config.story.principles.length);
    const ok = await page
      .locator(".story-photo img")
      .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(ok).toBe(true);
  });

  test("visit shows the email, every hour row and every note", async ({ page }) => {
    await page.goto("/visit");
    await expect(page.locator("h1")).toHaveText(config.visit.heading);
    await expect(page.locator(".visit-email")).toHaveAttribute(
      "href",
      `mailto:${config.identity.email}`
    );
    await expect(page.locator(".hours-row")).toHaveCount(config.visit.hours.length);
    await expect(page.locator(".note-list li")).toHaveCount(config.visit.notes.length);
    for (const line of config.visit.address) {
      await expect(page.locator("main")).toContainText(line);
    }
  });
});

test.describe("mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("no horizontal overflow on home or menu", async ({ page }) => {
    for (const path of ["/", "/menu"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow, path).toBeLessThanOrEqual(1);
    }
  });

  test("hero card fits the small screen", async ({ page }) => {
    await page.goto("/");
    const box = await page.locator(".hero-card").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(390);
  });
});
