'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Shuffle from '@/components/Shuffle'

gsap.registerPlugin(ScrollTrigger)

const BG = '#060F0B'
const GOLD = '#C8A96E'
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const NUSRAT = "'Nusrat', cursive"

const img = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=85`

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */

interface Work {
  title: string
  category: string
  image: string
  aspect: string
}

const PHOTO_WORKS: Work[] = [
  { title: 'Meridian Collection', category: 'Fashion Editorial', image: 'photo-1509631179647-0177331693ae', aspect: '3/4' },
  { title: 'Velvet Hour', category: 'Portrait', image: 'photo-1534528741775-53994a69daeb', aspect: '4/5' },
  { title: 'Chrono', category: 'Product', image: 'photo-1523275335684-37898b6baf30', aspect: '1/1' },
  { title: 'Urban Symmetry', category: 'Architecture', image: 'photo-1487958449943-2429e8be8625', aspect: '4/3' },
  { title: 'Gilded', category: 'Jewellery', image: 'photo-1515562141589-67f0d569b6f5', aspect: '3/4' },
  { title: 'Front Row', category: 'Campaign', image: 'photo-1469334031218-e382a71b716b', aspect: '4/3' },
  { title: 'Silhouette', category: 'Editorial', image: 'photo-1558618666-fcd25c85f82e', aspect: '2/3' },
  { title: 'Essence', category: 'Brand', image: 'photo-1581044777550-4cfa60707998', aspect: '1/1' },
  { title: 'Lumière', category: 'Beauty', image: 'photo-1531746020798-e6953c6e8e04', aspect: '3/4' },
  { title: 'Horizon', category: 'Landscape', image: 'photo-1505765050516-f72dcac9c60e', aspect: '16/9' },
]

const VIDEO_WORKS: Work[] = [
  { title: 'Uncut', category: 'Behind the Scenes', image: 'photo-1485846234645-a62644f84728', aspect: '4/3' },
  { title: 'Frame by Frame', category: 'Campaign Film', image: 'photo-1492691527719-9d1e07e534b4', aspect: '3/4' },
  { title: 'The Take', category: 'Short Film', image: 'photo-1536440136628-849c177e76a1', aspect: '1/1' },
  { title: 'Reel', category: 'Showreel', image: 'photo-1478720568477-152d9b164e26', aspect: '4/5' },
  { title: "Director's Cut", category: 'Brand Film', image: 'photo-1524712245354-2c4e5e7121c0', aspect: '4/3' },
  { title: 'Above', category: 'Aerial', image: 'photo-1506905925346-21bda4d32df4', aspect: '16/9' },
  { title: 'Tungsten', category: 'Studio', image: 'photo-1540655037529-dec987208707', aspect: '3/4' },
  { title: 'In Motion', category: 'Documentary', image: 'photo-1616530940355-351fabd9524b', aspect: '1/1' },
  { title: 'Glass', category: 'Commercial', image: 'photo-1579189495777-e48f6b10f6e4', aspect: '3/4' },
  { title: 'Final Cut', category: 'Post-Production', image: 'photo-1574717024653-61fd2cf4d44d', aspect: '4/3' },
]

const PROCESS = [
  {
    num: '01',
    title: 'Discovery',
    accent: 'Before the first frame, we listen.',
    body: 'We immerse ourselves in your world — your brand DNA, your audience, your ambition. Every great visual begins with understanding.',
    image: 'photo-1522071820081-009f0129c71c',
  },
  {
    num: '02',
    title: 'Concept',
    accent: 'Every great visual begins as a feeling.',
    body: 'We translate your story into a creative direction — mood boards, shot lists, narratives that resonate with precision and emotion.',
    image: 'photo-1558655146-9f40138edfeb',
  },
  {
    num: '03',
    title: 'Production',
    accent: 'Where preparation meets precision.',
    body: 'On set, every detail matters. Lighting, composition, movement — orchestrated with the intention of a conductor.',
    image: 'photo-1542038784456-1ea8e935640e',
  },
  {
    num: '04',
    title: 'Delivery',
    accent: 'The final frame is just the beginning.',
    body: 'Color grading, retouching, formats optimized for every platform. Delivered with the care and craft of an atelier.',
    image: 'photo-1460925895917-afdab827c52f',
  },
]

const PROMISES = [
  { title: 'Cinematic Quality', body: 'Every frame treated as a work of art, not a deliverable.' },
  { title: 'Brand Coherence', body: 'A visual language that builds recognition across every touchpoint.' },
  { title: 'Swift Delivery', body: 'Because momentum matters. We move fast without cutting corners.' },
  { title: 'Full Ownership', body: 'You own every pixel, every frame, every asset. No strings.' },
  { title: 'Platform-Ready', body: 'Optimized for Instagram, web, print, billboard — wherever your audience lives.' },
  { title: 'Creative Partnership', body: "We're not vendors. We're invested in your visual narrative long-term." },
]

/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */

export default function ProductionPage() {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo')
  const works = activeTab === 'photo' ? PHOTO_WORKS : VIDEO_WORKS

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('.process-img').forEach((el) => {
        gsap.to(el, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement!,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const items = document.querySelectorAll('.portfolio-item')
    gsap.fromTo(items,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.05 }
    )
  }, [activeTab])

  return (
    <div style={{ backgroundColor: BG }}>

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={img('photo-1542038784456-1ea8e935640e', 1920, 1080)}
            alt="" fill className="object-cover" style={{ opacity: 0.07 }}
            sizes="100vw" priority
          />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${BG}, transparent 30%, ${BG})` }} />
        </div>

        <div className="relative z-10 text-center px-6">
          <div className="reveal mb-6">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12" style={{ backgroundColor: GOLD, opacity: 0.3 }} />
              <span style={{
                fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.65vw, 0.7rem)',
                fontWeight: 600, color: GOLD, letterSpacing: '0.5em', textTransform: 'uppercase',
              }}>Neelakar Creative House</span>
              <div className="h-px w-12" style={{ backgroundColor: GOLD, opacity: 0.3 }} />
            </div>
          </div>

          <Shuffle
            text="PRODUCTION"
            tag="h1" textAlign="center" shuffleDirection="up"
            maxDelay={1.5} duration={1} ease="power2.out"
            shuffleTimes={1} triggerOnce triggerOnHover={false} rootMargin="0px"
            style={{
              fontFamily: DISPLAY, fontSize: 'clamp(3.5rem, 10vw, 10rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
              lineHeight: 0.9, letterSpacing: '0.06em',
            }}
            className="font-[inherit] !leading-[0.9]"
          />

          <div className="reveal mt-8">
            <p style={{
              fontFamily: SANS, fontSize: 'clamp(0.85rem, 1vw, 1.05rem)',
              fontWeight: 300, color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.15em', lineHeight: 1.8,
            }}>
              Photography &amp; Videography for fashion, jewellery, and luxury brands
            </p>
          </div>

          <div className="reveal mt-6">
            <span style={{ fontFamily: NUSRAT, fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', color: GOLD }}>
              where light meets intention
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 reveal flex flex-col items-center">
          <div className="w-px h-12 mb-2" style={{ backgroundColor: GOLD, opacity: 0.2 }} />
          <span style={{
            fontFamily: SANS, fontSize: '0.55rem', fontWeight: 500,
            color: 'rgba(255,255,255,0.2)', letterSpacing: '0.4em', textTransform: 'uppercase',
          }}>Scroll</span>
        </div>
      </section>

      {/* ═══ STATEMENT ═══ */}
      <section className="relative py-24 md:py-36 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="reveal">
            <div className="h-px w-16 mb-10" style={{ backgroundColor: GOLD, opacity: 0.2 }} />
          </div>
          <blockquote className="reveal" style={{
            fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 3vw, 3rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.7)', lineHeight: 1.5,
          }}>
            We don&rsquo;t just capture moments.<br />
            We architect them.
          </blockquote>
          <div className="reveal mt-10 max-w-xl">
            <p style={{
              fontFamily: SANS, fontSize: 'clamp(0.82rem, 0.9vw, 0.95rem)',
              fontWeight: 300, color: 'rgba(255,255,255,0.28)', lineHeight: 2,
            }}>
              Every frame we produce is a deliberate act of visual storytelling —
              built to resonate, designed to endure, crafted to elevate your brand
              above the noise.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ PORTFOLIO ═══ */}
      <section className="relative py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <div className="reveal">
            <span style={{
              fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
              fontWeight: 600, color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
            }}>Selected Work</span>
          </div>
          <h2 className="reveal mt-4" style={{
            fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300, fontStyle: 'italic', color: '#fff',
          }}>Portfolio</h2>

          <div className="reveal flex items-center justify-center mt-10">
            <div className="inline-flex" style={{ border: '1px solid rgba(200,169,110,0.15)' }}>
              {(['photo', 'video'] as const).map((tab) => {
                const active = activeTab === tab
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="relative px-7 md:px-10 py-3.5 transition-all duration-400 cursor-pointer"
                    style={{
                      fontFamily: SANS, fontSize: 'clamp(0.65rem, 0.72vw, 0.78rem)',
                      fontWeight: active ? 600 : 400, letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: active ? GOLD : 'rgba(255,255,255,0.35)',
                      backgroundColor: active ? 'rgba(200,169,110,0.1)' : 'transparent',
                      border: 'none',
                    }}>
                    {tab === 'photo' ? 'Photography' : 'Videography'}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        <style>{`
          .masonry-grid { columns: 2; column-gap: 8px; }
          @media (min-width: 768px) { .masonry-grid { columns: 3; column-gap: 12px; } }
        `}</style>

        <div className="max-w-[1400px] mx-auto">
          <div className="masonry-grid">
            {works.map((work, i) => (
              <div key={`${activeTab}-${i}`}
                className="portfolio-item mb-2 md:mb-3 break-inside-avoid relative overflow-hidden group cursor-pointer"
                style={{ aspectRatio: work.aspect, opacity: 0 }}>
                <Image
                  src={img(work.image)}
                  alt={work.title} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6"
                  style={{ background: 'linear-gradient(to top, rgba(6,15,11,0.88) 0%, transparent 60%)' }}>
                  <span style={{
                    fontFamily: SANS, fontSize: 'clamp(0.5rem, 0.58vw, 0.62rem)',
                    fontWeight: 500, color: GOLD, letterSpacing: '0.3em', textTransform: 'uppercase',
                  }}>{work.category}</span>
                  <h3 className="mt-1" style={{
                    fontFamily: DISPLAY, fontSize: 'clamp(1.1rem, 1.4vw, 1.5rem)',
                    fontWeight: 400, fontStyle: 'italic', color: '#fff',
                  }}>{work.title}</h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span style={{
                      fontFamily: SANS, fontSize: '0.58rem', fontWeight: 600,
                      color: GOLD, letterSpacing: '0.25em', textTransform: 'uppercase',
                    }}>View Project</span>
                    <span className="inline-block h-px w-4 group-hover:w-8 transition-all duration-300"
                      style={{ backgroundColor: GOLD }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section className="relative py-20 md:py-32">
        <div className="text-center mb-16 md:mb-24 px-6">
          <div className="reveal">
            <span style={{
              fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
              fontWeight: 600, color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
            }}>How We Work</span>
          </div>
          <h2 className="reveal mt-4" style={{
            fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300, fontStyle: 'italic', color: '#fff',
          }}>Our Process</h2>
        </div>

        {PROCESS.map((step, i) => {
          const isEven = i % 2 === 0
          return (
            <div key={i} className="relative mb-20 md:mb-32 last:mb-0">
              <div className="relative w-full overflow-hidden"
                style={{ height: 'clamp(300px, 50vh, 600px)' }}>
                <div className="process-img absolute inset-x-0" style={{ top: '-15%', bottom: '-15%' }}>
                  <Image
                    src={img(step.image, 1920, 1080)}
                    alt={step.title} fill className="object-cover"
                    style={{ opacity: 0.3 }} sizes="100vw"
                  />
                </div>
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(to ${isEven ? 'right' : 'left'}, ${BG} 30%, transparent 70%)` }} />
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(to bottom, transparent 0%, ${BG} 100%)` }} />

                <div className={`absolute inset-0 flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}>
                  <div className={`px-8 md:px-16 lg:px-24 max-w-xl ${isEven ? '' : 'text-right'}`}>
                    <div className="reveal">
                      <span style={{
                        fontFamily: DISPLAY, fontSize: 'clamp(4rem, 8vw, 7rem)',
                        fontWeight: 200, color: GOLD, opacity: 0.15, lineHeight: 1,
                      }}>{step.num}</span>
                    </div>
                    <h3 className="reveal -mt-4 md:-mt-6" style={{
                      fontFamily: DISPLAY, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                      fontWeight: 300, fontStyle: 'italic', color: '#fff',
                    }}>{step.title}</h3>
                    <p className="reveal mt-3" style={{
                      fontFamily: NUSRAT, fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', color: GOLD,
                    }}>{step.accent}</p>
                    <p className="reveal mt-5" style={{
                      fontFamily: SANS, fontSize: 'clamp(0.8rem, 0.88vw, 0.92rem)',
                      fontWeight: 300, color: 'rgba(255,255,255,0.35)', lineHeight: 1.9,
                    }}>{step.body}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* ═══ PROMISES ═══ */}
      <section className="relative py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 md:mb-20">
            <div className="reveal">
              <span style={{
                fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
                fontWeight: 600, color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
              }}>What You Get</span>
            </div>
            <h2 className="reveal mt-4" style={{
              fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
            }}>Our Promises</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{ backgroundColor: 'rgba(200,169,110,0.06)' }}>
            {PROMISES.map((p, i) => (
              <div key={i} className="reveal p-8 md:p-10" style={{ backgroundColor: BG }}>
                <div className="flex items-start gap-4 mb-4">
                  <span style={{
                    fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 300,
                    fontStyle: 'italic', color: GOLD, opacity: 0.4, lineHeight: 1,
                  }}>0{i + 1}</span>
                  <h3 style={{
                    fontFamily: DISPLAY, fontSize: 'clamp(1.1rem, 1.3vw, 1.35rem)',
                    fontWeight: 400, fontStyle: 'italic', color: '#fff',
                  }}>{p.title}</h3>
                </div>
                <p style={{
                  fontFamily: SANS, fontSize: 'clamp(0.78rem, 0.84vw, 0.88rem)',
                  fontWeight: 300, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8,
                  paddingLeft: '2.2rem',
                }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-32 md:py-44 flex flex-col items-center justify-center text-center px-6">
        <div className="reveal">
          <span style={{ fontFamily: NUSRAT, fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)', color: GOLD }}>
            the next frame is yours
          </span>
        </div>
        <h2 className="reveal mt-6" style={{
          fontFamily: DISPLAY, fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
          fontWeight: 300, fontStyle: 'italic', color: '#fff',
          lineHeight: 1.2, maxWidth: '16ch',
        }}>
          Ready to build your visual narrative?
        </h2>
        <div className="reveal mt-10">
          <Link href="/create-with-us"
            className="group relative inline-flex items-center gap-4 px-10 py-4 overflow-hidden"
            style={{ textDecoration: 'none', border: '1px solid rgba(200,169,110,0.3)' }}>
            <span className="relative z-10 transition-colors duration-400 group-hover:text-[#060F0B]"
              style={{
                fontFamily: SANS, fontSize: 'clamp(0.62rem, 0.7vw, 0.72rem)',
                fontWeight: 600, color: GOLD, letterSpacing: '0.35em', textTransform: 'uppercase',
              }}>Start a Project</span>
            <span className="relative z-10 inline-block h-px w-6 transition-all duration-500 group-hover:w-10 group-hover:bg-[#060F0B]"
              style={{ backgroundColor: GOLD }} />
            <span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
              style={{ backgroundColor: GOLD }} />
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative py-12 px-6 md:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-7 h-7">
              <Image src="/NCH_logo_white.png" alt="Neelakar" fill className="object-contain opacity-60" sizes="28px" />
            </div>
            <span style={{
              fontFamily: SANS, fontSize: '0.7rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em',
            }}>Neelakar Creative House</span>
          </div>
          <div className="flex items-center gap-8">
            {[
              { label: 'Home', href: '/' },
              { label: 'Production', href: '/production' },
              { label: 'Create With Us', href: '/create-with-us' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="hover:!text-white/50 transition-colors duration-300"
                style={{
                  fontFamily: SANS, fontSize: '0.65rem', fontWeight: 400,
                  color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em',
                  textTransform: 'uppercase', textDecoration: 'none',
                }}>
                {label}
              </Link>
            ))}
          </div>
          <span style={{
            fontFamily: SANS, fontSize: '0.6rem', fontWeight: 300,
            color: 'rgba(255,255,255,0.15)', letterSpacing: '0.15em',
          }}>© 2026</span>
        </div>
      </footer>
    </div>
  )
}
