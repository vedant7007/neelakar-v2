# Neelakar Creative House — Website

Production-grade website for **Neelakar Creative House**, a luxury creative studio in Hyderabad (fashion photography, jewellery campaigns, brand films, editorial work).

- **Live:** https://neelakar-v2.vercel.app (production domain: neelakar.com — see [Deployment](#deployment))
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · GSAP + Lenis · Three.js · Supabase (Auth + Postgres) · Drizzle ORM · Resend
- **Hosting:** Vercel (auto-deploys from `main`)

> ⚠️ **This is Next.js 16** — several APIs and conventions differ from older versions (e.g. `searchParams` is async). When using an unfamiliar API, check the bundled guides in `node_modules/next/dist/docs/` first.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local      # then fill in real values (see below)

# 3. Push the database schema to your Supabase Postgres
npm run db:push

# 4. Run
npm run dev                     # http://localhost:3000
```

Build for production: `npm run build && npm start`.

---

## Environment variables

Copy `.env.example` → `.env.local` and fill in. All are required for full functionality.

| Variable | What it is | Where to get it |
|----------|-----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | same |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (server only) | same — **keep secret** |
| `DATABASE_URL` | Postgres connection string | Supabase → Database → Connection string |
| `RESEND_API_KEY` | Sends confirmation / bulk / certificate emails | resend.com → API Keys |
| `ADMIN_REGISTRATION_KEY` | Secret required to create an admin account | you choose it |
| `FACE_ENCRYPTION_KEY` | Encrypts stored face descriptors (admin biometric login) | a 32-char random string |
| `NEXT_PUBLIC_ADMIN_SEQUENCE` | Secret keystrokes that reveal the hidden admin login | you choose it (e.g. `neel`) |
| `NEXT_PUBLIC_SITE_URL` | *(optional)* canonical site URL | defaults to `https://neelakar.com` |

`.env.local` is gitignored and must never be committed.

---

## Accessing the admin

The admin dashboard is **hidden** — there is no visible link to it.

1. **Reveal the login:** on any public page, type the `NEXT_PUBLIC_ADMIN_SEQUENCE` value (e.g. `neel`) anywhere outside a text field. You'll be taken to `/admin/login`. (You can also go to `/admin/login` directly.)
2. **Create the first admin:** `POST /api/auth/register` with `{ name, email, password, registrationKey }` where `registrationKey` matches `ADMIN_REGISTRATION_KEY`. Password must be 10+ chars with upper, lower, and a number.
3. **Sign in** at `/admin/login`. Unauthenticated visits to any `/admin/*` route redirect here.

### What the admin controls
Submissions · Customers (CRM) · **Workshops** (create/edit + per-workshop enrollment lists) · Testimonials · Portfolio (photography & videography galleries) · Site content · Email (single + bulk) · Analytics · Certificate generation · Face-biometric login.

---

## Managing site content (for the team)

Everything below is editable in the admin — **no code changes needed:**

- **Workshops** → Admin → Workshops. Adding a session makes it appear on `/workshops`. Registrations land in that workshop's enrollment list (name/email/phone) for batch contact.
- **Photography gallery** → Admin → Portfolio, add items with context **photography**. They populate the orbit on `/production/photography`.
- **Videography gallery** → Admin → Portfolio, context **videography**. (Title = project name, subtitle = client.)
- **Workshops review video quote** → Admin → Testimonials, context **workshop**.
- **Campaigns / homepage copy** → Admin → Site content.

Until real content is added, public pages fall back to tasteful placeholders. Preview the workshops design with sample data at `/workshops?preview=1`.

### Seeding sample data
While signed in as an admin, `POST /api/seed` inserts demo workshops, submissions, testimonials, portfolio, brands, and content. (Auth-protected — not callable by the public.)

---

## Database

PostgreSQL on Supabase, via Drizzle ORM. Schema lives in `src/lib/db/schema/` (12 tables). Push schema changes with `npm run db:push`; browse data with `npm run db:studio`.

---

## Deployment

Hosted on **Vercel**, auto-deploying from `main`. To point the **neelakar.com** domain (registered at Wix) at this Vercel project:

1. Vercel → project → Settings → Domains → add `neelakar.com` and `www.neelakar.com`.
2. In Wix DNS (Domains → Advanced → Edit DNS): add `A @ → 76.76.21.21` and `CNAME www → cname.vercel-dns.com`. (Disconnect any Wix site from the domain first.)
3. Vercel verifies DNS and issues SSL automatically.

The site stays on Vercel — Wix is only the registrar. Canonical URLs, sitemap, robots, and OG cards already target `neelakar.com` (configured in `src/lib/site.ts`).

For email delivery, verify `neelakar.com` as a sending domain in Resend (adds TXT/DKIM records to the same DNS panel).

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, SEO metadata
│   ├── (site)/                 # Public site (SmoothScroll + Navbar)
│   │   ├── page.tsx            # Homepage (6 animated sections)
│   │   ├── production/         # Production hub + photography + videography
│   │   ├── workshops/          # Full workshops page (DB-driven)
│   │   └── create-with-us/     # Multi-step inquiry form
│   ├── admin/                  # Hidden admin dashboard + /admin/login
│   ├── api/                    # ~30 API routes (REST, auth-protected mutations)
│   ├── sitemap.ts robots.ts    # SEO
│   ├── opengraph-image.tsx     # Social cards
│   └── not-found.tsx error.tsx global-error.tsx
├── components/                 # Sections, OrbitCanvas, WorkshopsClient, etc.
└── lib/
    ├── site.ts                 # Canonical URL (single source of truth)
    ├── supabase/               # Auth clients + middleware
    ├── db/                     # Drizzle schema + connection
    ├── email/                  # Resend + templates
    └── validators/             # Zod schemas
```

See `HANDOFF.md` for a deeper architecture walkthrough and `PROJECT_STATUS.md` for what's done / what needs client input.

---

## Working conventions

- Commits are authored solely by the repo owner — no AI co-author trailers.
- Mobile-first. Brand: BG `#060F0B`, gold `#C8A96E`, cream `#E8E2D9`; Playfair Display (italic display), DM Sans (body), Nusrat (cursive accent).
- `PRD.md` is the original design spec.
