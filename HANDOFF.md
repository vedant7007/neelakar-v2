# Neelakar v2 — Session Handoff

## What This Is

**Neelakar Creative House** — a production-grade website for a luxury creative studio in Hyderabad, India. Fashion photography, jewellery campaigns, brand films, editorial work. Deployed on Vercel, auto-deploys from `main`.

Live: https://neelakar-v2.vercel.app

---

## User

**Vedant** — web dev intern at Neelakar. Wants boundary-pushing, experimental design. Loves dark-dominant aesthetics, gold accents, editorial feel. Design references: ashleybrookecs.com, off.site, heycusp.com, yzavoku.com, jasonbergh.com.

### Work style
- Moves fast. Don't ask permission, don't smoke-test with curl, batch commands.
- Git commits must have NO Co-Authored-By or AI traces. `vedant7007` owns every commit.
- Kill stale Next processes before verification — never drift to port 3001+.
- Mobile-first development priority.
- "Improvise" means polish within the existing plan, not delete and redo.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16.2.1, React 19, TypeScript |
| Styling | Tailwind CSS v4 + inline styles |
| Animation | GSAP (ScrollTrigger, SplitText), Framer Motion, Lenis smooth scroll |
| 3D / Canvas | Three.js (LiquidEther), Canvas 2D (OrbitCanvas) |
| Auth | Supabase Auth (email + face biometric via face-api.js) |
| Database | PostgreSQL (Supabase) + Drizzle ORM |
| Email | Resend API + React Email templates |
| Deployment | Vercel (auto-deploy from main) |

### Brand Constants
```
BG      = '#060F0B'    (dark green-black)
GOLD    = '#C8A96E'    (warm gold accent)
CREAM   = '#E8E2D9'    (light cream)
DISPLAY = Playfair Display (serif, italic headings)
SANS    = DM Sans (body text)
NUSRAT  = Custom cursive (public/fonts/nusrat-regular.otf)
```

### Image Strategy
- **picsum.photos** for placeholders (switched from Unsplash due to CORS/loading failures)
- Images must set `crossOrigin='anonymous'` and `referrerPolicy='no-referrer'` on canvas
- `unoptimized` prop on Next Image when using external CDNs

---

## Site Architecture

### Public Pages

**`/` — Homepage** (6 sections)
1. MagazineCoverHero — dark canvas, photographer cutout, "NEELAKAR" gold, LiquidEther WebGL
2. HandwrittenStatementSection — dark→cream transition, Nusrat handwriting reveal
3. ImageTextCollapseSection — dual-image collapse/expand, fashion + jewellery
4. CampaignsSection — 4 campaign cards with scroll reveal
5. WhatWeDoSection — service cards (01-04), process cards with stack rotation
6. FooterSection — canvas particle effect, footer links

**`/production` — Production Hub** (6 sections)
1. Hero — full viewport, Shuffle "PRODUCTION" animation, brand label
2. Featured Work — 3 portrait project cards with hover zoom, gold lines
3. Capabilities — 2-column split (Photography / Videography services), hover highlight
4. Process — 4-step grid (Discovery → Concept → Production → Delivery)
5. Portfolio Gateway — split panels linking to /photography and /videography, expand-on-hover with parallax
6. CTA — statement blockquote + "Start a Project" button

**`/production/photography` — Photography Portfolio**
- Full-viewport, no-scroll (yzavoku.com style)
- OrbitCanvas component: 20 thumbnails orbiting in a circle on Canvas 2D
- Background strip: portrait images scrolling horizontally, blur at edges, visible on scroll only
- Scroll-driven rotation + background strip speed
- Glassmorphism back button, centered "NEELAKAR" text
- Glow: double-draw technique (shadow pass at 0.6 alpha + sharp pass on top)

**`/production/videography` — Videography Portfolio**
- Full-viewport, cinematic (jasonbergh.com style)
- Centered video player with corner bracket SVGs
- Giant italic serif title split left/right of player
- 8 projects with scroll/arrow navigation, crossfade transitions
- "Play" label on hover, metadata (category, client, counter)
- Background image changes per slide

**`/create-with-us` — Interactive Inquiry Form**
- 4-act journey: Opening → Beneath Surface → Resolution → Fin
- Service selector, budget/timeline, personality questions
- Multi-step with review before submit

### Admin Dashboard (`/admin`)
Full CMS: submissions, customers, workshops (with certificate generation), testimonials, portfolio, site content, email (single + bulk), analytics dashboard, face biometric auth.

### API Routes (27 endpoints)
Auth, submissions, customers, workshops, enrollments, certificates, testimonials, portfolio, brands, services, content, email, analytics, seed.

---

## Key Components

