/**
 * Seeds the Gründbar dataset with demo content: four clearly-marked demo
 * personas (Mustermann-style placeholder names) and a set of example
 * pitches, several authored by the site owner's real account.
 *
 * Idempotent — documents use deterministic _ids and createOrReplace,
 * so re-running updates rather than duplicates.
 *
 * Usage: node scripts/seed.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// --- minimal .env.local parser (no deps) ---------------------------
const env = {};
for (const line of readFileSync(resolve(".env.local"), "utf8").split("\n")) {
  const idx = line.indexOf("=");
  if (idx > 0 && !line.startsWith("#")) {
    env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
}

const PROJECT_ID = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = env.SANITY_WRITE_TOKEN;
const OWNER_ID = "author-76000282"; // Vivek's real founder document

if (!PROJECT_ID || !TOKEN) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local");
  process.exit(1);
}

// --- demo personas (Mustermann convention: obviously placeholders) --
const personas = [
  {
    _id: "author-demo-max",
    name: "Max Mustermann",
    username: "",
    bio: "Demo persona — seeded to showcase Gründbar. Not a real founder (yet).",
    seed: "max",
  },
  {
    _id: "author-demo-erika",
    name: "Erika Musterfrau",
    username: "",
    bio: "Demo persona — seeded to showcase Gründbar. Not a real founder (yet).",
    seed: "erika",
  },
  {
    _id: "author-demo-lieschen",
    name: "Lieschen Müller",
    username: "",
    bio: "Demo persona — seeded to showcase Gründbar. Not a real founder (yet).",
    seed: "lieschen",
  },
  {
    _id: "author-demo-otto",
    name: "Otto Normalverbraucher",
    username: "",
    bio: "Demo persona — seeded to showcase Gründbar. Not a real founder (yet).",
    seed: "otto",
  },
].map((p) => ({
  _type: "author",
  _id: p._id,
  id: 0,
  name: p.name,
  username: p.username,
  email: "",
  image: `https://api.dicebear.com/9.x/initials/svg?seed=${p.seed}&backgroundColor=065f46&textColor=fafdf9`,
  bio: p.bio,
}));

const D = (daysAgo) =>
  new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

const img = (seed) => `https://picsum.photos/seed/${seed}/1200/675`;

// --- pitches --------------------------------------------------------
const pitches = [
  {
    id: "pfandflow",
    author: "author-demo-max",
    title: "Pfandflow",
    description:
      "Office deposit-bottle pickup on a schedule — the Pfand goes to a charity or the team's coffee fund.",
    category: "Climate",
    lookingFor: ["Co-founder", "Marketing"],
    daysAgo: 2,
    voters: [OWNER_ID, "author-demo-erika", "author-demo-otto"],
    views: 214,
    pitch: `## The problem

Every German office has a corner of shame: crates of empty Pfand bottles nobody wants to carry back. Money literally sitting on the floor — an estimated €500M in unredeemed deposits every year.

## The idea

Weekly pickup routes for offices. Teams register a shelf, we collect, the deposit lands in a charity of their choice or the office coffee fund. Companies get an ESG-friendly line for their sustainability report.

## Why now

Deposit-return machines now accept crate-scale returns, cargo-bike logistics are cheap inside cities, and every mid-size company suddenly needs measurable sustainability wins.`,
  },
  {
    id: "formularfrei",
    author: OWNER_ID,
    title: "Formularfrei",
    description:
      "Answer plain-language questions, get a filled German bureaucracy form — Anmeldung to BAföG.",
    category: "AI",
    lookingFor: ["Designer"],
    daysAgo: 4,
    voters: ["author-demo-max", "author-demo-erika", "author-demo-lieschen", "author-demo-otto"],
    views: 389,
    pitch: `## The problem

German bureaucracy runs on forms that even Germans don't understand. For internationals it's worse: one wrong field on an Anmeldung and you lose two weeks.

## The idea

A conversational layer over official forms. You answer questions in plain English (or German, or Telugu), the app fills the actual PDF the Amt expects — with citations for why each field was filled that way.

## Why now

LLMs finally handle legal-adjacent German reliably enough to draft (with a human check). The forms are public. Nobody owns this space, because it's unglamorous — which is exactly why it's winnable.`,
  },
  {
    id: "bahnbuddy",
    author: "author-demo-erika",
    title: "BahnBuddy",
    description:
      "Automatic train-delay compensation: forward your ticket, we file the Fahrgastrechte claim.",
    category: "SaaS",
    lookingFor: ["Engineer"],
    daysAgo: 6,
    voters: [OWNER_ID, "author-demo-max"],
    views: 342,
    pitch: `## The problem

You're entitled to 25–50% back when your train is an hour late — but the claim process is a paper form, and most people never bother. Millions in compensation go unclaimed.

## The idea

Forward your ticket email. We track the journey, detect the delay, pre-fill the claim, and you tap once to submit. We take a small cut of recovered money — aligned incentives.

## Why now

Digital tickets made journeys machine-readable, delay data is public, and, well — have you taken a German train recently?`,
  },
  {
    id: "mensa-radar",
    author: "author-demo-lieschen",
    title: "Mensa Radar",
    description:
      "Live canteen crowd levels and menus for universities — know before you walk across campus.",
    category: "Education",
    lookingFor: [],
    daysAgo: 9,
    voters: ["author-demo-otto"],
    views: 156,
    pitch: `## The problem

Every student knows the gamble: walk ten minutes to the Mensa only to find a queue to the door and Schnitzel sold out.

## The idea

Menus, live crowd estimates (WiFi presence data the universities already collect), and a "notify me when the queue dies down" button. Free for students, licensed to Studierendenwerke.

## Why now

Studierendenwerke are actively digitizing, and campus WiFi analytics is a solved problem waiting for a friendly interface.`,
  },
  {
    id: "werkstudent-io",
    author: OWNER_ID,
    title: "Werkstudent.io",
    description:
      "Matching international students in Germany with Werkstudent roles that actually sponsor their growth.",
    category: "Other",
    lookingFor: ["Co-founder", "Marketing"],
    daysAgo: 12,
    voters: ["author-demo-max", "author-demo-lieschen"],
    views: 431,
    pitch: `## The problem

Werkstudent hiring is broken in both directions: students mass-apply into silence, companies drown in unfilterable applications. The best matches — motivated internationals with fresh skills — are the hardest to surface.

## The idea

A matching platform built around verified skills instead of CV keywords: short practical challenges relevant to the role, university-verified enrollment, and visa-logistics guidance for employers baked in.

## Why now

I've lived this search myself. Germany's skilled-worker shortage is now policy priority, and companies that never considered internationals are suddenly asking how.`,
  },
  {
    id: "gruendach",
    author: "author-demo-otto",
    title: "GrünDach",
    description:
      "Marketplace connecting flat-roof owners with vetted rooftop-greening installers, subsidies included.",
    category: "Climate",
    lookingFor: ["Engineer", "Designer"],
    daysAgo: 15,
    voters: [OWNER_ID],
    views: 128,
    pitch: `## The problem

Cities subsidize green roofs heavily — Berlin pays up to €60/m² — but owners don't know the programs exist, and finding a qualified installer means calling ten companies for three quotes.

## The idea

Enter your address, we estimate roof suitability from open aerial data, calculate available subsidies automatically, and match you with vetted installers who bid on the job.

## Why now

Subsidy budgets are going unspent while climate targets tighten. The aerial imagery and subsidy databases are open data — they've just never been joined.`,
  },
  {
    id: "diffcast",
    author: OWNER_ID,
    title: "Diffcast",
    description:
      "Turn your changelog into a 30-second narrated demo clip — automatically, on every release.",
    category: "Developer Tools",
    lookingFor: [],
    daysAgo: 19,
    voters: ["author-demo-erika", "author-demo-otto", "author-demo-max"],
    views: 267,
    pitch: `## The problem

Teams ship features nobody notices. Changelogs go unread; recording demo videos by hand takes an afternoon nobody has.

## The idea

Connect your repo. On release, Diffcast reads the changelog and diff, drives a headless browser through the new feature, and renders a short narrated clip ready for Slack, X, or your docs.

## Why now

Browser agents can finally follow "click the new button" instructions reliably, and TTS stopped sounding like a robot reading a phone book.`,
  },
  {
    id: "kiez-kitchen",
    author: "author-demo-erika",
    title: "Kiez Kitchen",
    description:
      "Supper clubs with your neighbors: home cooks host, the Kiez books seats, everyone eats better.",
    category: "Social",
    lookingFor: ["Co-founder"],
    daysAgo: 23,
    voters: [],
    views: 94,
    pitch: `## The problem

You can live five years in a German apartment building and never learn your neighbor's name. Loneliness is measurably rising; the dinner table is the oldest fix humanity has.

## The idea

Home cooks host small paid dinners; neighbors within walking distance book seats. Identity-verified, capped group sizes, cuisine tags. Think supper club infrastructure, not restaurant disruption.

## Why now

Post-pandemic, people crave exactly this — small, local, real. And regulation for private dining events is far lighter than for food businesses.`,
  },
  {
    id: "steuerklar",
    author: "author-demo-lieschen",
    title: "Steuerklar",
    description:
      "An autopilot tax buffer for freelancers — we set aside what the Finanzamt will eventually want.",
    category: "Fintech",
    lookingFor: ["Engineer"],
    daysAgo: 27,
    voters: [OWNER_ID, "author-demo-max"],
    views: 203,
    pitch: `## The problem

Every freelancer's horror story is the same: a great year, a spent bank account, and then the Nachzahlung letter. Income tax, VAT and health-insurance recalculations arrive months after the money is gone.

## The idea

Connect your business account. Every incoming payment automatically moves the right percentage into a locked buffer sub-account, calculated from your actual bracket and VAT status. When the letter comes, the money exists.

## Why now

Open banking (PSD2) makes the account plumbing trivial, and the freelancer share of the workforce keeps climbing.`,
  },
  {
    id: "termintausch",
    author: "author-demo-max",
    title: "Termintausch",
    description:
      "A cancellation exchange for doctor's appointments — someone's cancellation becomes your slot.",
    category: "Health",
    lookingFor: ["Designer", "Marketing"],
    daysAgo: 31,
    voters: ["author-demo-lieschen"],
    views: 187,
    pitch: `## The problem

Waiting three months for a specialist while practices eat 15% no-show rates is absurd — supply and demand exist, they just never meet.

## The idea

Practices publish cancellations to a waitlist; patients set their availability once and get first-come offers by push notification. The practice fills dead slots, the patient skips the queue.

## Why now

Practice-management systems finally have APIs, and patients learned during the pandemic that healthcare can, in fact, be booked like anything else.`,
  },
];

// --- build mutations ------------------------------------------------
const mutations = [
  ...personas.map((doc) => ({ createOrReplace: doc })),
  ...pitches.map((p) => ({
    createOrReplace: {
      _type: "startup",
      _id: `startup-seed-${p.id}`,
      _createdAt: D(p.daysAgo),
      title: p.title,
      slug: { _type: "slug", current: `${p.id}-seed` },
      author: { _type: "reference", _ref: p.author },
      views: p.views,
      voters: p.voters,
      description: p.description,
      category: p.category,
      image: img(p.id),
      pitch: p.pitch,
      lookingFor: p.lookingFor,
    },
  })),
];

const res = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2025-05-30/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  }
);

const body = await res.json();
if (!res.ok) {
  console.error("Seed failed:", JSON.stringify(body, null, 2));
  process.exit(1);
}

console.log(
  `Seeded ${personas.length} demo personas and ${pitches.length} pitches.`
);
console.log("Re-run any time — it updates in place.");
