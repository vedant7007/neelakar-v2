'use client'

import { useEffect, useRef } from 'react'
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
const NUSRAT = "'Nusrat', cursive"

const img = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=85`

interface Film {
  title: string
  category: string
  role: string
  client?: string
  image: string
  year: string
}

const HERO_STRIP = [
  'photo-1485846234645-a62644f84728',
  'photo-1536440136628-849c177e76a1',
  'photo-1478720568477-152d9b164e26',
  'photo-1524712245354-2c4e5e7121c0',
  'photo-1558171813-4c088753af8f',
  'photo-1469334031218-e382a71b716b',
  'photo-1540655037529-dec987208707',
  'photo-1616530940355-351fabd9524b',
]

const FILMS: Film[] = [
  { title: 'The Weaver\'s Thread', category: 'Brand Film', role: 'Director & DP', client: 'Sabyasachi', image: 'photo-1558171813-4c088753af8f', year: '2026' },
  { title: 'Light Within', category: 'Campaign', role: 'Director', client: 'Tanishq', image: 'photo-1617038220319-276d3cfab638', year: '2026' },
  { title: 'Khadi In Motion', category: 'Documentary', role: 'Director & Editor', client: 'Raw Mango', image: 'photo-1469334031218-e382a71b716b', year: '2025' },
  { title: 'Atelier', category: 'Fashion Film', role: 'Cinematographer', client: 'Rahul Mishra', image: 'photo-1583391733956-6c78276477e2', year: '2025' },
]

const EDITORIALS: Film[] = [
  { title: 'Dusk Protocol', category: 'Editorial', role: 'Director & DP', image: 'photo-1492691527719-9d1e07e534b4', year: '2025' },
  { title: 'Gilded Silence', category: 'Fashion Film', role: 'Director', image: 'photo-1534528741775-53994a69daeb', year: '2025' },
  { title: 'Neon Vesper', category: 'Music Video', role: 'Director & DP', image: 'photo-1536440136628-849c177e76a1', year: '2024' },
]

const COMMERCIALS: Film[] = [
  { title: 'Genesis', category: 'TVC', role: 'Director', client: 'Kalyan Jewellers', image: 'photo-1602751584552-8ba73aad10e1', year: '2025' },
  { title: 'Prism', category: 'Digital Campaign', role: 'Director & DP', client: 'Krishna Pearls', image: 'photo-1515562141589-67f0d569b6f5', year: '2025' },
  { title: 'Unbound', category: 'Social Film', role: 'Director', image: 'photo-1574717024653-61fd2cf4d44d', year: '2024' },
]

const NAV_ITEMS = [
  { num: '01', label: 'Work' },
  { num: '02', label: 'Editorial' },
  { num: '03', label: 'Commercial' },
  { num: '04', label: 'Contact' },
]

function ItalicFirst({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  if (!text) return null
  return (
    <span className={className} style={style}>
      <span style={{ fontStyle: 'italic' }}>{text[0]}</span>{text.slice(1)}
    </span>
  )
}

export default function VideographyPage() {
  const stripRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (stripRef.current) {
        const strip = stripRef.current
        gsap.to(strip, {
          x: '-50%',
          ease: 'none',
          duration: 30,
          repeat: -1,
        })
      }

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
        )
      })

      gsap.utils.toArray<HTMLElement>('.film-card').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
        )
      })

      gsap.utils.toArray<HTMLElement>('.editorial-card').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: i * 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: el.parentElement!, start: 'top 80%', once: true } }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  const scrollToSection = (label: string) => {
    const id = label.toLowerCase()
    const el = document.getElementById(id)
    if (el) {
      window.__lenis?.scrollTo(el, { offset: -60 })
    }
  }

  return (
    <div style={{ backgroundColor: BG }}>

      {/* ═══ HEADER / NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-8 py-4"
        style={{ backgroundColor: 'rgba(6,15,11,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(200,169,110,0.06)' }}>
        <Link href="/production" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            style={{ color: 'rgba(255,255,255,0.3)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
          <span style={{
            fontFamily: DISPLAY, fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
            fontWeight: 400, fontStyle: 'italic', color: '#fff',
          }}>Neelakar</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button key={item.num} onClick={() => scrollToSection(item.label)}
              className="cursor-pointer group flex items-center gap-2 transition-colors duration-300 hover:!text-white"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)' }}>
              <span style={{
                fontFamily: SANS, fontSize: '0.55rem', fontWeight: 300,
                color: GOLD, opacity: 0.5, letterSpacing: '0.1em',
              }}>{item.num}</span>
              <span style={{
                fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.65vw, 0.68rem)',
                fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase',
              }}>{item.label}</span>
            </button>
          ))}
        </div>

        <Link href="/production/photography"
          className="transition-colors duration-300 hover:!text-white"
          style={{
            fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.65vw, 0.68rem)',
            fontWeight: 500, color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none',
          }}>Image</Link>
      </nav>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(200,169,110,0.03)_0%,transparent_60%)]" />

        <div className="relative z-10 text-center px-6 mb-12">
          <div className="reveal mb-4">
            <span style={{
              fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
              fontWeight: 600, color: GOLD, letterSpacing: '0.6em', textTransform: 'uppercase',
            }}>Intimate, Raw Human Storytelling</span>
          </div>

          <Shuffle
            text="NEELAKAR FILMS"
            tag="h1" textAlign="center" shuffleDirection="up"
            maxDelay={1.5} duration={1} ease="power2.out"
            shuffleTimes={1} triggerOnce triggerOnHover={false} rootMargin="0px"
            style={{
              fontFamily: DISPLAY, fontSize: 'clamp(3rem, 8vw, 8rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
              lineHeight: 0.9, letterSpacing: '0.04em',
            }}
          />

          <div className="reveal mt-6">
            <span style={{ fontFamily: NUSRAT, fontSize: 'clamp(1rem, 1.4vw, 1.3rem)', color: GOLD }}>
              director &amp; cinematographer
            </span>
          </div>
        </div>

        {/* Film strip carousel */}
        <div className="w-full overflow-hidden py-4" style={{ borderTop: '1px solid rgba(200,169,110,0.06)', borderBottom: '1px solid rgba(200,169,110,0.06)' }}>
          <div ref={stripRef} className="flex gap-3" style={{ width: 'max-content' }}>
            {[...HERO_STRIP, ...HERO_STRIP].map((id, i) => (
              <div key={i} className="relative shrink-0 w-[140px] md:w-[200px] h-[90px] md:h-[120px] overflow-hidden group">
                <Image
                  src={img(id, 400, 240)}
                  alt="" fill unoptimized
                  className="object-cover transition-all duration-500 saturate-[0.7] group-hover:saturate-100"
                  sizes="200px"
                />
                <div className="absolute inset-0 border border-white/[0.03]" />
                {/* Film strip perforations */}
                <div className="absolute top-0 left-0 right-0 h-[6px] flex justify-between px-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="w-[4px] h-[4px] rounded-[1px] mt-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[6px] flex justify-between px-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="w-[4px] h-[4px] rounded-[1px] mb-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal mt-8 flex flex-col items-center">
          <div className="w-px h-10 mb-2" style={{ backgroundColor: GOLD, opacity: 0.15 }} />
          <span style={{
            fontFamily: SANS, fontSize: '0.55rem', fontWeight: 500,
            color: 'rgba(255,255,255,0.15)', letterSpacing: '0.4em', textTransform: 'uppercase',
          }}>Scroll</span>
        </div>
      </section>

      {/* ═══ TV & FILM — stacked full-width cards ═══ */}
      <section id="work" className="py-20 md:py-32 px-5 md:px-8 lg:px-12">
        <div className="max-w-[1300px] mx-auto">
          <div className="reveal flex items-center gap-4 mb-14">
            <span style={{
              fontFamily: SANS, fontSize: '0.58rem', fontWeight: 300,
              color: GOLD, opacity: 0.5, letterSpacing: '0.1em',
            }}>01</span>
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(200,169,110,0.08)' }} />
            <h2 style={{
              fontFamily: DISPLAY, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
            }}>
              <ItalicFirst text="TV & Film" style={{
                fontFamily: DISPLAY, fontSize: 'inherit', fontWeight: 'inherit', fontStyle: 'normal', color: 'inherit',
              }} />
            </h2>
          </div>

          <div className="space-y-6 md:space-y-8">
            {FILMS.map((film, i) => (
              <div key={i} className="film-card group cursor-pointer relative overflow-hidden"
                style={{ border: '1px solid rgba(200,169,110,0.06)' }}>
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative w-full md:w-2/5 overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <Image
                      src={img(film.image)}
                      alt={film.title} fill unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-all duration-500" />
                    {/* Play icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <div className="h-14 w-14 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(200,169,110,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(200,169,110,0.2)' }}>
                        <svg className="h-5 w-5 ml-0.5" style={{ color: '#fff' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        {film.client && (
                          <span style={{
                            fontFamily: SANS, fontSize: '0.58rem', fontWeight: 500,
                            color: GOLD, letterSpacing: '0.3em', textTransform: 'uppercase',
                          }}>{film.client}</span>
                        )}
                        <span style={{
                          fontFamily: SANS, fontSize: '0.55rem', fontWeight: 300,
                          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em',
                        }}>{film.year}</span>
                      </div>
                      <h3 className="transition-colors duration-300 group-hover:!text-white" style={{
                        fontFamily: DISPLAY, fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                        fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.2,
                      }}>{film.title}</h3>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5" style={{
                          fontFamily: SANS, fontSize: '0.55rem', fontWeight: 500,
                          color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}>{film.category}</span>
                        <span className="px-3 py-1.5" style={{
                          fontFamily: SANS, fontSize: '0.55rem', fontWeight: 500,
                          color: GOLD, letterSpacing: '0.15em',
                          border: '1px solid rgba(200,169,110,0.15)',
                        }}>{film.role}</span>
                      </div>
                      <span className="inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          fontFamily: SANS, fontSize: '0.58rem', fontWeight: 600,
                          color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase',
                        }}>
                        Watch
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EDITORIAL / FASHION — grid cards ═══ */}
      <section id="editorial" className="py-20 md:py-32 px-5 md:px-8 lg:px-12">
        <div className="max-w-[1300px] mx-auto">
          <div className="reveal flex items-center gap-4 mb-14">
            <span style={{
              fontFamily: SANS, fontSize: '0.58rem', fontWeight: 300,
              color: GOLD, opacity: 0.5, letterSpacing: '0.1em',
            }}>02</span>
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(200,169,110,0.08)' }} />
            <h2 style={{
              fontFamily: DISPLAY, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
            }}>
              <ItalicFirst text="Editorial & Fashion" style={{
                fontFamily: DISPLAY, fontSize: 'inherit', fontWeight: 'inherit', fontStyle: 'normal', color: 'inherit',
              }} />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {EDITORIALS.map((film, i) => (
              <div key={i} className="editorial-card group cursor-pointer relative overflow-hidden"
                style={{ aspectRatio: '4/5' }}>
                <Image
                  src={img(film.image, 800, 1000)}
                  alt={film.title} fill unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-black/60 transition-all duration-500" />

                {/* Play icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-400"
                    style={{ backgroundColor: 'rgba(200,169,110,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(200,169,110,0.2)' }}>
                    <svg className="h-4 w-4 ml-0.5" style={{ color: '#fff' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1" style={{
                      fontFamily: SANS, fontSize: '0.5rem', fontWeight: 500,
                      color: GOLD, letterSpacing: '0.15em',
                      border: '1px solid rgba(200,169,110,0.2)',
                    }}>{film.role}</span>
                  </div>
                  <h3 style={{
                    fontFamily: DISPLAY, fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)',
                    fontWeight: 400, fontStyle: 'italic', color: '#fff',
                  }}>{film.title}</h3>
                  <span className="block mt-1" style={{
                    fontFamily: SANS, fontSize: '0.55rem', fontWeight: 400,
                    color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase',
                  }}>{film.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMMERCIAL ═══ */}
      <section id="commercial" className="py-20 md:py-32 px-5 md:px-8 lg:px-12">
        <div className="max-w-[1300px] mx-auto">
          <div className="reveal flex items-center gap-4 mb-14">
            <span style={{
              fontFamily: SANS, fontSize: '0.58rem', fontWeight: 300,
              color: GOLD, opacity: 0.5, letterSpacing: '0.1em',
            }}>03</span>
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(200,169,110,0.08)' }} />
            <h2 style={{
              fontFamily: DISPLAY, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
            }}>
              <ItalicFirst text="Commercial" style={{
                fontFamily: DISPLAY, fontSize: 'inherit', fontWeight: 'inherit', fontStyle: 'normal', color: 'inherit',
              }} />
            </h2>
          </div>

          <div style={{ borderTop: '1px solid rgba(200,169,110,0.06)' }}>
            {COMMERCIALS.map((film, i) => (
              <div key={i} className="reveal group cursor-pointer flex items-center gap-5 md:gap-8 py-5 md:py-6 transition-all duration-300 hover:pl-2"
                style={{ borderBottom: '1px solid rgba(200,169,110,0.06)' }}>
                <div className="relative shrink-0 w-20 h-14 md:w-28 md:h-20 overflow-hidden">
                  <Image src={img(film.image, 280, 200)} alt="" fill unoptimized
                    className="object-cover transition-all duration-500 saturate-[0.7] group-hover:saturate-100"
                    sizes="112px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {film.client && (
                      <span style={{
                        fontFamily: SANS, fontSize: '0.55rem', fontWeight: 500,
                        color: GOLD, letterSpacing: '0.25em', textTransform: 'uppercase',
                      }}>{film.client}</span>
                    )}
                  </div>
                  <h3 className="truncate transition-colors duration-300 group-hover:!text-white" style={{
                    fontFamily: DISPLAY, fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)',
                    fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)',
                  }}>{film.title}</h3>
                </div>
                <span className="shrink-0 hidden md:block px-3 py-1.5" style={{
                  fontFamily: SANS, fontSize: '0.5rem', fontWeight: 500,
                  color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>{film.category}</span>
                <span className="shrink-0 hidden md:block" style={{
                  fontFamily: SANS, fontSize: '0.58rem', fontWeight: 300,
                  color: 'rgba(255,255,255,0.15)',
                }}>{film.year}</span>
                <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: GOLD }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="contact" className="relative py-32 md:py-44 flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,169,110,0.03)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <div className="reveal">
            <span style={{ fontFamily: NUSRAT, fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)', color: GOLD }}>
              your story deserves motion
            </span>
          </div>
          <h2 className="reveal mt-6" style={{
            fontFamily: DISPLAY, fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
            fontWeight: 300, fontStyle: 'italic', color: '#fff',
            lineHeight: 1.2, maxWidth: '16ch',
          }}>
            Let&rsquo;s make something cinematic.
          </h2>
          <div className="reveal mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/create-with-us"
              className="group relative inline-flex items-center gap-4 px-10 py-4 overflow-hidden"
              style={{ textDecoration: 'none', border: '1px solid rgba(200,169,110,0.3)' }}>
              <span className="relative z-10 transition-colors duration-400 group-hover:text-[#060F0B]"
                style={{
                  fontFamily: SANS, fontSize: 'clamp(0.62rem, 0.7vw, 0.72rem)',
                  fontWeight: 600, color: GOLD, letterSpacing: '0.35em', textTransform: 'uppercase',
                }}>Start a Film</span>
              <span className="relative z-10 inline-block h-px w-6 transition-all duration-500 group-hover:w-10 group-hover:bg-[#060F0B]"
                style={{ backgroundColor: GOLD }} />
              <span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                style={{ backgroundColor: GOLD }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative py-10 px-5 md:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-6 h-6">
              <Image src="/NCH_logo_white.png" alt="Neelakar" fill className="object-contain opacity-50" sizes="24px" />
            </div>
            <span style={{
              fontFamily: SANS, fontSize: '0.65rem', fontWeight: 300,
              color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em',
            }}>Neelakar Creative House</span>
          </div>
          <div className="flex items-center gap-6">
            {[
              { label: 'Home', href: '/' },
              { label: 'Production', href: '/production' },
              { label: 'Photography', href: '/production/photography' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="hover:!text-white/40 transition-colors duration-300"
                style={{
                  fontFamily: SANS, fontSize: '0.6rem', fontWeight: 400,
                  color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em',
                  textTransform: 'uppercase', textDecoration: 'none',
                }}>{label}</Link>
            ))}
          </div>
          <span style={{
            fontFamily: SANS, fontSize: '0.55rem', fontWeight: 300,
            color: 'rgba(255,255,255,0.1)', letterSpacing: '0.15em',
          }}>&copy; 2026</span>
        </div>
      </footer>
    </div>
  )
}
