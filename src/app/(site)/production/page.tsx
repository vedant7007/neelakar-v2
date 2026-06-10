'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Shuffle from '@/components/Shuffle'

gsap.registerPlugin(ScrollTrigger)

const BG = '#060F0B'
const GOLD = '#C8A96E'
const CREAM = '#E8E2D9'
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"

const FEATURED = [
  {
    title: 'Meridian',
    subtitle: 'Collection',
    category: 'Fashion Editorial',
    client: 'Vogue India',
    year: '2025',
    imageId: 1035,
  },
  {
    title: 'Gilded',
    subtitle: 'Radiance',
    category: 'Jewellery Campaign',
    client: 'Tanishq',
    year: '2025',
    imageId: 1043,
  },
  {
    title: 'Silent',
    subtitle: 'Rebellion',
    category: 'Brand Film',
    client: 'Nike India',
    year: '2024',
    imageId: 1044,
  },
]

const CAPABILITIES = {
  photography: [
    'Fashion & Editorial',
    'Product & Lookbook',
    'Jewellery & Luxury',
    'Portrait & Beauty',
    'Architecture & Interiors',
    'Campaign & Advertising',
  ],
  videography: [
    'Brand Films',
    'Campaign & Commercial',
    'Documentary & BTS',
    'Music Videos',
    'Motion & Animation',
    'Social & Reels',
  ],
}

const PROCESS = [
  { num: '01', title: 'Discovery', body: 'We immerse ourselves in your brand DNA — audience, ambition, aesthetic.' },
  { num: '02', title: 'Concept', body: 'Mood boards, shot lists, narratives — we translate vision into a creative blueprint.' },
  { num: '03', title: 'Production', body: 'On set, every detail is orchestrated — lighting, composition, movement.' },
  { num: '04', title: 'Delivery', body: 'Color grading, retouching, platform-optimized formats. Atelier-level finish.' },
]

const PANELS = [
  {
    title: 'Photography',
    href: '/production/photography',
    num: '01',
    tagline: 'Intimate portraits, editorial campaigns, and visual storytelling that lingers.',
    image: 'https://picsum.photos/id/1015/1200/1600',
    accent: 'Still frames. Lasting impressions.',
  },
  {
    title: 'Videography',
    href: '/production/videography',
    num: '02',
    tagline: 'Cinematic films, brand narratives, and motion that moves.',
    image: 'https://picsum.photos/id/1049/1200/1600',
    accent: 'Every frame in motion.',
  },
]

