/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  YOUR BAKEHOUSE — EDIT THIS FILE ONLY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  This is the only file you need to touch to make this template yours.
 *  Change the words between the quotes, save, and rebuild / redeploy:
 *
 *      npm run dev        → preview your changes live
 *      npm run deploy     → publish them
 *
 *  Rules of thumb:
 *  • Keep the quotes " " around text and keep commas where you find them.
 *  • Images live in `public/images/` — put a photo there and write its
 *    path below, for example "/images/sourdough.jpg".
 *  • A bake's `slug` is its web address: "country-sourdough" becomes
 *    yoursite.com/country-sourdough. Lowercase letters, numbers and
 *    dashes only. Leave it out and one is made from the title.
 *  • Colors are hex codes like "#b4551f". Search "hex color picker" if
 *    you want a different palette.
 *
 *  If something here is invalid — a bad email, a missing field, two
 *  bakes with the same slug — the build stops and tells you exactly
 *  what to fix, in plain language.
 */

export const config = {
  // ── The bakehouse ────────────────────────────────────────────────────────
  identity: {
    name: "Crumb Culture",
    shortName: "Crumb Culture",
    role: "Artisan Bakehouse & Cafe",
    email: "hello@crumbculturebakery.com",
    // Your site's address once it is live, e.g. "https://crumbculture.com".
    // Used for search engines and AI assistants. Leave "" until you have one.
    siteUrl: "",
    location: "Austin, Texas",
    founded: "2018",
    // Shown in the footer. Set to "" to hide the credit line.
    credit: "Made with Astro + SST",
  },

  // ── Social / contact links (footer) ──────────────────────────────────────
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Pinterest", href: "#" },
    { label: "Email", href: "mailto:hello@crumbculturebakery.com" },
  ],

  // ── Look & feel ──────────────────────────────────────────────────────────
  theme: {
    background: "#faf5ec", // warm cream — the page ground
    surface: "#f0e3cd", // soft wheat — panels and bands
    ink: "#2e211a", // dark espresso — text on the cream ground
    deep: "#33241a", // dark roast brown — the footer and dark bands
    accent: "#9c4415", // burnt crust — links, prices, small highlights
    // Body text color on the wheat surface. Kept separate so small text
    // always has enough contrast on whichever ground it sits.
    deepInk: "#2e211a",
    // Text color on the dark roast bands and footer.
    deepText: "#faf5ec",
    // One preset: "bakehouse" — a warm old-style serif for headlines, a
    // clean sans for reading, and a monospace for prices and notes.
    fonts: "bakehouse",
  },

  // ── Home page ────────────────────────────────────────────────────────────
  home: {
    eyebrow: "Baked at dawn, gone by noon",
    // The two hero photos, side by side — the template's signature split.
    heroLeft: "/images/hero-left.jpg",
    heroLeftAlt: "Close-up of a glossy braided challah loaf, fresh from the oven",
    heroRight: "/images/hero-right.jpg",
    heroRightAlt: "Two golden brioche loaves, one still in its parchment-lined tin",
    // The cream card that sits on the split.
    cardTitle: "Fresh bread, every single day",
    cardText:
      "Slow-fermented loaves, laminated pastries and whatever the bakers are excited about this week — mixed, shaped and baked in-house, every morning.",
    cardCtaLabel: "See the menu",
    cardCtaHref: "/menu",
    manifesto: [
      "Crumb Culture is a neighborhood bakehouse built on one unfashionable idea: bread takes the time it takes. Our doughs ferment for eighteen hours or more, our croissants are laminated over three days, and nothing on the shelf was baked yesterday pretending to be today's.",
      "We mill a portion of our flour in-house, buy the rest from Texas growers, and bake in small batches through the morning — so the loaf you carry home is often still warm.",
    ],
    stats: [
      { value: "18h", label: "Minimum ferment for every loaf" },
      { value: "06", label: "Bakes on the daily menu" },
      { value: "04", label: "Cafes serving our bread" },
    ],
  },

  // ── What else the bakehouse does ─────────────────────────────────────────
  // The home page shows the titles; the Menu page's companion section and
  // the Story page use the same list. Keep 3–5 entries.
  services: [
    {
      title: "The daily bake",
      summary:
        "Six staples, baked every morning in small batches — when a batch sells out, it is gone until tomorrow.",
      items: ["Country sourdough", "Butter croissants", "Cinnamon rolls", "Seeded multigrain"],
    },
    {
      title: "Weekend specials",
      summary:
        "Friday to Sunday the bakers experiment: seasonal fruit, Texas pecans, whatever the market brought.",
      items: ["Cardamom knots", "Pecan sticky buns", "Seasonal galettes", "Baker's choice loaf"],
    },
    {
      title: "Bread subscriptions",
      summary:
        "A standing weekly loaf, held at the counter under your name. Pause whenever, gift one to a neighbor.",
      items: ["One or two loaves weekly", "Skip or pause anytime", "First taste of specials"],
    },
    {
      title: "Wholesale & events",
      summary:
        "Daily bread service for cafes and restaurants, and pastry spreads for weddings and office mornings.",
      items: ["Cafe bread programs", "Wedding pastry tables", "Office breakfast orders"],
    },
  ],

  // ── A bake day, hour by hour ─────────────────────────────────────────────
  process: [
    {
      step: "02:00",
      title: "Mix & ferment",
      text: "The night baker mixes the day's doughs and sets them to ferment slowly in the cool room.",
    },
    {
      step: "05:00",
      title: "Shape",
      text: "Loaves are shaped by hand, croissants get their final fold, and rolls go into their pans to proof.",
    },
    {
      step: "06:30",
      title: "Bake",
      text: "The deck ovens do their work in waves — sourdough first, pastries as the doors open.",
    },
    {
      step: "07:00",
      title: "Doors open",
      text: "First loaves on the shelf, coffee on, and the day's specials chalked on the board.",
    },
  ],

  // ── The bakes ────────────────────────────────────────────────────────────
  // Add, remove or reorder freely — the home page, the Menu page and each
  // bake's own page are all generated from this list.
  bakes: [
    {
      slug: "country-sourdough",
      title: "Country Sourdough",
      category: "Breads",
      price: "$11",
      bakeDays: "Every day",
      image: "/images/bake-sourdough.jpg",
      imageAlt: "Round sourdough boule with a deeply scored, flour-dusted crust",
      summary:
        "Our signature loaf: a crackling crust, a custardy open crumb and a gentle tang from an eighteen-hour ferment. The starter, Crumbelina, has been with us since opening day.",
      details: ["Stone-milled wheat", "18-hour ferment", "Naturally leavened", "Baked on the deck hearth"],
    },
    {
      slug: "butter-croissants",
      title: "Butter Croissants",
      category: "Pastries",
      price: "$5",
      bakeDays: "Every day",
      image: "/images/bake-croissants.jpg",
      imageAlt: "Glossy golden croissants piled on a parchment-lined tray",
      summary:
        "Laminated over three days with cultured butter — twenty-seven layers, a shattering shell and a honeycomb middle. Best eaten standing at the counter, over the bag, so the flakes fall where they may.",
      details: ["27 layers", "Cultured butter", "Three-day process", "Glazed with honey wash"],
    },
    {
      slug: "cinnamon-rolls",
      title: "Cinnamon Rolls",
      category: "Sweets",
      price: "$6",
      bakeDays: "Every day",
      image: "/images/bake-cinnamon-rolls.jpg",
      imageAlt: "Four cinnamon rolls with white glaze in a round baking pan",
      summary:
        "Brioche swirled with Ceylon cinnamon and brown butter, baked snug in a pan and glazed while warm. Sold individually if you can manage it, and by the pan of four if you cannot.",
      details: ["Ceylon cinnamon", "Brown butter filling", "Pan of four available", "Glazed to order"],
    },
    {
      slug: "seeded-multigrain",
      title: "Seeded Multigrain",
      category: "Breads",
      price: "$10",
      bakeDays: "Tue · Thu · Sat",
      image: "/images/bake-seeded-loaf.jpg",
      imageAlt: "Sliced seeded multigrain loaf showing its hearty crumb",
      summary:
        "The sandwich loaf of the house: cracked grains and seeds through the crumb, a crust rolled in more of both. Toasts like a dream and keeps the week in sandwiches.",
      details: ["Seven grains & seeds", "Sliced on request", "Freezes beautifully", "Tue · Thu · Sat only"],
    },
  ],

  // ── Story page ───────────────────────────────────────────────────────────
  story: {
    image: "/images/story.jpg",
    imageAlt: "A baker's flour-dusted hands kneading dough on a worn wooden bench",
    heading: "Started with a starter, in a garage, in 2018",
    paragraphs: [
      "Crumb Culture began as a Saturday farmers-market stall and a sourdough starter named Crumbelina, carried to Austin in a jam jar. The stall sold out by nine most mornings; the bakehouse on Rosewood Avenue opened two years later, with the same starter and a much better oven.",
      "We are bakers, not a brand team: eleven people, one deck oven the size of a small car, and a chalkboard menu that changes when the season does. Everything is mixed, shaped and baked in the room behind the counter — you can watch from your table.",
    ],
    principles: [
      {
        title: "Time is an ingredient",
        text: "Slow fermentation is flavor you cannot fake or hurry. Every loaf gets its eighteen hours.",
      },
      {
        title: "Grain from near here",
        text: "Texas-grown wheat and rye, a portion milled in-house each week, so the flour is days old, not months.",
      },
      {
        title: "Bake less, bake better",
        text: "Small batches through the morning beat one big bake at dawn. When it is gone, it is gone.",
      },
    ],
    availability: "Bread subscriptions are open — six neighborhood spots left this month.",
  },

  // ── Find our bread (home page list) ──────────────────────────────────────
  commissions: [
    { year: "Since 2021", name: "Country Sourdough", location: "Rosewood Ave" },
    { year: "Since 2022", name: "Butter Croissants", location: "Cafe Lumen" },
    { year: "Since 2023", name: "Seeded Multigrain", location: "Hartwell Grocers" },
    { year: "Since 2024", name: "Cinnamon Rolls", location: "The Diner on 5th" },
  ],

  // ── Visit page ───────────────────────────────────────────────────────────
  visit: {
    heading: "Come say hello",
    text: "You will smell us before you see us. The bakehouse sits on Rosewood Avenue with a few marble tables, a counter built for lingering, and the day's loaves stacked behind it.",
    image: "/images/visit.jpg",
    imageAlt:
      "Inside the bakehouse: wooden shelves stacked with loaves, a glass case of croissants and marble cafe tables",
    address: ["1214 Rosewood Avenue", "Austin, Texas 78702"],
    hours: [
      { days: "Tuesday – Friday", time: "7:00a – 3:00p" },
      { days: "Saturday", time: "8:00a – 4:00p" },
      { days: "Sunday", time: "8:00a – 1:00p" },
      { days: "Monday", time: "Closed — the starter rests" },
    ],
    notes: [
      "Sourdough lands on the shelf at 7:30a and sells out most days",
      "Day-old loaves are half price after 2:00p, when there are any",
      "Dogs welcome on the patio; the bakers keep treats behind the counter",
    ],
  },
};

export default config;
