# Neelakar Creative House — Website PRD
> High-fashion photography, jewellery cinematography, and creative workshops studio based in Hyderabad.
> This document is the complete design + interaction specification for building the website.

---

## 0. THE EMOTIONAL JOURNEY

> Every great website tells a story through feeling. Here's the emotional arc a first-time visitor experiences:

| Moment | What happens | What user FEELS |
|--------|-------------|-----------------|
| **Preloader** | Logo materializes, gold line draws, name reveals | Anticipation. "Something special is loading." |
| **Hero** | Dark canvas, stunning photo, gold "NEELAKAR", tagline | Awe. Gravitas. "This is luxury." |
| **Manifesto** | Dark melts to cream, "True fashion is not merely seen; it is *felt.*" | Intimacy. "They understand craft." |
| **Fashion Domain** | Magazine editorial, model photography, editorial typography | Aspiration. "I want this for my brand." |
| **Jewellery Domain** | Warm brown smoke, close-up stones, rounded cards | Richness. Warmth. "They respect heritage." |
| **Selected Work** | Horizontal scroll, images expand/contract | Immersion. "I'm browsing a gallery." |
| **Studio Practices** | Cards reveal what they do, cream editorial layout | Clarity. "Now I know what they offer." |
| **CTA** | "Ready to build your narrative?" | Desire. "I want to work with them." |
| **Footer** | Dust hover on Neelakar, quiet close | Resolution. Lingering impression. |

**For the Inquire page specifically:**
| Step | Emotion |
|------|---------|
| Welcome | Warmth — "They're inviting me in, not selling to me." |
| Who are you? | Comfortable — "This feels like a conversation." |
| What world? | Excited — "They care about MY world." |
| Tell us more | Creative — "I'm painting a vision, not filling a form." |
| Fun question | Smile — "They have personality." |
| Review | Confidence — "Everything looks right." |
| Thank you | Special — "I feel valued already." |

---

## 0.1 IMAGE ART DIRECTION

> Photography is the product. Image selection and treatment define the entire website's credibility.

### Image Mood by Section
| Section | Mood | Color temp | Cropping | Examples |
|---------|------|-----------|----------|----------|
| **Hero** | Commanding, dramatic | Cool with gold accents | Tight crop on subject, extends beyond frame edges | Jewellery on marble, model in dramatic lighting |
| **Fashion Domain** | Editorial, movement | Neutral to cool | Full-body or 3/4, editorial magazine ratio (2:3, 4:5) | Runway, fabric detail, backstage |
| **Jewellery Domain** | Intimate, rich | Warm, golden | Macro close-ups, detail shots | Stones catching light, pieces on skin, velvet displays |
| **Portfolio grid** | Consistent treatment | Slightly desaturated by default, full color on hover | Square or 4:5 uniform grid | Best-of from each project |
| **About page** | Human, candid | Warm | Medium shots, environmental | Studio space, team at work, BTS |
| **Workshops** | Energetic, educational | Bright, warm | Wide + close mix | Teaching moments, student work, setup shots |

### Image Treatment Rules
- All images have a subtle desaturation by default (CSS `filter: saturate(0.9)`) — on hover/focus, they go to full saturation
- Hero images: slight vignette overlay (radial-gradient, darker edges)
- Portfolio thumbnails: uniform aspect ratio (4:5) for grid consistency
- Film grain overlay on all images (3% opacity noise texture via pseudo-element)
- No stock photos — every image must be Neelakar's own work or commissioned. Placeholder images during development should use real fashion/jewellery photos from Unsplash with similar mood.

### Image Aspect Ratios
| Context | Ratio | Notes |
|---------|-------|-------|
| Hero | 16:9 or full-bleed | Extends beyond viewport edges |
| Editorial spreads | 2:3 (portrait) or 3:2 (landscape) | Magazine standard |
| Portfolio grid | 4:5 | Uniform for grid alignment |
| Cards/thumbnails | 3:4 | Slightly taller for vertical scroll |
| Workshop cards | 16:9 | Landscape for activity context |
| Journal posts | 3:2 | Wide for editorial feel |

---

## 0.2 RESPONSIVE BREAKPOINTS

| Name | Width | Target devices |
|------|-------|---------------|
| `mobile-sm` | 375px | iPhone SE, small Android |
| `mobile` | 390px | iPhone 14, standard Android |
| `mobile-lg` | 430px | iPhone Pro Max, large Android |
| `tablet` | 768px | iPad Mini, small tablets |
| `tablet-lg` | 1024px | iPad Pro, landscape tablets |
| `desktop` | 1280px | Standard laptops |
| `desktop-lg` | 1440px | Design target — primary desktop size |
| `desktop-xl` | 1920px | Full HD monitors |

**Design at:** 1440px (desktop) and 390px (mobile) as primary targets.
**Test at:** All breakpoints. Site must look intentional at every size, not just "responsive enough."

---

## 0.3 HOMEPAGE SCROLL TIMELINE

> This is the complete scroll experience from first pixel to last, mapped as a continuous timeline.

```
SCROLL POSITION    WHAT'S HAPPENING
═══════════════    ════════════════

0vh                Page loads → Preloader plays (2.5s)
                   Hero visible: dark canvas, photo right, "NEELAKAR" gold left
                   Nav bar transparent on top

0vh → 250vh        HERO (pinned)
                   ├─ 0-30%: Static hero, user absorbs the scene
                   ├─ 30-70%: Image scales 1→0.95, gains blur, text parallax up
                   └─ 70-100%: Everything fades to opacity 0

250vh → 600vh      MANIFESTO (pinned)
                   ├─ 0-10%: Line draws left→right
                   ├─ 10-20%: "Our Manifesto" label fades in
                   ├─ 20-45%: Headline text wipes up "True fashion is not merely seen;"
                   ├─ 45-65%: Gold pen writes "felt." with clipPath reveal
                   ├─ 65-80%: Hold — user reads
                   └─ 80-100%: Section scrolls away naturally

600vh → 1000vh     FASHION DOMAIN (pinned)
                   ├─ 0-25%: Main photo wipes in from left, "F" parallax in bg
                   ├─ 25-50%: Text staggers in from right
                   ├─ 50-70%: Secondary photos fade in with scale
                   └─ 70-100%: Hold for reading, then natural exit

1000vh → 1400vh    JEWELLERY DOMAIN (pinned)
                   ├─ 0-15%: Warm brown atmosphere fades in
                   ├─ 15-40%: Photo reveals from right, text from left
                   ├─ 40-70%: Rounded cards stagger in with rotation
                   └─ 70-100%: Hold, then exit

1400vh → 3200vh    SELECTED WORK (pinned, horizontal scroll)
                   ├─ 0-8%: "SELECTED WORK" title, full screen, centered
                   ├─ 8-15%: Title exits left, first image enters from right
                   ├─ 15-90%: 4-5 images cycle through (each: enter→expand→hold→shrink→exit)
                   └─ 90-100%: Last image exits, section unpins

3200vh → 3500vh    STUDIO PRACTICES (pinned)
                   ├─ 0-20%: Background gradient transition to cream
                   ├─ 20-40%: Label + headline fade in
                   ├─ 40-85%: 5 cards stagger in from bottom
                   └─ 85-100%: Hold

3500vh → 3700vh    CTA BAND (pinned)
                   ├─ 0-40%: Text fades in, gold lines draw
                   ├─ 40-70%: Button scales in
                   └─ 70-100%: Hold

3700vh+            FOOTER (natural scroll)
                   └─ Scrolls into view, not pinned
```

**Total scroll depth:** ~3800vh (approximately 38 full screens of scrolling)
**Total time at moderate scroll speed:** ~3-4 minutes for full experience

---

