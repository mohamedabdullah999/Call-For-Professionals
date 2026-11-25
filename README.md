# Experts Live Saudi 2026 — Call For Professional Speakers

Bilingual (English / Arabic) landing page for **Experts Live Saudi 2026**, 29–30 November 2026, PNU Conference & Convention Center, Riyadh. A call for speakers: one "Apply to speak" form, stored in PostgreSQL. Built from the Startups Demo Day landing page (same design system).

- `/en` — English (LTR) · `/ar` — Arabic (RTL) · `/` redirects by browser language
- Facts and copy come from the official agent kit (`EXPERTS-LIVE-SAUDI.md`, `BRAND.md`). Unconfirmed items are listed in [`docs/OPEN-ITEMS.md`](docs/OPEN-ITEMS.md) and tagged `// TBC:` in the code.
- Planning and design rationale: [`docs/DISCOVERY.md`](docs/DISCOVERY.md)

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript, `output: 'standalone'` |
| Styling | CSS Modules + design tokens in `src/styles/tokens.css` (no UI library) |
| Fonts | Montserrat, IBM Plex Sans Arabic, Reem Kufi — self-hosted via `next/font/local` |
| Forms | Route handler `POST /api/applications`, Zod validation shared by client and server |
| Database | PostgreSQL 16 (`pg`), SQL migrations in `db/migrations` |

## Environment variables

| Variable | Used for |
|---|---|
| `DATABASE_URL` | PostgreSQL for the form API and the migrate/export scripts |
| `IP_HASH_SALT` | Long random string; salts the stored IP hash |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this page (build time: canonical, Open Graph, sitemap). Not decided yet |
| `TRUSTED_PROXY_HOPS` | Number of reverse proxies in front of the app (real client IP for the rate limit) |

## Run locally

```bash
pnpm install
cp .env.example .env            # set DATABASE_URL and IP_HASH_SALT

# Postgres in Docker (exposed on host port 5433)
docker compose up -d db

pnpm db:migrate                 # creates the speaker_applications table
pnpm dev                        # http://localhost:3000
pnpm lint && pnpm typecheck     # checks run before every push
```

Production build: `pnpm build && pnpm start` (runs the standalone server).

Everything in Docker: `docker compose up -d --build` (runs migrations on start). Health check: `GET /api/health`.

Temporary preview: `render.yaml` is a Render Blueprint (Docker web service + free PostgreSQL). See `docs/DEPLOY.md`.

> `NEXT_PUBLIC_SITE_URL` is read at **build** time (canonical links, Open Graph, sitemap). Set it before `pnpm build`.

## Form data

Submissions go to the `speaker_applications` table (`db/migrations/001_speaker_applications.sql`):

| Column | Notes |
|---|---|
| `full_name` | Speaker name, 2–120 characters |
| `job_title`, `expertise`, `company` | 2–160 characters each |
| `linkedin_url` | Must be a `linkedin.com` link. `https://` is added if it was left out |
| `bio` | Short bio and topics, 50–1,500 characters |
| `locale` | `en` or `ar`, the page the form was sent from |
| `ip_hash` | Salted SHA-256 of the visitor IP (`IP_HASH_SALT`). Raw IPs are never stored |
| `user_agent`, `created_at` | |

Validation rules live in `src/lib/applications.ts` and are shared by the form and `POST /api/applications`.

Export to CSV (opens correctly in Excel, including Arabic):

```bash
pnpm db:export            # → exports/speaker-applications-<date>.csv
```

Protection: Zod validation on both sides, a honeypot field, a 10 KB body limit and an in-memory rate limit (5 requests/minute per IP). If the app runs on more than one instance, move the rate limit to the database or Redis.

## Project structure

```
src/
  app/
    [locale]/        layout (html lang/dir, fonts, metadata) and page
    api/applications POST handler
    robots.ts, sitemap.ts
  components/        one component + CSS module per section
  content/           en.ts, ar.ts (all copy), types.ts
  lib/               site constants, validation, db pool, rate limit, logos
  styles/            tokens.css, globals.css
  proxy.ts           "/" → /ar or /en
db/migrations/       SQL migrations
scripts/             migrate, export-csv, postbuild
public/              logos, venue photo, og image, icons
```

## Editing copy

All text lives in `src/content/en.ts` and `src/content/ar.ts` (same shape, typed by `types.ts`). Rules from the brand kit:

- Never call it a "Microsoft event". It is **Experts Live — Digital Conference**.
- Don't add sponsors, prices, speaker titles or partner statuses that aren't in the official kit. Mark anything new as *to be confirmed*.
- In Arabic strings, wrap number ranges like `29–30` in `⁦…⁩` so they keep their order in RTL.

## Brand rules implemented

- PNU logo is always first, top right (both languages). The Experts Live Saudi wordmark sits on a white rounded chip.
- Colours, type and logo order from `BRAND.md` (v2 "night stage").
- English left / Arabic right in the hero on both pages.
- Approved footer line used verbatim.

## Quality checklist

- Semantic landmarks, skip link, visible focus ring, labelled form fields with inline errors (`aria-describedby`), focus moves to the first invalid field
- `prefers-reduced-motion` respected (one orchestrated hero animation only)
- Responsive at 375 / 768 / 1024 / 1440
- Event JSON-LD, Open Graph, `hreflang` alternates, sitemap, robots
