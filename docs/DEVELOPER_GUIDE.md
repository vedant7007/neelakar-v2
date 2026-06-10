# Neelakar — Developer Guide

The single, combined reference for anyone picking up this codebase. Start here, then dip into `README.md` (setup), `PROJECT_STATUS.md` (what's done / pending), and `HANDOFF.md` (architecture notes).

---

## 1. Orientation — start here

- **What it is:** the production website for Neelakar Creative House — a public marketing/portfolio site **plus** a hidden admin CMS, a Postgres database, and an email system.
- **Run it:** `npm install` → copy `.env.example` to `.env.local` and fill it → `npm run db:push` → `npm run dev` (http://localhost:3000).
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · GSAP + Lenis + Three.js · Supabase (Auth + Postgres) · Drizzle ORM · Resend · deployed on Vercel.
- ⚠️ **Next.js 16**: some APIs differ from older versions (e.g. `searchParams`/`params` are async/Promises). Check `node_modules/next/dist/docs/` before using an unfamiliar API.

---

## 2. Folder map

```
src/
├── app/
│   ├── layout.tsx                # root layout: fonts, global SEO metadata, JSON-LD
│   ├── sitemap.ts / robots.ts    # SEO
│   ├── opengraph-image.tsx       # social cards (twitter-image.tsx too)
│   ├── not-found.tsx / error.tsx / global-error.tsx
│   ├── (site)/                   # PUBLIC site — wrapped in SmoothScroll + Navbar + AdminGateway
│   │   ├── layout.tsx
│   │   ├── page.tsx              # homepage (composes the home/* sections)
│   │   ├── production/           # hub + photography + videography (+ per-route layout.tsx for metadata)
│   │   ├── workshops/page.tsx    # server: loads workshops + review, renders WorkshopsClient
│   │   └── create-with-us/       # multi-step enquiry form
│   ├── admin/
│   │   ├── login/page.tsx        # the only way in (see §6)
│   │   └── (dashboard)/          # auth-gated CMS: submissions, customers, workshops, etc.
│   └── api/                      # ~30 route handlers (see §5)
├── components/
│   ├── home/                     # homepage sections + HomeCornerLogo
│   ├── production/               # PhotographyClient, VideographyClient, OrbitCanvas
│   ├── workshops/                # WorkshopsClient (the whole workshops page UI)
│   ├── shared/                   # Navbar, SmoothScroll, SparkleClickEffect, Shuffle, LiquidEther, FooterSection, AdminGateway
│   └── admin/                    # Sidebar, TopBar, StatusBadge, FaceCapture, AdminThemeProvider
└── lib/
    ├── site.ts                   # SITE_URL + ASSET_ORIGIN (canonical URL config)
    ├── theme.ts                  # COLORS + FONTS design tokens (single source of truth)
    ├── supabase/                 # client.ts, server.ts, middleware.ts (session refresh + admin guard)
    ├── db/                       # index.ts (connection) + schema/ (12 tables)
    ├── email/                    # index.ts (Resend) + templates/
    ├── certificates/             # @react-pdf templates for workshop certificates
    ├── face-auth/                # encrypt/compare for biometric admin login
    └── validators/               # Zod schemas (e.g. submission.ts)
```

> Naming convention: a server component named `X/page.tsx` that needs interactivity loads a client component named `XClient.tsx` (e.g. `workshops/page.tsx` → `WorkshopsClient.tsx`). The server component does the data fetching; the client component does the UI/animation.

---

## 3. How the main flows work

**Enquiry form** (`/create-with-us`): client collects answers → `POST /api/submissions` (validated by `lib/validators/submission.ts`) → inserts a `submissions` row, upserts a `customers` row, and fires a confirmation email (best-effort). Lands in admin → Submissions.

**Workshop registration** (`/workshops`): the server page loads active workshops from the DB; the client renders them and posts to `POST /api/workshops/[id]/register` → creates a submission + enrollment + customer, decrements the seat count, emails a confirmation. Capacity- and duplicate-checked.

**Portfolios** (`/production/photography`, `/videography`): server components query `portfolio_items` by `context` (`photography` / `videography`); if fewer than the minimum exist they fall back to placeholder images. Add real items in admin → Portfolio and they appear with no deploy.

**Workshops review**: the quote/video section reads a `testimonials` row with `context = 'workshop'` (falls back to a default if none is set).

**Content updates have no deploy step** — public pages that read from the DB are `dynamic = 'force-dynamic'`, so admin edits show immediately.

---

## 4. Data model (Postgres via Drizzle — `src/lib/db/schema/`)

| Table | Purpose |
|-------|---------|
| `admin_profiles` | admin users + encrypted face descriptors |
| `submissions` | every enquiry / workshop sign-up (discriminated by `type`) |
| `customers` | CRM record per email (aggregates submissions) |
| `workshops` | sessions: dates, price, seats (`spotsFilled`/`totalSpots`), level, `highlight` |
| `workshop_enrollments` | links a submission ↔ workshop (+ certificate/email status) |
| `testimonials` | reviews, filtered by `context` (`main`, `workshop`, …) |
| `portfolio_items` | gallery items, filtered by `context` (`photography`/`videography`) |
| `brands` · `services` · `site_content` | taxonomy + editable site copy |
| `email_logs` | audit trail of sent email |

Apply schema changes with `npm run db:push`; browse data with `npm run db:studio`.

---

## 5. API routes

All under `src/app/api/`. **Mutations require a signed-in admin** (checked via `lib/supabase/server`), with these intentional public exceptions:

- `POST /api/submissions` — public enquiry submit
- `POST /api/workshops/[id]/register` — public workshop registration
- `GET` on `workshops`, `testimonials`, `portfolio`, `brands`, `services`, `content` — public reads for the site
- `POST /api/auth/register` — gated by `ADMIN_REGISTRATION_KEY`, not session
- `POST /api/seed` — auth-gated; inserts demo data

Everything else (PATCH/DELETE, customers, analytics, email, certificates, enrollment management) is admin-only.

---

## 6. Admin access (important — it's hidden)

- **No public link.** Reach the login by typing the secret `NEXT_PUBLIC_ADMIN_SEQUENCE` value anywhere on the public site (outside a text field) — handled by `components/shared/AdminGateway.tsx` — or go directly to `/admin/login`.
- **Guard:** `src/lib/supabase/middleware.ts` (wired via `src/proxy.ts`, matcher `/admin/:path*`) redirects unauthenticated `/admin/*` to `/admin/login`, and signed-in users away from the login.
- **Create the first admin:** `POST /api/auth/register` with `{ name, email, password, registrationKey }` where `registrationKey` === `ADMIN_REGISTRATION_KEY`. Passwords need 10+ chars with upper, lower, and a number.
- **Biometric login** (optional) is set up in admin → Settings via `FaceCapture`.

---

## 7. Theming & design tokens

- **Colours and fonts live in `src/lib/theme.ts`** (`COLORS`, `FONTS`). Components import these rather than hard-coding hex/font strings — change a brand value in one place.
- Brand: bg `#060F0B`, gold `#C8A96E`, cream `#E8E2D9`; Playfair Display (display, italic), DM Sans (body), Nusrat (cursive accent, `public/fonts/`).
- Fonts are loaded in `app/layout.tsx` (`next/font`) and exposed as CSS variables; `globals.css` holds the Tailwind v4 `@theme` and the Nusrat `@font-face`.
- Animation: GSAP + ScrollTrigger, with Lenis smooth scroll exposed globally as `window.__lenis` (see `components/shared/SmoothScroll.tsx`).

---

## 8. Deployment & domain

- Hosted on **Vercel**, auto-deploys from `main`. `npm run build` must pass.
- **Canonical URL** is centralized in `src/lib/site.ts` (`SITE_URL`, override with `NEXT_PUBLIC_SITE_URL`, defaults to `https://neelakar.com`). Social-card assets use `ASSET_ORIGIN` so previews survive DNS propagation.
- **Point neelakar.com (Wix-registered):** add the domain in Vercel → Settings → Domains, then in Wix DNS set `A @ → 76.76.21.21` and `CNAME www → cname.vercel-dns.com`. SSL is automatic.
- **Email:** set `RESEND_API_KEY` and verify `neelakar.com` as a Resend sending domain.

---

## 9. Common tasks

- **Add a public page:** create `src/app/(site)/<route>/page.tsx`. For SEO add a sibling `layout.tsx` exporting `metadata` (client pages can't export metadata directly — that's why production sub-routes each have a `layout.tsx`).
- **Add a homepage section:** build it in `components/home/`, import it in `(site)/page.tsx`.
- **Add a workshop field:** edit `schema/workshops.ts` → `npm run db:push` → surface it in the admin workshops form and in `WorkshopsClient`.
- **Change brand colours/fonts:** edit `src/lib/theme.ts`.
- **Tune the photo orbit / film viewer:** `components/production/OrbitCanvas.tsx` and `VideographyClient.tsx`.

---

## 10. Gotchas

- **Next.js 16 async props:** `params` and `searchParams` are Promises — `await` them in server components.
- **`LiquidEther.tsx`** is a vendored WebGL fluid simulation; it has a scoped `eslint-disable` for `any`/inline-class rules. Don't "fix" the types — it would add no safety and risks the GPU pipeline.
- **Placeholder images** use `picsum.photos` (Unsplash was unreliable). Don't switch back; replace with real assets via the admin.
- **Scroll-pinned animations** (homepage hero, sections) are deliberately tuned — preserve the pin + phase structure when editing.
- **React Compiler is on** (`reactCompiler: true`), so the react-hooks lint rules are strict; a few intentional `setState`-in-effect / relative-time cases carry inline `eslint-disable` comments with reasons.
- **Run `npm run dev` on port 3000** and kill stale Node processes before re-verifying.

---

_Build & docs by Vedant. The codebase is clean, typed, and lints with zero errors — `npm run build` is the source of truth._