| Component | What it does |
|-----------|-------------|
| `OrbitCanvas.tsx` | Canvas 2D orbit animation — thumbnails in a circle, background image strip, scroll-driven rotation, mouse parallax, edge blur |
| `MagazineCoverHero.tsx` | Homepage hero — dark canvas, photographer, gold typography, LiquidEther |
| `LiquidEther.tsx` | WebGL 2D fluid simulation with mouse interaction |
| `Shuffle.tsx` | GSAP SplitText character shuffle animation |
| `Navbar.tsx` | Fixed nav, hidden on `/create-with-us` and `/production/*` sub-routes |
| `SmoothScroll.tsx` | Lenis wrapper + GSAP ScrollTrigger integration |
| `FooterSection.tsx` | Canvas particle effect footer |

---

## OrbitCanvas Details (Photography Page)

This component has been heavily iterated. Current state:
- **Orbit**: 20 thumbnails at `60×75 * dpr` in a circle, radius `Math.min(w,h) * 0.42`
- **No depth effects**: all thumbnails same size and opacity (user explicitly removed scaling/fading)
- **Glow**: double-draw — first pass with `shadowColor rgba(200,169,110,0.85)` at `shadowBlur 40*dpr` and alpha 0.6, then sharp draw on top at alpha 1
- **Background strip**: full-height portrait images (`h * 0.6` wide), no gaps, constant drift `0.5*dpr` + scroll-driven `400*dpr`, opacity 0.45, fades in/out on scroll (0.25 lerp speed), edge blur `8*dpr` at 25% edge zone
- **Scroll**: `wheel` event with `preventDefault`, velocity `deltaY * 0.00008`, decay via `0.08` lerp + `0.95` damping
- **Mouse parallax**: `12*dpr` X, `8*dpr` Y, 0.04 lerp

---

## Database (12 tables)

`admin_profiles`, `submissions`, `customers`, `workshops`, `workshop_enrollments`, `testimonials`, `portfolio_items`, `brands`, `services`, `site_content`, `email_logs`, `uploaded_files`

Powered by Drizzle ORM, schema in `src/lib/db/schema/`.

---

## File Structure (Key Paths)

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, SEO)
│   ├── (site)/
│   │   ├── layout.tsx          # SmoothScroll + Navbar + SparkleClick
│   │   ├── page.tsx            # Homepage
│   │   ├── production/
│   │   │   ├── page.tsx        # Production hub (6 sections)
│   │   │   ├── photography/page.tsx
│   │   │   └── videography/page.tsx
│   │   └── create-with-us/page.tsx
│   ├── admin/                  # Full admin dashboard
│   └── api/                    # 27 API routes
├── components/
│   ├── OrbitCanvas.tsx         # Photography orbit animation
│   ├── Navbar.tsx
│   ├── Shuffle.tsx
│   ├── SmoothScroll.tsx
│   ├── sections/               # Homepage section components
│   └── certificates/           # PDF certificate templates
├── lib/
│   ├── supabase/               # Auth clients
│   ├── db/                     # Drizzle schema + connection
│   ├── email/                  # Resend integration
│   └── validators/             # Zod schemas
public/
├── NCH_logo_white.png
├── fonts/nusrat-regular.otf
└── models/face-api/            # Face detection models
```

---

## Known Decisions & Gotchas

- **Next.js 16 breaking changes**: Read `node_modules/next/dist/docs/` before using unfamiliar APIs. CLAUDE.md + AGENTS.md enforce this.
- **Unsplash images unreliable**: Switched to picsum.photos for all placeholder images. Don't switch back.
- **`next build --no-lint` doesn't exist** in Next 16. Just use `npx next build`.
- **PowerShell for git commits**: Multi-line messages with special chars break. Use Bash + heredoc for commits.
- **PRD.md**: 2600-line comprehensive spec in repo root. The source of truth for design decisions.
- **Navbar hides** on `/create-with-us` and all `/production/*` sub-routes. Each sub-page handles its own back navigation.
- **`window.__lenis`**: Lenis instance exposed globally via SmoothScroll component.
- **React Compiler enabled**: `reactCompiler: true` in next.config.ts.

---

## What's Been Built (Complete)
- Full homepage with 6 animated sections
- Production page with 6 sections + portfolio gateway
- Photography page (yzavoku-style orbit canvas)
- Videography page (jasonbergh-style cinematic hero)
- Create With Us interactive form
- Full admin dashboard with CMS
- Email system (single + bulk)
- Workshop management + certificate generation
- Face biometric auth for admin

## What Could Come Next
- Replace picsum placeholder images with real Neelakar portfolio images
- Add real video content to videography page
- Mobile polish pass on all production sub-pages
- SEO tuning for production pages
- Performance optimization (image lazy loading, canvas optimization)
- Additional portfolio sub-pages or individual project detail pages
