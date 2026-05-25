'use client'

import { useRef, useEffect } from 'react'
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

const SHOWREEL = [
  { src: 'photo-1485846234645-a62644f84728', label: 'Behind the Scenes', aspect: '16/9' },
  { src: 'photo-1492691527719-9d1e07e534b4', label: 'Campaign Film', aspect: '4/3' },
  { src: 'photo-1536440136628-849c177e76a1', label: 'Short Film', aspect: '16/9' },
  { src: 'photo-1478720568477-152d9b164e26', label: 'Showreel', aspect: '3/4' },
  { src: 'photo-1524712245354-2c4e5e7121c0', label: 'Brand Film', aspect: '16/9' },
  { src: 'photo-1506905925346-21bda4d32df4', label: 'Aerial & Drone', aspect: '16/9' },
  { src: 'photo-1540655037529-dec987208707', label: 'Studio Production', aspect: '4/3' },
  { src: 'photo-1616530940355-351fabd9524b', label: 'Documentary', aspect: '16/9' },
]

const SERVICES = [
  { title: 'Brand Films', desc: 'Cinematic short films that tell your brand story with emotion, pacing, and professional production value that resonates.' },
  { title: 'Campaign Videos', desc: 'High-impact videos for product launches, seasonal campaigns, and brand moments that demand attention.' },
  { title: 'Social Content', desc: 'Scroll-stopping reels, stories, and posts crafted for engagement across every platform.' },
  { title: 'Aerial & Drone', desc: 'Breathtaking aerial perspectives for real estate, events, and cinematic brand narratives.' },
  { title: 'Documentary', desc: 'Long-form storytelling that captures the depth, nuance, and authenticity of your brand journey.' },
  { title: 'Post Production', desc: 'Color grading, sound design, motion graphics, and editing that elevates raw footage into polished art.' },
]

const PROCESS = [
  { num: '01', title: 'Script & Storyboard', desc: 'We craft the narrative arc, plan every scene, and create detailed storyboards before a single camera rolls.' },
  { num: '02', title: 'Production', desc: 'Professional crew, cinema-grade equipment, expert direction. Every frame is intentional, every movement choreographed.' },
  { num: '03', title: 'Post-Production', desc: 'Color grading, sound design, visual effects, and editing that transforms raw footage into cinematic storytelling.' },
]

const FEATURED = [
  {
    title: 'Sabyasachi — The Weaver\'s Thread',
    category: 'Brand Film',
    image: 'photo-1558171813-4c088753af8f',
    desc: 'A 3-minute brand film celebrating traditional weaving techniques. Capturing the rhythm and poetry of handcraft.',
  },
  {
    title: 'Tanishq — Light Within',
    category: 'Campaign',
    image: 'photo-1617038220319-276d3cfab638',
    desc: 'A multi-platform campaign film showcasing the heritage collection through light, shadow, and cinematic motion.',
  },
  {
    title: 'Raw Mango — Khadi In Motion',
    category: 'Documentary',
    image: 'photo-1469334031218-e382a71b716b',
    desc: 'A documentary-style film following khadi from the loom to the runway. Intimacy meets grandeur.',
  },
]

