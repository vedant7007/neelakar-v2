# Neelakar Website — Project Status

_Last updated: handover._

This document is the single source of truth for **what is built, what needs your input, and what is optional**. The site is feature-complete and deployed; the remaining items are content and account credentials only you can provide — not development work.

---

## ✅ Built, working, and deployed

### Public website
- **Homepage** — 6 animated sections: magazine-cover hero (WebGL fluid), handwritten statement, dual-image collapse, campaigns, services/process, particle footer.
- **Production hub** (`/production`) — hero, featured work, capabilities, process, portfolio gateway, CTA.
- **Photography portfolio** (`/production/photography`) — orbiting gallery, database-driven.
- **Videography portfolio** (`/production/videography`) — cinematic slide player, database-driven.
- **Workshops** (`/workshops`) — full page: hero, "the idea", attendee review (video + quote), "what you'll learn", live upcoming-sessions list with online registration, CTA, footer.
- **Create With Us** (`/create-with-us`) — multi-step inquiry form that submits to the database and emails a confirmation.
- **Error pages** — branded 404, error, and global-error screens.

### Admin dashboard (hidden, secure)
- Hidden access (secret keystroke) + password login + optional face-biometric login.
- Manage: submissions, customers (CRM), **workshops + enrollment lists**, testimonials, portfolio galleries, site content, email (single + bulk), analytics, certificates.
- All mutations are authentication-protected.

### Platform
- ~30 REST API endpoints; PostgreSQL (12 tables) via Drizzle ORM.
- Email system (Resend + templates) for confirmations, bulk send, and certificates.
- SEO: per-page metadata, sitemap, robots, social-share cards, canonical URLs targeting neelakar.com.
- Security headers, strong admin passwords, protected seed endpoint.
- Mobile-first, responsive across the site. Auto-deploys to Vercel from `main`.

---

## 🔑 Needs YOUR input (not development — just credentials & content)

These are the only things between "deployed" and "fully live with real content." None require a developer.

1. **Resend API key** — paste into the `RESEND_API_KEY` env var so confirmation/registration emails actually send. (Free tier available at resend.com.) Then verify `neelakar.com` as a sending domain.
2. **Real photography images** — added via Admin → Portfolio (context: photography). Until then, placeholders show.
3. **Real videography stills/films** — Admin → Portfolio (context: videography).
4. **Real workshops** — Admin → Workshops. They appear instantly on `/workshops`.
5. **Real testimonials / the workshop review** — Admin → Testimonials.
6. **Domain pointing** — point neelakar.com (Wix) at Vercel (10-minute DNS change; see README → Deployment).
7. **Confirm the Instagram handle** used in links (`@neelakar_house`).

---

## ◻️ Optional future enhancements (not required to launch)

- Real video files in the videography player and workshop review (currently elegant placeholders).
- Individual project / case-study detail pages.
- Role-based admin permissions (currently every admin has full access).
- Payment integration for paid workshop registration.
- Performance pass (image lazy-loading, canvas tuning).

---

## How to verify it works (5 minutes)
1. `npm install && npm run dev` → open http://localhost:3000.
2. Browse the homepage, production, `/workshops?preview=1`, and `/create-with-us`.
3. Type the admin secret sequence on any page → `/admin/login`.
4. `npm run build` → confirms a clean production build.

The codebase is documented (`README.md`, `HANDOFF.md`), builds cleanly, and is already deployed. Any developer can be productive within minutes.