export default function ProductionPage() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState([
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
  ])
  const [hoveredCap, setHoveredCap] = useState<string | null>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('.reveal-stagger').forEach((container) => {
        const children = container.children
        gsap.fromTo(
          children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: { trigger: container, start: 'top 85%', once: true },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('.parallax-img').forEach((el) => {
        gsap.to(el, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement!,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })
    }, sectionsRef)
    return () => ctx.revert()
  }, [])

  const handlePanelMouse = (e: React.MouseEvent, idx: number) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setMousePos((prev) => {
      const next = [...prev]
      next[idx] = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
      return next
    })
  }

  return (
    <div ref={sectionsRef} style={{ backgroundColor: BG }}>
      <style>{`
        /* ── Featured cards ── */
        .feat-card {
          position: relative; overflow: hidden; cursor: pointer;
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .feat-card:hover { transform: translateY(-8px); }
        .feat-card .feat-img {
          transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .feat-card:hover .feat-img { transform: scale(1.06); }
        .feat-card .feat-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(6,15,11,0.9) 0%, transparent 60%);
          transition: background 0.5s;
        }
        .feat-card:hover .feat-overlay {
          background: linear-gradient(to top, rgba(6,15,11,0.95) 0%, rgba(6,15,11,0.2) 70%);
        }
        .feat-card .feat-line {
          width: 0; height: 1px; background: ${GOLD};
          transition: width 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .feat-card:hover .feat-line { width: 40px; }

        /* ── Capability items ── */
        .cap-item {
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: default;
          transition: padding-left 0.4s, border-color 0.4s;
        }
        .cap-item:hover {
          padding-left: 12px;
          border-color: rgba(200,169,110,0.15);
        }

        /* ── Process steps ── */
        .step-card {
          position: relative; padding: 40px 32px;
          border: 1px solid rgba(255,255,255,0.04);
          transition: border-color 0.5s, background 0.5s;
        }
        .step-card:hover {
          border-color: rgba(200,169,110,0.12);
          background: rgba(200,169,110,0.03);
        }
        .step-num {
          transition: color 0.5s;
        }
        .step-card:hover .step-num { color: ${GOLD} !important; }

        /* ── Split panels ── */
        .prod-panel {
          position: relative; overflow: hidden; cursor: pointer;
          transition: flex 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .prod-panel .panel-bg {
          position: absolute; inset: -20px;
          transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .prod-panel:hover .panel-bg { transform: scale(1.08); }
        .prod-panel .panel-overlay {
          position: absolute; inset: 0;
          transition: background 0.7s;
        }
        .prod-panel .panel-gold-line {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: ${GOLD};
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .prod-panel:hover .panel-gold-line { transform: scaleX(1); }
        .prod-panel .panel-arrow {
          opacity: 0; transform: translateX(-12px);
          transition: opacity 0.4s, transform 0.4s;
        }
        .prod-panel:hover .panel-arrow { opacity: 1; transform: translateX(0); }
        .panel-divider {
          position: absolute; top: 15%; bottom: 15%; left: 50%;
          width: 1px; background: rgba(200,169,110,0.12);
          z-index: 20; pointer-events: none;
        }

        /* ── CTA button ── */
        .cta-btn {
          position: relative; display: inline-flex; align-items: center;
          gap: 16px; padding: 18px 40px;
          border: 1px solid rgba(200,169,110,0.3);
          text-decoration: none; overflow: hidden;
          transition: border-color 0.4s;
        }
        .cta-btn:hover { border-color: ${GOLD}; }
        .cta-btn .cta-fill {
          position: absolute; inset: 0; background: ${GOLD};
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .cta-btn:hover .cta-fill { transform: scaleX(1); }
        .cta-btn .cta-text { position: relative; z-index: 1; transition: color 0.4s; }
        .cta-btn:hover .cta-text { color: ${BG} !important; }
        .cta-btn .cta-line {
          position: relative; z-index: 1;
          height: 1px; width: 24px; background: ${GOLD};
          transition: width 0.4s, background 0.4s;
        }
        .cta-btn:hover .cta-line { width: 40px; background: ${BG}; }

        @media (max-width: 768px) {
          .feat-grid { grid-template-columns: 1fr !important; }
          .cap-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .process-grid { grid-template-columns: 1fr !important; }
          .split-hero { flex-direction: column !important; }
          .panel-divider { display: none; }
          .prod-panel { min-height: 45vh !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
         SECTION 1 — HERO
         ══════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="https://picsum.photos/id/1036/1920/1080"
            alt=""
            fill
            style={{ objectFit: 'cover', opacity: 0.06 }}
            sizes="100vw"
            unoptimized
            priority
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, ${BG}, transparent 30%, ${BG})`,
            }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>
          <div className="reveal" style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <div style={{ height: '1px', width: '48px', background: GOLD, opacity: 0.3 }} />
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(0.5rem, 0.6vw, 0.65rem)',
                  fontWeight: 600,
                  color: GOLD,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                }}
              >
                Neelakar Creative House
              </span>
              <div style={{ height: '1px', width: '48px', background: GOLD, opacity: 0.3 }} />
            </div>
          </div>

          <Shuffle
            text="PRODUCTION"
            tag="h1"
            textAlign="center"
            shuffleDirection="up"
            maxDelay={1.5}
            duration={1}
            ease="power2.out"
            shuffleTimes={1}
            triggerOnce
            triggerOnHover={false}
            rootMargin="0px"
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(2.4rem, 10vw, 10rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 0.9,
              letterSpacing: '0.06em',
            }}
          />

          <p
            className="reveal"
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(0.8rem, 0.95vw, 1rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.15em',
              lineHeight: 1.8,
              marginTop: '28px',
            }}
          >
            Photography &amp; Videography for fashion, jewellery &amp; luxury brands
          </p>
        </div>

        <div
          className="reveal"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div style={{ width: '1px', height: '48px', background: GOLD, opacity: 0.2, marginBottom: '8px' }} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: '0.55rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
            }}
          >
            Scroll
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════
         SECTION 2 — FEATURED WORK
         ══════════════════════════════════════ */}
      <section style={{ padding: 'clamp(4rem, 10vh, 8rem) clamp(16px, 4vw, 48px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(0.5rem, 0.6vw, 0.65rem)',
                fontWeight: 600,
                color: GOLD,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
              }}
            >
              Selected Work
            </span>
          </div>
          <div
            className="reveal"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 'clamp(32px, 5vw, 60px)',
            }}
          >
            <h2
              style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#fff',
                margin: 0,
              }}
            >
              Featured Projects
            </h2>
            <div style={{ height: '1px', flex: '1 1 0', margin: '0 24px', background: 'rgba(255,255,255,0.06)' }} />
            <span
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(0.6rem, 0.7vw, 0.75rem)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.15em',
                whiteSpace: 'nowrap',
              }}
            >
              {String(FEATURED.length).padStart(2, '0')} Projects
            </span>
          </div>

          <div
            className="feat-grid reveal-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(8px, 1.2vw, 16px)',
            }}
          >
            {FEATURED.map((proj, i) => (
              <div
                key={i}
                className="feat-card"
                style={{ aspectRatio: '3/4', borderRadius: '2px' }}
              >
                <div className="feat-img" style={{ position: 'absolute', inset: 0 }}>
                  <Image
                    src={`https://picsum.photos/id/${proj.imageId}/800/1060`}
                    alt={`${proj.title} ${proj.subtitle}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
                <div className="feat-overlay" />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'clamp(20px, 2.5vw, 36px)',
                    zIndex: 5,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 'clamp(0.48rem, 0.55vw, 0.6rem)',
                        fontWeight: 500,
                        color: GOLD,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {proj.category}
                    </span>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 'clamp(0.48rem, 0.55vw, 0.6rem)',
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.2)',
                        letterSpacing: '0.15em',
                      }}
                    >
                      {proj.year}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      color: '#fff',
                      lineHeight: 1.15,
                      margin: 0,
                    }}
                  >
                    {proj.title}
                    <br />
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{proj.subtitle}</span>
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 'clamp(0.5rem, 0.58vw, 0.62rem)',
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.25)',
                        letterSpacing: '0.15em',
                      }}
                    >
                      {proj.client}
                    </span>
                    <div className="feat-line" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
         SECTION 3 — CAPABILITIES
         ══════════════════════════════════════ */}
      <section
        style={{
          padding: 'clamp(4rem, 10vh, 8rem) clamp(16px, 4vw, 48px)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(0.5rem, 0.6vw, 0.65rem)',
                fontWeight: 600,
                color: GOLD,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
              }}
            >
              What We Do
            </span>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#fff',
                marginTop: '12px',
              }}
            >
              Capabilities
            </h2>
          </div>

          <div
            className="cap-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1px 1fr',
              gap: 'clamp(32px, 5vw, 80px)',
            }}
          >
            {/* Photography column */}
            <div className="reveal">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <span
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 200,
                    color: GOLD,
                    opacity: 0.15,
                    lineHeight: 1,
                  }}
                >
                  01
                </span>
                <h3
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(1.3rem, 1.8vw, 1.6rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#fff',
                    margin: 0,
                  }}
                >
                  Photography
                </h3>
              </div>
              <div className="reveal-stagger">
                {CAPABILITIES.photography.map((cap) => (
                  <div
                    key={cap}
                    className="cap-item"
                    onMouseEnter={() => setHoveredCap(cap)}
                    onMouseLeave={() => setHoveredCap(null)}
                  >
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 'clamp(0.78rem, 0.88vw, 0.95rem)',
                        fontWeight: 400,
                        color: hoveredCap === cap ? '#fff' : 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.08em',
                        transition: 'color 0.3s',
                      }}
                    >
                      {cap}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ background: 'rgba(200,169,110,0.08)', display: 'block' }} className="hidden md:block" />

            {/* Videography column */}
            <div className="reveal">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <span
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 200,
                    color: GOLD,
                    opacity: 0.15,
                    lineHeight: 1,
                  }}
                >
                  02
                </span>
                <h3
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(1.3rem, 1.8vw, 1.6rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#fff',
                    margin: 0,
                  }}
                >
                  Videography
                </h3>
              </div>
              <div className="reveal-stagger">
                {CAPABILITIES.videography.map((cap) => (
                  <div
                    key={cap}
                    className="cap-item"
                    onMouseEnter={() => setHoveredCap(cap)}
                    onMouseLeave={() => setHoveredCap(null)}
                  >
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 'clamp(0.78rem, 0.88vw, 0.95rem)',
                        fontWeight: 400,
                        color: hoveredCap === cap ? '#fff' : 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.08em',
                        transition: 'color 0.3s',
                      }}
                    >
                      {cap}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
         SECTION 4 — PROCESS
         ══════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 10vh, 8rem) clamp(16px, 4vw, 48px)',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div className="parallax-img" style={{ position: 'absolute', inset: '-20% 0', }}>
            <Image
              src="https://picsum.photos/id/1018/1920/1080"
              alt=""
              fill
              style={{ objectFit: 'cover', opacity: 0.04 }}
              sizes="100vw"
              unoptimized
            />
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(0.5rem, 0.6vw, 0.65rem)',
                fontWeight: 600,
                color: GOLD,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
              }}
            >
              How We Work
            </span>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#fff',
                marginTop: '12px',
              }}
            >
              Our Process
            </h2>
          </div>

          <div
            className="process-grid reveal-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            {PROCESS.map((step) => (
              <div key={step.num} className="step-card" style={{ background: BG }}>
                <span
                  className="step-num"
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                    fontWeight: 200,
                    color: 'rgba(255,255,255,0.08)',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '20px',
                  }}
                >
                  {step.num}
                </span>
                <h3
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(1.1rem, 1.4vw, 1.4rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#fff',
                    margin: '0 0 12px 0',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 'clamp(0.72rem, 0.78vw, 0.82rem)',
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.3)',
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
         SECTION 5 — PORTFOLIO GATEWAY
         ══════════════════════════════════════ */}
      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div
          className="reveal"
          style={{
            textAlign: 'center',
            padding: 'clamp(3rem, 6vh, 5rem) 24px clamp(1.5rem, 3vh, 2.5rem)',
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(0.5rem, 0.6vw, 0.65rem)',
              fontWeight: 600,
              color: GOLD,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
            }}
          >
            Explore Portfolio
          </span>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#fff',
              marginTop: '12px',
            }}
          >
            Enter the Gallery
          </h2>
        </div>

        <div
          className="split-hero"
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: 'clamp(50vh, 70vh, 80vh)',
            position: 'relative',
          }}
        >
          <div className="panel-divider" />

          {PANELS.map((panel, idx) => {
            const isHovered = hovered === idx
            const otherHovered = hovered !== null && hovered !== idx
            const mp = mousePos[idx]
            const px = (mp.x - 0.5) * -20
            const py = (mp.y - 0.5) * -15

            return (
              <Link
                key={panel.href}
                href={panel.href}
                className="prod-panel"
                style={{
                  flex: isHovered ? 1.35 : otherHovered ? 0.65 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 'clamp(24px, 4vw, 48px)',
                  textDecoration: 'none',
                }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                onMouseMove={(e) => handlePanelMouse(e, idx)}
              >
                <div
                  className="panel-bg"
                  style={{
                    transform: isHovered ? `scale(1.08) translate(${px}px, ${py}px)` : 'scale(1)',
                  }}
                >
                  <Image
                    src={panel.image}
                    alt={panel.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="50vw"
                    unoptimized
                  />
                </div>

                <div
                  className="panel-overlay"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(to top, rgba(6,15,11,0.85) 0%, rgba(6,15,11,0.3) 50%, rgba(6,15,11,0.15) 100%)'
                      : 'linear-gradient(to top, rgba(6,15,11,0.92) 0%, rgba(6,15,11,0.6) 50%, rgba(6,15,11,0.45) 100%)',
                  }}
                />

                <div className="panel-gold-line" />

                <span
                  style={{
                    position: 'absolute',
                    top: 'clamp(20px, 3vw, 40px)',
                    ...(idx === 0
                      ? { left: 'clamp(20px, 3vw, 40px)' }
                      : { right: 'clamp(20px, 3vw, 40px)' }),
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(3rem, 6vw, 5rem)',
                    fontWeight: 200,
                    color: isHovered ? GOLD : 'rgba(255,255,255,0.06)',
                    lineHeight: 1,
                    zIndex: 10,
                    transition: 'color 0.5s',
                  }}
                >
                  {panel.num}
                </span>

                <div style={{ position: 'relative', zIndex: 10 }}>
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 'clamp(0.5rem, 0.6vw, 0.65rem)',
                      fontWeight: 600,
                      color: GOLD,
                      letterSpacing: '0.4em',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                    }}
                  >
                    {panel.accent}
                  </span>
                  <h3
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 'clamp(2rem, 4.5vw, 4rem)',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      color: '#fff',
                      lineHeight: 1.1,
                      margin: '12px 0 16px',
                    }}
                  >
                    {panel.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 'clamp(0.72rem, 0.8vw, 0.85rem)',
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.35)',
                      lineHeight: 1.7,
                      maxWidth: '380px',
                      marginBottom: '20px',
                    }}
                  >
                    {panel.tagline}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 'clamp(0.55rem, 0.65vw, 0.7rem)',
                        fontWeight: 600,
                        color: GOLD,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Explore
                    </span>
                    <svg
                      className="panel-arrow"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={GOLD}
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
         SECTION 6 — CTA
         ══════════════════════════════════════ */}
      <section
        style={{
          padding: 'clamp(5rem, 12vh, 10rem) 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div className="reveal">
          <blockquote
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(1.5rem, 2.8vw, 2.6rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.5,
              maxWidth: '700px',
              margin: 0,
            }}
          >
            We don&rsquo;t just capture moments.
            <br />
            We architect them.
          </blockquote>
        </div>

        <p
          className="reveal"
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(0.78rem, 0.85vw, 0.9rem)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.22)',
            lineHeight: 1.9,
            maxWidth: '520px',
            marginTop: '28px',
          }}
        >
          Every frame is a deliberate act of visual storytelling — built to resonate,
          designed to endure, crafted to elevate your brand.
        </p>

        <div className="reveal" style={{ marginTop: '48px' }}>
          <Link href="/create-with-us" className="cta-btn">
            <span className="cta-fill" />
            <span
              className="cta-text"
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(0.6rem, 0.68vw, 0.72rem)',
                fontWeight: 600,
                color: GOLD,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
              }}
            >
              Start a Project
            </span>
            <span className="cta-line" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
         FOOTER
         ══════════════════════════════════════ */}
      <footer
        style={{
          padding: '48px clamp(24px, 4vw, 48px)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', width: '28px', height: '28px' }}>
            <Image src="/NCH_logo_white.png" alt="Neelakar" fill className="object-contain" style={{ opacity: 0.6 }} sizes="28px" />
          </div>
          <span style={{ fontFamily: SANS, fontSize: '0.7rem', fontWeight: 400, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
            Neelakar Creative House
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Production', href: '/production' },
            { label: 'Create With Us', href: '/create-with-us' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: SANS,
                fontSize: '0.65rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
        <span style={{ fontFamily: SANS, fontSize: '0.6rem', fontWeight: 300, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.15em' }}>
          &copy; 2026
        </span>
      </footer>
    </div>
  )
}
