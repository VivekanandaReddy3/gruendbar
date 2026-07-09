# gründbar.

**Pitch your idea. Find your people.**

Gründbar (German: *gründbar* ≈ "foundable") is a startup idea directory:
founders pitch ideas in Markdown, the community upvotes the good ones, and
anyone looking for a co-founder, engineer or designer can flag it — and get
found through the team-up filter.

**Live:** [gruendbar.vivekreddy.de](https://gruendbar.vivekreddy.de) ·
a project by [Vivekananda Reddy](https://vivekreddy.de)

## Features

- **Pitch creation** — Markdown editor with live preview, validated server
  actions, slug generation
- **Upvotes** — one vote per signed-in founder, optimistic UI, sortable
- **Team-up flags** — founders mark the roles they're looking for; visitors
  filter the directory by "looking for teammates" and reach out via GitHub
- **Founder profiles** — GitHub sign-in automatically becomes a founder page
  listing your pitches
- **Live directory** — full-text search, category chips, three sort orders,
  view counts incremented after the response via `next/server`'s `after()`
- **Graceful empty states** — the app builds and runs before any backend is
  connected

## Stack

Next.js 15 (App Router, server actions) · React 19 · TypeScript ·
Tailwind CSS 4 · Auth.js v5 (GitHub OAuth) · Sanity v3 (embedded Studio at
`/studio`, Live Content API) · markdown-it

## Setup

```bash
cp .env.example .env.local   # fill in the values (see comments inside)
npm install
npm run dev
```

You need two free accounts:

1. **Sanity** — create a project at [sanity.io/manage](https://www.sanity.io/manage),
   copy the project ID, and create an API token with Editor permissions.
2. **GitHub OAuth app** — [github.com/settings/developers](https://github.com/settings/developers),
   callback URL `http://localhost:3000/api/auth/callback/github`.

Without env vars the app still builds and shows a "backend not connected"
empty state — useful for previewing the UI.

### Demo content

```bash
node scripts/seed.mjs
```

Seeds the directory with example pitches. Demo personas use Germany's
placeholder-name convention (Max Mustermann & friends) and say so in their
bios — no fake users pretending to be real ones. Idempotent; edit
`OWNER_ID` in the script if your author id differs.

## Provenance

This project started from the JavaScript Mastery "YC Directory" tutorial as
a learning base. It has since been rebuilt into a different product: complete
redesign and rebrand, the entire pitch-creation flow, upvotes, team-up flags
and filtering, founder profiles, author↔GitHub account linking, view
counting, the empty-state architecture, and the OG/favicon pipeline are
original work on top of that base.
