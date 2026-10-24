import type { APIRoute } from "astro";
import { site, bakes, url } from "../data/site";

/** /llms.txt — a plain-text map of the site for AI assistants,
 *  generated from the same config as the pages themselves. */
export const GET: APIRoute = () => {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.name} is an ${site.role.toLowerCase()} based in ${site.location}. This site presents the bakehouse's daily menu, story and visiting details.`,
    "",
    `Contact: ${site.email}`,
    "",
    "## Pages",
    "",
    `- [Home](${url("/")}): Split-screen hero, bakehouse philosophy, services index, featured bakes, a bake day hour by hour, and where to find our bread.`,
    `- [Menu](${url("/menu")}): Every bake on the menu with prices and bake days, plus subscriptions, wholesale and events.`,
    `- [Story](${url("/story")}): The bakehouse's story, principles and availability.`,
    `- [Visit](${url("/visit")}): Address, opening hours and good-to-know notes.`,
    "",
    "## Bakes",
    "",
    ...bakes.map(
      (p) => `- [${p.title}](${url(`/${p.slug}`)}): ${p.category}, ${p.price}, baked ${p.bakeDays.toLowerCase()}.`
    ),
    "",
    "## Also from the bakehouse",
    "",
    ...site.services.map((s) => `- ${s.title}: ${s.summary}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