export default function VideographyPage() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
        )
      })

      if (galleryRef.current && stripRef.current) {
        const strip = stripRef.current
        const totalScroll = strip.scrollWidth - window.innerWidth
        gsap.to(strip, {
          x: -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top top',
            end: () => `+=${totalScroll}`,
            scrub: 1,
            pin: true,
          },
        })
      }

      gsap.utils.toArray<HTMLElement>('.svc-row').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.05,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
        )
      })

      gsap.utils.toArray<HTMLElement>('.featured-card').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div style={{ backgroundColor: BG }}>

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={img('photo-1536440136628-849c177e76a1', 1920, 1080)}
            alt="" fill className="object-cover" style={{ opacity: 0.08 }}
            sizes="100vw" priority
          />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${BG}, transparent 30%, ${BG})` }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(200,169,110,0.04)_0%,transparent_60%)]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <div className="reveal mb-6">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12" style={{ backgroundColor: GOLD, opacity: 0.3 }} />
              <span style={{
                fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.65vw, 0.7rem)',
                fontWeight: 600, color: GOLD, letterSpacing: '0.5em', textTransform: 'uppercase',
              }}>Cinematic Production</span>
              <div className="h-px w-12" style={{ backgroundColor: GOLD, opacity: 0.3 }} />
            </div>
          </div>

          <Shuffle
            text="VIDEOGRAPHY"
            tag="h1" textAlign="center" shuffleDirection="up"
            maxDelay={1.5} duration={1} ease="power2.out"
            shuffleTimes={1} triggerOnce triggerOnHover={false} rootMargin="0px"
            style={{
              fontFamily: DISPLAY, fontSize: 'clamp(3rem, 9vw, 9rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
              lineHeight: 0.9, letterSpacing: '0.06em',
            }}
          />

          <div className="reveal mt-8">
            <p style={{
              fontFamily: SANS, fontSize: 'clamp(0.85rem, 1vw, 1.05rem)',
              fontWeight: 300, color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.15em', lineHeight: 1.8,
            }}>
              Motion is emotion. We craft cinematic stories that move your audience
              &mdash; literally and figuratively.
            </p>
          </div>

          <div className="reveal mt-6">
            <span style={{ fontFamily: NUSRAT, fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)', color: GOLD }}>
              every frame in motion
            </span>
          </div>

          {/* Play button decoration */}
          <div className="reveal mt-14">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full cursor-pointer group transition-all duration-500 hover:scale-110"
              style={{ border: `1px solid rgba(200,169,110,0.3)` }}>
              <svg className="h-7 w-7 ml-1 transition-colors duration-300 group-hover:text-white"
                style={{ color: GOLD }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
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

      {/* ═══ HORIZONTAL SCROLL SHOWREEL ═══ */}
      <section ref={galleryRef} className="relative overflow-hidden" style={{ height: '100vh' }}>
        <div className="h-screen flex items-center">
          <div ref={stripRef} className="flex gap-6 pl-6 lg:pl-12">
            <div className="shrink-0 flex flex-col justify-center w-[280px] lg:w-[360px]">
              <div className="h-px w-12 mb-6" style={{ backgroundColor: GOLD, opacity: 0.2 }} />
              <span style={{
                fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
                fontWeight: 600, color: GOLD, letterSpacing: '0.4em', textTransform: 'uppercase',
              }}>Showreel</span>
              <h2 className="mt-3" style={{
                fontFamily: DISPLAY, fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 300, fontStyle: 'italic', color: '#fff', lineHeight: 1.15,
              }}>
                Stories in<br />
                <span style={{ color: GOLD }}>motion.</span>
              </h2>
              <p className="mt-4" style={{
                fontFamily: SANS, fontSize: '0.75rem', fontWeight: 300,
                color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em',
              }}>Scroll to explore</p>
            </div>

            {SHOWREEL.map((item, i) => (
              <div key={i}
                className="group relative shrink-0 overflow-hidden cursor-pointer"
                style={{
                  width: item.aspect === '16/9' ? 'clamp(350px, 40vw, 580px)' : 'clamp(250px, 28vw, 380px)',
                  height: 'clamp(250px, 35vh, 420px)',
                }}>
                <Image
                  src={img(item.src, 1200, 700)}
                  alt={item.label} fill unoptimized
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="580px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/50 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <div className="h-14 w-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(200,169,110,0.2)', backdropFilter: 'blur(8px)' }}>
                    <svg className="h-5 w-5 ml-0.5" style={{ color: '#fff' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span style={{
                    fontFamily: SANS, fontSize: '0.68rem', fontWeight: 600,
                    color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase',
                  }}>{item.label}</span>
                </div>
              </div>
            ))}

            <div className="shrink-0 w-[100px]" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="py-20 sm:py-28 lg:py-36 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="reveal text-center mb-16 md:mb-24">
            <span style={{
              fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
              fontWeight: 600, color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
            }}>Selected Films</span>
            <h2 className="mt-4" style={{
              fontFamily: DISPLAY, fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
            }}>Featured Work</h2>
          </div>

          <div className="space-y-16 md:space-y-24">
            {FEATURED.map((project, i) => {
              const isEven = i % 2 === 0
              return (
                <div key={i} className={`featured-card flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}>
                  <div className="relative w-full md:w-3/5 overflow-hidden group cursor-pointer"
                    style={{ aspectRatio: '16/9' }}>
                    <Image
                      src={img(project.image, 1200, 675)}
                      alt={project.title} fill unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 90vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-400"
                        style={{ backgroundColor: 'rgba(200,169,110,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(200,169,110,0.2)' }}>
                        <svg className="h-6 w-6 ml-0.5" style={{ color: '#fff' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className={`w-full md:w-2/5 ${isEven ? '' : 'md:text-right'}`}>
                    <span style={{
                      fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
                      fontWeight: 600, color: GOLD, letterSpacing: '0.35em', textTransform: 'uppercase',
                    }}>{project.category}</span>
                    <h3 className="mt-3" style={{
                      fontFamily: DISPLAY, fontSize: 'clamp(1.4rem, 2vw, 1.8rem)',
                      fontWeight: 300, fontStyle: 'italic', color: '#fff', lineHeight: 1.3,
                    }}>{project.title}</h3>
                    <p className="mt-4" style={{
                      fontFamily: SANS, fontSize: 'clamp(0.8rem, 0.88vw, 0.92rem)',
                      fontWeight: 300, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8,
                    }}>{project.desc}</p>
                    <div className={`mt-6 flex items-center gap-3 ${isEven ? '' : 'md:justify-end'}`}>
                      <span style={{
                        fontFamily: SANS, fontSize: '0.62rem', fontWeight: 600,
                        color: GOLD, letterSpacing: '0.25em', textTransform: 'uppercase',
                      }}>Watch Film</span>
                      <span className="inline-block h-px w-6" style={{ backgroundColor: GOLD }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="py-20 sm:py-28 lg:py-36 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="reveal mb-14">
            <span style={{
              fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
              fontWeight: 600, color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
            }}>What We Offer</span>
            <h2 className="mt-4" style={{
              fontFamily: DISPLAY, fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
            }}>Services</h2>
          </div>

          <div style={{ borderTop: '1px solid rgba(200,169,110,0.08)' }}>
            {SERVICES.map((service, i) => (
              <div key={i} className="svc-row group cursor-pointer"
                style={{ borderBottom: '1px solid rgba(200,169,110,0.08)' }}>
                <div className="py-6 lg:py-8 flex items-start lg:items-center justify-between gap-6 transition-all duration-300">
                  <div className="flex items-start lg:items-center gap-6 lg:gap-10 flex-1">
                    <span style={{
                      fontFamily: DISPLAY, fontSize: '0.85rem', fontWeight: 300,
                      fontStyle: 'italic', color: GOLD, opacity: 0.3,
                    }}>0{i + 1}</span>
                    <div className="flex-1">
                      <h3 className="transition-colors duration-300 group-hover:!text-white" style={{
                        fontFamily: DISPLAY, fontSize: 'clamp(1.15rem, 1.5vw, 1.4rem)',
                        fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)',
                      }}>{service.title}</h3>
                      <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-500 ease-out">
                        <p className="mt-3" style={{
                          fontFamily: SANS, fontSize: 'clamp(0.78rem, 0.84vw, 0.88rem)',
                          fontWeight: 300, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8,
                          maxWidth: '36rem',
                        }}>{service.desc}</p>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 mt-1 lg:mt-0 inline-flex h-10 w-10 items-center justify-center border transition-all duration-300 group-hover:border-[rgba(200,169,110,0.3)] group-hover:bg-[rgba(200,169,110,0.05)]"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <svg className="h-4 w-4 transition-all duration-300 group-hover:rotate-45"
                      style={{ color: 'rgba(255,255,255,0.2)' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section className="py-20 sm:py-28 lg:py-36">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16 md:mb-24">
            <div className="reveal">
              <span style={{
                fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
                fontWeight: 600, color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
              }}>Our Process</span>
            </div>
            <h2 className="reveal mt-4" style={{
              fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300, fontStyle: 'italic', color: '#fff',
            }}>From Script to <span style={{ color: GOLD }}>Screen</span></h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[38px] left-0 right-0 h-px" style={{ backgroundColor: 'rgba(200,169,110,0.1)' }} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
              {PROCESS.map((step, i) => (
                <div key={i} className="reveal relative">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative z-10 flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full"
                      style={{ border: `2px solid rgba(200,169,110,0.2)`, backgroundColor: BG }}>
                      <span style={{
                        fontFamily: DISPLAY, fontSize: '1.6rem', fontWeight: 300,
                        fontStyle: 'italic', color: GOLD,
                      }}>{step.num}</span>
                    </div>
                    {i < PROCESS.length - 1 && (
                      <div className="lg:hidden h-px flex-1" style={{ backgroundColor: 'rgba(200,169,110,0.1)' }} />
                    )}
                  </div>
                  <h3 style={{
                    fontFamily: DISPLAY, fontSize: 'clamp(1.2rem, 1.5vw, 1.4rem)',
                    fontWeight: 400, fontStyle: 'italic', color: '#fff',
                  }}>{step.title}</h3>
                  <p className="mt-3" style={{
                    fontFamily: SANS, fontSize: 'clamp(0.78rem, 0.84vw, 0.88rem)',
                    fontWeight: 300, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8,
                    maxWidth: '20rem',
                  }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-32 md:py-44 flex flex-col items-center justify-center text-center px-6">
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
            Let&rsquo;s bring your vision to life.
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
            <Link href="/production"
              className="inline-flex items-center px-10 py-4 transition-colors duration-300 hover:bg-white/[0.03]"
              style={{
                textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: SANS, fontSize: 'clamp(0.62rem, 0.7vw, 0.72rem)',
                fontWeight: 400, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.25em', textTransform: 'uppercase',
              }}>Back to Production</Link>
          </div>
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
              { label: 'Photography', href: '/production/photography' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="hover:!text-white/50 transition-colors duration-300"
                style={{
                  fontFamily: SANS, fontSize: '0.65rem', fontWeight: 400,
                  color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em',
                  textTransform: 'uppercase', textDecoration: 'none',
                }}>{label}</Link>
            ))}
          </div>
          <span style={{
            fontFamily: SANS, fontSize: '0.6rem', fontWeight: 300,
            color: 'rgba(255,255,255,0.15)', letterSpacing: '0.15em',
          }}>&copy; 2026</span>
        </div>
      </footer>
    </div>
  )
}