## 0.4 SCROLL PROGRESS INDICATOR
- Thin line (2px) fixed at very top of viewport, above nav
- Color: gold (#C8A96E) at 60% opacity
- Width: 0% → 100% as page scrolls from top to bottom
- Smooth interpolation (not jumpy)
- Z-index: above everything
- Mobile: same behavior

---

## 1. BRAND IDENTITY

### 1.1 Color Palette
| Token | Hex | Usage | Notes |
|-------|-----|-------|-------|
| `--dark` | `#060F0B` | Primary background, dark sections | Near-black with green undertone |
| `--cream` | `#E8E2D9` | Light sections, contrast backgrounds | Warm cream — NOT gray. Previous #C7C7C7 was too cold. |
| `--mid-gray` | `#C7C7C7` | Gradient transition midpoint only | Used in dark↔cream gradients as intermediary — never as a section background |
| `--gold` | `#C8A96E` | Accent — CTAs, cursive text, highlights, hover states | Contrast on dark: ~5.2:1 (passes AA). On cream: ~2.8:1 (use for large text/decorative only, NOT small body) |
| `--warm-brown` | `#3A2A1A` | Jewellery section gradients, warm smoke overlays | Low-opacity overlay only — never as text color |
| `--ink` | `#141414` | Text on light backgrounds | Contrast on cream: ~11:1 (passes AAA) |
| `--white` | `#F5F5F0` | Text on dark backgrounds (not pure white — slightly warm) | Contrast on dark: ~16:1 (passes AAA) |
| `--error` | `#E25C5C` | Form validation errors | Warm red, not harsh — used sparingly |

**Contrast Verification (WCAG AA = 4.5:1 for normal text, 3:1 for large text):**
| Combination | Ratio | Passes |
|------------|-------|--------|
| `--white` on `--dark` | ~16:1 | AAA |
| `--ink` on `--cream` | ~11:1 | AAA |
| `--gold` on `--dark` | ~5.2:1 | AA (normal text) |
| `--gold` on `--cream` | ~2.8:1 | Large text only (3:1 for 18px+). For small gold text on cream, use `--ink` instead |
| `--white` at 40% on `--dark` | ~3.2:1 | Large text only. Body text at 40% opacity on dark bg needs to be at least 0.85rem+ |

### 1.2 Typography System
| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Brand** | All Round Gothic | 200 (thin), 700 (bold) | Logo lockup, "Neelakar Creative House", brand moments |
| **Editorial** | Playfair Display | 300 (light italic), 900 (black) | Section headlines, statement text, editorial headings |
| **Cursive Accent** | Nusrat | 400 | Handwritten accent words — "felt.", "craft", emotional moments. Always gold (#C8A96E). Max 1-2 words per section. |
| **Body** | DM Sans | 300, 400, 500 | Body copy, labels, navigation, UI text, form fields |

**Typography rules:**
- Headlines: Playfair Display italic, large (clamp scales), dark or white depending on background
- Labels/Overlines: DM Sans, uppercase, tracking 0.3-0.5em, 40% opacity, small (0.65-0.75rem)
- Body: DM Sans 300, 40% opacity on dark bg / 50% opacity on light bg, generous line-height (1.7-1.9)
- Cursive accent: Nusrat, gold, used sparingly for emotional emphasis
- Numbers (01, 02...): Playfair Display, 20% opacity, large decorative

### 1.3 Spacing Scale
> All spacing derives from a 4px base unit. Use Tailwind's default scale where possible.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight gaps (icon-to-text, inline elements) |
| `sm` | 8px | Small gaps (between related items, padding on pills) |
| `md` | 16px | Medium gaps (between form fields, card padding) |
| `lg` | 24px | Large gaps (between card groups, section sub-elements) |
| `xl` | 40px | Section internal padding (headline to body) |
| `2xl` | 64px | Between major content blocks |
| `3xl` | 96px | Between sections (non-pinned pages) |
| `section` | 100vh | Full viewport section height (pinned sections) |

### 1.4 Layout Grid
- Desktop: 6vw horizontal padding (`px-[6vw]`), content max-width 1400px on text-heavy sections
- Mobile: 5vw horizontal padding (`px-[5vw]`)
- Section spacing: Sections are full-viewport (100vh) pinned, or natural scroll with generous vertical padding (15-20vh)
- Grid: CSS Grid or Flexbox, no strict column system — editorial layouts are intentionally asymmetric
- Max content width: 1400px for text-heavy (journal articles: 720px)
- Responsive gap: `gap-4` mobile → `gap-6` tablet → `gap-8` desktop

### 1.5 Z-Index System
> Every layered element has a designated z-index. No exceptions — avoids stacking bugs.

| Layer | Z-Index | Element |
|-------|---------|---------|
| Base sections | `z-[1]` to `z-[4]` | Homepage sections (ascending order down page) |
| Section content | `z-[10]` | Content within pinned sections |
| Navigation bar | `z-[50]` | Fixed nav — above all sections |
| Mobile menu overlay | `z-[60]` | Full-screen menu — above nav |
| Scroll progress bar | `z-[70]` | Thin gold line at top — above nav |
| Custom cursor | `z-[80]` | Follows mouse — above almost everything |
| Noise overlay | `z-[90]` | Film grain — topmost visual layer (pointer-events: none) |
| Preloader | `z-[100]` | Loading screen — above everything (removed after load) |
| Cookie banner (if any) | `z-[95]` | Above noise, below preloader |

### 1.6 Custom Cursor
- **Default state:** Small circle (12px), border only, `--gold` color, mix-blend-mode: difference
- **Hover on links/buttons:** Circle scales up to 60px, fills with `--gold` at 10% opacity, magnetic pull (element moves slightly toward cursor)
- **Hover on images:** Circle becomes "VIEW" text or expands with blur backdrop
- **Hover on draggable:** Circle becomes "DRAG" with arrows
- **Mobile:** No custom cursor, native touch interactions

### 1.7 Noise Overlay
- Fixed position, full screen, z-index on top
- SVG fractalNoise, opacity 0.04, mix-blend-mode: multiply
- Gives everything a subtle film-grain texture

---

## 2. GLOBAL ELEMENTS

### 2.1 Preloader (first visit only)
**Desktop + Mobile:**
- Black screen (#060F0B)
- Neelakar logo (NCH_logo_white.png) fades in at center, small (80px)
- Logo scales up to medium size (150px) with smooth ease
- Gold horizontal line draws from center outward below logo
- "NEELAKAR" text reveals letter-by-letter below the line in All Round Gothic thin
- Everything fades out, page content fades in
- Total duration: ~2.5 seconds
- Progress counter in corner: "0...100" in DM Sans, small, 20% opacity

### 2.2 Navigation Bar
**Desktop:**
- Fixed top, full width, transparent background initially
- Layout: `ABOUT / PORTFOLIO` (left) — `NEELAKAR` logo (center) — `JOURNAL / STUDIO / INQUIRE` (right)
- Logo: NCH mark, ~36px, white, mix-blend-mode: difference
- Links: DM Sans 400, uppercase, tracking 0.3em, font-size 0.7rem
- Hover: Gold underline draws from left to right (clip-path reveal), magnetic pull effect
- On scroll down: Nav slides up and hides (translateY: -100%)
- On scroll up: Nav slides back down with backdrop blur background
- INQUIRE button: bordered, gold color, hover fills gold with dark text

**Mobile (≤ 768px — switches at `tablet` breakpoint):**
- Fixed top: Logo left, hamburger icon right
- Hamburger: two horizontal lines, gold, on tap transforms to X
- Menu: Full-screen overlay, dark background (#060F0B), links centered vertically
- Links: Playfair Display italic, large (2rem), stagger-animate in from bottom (0.05s stagger)
- Close: X in top-right, menu items stagger-animate out (reverse order)
- **Focus trap:** When menu is open, Tab cycles only through menu items + close button. Focus returns to hamburger on close.
- **Body scroll lock:** Prevent background scroll when menu overlay is open
- **Escape key:** Closes menu

### 2.3 Footer
**All pages, consistent:**
- Background: `--dark`
- Top: thin gold line (1px, 20% opacity) full width
- Layout: Three columns
  - Left: "NEELAKAR" in All Round Gothic bold, large. "Creative House" below. Dust particle hover effect on text.
  - Center: Navigation links in two columns (About, Portfolio, Journal / Studio, Workshops, Inquire)
  - Right: "Hyderabad, India" location, email, Instagram/social links
- Bottom bar: "FASHION & JEWELRY | HYDERABAD | EST. 2024" left, copyright right
- All text: DM Sans, small, 30% opacity
- Hover on links: Gold color transition

**Mobile:**
- Single column, stacked
- Logo top, nav links, contact info, bottom bar

### 2.4 Page Transitions
- When navigating between pages: current page fades out (opacity 0, slight scale 0.98)
- New page content wipes in with a vertical clip-path reveal (inset from top)
- Duration: ~0.6s, ease: power2.inOut
- During transition: nav stays visible, background stays dark

### 2.5 Scroll Behavior
- Smooth scroll using Lenis (or native CSS smooth-scroll as fallback)
- GSAP ScrollTrigger for all scroll-driven animations
- Default scrub: 2-3 (not too fast, user has time to absorb — Noomo lesson)
- Pin duration: 300-500vh per section (varies by content density)
- Mobile: Same scroll logic but simpler animations (no parallax, reduced motion where needed)
- **Page navigation scroll reset:** Always scroll to top (0) when navigating to a new page. No scroll restoration.
- **Back/forward browser buttons:** Same — scroll to top. (ScrollTrigger animations are one-way experiences, restoring mid-scroll position would break pin states.)

### 2.6 External Links & General Link Behavior
- **Internal links:** Navigate via Next.js router (client-side transition with AnimatePresence). Same tab.
- **External links:** Open in new tab (`target="_blank" rel="noopener noreferrer"`). Applies to: social media links, Instagram feed links, Google Maps, WhatsApp link.
- **Email links:** `mailto:hello@neelakar.com` — opens default mail client, same tab.
- **Phone links (mobile):** `tel:+91XXXXXXXXXX` — native dialer.
- **Download links (if any):** Download attribute, no new tab.

### 2.7 Toast / Notification System
- Used for: "Link copied", "Form saved", email subscription confirmation
- Style: small pill, dark bg with gold border, white text, DM Sans 0.75rem
- Position: bottom-center, 80px above viewport bottom
- Animation: slide up + fade in, auto-dismiss after 2.5s, slide down + fade out
- Only 1 toast visible at a time — new toast replaces old

---

## 3. PAGES

---

### 3.1 HOME (`/`)
> The hero experience. This page is the emotional hook — every section is a scroll-driven moment.

---

#### Section 1: HERO
**What the user sees on load (after preloader):**

**Desktop:**
- Full viewport, dark background (#060F0B)
- Large fashion/jewellery photograph as the centerpiece — positioned right side, ~60% of viewport width, top-cropped so model/product extends beyond top edge (like Aegean reference)
- Left side: "NEELAKAR" in Playfair Display Black (900), gold color, massive (clamp 5rem-12rem). Below it: "CULTIVATING LEGACIES." in DM Sans uppercase, tracking wide, white 50% opacity. Below that: "ARCHITECTING DESIRE." same style
- Bottom-left corner: "FASHION & JEWELRY | HYDERABAD | EST. 2024" in DM Sans tiny, white 20%
- Bottom-right corner: "[INQUIRE]" bordered button, gold
- Subtle parallax: image moves slightly slower than text on scroll

**Scroll animation:**
- As user scrolls, the hero image scales down slightly (1 → 0.95) and gains slight blur
- Text elements move up at different speeds (parallax layers)
- Everything fades to 0 opacity before next section enters
- Pin duration: 250vh

**Mobile:**
- Image takes full width, top half of viewport, slight overlay gradient at bottom
- "NEELAKAR" below image, left-aligned, gold, smaller (clamp 2.5rem-4rem)
- Tagline below
- Scroll: image parallax (translateY at 0.3 rate), text fades up

---

#### Section 2: MANIFESTO
**What the user sees:**

**Desktop:**
- Background transitions from dark to cream (`--cream` / #E8E2D9) — gradient baked into this section's background (top 25% dark, through `--mid-gray` transition, middle 50% cream, bottom 25% back to dark)
- Center of viewport: "Our Manifesto" label with thin line above (DM Sans uppercase, 30% opacity)
- Below: "True fashion is not merely seen;" in Playfair Display italic, large
- Next line: "it is " + "felt." in Nusrat cursive, gold, with pen-cursor writing animation
- Text is centered vertically in the cream zone

**Scroll animation:**
- Line draws from left (scaleX 0 → 1)
- Label fades in (opacity 0 → 1, y: 12 → 0)
- Headline reveals from bottom (clipPath or opacity+y)
- "felt." written by animated gold pen cursor (2px gold line moves left-to-right, text reveals behind it via clipPath)
- Pin duration: 350vh

**Mobile:**
- Same layout but smaller font sizes
- Full width, left-aligned instead of centered
- Same animations but simplified (no pen cursor — just fade reveal for "felt.")

---

#### Section 3: OUR DOMAIN — FASHION
**What the user sees:**

**Desktop:**
- Magazine editorial spread layout (inspired by Gentle Monster reference)
- Dark background (#060F0B)
- Left side: Large fashion photograph (portrait orientation, ~45% viewport width)
- Right side: Large decorative letter "F" at 15% opacity as background texture
- Overlaid text right side: "FOR THE FASHION DESIGNER" (label), "Your Runway Is The World" (Playfair italic headline), body paragraph (DM Sans, 35% opacity)
- Bottom corner: "01" in Playfair, 20% opacity, decorative
- Secondary smaller photos arranged editorial-style (one overlapping the main image edge)

**Scroll animation:**
- Main image wipes in from left (clipPath: inset right → 0)
- Text elements stagger in from right (opacity + translateX)
- Decorative "F" letter parallax (moves slower)
- Small photos fade in with slight scale (0.95 → 1)
- Pin duration: 400vh

**Mobile:**
- Image full width, top
- Text below image, left-aligned
- No decorative letter
- Simpler stagger animation

---

#### Section 4: OUR DOMAIN — JEWELLERY
**What the user sees:**

**Desktop:**
- Dark background with warm brown atmospheric gradient/smoke overlay (radial gradient from center, warm brown tones at ~15% opacity)
- Layout: mirrored from Fashion section — text left, image right
- "FOR THE JEWELLERY COUTURIER" label
- "Life Within The Stone" headline (Playfair italic)
- Main jewellery photograph (close-up, rich tones)
- Rounded-corner image cards (3-4) arranged in a slight arc/overlap (like the "Our Works" reference)
- Gold accent line or decorative element
- "02" decorative number

**Scroll animation:**
- Warm brown gradient fades in first (atmosphere sets the mood)
- Image reveals from right (clipPath)
- Text staggers in from left
- Rounded cards stagger-animate in with scale (0.8 → 1) and slight rotation
- Pin duration: 400vh

**Mobile:**
- Image full width with rounded corners
- Text below
- Cards in horizontal scroll row (swipeable)
- Warm gradient still present as background

---

#### Section 5: SELECTED WORK / CAMPAIGNS
**What the user sees:**

**Desktop:**
- Dark background
- Starts with "SELECTED WORK" in Playfair Black, full screen, centered
- On scroll: title exits left, first project image enters from right
- Horizontal scroll gallery: 4-5 project images
- Each image: starts small (scale 0.4) and off-right, expands to near-fullscreen as it centers, shrinks and exits left
- Project title overlaid on each image (bottom-left), client name (top-right)
- Counter: "01 / 05" in bottom-right, updates as images change
- Between images: brief text overlay with project type (e.g., "Editorial Campaign", "Lookbook")

**Scroll animation:**
- Vertical scroll drives horizontal movement (ScrollTrigger horizontal pin)
- Images: translateX movement, scale animation (small → large → small)
- Text overlays fade in when image is centered, fade out when moving
- Smooth easing, scrub: 3-4 for buttery feel
- Pin duration: ~350vh per image

**Mobile:**
- Title section: "SELECTED WORK" smaller, centered
- Gallery: vertical scroll (not horizontal), each image is full-width card
- Swipe indicators if using horizontal approach
- Scale animations reduced (0.9 → 1 instead of 0.4 → 1)

---

#### Section 6: STUDIO PRACTICES (Services Teaser)
**What the user sees:**

**Desktop:**
- Cream background (`--cream` / #E8E2D9) — transition from dark (same gradient-baked-in approach as manifesto)
- "WHAT WE DO" label + "Studio Practices" headline (Playfair italic)
- 5 service cards arranged in a staggered grid:
  1. Editorial Photography
  2. Fashion Documentation
  3. Fashion Cinematography
  4. Aesthetic E-Commerce
  5. Visual Identity Systems
- Each card: dark background, rounded corners (12px), contains service name (All Round Gothic), brief one-line description (DM Sans), and a subtle icon or number
- Cards animate in on scroll — stagger from bottom, slight rotation (-3deg → 0deg)

**Hover on cards (desktop):**
- Card lifts (translateY: -8px), shadow deepens
- Gold border appears (1px, animated from bottom-left corner around the card)
- Service name color transitions to gold
- Cursor changes to "EXPLORE" text

**Scroll animation:**
- Background gradient transition (dark → cream) as section enters
- Label + headline fade in
- Cards stagger in from bottom with rotation
- Pin duration: 300vh

**Mobile:**
- Vertical stack, cards full-width
- No hover effects (touch only)
- Cards slide in from alternating left/right
- Cream background with dark cards

---

#### Section 7: CTA BAND
**What the user sees:**

**Desktop:**
- Dark background, full viewport height
- Center: "Ready to build your narrative?" in Playfair italic, medium-large
- Below: "Let's create something extraordinary." in DM Sans, 40% opacity
- Below: "[INQUIRE]" button — large, bordered, gold, hover fills gold
- Subtle decorative: thin gold lines extending from button edges outward
- "felt." in Nusrat, gold, tiny, floating in corner as a brand signature moment

**Scroll animation:**
- Text fades in with slight y-movement
- Gold lines draw outward from center
- Button scales from 0.9 → 1

**Mobile:**
- Same but smaller, centered, full padding

---

#### Section 8: FOOTER
(See Global Elements section 2.3)

---

### 3.2 ABOUT (`/about`)
> The story page. Who Neelakar is, what they believe, how they work.

---

#### Section 1: HERO
**Desktop:**
- Dark background, full viewport
- Left: "ABOUT" in Playfair Black, massive, rotated -90deg along left edge (vertical text)
- Center: Hero photograph — studio/team/atmospheric shot, slight parallax
- Right: "The story behind the lens." in DM Sans, vertical text, 30% opacity
- On scroll: image zooms slightly (1 → 1.05), text elements parallax at different rates

**Mobile:**
- "ABOUT" horizontal, large, top
- Photo below, full width
- Subtitle below photo

---

#### Section 2: ORIGIN STORY
**Desktop:**
- Cream background
- Narrative scroll layout (21tsi inspired):
  - Large pull quotes in Playfair italic interspersed with body paragraphs in DM Sans
  - Photos placed editorial-style — some full-width, some offset in columns
  - Timeline dots or markers on the side (optional)
- Content: Why Neelakar was founded, Hyderabad's fashion/jewellery heritage, the gap they're filling

**Scroll animation:**
- Text paragraphs fade in as they enter viewport (opacity + y)
- Photos wipe-reveal (clipPath from edges)
- Pull quotes animate with a slight scale (0.98 → 1) for emphasis
- Smooth natural scroll (NOT pinned — let user read at their own pace)

**Mobile:**
- Single column, text and images alternating
- Same fade-in animations

---

#### Section 3: THE NEELAKAR APPROACH
**Desktop:**
- Dark background
- "THE APPROACH" label
- 4 steps in a horizontal layout, each taking ~25% width:
  1. **IMMERSE** — "We enter your world before creating in it."
  2. **CONCEPTUALIZE** — "Your narrative, distilled into a visual thesis."
  3. **EXECUTE** — "Every frame calibrated. Every angle intentional."
  4. **REFINE** — "Precision is not achieved; it is relentlessly pursued."
- Each step: large number (01-04) in Playfair at 10% opacity, step name in All Round Gothic, description in DM Sans
- Decorative: thin connecting line between steps

**Scroll animation:**
- Horizontal scroll-pin: steps enter one-by-one from right as user scrolls vertically
- Each step: number fades in first, then title wipes in, then description fades
- Connecting line draws as progression advances
- Pin duration: 400vh

**Mobile:**
- Vertical stack, one step per screen section
- Swipe or scroll through steps
- Same stagger animations but vertical

---

#### Section 4: TEAM (optional — if team photos available)
**Desktop:**
- Dark background
- Grid of team member portraits with names and roles
- Hover: image desaturates slightly, name glows gold
- Editorial layout — varied sizes, asymmetric

**Mobile:**
- 2-column grid or carousel

---

#### Section 5: CTA
- Same pattern as Home CTA band
- "We'd love to hear your story." → INQUIRE link

---

### 3.3 PORTFOLIO (`/portfolio`)
> The work showcase. Filterable, browseable, visually rich.

---

#### Main View
**Desktop:**
- Dark background
- Top: "PORTFOLIO" in Playfair Black, large
- Filter bar: ALL / FASHION / JEWELLERY / FILM / IDENTITY — DM Sans uppercase, horizontal, gold underline on active
- Below: Masonry grid of project thumbnails
  - Each thumbnail: image with dark overlay on hover
  - Hover: image zooms slightly (1.03), project title appears in Playfair italic, client name in DM Sans, gold accent line draws in
  - Cursor: becomes "VIEW" text
- **Pagination:** Show 9 projects initially (3×3 grid desktop, 3×3 or 9×1 mobile). "SHOW MORE" button at bottom (not infinite scroll — user should feel in control). Each "SHOW MORE" loads 6 more. Button: gold bordered, same hover fill style as other buttons.
- **Empty state:** If a filter returns 0 results: "No projects in this category yet. Explore all work." with link to reset filter.

**Scroll animation:**
- Thumbnails stagger-fade-in on initial load (opacity 0 → 1, y: 30 → 0)
- Filter change: current grid fades out (opacity 0, 0.2s), new grid staggers in (0.3s)
- "SHOW MORE" results: new items stagger in from bottom (same as initial load)

**Mobile:**
- 2-column grid (not single column — wastes space and makes scrolling tedious)
- Tap to view (no hover states)
- Filter bar: horizontal scrollable pills with scroll-snap
- Sticky filter bar: stays at top when scrolling through grid

---

#### Project Detail (`/portfolio/[slug]`)
**Desktop:**
- Full-bleed hero image, entire viewport
- Project title overlaid: Playfair italic, large, bottom-left, white
- Client name: DM Sans, above title, 40% opacity
- Category tag: bordered pill, gold
- Scroll down: hero image parallax (stays while content scrolls over it)
- Content:
  - Magazine editorial layout — images in varied sizes, some full-width, some 50/50 split, some with text alongside
  - Brief section: project overview, approach, deliverables (DM Sans body text, Playfair headings)
  - Image gallery: editorial magazine feel (Gentle Monster spread reference)
- **Share:** Small "SHARE" button (gold, minimal) top-right or after project overview. Uses Web Share API on mobile (native share sheet), desktop fallback: copy link to clipboard with "Link copied" toast (gold bg, dark text, fades after 2s)
- Bottom: "NEXT PROJECT" with preview image, title, and arrow → smooth transition to next project

**Scroll animation:**
- Hero parallax (background-attachment fixed feel)
- Content sections stagger-reveal
- Images: clipPath wipe reveals as they enter viewport
- Next project preview: on hover, preview image scales, on click: page transition

**Mobile:**
- Hero image full-width, shorter height (60vh)
- Content: single column
- Images: full-width with scroll reveals
- Next project: card at bottom with tap

---

### 3.4 JOURNAL (`/journal`)
> Editorial blog — behind-the-scenes, industry insights, creative process.

---

#### Main View
**Desktop:**
- Cream background (`--cream` / #E8E2D9)
- "JOURNAL" in Playfair Black, large, left-aligned
- Featured post: large card at top — hero image (full width, 50vh), title overlaid (Playfair italic), date + category (DM Sans)
- Below: 2-column grid of post cards
  - Each card: image top, title (Playfair), date + reading time (DM Sans), brief excerpt
  - Hover: image zooms slightly, title underline draws in gold
- Categories sidebar or top filter: Fashion, Jewellery, Behind the Lens, Industry

**Mobile:**
- Single column
- Featured post: full-width image card
- Post list below

---

#### Post Detail (`/journal/[slug]`)
**Desktop:**
- Cream background for readability
- Article layout:
  - Title: Playfair italic, large, centered
  - Meta: date, category, reading time — DM Sans, centered, 40% opacity
  - Hero image: full-width, rounded corners
  - Body: DM Sans 400, max-width 720px, centered, generous line-height (1.8)
  - Pull quotes: Playfair italic, larger, indented, gold left-border
  - Images within article: full-width or side-by-side, with captions
- **Share:** Same pattern as portfolio — Web Share API on mobile, copy-link on desktop
- Bottom: related posts, 3 cards horizontal

**Mobile:**
- Same but single column, smaller margins

---

### 3.5 SEARCH (Global)
> Accessible from nav bar — small search icon next to INQUIRE button.

**Desktop:**
- Click search icon → full-screen dark overlay with large centered input field
- Input: Playfair italic placeholder "Search projects, journal, workshops...", gold cursor
- Results appear below as user types (debounced 300ms)
- Results grouped by type: PORTFOLIO / JOURNAL / WORKSHOPS — max 3 per group
- Each result: thumbnail + title + type badge
- Click result → navigates to page, overlay closes
- Escape or click outside → closes
- **Implementation:** Client-side search using pre-built JSON index (generated at build time from all content). No server-side search needed at launch scale.

**Mobile:**
- Search icon in nav (alongside hamburger)
- Same full-screen overlay but input at top, results scrollable below
- Keyboard auto-opens on tap

---

### 3.6 STUDIO (`/studio`)
> Services in depth. What Neelakar does and how.

---

#### Section 1: HERO
**Desktop:**
- Dark background
- "THE STUDIO" in Playfair Black, massive, centered
- Below: "Where craft meets conviction." in DM Sans, 40% opacity
- Atmospheric background — subtle gradient or studio photograph at low opacity

**Mobile:**
- Same, smaller type

---

#### Section 2: SERVICES DEEP-DIVE
**Desktop:**
- 5 services, each gets a dedicated scroll section:
  1. **Editorial Photography** — "We create the image your client didn't know they needed."
  2. **Fashion Documentation** — "Every stitch, every fold, every intention — documented."
  3. **Fashion Cinematography** — "Moving images that stop people."
  4. **Aesthetic E-Commerce** — "Product photography that sells without trying."
  5. **Visual Identity Systems** — "Your brand, codified into a visual language."

- Each service section layout (alternating left/right):
  - One side: large sample photo/work example
  - Other side: service name (All Round Gothic bold), description paragraph (DM Sans), key deliverables list, "SEE WORK" link (gold, arrow)
  - Decorative number (01-05) large, 10% opacity

**Scroll animation:**
- Each service: image wipes in from the side (clipPath), text staggers from opposite side
- Alternating direction creates visual rhythm (left-right-left-right)
- Smooth transitions between services
- NOT pinned — natural scroll, elements animate as they enter viewport

**Mobile:**
- Vertical stack: image, then text for each service
- Full-width images
- Simpler fade-in animations

---

#### Section 3: PROCESS (The Approach)
- Same as About page Section 3
- Can be a shared component

---

#### Section 4: CTA
- "Have a project in mind?" → INQUIRE

---

### 3.6 WORKSHOPS (`/workshops`)
> Education offerings. Upcoming workshops, past events, enrollment.

---

#### Section 1: HERO
**Desktop:**
- Dark background
- "SHARE THE CRAFT" in Playfair italic, large, centered
- Below: "Learn from the artists who create the images you admire." (DM Sans)
- Background: subtle workshop/teaching photo at low opacity

---

#### Section 2: UPCOMING WORKSHOPS
**Empty state (no upcoming workshops):**
- "New workshops are being crafted. Leave your email to be first to know." + email capture input (gold underline style) + "NOTIFY ME" button
- Below: "In the meantime, explore our past workshops." link to section 4

**Desktop:**
- Cards layout — 2 or 3 columns
- Each card:
  - Workshop image (top, rounded corners)
  - Title (All Round Gothic bold)
  - Date + duration (DM Sans, gold color)
  - Brief description
  - Price
  - "ENROLL" button (bordered, gold)
- Hover: card lifts, image zooms, gold border appears

**Mobile:**
- Single column cards, full-width
- "ENROLL" button prominent

---

#### Section 3: WHAT YOU'LL LEARN
**Desktop:**
- Cream background
- Grid or list of topics/curriculum highlights
- Icons or numbers for each topic
- Testimonials from past attendees (if available)

---

#### Section 4: PAST WORKSHOPS
**Desktop:**
- Photo gallery grid from past workshops
- Hover: image lightboxes or expands

---

#### Section 5: CTA
- "Ready to learn?" → Enrollment form or link to Inquire

---

### 3.7 INQUIRE (`/inquire`)
> THE STAR PAGE. Ashley Brooke-inspired storytelling onboarding form. This is NOT a boring contact form — it's an experience.

---

**Overall concept:**
- Full-screen, one question per step
- Dark background throughout
- Progress indicator: thin gold line at top, grows with each step
- Each step transitions with smooth animation (slide/fade)
- Personality-driven copy — warm, human, slightly witty
- Total steps: 6-7

---

#### Step 1: WELCOME
**What user sees:**
- Full viewport, centered text
- "Let's begin." in Playfair italic, large, gold
- "Every great collaboration starts with a conversation." (DM Sans, 40% opacity)
- "START" button or scroll indicator → animated arrow pointing down
- Atmospheric: subtle gold particles floating slowly (very sparse, ambient)

---

#### Step 2: WHO ARE YOU?
**Question:** "First things first — tell us about yourself."
- Fields:
  - "Your name" (text input)
  - "Your brand / company" (text input)
  - "Your email" (text input)
- Inputs: minimal, underline-only style, large text, gold cursor/focus indicator
- Animated label: moves up on focus (like material design but elegant)
- "NEXT" button or scroll to continue

---

#### Step 3: WHAT BRINGS YOU HERE?
**Question:** "What world do you live in?"
- Visual selector — large clickable cards:
  - "FASHION" — with fashion icon/image, brief description
  - "JEWELLERY" — with jewellery icon/image
  - "FILM & CINEMA" — with film icon/image
  - "WORKSHOPS" — with workshop icon/image
  - "SOMETHING ELSE" — open-ended
- Cards: dark with subtle borders, hover fills with gold gradient at 5% opacity
- Selected: gold border, checkmark, slight scale up
- Can select multiple

---

#### Step 4: TELL US MORE
**Question:** "Paint us a picture. What's the vision?"
- Large textarea with placeholder: "Don't hold back — we love dreamers."
- Below: optional selectors for:
  - "Timeline: Yesterday / This month / This quarter / No rush, perfection takes time"
  - "Budget range: Let's talk / $$ / $$$ / $$$$"
- Selections are pill buttons, gold border on selected
- Copy tone: friendly, encouraging, not corporate

---

#### Step 5: THE FUN QUESTION
**Question:** "One more thing — just for fun."
- "If your brand were a film, what would it be?" (text input)
- OR: "Describe your brand in exactly 3 words." (3 small inputs)
- OR: "What's a brand you secretly admire? (We won't tell.)" (text input)
- This question changes randomly or cycles — adds personality
- Light, playful tone. Gold accent on the question mark.

---

#### Step 6: REVIEW & SEND
**What user sees:**
- Summary of all their answers, elegantly laid out
- Each answer: label in DM Sans uppercase small, answer in Playfair italic
- "Edit" link next to each (takes back to that step)
- Bottom: "SEND" button, large, gold filled, black text
- Below button: "We typically respond within 24 hours." (DM Sans, 30% opacity)

---

#### Step 7: THANK YOU
**What user sees:**
- Full viewport, centered
- "Thank you, [Name]." in Playfair italic, large, gold
- "We're already excited." in DM Sans
- Animated: confetti-style gold particles burst briefly, then calm
- "While you wait, explore our work." → link to Portfolio
- Logo at bottom, subtle

**Scroll animations throughout form:**
- Each step fades/slides in from bottom when entering, fades/slides out top when leaving
- Progress bar at top grows with gold fill
- Inputs have subtle focus animations (underline draws in gold)
- Card selections have satisfying micro-animations (slight bounce on select)

**Mobile:**
- Same step-by-step experience
- Full-screen per question
- Larger touch targets for cards and pills
- Keyboard-aware — form fields don't get hidden behind keyboard
- Swipe between steps (optional) or scroll

---

## 3.5 EASING REFERENCE MAP

> Single source of truth for all easing curves used across the site. Pick from this list — don't invent new ones.

| Name | GSAP Ease | CSS equivalent | When to use |
|------|-----------|---------------|-------------|
| **Smooth out** | `power2.out` | `cubic-bezier(0.22, 1, 0.36, 1)` | DEFAULT for most entrances — fade-ins, reveals, stagger items appearing |
| **Smooth in-out** | `power2.inOut` | `cubic-bezier(0.45, 0, 0.55, 1)` | Two-way transitions — page transitions, elements entering AND exiting, wipes |
| **Gentle out** | `power1.out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Very subtle movement — parallax, slow drifts, pen cursor moving |
| **Gentle in-out** | `power1.inOut` | `cubic-bezier(0.42, 0, 0.58, 1)` | Slow symmetrical — horizontal scroll, gallery image scaling |
| **Dramatic out** | `power3.out` | `cubic-bezier(0.08, 0.82, 0.17, 1)` | Hero title character animation — fast start, long settle |
| **Bounce entry** | `back.out(2)` | n/a (use GSAP) | Preloader logo bounce — slight overshoot for personality |
| **Elastic return** | `elastic.out(1, 0.3)` | n/a (use GSAP) | Magnetic button snapping back to position on mouse leave |
| **Linear** | `none` | `linear` | Progress bar, scroll indicator — should feel 1:1 with input |

**Rule:** If you're not sure which ease to use, use `power2.out`. It works for 80% of cases.

---

## EFFECTS BIBLE — The "How It Feels" Layer
> This section defines every visual effect, animation technique, and interaction pattern used across the site. This is what separates a layout from an experience.

---

### E1. SCROLL ANIMATION SYSTEM

#### Scroll Philosophy
- **Pacing:** User must have TIME to absorb each element. Nothing should rush. Inspired by Noomo — the scroll should feel like turning pages of a luxury magazine.
- **Rhythm:** Alternate between high-intensity moments (big reveals, image transitions) and breathing room (simple fades, static content). Never two intense sections back-to-back.
- **Scrub values:** GSAP ScrollTrigger scrub: 2-4 (higher = smoother/slower). Heavier content sections use higher scrub for buttery feel.

#### Scroll-Triggered Reveal Types

**Type A: Fade + Rise**
- Element starts: `opacity: 0, y: 40px`
- Animates to: `opacity: 1, y: 0`
- Ease: `power2.out`
- Duration: 0.8s (in scrub time: ~0.15 of timeline)
- Use for: Body text, labels, descriptions, secondary elements
- Stagger: 0.05s between siblings

**Type B: ClipPath Wipe**
- Element starts: `clipPath: inset(0 100% 0 0)` (hidden from right)
- Animates to: `clipPath: inset(0 0% 0 0)` (fully visible)
- Ease: `power2.inOut`
- Variants: wipe from left, right, top, bottom — direction matches the element's visual weight
- Use for: Images, headline text, decorative lines
- Can include a thin "wipe line" (2px gold or white line) that leads the reveal — line moves across, content appears behind it

**Type C: Scale + Fade (Image Entrance)**
- Element starts: `scale: 0.85, opacity: 0`
- Animates to: `scale: 1, opacity: 1`
- Ease: `power2.out`
- Use for: Photos entering viewport, cards, gallery items
- Adds depth without actual 3D

**Type D: Split Text Animation**
- Headline text split into individual characters or words using GSAP SplitText (or manual span wrapping)
- Each character/word animates independently:
  - `opacity: 0, y: 20px, rotationX: -45deg` → `opacity: 1, y: 0, rotationX: 0`
  - Stagger: 0.02s per character, 0.05s per word
- Use with `perspective: 600px` on parent for subtle 3D rotation feel
- Use for: Major headlines, section titles, hero text
- Creates the "letters falling into place" effect (like Rejouice/Dennis Snellenberg)

**Type E: Parallax Layers**
- Multiple elements move at different scroll speeds creating depth illusion
- Background layer: moves at 0.3x scroll speed
- Content layer: moves at 1x (normal)
- Foreground decorative elements: move at 1.3x
- Use `force3D: true` for GPU acceleration
- Perspective container: `perspective: 1000px` on parent, children use `translateZ` values
- This creates convincing depth WITHOUT Three.js/WebGL

**Type F: Horizontal Scroll Pin**
- Container is pinned (position: fixed during scroll range)
- Vertical scroll input drives horizontal translateX movement
- Content slides left as user scrolls down
- Pin duration: (number of items) * 300-400vh
- Items can have their own entry/exit animations within the horizontal movement
- Use for: Campaigns gallery, The Approach steps

---

### E2. HOVER & MICRO-INTERACTION EFFECTS

#### Image Hover Effects

**Effect: Zoom + Overlay**
- On hover: image scales 1 → 1.05 over 0.4s, ease: `power2.out`
- Dark overlay fades in (rgba(0,0,0,0.3))
- Project title fades in from bottom (y: 20 → 0, opacity: 0 → 1)
- Gold accent line draws in below title (scaleX: 0 → 1)
- On mouse leave: everything reverses smoothly
- Transition: 0.4s all, ease: `power2.inOut`

**Effect: Perspective Tilt (Fake 3D)**
- On hover: image container tilts toward cursor position
- Uses CSS `perspective: 800px` on parent
- JavaScript tracks mouse position relative to element center
- Maps to `rotateX` (max +-8deg) and `rotateY` (max +-8deg)
- Creates the illusion that the image is a 3D card
- Subtle `translateZ: 20px` on hover for "lifting" effect
- Light reflection: a radial gradient overlay follows cursor position (white, 5% opacity) — simulates light catching the surface
- On leave: smoothly returns to flat (0deg, 0deg) with slight bounce ease
- Use for: Portfolio grid thumbnails, service cards, workshop cards
- This is the FAKE 3D that gives the Unseen/Lusion feel without WebGL

**Effect: Image Distortion Hover**
- On hover: image gets a subtle CSS `filter` shift
- `filter: contrast(1.05) saturate(1.1) brightness(1.02)` — image "comes alive"
- Combined with the tilt effect above for maximum impact
- On leave: returns to normal

#### Button / Link Hover Effects

**Effect: Magnetic Pull**
- As cursor approaches button (within 100px radius), button moves slightly toward cursor
- Uses GSAP quickTo for smooth interpolation
- Movement: max 8px in any direction
- On leave: button returns to original position with elastic ease
- Combines with cursor scaling (cursor grows near buttons)

**Effect: Underline Draw**
- Links have no underline by default
- On hover: gold underline draws from left to right (pseudo-element, scaleX: 0 → 1, transformOrigin: left)
- Duration: 0.3s, ease: `power2.out`
- On leave: underline retracts from left to right (transformOrigin changes to right, scaleX: 1 → 0)

**Effect: Button Fill**
- Bordered buttons (gold border, transparent bg)
- On hover: gold background fills from left to right (pseudo-element sliding in)
- Text color inverts (gold → dark)
- Duration: 0.4s, ease: `power2.inOut`

**Effect: Card Lift**
- Service/workshop cards on hover:
- `translateY: -8px`, `box-shadow` deepens
- Gold border animates around the card (border draws clockwise from top-left corner)
- Content inside shifts slightly (`translateY: -2px`) — parallax within the card
- Duration: 0.3s

#### Text Hover Effects

**Effect: Character Spread**
- On hover over a word/title, letters spread apart slightly (`letterSpacing` increases by 0.05em)
- Duration: 0.3s, ease: `power2.out`
- Subtle but adds life to static text

**Effect: Color Shift**
- Text transitions from white/ink to gold on hover
- Duration: 0.2s
- For nav links, labels, interactive text

---

### E3. CURSOR SYSTEM (Desktop Only)

**Implementation:** Custom div follows cursor position using GSAP quickTo (lerped, slightly delayed for smooth trailing)

| State | Size | Style | Trigger |
|-------|------|-------|---------|
| Default | 12px | Circle, 1px gold border, mix-blend-mode: difference | Always |
| Hovering link/button | 60px | Circle, gold fill at 8% opacity, border expands | mouseenter on interactive |
| Hovering image | 80px | Circle with "VIEW" text inside (DM Sans, 10px, white) | mouseenter on clickable images |
| Hovering draggable | 80px | Circle with "DRAG" text + arrows | mouseenter on draggable galleries |
| Clicking | 10px | Circle shrinks briefly then bounces back | mousedown/mouseup |
| Over text input | hidden | Native cursor takes over | mouseenter on inputs |

**Cursor blend:** `mix-blend-mode: difference` makes it visible on both light and dark backgrounds

**Mobile:** Custom cursor is completely disabled. All hover states are removed. Touch interactions use active states (brief scale/opacity change on tap).

---

### E4. PAGE TRANSITION EFFECTS

**Between pages (using Next.js App Router + Framer Motion AnimatePresence):**

**Exit animation (current page):**
1. Content fades out: `opacity: 1 → 0`, duration: 0.3s
2. Simultaneously: slight scale down `1 → 0.98`
3. Dark overlay fades in from edges

**Enter animation (new page):**
1. Dark overlay covers screen
2. New page content is positioned below viewport
3. Overlay wipes away (clipPath from top to bottom)
4. Content rises in: `y: 30 → 0, opacity: 0 → 1`, duration: 0.5s
5. Stagger: hero elements animate in with 0.05s delays

**Total transition time:** ~0.8s
**Ease:** `power2.inOut`

**During transition:** Nav bar remains visible and stable (doesn't animate)

---

### E5. TEXT ANIMATION EFFECTS

#### Hero Title Animation (on page load)
- Text split into individual characters
- Each character: `opacity: 0, y: 100%, rotateX: -90deg`
- Stagger reveal: 0.03s per character
- Ease: `power3.out`
- Parent has `perspective: 600px` for 3D rotation depth
- Creates dramatic "letters flipping into place" entrance

#### Section Title Animation (on scroll)
- Text split into words
- Each word: `opacity: 0, y: 30px`
- Stagger: 0.05s per word
- Ease: `power2.out`
- Simpler than hero but still dynamic

#### Typewriter / Writing Effect (for Nusrat cursive words)
- Gold pen cursor (2px wide gold line) positioned at start of word
- Pen moves left → right across the word width
- ClipPath reveals text behind the pen: `inset(0 100% 0 0)` → `inset(0 0% 0 0)`
- Pen has glow: `filter: drop-shadow(0 0 6px #C8A96E)`
- At end: pen fades out, word is fully visible
- Duration: matched to scroll speed (~0.2 of timeline)
- Mobile: pen cursor hidden, text just fades in with gold color

#### Counter / Number Animation
- Numbers (01, 02, 03...) count up from 00 to target
- Each digit rolls like an odometer (translateY animation through 0-9)
- Duration: 0.6s per digit
- Triggers when element enters viewport
- Use for: section numbers, statistics, progress indicators

---

### E6. IMAGE TREATMENT EFFECTS

#### Parallax Image (within container)
- Image is 120% height of its container
- On scroll: image translateY moves at 0.2-0.3 rate relative to container
- Creates depth: image seems to exist "behind" the frame
- Container has `overflow: hidden` to mask the extra image area
- Use for: hero images, background photos

#### Image Reveal with Wipe Line
- Image starts hidden: `clipPath: inset(0 100% 0 0)`
- Thin gold line (2px) appears at the reveal edge
- Line moves across, image is revealed behind it
- Line has glow: `box-shadow: 0 0 8px rgba(200,169,110,0.4)`
- After full reveal: line fades out
- Creates editorial "curtain pull" feeling

#### Image Grain Overlay
- Each image has a subtle noise overlay (same SVG as global noise but at 3% opacity)
- Gives a film photography texture to digital images
- Applied via pseudo-element on image containers

#### Gallery Image Transitions (Campaigns Section)
- Image enters: starts at `scale: 0.4, x: 80vw` (small, off-screen right)
- Scrolls to center: `scale: 1, x: 0` (full viewport)
- Continues scrolling: `scale: 0.4, x: -80vw` (shrinks, exits left)
- Ease: `power2.inOut` for both enter and exit
- During center position: project details overlay fades in
- Between images: brief moment of dark-only (0.5s of timeline) — breathing room

---

### E7. BACKGROUND & ATMOSPHERE EFFECTS

#### Dark-to-Light Section Transitions
- NO separate gradient divs (they create seams)
- Each section that needs a color shift bakes the gradient into its own background
- Pattern: `linear-gradient(to bottom, var(--dark) 0%, var(--dark) 5%, #3a3a3a 15%, var(--mid-gray) 25%, var(--cream) 35%, var(--cream) 65%, var(--mid-gray) 75%, #3a3a3a 85%, var(--dark) 95%, var(--dark) 100%)`
- Content sits in the middle "cream zone"
- Transition zone uses neutral gray intermediaries (#3a3a3a, #6a6a6a, #999999) — NO colored tints

#### Warm Brown Atmosphere (Jewellery Sections)
- Radial gradient overlay centered on section
- Color: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(58,42,26,0.15) 0%, transparent 70%)`
- Creates warm, smoky atmosphere without obscuring content
- Animated: gradient slowly pulses opacity (0.1 → 0.18 → 0.1) over 8s, looping
- CSS animation, not JS — zero performance cost

#### Ambient Gold Particles (Inquire page, CTA sections)
- Canvas-based particle system (lightweight, ~30 particles max)
- Particles: tiny gold dots (2-4px), very low opacity (0.1-0.2)
- Movement: slow float upward with slight horizontal drift
- Spawn: random positions, continuous gentle spawn
- Creates luxurious atmospheric feel without being distracting
- Performance: requestAnimationFrame, paused when not in viewport (IntersectionObserver)

#### Film Grain Noise (Global)
- Fixed overlay, covers entire viewport
- SVG-based fractalNoise texture
- Opacity: 0.04
- Mix-blend-mode: multiply
- Adds subtle analog/film texture to everything
- Static (not animated) — zero performance cost

---

### E8. LOADING & STATE TRANSITIONS

#### Preloader Sequence (detailed)
1. **0.0s:** Black screen (#060F0B)
2. **0.2s:** Logo mark (NCH_logo_white.png) appears at center — `scale: 0 → 1, opacity: 0 → 1`, ease: `back.out(2)` (slight overshoot bounce)
3. **0.8s:** Logo breathes — `scale: 1 → 1.05 → 1`, gentle pulse
4. **1.2s:** Gold horizontal line draws outward from center below logo — `scaleX: 0 → 1`, width: 200px
5. **1.4s:** "NEELAKAR" text appears below line — split into characters, each fades in with stagger (0.04s per char), `y: 10 → 0`
6. **2.0s:** Progress counter in bottom-right hits "100"
7. **2.2s:** Everything scales up slightly and fades out — `scale: 1 → 1.1, opacity: 1 → 0`
8. **2.5s:** Page content fades in — hero section elements stagger-animate into view
- **Timing functions:** All eases are `power2.inOut` unless specified
- **Skip:** On repeat visits (sessionStorage flag), preloader is skipped — page loads directly with hero animations

#### Image Loading States
- Images use Next.js blur placeholder or solid color placeholder (matching section background)
- On load: image fades in `opacity: 0 → 1` over 0.3s
- No skeleton screens — too techy. Use solid color blocks that match the ambient color.

#### Section Loading (Scroll)
- Sections below the fold are idle until user scrolls near them
- ScrollTrigger `start: "top 85%"` triggers entrance animations before element is fully in view
- Creates the feeling that content appears "just in time" — responsive to the user

---

### E9. SOUND DESIGN (Optional Enhancement)

> Sound is optional but adds massive immersion. User should be able to mute via toggle.

| Trigger | Sound | Character |
|---------|-------|-----------|
| Page load complete | Soft ambient tone (0.5s) | Like a room "waking up" |
| Section transition | Subtle whoosh (0.2s) | Fabric movement / page turning |
| Button click | Soft click/tap (0.1s) | Mechanical, satisfying |
| Image hover | Faint shutter click (0.1s) | Camera-inspired (Lusion reference) |
| Form step advance | Gentle chime (0.3s) | Progression, positive |
| Form submission | Warm confirmation tone (0.5s) | Completion, warmth |

- Volume: very low (10-15% max) — subtle, not annoying
- Format: Web Audio API with small .mp3 files (<20kb each)
- Mute toggle: small speaker icon in footer or nav, remembers preference in localStorage
- Mobile: sound disabled by default (autoplay policy), user can opt-in

---

### E10. FAKE 3D TECHNIQUES (No WebGL Required)

> These CSS/GSAP tricks create convincing depth and dimensionality without Three.js.

#### Technique 1: Perspective Card Tilt
```
Parent: perspective: 800px
Child on hover: rotateX(Ydeg) rotateY(Xdeg) translateZ(20px)
Light overlay: radial-gradient follows cursor
```
- Makes flat cards feel like physical objects
- Use on: portfolio thumbnails, service cards, workshop cards

#### Technique 2: Layered Parallax Depth
```
Container: perspective: 1200px, overflow: hidden
Layer 1 (back): translateZ(-200px) scale(1.2) — moves slow
Layer 2 (mid): translateZ(0) — normal speed
Layer 3 (front): translateZ(100px) scale(0.9) — moves fast
```
- Creates genuine depth perception on scroll
- Use on: hero sections, about page

#### Technique 3: CSS 3D Text
```
Text container: perspective: 600px
Characters: rotateX(-90deg) → rotateX(0deg) with stagger
```
- Letters appear to "flip into place" from a 3D rotation
- Use on: hero titles, section headlines

#### Technique 4: Image Stack Depth
```
Multiple overlapping images with different translateZ values
On scroll: images spread apart (z-values increase)
Creates "exploded view" of a stack
```
- Use on: portfolio preview, about page photo arrangements

#### Technique 5: Smooth Scale Transitions
```
Image enters at scale(0.4) from side
Smoothly scales to scale(1) as it reaches center viewport
Continues to scale(0.4) as it exits
```
- The scale change combined with position creates depth perception
- Use on: campaigns gallery, portfolio carousel

---

## 4. MOBILE-SPECIFIC GUIDELINES

### General Rules
- All sections must work on 375px width minimum (iPhone SE)
- Test on 390px (iPhone 14) and 430px (iPhone 14 Pro Max) as primary targets
- No horizontal scroll (except intentional galleries with indicators)
- Touch targets: minimum 44x44px
- Font sizes: use clamp() with mobile-friendly minimums

### Animation Adaptations
| Desktop Effect | Mobile Adaptation |
|---------------|-------------------|
| Custom cursor + magnetic hover | Remove entirely — native touch |
| Horizontal scroll galleries | Vertical stack OR horizontal swipe with indicators |
| Parallax (multi-layer) | Single-layer parallax or static |
| Complex clipPath reveals | Simple opacity + translateY fades |
| Pen-cursor writing animation | Fade-in reveal (no pen) |
| Scale 0.4 → 1 image transitions | Scale 0.9 → 1 (subtler) |
| Decorative large letters/numbers | Remove or reduce opacity further |
| Pin duration 400vh+ | Reduce to 250-300vh |

### Navigation Mobile
- Hamburger menu (not bottom tab bar)
- Full-screen overlay menu
- Logo always visible top-left

### Images Mobile
- Lazy loading essential
- Serve smaller image sizes (srcset/sizes)
- Object-fit: cover with art-direction cropping where needed

---

## 5. PERFORMANCE GUIDELINES

### Core Web Vitals Targets
| Metric | Target | Notes |
|--------|--------|-------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Hero image is likely the LCP element — priority load, use `priority` on Next.js Image |
| **FID** (First Input Delay) | < 100ms | GSAP registering on main thread could block — defer non-critical scroll triggers |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Reserve explicit dimensions for all images, set font-display: swap with size-adjust |
| **INP** (Interaction to Next Paint) | < 200ms | No heavy JS on click handlers — keep GSAP tweens lightweight |
| **TTFB** | < 800ms | Static/ISR pages on Vercel edge — no SSR blocking |

### Bundle Size Budget
| Asset | Max Size (gzipped) |
|-------|-------------------|
| First-load JS | < 120KB |
| GSAP + ScrollTrigger | ~30KB (tree-shake unused plugins) |
| Framer Motion | ~25KB (import only AnimatePresence + motion) |
| Lenis | ~5KB |
| Per-page JS | < 40KB |
| Total CSS | < 30KB |
| Fonts (all) | < 200KB total (subset to latin + latin-ext) |
| Hero image | < 200KB (AVIF), < 400KB (WebP fallback) |
| Any single image | < 150KB at served size |

### Image Optimization Pipeline
1. Photographer delivers RAW/TIFF → exported to high-res JPEG (sRGB, 4000px longest edge)
2. Upload to project `/public/images/` or CMS
3. Next.js Image component auto-generates: AVIF → WebP → JPEG at responsive breakpoints
4. `sizes` attribute on every `<Image>`: tells browser which size to fetch
5. `placeholder="blur"` with `blurDataURL` — 10px base64 blur-up
6. Lazy loading by default; hero images use `priority={true}`

### Font Loading Strategy
- **Critical fonts** (All Round Gothic thin, DM Sans 400): preloaded in `<head>` via `next/font`
- **Non-critical** (Playfair Display, Nusrat): loaded with `font-display: swap`, triggered by first scroll or idle callback
- **Subsetting:** All fonts subset to `latin`, `latin-extended` (no Cyrillic/CJK — saves ~60% per font)
- **`size-adjust`** on fallback fonts to minimize CLS during swap

### Runtime Performance Rules
- GSAP: Register only ScrollTrigger (not all plugins). Clean up all ScrollTriggers on unmount via `ctx.revert()`
- Animations: `will-change` on animated properties, `force3D: true` for GPU acceleration
- Bundle: dynamic imports for heavy sections (Inquire form steps, portfolio gallery loaded on demand)
- Smooth scroll: Lenis is lightweight (~5KB); avoid heavy scroll libraries
- Canvas particles: capped at 30 particles max, paused via IntersectionObserver when off-screen
- Images below fold: native lazy loading + Next.js Image automatic optimization
- Reduce main thread work: no synchronous layout reads inside animation loops

---

## 6. TECH STACK

### Frontend
| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15+ (App Router) | ISR for portfolio/journal, Server Components, streaming |
| **Language** | TypeScript (strict mode) | Type safety on data models, props, API responses |
| **Styling** | Tailwind CSS v4 + inline styles for dynamic GSAP values | Utility classes for layout, inline for animation-controlled properties |
| **Scroll Animation** | GSAP + ScrollTrigger | Industry standard for scroll-driven animations, scrub/pin support |
| **Page Transitions** | Framer Motion (AnimatePresence) | Smooth enter/exit animations between routes |
| **Smooth Scroll** | Lenis | Lightweight (~5KB), smooth momentum scroll, integrates with GSAP |
| **Forms** | React Hook Form + Zod validation | Lightweight, performant, schema-based validation |
| **State** | React Context (minimal) + `useRef` for animation state | No Redux/Zustand needed — state is simple |

### Backend & Infrastructure
| Layer | Technology | Why |
|-------|-----------|-----|
| **API** | Next.js Server Actions + Route Handlers | Inquiry form submission, contact, newsletter |
| **Email** | Resend (or Nodemailer + SMTP) | Transactional emails — inquiry confirmation, admin notification |
| **CMS** | Sanity / Contentful (future) | Portfolio projects, journal posts, workshop listings |
| **Database** | Not required initially | CMS handles content; form submissions sent to email + optional Airtable/Google Sheets backup |
| **Deployment** | Vercel | Edge network, ISR, image optimization, analytics |
| **Analytics** | Vercel Analytics + Web Vitals | Performance monitoring, page views, custom events |
| **Domain** | Vercel DNS or external registrar | neelakar.com or neelakar.in |
| **CDN** | Vercel Edge Network (automatic) | Global asset delivery |

### Third-Party Services
| Service | Purpose | Required? |
|---------|---------|-----------|
| **Resend** | Inquiry form email delivery | Yes |
| **Google reCAPTCHA v3** (or Turnstile) | Spam protection on inquiry form | Yes |
| **Instagram Basic Display API** | Live feed in footer | Optional |
| **Google Analytics 4** | Advanced analytics if Vercel Analytics isn't enough | Optional |
| **Airtable / Google Sheets** | Inquiry backup (failsafe if email fails) | Recommended |
| **WhatsApp Business API** | Quick contact link (Indian market) | Optional |
| **Vercel Blob** | Video/image storage if CMS not yet connected | Optional |

### Environment Variables Needed
```
# Email
RESEND_API_KEY=
ADMIN_EMAIL=hello@neelakar.com
FROM_EMAIL=no-reply@neelakar.com

# Spam Protection
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Instagram (optional)
INSTAGRAM_ACCESS_TOKEN=

# Analytics (optional)
NEXT_PUBLIC_GA_ID=

# CMS (future)
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_TOKEN=

# General
NEXT_PUBLIC_SITE_URL=https://neelakar.com
```

---

## 7. SITEMAP

```
/                       → Home (scroll experience)
/about                  → About (story, approach, team)
/portfolio              → Portfolio grid (filterable)
/portfolio/[slug]       → Project detail (magazine layout)
/journal                → Blog listing
/journal/[slug]         → Blog post
/studio                 → Services deep-dive
/workshops              → Workshop listings
/inquire                → Storytelling onboarding form
```

---

## 8. REFERENCE SITES (for mood/direction)

| Site | What to take from it |
|------|---------------------|
| **ashleybrookecs.com** | Section division, handwriting+bold mix, cards, INQUIRY FORMS (primary inspiration for /inquire) |
| **rejouice.com** | GSAP scroll-pin mechanics, horizontal+vertical scroll mix, parallax, editorial |
| **off.site** | Light/dark gradient transitions, clean typography, atmospheric feel |
| **heycusp.com** | Scroll + hover craft, text/image placement, flow |
| **maxandtiber.com** | Smooth fashion photo transitions, high-end scroll |
| **21tsi.com** | Narrative scroll storytelling (for /about) |
| **Aegean mockup** | Hero layout (photo overlapping text), numbered sections, editorial grid |
| **Gentle Monster (Men's Folio)** | Magazine editorial spread layout for portfolio/services |
| **Unseen.co** | Immersive experience, creative cursor, smoothness |
| **OHZI** | Experiential scroll, gamified feel, sound design |
| **Noomo** | Pacing — giving user time, smooth and soothing |

---

## 9. ADDITIONAL PAGES & STATES

### 9.1 Workshop Detail Page (`/workshops/[slug]`)
**Desktop:**
- Hero: workshop title (Playfair italic, large) + atmospheric photo + date badge (gold bordered pill)
- Info bar: Duration, Skill Level, Max Seats, Price — horizontal row, DM Sans, icon + text
- Description: two-column layout — left: what you'll learn (numbered list), right: large workshop image
- Instructor section: photo + bio + credentials
- Schedule: timeline layout, each session with time + topic
- Testimonials: past attendee quotes in Playfair italic, with names in DM Sans
- CTA: "RESERVE YOUR SPOT" button, large, gold filled, sticky on mobile

**Scroll animation:**
- Hero image parallax
- Info bar items stagger in from bottom
- Each curriculum item reveals on scroll (Type A: Fade + Rise)
- Testimonials slide in alternating left/right

**Mobile:**
- Single column, hero image full-width
- Sticky "RESERVE" button at bottom (fixed)
- Collapsible schedule sections

---

### 9.2 404 Page (`/not-found`)
- Dark background, full viewport
- Center: "404" in Playfair Display Black, massive (20vw), gold, very low opacity (15%)
- Below: "The page you're looking for has been moved, or never existed." in DM Sans, white 40%
- Below: "Go Home" link — gold, with arrow, magnetic hover
- Ambient: subtle gold particles floating (same as Inquire welcome)
- Easter egg: on hover over "404", the numbers scramble briefly then settle back (GSAP random character animation)
- Mobile: same but smaller typography

---

### 9.3 Loading / Skeleton States
- No skeleton screens (too techy for luxury brand)
- Page transitions use dark overlay — new content loads behind it
- Images: solid color placeholder matching section background → fade in on load
- If content takes >1s: gold pulsing dot (single, centered, 8px) as loading indicator
- Never show spinner or progress bar for page loads — only the preloader on first visit

---

## 10. VIDEO CONTENT HANDLING

> Neelakar does cinematography — video is part of their portfolio.

### Video Embed Rules
- Videos use HTML5 `<video>` with custom controls (not YouTube/Vimeo embed — too branded)
- Custom play button: large gold circle (80px) with gold triangle play icon, centered on video thumbnail
- On hover: play button scales 1 → 1.1, glow increases
- On click: play button fades out, video starts
- Controls: minimal custom bar at bottom — progress (gold line), mute toggle, fullscreen
- Autoplay: NEVER autoplay with sound. Short loops (showreel clips) can autoplay muted in hero sections.
- Mobile: native controls fallback (custom controls are unreliable on iOS)

### Video in Portfolio
- Project detail pages can include video sections
- Video hero: muted autoplay loop as background (like a living photo), with option to unmute / play full
- Full videos: embedded with custom player in the content flow
- Thumbnail: first frame with film grain overlay + play button

### Showreel
- Optional: homepage hero could have a subtle muted video loop instead of static photo
- Video should be short (8-15s), seamless loop, cinematic, no cuts
- Compressed: max 5MB for fast load, WebM + MP4 fallback
- Poster frame loads immediately, video streams in behind

---

## 11. SOCIAL & INTEGRATIONS

### Instagram Integration
- Footer or About page: live Instagram feed grid (last 6-9 posts)
- 3x3 grid on desktop, 3x2 on mobile
- Each post: square thumbnail, hover shows like count + caption preview
- "FOLLOW @NEELAKAR" link below grid, gold
- Use Instagram Basic Display API or a service like Elfsight
- Fallback: if API fails, show curated static images (not blank space)

### Social Links
- Present in: footer, about page, mobile menu
- Platforms: Instagram (primary), YouTube (for cinematography), Pinterest (mood boards), LinkedIn (B2B credibility)
- Icons: minimal line style, white 30% opacity, hover transitions to gold 100%
- No Facebook or Twitter — not the audience

### WhatsApp Quick Contact (optional, for Indian market)
- Small floating WhatsApp icon, bottom-right corner
- Only visible on mobile
- Pre-filled message: "Hi, I'm interested in Neelakar's services."
- Green icon with subtle dark bg circle
- Slides in after 5 seconds (not immediately — let the experience breathe first)

---

## 12. ACCESSIBILITY & REDUCED MOTION

### Accessibility Standards
- WCAG 2.1 AA compliance minimum
- All images: meaningful alt text (not "image1.jpg")
- Focus indicators: gold outline (2px) on all interactive elements when using keyboard
- Skip-to-content link: hidden visually, appears on Tab key press
- Color contrast: text meets 4.5:1 ratio minimum (gold on dark = 4.8:1 ✓, ink on cream = 12:1 ✓)
- Form labels: always associated with inputs (even if visually hidden)
- Aria labels on: custom cursor target areas, icon buttons, decorative elements

### Reduced Motion
- Respect `prefers-reduced-motion: reduce` media query
- When active:
  - All GSAP scroll animations → instant (no tweening)
  - Parallax → disabled (static positions)
  - Page transitions → simple fade (no clip-path, no scale)
  - Preloader → skipped entirely
  - Hover effects → simple opacity change only (no scale, no tilt, no magnetic)
  - Particles → disabled
  - Sound → disabled
- The site should still look beautiful and make sense without any motion

### Keyboard Navigation
- Tab order follows visual layout (top→bottom, left→right)
- Interactive elements: buttons, links, form fields, cards (with role="button")
- Escape key: closes mobile menu, exits lightbox
- Arrow keys: navigate within gallery, form steps
- Enter/Space: activate buttons, select cards

---

## 13. SEO & META (Per Page)

| Page | Title | Description | OG Image |
|------|-------|-------------|----------|
| Home | Neelakar Creative House — Best Creative Studio in Hyderabad | High-fashion photography, jewellery cinematography & brand identity for Hyderabad's luxury designers. | Hero image with logo overlay |
| About | About Neelakar — The Story Behind the Lens | Meet the creative house dedicated to immortalizing Hyderabad's fashion and jewellery heritage. | Team/studio atmospheric photo |
| Portfolio | Portfolio — Neelakar Creative House | Explore our editorial campaigns, lookbooks, and brand films for fashion & jewellery. | Grid collage of best work |
| Studio | Studio Practices — Neelakar Creative House | Editorial photography, fashion cinematography, e-commerce & visual identity systems. | Studio/equipment photo |
| Workshops | Workshops — Learn from Neelakar | Hands-on photography and cinematography workshops for aspiring creatives in Hyderabad. | Workshop BTS photo |
| Journal | Journal — Neelakar Creative House | Behind-the-scenes stories, industry insights, and creative process from our studio. | Latest featured post image |
| Inquire | Inquire — Start Your Story with Neelakar | Tell us about your brand and vision. Every great collaboration starts with a conversation. | Elegant dark/gold branded graphic |

### Structured Data (JSON-LD)
- **Home:** LocalBusiness schema (name, address, coordinates, services, images)
- **Portfolio/[slug]:** CreativeWork schema (name, creator, datePublished, image)
- **Journal/[slug]:** Article schema (headline, author, datePublished, image)
- **Workshops:** Event schema (name, startDate, location, offers)
- **Inquire:** ContactPage schema

### Local SEO (Hyderabad targeting)
- geo meta tags: region=IN-TG, placename=Hyderabad
- Google My Business integration (link from footer)
- Keywords per page targeting "Hyderabad" + service type
- hreflang: en-IN (primary)

---

## 14. MICRO-COPY & TONE OF VOICE

### Brand Voice
- **Tone:** Confident but not arrogant. Warm but not casual. Poetic but not pretentious.
- **Think:** A master artisan who speaks softly but carries undeniable authority.
- **Never:** Corporate jargon ("synergy", "leverage"), startup speak ("disrupt", "pivot"), hard sell ("limited time", "act now").

### Key Copy Samples

**Hero tagline options (pick one):**
- "Cultivating Legacies. Architecting Desire."
- "Where craft becomes legacy."
- "Your vision, immortalized."

**Section labels (uppercase, tracking):**
- OUR MANIFESTO / OUR DOMAIN / SELECTED WORK / STUDIO PRACTICES / THE APPROACH

**CTA copy:**
- Primary: "BUILD YOUR NARRATIVE" or "INQUIRE"
- Secondary: "EXPLORE OUR WORK" / "SEE THE COLLECTION" / "LEARN MORE"
- Never: "Contact Us" / "Get Quote" / "Submit" (too generic)

**Inquire form copy (detailed):**
- Welcome: "Let's begin. Every great collaboration starts with a conversation. There are no wrong answers — only your story."
- Name field placeholder: "What should we call you?"
- Brand field placeholder: "The name behind the vision"
- Email field placeholder: "Where we'll send our love letters"
- Vision textarea placeholder: "Don't hold back — we love dreamers. Tell us everything: the mood, the materials, the feeling you want to capture."
- Timeline options: "Yesterday (we love urgency)" / "This month" / "This quarter" / "No rush — perfection takes time"
- Budget: "Let's just talk" / "Considered" / "Significant" / "Sky's the limit"
- Fun question: "Last one — if your brand walked into a room, what song would be playing?"
- Submit button: "SEND YOUR STORY"
- Thank you: "Thank you, [Name]. We're already excited about what's possible. Expect to hear from us within 24 hours — we don't keep dreamers waiting."

**Error states:**
- Empty required field: "This one matters — we need it to understand you."
- Invalid email: "That doesn't look quite right. Double-check?"
- Server error: "Something went wrong on our end. Try once more, or email us directly at hello@neelakar.com"

**404 page:**
- "This page has left the building. But the work hasn't — head home and start exploring."

---

## 15. FAVICON & BRANDING ASSETS

- **Favicon:** NCH logo mark, simplified for small size, white on transparent (SVG for sharp rendering)
- **Apple touch icon:** 180x180, NCH mark on dark background (#060F0B)
- **OG image default:** 1200x630, dark background, logo + "Neelakar Creative House" + tagline
- **Twitter card:** Same as OG image, formatted for summary_large_image
- **Safari pinned tab:** SVG silhouette of NCH mark, color: #C8A96E
- **PWA manifest:** name: "Neelakar Creative House", theme_color: #060F0B, background_color: #060F0B

---

## 16. DATA MODELS

> Content structures needed for CMS and local data files. Even before CMS is connected, use TypeScript interfaces matching these shapes with local JSON/MDX files.

### Portfolio Project
```typescript
interface Project {
  slug: string                    // URL-safe identifier: "brand-heritage-campaign"
  title: string                   // "Brand Heritage Campaign"
  client: string                  // "Tanishq"
  category: 'fashion' | 'jewellery' | 'film' | 'identity'
  subcategory?: string            // "Editorial", "Lookbook", "Brand Film"
  date: string                    // ISO date: "2025-09-15"
  heroImage: Image                // Full-bleed hero for detail page
  thumbnailImage: Image           // 4:5 ratio for grid
  images: Image[]                 // Gallery images for detail page (ordered)
  videoUrl?: string               // Optional showreel/film link (self-hosted or Vimeo)
  description: string             // 2-3 sentence overview
  approach?: string               // How we tackled it (optional, for case study)
  deliverables?: string[]         // ["40 Editorial Shots", "Lookbook PDF", "Social Kit"]
  featured: boolean               // Show on homepage "Selected Work"
  order: number                   // Sort order for homepage feature
}

interface Image {
  src: string                     // Path or CMS URL
  alt: string                     // Descriptive alt text (REQUIRED, not empty)
  width: number
  height: number
  blurDataURL?: string            // Base64 blur placeholder
  caption?: string                // Optional photo caption
}
```

### Journal Post
```typescript
interface JournalPost {
  slug: string                    // "behind-the-lens-tanishq-shoot"
  title: string                   // "Behind the Lens: The Tanishq Shoot"
  excerpt: string                 // 1-2 sentence preview for cards
  content: string                 // MDX or rich text body
  category: 'fashion' | 'jewellery' | 'behind-the-lens' | 'industry'
  heroImage: Image
  publishedAt: string             // ISO date
  readingTime: number             // Minutes (auto-calculated from word count)
  featured: boolean               // Show as featured on /journal
  relatedProjects?: string[]      // Slugs of related portfolio projects
}
```

### Workshop
```typescript
interface Workshop {
  slug: string                    // "editorial-photography-masterclass"
  title: string                   // "Editorial Photography Masterclass"
  description: string             // Full description
  shortDescription: string        // 1 sentence for cards
  heroImage: Image
  date: string                    // ISO date of the workshop
  endDate?: string                // If multi-day
  duration: string                // "2 Days (16 Hours)"
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'all-levels'
  maxSeats: number
  seatsRemaining: number
  price: number                   // In INR
  currency: 'INR'
  instructor: TeamMember
  curriculum: CurriculumItem[]    // What you'll learn
  testimonials?: Testimonial[]
  status: 'upcoming' | 'enrolling' | 'full' | 'completed'
  enrollmentUrl?: string          // External link or internal /inquire with pre-fill
  galleryImages?: Image[]         // Past workshop photos
}

interface CurriculumItem {
  title: string                   // "Lighting Fundamentals"
  description: string             // "Master natural and studio lighting..."
  time?: string                   // "Day 1, 10:00 AM - 1:00 PM"
}

interface Testimonial {
  name: string
  role?: string                   // "Fashion Photographer, Batch 3"
  quote: string
  avatar?: Image
}
```

### Team Member
```typescript
interface TeamMember {
  name: string
  role: string                    // "Founder & Creative Director"
  bio: string                     // 2-3 sentences
  portrait: Image                 // Environmental portrait
  socialLinks?: { platform: string; url: string }[]
}
```

### Inquiry Submission
```typescript
interface InquirySubmission {
  // Step 2: Who
  name: string
  brand: string
  email: string
  
  // Step 3: What
  domains: ('fashion' | 'jewellery' | 'film' | 'workshops' | 'other')[]
  
  // Step 4: Vision
  vision: string                  // Free text about their project
  timeline: 'yesterday' | 'this-month' | 'this-quarter' | 'no-rush'
  budget: 'lets-talk' | 'considered' | 'significant' | 'skys-the-limit'
  
  // Step 5: Fun
  funAnswer: string               // Answer to the personality question
  funQuestion: string             // Which question was shown
  
  // Metadata (auto-captured)
  submittedAt: string             // ISO timestamp
  source: string                  // UTM source or "direct"
  locale: string                  // Browser locale
  referrer?: string               // Where they came from
}
```

---

## 17. TYPOGRAPHY SCALE REFERENCE

> Single source of truth for all font sizes across breakpoints. Use `clamp()` for fluid scaling.

### Heading Scale
| Role | Mobile (375px) | Tablet (768px) | Desktop (1440px) | Font | Weight | Style |
|------|---------------|----------------|-----------------|------|--------|-------|
| Hero title | 2.5rem (40px) | 5rem (80px) | 8rem (128px) | Playfair Display | 900 (Black) | normal |
| Section headline | 2rem (32px) | 3.5rem (56px) | 5.5rem (88px) | Playfair Display | 300 (Light) | italic |
| Card title | 1.2rem (19px) | 1.4rem (22px) | 1.6rem (26px) | All Round Gothic | 700 | normal |
| Brand name (Neelakar) | 3.5rem (56px) | 7rem (112px) | 10rem (160px) | All Round Gothic | 200 | normal |
| Cursive accent (felt.) | 1.15x parent | 1.15x parent | 1.15x parent | Nusrat | 400 | normal |

### Body Scale
| Role | Mobile | Tablet | Desktop | Font | Weight | Opacity |
|------|--------|--------|---------|------|--------|---------|
| Body text | 0.85rem (14px) | 0.9rem (14px) | 1rem (16px) | DM Sans | 300 | 40% on dark, 50% on light |
| Label/Overline | 0.55rem (9px) | 0.6rem (10px) | 0.7rem (11px) | DM Sans | 500-600 | 30% |
| Nav link | 0.65rem (10px) | 0.7rem (11px) | 0.7rem (11px) | DM Sans | 400 | 100% (white) |
| Button text | 0.7rem (11px) | 0.75rem (12px) | 0.8rem (13px) | DM Sans | 500 | 100% |
| Caption / meta | 0.6rem (10px) | 0.65rem (10px) | 0.7rem (11px) | DM Sans | 300 | 30% |
| Decorative number | 3rem (48px) | 5rem (80px) | 8rem (128px) | Playfair Display | 900 | 10-20% |

### Letter Spacing Reference
| Context | Tracking |
|---------|----------|
| Uppercase labels | 0.3em - 0.5em |
| Nav links | 0.3em |
| Body text | 0.02em |
| Brand name | 0 (tight) |
| Footer small text | 0.4em |
| Button text | 0.15em - 0.2em |

### Line Height Reference
| Context | Line-height |
|---------|-------------|
| Headlines | 1.0 - 1.15 |
| Body text | 1.7 - 1.9 |
| Labels | 1.2 |
| Nav links | 1 |
| Journal article body | 1.8 |
| Buttons | 1 |

---

## 18. MOBILE ANIMATION TIMING SPECS

> Desktop effects bible gives exact values. Here are the mobile-specific overrides.

### ScrollTrigger Overrides (Mobile ≤ 768px)
| Desktop Setting | Mobile Override | Reason |
|----------------|----------------|--------|
| `scrub: 3-4` | `scrub: 2` | Shorter scroll distances on mobile = faster scrub needed |
| `pin: true, end: '+=400vh'` | `pin: true, end: '+=250vh'` | Reduce pin duration — thumbs scroll faster |
| `start: 'top top'` | `start: 'top top'` | Same — pinning starts at viewport top |

### Animation Value Overrides
| Effect | Desktop Value | Mobile Value |
|--------|--------------|-------------|
| Fade+Rise y-offset | `y: 40px` | `y: 24px` |
| Image scale entrance | `scale: 0.4 → 1` | `scale: 0.9 → 1` |
| Split text rotateX | `-45deg → 0` | `0deg → 0` (no 3D rotation, just opacity+y) |
| Split text stagger | `0.02s per char` | `0.03s per word` (word-level, not char) |
| Parallax multiplier | `0.3x` | Disabled — static positions |
| ClipPath wipe duration | `0.15 of timeline` | `0.2 of timeline` (slightly slower for readability) |
| Card lift translateY | `-8px` | Disabled — no hover on touch |
| Perspective tilt | `rotateX/Y ±8deg` | Disabled entirely |
| Magnetic pull | 100px radius, 8px movement | Disabled entirely |
| Pen cursor writing | Full pen animation | No pen — simple `opacity: 0 → 1` fade on "felt." |
| Gallery image transitions | `x: ±80vw, scale: 0.4-1` | Vertical stack, simple `opacity + y: 30 → 0` |

### Touch-Specific Interactions
| Interaction | Behavior |
|------------|----------|
| Tap on card | Brief scale down `0.98` for 100ms, then navigate |
| Tap on image | Brief brightness increase `1.05` for 100ms, then navigate |
| Swipe gallery | Horizontal swipe with snap points (CSS scroll-snap) |
| Form step advance | Swipe up or tap "NEXT" button |
| Long press | No custom behavior — native OS behavior |
| Pull to refresh | Disabled (interferes with scroll animations) |

---

## 19. FORM & INQUIRY — FULL-STACK SPEC

### Multi-Step Form State Management
- Form state lives in React Context wrapping the `/inquire` page
- Each step reads/writes to shared state object (matching `InquirySubmission` type)
- **Progress persistence:** Save form state to `localStorage` on every step change
  - Key: `neelakar_inquiry_draft`
  - On page load: check localStorage, if draft exists, show "Continue where you left off?" prompt
  - Draft expires after 7 days (store timestamp, compare on load)
  - Clear draft on successful submission

### Validation Rules
| Field | Validation | When |
|-------|-----------|------|
| Name | Required, min 2 chars, max 100 | On blur + on "NEXT" |
| Brand | Required, min 2 chars, max 100 | On blur + on "NEXT" |
| Email | Required, valid email regex, max 254 chars | On blur + on "NEXT" |
| Domains | At least 1 selected | On "NEXT" |
| Vision | Required, min 10 chars, max 5000 | On "NEXT" (not on blur — let them type) |
| Timeline | Required (1 selected) | On "NEXT" |
| Budget | Required (1 selected) | On "NEXT" |
| Fun answer | Optional — skip allowed | Never (it's for fun) |

### Error Display
- Inline errors below each field, red-ish text but styled: `#E25C5C` (not harsh red)
- Error text: DM Sans 300, 0.7rem, appears with opacity+y animation
- Error shake: input container shakes horizontally (3px, 3 times, 200ms) when validation fails on "NEXT"
- Focus management: on validation error, focus moves to first invalid field

### Submission Flow
```
User clicks "SEND YOUR STORY"
  → Client-side: validate all fields one final time
  → Client-side: verify reCAPTCHA token
  → Client-side: show gold pulsing dot loader on button (button text changes to "SENDING...")
  → Server Action: /api/inquire (POST)
      1. Verify reCAPTCHA token with Google
      2. Sanitize all inputs (strip HTML, trim whitespace)
      3. Rate limit: max 3 submissions per email per 24h
      4. Send email to ADMIN_EMAIL via Resend (formatted HTML template)
      5. Send confirmation email to user's email via Resend
      6. Optional: POST to Airtable/Google Sheets as backup
      7. Return { success: true }
  → Client-side on success:
      - Clear localStorage draft
      - Transition to Thank You step (Step 7)
      - Fire analytics event: 'inquiry_submitted'
  → Client-side on error:
      - Show error message (see micro-copy section)
      - Button returns to "SEND YOUR STORY"
      - Do NOT clear form data
```

### Admin Email Template
Subject: `New Inquiry: [Name] — [Brand]`
```
FROM: [Name] ([Email])
BRAND: [Brand]

DOMAIN: [Selected domains, comma-separated]

VISION:
[Their vision text]

TIMELINE: [Selection]
BUDGET: [Selection]

FUN Q: [Question shown]
FUN A: [Their answer]

---
Submitted: [Date/time IST]
Source: [Referrer/UTM]
```

### User Confirmation Email Template
Subject: `We received your story, [Name] ✦`
```
Hi [Name],

Thank you for sharing your vision with us. We're already thinking about possibilities.

Here's what you told us:
[Summary of their answers]

Expect to hear from us within 24 hours.

Warmly,
Neelakar Creative House
Hyderabad
```

### Workshop Enrollment Flow
- "ENROLL" button on workshop card → navigates to `/inquire?type=workshop&workshop=[slug]`
- Inquiry form detects URL params and pre-fills:
  - Domain auto-selected: "WORKSHOPS"
  - Vision field pre-populated: "I'm interested in the [Workshop Title] workshop on [Date]."
  - Step 3 (domain selection) is auto-skipped
- Same submission flow as regular inquiry
- Admin email subject: `Workshop Enrollment: [Name] — [Workshop Title]`

---

## 20. COMPONENT ARCHITECTURE

### Layout Hierarchy
```
app/
├── layout.tsx                    # Root: fonts, metadata, noise overlay
├── (site)/
│   ├── layout.tsx                # Site layout: nav, footer, custom cursor, Lenis, AnimatePresence
│   ├── page.tsx                  # Home — all homepage sections
│   ├── about/page.tsx
│   ├── portfolio/
│   │   ├── page.tsx              # Grid view
│   │   └── [slug]/page.tsx       # Project detail
│   ├── journal/
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Post detail
│   ├── studio/page.tsx
│   ├── workshops/
│   │   ├── page.tsx              # Workshop listings
│   │   └── [slug]/page.tsx       # Workshop detail
│   └── inquire/page.tsx          # Multi-step form
└── not-found.tsx                 # 404 page
```

### Shared Component Library
```
components/
├── layout/
│   ├── Navbar.tsx                # Fixed nav with scroll show/hide
│   ├── Footer.tsx                # Global footer with dust effect
│   ├── PageTransition.tsx        # Framer Motion AnimatePresence wrapper
│   └── SmoothScroll.tsx          # Lenis provider
├── ui/
│   ├── Button.tsx                # Gold bordered/filled button variants
│   ├── MagneticWrapper.tsx       # Wraps any element with magnetic hover pull
│   ├── CustomCursor.tsx          # Global cursor (desktop only)
│   ├── ScrollProgressBar.tsx     # Thin gold line at top of page
│   ├── GoldLine.tsx              # Decorative line (scaleX animation)
│   └── SectionLabel.tsx          # "OUR MANIFESTO" style label with line
├── animation/
│   ├── SplitText.tsx             # Character/word splitting for text animations
│   ├── FadeReveal.tsx            # Type A: opacity + y reveal
│   ├── ClipReveal.tsx            # Type B: clipPath wipe with optional gold line
│   ├── ParallaxImage.tsx         # Image with scroll parallax (120% height)
│   ├── PerspectiveTilt.tsx       # Fake 3D card tilt on hover
│   └── GoldParticles.tsx         # Canvas ambient particle system
├── sections/
│   ├── home/                     # Homepage-specific sections
│   │   ├── HeroSection.tsx
│   │   ├── ManifestoSection.tsx
│   │   ├── FashionDomainSection.tsx
│   │   ├── JewelleryDomainSection.tsx
│   │   ├── SelectedWorkSection.tsx
│   │   ├── StudioPracticesSection.tsx
│   │   └── CTABandSection.tsx
│   └── shared/
│       ├── TheApproach.tsx       # Reused in /about and /studio
│       └── CTASection.tsx        # Reused on multiple pages
├── forms/
│   ├── InquiryForm.tsx           # Multi-step form orchestrator
│   ├── steps/                    # Individual form steps
│   │   ├── WelcomeStep.tsx
│   │   ├── WhoStep.tsx
│   │   ├── DomainStep.tsx
│   │   ├── VisionStep.tsx
│   │   ├── FunStep.tsx
│   │   ├── ReviewStep.tsx
│   │   └── ThankYouStep.tsx
│   └── InquiryContext.tsx        # React Context for form state
└── media/
    ├── VideoPlayer.tsx           # Custom HTML5 video player with gold controls
    ├── ImageGrid.tsx             # Masonry/uniform grid with hover effects
    └── InstagramFeed.tsx         # Live Instagram grid
```

### Rendering Strategy Per Route
| Route | Rendering | Revalidation | Why |
|-------|-----------|-------------|-----|
| `/` | Static (SSG) | On-demand (ISR) | Homepage content changes rarely |
| `/about` | Static | On-demand | Almost never changes |
| `/portfolio` | ISR | Every 1 hour | New projects added periodically |
| `/portfolio/[slug]` | ISR | Every 1 hour | Same |
| `/journal` | ISR | Every 30 min | Blog posts added more frequently |
| `/journal/[slug]` | ISR | Every 1 hour | Content might get minor edits |
| `/studio` | Static | On-demand | Rarely changes |
| `/workshops` | ISR | Every 15 min | Seat counts change, new workshops |
| `/workshops/[slug]` | ISR | Every 15 min | Enrollment status changes |
| `/inquire` | Static | — | Pure client-side form, no server data |
| `/not-found` | Static | — | Never changes |

---

## 21. DARK / LIGHT MODE BEHAVIOR

- **The site does NOT respect OS dark/light mode preference.**
- The entire visual design is a curated dark-to-cream experience — switching themes would break the emotional journey.
- `color-scheme: dark` in root CSS (prevents browser default styling interference)
- Meta theme-color: `#060F0B` (matches dark sections — Safari/Chrome toolbar)
- Light sections (cream backgrounds) are intentional design moments, not "light mode"
- If user has `forced-colors: active` (Windows high contrast): respect it, ensure text is readable via system colors

---

## 22. SECURITY & SPAM PROTECTION

### Form Security
- **reCAPTCHA v3** (invisible) on inquiry form — score threshold: 0.5
- **Honeypot field:** hidden input `<input name="website" />` — if filled, reject silently (bots fill all fields)
- **Rate limiting:** max 3 submissions per IP per hour (via Vercel Edge Middleware or server action check)
- **Input sanitization:** strip all HTML tags, trim whitespace, enforce max lengths server-side
- **CSRF:** Next.js Server Actions have built-in CSRF protection via same-origin checks

### HTTP Security Headers (via next.config / Vercel config)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://www.google.com; frame-src https://www.google.com;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### No Sensitive Data Exposure
- No API keys in client-side code (all in env vars, server-side only)
- `NEXT_PUBLIC_` prefix only for truly public values (site URL, reCAPTCHA site key, GA ID)
- `.env.local` in `.gitignore` — never committed
- No user data stored in cookies or localStorage except form draft (non-sensitive)

---

## 23. ANALYTICS & EVENT TRACKING

### Page View Tracking (Automatic)
- Vercel Analytics handles page views automatically
- Custom events via `track()` from `@vercel/analytics`

### Custom Events to Track
| Event | Trigger | Properties |
|-------|---------|-----------|
| `inquiry_started` | User clicks "START" on Step 1 | `{ source: referrer }` |
| `inquiry_step_completed` | User advances to next step | `{ step: number, stepName: string }` |
| `inquiry_submitted` | Form successfully submitted | `{ domain: string[], timeline: string }` |
| `inquiry_abandoned` | User leaves /inquire without submitting | `{ lastStep: number }` |
| `portfolio_filter` | User clicks a filter on /portfolio | `{ category: string }` |
| `portfolio_project_viewed` | User opens a project detail | `{ slug: string, category: string }` |
| `workshop_enrollment_clicked` | User clicks "ENROLL" | `{ workshopSlug: string }` |
| `cta_clicked` | User clicks any CTA button | `{ location: string, text: string }` |
| `nav_item_clicked` | User clicks a nav link | `{ item: string, isMobile: boolean }` |
| `social_link_clicked` | User clicks Instagram/YouTube/etc | `{ platform: string }` |
| `journal_post_read` | User scrolls >80% of journal article | `{ slug: string, readingTime: number }` |

### Conversion Funnel
```
Homepage Visit → CTA Click → Inquire Page → Start Form → Complete Form → Submit
```
Track drop-off at each stage to optimize.

---

## 24. BROWSER SUPPORT

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 100+ | Primary target — most Indian users |
| Safari | 16+ | iOS is critical (iPhone users in India) |
| Firefox | 100+ | Secondary |
| Edge | 100+ | Chromium-based, same as Chrome |
| Samsung Internet | 20+ | Significant Android share in India |
| Opera | 90+ | Some usage in India |
| IE | ❌ Not supported | Dead — no polyfills needed |

### CSS Feature Requirements
- `clamp()` — supported in all targets
- `clip-path: inset()` — supported in all targets
- `mix-blend-mode` — supported (Safari had issues pre-16, now fine)
- CSS Grid / Flexbox — universal
- `will-change` — universal
- `scroll-snap-type` — universal
- `@supports` queries for progressive enhancement where needed

### JavaScript Feature Requirements
- ES2020+ (optional chaining, nullish coalescing)
- IntersectionObserver — universal
- ResizeObserver — universal
- requestAnimationFrame — universal
- Web Audio API — universal (except autoplay policies on mobile)
- Canvas 2D — universal

---

## 25. CACHING & DEPLOYMENT STRATEGY

### Vercel Deployment Config
```typescript
// vercel.ts (or next.config headers)
headers: [
  // Cache static assets aggressively
  { source: '/fonts/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  { source: '/images/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
  
  // Security headers on all routes
  { source: '/(.*)', headers: [/* security headers from section 22 */] },
]

redirects: [
  // Common typos / old URLs
  { source: '/contact', destination: '/inquire', permanent: true },
  { source: '/services', destination: '/studio', permanent: true },
  { source: '/blog', destination: '/journal', permanent: true },
  { source: '/blog/:slug', destination: '/journal/:slug', permanent: true },
  { source: '/work', destination: '/portfolio', permanent: true },
]
```

### ISR Revalidation Strategy
- Portfolio/journal pages use `revalidate` export in page files
- On-demand revalidation via webhook from CMS (Sanity/Contentful → Vercel deploy hook or `revalidatePath`)
- Fallback: `dynamicParams = true` — unknown slugs generate on first request, then cached

### Asset Caching
| Asset Type | Cache Duration | Strategy |
|-----------|---------------|----------|
| Fonts | 1 year, immutable | Never change — versioned by filename hash |
| Static images (logos, icons) | 1 year, immutable | Same |
| CMS images | 1 day + stale-while-revalidate 7 days | Images might be updated in CMS |
| JS/CSS bundles | 1 year, immutable | Next.js hashes filenames automatically |
| HTML pages | See ISR settings above | Varies by route |
| API responses | No cache | Form submissions are unique |

---

## 26. INTERNATIONALIZATION & LOCALE

- **Primary language:** English (en-IN)
- **No multi-language support** required at launch — single English site
- **Indian English conventions:**
  - Date format: DD/MM/YYYY (not US MM/DD/YYYY)
  - Currency: ₹ (INR) for workshop pricing — `₹15,000` format with Indian comma grouping (`₹1,50,000` for lakhs)
  - Phone format: +91 XXXXX XXXXX
  - Address format: Indian style (area, city, state, PIN)
- **hreflang:** `en-IN` (primary), `en` (fallback)
- **Future consideration:** Hindi/Telugu landing pages if the studio expands — but NOT in initial build. Structure routes to allow `/hi/` or `/te/` prefix later if needed.

---

## 27. COOKIE & PRIVACY COMPLIANCE

- **India's DPDP Act (Digital Personal Data Protection):**
  - Cookie consent banner NOT legally required yet for Indian businesses (as of 2026), but recommended
  - If implemented: minimal, dark-styled banner at bottom, "Accept" + "Learn More" — dismisses on accept, stores preference in localStorage
- **Data collected:**
  - Form submissions (name, email, brand, vision) — stored only in email inbox and optional Airtable backup
  - Analytics (Vercel) — anonymized page views, no PII
  - localStorage: form draft (auto-cleared after 7 days or submission), sound mute preference, preloader-shown flag
- **No third-party tracking cookies** — no Facebook pixel, no Google Ads
- **Privacy policy page** (optional /privacy) — simple page explaining what data is collected, how it's used, contact for data requests
- **Data retention:** Inquiry form data retained in email/Airtable indefinitely (business records). No automated deletion needed at launch.

---

## 28. ERROR HANDLING & EDGE CASES

### Network Errors
| Scenario | Behavior |
|----------|----------|
| Form submission fails (network) | Show inline error: "Something went wrong on our end. Try once more, or email us directly at hello@neelakar.com". Retry button. Do NOT clear form data. |
| Image fails to load | Show section-matched solid color placeholder. No broken image icon. Log error to console. |
| Font fails to load | `font-display: swap` ensures content shows immediately with system fallback. `size-adjust` minimizes layout shift. |
| Instagram feed API fails | Show curated static images (pre-selected best-of). No blank space, no error message. |
| Video fails to load | Show poster frame (thumbnail) with "Video unavailable" text overlay. Link to YouTube/Vimeo fallback if available. |
| CMS unreachable | ISR serves last cached version. If no cache: static fallback data from local JSON. |
| reCAPTCHA fails to load | Allow form submission anyway — don't block users because of Google's service. Log the skip server-side for monitoring. |

### User Edge Cases
| Scenario | Behavior |
|----------|----------|
| User scrolls very fast | GSAP scrub handles naturally — animations compress but don't break |
| User resizes browser mid-scroll | ScrollTrigger.refresh() on resize (debounced). Lenis recalculates. |
| User navigates back/forward | AnimatePresence handles exit/enter. ScrollTrigger re-initializes on mount. Scroll position: reset to top on new page (not restored). |
| User opens in multiple tabs | Each tab is independent. Form draft in localStorage is shared — last save wins. |
| User has JS disabled | Show `<noscript>` message: "This site requires JavaScript for the full experience. Please enable JavaScript or visit our Instagram @neelakar for our latest work." |
| User on extremely slow connection (3G) | Preloader handles load time gracefully. Images lazy-load. Fonts swap. Core content visible fast even without animations. |
| User bookmarks mid-scroll | URL doesn't change with scroll position (sections are not routed). User returns to top of page. |

---

## 29. TESTING STRATEGY

### What to Test
| Layer | What | How |
|-------|------|-----|
| **Visual** | Every page at 375px, 768px, 1440px | Manual browser testing + screenshots |
| **Animations** | ScrollTrigger pins, scrub timing, entrance animations | Manual scroll testing — watch for jank, misalignment |
| **Performance** | Core Web Vitals on each page | Lighthouse CI in pipeline, Vercel Speed Insights |
| **Forms** | All validation rules, submission flow, error states | Manual + unit tests on validation logic |
| **Links** | No broken internal/external links | Automated link checker (e.g., `lychee` CLI or `next-sitemap` validation) |
| **SEO** | Meta tags, OG images, structured data | Google Rich Results Test, social preview tools |
| **Accessibility** | Keyboard nav, screen reader, contrast | axe DevTools, manual keyboard-only testing |
| **Cross-browser** | Chrome, Safari (iOS + Mac), Firefox, Samsung Internet | BrowserStack or real devices |
| **Edge cases** | JS disabled, slow network, resize, back/forward | Manual testing per section 28 |

### Automated Tests (Minimal — Focus on Manual QA)
```
__tests__/
├── validation.test.ts            # Inquiry form validation rules (Zod schemas)
├── data-models.test.ts           # Type checks on sample project/journal data
└── api/
    └── inquire.test.ts           # Server action: sanitization, rate limit, email format
```

No E2E tests at launch — the scroll-heavy animations are better tested manually. Add Playwright later if the team grows.

---

## 30. PRE-LAUNCH CHECKLIST

> Run through this before going live.

### Content
- [ ] All placeholder images replaced with real Neelakar photography
- [ ] All copy reviewed and approved by studio (no lorem ipsum)
- [ ] Portfolio has at least 6 projects (2 fashion, 2 jewellery, 1 film, 1 identity)
- [ ] Journal has at least 2 posts
- [ ] Workshops section has at least 1 upcoming OR graceful empty state
- [ ] Team photos and bios approved
- [ ] Footer info correct: email, location, social links

### Technical
- [ ] All environment variables set in Vercel
- [ ] Resend email delivery verified (test inquiry submission)
- [ ] reCAPTCHA configured and scoring correctly
- [ ] Custom domain connected and SSL active
- [ ] OG images generated for all pages
- [ ] Favicon set at all sizes
- [ ] `robots.txt` allows crawling
- [ ] `sitemap.xml` generated via `next-sitemap`
- [ ] Structured data validates in Google Rich Results Test
- [ ] Console has zero errors on all pages

### Performance
- [ ] Lighthouse score 90+ on Home, Portfolio, Inquire (mobile)
- [ ] LCP < 2.5s on Home (hero image)
- [ ] CLS < 0.1 on all pages
- [ ] All images optimized (AVIF/WebP, proper sizing)
- [ ] Fonts preloaded, no FOUT on initial load
- [ ] Bundle size within budget (section 5)

### Cross-Device
- [ ] Tested on iPhone SE (375px)
- [ ] Tested on iPhone 14/15 (390px)
- [ ] Tested on iPhone Pro Max (430px)
- [ ] Tested on iPad (768px)
- [ ] Tested on Android (Samsung Galaxy, Chrome)
- [ ] Tested on desktop Chrome (1440px)
- [ ] Tested on desktop Safari (Mac)
- [ ] Tested on desktop Firefox

### Accessibility
- [ ] Keyboard navigation works on all pages
- [ ] `prefers-reduced-motion` tested — all animations stop
- [ ] Focus indicators visible on all interactive elements
- [ ] Skip-to-content link present
- [ ] Screen reader tested on at least Inquire and Portfolio pages
- [ ] Color contrast passes WCAG AA

### Launch
- [ ] Vercel production deployment successful
- [ ] Analytics tracking verified
- [ ] Google Search Console: domain verified, sitemap submitted
- [ ] Google My Business linked
- [ ] Social profiles linked and correct
- [ ] Inquiry form test submission received by admin email
- [ ] Confirmation email received by user email
- [ ] Share URL on WhatsApp/Instagram — OG preview renders correctly

---

## 31. DEVELOPMENT PHASES & BUILD ORDER

> Build in this order. Each phase is deployable — the site works (with reduced scope) at every checkpoint.

### Phase 1: Foundation (Week 1-2)
**Goal:** Skeleton that runs, deploys, and has the right structure.
- [ ] Next.js App Router project setup with TypeScript strict mode
- [ ] Tailwind v4 config with custom colors (--dark, --cream, --gold, --ink, --white)
- [ ] Font loading: All Round Gothic, Playfair Display, DM Sans via `next/font`, Nusrat via @font-face
- [ ] Root layout: metadata, fonts, noise overlay
- [ ] Site layout: Lenis smooth scroll provider
- [ ] All route files created (empty pages with just a title placeholder)
- [ ] Vercel deployment connected — auto-deploy on push to main
- [ ] Global CSS: noise overlay, base resets, font declarations
- **Checkpoint:** Site deploys, all routes work, fonts load, smooth scroll active.

### Phase 2: Global UI (Week 2-3)
**Goal:** Navigation, footer, cursor, page transitions — the shell that wraps every page.
- [ ] Navbar (desktop + mobile with hamburger overlay + focus trap)
- [ ] Footer with dust text hover effect
- [ ] Custom cursor system (desktop only, disabled ≤768px)
- [ ] Page transition animations (AnimatePresence wrapper)
- [ ] Scroll progress bar (gold line at top)
- [ ] Preloader (first visit only, sessionStorage flag)
- [ ] Toast notification component
- [ ] `prefers-reduced-motion` global check + CSS media query
- **Checkpoint:** Navigate between all pages with transitions, cursor works, footer renders.

### Phase 3: Homepage Sections (Week 3-5)
**Goal:** The main scroll experience — the heart of the site.
Build in this order (matches scroll flow):
1. [ ] Hero section (photo + title + parallax + scroll fade)
2. [ ] Manifesto section (gradient transition + text reveal + "felt." pen animation)
3. [ ] Fashion Domain section (magazine editorial layout + clipPath reveals)
4. [ ] Jewellery Domain section (warm atmosphere + mirrored layout)
5. [ ] Selected Work section (horizontal scroll pin + image scale transitions)
6. [ ] Studio Practices section (cream bg + staggered cards)
7. [ ] CTA Band section (text + button + gold lines)
- [ ] Wire up all ScrollTrigger pins and scrub values
- [ ] Test full homepage scroll from top to footer
- [ ] Mobile adaptations for all sections
- **Checkpoint:** Full homepage scroll experience works desktop + mobile.

### Phase 4: Content Pages (Week 5-7)
**Goal:** All secondary pages built with real or placeholder content.
- [ ] About page (hero + origin story + approach + team grid)
- [ ] Portfolio grid page (filter bar + masonry grid + SHOW MORE pagination)
- [ ] Portfolio detail page (hero parallax + editorial layout + next project + share)
- [ ] Studio page (hero + 5 services deep-dive + approach + CTA)
- [ ] Workshops page (hero + upcoming cards + curriculum + past gallery + CTA)
- [ ] Workshop detail page (hero + info bar + schedule + testimonials + enroll CTA)
- [ ] Journal listing page (featured + 2-column grid)
- [ ] Journal post page (article layout + related posts + share)
- [ ] 404 page (with easter egg)
- [ ] Search overlay (client-side JSON index)
- **Checkpoint:** All pages navigable, all layouts correct, placeholder content everywhere.

### Phase 5: Inquiry Form (Week 7-8)
**Goal:** The star page — multi-step storytelling form, fully functional.
- [ ] InquiryContext + form state management
- [ ] Step 1: Welcome (particles + animation)
- [ ] Step 2: Who (name, brand, email inputs with validation)
- [ ] Step 3: Domain selector (clickable cards, multi-select)
- [ ] Step 4: Vision (textarea, timeline pills, budget pills)
- [ ] Step 5: Fun question (random question rotation)
- [ ] Step 6: Review + edit flow
- [ ] Step 7: Thank you (confetti particles)
- [ ] Form persistence (localStorage draft, 7-day expiry)
- [ ] Server action: sanitize, reCAPTCHA verify, send emails via Resend
- [ ] Admin email template + user confirmation email
- [ ] Workshop enrollment pre-fill flow (?type=workshop&workshop=slug)
- [ ] Honeypot + rate limiting
- **Checkpoint:** Complete inquiry submission works end-to-end, emails arrive.

### Phase 6: Polish & Performance (Week 8-9)
**Goal:** Everything smooth, fast, accessible.
- [ ] Perspective tilt hover effects on portfolio/service cards
- [ ] Magnetic pull on buttons
- [ ] Sound design (optional — implement last)
- [ ] All hover effects refined (underline draw, button fill, image distortion)
- [ ] Lighthouse audit: hit 90+ on all pages
- [ ] Bundle size audit: within budget
- [ ] Image optimization pass (all images AVIF/WebP, correct sizes/srcset)
- [ ] Accessibility audit: keyboard nav, focus indicators, aria labels, skip-to-content
- [ ] `prefers-reduced-motion` full test
- [ ] Cross-browser testing (Chrome, Safari iOS, Safari Mac, Firefox, Samsung Internet)
- [ ] Cross-device testing (375px through 1920px)
- **Checkpoint:** Site is production-ready.

### Phase 7: Content & Launch (Week 9-10)
**Goal:** Replace placeholders with real content, go live.
- [ ] Replace all placeholder images with Neelakar photography
- [ ] All copy finalized and reviewed
- [ ] OG images generated per page
- [ ] Favicon + apple-touch-icon + safari pinned tab
- [ ] SEO: meta tags, structured data, sitemap.xml, robots.txt
- [ ] Google Search Console setup
- [ ] Google My Business linked
- [ ] Analytics verified
- [ ] Instagram feed integration (or static fallback)
- [ ] Final QA pass (run Pre-Launch Checklist section 30)
- [ ] 🚀 Launch

### Future Phases (Post-Launch)
- [ ] CMS integration (Sanity/Contentful) for portfolio + journal + workshops
- [ ] WhatsApp quick contact widget
- [ ] Cookie consent banner (when DPDP Act requires it)
- [ ] Hindi/Telugu landing pages (if studio expands)
- [ ] Blog comments or reactions
- [ ] Newsletter integration
- [ ] E2E tests with Playwright
- [ ] A/B testing on CTA copy

---

## 32. IMAGE DIMENSION SPECIFICATIONS

> Exact pixel dimensions for every image context. Photographers and CMS uploads should match these.

| Context | Aspect Ratio | Desktop Dimensions | Mobile Dimensions | Format |
|---------|-------------|-------------------|-------------------|--------|
| Hero (homepage) | 16:9 or custom bleed | 1920×1080 minimum | 800×1000 (portrait crop) | AVIF → WebP → JPEG |
| Portfolio thumbnail | 4:5 | 600×750 | 400×500 | AVIF → WebP |
| Portfolio hero (detail) | 16:9 | 1920×1080 | 800×450 | AVIF → WebP → JPEG |
| Portfolio gallery image | 2:3 or 3:2 | 1200×1800 or 1800×1200 | 800×1200 or 1200×800 | AVIF → WebP |
| Journal featured image | 3:2 | 1200×800 | 800×533 | AVIF → WebP |
| Journal inline image | varies | max 1200px wide | max 800px wide | AVIF → WebP |
| Workshop card | 16:9 | 800×450 | 600×338 | AVIF → WebP |
| Team portrait | 3:4 | 600×800 | 400×533 | AVIF → WebP |
| OG image (social share) | 1.91:1 | 1200×630 | — | JPEG (social platforms don't support AVIF) |
| Favicon | 1:1 | 32×32 + 16×16 | — | SVG + ICO fallback |
| Apple touch icon | 1:1 | 180×180 | — | PNG |
| Instagram feed thumbnail | 1:1 | 300×300 | 300×300 | JPEG (from API) |

**srcset breakpoints for responsive images:**
```
sizes="(max-width: 430px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 600px"
```
Adjust per context — hero images use `100vw`, grid thumbnails use the formula above.

---

## 33. CONTENT MANAGEMENT WORKFLOW (Future CMS)

> When CMS is connected, this is how content flows from creation to live site.

### Workflow
```
Creator uploads content in CMS
  → Draft state (preview URL via Vercel preview deployments)
  → Editor reviews in preview
  → Publishes → CMS webhook fires → Vercel revalidates ISR pages
  → Live on production within 1-2 seconds
```

### CMS Schema Requirements
- **Portfolio:** All fields from data model (section 16). Image fields accept upload + URL. Rich text for description/approach.
- **Journal:** All fields from data model. Body content supports: headings, paragraphs, images (inline + full-width), pull quotes, bold/italic. No arbitrary HTML.
- **Workshops:** All fields from data model. Seat count editable (auto-updates `seatsRemaining`). Status dropdown.
- **Team:** Simple fields — name, role, bio (plain text), portrait image.
- **Global settings:** Studio address, email, phone, social URLs, default OG image, tagline options. Editable without code deploy.

### Image Upload Rules for CMS
- Max upload: 10MB per image (CMS-side limit)
- Auto-resize: CMS should auto-generate responsive sizes on upload
- Required fields: alt text (NOT optional — enforce in CMS schema)
- Accepted formats: JPEG, PNG, WebP (CMS auto-converts to AVIF/WebP for delivery)
